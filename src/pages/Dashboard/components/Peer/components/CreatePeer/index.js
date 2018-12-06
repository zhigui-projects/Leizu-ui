/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React, { Component } from 'react';
import { Button, Input, Form, Icon, Select, message } from 'antd';
import intl from 'react-intl-universal'
import apiconfig from '../../../../../../Utils/apiconfig';
import request from '../../../../../../Utils/Axios';
import axios from 'axios';
import Cookies from 'js-cookie';
const FormItem = Form.Item;
const Option = Select.Option;
const { api: { peer: { peerList } } } = apiconfig;
const { api: { organization: { orgList } } } = apiconfig;
class CreateOrganization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formArr: [
                {
                    id1: 'name',
                    id2: 'host',
                    id3: 'username',
                    id4: 'password',
                    id5: 'hostf',
                    id6: 'hosts',
                    id7: 'hostt',
                    pattern: '',
                    validator: ''
                }
            ],
            count: 0,
            dataOptions: [],
            organizationId: '',
            display: false
        }
    }
    addPeer = () => {
        const { count, formArr } = this.state;
        const newData = {
            id1: `name${count}`,
            id2: `host${count}`,
            id3: `username${count}`,
            id4: `password${count}`,
            id5: `hostf${count}`,
            id6: `hosts${count}`,
            id7: `hostt${count}`,
            pattern: '',
            validator: ''
        }
        if (count <= 4) {
            formArr.push(newData);
            this.setState({
                formArr,
                count: count + 1
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (this.state.organizationId == '') {
                this.setState({ display: true });
            }
            else if (!err && this.state.organizationId !== '') {
                let obj = {
                    ...values
                }
                let ray = [];
                let arr = [];
                let array = [];
                for (let key in obj) {
                    arr.push(obj[key]);
                    array.push(key);
                }
                let arr1 = arr.map((ele, i, a) => {
                    if (i % 7 === 0) {
                        let ibj = {};
                        ibj.name = ele;
                        ibj.host = a[i + 1] + '.' + a[i + 2] + '.' + a[i + 3] + '.' + a[i + 4];
                        ibj.username = a[i + 5];
                        ibj.password = a[i + 6];
                        return ibj;
                    }
                    return null;
                }).filter(ele => ele !== null);
                ray = arr1;
                let orgId = this.state.organizationId;
                let options = {};
                options.organizationId = orgId;
                options.peers = ray;
                request().post(peerList, options).then((res) => {
                    if (res) {
                        switch (res.status) {
                            case 200:
                                message.success(intl.get("Create_Node_Successfully"));
                                break;
                            case 400:
                                message.warning(intl.get("Have_Already_Created_Node"))
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
            }
        })
    }
    deletePeer = (index) => {
        const { formArr, count } = this.state;
        formArr.splice(index, 1);
        this.setState({
            formArr,
            count: count - 1
        })
    }
    componentDidMount() {
        request().get(orgList).then((res) => {
            if (res.data.code == 200) {
                let dataOptions = res.data.data;
                this.setState({
                    dataOptions
                })
            }
        })
    }
    handleBack = () => {
        window.history.go(-1);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { dataOptions, organizationId } = this.state;
        return (
            <div className="create-peer">
                <div className="create-wrapper">
                    <div className="organization-wrapper">
                        <div className="wrapper-input" id="wrapper-input"><span className="organization-name">{intl.get("Org_Name")}</span>
                            <span ref="selectBox">
                                <Select
                                    showSearch
                                    getPopupContainer={() => this.refs.selectBox}
                                    style={{ width: 192, height: 32, marginLeft: 18 }}
                                    placeholder={intl.get("Please_Select_Org")}
                                    optionFilterProp="children"
                                    onSelect={(value) => this.setState({
                                        organizationId: value,
                                        display: false
                                    })}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        dataOptions.length > 0 && dataOptions.map((item, index) => {
                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                            <span style={{ display: this.state.display ? '' : 'none' }} className="tip">{intl.get("Please_Select_Org")}</span>
                        </div>
                        <p className="wrapper-peer"><span className="organization-name">{intl.get("New_Node_Node_Type")}</span><span className="peer">peer</span></p>
                        <div className="chaincode-mark">
                            <span className="mark">{intl.get("Add_Node")}</span>
                            <div className="form-wrapper">
                                <div className="title"><span>{intl.get("Peer_Node")}</span><span>{intl.get("Node_Ip")}</span><span>{intl.get("SSH_Account")}</span><span>{intl.get("SSH_Password")}</span></div>
                                {
                                    this.state.formArr.length > 0 && this.state.formArr.map((item, index) => {
                                        return (
                                            <Form key={item.id1} className="form-user">
                                                <FormItem className="ca-peer">
                                                    {getFieldDecorator(item.id1, {
                                                        rules: [{
                                                            required: true,
                                                            message: intl.get("Number_Letter_Char"),
                                                        }],
                                                    })(
                                                        <Input onChange={(value) => {
                                                            this.setState({ a: value })
                                                        }} />
                                                    )}
                                                </FormItem>
                                                <FormItem className="ip-peer">
                                                    {getFieldDecorator(item.id2, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                            message: intl.get("Wrong_Format"),
                                                        }],
                                                    })(
                                                        <div>
                                                            <Input />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <span className="dot">·</span>
                                                <FormItem className="ip-peer">
                                                    {getFieldDecorator(item.id5, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                            message: intl.get("Wrong_Format"),
                                                        }],
                                                    })(
                                                        <div>
                                                            <Input />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <span className="dot">·</span>
                                                <FormItem className="ip-peer">
                                                    {getFieldDecorator(item.id6, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                            message: intl.get("Wrong_Format"),
                                                        }],
                                                    })(
                                                        <div>
                                                            <Input />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <span className="dot">·</span>
                                                <FormItem className="ip-peer">
                                                    {getFieldDecorator(item.id7, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                            message: intl.get("Wrong_Format"),
                                                        }],
                                                    })(
                                                        <div>
                                                            <Input />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <FormItem className="ssh-user">
                                                    {getFieldDecorator(item.id3, {
                                                        rules: [{
                                                            required: true,
                                                            message: intl.get("Number_Letter_Char"),
                                                        }],
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                                <FormItem className="ssh-password">
                                                    {getFieldDecorator(item.id4, {
                                                        rules: [{
                                                            required: true,
                                                            message: intl.get("Number_Letter_Char"),
                                                        }],
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                                <Icon style={{ display: index === 0 ? 'none' : '' }} className="close" onClick={this.deletePeer.bind(this, index)} type="close" />
                                            </Form>
                                        )
                                    })
                                }
                                <p className="icon-plus" onClick={this.addPeer} ><Icon className="icon"  type="plus-square" /><span>{intl.get("Add_Peer_Node")}</span>{intl.get("Add_Up_To_5_More")}</p>
                            </div>
                            <p className="peer-desc">{intl.get("New_Node_Tip_Text")}</p>
                        </div>
                    </div>
                    <div className="confirm-wrapper">
                        <FormItem>
                            <Button onClick={this.handleSubmit} className="confirm-btn">{intl.get("Confirm")}</Button>
                            <Button onClick={this.handleBack} className="cancel-btn">{intl.get("Cancel")}</Button>
                        </FormItem>
                    </div>
                </div>
            </div>
        )
    }
}
export default CreateOrganization = Form.create()(CreateOrganization);