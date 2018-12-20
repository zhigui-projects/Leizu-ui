/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React , {Component} from 'react';
import { Button, Icon, Table, Pagination, Spin } from 'antd'
import Cookies from 'js-cookie'
import intl from "react-intl-universal";
import axios from 'axios'
import request from '../../../../Utils/Axios'
import apiconfig from '../../../../Utils/apiconfig'

const {api:{channel}} = apiconfig;

const CancelToken = axios.CancelToken;
let cancel;

class Channel extends Component{
    constructor(props){
        super(props)
        this.state={
            tableArr: [],
            loading: true
        }
    }
    toOrganization = (id, consortium_id)=>{
        this.props.history.push({
            pathname: "channel_management/org",
            state: {
                id: id,
                consortiumId: consortium_id
            }
        })
    }
    columns = [
        {
            title: intl.get("Channel_Name"),
            dataIndex: 'name',
            key: 'name',
        }, {
            title: intl.get("Org_Count"),
            dataIndex: 'orgs',
            key: 'orgs',
            render: arr => arr.length
        }, {
            title: intl.get("Node_Count"),
            dataIndex: 'peers',
            key: 'peers',
            render: arr => arr.length
        }, {
            title: intl.get("Operation"),
            dataIndex: '_id',
            key: '_id',
            render: (text,record) => (
                <span onClick={() => this.toOrganization(text, record.consortium_id)} className='table-item-btn'>
                    {intl.get("Org_Manage")}
                </span>
            ),
        }
    ]
    
    getData = ()=>{
        let id = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id : ""
        const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
        request().get(`${newApi}${channel.format({id:id})}`,{
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
            })
        }).then(res => {
            if (res) {
                switch (res.status) {
                    case 200:
                        this.setState({
                            tableArr: res.data.data,
                            loading: false
                        })
                        break;
                    case 401: 
                        Cookies.remove('userNameInfo')
                        Cookies.remove('token')
                        this.props.history.push('/login')
                        break;
                    default:
                        this.setState({
                            loading: false
                        })
                        return ''

                }
            }
        })
    }
    createChannel = ()=>{
        this.props.history.push('/dashboard/channel_management/create_channel')
    }
    componentDidMount(){
        this.getData();
    }
    componentWillUnmount() {
        if (cancel) {
            cancel();
        }
        this.setState = () => {
            return;
        };
    }
    render(){
        return(
            <div className='channel-page'>
                <div className="create-channel-box">
                    <Button onClick={this.createChannel} className="create-channel-btn">
                        {intl.get("Create_Channel")}<Icon type="plus-circle" theme="outlined" />
                    </Button>
                </div>
                <div className="table-box">
                    <Spin spinning={this.state.loading}>
                        <Table 
                            columns= {this.columns}
                            dataSource = {this.state.tableArr}
                            rowKey = {record=>record.uuid}
                            pagination={false}
                        />
                    </Spin>
                </div>
                <div className="pagination-box clearfix">
                    {/* <Pagination defaultCurrent={6} total={500} /> */}
                </div>
            </div>
        )
    }
}
export default Channel;