import React, { Component } from 'react';
import { Table, Pagination, Badge, Progress } from 'antd';
import './index.less';

const data = [{
    key: '1',
    name: 'arade code 0',
    domain: 20,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 10,
    ram: 30
}, {
    key: '2',
    name: 'crade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 20,
    ram: 40
}, {
    key: '3',
    name: 'drade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 40,
    ram: 20
}, {
    key: '4',
    name: 'brade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 90,
    ram: 100
},
{
    key: '5',
    name: 'erade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 5,
    ram: 10
}, {
    key: '6',
    name: 'grade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 70,
    ram: 30
}, {
    key: '7',
    name: 'frade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 90,
    ram: 10
}, {
    key: '8',
    name: 'qrade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 100,
    ram: 40
}, {
    key: '9',
    name: 'lrade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 40,
    ram: 500
}, {
    key: '10',
    name: 'vrade code 0',
    domain: 32,
    organization: '组织未定义',
    channel: ['nice', 'developer'],
    type: 'peer',
    status: '运行',
    cpu: 200,
    ram: 400
}];

const columns = [{
    title: '节点名称',
    dataIndex: 'name',
    width: '16%',
    key: 'name',
}, {
    title: '节点域名',
    dataIndex: 'domain',
    width: '12%',
    key: 'domain',
}, {
    title: '组织名',
    dataIndex: 'organization',
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
            <Progress strokeColor="#1890ff" strokeWidth={4} percent={record.cpu} />
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
            <Progress strokeColor="#52c41a" strokeWidth={4} percent={record.ram} />
        </span>
    ),
    sorter: (a, b) => a.ram - b.ram
}
];
class Peer extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <div className="peer_management">
                <div className="peer_wrapper">
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    />
                </div>
                <Pagination total={50} showSizeChanger showQuickJumper />
            </div>
        )
    }
}
export default Peer;