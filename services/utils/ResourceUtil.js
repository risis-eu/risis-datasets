'use strict';
import Configurator from './Configurator';
class ResourceUtil{
    parseFCBPRB(body){
        let output = [];
        let parsed = JSON.parse(body);
        if(parsed.head.vars[0]=== 'callret-0'){
          //no results!
          return [];
        }else{
            parsed.results.bindings.forEach(function(el) {
                output.push({'type': el.member.value === 'http://rdf.risis.eu/user/PRB' ? 'PRB' : 'FCB', 'firstName': el.firstName.value, 'mbox': el.mbox.value, 'username': el.username.value})
            });
            return output;
        }
        return output;
    }
    parseAppUser(body){
        let output = [];
        let parsed = JSON.parse(body);
        if(parsed.head.vars[0]=== 'callret-0'){
          //no results!
          return [];
        }else{
            parsed.results.bindings.forEach(function(el) {
                output.push({'type': 'USER', 'firstName': el.firstName.value, 'mbox': el.mbox.value, 'username': el.username.value})
            });
            return output;
        }
        return output;
    }
    parseDSOApp(body){
        let output = [];
        let parsed = JSON.parse(body);
        if(parsed.head.vars[0]=== 'callret-0'){
          //no results!
          return [];
        }else{
            parsed.results.bindings.forEach(function(el) {
                output.push({'type': 'DSO', 'firstName': el.firstName.value, 'mbox': el.mbox.value, 'username': el.username.value})
            });
            return output;
        }
        return output;
    }
    parseUserApplications(body){
        let output = [];
        let parsed = JSON.parse(body);
        if(parsed.head.vars[0]=== 'callret-0'){
          //no results!
          return [];
        }else{
            parsed.results.bindings.forEach(function(el) {
                output.push({uri: el.a.value, id: el.a.value.split('http://risis.eu/application/')[1], type: el.type.value.split('http://rdf.risis.eu/application/')[1], decisionDSO: el.decisionDSO.value, decisionPRB: el.decisionPRB ? el.decisionPRB.value: '', decisionFCB: el.decisionFCB ? el.decisionFCB.value : '', dataset: el.dataset.value, created: el.created.value});
            });
            return output;
        }
        return output;
    }
    parseUserProfileStatus(body){
        let output = {};
        let parsed = JSON.parse(body);
        if(parsed.head.vars[0]=== 'callret-0'){
            //no results!
            return 0;
        }else{
            parsed.results.bindings.forEach(function(el) {
                output['birthYear'] = el.birthYear.value;
                output['gender'] = el.gender.value;
                output['nationality'] = el.nationality.value;
                output['organizationType'] = el.organizationType.value;
                output['city'] = el.city.value;
                output['country'] = el.country.value;
            });
            return output;
        }
        return output;
    }
    parseDatasetApplications(body){
        let tmp, output = [];
        let parsed = JSON.parse(body);
        if(parsed.head.vars[0]=== 'callret-0'){
          //no results!
          return [];
        }else{
            parsed.results.bindings.forEach(function(el) {
                tmp = el.dataset.value.replace('http://rdf.risis.eu/dataset/', '');
                tmp = tmp.replace('/1.0/void.ttl#', '');
                output.push({uri: el.a.value, id: el.a.value.split('http://risis.eu/application/')[1], type: el.type.value.split('http://rdf.risis.eu/application/')[1], decisionDSO: el.decisionDSO.value, decisionPRB: el.decisionPRB ? el.decisionPRB.value: '', decisionFCB: el.decisionFCB ? el.decisionFCB.value : '', dataset: tmp, created: el.created.value});
            });
            return output;
        }
        return output;
    }
    getPropertyLabel(uri) {
        var property='';
        var tmp=uri;
        var tmp2=tmp.split('#');
        if(tmp2.length>1){
            property=tmp2[1];
        }else{
            tmp2=tmp.split('/');
            property=tmp2[tmp2.length-1];
            tmp2 = property.split(':');
            property = tmp2[tmp2.length - 1];
        }
        //make first letter capital case
        property = property.charAt(0).toUpperCase() + property.slice(1);
        return property;
    }
    parseProperties(body, graphName, resourceURI, category, propertyPath) {
        let configurator = new Configurator();
        let configExceptional = {}, config = {}, title = '', resourceType = [];
        let filterByCategory=0, self=this;
        let parsed = JSON.parse(body);
        let output=[], propIndex={}, finalOutput=[];
        if(parsed.head.vars[0]=== 'callret-0'){
          //no results!
          return [];
        }else{
            parsed.results.bindings.forEach(function(el) {
                //see if we can find a suitable title for resource
                if(el.p.value === 'http://purl.org/dc/terms/title'){
                    title = el.o.value;
                }else if(el.p.value === 'http://www.w3.org/2000/01/rdf-schema#label'){
                    title = el.o.value;
                }else if (el.p.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                    resourceType.push(el.o.value);
                }
            });
        }
        //handle properties config in different levels
        //todo: now only handles level 2 properties should be extended later if needed
        let exceptional = 0;
        if(propertyPath && propertyPath.length){
            //it is only for property path
            configExceptional = configurator.preparePropertyConfig(1, graphName, resourceURI, resourceType, propertyPath[1]);
            exceptional = 1;
        }
        //resource config
        let rconfig = configurator.prepareResourceConfig(1, graphName, resourceURI, resourceType);
        if(rconfig.usePropertyCategories){
            //allow filter by category
            if(!category){
                //get first category as default
                category = rconfig.propertyCategories[0];
            }
            filterByCategory=1;
        }
        if(parsed.head.vars[0]=== 'callret-0'){
          //no results!
          return [];
        }else{
          parsed.results.bindings.forEach(function(el) {
            config = configurator.preparePropertyConfig(1, graphName, resourceURI, resourceType, el.p.value);
            if(exceptional){
                if(configExceptional && configExceptional.extensions){
                    configExceptional.extensions.forEach(function(ex){
                        if(ex.spec.propertyURI === el.p.value){
                            for(let cp in ex.config) {
                                //overwrite config with extension config
                                config[cp] = ex.config[cp];
                            }
                        }
                    });
                }
            }
            //handle categories
            if(filterByCategory){
                if(!config || !config.category || category !== config.category[0]){
                    //skip property
                    return;
                }
            }
            let property=self.getPropertyLabel(el.p.value);
            //group by properties
            //I put the valueType into instances because we might have cases (e.g. subject property) in which for different instances, we have different value types
            if(propIndex[el.p.value]){
              propIndex[el.p.value].push({value: el.o.value, valueType: el.o.type, dataType:(el.o.type==='typed-literal'?el.o.datatype:''), extended:parseInt(el.hasExtendedValue.value)});
            }else{
              propIndex[el.p.value]=[{value: el.o.value, valueType: el.o.type, dataType:(el.o.type==='typed-literal'?el.o.datatype:''), extended:parseInt(el.hasExtendedValue.value)}];
            }
            output.push({propertyURI:el.p.value, property: property, instances:[], config: config});
          });
            output.forEach(function(el) {
                if(propIndex[el.propertyURI]){
                    finalOutput.push({propertyURI: el.propertyURI, property: el.property, config: el.config, instances:    propIndex[el.propertyURI]});
                    propIndex[el.propertyURI]=null;
                }
            });
          //make the right title for resource if propertyLabel is defined in config
            let newTitel = title;
            if(rconfig && rconfig.resourceLabelProperty && rconfig.resourceLabelProperty.length){
                newTitel = '';
                let tmpArr=[];
                finalOutput.forEach(function(el) {
                    if(rconfig.resourceLabelProperty.indexOf(el.propertyURI) !== -1){
                        tmpArr.push(el.instances[0].value);
                    }
                });
                if(tmpArr.length){
                    newTitel = tmpArr.join('-');
                }else{
                    newTitel = title;
                }
            }
            return {props: finalOutput, title: newTitel, resourceType: resourceType, rconfig: rconfig};
        }
    }
    buildConfigFromExtensions(extensions) {
        let config = {};
        extensions.forEach(function(el, i) {
            config[el.spec.propertyURI] = el.config;
        });
        return config;
    }
    findExtensionIndex(extensions, propertyURI) {
        let index = -1;
        extensions.forEach(function(el, i) {
            if(el.spec.propertyURI === propertyURI){
                index = i;
            }
        });
        return index;
    }
    getExtensionConfig(extensions, propertyURI){
        let index = this.findExtensionIndex(extensions, propertyURI);
        if(index === -1){
            return {};
        }
        return extensions[index].config;
    }
    parseObjectProperties(body, graphName, resourceURI, propertyURI) {
        let title, objectType = '';
        let configurator = new Configurator();
        let config = {}, configExceptional = configurator.preparePropertyConfig(1, graphName, resourceURI, 0, propertyURI);
        let self=this;
        let parsed = JSON.parse(body);
        let output=[], propIndex={}, finalOutput=[];
        if(parsed.results.bindings.length){
          parsed.results.bindings.forEach(function(el) {
            config = configurator.preparePropertyConfig(1, graphName, resourceURI, 0, el.p.value);
            if(el.p.value === 'http://purl.org/dc/terms/title'){
                title = el.o.value;
            }else if(el.p.value === 'http://www.w3.org/2000/01/rdf-schema#label'){
                title = el.o.value;
            }else if (el.p.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                objectType = el.o.value;
            }
            if(configExceptional && configExceptional.extensions){
                configExceptional.extensions.forEach(function(ex){
                    if(ex.spec.propertyURI === el.p.value){
                        for(let cp in ex.config) {
                            //overwrite config with extension config
                            config[cp] = ex.config[cp];
                        }
                    }
                });
            }
            let property=self.getPropertyLabel(el.p.value);
            if(propIndex[el.p.value]){
                propIndex[el.p.value].push({value: el.o.value, valueType: el.o.type, dataType:(el.o.type==='typed-literal'?el.o.datatype:''), extended:parseInt(el.hasExtendedValue.value)});
            }else{
                propIndex[el.p.value]=[{value: el.o.value, valueType: el.o.type, dataType:(el.o.type==='typed-literal'?el.o.datatype:''), extended:parseInt(el.hasExtendedValue.value)}];
            }
            output.push({propertyURI:el.p.value, property: property,  instances:[], config: config});
        });
        output.forEach(function(el) {
          if(propIndex[el.propertyURI]){
            finalOutput.push({config: el.config, spec:{propertyURI: el.propertyURI, property: el.property, instances: propIndex[el.propertyURI]}});
            propIndex[el.propertyURI]=null;
          }
        });
        return {props: finalOutput, title: title, objectType: objectType};
        }
    }
    //------ permission check functions---------------
    deleteAdminProperties(list) {
        let out = []
        const adminProps = ['https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#isSuperUser', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#isActive', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOfGraph', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOfResource', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOfProperty', 'http://purl.org/dc/terms/created', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#viewerOf', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOf'];
        list.forEach(function(el) {
            if (adminProps.indexOf(el.propertyURI) === -1){
                out.push(el);
            }
        });
        return out;
    }
    includesProperty(list, resource, property) {
        let out = false;
        list.forEach(function(el) {
            if (el.r === resource && el.p === property){
                out = true;
                return out;
            }
        });
        return out;
    }
    checkAccess(user, graph, resource, property) {
        if(parseInt(user.isSuperUser)){
            return {access: true, type: 'full'};
        }else{
            if(graph && user.editorOfGraph.indexOf(graph) !==-1){
                return {access: true, type: 'full'};
            }else{
                if(resource && user.editorOfResource.indexOf(resource) !==-1){
                    return {access: true, type: 'full'};
                }else{
                    if(property && this.includesProperty(user.editorOfProperty, resource, property)){
                        return {access: true, type: 'partial'};
                    }else{
                        let fieldsW = [];
                        let checkF = 0;
                        //handling user specific roles like PRB
                        if(user.member.indexOf('http://rdf.risis.eu/user/PRB') !== -1){
                            fieldsW.push('http://rdf.risis.eu/application/decisionPRB');
                            fieldsW.push('http://rdf.risis.eu/application/evaluationPRB');
                            checkF = 1;
                        }
                        if(user.member.indexOf('http://rdf.risis.eu/user/FCB') !== -1){
                            fieldsW.push('http://rdf.risis.eu/application/decisionFCB');
                            checkF = 1;
                        }
                        if(!checkF){
                            return {access: false};
                        }else{
                            return {access: true, type: 'partial'};
                        }
                    }
                }
            }
        }
    }
    //--------------------------------------------------------
}
export default ResourceUtil;
