import React, { Component } from 'react';
import { Icon, Button, Table, Pagination, Modal, Form, Input, Spin } from 'antd';
import './index.less';
import request from '../../../../../../Utils/Axios';
import apiconfig from '../../../../../../Utils/apiconfig';
import Cookies from 'js-cookie'
const FormItem = Form.Item;
const { api: { organization: { orgList } } } = apiconfig;
const { api: { peer } } = apiconfig;


class OrgaManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            orgData: [],
            loading: true
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
    handlePeer = (record) => {
        this.props.history.push('/dashboard/organization_management/peer/' + record.id);
    }
    getOrgData = () => {
        request().get(orgList).then(res => {
            if (res) {
                switch (res.status) {
                    case 200:
                        this.setState({
                            orgData: res.data.data,
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
        this.getOrgData()
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
            dataIndex: 'peer_count',
            width: '18%',
            key: 'number',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => (
                <span onClick={this.handlePeer.bind(this, record)} style={{ color: '#3d70b1', cursor: 'pointer' }}>节点管理</span>
            )
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
                    <Spin spinning={this.state.loading}>

                        <Table
                            columns={columns}
                            dataSource={this.state.orgData}
                            pagination={false}
                            rowKey={record => record.id}
                        />
                    </Spin>
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
OrgaManagement = Form.create()(OrgaManagement);
export default OrgaManagement;