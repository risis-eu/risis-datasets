'use strict';
var baseHost = 'http://datasets.risis.eu';
//required for authentication
var helper = require('./auth-helper');
var moment = require('moment');
var salt1 = 'ewrgkdgerg5463453fdfg2956734rt65';
var salt2 = 'ntr345egsdfg57597543egdgs456g87';
var passwordHash = require('password-hash');
var passport = require ('passport');
var passportConfig = require('./passport-config');
passportConfig.enable(passport);
//----------------------
var handleEmail = require('../../plugins/email/handleEmail');
var rp = require('request-promise');
var config = require('../../configs/server');
var generalConfig = require('../../configs/general');
var httpOptions, g;
if(config.sparqlEndpoint[generalConfig.authGraphName[0]]){
    g = generalConfig.authGraphName[0];
}else{
    //go for generic SPARQL endpoint
    g = 'generic';
}
httpOptions = {
  host: config.sparqlEndpoint[g].host,
  port: config.sparqlEndpoint[g].port,
  path: config.sparqlEndpoint[g].path
};
var appShortTitle = generalConfig.appShortTitle;
var appFullTitle = generalConfig.appFullTitle;

var outputFormat = 'application/sparql-results+json';
module.exports = function handleAuthentication(server) {
    server.use(passport.initialize());
    server.use(passport.session());
    server.get('/login', function(req, res) {
        if(!req.isAuthenticated()){
            res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user });
        }else{
            return res.redirect('/');
        }
     });
    server.post('/login', function(req, res, next) {
        let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
        delete req.session.redirectTo;
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                console.log('auth failed! ' + info.message);
                res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, data: req.body, errorMsg: 'Authentication failed... ' + info.message});
            }else{
                req.logIn(user, function(err2) {
                    if (err2) { return next(err2); }
                    // console.log('auth is OK!');
                    return res.redirect(redirectTo);
                });
            }
        })(req, res, next);
    });
    server.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    server.get('/profile/:id', function(req, res) {
        res.redirect('/dataset/' + encodeURIComponent(generalConfig.authGraphName)+'/resource/'+ encodeURIComponent(req.params.id));
    });
    server.get('/resetPassword/:time/:username/:hash', function(req, res) {
        var error = '';
        if(!req.params.time || !req.params.username || !req.params.hash){
            error = 'Error in receiving user details...'
            res.render('resetPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, errorMsg: error});
        }else{
            var dateStr = req.params.time.replace(salt1, '');
            var password = req.params.hash.replace(salt2, '');
            var username = req.params.username;
            var diffStr = moment(dateStr, "x").fromNow();
            var diff = parseInt(diffStr.split(' ')[0]);
            var unit = diffStr.split(' ')[1]; //days and years
            if(unit === 'years'){
                error = 'You session is expired... Your password reset request was for ' + diffStr;
                res.render('resetPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, errorMsg: error});
            }
            if(unit === 'days'){
                if(diff > 0){
                    error = 'You session is expired... Your password reset request was for ' + diffStr;
                    res.render('resetPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, errorMsg: error});
                }
            }
            if(!error){
                //update password with a new one
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                var rnd = Math.round(+new Date() / 1000);
                var newPass = '';
                for( var i=0; i < 5; i++ ) {
                    newPass += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                newPass += rnd;
                //todo: adapt it for sesame if needed
                /*jshint multistr: true */
                var query = '\
                PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                DELETE FROM <'+ generalConfig.authGraphName[0] +'> {?s ldr:password ?p .} WHERE { \
                  ?s a foaf:Person . \
                  ?s foaf:accountName "'+username+'" .\
                  ?s ldr:password "'+password+'" .\
                  ?s ldr:password ?p .\
                } \
                INSERT INTO <'+ generalConfig.authGraphName[0] +'> {?s ldr:password "'+passwordHash.generate(newPass)+'" .} WHERE { \
                    ?s a foaf:Person . \
                    ?s foaf:accountName "'+username+'" .\
                }\
                ';
                //console.log(query);
                var endpoint = helper.getEndpointParameters([generalConfig.authGraphName[0]]);
                var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
                rp.post({uri: rpPath}).then(function(){
                    console.log('Password reset!');
                    //send email notifications
                    if(generalConfig.enableEmailNotifications){
                        //handleEmail.sendMail('userRegistration', req.body.email, '', '', '', '');
                    }
                    res.render('resetPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, errorMsg: error, username: req.params.username, password: newPass});
                }).catch(function (err2) {
                    console.log(err2);
                    res.render('resetPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, errorMsg: err2});

                });
            }
        }
    });
    server.get('/forgotPassword', function(req, res) {
        res.render('forgotPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle});
    });
    server.post('/forgotPassword', function(req, res) {
        var email, error= '';
        if(!req.body.email.trim()){
            error = 'Error! please enter your email address...';
        }
        if(error){
            res.render('forgotPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, data: req.body, errorMsg: 'Error... '+error});
        }else{
            email = req.body.email.trim();
            /*jshint multistr: true */
            var query = '\
            PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
            SELECT ( COUNT(?s) AS ?exists ) FROM <'+ generalConfig.authGraphName[0] +'> WHERE { \
              { \
                  ?s a foaf:Person . \
                  ?s foaf:mbox ?mbox .\
                  FILTER (?mbox = <'+ email +'> || ?mbox = <mailto:'+ email +'>) \
              } \
            } \
            ';
            var endpoint = helper.getEndpointParameters([generalConfig.authGraphName[0]]);
            var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
            //send request
            rp.get({uri: rpPath}).then(function(resq){
                var parsed = JSON.parse(resq);
                if(parsed.results.bindings.length){
                    if(parsed.results.bindings[0].exists.value ==='0'){
                        res.render('forgotPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, data: req.body, errorMsg: 'Error... No user under was found under this email address! Please enter a correct email address...'});
                    }else{
                        /*jshint multistr: true */
                        var query2 = '\
                        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                        PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                        SELECT ?s ?account ?password FROM <'+ generalConfig.authGraphName[0] +'> WHERE { \
                          { \
                              ?s a foaf:Person . \
                              ?s foaf:mbox ?mbox .\
                              ?s foaf:accountName ?account .\
                              ?s ldr:password ?password .\
                              FILTER (?mbox = <'+ email +'> || ?mbox = <mailto:'+ email +'>) \
                          } \
                        } \
                        ';
                        var rpPath2 = helper.getHTTPQuery('read', query2, endpoint, outputFormat);
                        rp.get({uri: rpPath2}).then(function(resq){
                            var parsed = JSON.parse(resq);
                            if(parsed.results.bindings.length){
                                var output = [];
                                parsed.results.bindings.forEach(function(el) {
                                    output.push({username: el.account.value, password: el.password.value});
                                });
                                var links = '';
                                var startText = '';
                                var endText = '';
                                var currentDate = moment().format('x');
                                if(output.length > 1){
                                    startText = 'There were multiple user accounts under this email address. Please select the link for the right account name to be reset: <br/> ';
                                    //in case of multiple accounts
                                    output.forEach(function(v) {
                                        links = links + '<br/>' + 'user: "' + v.username + '" <br/> password reset link: ' + baseHost + '/resetPassword/' + salt1 + currentDate + '/' + v.username + '/' + salt2 + v.password +' <br/><br/>';
                                    });
                                }else{
                                    startText = 'Please click on the following link to reset your password: <br/> ';
                                    links = '<br/> password reset link: ' + baseHost +'/resetPassword/' + salt1 + currentDate + '/' + output[0].username + '/' + salt2 + output[0].password +' <br/>';
                                }
                                endText = '<br/><br/> on behalf of RISIS datasets portal.'
                                //console.log(startText+links+endText);
                                //send links
                                handleEmail.sendMail('passwordReset', '', email, '[RISIS] Password Reset Request' , startText+links+endText , '');
                                res.render('confirmationFPassword', {appShortTitle: appShortTitle, appFullTitle: appFullTitle});
                            }
                        }).catch(function (err2) {
                            console.log(err2);
                        });
                    }
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
    server.get('/confirmation', function(req, res) {
        if(!req.isAuthenticated()){
            res.render('confirmation', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, needsConfirmation: generalConfig.enableUserConfirmation});
        }else{
            return res.redirect('/');
        }
     });
    server.get('/register', function(req, res) {
        if(!req.isAuthenticated()){
            res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle});
        }else{
            return res.redirect('/');
        }
     });
     server.post('/register', function(req, res, next) {
         var error= '';
         if(req.body.password !== req.body.cpassword){
             error = 'Error! password mismatch...';
         }else{
             for (var prop in req.body) {
                 if(!req.body[prop] && prop !== 'orcidid'){
                     error = error + ' missing value for "' + prop +'"';
                 }
             }
         }
         if(error){
             console.log(error);
             res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, data: req.body, errorMsg: 'Error... '+error});
         }else{
             //successfull
             //first check if user already exists
             /*jshint multistr: true */
             var query = '\
             PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
             SELECT ( COUNT(?s) AS ?exists ) FROM <'+ generalConfig.authGraphName[0] +'> WHERE { \
               { \
                   ?s a foaf:Person . \
                   ?s foaf:accountName "'+ req.body.username +'" .\
               } \
             } \
             ';
             var endpoint = helper.getEndpointParameters([generalConfig.authGraphName[0]]);
             var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
             //send request
             rp.get({uri: rpPath}).then(function(resq){
                 var parsed = JSON.parse(resq);
                 if(parsed.results.bindings.length){
                     if(parsed.results.bindings[0].exists.value ==='0'){
                         //register as new user
                         console.log('start registration');
                         var rnd = Math.round(+new Date() / 1000);
                         var resourceURI = generalConfig.baseResourceDomain + '/user/' + rnd;
                         var dresourceURI = generalConfig.baseResourceDomain + '/resource/' + rnd;
                         var dgraphURI = generalConfig.baseResourceDomain + '/graph/' + rnd;
                         var blanknode = generalConfig.baseResourceDomain + '/editorship/' + rnd;
                         var orcidid;
                         if(req.body.orcidid) {
                            orcidid = 'http://orcid.org/' + req.body.orcidid;
                         }else{
                            orcidid = 'http://';
                         }
                         var tmpE= [];
                         var isActive = generalConfig.enableUserConfirmation? 0 : 1;
                         var date = new Date();
                         var currentDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
                         if(endpoint.type === 'sesame'){
                             /*jshint multistr: true */
                             query = '\
                             PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                             PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
                             PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                             PREFIX vivo: <http://vivoweb.org/ontology/core#> \
                             PREFIX dcterms: <http://purl.org/dc/terms/> \
                             INSERT DATA { GRAPH <'+ generalConfig.authGraphName[0] +'> { \
                             <'+ resourceURI + '> a foaf:Person; foaf:firstName """'+req.body.firstname+'"""; foaf:lastName """'+req.body.lastname+'"""; foaf:organization """'+req.body.organization+'"""; vCard:role """'+req.body.position+'"""; vivo:orcidId <'+orcidid+'> ; vCard:adr """'+req.body.address+'"""; foaf:mbox <mailto:'+req.body.email+'>; dcterms:created "' + currentDate + '"^^xsd:dateTime; foaf:accountName """'+req.body.username+'"""; ldr:password """'+passwordHash.generate(req.body.password)+'"""; ldr:isActive "'+isActive+'"^^xsd:Integer; ldr:isSuperUser "0"^^xsd:Integer; ldr:editorOfGraph <'+dgraphURI+'>; ldr:editorOfResource <'+dresourceURI+'>; ldr:editorOfProperty <'+blanknode+'1>;ldr:editorOfProperty <'+blanknode+'2>; ldr:editorOfProperty <'+blanknode+'3>; ldr:editorOfProperty <'+blanknode+'4> . \
                             <'+blanknode+'1> ldr:resource <'+resourceURI+'> ; ldr:property foaf:firstName . \
                             <'+blanknode+'2> ldr:resource <'+resourceURI+'> ; ldr:property foaf:lastName . \
                             <'+blanknode+'3> ldr:resource <'+resourceURI+'> ; ldr:property vCard:role . \
                             <'+blanknode+'4> ldr:resource <'+resourceURI+'> ; ldr:property vCard:adr . \
                             <'+blanknode+'5> ldr:resource <'+resourceURI+'> ; ldr:property foaf:organization . \
                             <'+blanknode+'6> ldr:resource <'+resourceURI+'> ; ldr:property ldr:password . \
                             <'+blanknode+'7> ldr:resource <'+resourceURI+'> ; ldr:property vivo:orcidId . \
                            }} \
                             ';
                         }else {
                             /*jshint multistr: true */
                             query = '\
                             PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                             PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
                             PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                             PREFIX vivo: <http://vivoweb.org/ontology/core#> \
                             PREFIX dcterms: <http://purl.org/dc/terms/> \
                             INSERT DATA INTO <'+ generalConfig.authGraphName[0] +'> { \
                             <'+ resourceURI + '> a foaf:Person; foaf:firstName """'+req.body.firstname+'"""; foaf:lastName """'+req.body.lastname+'"""; foaf:organization """'+req.body.organization+'"""; vCard:role """'+req.body.position+'"""; vivo:orcidId <'+orcidid+'> ; vCard:adr """'+req.body.address+'"""; foaf:mbox <mailto:'+req.body.email+'>; dcterms:created "' + currentDate + '"^^xsd:dateTime; foaf:accountName """'+req.body.username+'"""; ldr:password """'+passwordHash.generate(req.body.password)+'"""; ldr:isActive "'+isActive+'"^^xsd:Integer; ldr:isSuperUser "0"^^xsd:Integer; ldr:editorOfGraph <'+dgraphURI+'>; ldr:editorOfResource <'+dresourceURI+'>; ldr:editorOfProperty <'+blanknode+'1>;ldr:editorOfProperty <'+blanknode+'2>; ldr:editorOfProperty <'+blanknode+'3>; ldr:editorOfProperty <'+blanknode+'4> . \
                             <'+blanknode+'1> ldr:resource <'+resourceURI+'> ; ldr:property foaf:firstName . \
                             <'+blanknode+'2> ldr:resource <'+resourceURI+'> ; ldr:property foaf:lastName . \
                             <'+blanknode+'3> ldr:resource <'+resourceURI+'> ; ldr:property vCard:role . \
                             <'+blanknode+'4> ldr:resource <'+resourceURI+'> ; ldr:property vCard:adr . \
                             <'+blanknode+'5> ldr:resource <'+resourceURI+'> ; ldr:property foaf:organization . \
                             <'+blanknode+'6> ldr:resource <'+resourceURI+'> ; ldr:property ldr:password . \
                             <'+blanknode+'7> ldr:resource <'+resourceURI+'> ; ldr:property vivo:orcidId . \
                             } \
                             ';
                         }
                         rpPath = helper.getHTTPQuery('update', query, endpoint, outputFormat);
                         rp.post({uri: rpPath}).then(function(){
                             console.log('User is created!');
                             //send email notifications
                             if(generalConfig.enableEmailNotifications){
                                 handleEmail.sendMail('userRegistration', req.body.email, '', '', '', '');
                             }
                             return res.redirect('/confirmation');
                         }).catch(function (err2) {
                             console.log(err2);
                         });
                     }else{
                         res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, data: req.body, errorMsg: 'Error... User already exists!'});
                         console.log('User already exists!');
                     }

                 }else{
                     res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, data: req.body, errorMsg: 'Error... Unknown Error!'});
                 }
             }).catch(function (errq) {
                 console.log(errq);
             });
         }
     });
};
