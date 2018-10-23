import React, { Component } from 'react';
import { Table, Pagination, Badge, Progress, Spin } from 'antd';
import './index.less';
import apiconfig from '../../../../Utils/apiconfig';
import request from '../../../../Utils/Axios';
import Cookies from 'js-cookie'

const { api: { peer: { peerList } } } = apiconfig;
const columns = [{
    title: '节点名称',
    dataIndex: 'name',
    width: '16%',
    key: 'name',
}, {
    title: '节点域名',
    dataIndex: 'location',
    width: '12%',
    key: 'domain',
}, {
    title: '组织名',
    dataIndex: '',
    width: '16%',
    key: 'organization',
}, {
    title: '通道名',
    key: 'channel',
    width: '16%',
    dataIndex: 'channel',
}, {
    title: '节点类型',
    key: 'type',
    width: '10%',
    dataIndex: 'type',
    sorter: (a, b) => {

    }
},
{
    title: '状态',
    width: '8%',
    key: 'status',
    render: (text, record) => (
        <span>
            <Badge status="success" text={record.status} />
        </span>
    ),
    sorter: (a, b) => {

    }
},
{
    title: 'CPU占用',
    width: '11%',
    key: 'cpu',
    render: (text, record) => (
        <span>
            <Progress strokeColor="#1890ff" strokeWidth={4} percent={parseInt((record.cpu * 100).toFixed())} />
        </span>
    ),
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.cpu - b.cpu
},
{
    title: '内存占用',
    key: 'ram',
    render: (text, record) => (
        <span>
            <Progress strokeColor="#52c41a" strokeWidth={4} percent={parseInt((record.memory * 100).toFixed())} />
        </span>
    ),
    sorter: (a, b) => a.ram - b.ram
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
        request().get(peerList).then(res => {
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
    render() {
        return (
            <div className="peer_management">
                <div className="peer_wrapper">
                    <Spin spinning={this.state.loading}>
                        <Table
                            columns={columns}
                            dataSource={this.state.peerData}
                            pagination={false}
                            rowKey={record => record._id}
                        />
                    </Spin>
                </div>
                <Pagination total={50} showSizeChanger showQuickJumper />
            </div >
        )
    }
}
export default Peer;