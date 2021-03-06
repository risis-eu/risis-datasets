'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';
import {appFullTitle, appShortTitle, enableAuthentication} from '../configs/general';
import CookieBanner from 'react-cookie-banner';


class Nav extends React.Component {
    componentDidMount(){
        let currentComp = this.refs.defaultNavbar;
        $(currentComp).find('.ui.dropdown').dropdown();
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
                                    {(parseInt(user.isSuperUser) || user.member.indexOf('http://rdf.risis.eu/user/PRB') !== -1 || user.member.indexOf('http://rdf.risis.eu/user/FCB') !== -1) ? <NavLink className="item" routeName="users" href="/users">Users List</NavLink> : ''}
                                    {(parseInt(user.isSuperUser) || user.member.indexOf('http://rdf.risis.eu/user/PRB') !== -1 || user.member.indexOf('http://rdf.risis.eu/user/FCB') !== -1 || user.member.indexOf('http://rdf.risis.eu/user/DatasetCoordinators') !== -1) ? <NavLink className="item" routeName="applications" href="/applications">Applications List</NavLink> : ''}
                                    <a href="/logout" className="item">Logout</a>
                                </div>
                            </div>;
            }else{
                userMenu = <div className="ui right item"> <a className="ui mini button" href="/login">Sign-in</a> &nbsp;  <a href="/register" className="ui mini violet button">Register</a> </div>;
            }
        }
        return (
            <nav ref="defaultNavbar" className="ui black menu inverted navbar page grid page-header">
                    <CookieBanner message='This website uses cookies to ensure you get the best experience on our website.' cookie='user-has-accepted-cookies' dismissOnScroll={true} />
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
