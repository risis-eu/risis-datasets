'use strict';
import React from 'react';
import DatasetStore from '../stores/DatasetStore';
import {connectToStores} from 'fluxible-addons-react';

class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {welcomeMode: 1}
    }
    handleWelcome() {
        this.setState({welcomeMode: 0});
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
    }
    render() {
        let list;
        let self = this;
        if(this.props.DatasetStore.dataset.resources){
            list = this.props.DatasetStore.dataset.resources.map(function(node, index) {
                return (
                    <div className="item" key={index}>
                      <div className="right floated">
                          <div className="ui small button hint" data-variation="inverted" data-content={'This option will guide you through the procedure to apply for accessing "' + node.title + '" data.'}><i className="ui privacy icon"></i>Access Request</div>
                          <div className="ui small button hint" data-variation="inverted" data-content={'This option will guide you through the procedure to apply for a site visit on "' + node.title + '".'}><i className="ui travel icon"></i>Visit Request</div>
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
                              * Cost for travel and on site stay (when needed) will be covered by the RISIS project.
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
    getUser: React.PropTypes.func
};
Home = connectToStores(Home, [DatasetStore], function (context, props) {
    return {
        DatasetStore: context.getStore(DatasetStore).getState()
    };
});
module.exports = Home;
