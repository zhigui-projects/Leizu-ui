/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React, { Component } from 'react';
import { Table, Form, Spin, Button, Icon } from 'antd';
import intl from 'react-intl-universal'
import request from '../../../../Utils/Axios';
import axios from 'axios';
import apiconfig from '../../../../Utils/apiconfig';
import Cookies from 'js-cookie'
// const FormItem = Form.Item;
const { api: { organization: { orgList },organize:{organization} } } = apiconfig;
const CancelToken = axios.CancelToken;
let cancel;

class OrgaManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orgData: [],
            loading: true
        }
    }
    createOrganization=()=>{
        this.props.history.push('organization_management/create');
    }
    handlePeer = (record) => {
        localStorage.setItem('orgName',record.name);
        this.props.history.push({
            pathname: 'organization_management/peer',
            state: record
        });
    }

    getOrgData = (id) => {
        request().get(`${organization.format({id:id})}`, {
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
            })
        }).then(res => {
            console.log(res)
            if (res) {
                switch (res.status) {
                    case 200:
                        this.setState({
                            orgData: res.data.data != null ? res.data.data : [],
                            loading: false
                        })
                        break;
                    case 401:
                        Cookies.remove('userNameInfo')
                        Cookies.remove('token')
                        this.props.history.push('/login')
                        break;
                    default:
                        return ''

                }
            }
        })
    }
    componentDidMount() {
        let temp = sessionStorage.getItem('ConsortiumInfo')
        if(temp){
            temp = JSON.parse(temp)
            this.getOrgData(temp._id)
        }
    }
    componentWillUnmount() {
        if (cancel) {
            cancel();
        }
        this.setState = () => {
            return;
        };
    }
    render() {
        const columns = [{
            title: intl.get("Org_Name"),
            dataIndex: 'name',
            width: '43%',
            key: 'name',
        }, {
            title: intl.get("Node_Count"),
            dataIndex: 'peer_count',
            width: '28%',
            key: 'number',
        }, {
            title: intl.get("Operation"),
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => (
                <span onClick={this.handlePeer.bind(this, record)} style={{ color: '#3d70b1', cursor: 'pointer' }}>{intl.get("Node_Manage")}</span>
            )
        }];
        // const { getFieldDecorator } = this.props.form;
        // const FormItemLayout = {
        //     labelCol: {
        //         xs: { span: 24 },
        //         sm: { span: 4 },
        //     },
        //     wrapperCol: {
        //         xs: { span: 24 },
        //         sm: { span: 16 },
        //     },
        // }
        return (
            <div className="organization-management">
                <div className="organization-wrapper">
                    <p className="create-organization">
                        <Button id="create" onClick={this.createOrganization} className="create-plus">{intl.get("Create_Org")}<Icon type="plus-circle" theme="outlined" /></Button>
                    </p>
                    <Spin spinning={this.state.loading}>

                        <Table
                            columns={columns}
                            dataSource={this.state.orgData || []}
                            rowKey={record => record.id}
                        />
                    </Spin>
                    {/* <Pagination total={this.state.orgData.length} showSizeChanger showQuickJumper /> */}
                </div>
            </div>
        )
    }
}
OrgaManagement = Form.create()(OrgaManagement);
export default OrgaManagement;