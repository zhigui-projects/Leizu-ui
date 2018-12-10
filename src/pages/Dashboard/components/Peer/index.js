import React, { Component } from 'react';
import { Table, Badge, Progress, Spin, Button, Icon } from 'antd';
import axios from 'axios';
import apiconfig from '../../../../Utils/apiconfig';
import request from '../../../../Utils/Axios';
import Cookies from 'js-cookie';
// import { pbkdf2 } from 'crypto';
const CancelToken = axios.CancelToken;
let cancel;

const { api: { peer: { peerList } } } = apiconfig;
const columns = [{
    title: '节点名称',
    dataIndex: 'name',
    width: '15%',
    key: 'name',
}, {
    title: '节点域名',
    dataIndex: 'location',
    width: '15%',
    key: 'domain',
}, {
    title: '组织名',
    dataIndex: 'organizationName',
    width: '14%',
    key: 'organization',
}, {
    title: '通道名',
    key: 'channel',
    width: '16%',
    render: (text, record) => (
        record.channelNames.map((item, index) => {
            return <p key={index}>{item}</p>
        })
    )
}, {
    title: '节点类型',
    key: 'type',
    width: '9%',
    render: (text, record) => (
        <span>{record.type === 0 ? "peer" : (record.type === 1 ? "orderer" : "")}</span>
    ),
    // sorter: (a,b) => a.type-b.type
},
{
    title: '状态',
    width: '9%',
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
    title: 'CPU占用',
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
    title: '内存占用',
    key: 'ram',
    render: (text, record) => (
        <span>
            <Progress strokeColor="#52c41a" strokeWidth={4} percent={parseFloat((record.memory * 1).toFixed(2), 10)} />
        </span>
    ),
    sorter: (a, b) => a.memory - b.memory
}
];
class Peer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peerData: [],
            loading: true
        }
    }
    getPeerData = () => {
        let id = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id : ""
        const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
        request().get(`${newApi}${peerList.format({id:id})}`, {
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
    componentDidMount() {
        this.getPeerData()
    }
    componentWillUnmount() {
        if (cancel) {
            cancel();
        }
        this.setState = () => {
            return;
        };
    }
    createPeer = () => {
        this.props.history.push('peer_management/create');
    }
    render() {
        return (
            <div className="peer_management">
                <p className="create-organization">
                    <Button id="create" onClick={this.createPeer} className="create-plus">创建节点<Icon type="plus-circle" theme="outlined" /></Button>
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
            </div >
        )
    }
}
export default Peer;