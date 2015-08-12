'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';


class Footer extends React.Component {
    componentDidMount(){

    }

    render() {
        return (
            <footer ref="defaultFooter" className="ui black menu inverted navbar page grid page-footer">
                    <div className="ui item brand">Copyright RISIS Consortium 2014 </div>
                    <a className="ui item" href="http://risis.eu/risis-code-of-conduct/"><i className="ui caret right icon"></i>RISIS Code of Conduct</a>
                    <a className="ui item" href="http://risis.eu/risis-registration/"><i className="ui caret right icon"></i>Rules for Visits and Reimbursement</a>
                    <a className="ui item" href="https://github.com/risis-eu"><i className="ui github icon"></i></a>
                    <a className="ui item" href="http://sms.risis.eu">SMS Platform</a>
                    <a className="ui item" href="http://cortext.risis.eu">Cortext Platform</a>
            </footer>
        );
    }
}

export default Footer;
