'use strict';
import ResourceQuery from './ResourceQuery';
class AdminQuery{
    constructor() {
        this.queryObject = new ResourceQuery();
        /*jshint multistr: true */
        this.prefixes = '\
        PREFIX ldReactor: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
        PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX void: <http://rdfs.org/ns/void#> \
        PREFIX pav: <http://purl.org/pav/> \
        PREFIX wv: <http://vocab.org/waiver/terms/norms> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \
        ';
        this.query='';
    }
    getUsers(graphName) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?subject ?username ?isActive ?isSuperUser ?mbox ?firstName ?lastName (group_concat(distinct ?member ; separator = ",") AS ?membership) FROM <'+ graphName +'> WHERE {\
                { \
                ?subject a foaf:Person . \
                ?subject foaf:accountName ?username . \
                ?subject ldReactor:isActive ?isActive . \
                ?subject foaf:firstName ?firstName . \
                ?subject foaf:lastName ?lastName . \
                ?subject foaf:member ?member . \
                ?subject ldReactor:isSuperUser ?isSuperUser . \
                ?subject foaf:mbox ?mbox . \
                } \
        } ORDER BY ASC(?lastName)\
        ';
        return this.prefixes + this.query;
    }
    activateUser(endpointType, graphName, resourceURI){
        this.query = this.queryObject.getUpdateTripleQuery(endpointType, graphName, resourceURI, 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#isActive', '0', '1', 'literal', '');
        return this.prefixes + this.query;
    }
}
export default AdminQuery;
