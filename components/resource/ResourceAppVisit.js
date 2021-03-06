import React from 'react';
import PropertyReactor from '../reactors/PropertyReactor';
import {authGraphName} from '../../configs/general';
import {NavLink} from 'fluxible-router';
import URIUtil from '../utils/URIUtil';
class ResourceAppVisit extends React.Component {
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
        let usertURI, dataRequestedDIV, scientificBgDIV, datasetURI, applicantDIV, projectTitleDIV, projectSummaryDIV, hostingLocationDIV, prefferedVisitDatesDIV, visitDurationDIV, travelBudgetDIV, accommodationBudgetDIV, totalBudgetDIV, budgetRemarksDIV, projectAcronymDIV, projectObjectivesDIV,isVirtualUserDIV,isProjectLeaderDIV,isNewUserOfDataDIV, projectDescAnnexsDIV, cvAnnexDIV, datasetDIV, decisionDSODIV, evaluationDSODIV, decisionPRBDIV, evaluationPRBDIV, decisionFCBDIV, accessLevel, isWriteable, configReadOnly;
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
                        if(node.config && node.config.readOnly){
                            configReadOnly = true;
                        }else{
                            if(parseInt(user.isSuperUser)){
                                configReadOnly = false;
                            }else{
                                let checkF = 0;
                                //determine which fields are writeable
                                let fieldsW = [];
                                accessLevel = self.checkAccess(user, self.props.graphName, self.props.resource, node.propertyURI);
                                if(accessLevel.access){
                                    fieldsW.push('http://rdf.risis.eu/application/decisionDSO');
                                    fieldsW.push('http://rdf.risis.eu/application/evaluationDSO');
                                    //fieldsW.push('http://rdf.risis.eu/application/commentOnDecision');
                                    checkF = 1;
                                }
                                // if(user.member.indexOf('http://rdf.risis.eu/user/DatasetCoordinators') !== -1){
                                //     checkF = 1;
                                // }
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
                                    configReadOnly = true;
                                }else{
                                    //console.log(node.propertyURI, fieldsW.indexOf(node.propertyURI));
                                    if(fieldsW.indexOf(node.propertyURI) == -1){
                                        configReadOnly = true;
                                    }else{
                                        configReadOnly = false;
                                    }
                                }
                            }
                        }
                    }
                    if(node.propertyURI === 'http://rdf.risis.eu/application/projectTitle'){
                        projectTitleDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/dataRequested'){
                        dataRequestedDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/projectSummary'){
                        projectSummaryDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/prefferedVisitDates'){
                        prefferedVisitDatesDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/visitDuration'){
                        visitDurationDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/travelBudget'){
                        travelBudgetDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/accommodationBudget'){
                        accommodationBudgetDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/totalBudget'){
                        totalBudgetDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/budgetRemarks'){
                        budgetRemarksDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/projectDescAnnex'){
                        projectDescAnnexsDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/dataset'){
                        datasetURI= node.instances[0].value;
                        datasetDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/applicant'){
                        usertURI= node.instances[0].value;
                        applicantDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/scientificBg'){
                        scientificBgDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/projectAcronym'){
                        projectAcronymDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/projectObjectives'){
                        projectObjectivesDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/isVirtualUser'){
                        isVirtualUserDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/isProjectLeader'){
                        isProjectLeaderDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/isNewUserOfData'){
                        isNewUserOfDataDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/cvAnnex'){
                        cvAnnexDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/decisionDSO'){
                        decisionDSODIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/evaluationDSO'){
                        evaluationDSODIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/decisionPRB'){
                        decisionPRBDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/evaluationPRB'){
                        evaluationPRBDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else if (node.propertyURI === 'http://rdf.risis.eu/application/decisionFCB'){
                        decisionFCBDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    } else if(node.propertyURI === 'http://rdf.risis.eu/application/hostingLocation'){
                        hostingLocationDIV = <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                    }else{
                        return (
                            <PropertyReactor key={index} enableAuthentication={self.props.enableAuthentication} spec={node} readOnly={configReadOnly} config={node.config} graphName={self.props.graphName} resource={self.props.resource} property={node.propertyURI} propertyPath= {self.props.propertyPath}/>
                        );
                    }
                }
            });
            //another check
            if((user.editorOfGraph.indexOf(datasetURI) === -1) && !parseInt(user.isSuperUser) && (user.id !== usertURI) && (user.member.indexOf('http://rdf.risis.eu/user/PRB') === -1 && user.member.indexOf('http://rdf.risis.eu/user/FCB') === -1)){
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
                                    {projectTitleDIV}
                                    {projectAcronymDIV}
                                    {projectSummaryDIV}
                                    {projectObjectivesDIV}
                                    {dataRequestedDIV}
                                    {projectDescAnnexsDIV}
                                    {hostingLocationDIV}
                                    {prefferedVisitDatesDIV}
                                    {visitDurationDIV}
                                    {travelBudgetDIV}
                                    {accommodationBudgetDIV}
                                    {totalBudgetDIV}
                                    {budgetRemarksDIV}
                                    {scientificBgDIV}
                                    {cvAnnexDIV}
                                    {isNewUserOfDataDIV}
                                    {isProjectLeaderDIV}
                                    {isVirtualUserDIV}
                                    {decisionDSODIV}
                                    {evaluationDSODIV}
                                    {decisionPRBDIV}
                                    {evaluationPRBDIV}
                                    {decisionFCBDIV}
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
                                        <h2 className="ui dividing header orange">Project</h2>
                                        {projectTitleDIV}
                                        {projectAcronymDIV}
                                        {projectSummaryDIV}
                                        {projectObjectivesDIV}
                                        {dataRequestedDIV}
                                        {projectDescAnnexsDIV}
            							<h2 className="ui dividing orange header">Visit Data</h2>
                                        {hostingLocationDIV}
                                        {prefferedVisitDatesDIV}
                                        {visitDurationDIV}
                                        <h2 className="ui dividing orange header">Requested Budget (euros)</h2>
                                        {travelBudgetDIV}
                                        {accommodationBudgetDIV}
                                        {totalBudgetDIV}
                                        {budgetRemarksDIV}
                                        <h2 className="ui dividing orange header">Annex</h2>
                                            {scientificBgDIV}
                                            {cvAnnexDIV}
                                            {isNewUserOfDataDIV}
                                            {isProjectLeaderDIV}
                                            {isVirtualUserDIV}
                                        <h2 className="ui dividing brown header">Decision by Dataset Coordinator <a className="ui big brown label basic" href="http://risis.eu/wp-content/uploads/2016/04/RISIS_eval_visits_.doc"> <i className="download icon"></i> Evaluation Form</a></h2>
                                        {evaluationDSODIV}
                                        {decisionDSODIV}
                                        <h2 className="ui dividing violet header">Decision by Project Review Board (PRB) <a className="ui big violet label basic" href="http://risis.eu/wp-content/uploads/2016/04/RISIS_eval_visits_.doc"> <i className="download icon"></i> Evaluation Form</a></h2>
                                        {evaluationPRBDIV}
                                        {decisionPRBDIV}
                                        <h2 className="ui dividing purple header">Decision by Facility Coordination Board (FCB)</h2>
                                        {decisionFCBDIV}
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
ResourceAppVisit.contextTypes = {
    getUser: React.PropTypes.func
};
export default ResourceAppVisit;
