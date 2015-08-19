'use strict';
import React from 'react';
import DatasetStore from '../stores/DatasetStore';
import UserApplicationStore from '../stores/UserApplicationStore';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import loadUserApplications from '../actions/loadUserApplications';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {welcomeMode: 1}
    }
    handleWelcome() {
        this.setState({welcomeMode: 0});
    }
    handleAccessRequest(name, resourceURI) {
        let user = this.context.getUser();
        if(!user){
            $('.ui.modal').modal('show');
        }else{
            location.href = '/accessRequest/' + name;
        }
    }
    handleVisitRequest(name, resourceURI) {
        let user = this.context.getUser();
        if(!user){
            $('.ui.modal').modal('show');
        }else{
            location.href = '/visitRequest/' + name;
        }
    }
    componentDidMount() {
        let currentComp = this.refs.home.getDOMNode();
        //enable hints
        /*global $*/
        $(currentComp).find('.hint')
        .popup({
            hoverable: true,
            position : 'bottom left',
        });
        //check applications of the current user if logged in
        let user = this.context.getUser();
        if(user){
            this.context.executeAction(loadUserApplications, {});
        }
    }
    prepareDatasetApplication(){
        let out = {};
        this.props.UserApplicationStore.applications.forEach(function(el) {
            if(out[el.dataset]){
                out[el.dataset][el.type] = {status: el.status, created: el.created};
            }else{
                out[el.dataset] = {};
                out[el.dataset][el.type] = {status: el.status, created: el.created};
            }
        });
        return out;
    }
    render() {
        let applications = this.prepareDatasetApplication();
        let user = this.context.getUser();
        let list;
        let self = this;
        let accessRequestDIV = '';
        let visitRequestDIV = '';
        if(this.props.DatasetStore.dataset.resources){
            list = this.props.DatasetStore.dataset.resources.map(function(node, index) {
                //hide example dataset
                if(node.g === 'http://rdf.risis.eu/dataset/example/1.0/void.ttl#'){
                    if(user && user.accountName === 'demo'){
                        //show the example one
                    }else{
                        return;
                    }
                }
                accessRequestDIV = <div onClick={self.handleAccessRequest.bind(self, node.name, node.v)} className="ui small button hint" data-variation="inverted" data-content={'This option will guide you through the procedure to apply for accessing "' + node.title + '" data.'}><i className="ui privacy icon"></i>Access Request</div>;
                visitRequestDIV = <div onClick={self.handleVisitRequest.bind(self, node.name, node.v)} className="ui small button hint" data-variation="inverted" data-content={'This option will guide you through the procedure to apply for a site visit on "' + node.title + '".'}><i className="ui travel icon"></i>Visit Request</div>;
                switch (node.accessType) {
                case 'Access and Visit':
                    if(node.openingStatus === 'Opening Soon'){
                        accessRequestDIV = <div className="ui small button basic">Opening Soon...</div>;
                        visitRequestDIV = '';
                    }
                    break;
                case 'Access Only':
                    visitRequestDIV = '';
                    if(node.openingStatus === 'Opening Soon'){
                        accessRequestDIV = <div className="ui small button basic">Opening Soon...</div>;
                    }
                    break;
                case 'Visit Only':
                    accessRequestDIV = '';
                    if(node.openingStatus === 'Opening Soon'){
                        visitRequestDIV = <div className="ui small button basic">Opening Soon...</div>;
                    }
                    break;
                }
                if(applications[node.g]){
                    let cssV = 'ui small button';
                    if(applications[node.g].VisitRequestApplication){
                        if(applications[node.g].VisitRequestApplication.status === 'submitted'){
                            cssV = cssV + ' orange';
                        }
                        if(applications[node.g].VisitRequestApplication.status === 'approved'){
                            cssV = cssV + ' green';
                        }
                        if(applications[node.g].VisitRequestApplication.status === 'rejected'){
                            cssV = cssV + ' red';
                        }
                        visitRequestDIV = <div className={cssV}>Visit Request {applications[node.g].VisitRequestApplication.status}</div>;
                    }
                    let cssA = 'ui small button';
                    if(applications[node.g].AccessRequestApplication){
                        if(applications[node.g].AccessRequestApplication.status === 'submitted'){
                            cssA = cssA + ' orange';
                        }
                        if(applications[node.g].AccessRequestApplication.status === 'approved'){
                            cssA = cssA + ' green';
                        }
                        if(applications[node.g].AccessRequestApplication.status === 'rejected'){
                            cssA = cssA + ' red';
                        }
                        accessRequestDIV = <div className={cssA}> Access Request {applications[node.g].AccessRequestApplication.status}</div>;
                    }
                }
                return (
                    <div className="item" key={index}>
                      <div className="right floated">
                          {accessRequestDIV}
                          {visitRequestDIV}
                      </div>
                      <i className="ui yellow large database middle aligned icon"></i>
                      <div className="content">
                        <a className="header" routeName="resource" href={'/metadata/' + encodeURIComponent(node.name)}>{node.title}</a>
                        <div className="description">{node.desc}</div>
                      </div>
                    </div>
                );
            });
        }
        return (
            <div className="ui page grid homepage-body" ref="home">
              <div className="ui row">
                <div className="center aligned column">
                    {!this.state.welcomeMode ? '' :
                        <div className="ui left aligned segment message">
                          <i className="close icon" onClick={this.handleWelcome.bind(this)}></i>
                          <div className="header">
                            Welcome to RISIS Datasets Portal!
                          </div>
                          <p>
                              Access to RISIS datasets is offered through a two-step process:
                              <ul>
                                  <li>
                                      <b>Accreditation</b>: researchers need to register and agree on the conditions of use (good use of data, authorship, mentions to the RISIS project, agreement of posting results and aggregated datasets produced on RISIS website) via signing a charter of good use.
                                  </li>
                                  <li>
                                      <b>Selection</b>: researchers need to develop a project based upon the mobilisation of one or more datasets. Projects are reviewed both by the relevant dataset producers and by the RISIS project review board that will give the final agreement for access.
                                  </li>
                              </ul>
                              * Cost for travel and on site stay (when needed) will be covered by the <a href="http://risis.eu">RISIS project</a>.
                          </p>
                        </div>
                    }
                    <div className="ui">
                        <div className="ui fluid category search">
                          <div className="ui large icon input">
                            <input className="prompt" type="text" placeholder="Search within RISIS datasets..." style={{width: '500'}}/>
                            <i className="search icon"></i>
                          </div>
                          &nbsp;<button className="ui grey circular button">Advanced Search</button>
                          <div className="results"></div>
                        </div>
                    </div>
                </div>
              </div>
              <div className="ui row">
                <div className="column">

                    <div className="ui relaxed divided list segment">
                        {list}
                    </div>
                </div>
              </div>
            </div>
        );
    }
}
Home.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};
Home = connectToStores(Home, [DatasetStore], function (context, props) {
    return {
        DatasetStore: context.getStore(DatasetStore).getState()
    };
});
Home = connectToStores(Home, [UserApplicationStore], function (context, props) {
    return {
        UserApplicationStore: context.getStore(UserApplicationStore).getState()
    };
});
module.exports = Home;
