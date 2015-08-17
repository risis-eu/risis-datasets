import React from 'react';

class HelpModal extends React.Component {
    render() {
        return (
            <div className="ui modal">
              <i className="close icon"></i>
              <div className="header">
                Authentication is required for this action!
              </div>
              <div className="content">
                <div className="description">
                    <div className="ui warning message"><div className="header"> Please <a href="/register">Register</a> or <a href="/login">Login</a> to be able to perform the action.</div></div>
                </div>
              </div>
            </div>
        );
    }
}

export default HelpModal;
