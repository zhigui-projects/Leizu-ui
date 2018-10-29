import React, { Component } from 'react';
// import { Icon, Button, Table, Pagination, Modal, Form, Input } from 'antd';
import OrgaManagement from './components/OrgaManagement/index';
import PeerManagement from './components/PeerManagement/index';
import { Switch, Redirect, Route } from 'react-router-dom';



class Organization extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <div className="organization-management">
                <Switch>
                    <Route path="/dashboard/organization_management/organization" component={OrgaManagement} />
                    <Redirect exact from="/dashboard/organization_management" to="/dashboard/organization_management/organization" />
                    <Route path="/dashboard/organization_management/peer" component={PeerManagement} />
                    <Route path="/dashboard/organization_management/*" render={(props) => <Redirect to='/dashboard/organization_management/organization' />} />
                </Switch>
            </div>
        )
    }
}
export default Organization;