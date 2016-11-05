'use strict';
import {getQueryDataTypeValue} from '../utils/helpers';
class ResourceQuery{
    constructor() {
        /*jshint multistr: true */
        this.prefixes='\
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
        PREFIX owl: <http://www.w3.org/2002/07/owl#> \
        PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX void: <http://rdfs.org/ns/void#> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \
        PREFIX risisV: <http://rdf.risis.eu/application/> \
        PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
         ';
        this.query='';
    }
    getPrefixes() {
        return this.prefixes;
    }
    getAddTripleQuery(endpointParameters, graphName, resourceURI, propertyURI, objectValue, valueType, dataType) {
        switch (endpointParameters.type) {
            case 'stardog':
            case 'sesame':
                return this.addTripleForSesame(graphName, resourceURI, propertyURI, objectValue, valueType, dataType);
                break;
            default:
                return this.addTriple(graphName, resourceURI, propertyURI, objectValue, valueType, dataType);
        }
    }
    getDeleteTripleQuery(endpointParameters, graphName, resourceURI, propertyURI, objectValue, valueType, dataType) {
        switch (endpointParameters.type) {
            case 'stardog':
            case 'sesame':
                return this.deleteTripleForSesame(graphName, resourceURI, propertyURI, objectValue, valueType, dataType);
                break;
            default:

                return this.deleteTriple(graphName, resourceURI, propertyURI, objectValue, valueType, dataType);
        }
    }
    getDeleteTriplesQuery(endpointParameters, graphName, resourceURI, propertyURI, changes) {
        switch (endpointParameters.type) {
            case 'stardog':
            case 'sesame':
                return this.deleteTriplesForSesame(graphName, resourceURI, propertyURI, changes);
                break;
            default:
                return this.deleteTriples(graphName, resourceURI, propertyURI, changes);
        }
    }
    getUpdateTripleQuery(endpointParameters, graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType) {
        switch (endpointParameters.type) {
            case 'stardog':
            case 'sesame':
                return this.updateTripleForSesame(graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType);
                break;
            default:
                return this.updateTriple(graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType);
        }
    }
    getUpdateTriplesQuery(endpointParameters, graphName, resourceURI, propertyURI, changes) {
        switch (endpointParameters.type) {
            case 'stardog':
            case 'sesame':
                return this.updateTriplesForSesame(graphName, resourceURI, propertyURI, changes);
                break;
            default:
                return this.updateTriples(graphName, resourceURI, propertyURI, changes);
        }
    }
    getUpdateObjectTriplesForSesame(endpointParameters, graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType, detailData) {
        switch (endpointParameters.type) {
            case 'stardog':
            case 'sesame':
                return this.updateObjectTriplesForSesame(graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType, detailData);
                break;
            default:
                return this.updateObjectTriples(graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType, detailData);
        }
    }
    getProperties(graphName, resourceURI) {
        let ex = 'FROM <'+ graphName +'>';
        if(!graphName){
            ex ='';
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT ?p ?o (count(?extendedVal) AS ?hasExtendedValue) ' + ex + ' WHERE { \
        <'+ resourceURI + '> ?p ?o . \
        OPTIONAL {?o ?uri ?extendedVal .} \
    } GROUP BY ?p ?o ORDER BY ?p ?o';
      return this.query;
    }
    getUserApplications(graphName, userURI) {
        /*jshint multistr: true */
        this.query = '\
        SELECT ?a ?type ?decisionDSO ?decisionPRB ?decisionFCB ?dataset ?created from <' + graphName + '> WHERE { \
        ?a a ?type . \
        ?a risisV:applicant <' + userURI + '> . \
        ?a risisV:decisionDSO ?decisionDSO . \
        OPTIONAL {?a risisV:decisionPRB ?decisionPRB .} \
        OPTIONAL {?a risisV:decisionFCB ?decisionFCB .} \
        ?a risisV:dataset ?dataset . \
        ?a dcterms:created ?created . \
        } ORDER BY DESC(?created)';
        return this.query;
    }
    getUserProfileStatus(graphName, userURI) {
        /*jshint multistr: true */
        this.query = '\
        SELECT ?birthYear ?gender ?nationality ?organizationType ?city ?country from <' + graphName + '> WHERE { \
        <'+userURI+'> <http://dbpedia.org/ontology/birthYear> ?birthYear ; \
        <http://xmlns.com/foaf/0.1/gender> ?gender ; \
        <http://dbpedia.org/ontology/nationality> ?nationality ; \
        <http://rdf.risis.eu/user/organizationType> ?organizationType ; \
        <http://dbpedia.org/ontology/city> ?city ; \
        <http://dbpedia.org/ontology/country> ?country . \
        }';
        return this.query;
    }
    getDatasetApplications(graphName, datasetURI) {
        /*jshint multistr: true */
        this.query = '\
        SELECT ?a ?type ?decisionDSO ?decisionPRB ?decisionFCB ?dataset ?created from <' + graphName + '> WHERE { \
        ?a a ?type . \
        ?a risisV:dataset <' + datasetURI + '> . \
        ?a risisV:dataset ?dataset . \
        OPTIONAL {?a risisV:decisionDSOA ?decisionDSOA .} \
        OPTIONAL {?a risisV:decisionDSO ?decisionDSOV .} \
        OPTIONAL {?a risisV:decisionPRB ?decisionPRB .} \
        OPTIONAL {?a risisV:decisionFCB ?decisionFCB .} \
        ?a dcterms:created ?created . \
        BIND(if(BOUND(?decisionDSOA), ?decisionDSOA, ?decisionDSOV) AS ?decisionDSO) \
        } ORDER BY DESC(?created)';
        return this.query;
    }
    getDatasetsApplications(graphName, datasets) {
        let datasetsURIArr = [];
        datasets.forEach((v, k) => {
            datasetsURIArr.push('<' + v + '>');
        })
        /*jshint multistr: true */
        this.query = '\
        SELECT ?a ?type ?decisionDSO ?decisionPRB ?decisionFCB ?dataset ?created from <' + graphName + '> WHERE { \
        ?a a ?type . \
        ?a risisV:dataset ?dataset . \
        ?a risisV:dataset ?dataset . \
        OPTIONAL {?a risisV:decisionDSOA ?decisionDSOA .} \
        OPTIONAL {?a risisV:decisionDSO ?decisionDSOV .} \
        OPTIONAL {?a risisV:decisionPRB ?decisionPRB .} \
        OPTIONAL {?a risisV:decisionFCB ?decisionFCB .} \
        ?a dcterms:created ?created . \
        FILTER (?dataset IN (' + datasetsURIArr.join(',') + ')) \
        BIND(if(BOUND(?decisionDSOA), ?decisionDSOA, ?decisionDSOV) AS ?decisionDSO) \
        } ORDER BY DESC(?created)';
        return this.query;
    }
    getAllApplications(graphName) {
        /*jshint multistr: true */
        this.query = '\
        SELECT ?a ?type ?dataset ?decisionDSO ?decisionPRB ?decisionFCB ?created from <' + graphName + '> WHERE { \
        ?a a ?type . \
        ?a risisV:dataset ?dataset . \
        OPTIONAL {?a risisV:decisionDSOA ?decisionDSOA .} \
        OPTIONAL {?a risisV:decisionDSO ?decisionDSOV .} \
        OPTIONAL {?a risisV:decisionPRB ?decisionPRB .} \
        OPTIONAL {?a risisV:decisionFCB ?decisionFCB .} \
        ?a dcterms:created ?created . \
        BIND(if(BOUND(?decisionDSOA), ?decisionDSOA, ?decisionDSOV) AS ?decisionDSO) \
        } ORDER BY DESC(?created)';
        return this.query;
    }
    addTripleForSesame (graphName, resourceURI, propertyURI, objectValue, valueType, dataType) {
        //todo: consider different value types
        let newValue, tmp = {};
        let graph = 'GRAPH <'+ graphName +'> { ';
        let graphEnd = ' } ';
        if(!graphName){
            graph =' ';
            graphEnd = ' ';
        }
        tmp = getQueryDataTypeValue(valueType, dataType, objectValue);
        newValue = tmp.value;
        /*jshint multistr: true */
        this.query = '\
        INSERT DATA { \
            ' + graph  +'<'+ resourceURI + '> <'+ propertyURI +'> '+ newValue + graphEnd + ' }';
        return this.query;
    }
    addTriple(graphName, resourceURI, propertyURI, objectValue, valueType, dataType) {
        //todo: consider different value types
      let newValue, tmp = {};
      let graph = 'INTO <'+ graphName +'> ';
      if(!graphName){
          graph ='';
      }
      tmp = getQueryDataTypeValue(valueType, dataType, objectValue);
      newValue = tmp.value;
      /*jshint multistr: true */
      this.query = '\
      INSERT DATA ' + graph + '{ \
      <'+ resourceURI + '> <'+ propertyURI +'> '+ newValue +' } ';
      return this.query;
    }
    deleteTripleForSesame(graphName, resourceURI, propertyURI, objectValue, valueType, dataType) {
        let dtype, newValue, tmp = {};
        let graph = 'GRAPH <'+ graphName +'> {';
        let graphEnd = ' } ';
        if(!graphName){
            graph = ' ';
            graphEnd = ' ';
        }
        if(objectValue){
            tmp = getQueryDataTypeValue(valueType, dataType, objectValue);
            newValue = tmp.value;
            dtype = tmp.dtype;
            //if we just want to delete a specific value for multi-valued ones
            this.query = 'DELETE  { '+ graph  +'<'+ resourceURI +'> <'+ propertyURI +'> ?v ' + graphEnd + ' } WHERE { <'+ resourceURI +'> <'+ propertyURI +'> ?v . FILTER(' + dtype + '(?v)= '+ newValue +' ) } ';
        }else{
            this.query = 'DELETE { ' + graph + '<'+ resourceURI +'> <'+ propertyURI +'> ?z ' + graphEnd + ' } WHERE { <'+ resourceURI +'> <'+ propertyURI +'> ?z }';
        }
        return this.query;
    }
    deleteTriple(graphName, resourceURI, propertyURI, objectValue, valueType, dataType) {
        let dtype, newValue, tmp = {};
        let graph = 'FROM <'+ graphName +'> ';
        if(!graphName){
            graph ='';
        }
        if(objectValue){
            tmp = getQueryDataTypeValue(valueType, dataType, objectValue);
            newValue = tmp.value;
            dtype = tmp.dtype;
          //if we just want to delete a specific value for multi-valued ones
          this.query = 'DELETE ' + graph + '{ <'+ resourceURI +'> <'+ propertyURI +'> ?v } WHERE { <'+ resourceURI +'> <'+ propertyURI +'> ?v . FILTER(' + dtype + '(?v)= '+ newValue +' ) } ';
        }else{
            this.query = 'DELETE ' + graph + '{ <'+ resourceURI +'> <'+ propertyURI +'> ?z }  WHERE { <'+ resourceURI +'> <'+ propertyURI +'> ?z }';
        }
        return this.query;
    }
    deleteTriplesForSesame (graphName, resourceURI, propertyURI, changes) {
        let self = this;
        self.query= '';
        changes.forEach(function(change) {
            self.query = self.query + self.deleteTripleForSesame(graphName, resourceURI, propertyURI, change.oldValue, change.valueType, change.dataType);
        });
        return self.query;
    }
    deleteTriples(graphName, resourceURI, propertyURI, changes) {
        let self = this;
        self.query= '';
        changes.forEach(function(change) {
            self.query = self.query + self.deleteTriple(graphName, resourceURI, propertyURI, change.oldValue, change.valueType, change.dataType);
        });
        return self.query;
    }
    updateTriple (graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType) {
        this.query = this.deleteTriple(graphName, resourceURI, propertyURI, oldObjectValue, valueType, dataType) + this.addTriple(graphName, resourceURI, propertyURI, newObjectValue, valueType, dataType);
        return this.query;
    }
    updateTripleForSesame (graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType) {
        this.query = this.deleteTripleForSesame(graphName, resourceURI, propertyURI, oldObjectValue, valueType, dataType) + ';' + this.addTripleForSesame(graphName, resourceURI, propertyURI, newObjectValue, valueType, dataType) + ';';
        return this.query;    }
    updateTriples (graphName, resourceURI, propertyURI, changes) {
        let self = this;
        self.query= '';
        changes.forEach(function(change) {
            self.query = self.query + self.updateTriple(graphName, resourceURI, propertyURI, change.oldValue, change.newValue, change.valueType, change.dataType);
        });
        return self.query;
    }
    updateTriplesForSesame (graphName, resourceURI, propertyURI, changes) {
        let self = this;
        self.query= '';
        changes.forEach(function(change) {
            self.query = self.query + self.updateTripleForSesame(graphName, resourceURI, propertyURI, change.oldValue, change.newValue, change.valueType, change.dataType);
        });
        return self.query;
    }
    updateObjectTriples (graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType, detailData) {
        let self=this;
        self.query = self.deleteTriple(graphName, resourceURI, propertyURI, oldObjectValue, valueType, dataType) + self.addTriple(graphName, resourceURI, propertyURI, newObjectValue, valueType, dataType) ;
        for (let propURI in detailData) {
            self.query = self.query + self.deleteTriple(graphName, oldObjectValue, propURI, '', detailData[propURI].valueType, detailData[propURI].dataType);
            self.query = self.query + self.addTriple(graphName, newObjectValue, propURI, detailData[propURI].value, detailData[propURI].valueType, detailData[propURI].dataType);
        }
        return self.query;
    }
    updateObjectTriplesForSesame (graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType, detailData) {
        let self=this;
        self.query = self.deleteTripleForSesame (graphName, resourceURI, propertyURI, oldObjectValue, valueType, dataType) + ';' + self.addTripleForSesame(graphName, resourceURI, propertyURI, newObjectValue, valueType, dataType) + ';';
        for (let propURI in detailData) {
            self.query = self.query + self.deleteTripleForSesame (graphName, oldObjectValue, propURI, '', detailData[propURI].valueType, detailData[propURI].dataType)+ ';';
            self.query = self.query + self.addTripleForSesame (graphName, newObjectValue, propURI, detailData[propURI].value, detailData[propURI].valueType, detailData[propURI].dataType)+ ';';
        }
        return self.query;
    }
    getFCBPRM(authGraphName) {
        /*jshint multistr: true */
        this.query = '\
        SELECT ?member ?username ?firstName ?mbox  FROM <' + authGraphName + '> WHERE { \
        ?user foaf:member ?member .\
        ?user foaf:mbox ?mbox .\
        ?user ldr:isActive "1" . \
        ?user foaf:accountName ?username .\
        ?user foaf:firstName ?firstName.\
        FILTER (?member in (<http://rdf.risis.eu/user/FCB>, <http://rdf.risis.eu/user/PRB>))\
        }'
        return this.query;
    }
    getDSOForApp(authGraphName, applicationsGraphName, appURL) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?username ?firstName ?mbox  WHERE {\
          GRAPH <' + authGraphName + '> {\
            ?user ldr:editorOfGraph ?dataset ;\
                  foaf:mbox ?mbox ;\
                  foaf:firstName ?firstName;\
                  ldr:isActive "1" ; \
                  foaf:accountName ?username .\
          }\
          GRAPH <' + applicationsGraphName + '> {\
           <' + appURL + '> <http://rdf.risis.eu/application/dataset> ?dataset .\
          }\
        }'
        return this.query;
    }
    getUserForApp(authGraphName, applicationsGraphName, appURL) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?username ?firstName ?mbox  WHERE {\
          GRAPH <' + authGraphName + '> {\
            ?user foaf:mbox ?mbox ;\
                  foaf:firstName ?firstName;\
                  ldr:isActive "1" ; \
                  foaf:accountName ?username .\
          }\
          GRAPH <' + applicationsGraphName + '> {\
           <' + appURL + '> <http://rdf.risis.eu/application/applicant> ?user .\
          }\
        }'
        return this.query;
    }
}
export default ResourceQuery;
