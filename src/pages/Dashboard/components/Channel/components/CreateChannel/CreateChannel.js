/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React, { Component } from 'react';
import { Form, Icon, Input, Button, message, Table } from 'antd'
import intl from 'react-intl-universal'
import Cookies from 'js-cookie'
import axios from 'axios'

import request from '../../../../../../Utils/Axios'
import apiconfig from '../../../../../../Utils/apiconfig'
import './createChannel.less'

const { api: { organization, channel, channelJoin,creatChannel } } = apiconfig;

const CancelToken = axios.CancelToken;
let cancel1;
let cancel2;
let cancel3;

const FormItem = Form.Item;


class CreateChannelContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgList: [],
            loading: false
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.arr.length===0){
            message.error(intl.get("Please_Select_Org"))
            return ''
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                let id = values.id
                let chianId = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id : ""
                const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
                request().post(`${newApi}${creatChannel.format({id:chianId})}`, {
                    name: values.name,
                    organizationIds: this.arr
                },{
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        cancel1 = c;
                    })
                }).then(res=>{
                    console.log(res)
                    if(res){
                        switch(res.status){
                            case 200:
                                // message.info(res.data.msg)
                                const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
                                request().post(`${newApi}${channelJoin}`, {
                                    organizationIds: this.arr,
                                    channelId: res.data.data._id
                                },{
                                    cancelToken: new CancelToken(function executor(c) {
                                        // An executor function receives a cancel function as a parameter
                                        cancel3 = c;
                                    })
                                }).then(res=>{
                                            this.setState({
                                                loading: false
                                            })
                                            if (res) {
                                                switch (res.status) {
                                                    case 200:
                                                        message.success(intl.get("Create_Successfully"),1,()=>{

                                                            this.props.history.push("/dashboard/channel_management")
                                                        })
                                                        break;
                                                    case 401:
                                                        Cookies.remove('userNameInfo')
                                                        Cookies.remove('token')
                                                        this.props.history.push('/login')
                                                        break;
                                                    default:
                                                        message.error(intl.get("Create_Failed"))
                                                }
                                            }
                                        })
                                    break;
                                case 401:
                                    Cookies.remove('userNameInfo')
                                    Cookies.remove('token')
                                    this.props.history.push('/login')
                                    break;
                                // case 400:
                                //     message.info('名字已占用，请重试')
                                //     break;
                                default:
                                    message.error(intl.get("Create_Failed"))
                                    this.setState({
                                        loading: false
                                    })
                            }
                        }
                    })
            }
        });
    }
    getOrgList = () => {
        let id = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id : ""
        const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
        request().get(`${newApi}${organization.orgList.format({id:id})}`,{
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel2 = c;
            })
        }).then(res => {
            if (res) {
                switch (res.status) {
                    case 200:
                        this.setState({
                            orgList: res.data.data,
                            // loading: false
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
    goBack = () => {
        this.props.history.push('/dashboard/channel_management')
    }
    componentDidMount() {
        this.getOrgList();
    }
    componentWillUnmount() {
        if (cancel1) {
            cancel1()
        }
        if (cancel2) {
            cancel2()
        }
        if (cancel3) {
            cancel3()
        }
    }
    
    items = [
        {
            consortium_id: "5c18d764c48c07001134cdd9",
            id: "5c18d76dc48c07001134cdda",
            name: "peer-org1",
            peer_count: 2,
            type: 0
        },
        {
            consortium_id: "5c18d764c48c07001134cdd9",
            id: "5c18d76dc48c07001134cddb",
            name: "peer-org2",
            peer_count: 2,
            type: 0
        },
        {
            consortium_id: "5c18d764c48c07001134cdd9",
            id: "5c18d76dc48c07001134cddc",
            name: "peer-org3",
            peer_count: 2,
            type: 0
        },
        {
            consortium_id: "5c18d764c48c07001134cdd9",
            id: "5c18d76dc48c07001134cddd",
            name: "peer-org4",
            peer_count: 2,
            type: 0
        },
        {
            consortium_id: "5c18d764c48c07001134cdd9",
            id: "5c18d76dc48c07001134cdde",
            name: "peer-org5",
            peer_count: 2,
            type: 0
        },
        {
            consortium_id: "5c18d764c48c07001134cdd9",
            id: "5c18d76dc48c07001134cddf",
            name: "peer-org6",
            peer_count: 2,
            type: 0
        }
    ]
    columns = [{
        title: intl.get("Org_Name"),
        dataIndex: 'name'
    }]
    arr = []
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.arr = selectedRowKeys
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='create-channel-page'>
                <div className="form-box">
                    <Form className='ant-form-custom' onSubmit={this.handleSubmit}>
                        <FormItem
                            label={intl.get("Channel_Name_Long")}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 4 }}
                        >
                            {getFieldDecorator('name', {
                                rules: [{ 
                                    required: true, 
                                    pattern:/^[a-z][a-z0-9.-]*$/,
                                    message: intl.get("Please_Input_Name"),
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label={<span className="lable-before">{intl.get("Select_Org")}</span>}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 8 }}
                        >
                            <div className='select-box'>
                                <Table 
                                    rowSelection={this.rowSelection} 
                                    columns={this.columns} 
                                    dataSource={this.state.orgList} 
                                    rowKey={record=>record.id}
                                    pagination={false}
                                />
                            </div>
                        </FormItem>
                    </Form>
                </div>
                <div className="bottom-btn-box">
                    <FormItem
                        // wrapperCol={{ span: 12, offset: 5 }}
                        className='bottom-btn-content'
                    >
                        <Button onClick={this.handleSubmit} className='submit' type="primary" htmlType="submit" loading={this.state.loading}>
                            {intl.get("Confirm")}
                        </Button>
                        <Button onClick={this.goBack} className='cancel'>{intl.get("Cancel")}</Button>
                    </FormItem>
                </div>
            </div>
        );
    }
}

const CreateChannel = Form.create()(CreateChannelContent)
export default CreateChannel;