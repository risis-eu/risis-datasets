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
     server.post('/uploadFile/:name?/:limit?', function (req, res) {
        //console.log(req.files.file);
        var fname = 'noName' + '_' + Date.now();
        if(req.params.name){
            fname = req.params.name;
        }
        var limit = 500 ; //KB
        if(req.params.limit){
            limit = parseInt(req.params.limit);
        }
        if(req.files.file.size > (limit * 1024)){
            res.end("file is too big!!");
            console.log('file size too big: ' + req.files.file.size);
        }else{
            var saveTo = path.join('./uploaded/', fname);
            var fileStream = fs.createWriteStream(saveTo);
            fileStream.write(req.files.file.data);
            fileStream.end();
            fileStream.on('error', function (err) {
                res.end("error in upload!");
                console.log("error", err);
            });
            fileStream.on('finish', function (res2) {
                res.end("upload completed!");
            });
        }
     });
     server.post('/accessRequest/:name', function (req, res) {
        if(!req.isAuthenticated()){
             res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user});
        }else{
            var error = '';
            for(var prop in req.body){
                 if(!req.body[prop]){
                    error = error + ' missing value for "' + prop +'"';
                }
            }
            if(!req.files.ndaForm || !req.files.ndaForm.size){
                error = error + ' missing value for "NDA Form"';
            }else{
                if(req.files.ndaForm.size > (500 * 1024)){
                    error = error + ' file size > 500KB ! ';
                }
            }
            if(!error){
                var fname = req.params.name + '_ndaForm_' + Date.now()+ '.pdf';
                var saveTo = path.join('./uploaded/', fname);
                var fileStream = fs.createWriteStream(saveTo);
                fileStream.write(req.files.ndaForm.data);
                fileStream.end();
                fileStream.on('error', function (err) {
                    res.end("error in upload!");
                    console.log("error", err);
                });
                fileStream.on('finish', function (res2) {
                 });
                 //store data into the triple store
                 var endpoint = helper.getEndpointParameters([generalConfig.applicationsGraphName[0]]);
                 var datasetURI = 'http://rdf.risis.eu/dataset/'+req.params.name+'/1.0/void.ttl#';
                 var rnd = Math.round(+new Date() / 1000);
                 var applicationURI = generalConfig.baseResourceDomain + '/application/' + rnd;
                 var date = new Date();
                 var currentDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
                 let ndaForm = 'uploaded/'+fname;
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
                         <'+ applicationURI + '> a risisV:AccessRequestApplication; risisV:decisionDSOA "not decided yet" ; risisV:commentOnDecision "--" ; risisV:dataRequested """'+req.body.dataRequested+'"""; risisV:purposeOfUse """'+req.body.purposeOfUse+'"""; risisV:technicalSpecification """'+req.body.technicalSpecification+'"""; dcterms:created "' + currentDate + '"^^xsd:dateTime; risisV:ndaForm """'+ndaForm+'"""; risisV:applicant <'+req.user.id+'>;risisV:dataset <'+datasetURI+'>. \
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
                     <'+ applicationURI + '> a risisV:AccessRequestApplication; risisV:decisionDSOA "not decided yet" ; risisV:commentOnDecision "--" ; risisV:dataRequested """'+req.body.dataRequested+'"""; risisV:purposeOfUse """'+req.body.purposeOfUse+'"""; risisV:technicalSpecification """'+req.body.technicalSpecification+'"""; dcterms:created "' + currentDate + '"^^xsd:dateTime; risisV:ndaForm """'+ndaForm+'"""; risisV:applicant <'+req.user.id+'>;risisV:dataset <'+datasetURI+'>. \
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
                             /*jshint multistr: true */
                             var query3 = '\
                             PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                             PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                             SELECT DISTINCT ?username ?firstName ?mbox FROM <' + generalConfig.authGraphName[0] + '> WHERE { \
                                ?user ldr:editorOfGraph <' + datasetURI + '> ; \
                                      foaf:mbox ?mbox ; \
                                      foaf:firstName ?firstName; \
                                      foaf:accountName ?username . \
                              } \
                             ';
                             var ntfusers= [];
                             ntfusers.push({'type': 'FCB', 'firstName': 'Admin', 'mbox': 'datasets@risis.eu', 'username': 'admin'});
                             rp.post({uri: helper.getHTTPQuery('read', query3, endpoint, outputFormat)}).then(function(res3){
                                 var parsed = JSON.parse(res3);
                                 if(parsed.results.bindings.length){
                                   parsed.results.bindings.forEach(function(el) {
                                       ntfusers.push({'type': 'DSO', 'firstName': el.firstName.value, 'mbox': el.mbox.value, 'username': el.username.value})
                                   });
                                 }
                                 ntfusers.forEach(function(el) {
                                     var etext = 'Dear '+ el.firstName +',\n There is a new access request for "'+req.params.name+'" dataset. Please sign in to RISIS Datasets Portal with your username ('+el.username+'): \n \n http://datasets.risis.eu/ \n \n and check the applications list for further information. \n \n -- on behalf of RISIS Datasets Portal';
                                     //console.log(etext);
                                     handleEmail.sendMail('datasetAccessRequest', 'datasets@risis.eu', el.mbox, 'RISIS ['+el.type +'] New Access Request to ' + req.params.name, etext, etext);
                                 });
                             }).catch(function (err3) {
                                 console.log(err3);
                             });
                         }
                         return res.redirect('/');
                     }).catch(function (err22) {
                         console.log(err22);
                     });
                 }).catch(function (err2) {
                     console.log(err2);
                 });

            }else{
                res.render('accessRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name, user: req.user, graphName: encodeURIComponent(req.user.graphName), resourceURI: encodeURIComponent(req.user.id), data: req.body, errorMsg: 'Error... '+error});
            }

        }
    });
     server.post('/visitRequest/:name', function (req, res) {
         if(!req.isAuthenticated()){
             res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user});
         }else{
            var error = '';
            for(var prop in req.body){
                  if(!req.body[prop] && prop!=='budgetRemarks'){
                     error = error + ' missing value for "' + prop +'"';
                 }
             }
            if(!req.files.cvAnnex || !req.files.cvAnnex.size){
                 error = error + ' missing value for "CV"';
            }else{
                 if(req.files.cvAnnex.size > (500 * 1024) || (req.files.projectDescAnnex && req.files.projectDescAnnex.size > (500 * 1024))){
                     error = error + ' file size > 500KB ! ';
                 }
            }
            if(!error){
                var fname = req.params.name + '_cvAnnex_' + Date.now()+ '.pdf';
                var saveTo = path.join('./uploaded/', fname);
                var fileStream = fs.createWriteStream(saveTo);
                fileStream.write(req.files.cvAnnex.data);
                fileStream.end();
                fileStream.on('error', function (err) {
                    res.end("error in upload!");
                    console.log("error", err);
                });
                fileStream.on('finish', function (res2) {
                 });
                let cvAnnex = 'uploaded/'+fname;
                let projectDescAnnex = 'not added';
                if(req.files.projectDescAnnex.size){
                     var fname2 = req.params.name + '_projectDescAnnex_' + Date.now()+ '.pdf';
                     var saveTo2 = path.join('./uploaded/', fname2);
                     var fileStream2 = fs.createWriteStream(saveTo2);
                     fileStream2.write(req.files.projectDescAnnex.data);
                     fileStream2.end();
                     fileStream2.on('error', function (err) {
                         res.end("error in upload!");
                         console.log("error", err);
                     });
                     fileStream2.on('finish', function (res2) {
                      });
                      projectDescAnnex = 'uploaded/'+fname2;
                }
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
                        <'+ applicationURI + '> a risisV:VisitRequestApplication; risisV:decisionDSO "not decided yet" ; risisV:decisionPRB "not decided yet" ; risisV:decisionFCB "not decided yet" ; risisV:evaluationDSO "not added yet" ; risisV:evaluationPRB "not added yet" ; risisV:dataRequested """'+req.body.dataRequested+'"""; risisV:projectTitle """'+req.body.projectTitle+'"""; risisV:projectSummary """'+req.body.projectSummary+'"""; risisV:hostingLocation """'+req.body.hostingLocation+'"""; risisV:prefferedVisitDates """'+req.body.prefferedVisitDates+'"""; risisV:visitDuration """'+req.body.visitDuration+'"""; dcterms:created "' + currentDate + '"^^xsd:dateTime; risisV:travelBudget """'+req.body.travelBudget+'"""; risisV:accommodationBudget """'+req.body.accommodationBudget+'"""; risisV:totalBudget """'+req.body.totalBudget+'""";  risisV:budgetRemarks """'+req.body.budgetRemarks+'"""; risisV:projectDescAnnex """'+projectDescAnnex+'"""; risisV:cvAnnex """'+cvAnnex+'"""; risisV:applicant <'+req.user.id+'>;risisV:dataset <'+datasetURI+'>. \
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
                    <'+ applicationURI + '> a risisV:VisitRequestApplication; risisV:decisionDSO "not decided yet" ; risisV:decisionPRB "not decided yet" ; risisV:decisionFCB "not decided yet" ; risisV:evaluationDSO "not added yet" ; risisV:evaluationPRB "not added yet" ; risisV:dataRequested """'+req.body.dataRequested+'"""; risisV:projectTitle """'+req.body.projectTitle+'"""; risisV:projectSummary """'+req.body.projectSummary+'"""; risisV:scientificBg """'+req.body.scientificBg+'"""; risisV:isNewUserOfData """'+req.body.isNewUserOfData+'"""; risisV:isProjectLeader """'+req.body.isProjectLeader+'"""; risisV:isVirtualUser """'+req.body.isVirtualUser+'"""; risisV:hostingLocation """'+req.body.hostingLocation+'"""; risisV:prefferedVisitDates """'+req.body.prefferedVisitDates+'"""; risisV:visitDuration """'+req.body.visitDuration+'"""; dcterms:created "' + currentDate + '"^^xsd:dateTime; risisV:travelBudget """'+req.body.travelBudget+'"""; risisV:accommodationBudget """'+req.body.accommodationBudget+'"""; risisV:totalBudget """'+req.body.totalBudget+'""";  risisV:budgetRemarks """'+req.body.budgetRemarks+'"""; risisV:projectDescAnnex """'+projectDescAnnex+'"""; risisV:cvAnnex """'+cvAnnex+'"""; risisV:applicant <'+req.user.id+'>;risisV:dataset <'+datasetURI+'>. \
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
                            /*jshint multistr: true */
                            var query3 = '\
                            PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                            PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                            SELECT DISTINCT ?username ?firstName ?mbox FROM <' + generalConfig.authGraphName[0] + '> WHERE { \
                               ?user ldr:editorOfGraph <' + datasetURI + '> ; \
                                     foaf:mbox ?mbox ; \
                                     foaf:firstName ?firstName; \
                                     foaf:accountName ?username . \
                             } \
                            ';
                            var ntfusers= [];
                            ntfusers.push({'type': 'FCB', 'firstName': 'Admin', 'mbox': 'datasets@risis.eu', 'username': 'admin'});
                            rp.post({uri: helper.getHTTPQuery('read', query3, endpoint, outputFormat)}).then(function(res3){
                                var parsed = JSON.parse(res3);
                                if(parsed.results.bindings.length){
                                  parsed.results.bindings.forEach(function(el) {
                                      ntfusers.push({'type': 'DSO', 'firstName': el.firstName.value, 'mbox': el.mbox.value, 'username': el.username.value})
                                  });
                                }
                                //check FCB users now
                                /*jshint multistr: true */
                                var query4 = '\
                                PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                                SELECT DISTINCT ?username ?firstName ?mbox FROM <' + generalConfig.authGraphName[0] + '> WHERE { \
                                   ?user foaf:member <http://rdf.risis.eu/user/FCB> ; \
                                         foaf:mbox ?mbox ; \
                                         foaf:firstName ?firstName; \
                                         foaf:accountName ?username . \
                                 } \
                                ';
                                rp.post({uri: helper.getHTTPQuery('read', query4, endpoint, outputFormat)}).then(function(res4){
                                    var parsed = JSON.parse(res4);
                                    if(parsed.results.bindings.length){
                                      parsed.results.bindings.forEach(function(el) {
                                          ntfusers.push({'type': 'FCB', 'firstName': el.firstName.value, 'mbox': el.mbox.value, 'username': el.username.value})
                                      });
                                    }
                                    //console.log(ntfusers);
                                    ntfusers.forEach(function(el) {
                                        var etext = '';
                                        if(el.type === 'DSO'){
                                            etext = 'Dear '+ el.firstName +',\n There is a new visit request for "'+req.params.name+'" dataset. Please sign in to RISIS Datasets Portal with your username ('+el.username+'): \n \n http://datasets.risis.eu/ \n \n and check the applications list for further information. \n \n on behalf of RISIS Datasets Portal';
                                        } else{
                                            if(el.type === 'FCB'){
                                                etext = 'Dear '+ el.firstName +',\n There is a new visit request for "'+req.params.name+'"  dataset. Please sign in to RISIS Datasets Portal with your username ('+el.username+'): \n \n http://datasets.risis.eu/ \n \n and check the applications list for further information. \n \n -- on behalf of RISIS Datasets Portal';
                                            }
                                        }
                                        //console.log(etext);
                                        handleEmail.sendMail('datasetVisitRequest', 'datasets@risis.eu', el.mbox, 'RISIS ['+el.type +'] New Visit Request to ' + req.params.name, etext, etext);
                                    });
                                }).catch(function (err4) {
                                    console.log(err4);
                                });

                            }).catch(function (err3) {
                                console.log(err3);
                            });
                        }
                        return res.redirect('/');
                    }).catch(function (err22) {
                        console.log(err22);
                    });
                }).catch(function (err2) {
                    console.log(err2);
                });
            }else{
                res.render('visitRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name, user: req.user, graphName: encodeURIComponent(req.user.graphName), resourceURI: encodeURIComponent(req.user.id), data: req.body, errorMsg: 'Error... '+error});
            }

         }
    });
};
