'use strict';
var React = require('react');

class Home extends React.Component {
    render() {
        return (
            <div className="ui page grid" ref="home">
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
                      <div className="item">
                        <i className="ui yellow large database middle aligned icon"></i>
                        <div className="content">
                          <a className="header">EUPRO</a>
                          <div className="description">Updated 10 mins ago</div>
                        </div>
                      </div>
                      <div className="item">
                        <i className="ui yellow large database middle aligned icon"></i>
                        <div className="content">
                          <a className="header">ETER</a>
                          <div className="description">Updated 22 mins ago</div>
                        </div>
                      </div>
                      <div className="item">
                        <i className="ui yellow large database middle aligned icon"></i>
                        <div className="content">
                          <a className="header">NANO</a>
                          <div className="description">Updated 34 mins ago</div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = Home;
