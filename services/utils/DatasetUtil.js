'use strict';
class DatasetUtil{
    constructor() {

    }
    getPropertyLabel(uri) {
        let property = '';
        let tmp = uri;
        let tmp2 = tmp.split('#');
        if(tmp2.length > 1){
            property = tmp2[1];
        }else{
            tmp2 = tmp.split('/');
            property = tmp2[tmp2.length - 1];
        }
        return property;
    }
    parseDatasetsList(body) {
      let parsed = JSON.parse(body);
      let output=[];
      if(parsed.results.bindings.length){
        parsed.results.bindings.forEach(function(el) {
          let tmp=el.subject.value;
          let tmp2=tmp.split('#');
          tmp=tmp2[1];
          tmp2=tmp.split('_rdf_dataset');
          let name=tmp2[0];
          output.push({title: el.title.value, desc: el.desc.value, name: name, v: el.subject.value, g: el.dataset.value, openingStatus: el.openingStatus.value, accessType: el.accessType.value});
        });
        return output;
      }
    }
    getResourceFocusType(config){
        let output = [];
        if(config){
            if(config.resourceFocusType){
                output = config.resourceFocusType;
            }else{
                output = [];
            }
        }else{
            output = [];
        }
        return output;
    }
    parseResourcesByType(body, graphName) {
      let output = [];
      let parsed = JSON.parse(body);
      if(parsed.results.bindings.length){
          if(String(graphName)===''){
              parsed.results.bindings.forEach(function(el) {
                output.push( {v: el.resource.value, g: el.graphName? el.graphName.value : 0, title: el.title? el.title.value : '', label: el.label? el.label.value: ''});
              });
          }else{
              parsed.results.bindings.forEach(function(el) {
                output.push( {v: el.resource.value, g: graphName, title: el.title? el.title.value : '', label: el.label? el.label.value: ''});
              });
          }
      }
      return output;
    }
    parseCountResourcesByType(body) {
      let total = 0;
      let parsed = JSON.parse(body);
      if(parsed.results.bindings.length){
          total = parsed.results.bindings[0].total.value;
      }
      return total;
    }
}
export default DatasetUtil;
