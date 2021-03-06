/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React, {Component} from 'react';
import {Badge, Button, Icon, Progress, Spin, Table} from 'antd';
import intl from 'react-intl-universal'
import apiconfig from '../../../../../../Utils/apiconfig';
import request from '../../../../../../Utils/Axios';
import axios from 'axios'
import Cookies from 'js-cookie'

const CancelToken = axios.CancelToken;
let cancel;

const { api: { peer: { peerList ,organizationPeer} } } = apiconfig;
const columns = [{
    title: intl.get("Node_Name"),
    dataIndex: 'name',
    width: '13%',
    key: 'name',
}, {
    title: intl.get("Node_Domain"),
    dataIndex: 'location',
    width: '20%',
    key: 'domain',
}, {
    title: intl.get("Org_Name"),
    dataIndex: 'organizationName',
    width: '12%',
    key: 'organizationName',
}, {
    title: intl.get("Channel_Name"),
    key: 'channel',
    width: '12%',
    render: (text, record) => (
        record.channelNames.map((item, index) => {
            return <p key={index}>{item}</p>
        })
    )
}, {
    title: intl.get("Node_Type"),
    key: 'type',
    width: '10%',
    render: (text, record) => (
        <span>{record.type === 0 ? "peer" : (record.type === 1 ? "orderer" : "")}</span>
    ),
    // sorter: (a, b) => a.type-b.type
},
{
    title: intl.get("Type"),
    width: '11%',
    key: 'status',
    render: (text, record) => (
        <span>
            <Badge status="success" text={record.status} />
        </span>
    ),
    // sorter: (a, b) => {

    // }
},
{
    title: intl.get("CPU_Occupy"),
    width: '11%',
    key: 'cpu',
    render: (text, record) => (
        <span>
            <Progress strokeColor="#1890ff" strokeWidth={4} percent={parseFloat((record.cpu * 1).toFixed(2), 10)} />
        </span>
    ),
    sorter: (a, b) => a.cpu - b.cpu
},
{
    title: intl.get("Memory_Occupy"),
    width:"11%",
    key: 'ram',
    render: (text, record) => (
        <span>
            <Progress strokeColor="#52c41a" strokeWidth={4} percent={parseFloat((record.memory * 1).toFixed(2), 10)} />
        </span>
    ),
    sorter: (a, b) => a.memory - b.memory
}
];
class PeerManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peerData: [],
            consortiumInfo:this.props.location.state,
            id: this.props.location.state ? this.props.location.state.id : (JSON.parse(localStorage.getItem('consortiumInfo')).id),
            type: this.props.location.state? this.props.location.state.type: (JSON.parse(localStorage.getItem('consortiumInfo')).type)
        }
    }
    // getPeerData = (consortiumId) => {
    //     request().get(`${peer.peerDetail.format({consortiumId: consortiumId})}`, {
    //         params: {
    //             id: this.state.id ? this.state.id : localStorage.getItem('_id')
    //         },
    getPeerData = (id) => {
        // let id = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id : ""
        let _id = localStorage.getItem('_id');
        request().get(`${organizationPeer.format({ id: id,orgId:this.state.id })}`, {
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
            })
        }).then(res => {
            if (res) {
                switch (res.status) {
                    case 200:
                        this.setState({
                            peerData: res.data.data,
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
    componentWillMount() {
        const { consortiumInfo } = this.state;
        localStorage.setItem('consortiumInfo', JSON.stringify(consortiumInfo));
    }
    componentDidMount() {
        let temp = sessionStorage.getItem('ConsortiumInfo')
        if(temp){
            temp = JSON.parse(temp)
            this.getPeerData(temp._id)
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
    CreatePeer = () => {
        this.props.history.push({
            pathname: 'peer/create',
            state: this.state.id
        });
    }
    render() {
        return (
            <div className="peer_management">
                <p className="create-organization">
                    <Button style={{ display: this.state.type === 1 ? "none" : "" }} id="create" onClick={this.CreatePeer} className="create-plus">{intl.get("Create_Node")}<Icon type="plus-circle" theme="outlined" /></Button>
                </p>
                <div className="peer_wrapper">
                    <Spin spinning={this.state.loading}>
                        <Table
                            columns={columns}
                            dataSource={this.state.peerData}
                            rowKey={record => record._id}
                        />
                    </Spin>
                </div>
                {/* <Pagination total={50} showSizeChanger showQuickJumper /> */}
            </div>
        )
    }
}
export default PeerManagement;
