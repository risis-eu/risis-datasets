var generalConfig = require('../../configs/general');
var appShortTitle = generalConfig.appShortTitle;
var appFullTitle = generalConfig.appFullTitle;
module.exports = function handleUpload(server) {
     server.get('/accessRequest/:name', function(req, res) {
         if(!req.isAuthenticated()){
            res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user });
         }else{
            res.render('accessRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name});
         }
     });
     server.get('/visitRequest/:name', function(req, res) {
         if(!req.isAuthenticated()){
            res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user });
         }else{
            res.render('visitRequest', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, name: req.params.name});
         }
     });
};
