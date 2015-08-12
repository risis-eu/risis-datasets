'use strict';
import {getQueryDataTypeValue} from '../utils/helpers';
class DatasetQuery{
    constructor() {
        /*jshint multistr: true */
        this.prefixes='\
        PREFIX risis: <http://risis.eu/> \
        PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX void: <http://rdfs.org/ns/void#> \
        PREFIX pav: <http://purl.org/pav/> \
        PREFIX wv: <http://vocab.org/waiver/terms/norms> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \
        PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
         ';
        this.query='';
    }
    //-----------RISIS------------
    getDatasetsList() {
      /*jshint multistr: true */
      this.query = '\
      SELECT DISTINCT ?dataset ?subject ?title ?desc WHERE { \
        { \
          GRAPH risisVoid:  { \
            risisVoid:risis_rdf_dataset void:subset ?dataset . \
          } \
          GRAPH ?dataset {?subject a void:Dataset. ?subject dcterms:title ?title . ?subject dcterms:description ?desc .} \
        } \
      } ORDER BY ASC(?title) \
      ';
      return this.prefixes + this.query;
    }
    //--------------------------------
    countResourcesByType(graphName, type) {
        let st = '?resource a <'+ type + '> .';
        //will get all the types
        if(!type.length || (type.length && !type[0]) ){
            st = '?resource a ?type .';
        }
        //if we have multiple type, get all of them
        let typeURIs = [];
        if(type.length > 1){
            type.forEach(function(uri) {
                typeURIs.push('<' + uri + '>');
            });
            st = '?resource a ?type . FILTER (?type IN (' + typeURIs.join(',') + '))';
        }
        //go to default graph if no graph name is given
        if(String(graphName)!=='' && graphName){
            /*jshint multistr: true */
            this.query = '\
            SELECT (count(?resource) AS ?total) WHERE {\
                { GRAPH <' + graphName + '> \
                    { '+ st +' \
                    } \
                } \
            }  \
            ';
        }else{
            /*jshint multistr: true */
            this.query = '\
            SELECT (count(?resource) AS ?total) WHERE { \
                { '+ st +' \
                }\
            }  \
            ';
        }
        return this.prefixes + this.query;
    }
    getResourcesByType(graphName, type, limit, offset) {
        let st = '?resource a <'+ type + '> .';
        //will get all the types
        if(!type.length || (type.length && !type[0]) ){
            st = '?resource a ?type .';
        }
        //if we have multiple type, get all of them
        let typeURIs = [];
        if(type.length > 1){
            type.forEach(function(uri) {
                typeURIs.push('<' + uri + '>');
            });
            st = '?resource a ?type . FILTER (?type IN (' + typeURIs.join(',') + '))';
        }
        //go to default graph if no graph name is given
        if(String(graphName)!=='' && graphName){
            /*jshint multistr: true */
            this.query = '\
            SELECT DISTINCT ?resource ?title ?label WHERE {\
                { GRAPH <' + graphName + '> \
                    { '+ st +' \
                    } \
                } \
                OPTIONAL { ?resource dcterms:title ?title .}  \
                OPTIONAL { ?resource rdfs:label ?label .}  \
            } LIMIT ' + limit + ' OFFSET ' + offset + ' \
            ';
        }else{
            /*jshint multistr: true */
            this.query = '\
            SELECT DISTINCT ?resource ?title ?label ?graphName WHERE { \
                { GRAPH ?graphName \
                    { '+ st +' \
                    }\
                } \
                UNION \
                { '+ st +' \
                }\
                OPTIONAL { ?resource dcterms:title ?title .}  \
                OPTIONAL { ?resource rdfs:label ?label .}  \
            } LIMIT ' + limit + ' OFFSET ' + offset + ' \
            ';
        }
        return this.prefixes + this.query;
    }
}
export default DatasetQuery;
