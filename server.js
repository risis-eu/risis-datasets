/**
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */
import express from 'express';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import path from 'path';
import serialize from 'serialize-javascript';
import {navigateAction} from 'fluxible-router';
//required for authentication
import handleAuthentication from './plugins/authentication/handleAuth';
import handleUpload from './plugins/upload/handleUpload';
//required for export resources
import handleExport from './plugins/export/handleExport';
import {enableAuthentication} from './configs/general';
import session from 'express-session';
import hogan from 'hogan-express';
import debugLib from 'debug';
import React from 'react';
import serverConfig from './configs/server';
import app from './app';
import HtmlComponent from './components/DefaultHTMLLayout';
const htmlComponent = React.createFactory(HtmlComponent);
const debug = debugLib('linked-data-reactor');
const publicRoutes = ['/', '/about', '/browse'];
let createElement = require('fluxible-addons-react').createElementWithContext;

const server = express();
// we need this because "cookie" is true in csrfProtection
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(session({
    secret: 'LD reactor',
    resave: false,
    saveUninitialized: false
}));
// server.use(csrf({cookie: true}));
//for authentication: this part is external to the flux architecture
if(enableAuthentication){
    handleAuthentication(server);
}
handleUpload(server);
//handling content export
handleExport(server);
server.set('state namespace', 'App');
server.use(favicon(path.join(__dirname, '/favicon.ico')));
//--------used for views external to fluxible
server.set('views', path.join(__dirname, '/external_views'));
server.set('view engine', 'html');
server.set('view options', { layout: false });
//server.enable('view cache');
server.engine('html', hogan);
//------------------
server.use('/public', express.static(path.join(__dirname, '/build')));
server.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
server.use('/assets', express.static(path.join(__dirname, '/assets')));
server.use('/uploaded', express.static(path.join(__dirname, '/uploaded')));
// Get access to the fetchr plugin instance
let fetchrPlugin = app.getPlugin('FetchrPlugin');
// Register our services
fetchrPlugin.registerService(require('./services/dbpedia'));
fetchrPlugin.registerService(require('./services/dataset'));
fetchrPlugin.registerService(require('./services/resource'));
fetchrPlugin.registerService(require('./services/facet'));
fetchrPlugin.registerService(require('./services/admin'));
// Set up the fetchr middleware
server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

server.use((req, res, next) => {
    //check user credentials
    //stop fluxible rendering if not authorized
    if(enableAuthentication){
        if(!req.isAuthenticated() && publicRoutes.indexOf(req.url) === -1 && req.url.indexOf('/metadata/') == -1 && req.url.indexOf('/dataset/') == -1){
            //store referrer in session
            req.session.redirectTo = req.url;
            return res.redirect('/login');
        }
    }
    let context = app.createContext({
        req: req // The fetchr plugin depends on this
        // xhrContext: {
        //     _csrf: req.csrfToken() // Make sure all XHR requests have the CSRF token
        // }
    });

    debug('Executing navigate action');
    context.getActionContext().executeAction(navigateAction, {
        url: req.url
    }, (err) => {
        if (err) {
            if (err.status && err.status === 404) {
                next();
            } else {
                next(err);
            }
            return;
        }

        debug('Exposing context state');
        const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

        debug('Rendering Application component into html');
        const html = React.renderToStaticMarkup(htmlComponent({
            context: context.getComponentContext(),
            state: exposed,
            markup: React.renderToString(createElement(context))
        }));

        debug('Sending markup');
        res.type('html');
        res.write('<!DOCTYPE html>' + html);
        res.end();
    });
});

const port = process.env.PORT || serverConfig.serverPort[0];
server.listen(port);
console.log('Listening on port ' + port);

export default server;
