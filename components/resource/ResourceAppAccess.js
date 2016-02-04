import React from 'react';
import PropertyReactor from '../reactors/PropertyReactor';
import {authGraphName} from '../../configs/general';
import {NavLink} from 'fluxible-router';
import URIUtil from '../utils/URIUtil';
class ResourceAppAccess extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        //scroll to top of the page
        if(this.props.config && this.props.config.readOnly){
            let body = $("html, body");
            body.stop().animate({scrollTop:0}, '500', 'swing', function() {
            });
        }
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
        if(this.props.enableAuthentication) {
            if(user){
                if(parseInt(user.isSuperUser)){
                    return {access: true, type: 'full'};
                }else{
                    if(graph && user.editorOfGraph.indexOf(graph) !== -1){
                        return {access: true, type: 'full'};
                    }else{
                        if(resource && user.editorOfResource.indexOf(resource) !== -1){
                            return {access: true, type: 'full'};
                        }else{
                            if(property && this.includesProperty(user.editorOfProperty, resource, property)){
                                return {access: true, type: 'partial'};
                            }else{
                                return {access: false};
                            }
                        }
                    }
                }
            }else{
                return {access: false};
            }
        }else{
            return {access: true, type: 'full'};
        }
    }
    render() {
        let readOnly = 1;
        let user = this.context.getUser();
        let self = this;
        let usertURI, datasetURI, applicantDIV, dataRequestedDIV, purposeOfUseDIV, technicalSpecificationDIV, ndaFormDIV, datasetDIV, decisionDSODIV, commentOnDecDIV, accessLevel, isWriteable, configReadOnly;
        if(self.props.readOnly !== 'undefined'){
            readOnly = self.props.readOnly;
        }else{
            //check the config for resource
            if(self.props.config && self.props.config.readOnly !== 'undefined'){
                readOnly = self.props.config.readOnly;
            }
        }
        if(!user){
            return (
                <div className="ui page grid" ref="resource" itemScope itemType={this.props.resourceType} itemID={this.props.resource}>
                    <div className="ui row">
                      <div className="column">
                          <div className="ui segment content">
                              <div className="ui warning message">
                                  <h3>
                                    Authentication is required for this action!
                                  </h3>
                                  <div className="header"> Please <a href="/register">Register</a> or <a href="/login">Login</a> to be able to perform the action.</div></div>
                          </div>
                      </div>
                  </div>
                </div>
            )
        }else{
            //create a list of properties
            let list = this.props.properties.map(function(node, index) {
                //if there was no config at all or it is hidden, do not render the property
                if(!node.config || !node.config.isHidden){
                    //for readOnly, we first check the defautl value then we check readOnly value of each property if exists
                    //this is what comes from the config
                    if(readOnly){
                        configReadOnly = true;
                    }else{
                        //it property is readOnly from config
                        if(node.config){
                            if(node.config.readOnly){
                                configReadOnly = true;
                            }else{
                                //check access levels
                                accessLevel = self.checkAccess(user, self.props.graphName, self.props.resource, node.propertyURI);
                                if(accessLevel.access){
                                    //temporary hack to allow only decision and comment writeable
                                    let fieldsW = ['http://rdf.risis.eu/application/decisionDSO', 'http://rdf.risis.eu/application/evaluationDSO'];
                                    if(fieldsW.indexOf(node.propertyURI) == -1 && (!parseInt(user.isSuperUser))){
                                        configReadOnly = true;
                                    }else{
                                        configReadOnly = false;
                                    }
                                }else{
                                    configReadOnly = true;
                                }
                            }
                        }else{
                            //check access levels
                            accessLevel = self.checkAccess(user, self.props.graphName, self.props.resource, node.propertyURI);
                            if(accessLevel.access){
                                configReadOnly = false;
                            }else{
                                configReadOnly = true;
                            }
                        }
                    }
                    if(node.propertyURI === 'http://rdf.risis.eu/application/dataRequested'){
                        dataRequestedDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/purposeOfUse'){
                        purposeOfUseDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/technicalSpecification'){
                        technicalSpecificationDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/dataset'){
                        datasetURI= node.instances[0].value;
                        datasetDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/applicant'){
                        usertURI= node.instances[0].value;
                        applicantDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/decisionDSO'){
                        decisionDSODIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/commentOnDecision'){
                        commentOnDecDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    } else if(node.propertyURI === 'http://rdf.risis.eu/application/ndaForm'){
                        ndaFormDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else{
                        return (
                            <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                        );
                    }
                }
            });
            //another check
            if((user.editorOfGraph.indexOf(datasetURI) === -1) && !parseInt(user.isSuperUser) && (user.id !== usertURI)){
                return (
                    <div className="ui page grid" ref="resource" itemScope itemType={this.props.resourceType} itemID={this.props.resource}>
                        <div className="ui row">
                          <div className="column">
                              <div className="ui segment content">
                                  <div className="ui warning message">
                                      <h3>
                                        Authentication is required for this action!
                                      </h3>
                                      <div className="header"> Please <a href="/register">Register</a> or <a href="/login">Login</a> to be able to perform the action.</div></div>
                              </div>
                          </div>
                      </div>
                    </div>
                )
            }
            let currentCategory, mainDIV, tabsDIV, tabsContentDIV;
            //categorize properties in different tabs
            if(this.props.config.usePropertyCategories){
                currentCategory = this.props.currentCategory;
                if(!currentCategory){
                    currentCategory = this.props.config.propertyCategories[0];
                }
            const changeTab = {'overview': 'Overview', 'people': 'People', 'date': 'Date', 'legalAspects': 'Legal Aspects', 'access': 'Access/Visit', 'technicalAspects': 'Technical Aspects', 'structuralAspects': 'Content/Structural Aspects'};
                tabsDIV = this.props.config.propertyCategories.map(function(node, index) {
                    return (
                        <NavLink className={(node === currentCategory ? 'item link active' : 'item link')} key={index} routeName="resource" href={'/dataset/' + encodeURIComponent(self.props.graphName) + '/resource/' + encodeURIComponent(self.props.resource) + '/' + node + '/' + encodeURIComponent(self.props.propertyPath)}>
                          {(changeTab[node] ? changeTab[node] : node) }
                        </NavLink>
                    );
                });
                tabsContentDIV = this.props.config.propertyCategories.map(function(node, index) {
                    return (
                        <div key={index} className={(node === currentCategory ? 'ui bottom attached tab segment active' : 'ui bottom attached tab segment')}>
                            <div className="ui grid">
                                <div className="column ui list">
                                    {applicantDIV}
                                    {dataRequestedDIV}
                                    {purposeOfUseDIV}
                                    {technicalSpecificationDIV}
                                    {ndaFormDIV}
                                    {decisionDSODIV}
                                    {commentOnDecDIV}
                                    {datasetDIV}
                                    {(node === currentCategory ? list : '')}
                                </div>
                            </div>
                        </div>
                    );
                });
                mainDIV = <div>
                            <div className="ui top attached tabular menu">
                                {tabsDIV}
                            </div>
                            {tabsContentDIV}
                          </div>;
            }else{
                mainDIV = <div className="ui segment">
                                <div className="ui grid">
                                    <div className="column ui list">
                                        {applicantDIV}
                                        <h2 className="ui dividing header orange">Data requested and purpose</h2>
                                        {dataRequestedDIV}
                                        {purposeOfUseDIV}
                                        {technicalSpecificationDIV}
            							<h2 className="ui dividing orange header">Non-disclosure Agreement</h2>
                                        {ndaFormDIV}
                                        <h2 className="ui dividing brown header">Decision</h2>
                                        {decisionDSODIV}
                                        {commentOnDecDIV}
                                        <h2 className="ui dividing orange header">Misc.</h2>
                                        {datasetDIV}
                                        {list}
                                    </div>
                                </div>
                          </div>;
            }
            let breadcrumb;
            if(self.props.propertyPath.length > 1){
                breadcrumb = <div className="ui large breadcrumb">
                              <a className="section" href={'/dataset/' + encodeURIComponent(self.props.graphName) + '/resource/' + encodeURIComponent(self.props.propertyPath[0])}>{self.props.propertyPath[0]}</a>
                              <i className="right chevron icon divider"></i>
                              <div className="active section">{URIUtil.getURILabel(self.props.propertyPath[1])}</div>
                            </div>;
            }
            return (
                <div className="ui page grid" ref="resource" itemScope itemType={this.props.resourceType} itemID={this.props.resource}>
                    <div className="ui column">
                        {breadcrumb}
                        <h2>
                            {this.props.isComplete ? '' : <img src="/assets/img/loader.gif" alt="loading..."/>}
                            <a target="_blank" href={'/export/NTriples/' + encodeURIComponent(this.props.graphName) + '/' + encodeURIComponent(this.props.resource)}><i className="blue icon cube"></i></a>Application {URIUtil.getURILabel(this.props.resource)}
                        </h2>
                        {mainDIV}
                    </div>
                </div>
            );
        }

    }
}
ResourceAppAccess.contextTypes = {
    getUser: React.PropTypes.func
};
export default ResourceAppAccess;
