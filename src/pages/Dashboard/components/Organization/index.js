import React, { Component } from 'react';
import { Icon, Button, Table, Pagination,Modal } from 'antd';
import './index.less';

const columns = [{
    title: '组织名',
    dataIndex: 'name',
    width: '33%',
    key: 'name',
}, {
    title: '域名',
    dataIndex: 'domain',
    width: '31%',
    key: 'domain',
}, {
    title: '节点数量',
    dataIndex: 'number',
    width: '18%',
    key: 'number',
}, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
}];

const data = [{
    key: 1,
    name: 'John Brown sr.',
    number: 24,
    domain: 60,
    operation: '节点管理',
    children: [{
        key: 2,
        name: 'John Brown',
        domain: 60,
        number: 42,
        operation: '节点管理',
    },
    {
        key: 3,
        name: 'Jim Green sr.',
        domain: 60,
        number: 72,
        operation: '节点管理',
    }],
}, {
    key: 4,
    name: 'Joe Black',
    domain: 60,
    number: 32,
    operation: '节点管理',
    children: [{
        key: 5,
        name: 'John Brown',
        domain: 60,
        number: 42,
        operation: '节点管理',
    },
    {
        key: 6,
        name: 'Jim Green sr.',
        domain: 60,
        number: 72,
        operation: '节点管理',
    }]
}];
class Organization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    showModal=()=>{
        this.setState({
            visible:true
        })
    }
    handleOk = (e) => {
        this.setState({
          visible: false,
        });
      }
    
      handleCancel = (e) => {
        this.setState({
          visible: false,
        });
      }
    render() {
        return (
            <div className="organization_management">
                <div className="organization_wrapper">
                    <p className="create_organization">
                        <Button id="create" onClick={this.showModal} className="create_plus">创建组织<Icon type="plus-circle" theme="outlined" /></Button>
                    </p>
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    />
                    <Pagination total={50} showSizeChanger showQuickJumper />
                    <Modal
                        title="新建组织"
                        cancelText="取消"
                        okText="确认"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={504}
                        getContainer={()=>document.getElementById('create')}
                    >

                    </Modal>
                </div>
            </div>
        )
    }
}
export default Organization;