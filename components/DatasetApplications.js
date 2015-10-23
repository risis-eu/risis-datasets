import React from 'react';
import {applicationsGraphName} from '../configs/general';
import UserApplicationStore from '../stores/UserApplicationStore';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction, NavLink} from 'fluxible-router';

class DatasetApplications extends React.Component {
    componentDidMount() {

    }

    render() {
        let cssClass;
        let list = this.props.UserApplicationStore.applications.map(function(node, index) {
            if(node.status === 'submitted'){
                cssClass = 'animated fadeIn warning';
            }else if (node.status === 'positive advice'){
                cssClass = 'animated fadeIn positive';
            }else if (node.status === 'negative advice'){
                cssClass = 'animated fadeIn negative';
            }
            return (
                <tr className={cssClass} key={index}>
                  <td>
                      <NavLink routeName="datasetApplications" href={'/dataset/' + encodeURIComponent(applicationsGraphName) + '/resource/' + encodeURIComponent(node.uri)}>
                          {index+1}
                      </NavLink>
                  </td>
                  <td>
                    <NavLink routeName="datasetApplications" href={'/dataset/' + encodeURIComponent(applicationsGraphName) + '/resource/' + encodeURIComponent(node.uri)}>
                      {node.type}
                    </NavLink>
                  </td>
                  <td>{node.dataset}</td>
                  <td>{node.created}</td>
                  <td>{node.status}</td>
                </tr>
            )
        });
        return (
            <div className="ui page grid" ref="datasetApplications">
                <div className="row">
                  <div className="column">
                    <h1 className="ui header"><a target="_blank" href={'/export/NTriples/' + encodeURIComponent(applicationsGraphName)}><span className="ui big black circular label">{this.props.UserApplicationStore.applications.length}</span></a> Datset Visit/Access Requests</h1>
                      <div className="ui segment">
                          <table className="ui celled table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Type</th>
                                <th>Dataset</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                                {list}
                            </tbody>
                          </table>
                      </div>
                  </div>
                </div>
            </div>
        )
    }
}
DatasetApplications.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};
DatasetApplications = connectToStores(DatasetApplications, [UserApplicationStore], function (context, props) {
    return {
        UserApplicationStore: context.getStore(UserApplicationStore).getState()
    };
});
export default DatasetApplications;
