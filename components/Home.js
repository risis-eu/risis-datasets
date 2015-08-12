'use strict';
import React from 'react';
import DatasetStore from '../stores/DatasetStore';
import {connectToStores} from 'fluxible-addons-react';

class Home extends React.Component {
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
                          <div className="ui small button hint" data-variation="inverted" data-content="This option will guide you through the procedure to aply for data access."><i className="ui privacy icon"></i>Access Request</div>
                          <div className="ui small button hint" data-variation="inverted" data-content="This option will guide you through the procedure to apply for a dataset visit."><i className="ui travel icon"></i>Visit Request</div>
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
