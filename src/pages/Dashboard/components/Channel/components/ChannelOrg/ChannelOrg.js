/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React, { Component } from 'react';
import { Table, Pagination, Spin } from 'antd'
import intl from 'react-intl-universal'
import request from '../../../../../../Utils/Axios'
import axios from 'axios'
import Cookies from 'js-cookie'
import apiconfig from '../../../../../../Utils/apiconfig'
// import './channelOrg.less'


const {api: { organize }} = apiconfig;
const CancelToken = axios.CancelToken;
let cancel;

class ChannelOrg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableArr: [],
            loading: true
        }
    }
    columns = [
        {
            title: intl.get("Org_Name"),
            dataIndex: 'name',
            key: 'name',
        },
        // {
            //     title: '组织数量',
            //     dataIndex: 'orgs',
            //     key: 'orgs',
            //     render: arr => arr.length
            // },
        {
            title: intl.get("Node_Count"),
            dataIndex: 'peer_count',
            key: 'peer_count',
        }
    ]
    getData = (consortiumId, channelId)=>{
        request().get(organize.organization.format({consortiumId: consortiumId}), {
            params: {
                channelId: channelId
            },
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
            })
        }).then(res=>{
            if(res){
                switch(res.status){
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
                        return ''
                }

            }
        })
    }
    componentDidMount(){
        let temp = sessionStorage.getItem('ConsortiumInfo')
        if(temp) {
            temp = JSON.parse(temp)
            this.getData(temp._id, this.props.location.query)
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
        return (
            <div className='channel-org-page'>
                <div className="table-box">
                    <Spin spinning={this.state.loading}>
                        <Table
                            columns= {this.columns}
                            dataSource = {this.state.tableArr}
                            rowKey = {record=>record.id}
                            pagination={false}
                        />
                    </Spin>
                </div>
                <div className="pagination-box clearfix">
                    {/* <Pagination defaultCurrent={6} total={500} /> */}
                </div>
            </div>
        );
    }
}

export default ChannelOrg;
