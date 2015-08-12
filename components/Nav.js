'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';
import {appFullTitle, appShortTitle, enableAuthentication} from '../configs/general';

class Nav extends React.Component {
    componentDidMount(){
        let currentComp = this.refs.defaultNavbar.getDOMNode();
        $(currentComp).find('.ui.dropdown').dropdown();
    }
    showHelpModal() {
        /*global $*/
        $('.ui.modal').modal('show');
    }
    render() {
        let user = this.context.getUser();
        // console.log(user);
        let userMenu;
        if(enableAuthentication){
            if(user){
                userMenu = <div className="ui right dropdown item">
                                {user.accountName} <i className="dropdown icon"></i>
                                <div className="menu">
                                    <NavLink className="item" routeName="resource" href={'/dataset/' + encodeURIComponent(user.graphName) + '/resource/' + encodeURIComponent(user.id)}>Profile</NavLink>
                                    {parseInt(user.isSuperUser) ? <NavLink className="item" routeName="users" href="/users">Users List</NavLink> : ''}
                                    <a href="/logout" className="item">Logout</a>
                                </div>
                            </div>;
            }else{
                userMenu = <div className="ui right item"> <a className="ui mini circular teal button" href="/login">Sign-in</a> &nbsp;  <a href="/register" className="ui mini circular yellow button">Register</a> </div>;
            }
        }
        return (
            <nav ref="defaultNavbar" className="ui black menu inverted navbar page grid">
                    <NavLink routeName="home" className="brand item" activeClass="activei"><img className="ui image" src="/assets/img/risis_logo_full.jpg" alt="RISIS" /></NavLink>
                    <NavLink routeName="home" className="brand item header" activeClass="active"> Datasets Portal</NavLink>
                    <a className="ui item blue label" href="http://sms.risis.eu">SMS Platform</a>
                    <a className="ui item teal label" href="http://cortext.risis.eu">Cortext Platform</a>
                    <div className="right menu">
                    </div>
                    <div className="right menu">
                        {userMenu}
                    </div>
            </nav>
        );
    }
}
Nav.contextTypes = {
    getUser: React.PropTypes.func
};
export default Nav;
