var generalConfig = require('../../configs/general');
var rp = require('request-promise');
var helper = require('../authentication/auth-helper');
var config = require('../../configs/server');
var handleEmail = require('../email/handleEmail');
var httpOptions, g;
if(config.sparqlEndpoint[generalConfig.applicationsGraphName[0]]){
    g = generalConfig.applicationsGraphName[0];
}else{
    //go for generic SPARQL endpoint
    g = 'generic';
}
httpOptions = {
  host: config.sparqlEndpoint[g].host,
  port: config.sparqlEndpoint[g].port,
  path: config.sparqlEndpoint[g].path
};
var outputFormat = 'application/sparql-results+json';
var appShortTitle = generalConfig.appShortTitle;
var appFullTitle = generalConfig.appFullTitle;
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    os = require('os');
var Busboy = require('busboy');
module.exports = function handleUpload(server) {
     server.get('/accessRequest/:name', function(req, res) {
         if(!req.isAuthenticated()){
             res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user });
         }else{
             var endpoint = helper.getEndpointParameters([generalConfig.applicationsGraphName[0]]);
             var datasetURI = 'http://rdf.risis.eu/dataset/'+req.params.name+'/1.0/void.ttl#';
             var resourceURI = 'http://rdf.risis.eu/dataset/'+req.params.name+'/1.0/void.ttl#' + req.params.name+ '_rdf_dataset';
             //get details of the dataset
             var query = '\
             PREFIX risisV: <http://rdf.risis.eu/metadata/> \
             PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
             PREFIX void: <http://rdfs.org/ns/void#> \
             PREFIX dcterms: <http://purl.org/dc/terms/> \
             SELECT ?s ?title ?accessRequestForm ?nonDisclosureAgreement FROM <'+datasetURI+'> WHERE { \
                 ?s a void:Dataset . \
                 ?s dcterms:title ?title . \
                 OPTIONAL {?s risisV:accessRequestForm ?accessRequestForm .} \
                 OPTIONAL {?s risisV:nonDisclosureAgreement ?nonDisclosureAgreement .} \
             }';
            var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
            rp.get({uri: rpPath}).then(function(resq){
                var parsed = JSON.parse(resq);
                var dataset = {};
                var output=[];
                if(parsed.results.bindings.length){
                  parsed.results.bindings.forEach(function(el) {
                      dataset = {title: el.title.value, aForm: el.accessRequestForm ? (el.accessRequestForm.value === 'not applicable' ? '' : el.accessRequestForm.value) : '', ndaForm: el.nonDisclosureAgreement ? (el.nonDisclosureAgreement.value === 'not applicable' ? '' : el.nonDisclosureAgreement.value) : ''}
                  });
                }
                 res.render('accessRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name, user: req.user, graphName: encodeURIComponent(req.user.graphName), resourceURI: encodeURIComponent(req.user.id), dataset: dataset} );
            }).catch(function (err2) {
                console.log(err2);
                 res.render('accessRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name, user: req.user, graphName: encodeURIComponent(req.user.graphName), resourceURI: encodeURIComponent(req.user.id), dataset: {}});
            });
         }
     });

     server.get('/visitRequest/:name', function(req, res) {
        if(!req.isAuthenticated()){
            res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user });
        }else{
            var endpoint = helper.getEndpointParameters([generalConfig.applicationsGraphName[0]]);
            var datasetURI = 'http://rdf.risis.eu/dataset/'+req.params.name+'/1.0/void.ttl#';
            var resourceURI = 'http://rdf.risis.eu/dataset/'+req.params.name+'/1.0/void.ttl#' + req.params.name+ '_rdf_dataset';
            //get details of the dataset
            var query = '\
            PREFIX risisV: <http://rdf.risis.eu/metadata/> \
            PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
            PREFIX void: <http://rdfs.org/ns/void#> \
            PREFIX dcterms: <http://purl.org/dc/terms/> \
            SELECT ?s ?title ?visitRequestForm FROM <'+datasetURI+'> WHERE { \
                ?s a void:Dataset . \
                ?s dcterms:title ?title . \
                OPTIONAL {?s risisV:visitRequestForm ?visitRequestForm .} \
            }';
           var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
           rp.get({uri: rpPath}).then(function(resq){
               var parsed = JSON.parse(resq);
               var dataset = {};
               var output=[];
               if(parsed.results.bindings.length){
                 parsed.results.bindings.forEach(function(el) {
                     dataset = {title: el.title.value, vForm: el.visitRequestForm ? (el.visitRequestForm.value === 'not applicable' ? '' : el.visitRequestForm.value) : ''}
                 });
               }
                res.render('visitRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name, user: req.user, graphName: encodeURIComponent(req.user.graphName), resourceURI: encodeURIComponent(req.user.id), dataset: dataset} );
           }).catch(function (err2) {
               console.log(err2);
                res.render('visitRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name, user: req.user, graphName: encodeURIComponent(req.user.graphName), resourceURI: encodeURIComponent(req.user.id), dataset: {}});
           });
        }
     });
     server.post('/accessRequest/:name', function (req, res) {
         if(!req.isAuthenticated()){
             res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user});
         }else{
             var fields = [];
             var error = '';
             var busboy = new Busboy({ headers: req.headers, limits: {fileSize: 500* 1024} });
             busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                 if(filename){
                     var fname = req.params.name + '_' + fieldname + '_' + Date.now()+ '.pdf';
                     var saveTo = path.join('./uploaded/', fname);
                     file.pipe(fs.createWriteStream(saveTo));
                     fields[fieldname] = saveTo;
                 }else{
                     error = error + ' missing value for "' + fieldname +'"';
                     file.resume();
                 }
             });
             busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
                 if(!val){
                    error = error + ' missing value for "' + fieldname +'"';
                }
                fields[fieldname] = val;
               //console.log('Field [' + fieldname + ']: value: ' + val);
             });
             busboy.on('finish', function() {
                 if(error){
                     res.render('accessRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name, user: req.user, graphName: encodeURIComponent(req.user.graphName), resourceURI: encodeURIComponent(req.user.id), data: fields, errorMsg: 'Error... '+error});
                 }else{
                     //store data into the triple store
                     var endpoint = helper.getEndpointParameters([generalConfig.applicationsGraphName[0]]);
                     var datasetURI = 'http://rdf.risis.eu/dataset/'+req.params.name+'/1.0/void.ttl#';
                     var rnd = Math.round(+new Date() / 1000);
                     var applicationURI = generalConfig.baseResourceDomain + '/application/' + rnd;
                     var date = new Date();
                     var currentDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
                     let ndaForm = 'not applicable';
                     if(fields.ndaForm){
                        ndaForm = fields.ndaForm;
                     }
                     var query = '';
                     var query2 = '';
                     if(endpoint.type === 'sesame'){
                         /*jshint multistr: true */
                         query = '\
                         PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                         PREFIX risis: <http://risis.eu/> \
                         PREFIX risisV: <http://rdf.risis.eu/application/> \
                         PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
                         PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
                         PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                         PREFIX dcterms: <http://purl.org/dc/terms/> \
                         INSERT DATA { GRAPH <'+ generalConfig.applicationsGraphName[0] +'> { \
                             <'+ applicationURI + '> a risisV:AccessRequestApplication; risisV:status "submitted" ; risisV:commentOnDecision "-" ; risisV:dataRequested """'+fields.dataRequested+'"""; risisV:purposeOfUse """'+fields.purposeOfUse+'"""; risisV:technicalSpecification """'+fields.technicalSpecification+'"""; dcterms:created "' + currentDate + '"^^xsd:dateTime; risisV:ndaForm """'+ndaForm+'"""; risisV:applicant <'+req.user.id+'>;risisV:dataset <'+datasetURI+'>. \
                         }} \
                             ';
                             //todo: write query2 for sesame!
                     }else{
                         /*jshint multistr: true */
                         query = '\
                         PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                         PREFIX risis: <http://risis.eu/> \
                         PREFIX risisV: <http://rdf.risis.eu/application/> \
                         PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
                         PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
                         PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                         PREFIX dcterms: <http://purl.org/dc/terms/> \
                         INSERT DATA INTO <'+ generalConfig.applicationsGraphName[0] +'> { \
                         <'+ applicationURI + '> a risisV:AccessRequestApplication; risisV:status "submitted"; risisV:commentOnDecision "-" ; risisV:dataRequested """'+fields.dataRequested+'"""; risisV:purposeOfUse """'+fields.purposeOfUse+'"""; risisV:technicalSpecification """'+fields.technicalSpecification+'"""; dcterms:created "' + currentDate + '"^^xsd:dateTime; risisV:ndaForm """'+ndaForm+'"""; risisV:applicant <'+req.user.id+'>;risisV:dataset <'+datasetURI+'>. \
                         } \
                         ';

                         //we need to  give permission to dataset owner to edit the application
                         /*jshint multistr: true */
                         query2 = '\
                         PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                         INSERT INTO <' + generalConfig.authGraphName[0] + '> { \
                            ?user ldr:editorOfResource <' + applicationURI + '> . \
                          } \
                         WHERE { \
                            ?user ldr:editorOfGraph <'+datasetURI+'> . \
                          } \
                         ';
                     }
                     var rpPath = helper.getHTTPQuery('update', query, endpoint, outputFormat);
                     rp.post({uri: rpPath}).then(function(){
                         console.log('Application is created!');
                         rp.post({uri: helper.getHTTPQuery('update', query2, endpoint, outputFormat)}).then(function(){
                             //send email notifications
                             if(generalConfig.enableEmailNotifications){
                                 //todo: put the right receipants
                                handleEmail.sendMail('accessVisitRequest', req.user.mbox, 'datasets@risis.eu', 'New Access Request to ' + req.params.name, 'please check out the RISIS Datasets Portal: http://datasets.risis.eu/ \n There is a new access request to "'+req.params.name+'".', 'please check out the RISIS Datasets Portal: http://datasets.risis.eu/ \n There is a new access request to "'+req.params.name+'".');
                             }
                             return res.redirect('/');
                         }).catch(function (err22) {
                             console.log(err22);
                         });
                     }).catch(function (err2) {
                         console.log(err2);
                     });
                 }
             });
             req.pipe(busboy);
             /*
             busboy.on('filesLimit',function(){
                 error = error + ' file is too large! Max size is 500KB';
                 console.log(error);
             });
             */
         }
    });
     server.post('/visitRequest/:name', function (req, res) {
         if(!req.isAuthenticated()){
             res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user});
         }else{
             var fields = [];
             var error = '';
             var busboy = new Busboy({ headers: req.headers, limits: {fileSize: 500* 1024} });
             busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                 if(filename){
                     var fname = req.params.name + '_' + fieldname + '_' + Date.now()+ '.pdf';
                     var saveTo = path.join('./uploaded/', fname);
                     file.pipe(fs.createWriteStream(saveTo));
                     fields[fieldname] = saveTo;
                 }else{
                     error = error + ' missing value for "' + fieldname +'"';
                     file.resume();
                 }
             });
             busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
                 if(!val && fieldname !== 'budgetRemarks'){
                    error = error + ' missing value for "' + fieldname +'"';
                }
                fields[fieldname] = val;
               //console.log('Field [' + fieldname + ']: value: ' + val);
             });
             busboy.on('finish', function() {
                 if(error){
                     res.render('visitRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name, user: req.user, graphName: encodeURIComponent(req.user.graphName), resourceURI: encodeURIComponent(req.user.id), data: fields, errorMsg: 'Error... '+error});
                 }else{
                     //store data into the triple store
                     var endpoint = helper.getEndpointParameters([generalConfig.applicationsGraphName[0]]);
                     var datasetURI = 'http://rdf.risis.eu/dataset/'+req.params.name+'/1.0/void.ttl#';
                     var rnd = Math.round(+new Date() / 1000);
                     var applicationURI = generalConfig.baseResourceDomain + '/application/' + rnd;
                     var date = new Date();
                     var currentDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
                     var query = '';
                     var query2 = '';
                     if(endpoint.type === 'sesame'){
                         /*jshint multistr: true */
                         query = '\
                         PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                         PREFIX risis: <http://risis.eu/> \
                         PREFIX risisV: <http://rdf.risis.eu/application/> \
                         PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
                         PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
                         PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                         PREFIX dcterms: <http://purl.org/dc/terms/> \
                         INSERT DATA { GRAPH <'+ generalConfig.applicationsGraphName[0] +'> { \
                             <'+ applicationURI + '> a risisV:VisitRequestApplication; risisV:status "submitted" ; risisV:commentOnDecision "-"; risisV:projectTitle """'+fields.projectTitle+'"""; risisV:projectSummary """'+fields.projectSummary+'"""; risisV:hostingLocation """'+fields.hostingLocation+'"""; risisV:prefferedVisitDates """'+fields.prefferedVisitDates+'"""; risisV:visitDuration """'+fields.visitDuration+'"""; dcterms:created "' + currentDate + '"^^xsd:dateTime; risisV:travelBudget """'+fields.travelBudget+'"""; risisV:accommodationBudget """'+fields.accommodationBudget+'"""; risisV:totalBudget """'+fields.totalBudget+'""";  risisV:budgetRemarks """'+fields.budgetRemarks+'"""; risisV:projectDescAnnex """'+fields.projectDescAnnex+'"""; risisV:cvAnnex """'+fields.cvAnnex+'"""; risisV:applicant <'+req.user.id+'>;risisV:dataset <'+datasetURI+'>. \
                         }} \
                             ';
                             //todo: write query2 for sesame!
                     }else{
                         /*jshint multistr: true */
                         query = '\
                         PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                         PREFIX risis: <http://risis.eu/> \
                         PREFIX risisV: <http://rdf.risis.eu/application/> \
                         PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
                         PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
                         PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                         PREFIX dcterms: <http://purl.org/dc/terms/> \
                         INSERT DATA INTO <'+ generalConfig.applicationsGraphName[0] +'> { \
                         <'+ applicationURI + '> a risisV:VisitRequestApplication; risisV:status "submitted"; risisV:commentOnDecision "-" ; risisV:projectTitle """'+fields.projectTitle+'"""; risisV:projectSummary """'+fields.projectSummary+'"""; risisV:hostingLocation """'+fields.hostingLocation+'"""; risisV:prefferedVisitDates """'+fields.prefferedVisitDates+'"""; risisV:visitDuration """'+fields.visitDuration+'"""; dcterms:created "' + currentDate + '"^^xsd:dateTime; risisV:travelBudget """'+fields.travelBudget+'"""; risisV:accommodationBudget """'+fields.accommodationBudget+'"""; risisV:totalBudget """'+fields.totalBudget+'""";  risisV:budgetRemarks """'+fields.budgetRemarks+'"""; risisV:projectDescAnnex """'+fields.projectDescAnnex+'"""; risisV:cvAnnex """'+fields.cvAnnex+'"""; risisV:applicant <'+req.user.id+'>;risisV:dataset <'+datasetURI+'>. \
                         } \
                         ';

                         //we need to  give permission to dataset owner to edit the application
                         /*jshint multistr: true */
                         query2 = '\
                         PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                         INSERT INTO <' + generalConfig.authGraphName[0] + '> { \
                            ?user ldr:editorOfResource <' + applicationURI + '> . \
                          } \
                         WHERE { \
                            ?user ldr:editorOfGraph <'+datasetURI+'> . \
                          } \
                         ';
                     }
                     var rpPath = helper.getHTTPQuery('update', query, endpoint, outputFormat);
                     rp.post({uri: rpPath}).then(function(){
                         console.log('Application is created!');
                         rp.post({uri: helper.getHTTPQuery('update', query2, endpoint, outputFormat)}).then(function(){
                             //send email notifications
                             if(generalConfig.enableEmailNotifications){
                                 //todod: get the contact address of the corresponding dataset holder
                                 handleEmail.sendMail('datasetVisitRequest', req.user.mbox, 'datasets@risis.eu', 'New Visit Request to ' + req.params.name, 'please check out the RISIS Datasets Portal: http://datasets.risis.eu/ \n There is a new visit request to "'+req.params.name+'".', 'please check out the RISIS Datasets Portal: http://datasets.risis.eu/ \n There is a new visit request to "'+req.params.name+'".');
                             }
                             return res.redirect('/');
                         }).catch(function (err22) {
                             console.log(err22);
                         });
                     }).catch(function (err2) {
                         console.log(err2);
                     });
                 }
             });
             req.pipe(busboy);
             /*
             busboy.on('filesLimit',function(){
                 error = error + ' file is too large! Max size is 500KB';
                 console.log(error);
             });
             */
         }
    });
};
