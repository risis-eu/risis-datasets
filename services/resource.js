'use strict';
import {getEndpointParameters, getHTTPQuery, getHTTPGetURL} from './utils/helpers';
import {runMailTrigger, shouldTrigger} from './utils/triggers';
import {defaultGraphName, enableLogs, enableAuthentication, authGraphName, applicationsGraphName, enableEmailNotifications} from '../configs/general';
import ResourceQuery from './sparql/ResourceQuery';
import ResourceUtil from './utils/ResourceUtil';
import rp from 'request-promise';
import fs from 'fs';
import Log from 'log';
/*-------------log updates-------------*/
let log;
let user, accessLevel;
if(enableLogs){
    let currentDate = new Date().toDateString().replace(/\s/g, '-');
    let logPath = './logs/' + currentDate + '.log';
    if (fs.existsSync(logPath)) {
        //create a new file when restarting the server
        logPath = './logs/' + currentDate + '_' + Date.now() + '.log';
    }
    log = new Log('debug', fs.createWriteStream(logPath));
}
/*-------------config-------------*/
const outputFormat = 'application/sparql-results+json';
const headers = {'Accept': 'application/sparql-results+json'};
/*-----------------------------------*/
let endpointParameters, category, cGraphName, graphName, propertyURI, resourceURI, objectURI, objectValue, query, queryObject, utilObject, configurator, propertyPath, HTTPQueryObject;
queryObject = new ResourceQuery();
utilObject = new ResourceUtil();

