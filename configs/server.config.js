//important: first value in the array is considered as default value for the property
//this file is visible to the server-side
export default {
    serverPort: [4000],
    sparqlEndpoint: {
        'generic': {
            host: 'localhost', port: 8890, path: '/sparql', type: 'virtuoso'
        }
    },
    dbpediaLookupService: [
        { host: 'lookup.dbpedia.org' }
    ],
    OAuth: {
        'risis': {
            'clientID': 'sms',
            'clientSecret': 'put your secret key here...',
            'site': 'https://auth-risis.cortext.net',
            'tokenPath': '/auth/grant',
            'authorizationPath': '/auth/authorize',
            'redirectURI': 'http://localhost:3000/callback'
        }
    }
};
