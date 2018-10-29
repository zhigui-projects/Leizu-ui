import React, { Component } from 'react';
import { Table, Badge, Progress, Spin } from 'antd';
import './index.less';
import apiconfig from '../../../../../../Utils/apiconfig';
import request from '../../../../../../Utils/Axios';
import axios from 'axios'
import Cookies from 'js-cookie'
const CancelToken = axios.CancelToken;
let cancel;

const { api: { peer } } = apiconfig;
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
    key: 'organizationName',
}, {
    title: '通道名',
    key: 'channel',
    width: '16%',
    dataIndex: 'channelNames',
}, {
    title: '节点类型',
    key: 'type',
    width: '9%',
    render:(text,record)=>(
        <span>{record.type===0?"peer":(record.type===1?"orderer":"")}</span>
    ),
    // sorter: (a, b) => a.type-b.type
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
            <Progress strokeColor="#1890ff" strokeWidth={4} percent={parseInt((record.cpu * 100).toFixed(),10)} />
        </span>
    ),
    sorter: (a, b) => a.cpu - b.cpu
},
{
    title: '内存占用',
    key: 'ram',
    render: (text, record) => (
        <span>
            <Progress strokeColor="#52c41a" strokeWidth={4} percent={parseInt((record.memory * 100).toFixed(),10)} />
        </span>
    ),
    sorter: (a, b) => a.ram - b.ram
}
];
class PeerManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peerData: [],
            id: this.props.location.state
        }
    }
    getPeerData = () => {
        request().get(`${peer.peerDetail.format({ id: this.state.id })}`, {
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
                        Cookies.remove('userName')
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
    render() {
        return (
            <div className="peer_management">
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