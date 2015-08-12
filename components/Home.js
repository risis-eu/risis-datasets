'use strict';
var React = require('react');

class Home extends React.Component {
    render() {
        return (
            <div className="ui page grid" ref="home">
              <div className="ui row">
                <div className="column">
                    <div className="ui segment content">
                        <h2 className="ui header">RISIS Datasets Portal</h2>
                    </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = Home;