export default {
    name: 'resource',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if (resource === 'resource.properties') {
            category = params.category;
            //SPARQL QUERY
            graphName = (params.dataset && params.dataset !== '0' ? decodeURIComponent(params.dataset) : 0);
            //graph name used for server settings and configs
            endpointParameters = getEndpointParameters(graphName);
            //overwrite graph name for the ones with default graph
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            resourceURI = params.resource;
            propertyPath = decodeURIComponent(params.propertyPath);
            if(propertyPath.length > 1){
                propertyPath = propertyPath.split(',');
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    //callback(null, {graphName: graphName, resourceURI: resourceURI, resourceType: '', currentCategory: 0, propertyPath: [], properties: [], config: {}});
                    //return 0;
                    user = {accountName: 'open'};
                }else{
                    user = req.user;
                }
            }else{
                user = {accountName: 'open'};
            }
            query = queryObject.getPrefixes() + queryObject.getProperties(cGraphName, resourceURI);
            // console.log(query);
            //build http uri
            //send request
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat)), headers: headers}).then(function(res){
                //exceptional case for user properties: we hide some admin props from normal users
                let {props, title, resourceType, rconfig} = utilObject.parseProperties(res, graphName, resourceURI, category, propertyPath);
                if(graphName === authGraphName[0] && !parseInt(user.isSuperUser)){
                    props = utilObject.deleteAdminProperties(props);
                }
                //------------------------------------
                callback(null, {
                    graphName: graphName,
                    resourceURI: resourceURI,
                    resourceType: resourceType,
                    title: title,
                    currentCategory: category,
                    propertyPath: propertyPath,
                    properties: props,
                    config: rconfig
                });
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {graphName: graphName, resourceURI: resourceURI, resourceType: '', title: '', currentCategory: 0, propertyPath: [], properties: [], config: {}});
            });
        } else if (resource === 'resource.objectProperties') {
            objectURI = params.objectURI;
            propertyURI = params.propertyURI;
            resourceURI = params.resourceURI;
            graphName = params.dataset;
            endpointParameters = getEndpointParameters(graphName);
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    //callback(null, {objectURI: objectURI, objectType: '', properties: []});
                    //return 0;
                    user = {accountName: 'open'};
                }else{
                    user = req.user;
                }
            }else{
                user = {accountName: 'open'};
            }
            query = queryObject.getPrefixes() + queryObject.getProperties(cGraphName, objectURI);
            //build http uri
            //send request
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat)), headers: headers}).then(function(res){
                let {props, objectType} = utilObject.parseObjectProperties(res, graphName, resourceURI, propertyURI);
                callback(null, {
                    objectURI: objectURI,
                    objectType: objectType,
                    properties: props
                });
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {objectURI: objectURI, objectType: '', properties: []});
            });
        } else if (resource === 'resource.userApplications') {
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {user: '', applications: []});
                    return 0;
                }else{
                    user = req.user;
                }
            }else{
                callback(null, {user: '', applications: []});
                return 0;
            }
            endpointParameters = getEndpointParameters(applicationsGraphName);
            query = queryObject.getPrefixes() + queryObject.getUserApplications(applicationsGraphName, user.id);
            // console.log(query);
            //build http uri
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //exceptional case for user properties: we hide some admin props from normal users
                let applications = utilObject.parseUserApplications(res);
                //------------------------------------
                callback(null, {
                    user: user.id,
                    applications: applications,
                });
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {user: '', applications: []});
            });
        }else if (resource === 'resource.datasetApplications') {
            graphName = decodeURIComponent(params.dataset);
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {dataset: graphName, applications: []});
                    return 0;
                }else{
                    user = req.user;
                }
            }else{
                callback(null, {dataset: graphName, applications: []});
                return 0;
            }
            endpointParameters = getEndpointParameters(applicationsGraphName);
            query = queryObject.getPrefixes() + queryObject.getDatasetApplications(applicationsGraphName, graphName);
            console.log(query);
            //build http uri
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //exceptional case for user properties: we hide some admin props from normal users
                let applications = utilObject.parseDatasetApplications(res);
                //------------------------------------
                callback(null, {
                    dataset: graphName,
                    applications: applications,
                });
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {dataset: graphName, applications: []});
            });
        }else if (resource === 'resource.allApplications') {
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {dataset: '', applications: []});
                    return 0;
                }else{
                    user = req.user;
                }
            }else{
                callback(null, {dataset: '', applications: []});
                return 0;
            }
            endpointParameters = getEndpointParameters(applicationsGraphName);
            if(parseInt(req.user.isSuperUser) || req.user.member.indexOf('http://rdf.risis.eu/user/PRB') !== -1 || req.user.member.indexOf('http://rdf.risis.eu/user/FCB') !== -1){
                //we show all the applications
                query = queryObject.getPrefixes() + queryObject.getAllApplications(applicationsGraphName);
            }else{
                if(req.user.member.indexOf('http://rdf.risis.eu/user/DatasetCoordinators') !==-1){
                    //we only show the applications for the corresponding Dataset
                    query = queryObject.getPrefixes() + queryObject.getDatasetsApplications(applicationsGraphName, user.editorOfGraph)
                }else{
                    //no access is given!
                    callback(null, {dataset: '', applications: []});
                }
            }
            // console.log(query);
            //build http uri
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //exceptional case for user properties: we hide some admin props from normal users
                let applications = utilObject.parseDatasetApplications(res);
                //------------------------------------
                callback(null, {
                    dataset: '',
                    applications: applications,
                });
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {dataset: '', applications: []});
            });
        }

    },
    // other methods
    create: (req, resource, params, body, config, callback) => {
        if (resource === 'resource.individualObject') {
            graphName = params.dataset;
            endpointParameters = getEndpointParameters(graphName);
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {category: params.category});
                    return 0;
                }else{
                    //check if user permitted to do the update action
                    user = req.user;
                    accessLevel = utilObject.checkAccess(user, params.dataset, params.resourceURI, params.propertyURI);
                    if(!accessLevel.access){
                        //action not allowed!
                        callback(null, {category: params.category});
                        return 0;
                    }
                }
            }else{
                user = {accountName: 'open'};
            }
            query = queryObject.getPrefixes() + queryObject.getAddTripleQuery(endpointParameters, cGraphName, params.resourceURI, params.propertyURI, params.objectValue, params.valueType, params.dataType);
            //build http uri
            //send request
            HTTPQueryObject = getHTTPQuery('update', query, endpointParameters, outputFormat);
            rp.post({uri: HTTPQueryObject.uri, form: HTTPQueryObject.params}).then(function(res){
                if(enableLogs){
                    log.info('\n User: ' + user.accountName + ' \n Query: \n' + query);
                }
                callback(null, {category: params.category});
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {category: params.category});
            });
        } else if (resource === 'resource.individualObjectDetail') {
            graphName = params.dataset;
            endpointParameters = getEndpointParameters(graphName);
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {category: params.category});
                    return 0;
                }else{
                    user = req.user;
                    accessLevel = utilObject.checkAccess(user, params.dataset, params.resourceURI, params.propertyURI);
                    if(!accessLevel.access){
                        //action not allowed!
                        callback(null, {category: params.category});
                        return 0;
                    }
                }
            }else{
                user = {accountName: 'open'};
            }
            query = queryObject.getPrefixes() + queryObject.getUpdateObjectTriplesForSesame(endpointParameters, cGraphName, params.resourceURI, params.propertyURI, params.oldObjectValue, params.newObjectValue, params.valueType, params.dataType, params.detailData);
            //we should add this resource into user's profile too
            if(enableAuthentication){
                query = query + queryObject.getAddTripleQuery(endpointParameters, authGraphName, user.id, 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOfResource', params.newObjectValue, 'uri', '');
            }
            //build http uri
            //send request
            HTTPQueryObject = getHTTPQuery('update', query, endpointParameters, outputFormat);
            rp.post({uri: HTTPQueryObject.uri, form: HTTPQueryObject.params}).then(function(res){
                if(enableLogs){
                    log.info('\n User: ' + user.accountName + ' \n Query: \n' + query);
                }
                callback(null, {category: params.category});
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {category: params.category});
            });
        }
    },
    update: (req, resource, params, body, config, callback) => {
        if (resource === 'resource.individualObject') {
            graphName = params.dataset;
            endpointParameters = getEndpointParameters(graphName);
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {category: params.category});
                    return 0;
                }else{
                    user = req.user;
                    accessLevel = utilObject.checkAccess(user, params.dataset, params.resourceURI, params.propertyURI);
                    if(!accessLevel.access){
                        //action not allowed!
                        callback(null, {category: params.category});
                        return 0;
                    }
                }
            }else{
                user = {accountName: 'open'};
            }
            query = queryObject.getPrefixes() + queryObject.getUpdateTripleQuery(endpointParameters, cGraphName, params.resourceURI, params.propertyURI, params.oldObjectValue, params.newObjectValue, params.valueType, params.dataType);
            //build http uri
            //send request
            HTTPQueryObject = getHTTPQuery('update', query, endpointParameters, outputFormat);
            rp.post({uri: HTTPQueryObject.uri, form: HTTPQueryObject.params}).then(function(res){
                if(enableLogs){
                    log.info('\n User: ' + user.accountName + ' \n Query: \n' + query);
                }
                if(enableEmailNotifications){
                    if(shouldTrigger(user.accountName, cGraphName, params.resourceURI, params.propertyURI, params.oldObjectValue, params.newObjectValue)){
                        //must trigger the right actions
                        //first get the FCB and PRB list
                        let notifList = [];
                        notifList.push({'type': 'FCB', 'firstName': 'Admin', 'mbox': 'datasets@risis.eu', 'username': 'admin'});
                        let queryEx = queryObject.getPrefixes() + queryObject.getFCBPRM(authGraphName) ;
                        rp.get({uri: getHTTPQuery('read', queryEx, endpointParameters, outputFormat)}).then(function(resEx){
                            notifList = utilObject.parseFCBPRB(resEx).concat(notifList);
                            //get Dataset coordintors
                            let queryEx2 = queryObject.getPrefixes() + queryObject.getDSOForApp(authGraphName, applicationsGraphName, params.resourceURI) ;
                            rp.get({uri: getHTTPQuery('read', queryEx2, endpointParameters, outputFormat)}).then(function(resEx2){
                                notifList = utilObject.parseDSOApp(resEx2).concat(notifList);
                                //get applicant
                                let queryEx3 = queryObject.getPrefixes() + queryObject.getUserForApp(authGraphName, applicationsGraphName, params.resourceURI) ;
                                rp.get({uri: getHTTPQuery('read', queryEx3, endpointParameters, outputFormat)}).then(function(resEx3){
                                    notifList = utilObject.parseAppUser(resEx3).concat(notifList);
                                    //handle the trigger here
                                    //console.log(notifList);
                                    if(enableLogs){
                                        log.info('\n Responsible User: ' + user.accountName + ' \n Notified Users: \n' + JSON.stringify(notifList) + ' \n Edited Property:' + params.propertyURI);
                                    }
                                    runMailTrigger(user.accountName, cGraphName, params.resourceURI, params.propertyURI, params.oldObjectValue, params.newObjectValue, notifList);
                                }).catch(function (err4) {
                                    console.log(err4);
                                    if(enableLogs){
                                        log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err4.statusCode + '\n Error Msg: \n' + err4.message);
                                    }
                                    callback(null, {category: params.category});
                                });
                            }).catch(function (err3) {
                                console.log(err3);
                                if(enableLogs){
                                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err3.statusCode + '\n Error Msg: \n' + err3.message);
                                }
                                callback(null, {category: params.category});
                            });
                            callback(null, {category: params.category});
                        }).catch(function (err2) {
                            console.log(err2);
                            if(enableLogs){
                                log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err2.statusCode + '\n Error Msg: \n' + err2.message);
                            }
                            callback(null, {category: params.category});
                        });
                    }else{
                        callback(null, {category: params.category});
                    }
                }else{
                    callback(null, {category: params.category});
                }
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {category: params.category});
            });
        } else if(resource === 'resource.individualObjectDetail'){
            graphName = params.dataset;
            endpointParameters = getEndpointParameters(graphName);
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {category: params.category});
                    return 0;
                }else{
                    user = req.user;
                    accessLevel = utilObject.checkAccess(user, params.dataset, params.resourceURI, params.propertyURI);
                    if(!accessLevel.access){
                        //action not allowed!
                        callback(null, {category: params.category});
                        return 0;
                    }
                    //check access for detail object
                    accessLevel = utilObject.checkAccess(user, params.dataset, params.oldObjectValue, '');
                    if(!accessLevel.access){
                        //action not allowed!
                        callback(null, {category: params.category});
                        return 0;
                    }
                }
            }else{
                user = {accountName: 'open'};
            }
            endpointParameters = getEndpointParameters(params.dataset);
            query = queryObject.getPrefixes() + queryObject.getUpdateObjectTriplesForSesame(endpointParameters, cGraphName, params.resourceURI, params.propertyURI, params.oldObjectValue, params.newObjectValue, params.valueType, params.dataType, params.detailData);
            //build http uri
            //send request
            HTTPQueryObject = getHTTPQuery('update', query, endpointParameters, outputFormat);
            rp.post({uri: HTTPQueryObject.uri, form: HTTPQueryObject.params}).then(function(res){
                if(enableLogs){
                    log.info('\n User: ' + user.accountName + ' \n Query: \n' + query);
                }
                callback(null, {category: params.category});
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {category: params.category});
            });
        } else if(resource === 'resource.aggObject'){
            graphName = params.dataset;
            endpointParameters = getEndpointParameters(graphName);
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {category: params.category});
                    return 0;
                }else{
                    user = req.user;
                    accessLevel = utilObject.checkAccess(user, params.dataset, params.resourceURI, params.propertyURI);
                    if(!accessLevel.access){
                        //action not allowed!
                        callback(null, {category: params.category});
                        return 0;
                    }
                }
            }else{
                user = {accountName: 'open'};
            }
            query = queryObject.getPrefixes() + queryObject.getUpdateTriplesQuery(endpointParameters, cGraphName, params.resourceURI, params.propertyURI, params.changes);
            //build http uri
            //send request
            HTTPQueryObject = getHTTPQuery('update', query, endpointParameters, outputFormat);
            rp.post({uri: HTTPQueryObject.uri, form: HTTPQueryObject.params}).then(function(res){
                if(enableLogs){
                    log.info('\n User: ' + user.accountName + ' \n Query: \n' + query);
                }
                callback(null, {category: params.category});
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {category: params.category});
            });
        }
    },
    delete: (req, resource, params, config, callback) => {
        if (resource === 'resource.individualObject') {
            graphName = params.dataset;
            endpointParameters = getEndpointParameters(graphName);
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {category: params.category});
                    return 0;
                }else{
                    user = req.user;
                    accessLevel = utilObject.checkAccess(user, params.dataset, params.resourceURI, params.propertyURI);
                    if(!accessLevel.access){
                        //action not allowed!
                        callback(null, {category: params.category});
                        return 0;
                    }
                }
            }else{
                user = {accountName: 'open'};
            }
            query = queryObject.getPrefixes() + queryObject.getDeleteTripleQuery(endpointParameters, cGraphName, params.resourceURI, params.propertyURI, params.objectValue, params.valueType, params.dataType);
            //build http uri
            //send request
            HTTPQueryObject = getHTTPQuery('update', query, endpointParameters, outputFormat);
            rp.post({uri: HTTPQueryObject.uri, form: HTTPQueryObject.params}).then(function(res){
                if(enableLogs){
                    log.info('\n User: ' + user.accountName + ' \n Query: \n' + query);
                }
                callback(null, {category: params.category});
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {category: params.category});
            });
        } else if(resource === 'resource.aggObject') {
            graphName = params.dataset;
            endpointParameters = getEndpointParameters(graphName);
            cGraphName = graphName;
            if(endpointParameters.useDefaultGraph){
                cGraphName = 0;
            }
            //control access on authentication
            if(enableAuthentication){
                if(!req.user){
                    callback(null, {category: params.category});
                }else{
                    user = req.user;
                    accessLevel = utilObject.checkAccess(user, params.dataset, params.resourceURI, params.propertyURI);
                    if(!accessLevel.access){
                        //action not allowed!
                        callback(null, {category: params.category});
                    }
                }
            }else{
                user = {accountName: 'open'};
            }
            query = queryObject.getPrefixes() + queryObject.getDeleteTriplesQuery(endpointParameters, cGraphName, params.resourceURI, params.propertyURI, params.changes);
            //build http uri
            //send request
            HTTPQueryObject = getHTTPQuery('update', query, endpointParameters, outputFormat);
            rp.post({uri: HTTPQueryObject.uri, form: HTTPQueryObject.params}).then(function(res){
                if(enableLogs){
                    log.info('\n User: ' + user.accountName + ' \n Query: \n' + query);
                }
                callback(null, {category: params.category});
            }).catch(function (err) {
                console.log(err);
                if(enableLogs){
                    log.error('\n User: ' + user.accountName + '\n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                }
                callback(null, {category: params.category});
            });
        }
    }
};
