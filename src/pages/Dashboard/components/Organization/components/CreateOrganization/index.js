/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React, { Component } from 'react';
import { Button, Input, Form, Icon, message } from 'antd';
import intl from 'react-intl-universal'
import apiconfig from '../../../../../../Utils/apiconfig';
import request from '../../../../../../Utils/Axios';
import axios from 'axios';
import Cookies from 'js-cookie';
const FormItem = Form.Item;
const { api: { organization: { orgList, createOrg, peerCheck } } } = apiconfig;

class CreateOrganization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formArr: [],
            count: 0,
            loading: false,
            display: false,
            checkResult: '',
            peer: false,
            paas: true
        }
    }
    componentDidMount() {

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let orgName = document.getElementById('org-name').value;
            let ip = values.ippeer1 + '.' + values.ippeer2 + '.' + values.ippeer3 + '.' + values.ippeer4;
            let check = {
                'host': ip,
                'username': values.sshuser,
                'password': values.sshpassword
            }
            request().post(peerCheck, check).then((res) => {
                if (res) {
                    switch (res.status) {
                        case 200:
                            this.setState({ checkResult: intl.get("Node_Detection_Passed"), paas: true });
                            if (!orgName) {
                                this.setState({ display: true });
                            }
                            else if (!err && orgName) {
                                this.setState({ loading: true });
                                let consortiumId = JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id;
                                let obj = {
                                    'name': orgName,
                                    'domainName': values.capeer,
                                    'host': ip,
                                    'username': values.sshuser,
                                    'password': values.sshpassword,
                                    'consortiumId': consortiumId,
                                }
                                request().post(orgList, obj).then((res) => {
                                    if (res.status == 200) {
                                        let options = {};
                                        options.channelType = 1;
                                        options.organizationId = res.data.data._id;
                                        request().post(createOrg, options).then((res) => {
                                            if (res) {
                                                this.setState({ loading: false });
                                                switch (res.status) {
                                                    case 200:
                                                        message.success(intl.get("Org_Created_Successfully"));
                                                        this.setState({ loading: false })
                                                        break;
                                                    case 400:
                                                        message.error(intl.get("Create_Failed"));
                                                        this.setState({ loading: false })
                                                        break;
                                                    case 401:
                                                        Cookies.remove('token');
                                                        Cookies.remove('userNameInfo');
                                                        sessionStorage.removeItem('projectData');
                                                        sessionStorage.removeItem('consortiumType');
                                                        this.props.history.push({
                                                            pathname: "/login"
                                                        })
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                        })
                                    } else if (res.status == 401) {
                                        Cookies.remove('token');
                                        Cookies.remove('userNameInfo');
                                        sessionStorage.removeItem('projectData');
                                        sessionStorage.removeItem('consortiumType');
                                        this.props.history.push({
                                            pathname: "/login"
                                        })
                                    } else {
                                        message.warning(res.data.msg);
                                        this.setState({ loading: false });
                                    }
                                })
                            }
                            break;
                        case 400:
                            this.setState({ checkResult: intl.get("Not_Pass_Input_Again"), loading: false, paas: false });
                            break;
                        case 401:
                            Cookies.remove('token');
                            Cookies.remove('userNameInfo');
                            sessionStorage.removeItem('projectData');
                            sessionStorage.removeItem('consortiumType');
                            this.props.history.push({
                                pathname: "/login"
                            })
                            break;
                    }
                }

            })

        })
    }
    handleChange = () => {
        this.setState({ display: false });
    }
    handleBack = () => {
        window.history.go(-1);
    }
    render() {
        const { display } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="create-organization">
                <div className="create-wrapper">
                    <div className="organization-wrapper">
                        <p className="wrapper-input"><span className="organization-name">{intl.get("Org_Name")}</span><Input onChange={this.handleChange} id="org-name" className="organization-input" /><span style={{ display: display ? '' : 'none' }} className="tip">请输入组织名称</span></p>
                        <p className="wrapper-peer"><span className="organization-name">{intl.get("New_Node_Node_Type")}</span><span className="peer">peer</span></p>
                        <div className="chaincode-mark">
                            <span className="mark">{intl.get("Add_Node")}</span>
                            <div className="form-wrapper">
                                <Form className="form-user" onSubmit={this.handleSubmit}>
                                    <FormItem className="ca-peer" label={intl.get("CA_Node")}  >
                                        {getFieldDecorator('capeer', {
                                            rules: [{
                                                required: true,
                                                message: intl.get("Please_Input_Node_Name"),
                                            }, {
                                                validator: this.handlePeer
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem className="ip-peer peer-first" label={intl.get("Node_Ip")} >
                                        {getFieldDecorator('ippeer1', {
                                            rules: [{
                                                required: true,
                                                pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                message: intl.get("Wrong_Format"),
                                            }, {
                                                validator: this.handleAddress
                                            }],
                                        })(
                                            <div>
                                                <Input />
                                            </div>
                                        )}
                                    </FormItem>
                                    <span className='dot'>·</span>
                                    <FormItem className="ip-peer" >
                                        {getFieldDecorator('ippeer2', {
                                            rules: [{
                                                required: true,
                                                pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                message: intl.get("Wrong_Format"),
                                            }, {
                                                validator: this.handleAddress
                                            }],
                                        })(
                                            <div>
                                                <Input />
                                            </div>
                                        )}
                                    </FormItem>
                                    <span className='dot'>·</span>
                                    <FormItem className="ip-peer" >
                                        {getFieldDecorator('ippeer3', {
                                            rules: [{
                                                required: true,
                                                pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                message: intl.get("Wrong_Format"),
                                            }, {
                                                validator: this.handleAddress
                                            }],
                                        })(
                                            <div>
                                                <Input />
                                            </div>
                                        )}
                                    </FormItem>
                                    <span className='dot'>·</span>
                                    <FormItem className="ip-peer" >
                                        {getFieldDecorator('ippeer4', {
                                            rules: [{
                                                required: true,
                                                pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                message: intl.get("Wrong_Format"),
                                            }, {
                                                validator: this.handleAddress
                                            }],
                                        })(
                                            <div>
                                                <Input />
                                            </div>
                                        )}
                                    </FormItem>
                                    <FormItem className="ssh-user" label={intl.get("SSH_Account")} >
                                        {getFieldDecorator('sshuser', {
                                            rules: [{
                                                required: true,
                                                message: intl.get("Please_Input_Username"),
                                            }, {
                                                validator: this.handleAddress
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem className="ssh-password" label={intl.get("SSH_Password")} >
                                        {getFieldDecorator('sshpassword', {
                                            rules: [{
                                                required: true,
                                                message: intl.get("Please_Input_Password"),
                                            }, {
                                                validator: this.handleAddress
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label={intl.get("Test_Result")}
                                    >
                                        <span className={this.state.paas ? 'paas-check' : 'fail-check'}>{this.state.checkResult}</span>
                                    </FormItem>
                                </Form>
                            </div>
                        </div>
                        <FormItem className="confirm-wrapper">
                            <Button onClick={this.handleSubmit} loading={this.state.loading} className="confirm-btn">{intl.get("Confirm")}</Button>
                            <Button onClick={this.handleBack} className="cancel-btn">{intl.get("Cancel")}</Button>
                        </FormItem>
                    </div>

                </div>
            </div>
        )
    }
}
export default CreateOrganization = Form.create()(CreateOrganization);