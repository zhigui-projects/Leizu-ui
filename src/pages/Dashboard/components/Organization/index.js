import React, { Component } from 'react';
import { Icon, Button, Table, Pagination, Modal, Form ,Input } from 'antd';
import './index.less';
const FormItem = Form.Item;


class Organization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    showModal = () => {
        this.setState({
            visible: true
        })
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handlePeer=(record)=>{
        console.log(record);
    }
    render() {
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
            render: (text, record) => (
                <span onClick={this.handlePeer.bind(this,record)} style={{ color: '#3d70b1' }}>{record.operation}</span>
            )
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
        const { getFieldDecorator } = this.props.form;
        const FormItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
              },
        }
        return (
            <div className="organization-management">
                <div className="organization-wrapper">
                    <p className="create-organization">
                        <Button id="create" onClick={this.showModal} className="create-plus">创建组织<Icon type="plus-circle" theme="outlined" /></Button>
                    </p>
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    />
                    <Pagination total={50} showSizeChanger showQuickJumper />
                    <Modal
                        className='create-modal'
                        title="新建组织"
                        cancelText="确认"
                        okText="取消"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={504}
                        bodyStyle={{ height: 184 }}
                    >
                        <Form
                            onSubmit={this.handleSubmit}
                        >
                            <FormItem label='组织名称'  {...FormItemLayout}>
                                {getFieldDecorator('telephone', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '',
                                        },

                                    ],
                                })(
                                    <Input placeholder='请输入字符串' />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}
Organization=Form.create()(Organization);
export default Organization;