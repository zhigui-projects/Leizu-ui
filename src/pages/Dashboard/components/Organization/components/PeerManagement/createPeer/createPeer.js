import React, { Component } from 'react';
import { Button, Input, Form, Icon, Select, message } from 'antd';
import request from '../../../../../../../Utils/Axios';
import axios from 'axios';
import apiconfig from '../../../../../../../Utils/apiconfig';
import Cookies from 'js-cookie';
const FormItem = Form.Item;
const Option = Select.Option;
const { api: { peer: { peerList } } } = apiconfig;

class CreateOrganization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formArr: [
                {
                    id1: 'name',
                    id2: 'host',
                    id3: 'username',
                    id4: 'password',
                    id5: 'hostf',
                    id6: 'hosts',
                    id7: 'hostt',
                    pattern: '',
                    validator: ''
                }
            ],
            count: 0,
            orgName: '',
            id: this.props.location.state,
        }
    }
    addPeer = () => {
        const { count, formArr } = this.state;
        const newData = {
            id1: `name${count}`,
            id2: `host${count}`,
            id3: `username${count}`,
            id4: `password${count}`,
            id5: `hostf${count}`,
            id6: `hosts${count}`,
            id7: `hostt${count}`,
            pattern: '',
            validator: ''
        }
        if (count <= 4) {
            formArr.push(newData);
            this.setState({
                formArr,
                count: count + 1
            })
        }
    }
    componentDidMount() {
        const { orgName } = this.state
        let name = localStorage.getItem('orgName');
        this.setState({
            orgName: name
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let obj = {
                    ...values
                }
                let ray = [];
                let arr = [];
                let array = [];
                for (let key in obj) {
                    arr.push(obj[key]);
                    array.push(key);
                }
                let arr1 = arr.map((ele, i, a) => {
                    if (i % 7 === 0) {
                        let ibj = {};
                        ibj.name = ele;
                        ibj.host = a[i + 1] + '.' + a[i + 2] + '.' + a[i + 3] + '.' + a[i + 4];
                        ibj.username = a[i + 5];
                        ibj.password = a[i + 6];
                        return ibj;
                    }
                    return null;
                }).filter(ele => ele !== null);
                ray = arr1;
                let options = {};
                options.organizationId = this.state.id;
                options.peers = ray;
                const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
                request().post(`${newApi}${peerList}`, options).then((res) => {
                    if (res) {
                        switch (res.status) {
                            case 200:
                                message.success('节点创建成功');
                                break;
                            case 400:
                                message.warning('你已经创建了节点');
                                break;
                            case 401:
                                Cookies.remove('token');
                                Cookies.remove('userNameInfo');
                                sessionStorage.removeItem('projectData');
                                sessionStorage.removeItem('consortiumType');
                                this.props.history.push({
                                    pathname: "/login"
                                })
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
        })
    }
    deletePeer = (index) => {
        const { formArr, count } = this.state;
        formArr.splice(index, 1);
        this.setState({
            formArr,
            count: count - 1
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="create-sonpeer">
                <div className="create-wrapper">
                    <div className="organization-wrapper">
                        <div className="wrapper-input" id="wrapper-input"><span className="organization-name">组织名称</span><span className="org-name">{this.state.orgName}</span></div>
                        <p className="wrapper-peer"><span className="organization-name">节点组织类型</span><span className="peer">peer</span></p>
                        <div className="chaincode-mark">
                            <span className="mark">链码标识</span>
                            <div className="form-wrapper">
                                <div className="title"><span>Peer节点</span><span>节点IP</span><span>SSH用户名</span><span>SSH密码</span><span>检测结果</span></div>

                                {
                                    this.state.formArr.length > 0 && this.state.formArr.map((item, index) => {
                                        return (
                                            <Form key={item.id1} className="form-user">
                                                <FormItem className="ca-peer">
                                                    {getFieldDecorator(item.id1, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^[0-9A-Za-z]{5,10}$/,
                                                            message: '5-10位数字或字母组合',
                                                        }, {
                                                            validator: this.handleAddress
                                                        }],
                                                    })(
                                                        <Input onChange={(value) => {
                                                            this.setState({ a: value })
                                                        }} />
                                                    )}
                                                </FormItem>
                                                <FormItem className="ip-peer">
                                                    {getFieldDecorator(item.id2, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                            message: '格式错误',
                                                        }, {
                                                            validator: this.handleAddress
                                                        }],
                                                    })(
                                                        <div>
                                                            <Input />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <span className="dot">·</span>
                                                <FormItem className="ip-peer">
                                                    {getFieldDecorator(item.id5, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                            message: '格式错误',
                                                        }, {
                                                            validator: this.handleAddress
                                                        }],
                                                    })(
                                                        <div>
                                                            <Input />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <span className="dot">·</span>
                                                <FormItem className="ip-peer">
                                                    {getFieldDecorator(item.id6, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                            message: '格式错误',
                                                        }, {
                                                            validator: this.handleAddress
                                                        }],
                                                    })(
                                                        <div>
                                                            <Input />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <span className="dot">·</span>
                                                <FormItem className="ip-peer">
                                                    {getFieldDecorator(item.id7, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
                                                            message: '格式错误',
                                                        }, {
                                                            validator: this.handleAddress
                                                        }],
                                                    })(
                                                        <div>
                                                            <Input />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <FormItem className="ssh-user">
                                                    {getFieldDecorator(item.id3, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^[0-9A-Za-z]{1,10}$/,
                                                            message: '5-10位数字或字母组合',
                                                        }, {
                                                            validator: this.handleAddress
                                                        }],
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                                <FormItem className="ssh-password">
                                                    {getFieldDecorator(item.id4, {
                                                        rules: [{
                                                            required: true,
                                                            pattern: /^[\w\?%&=\-_]{6,20}$/,
                                                            message: '6-12位数字、字母或字符组合',
                                                        }, {
                                                            validator: this.handleAddress
                                                        }],
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                                <FormItem>
                                                    <span className="peer-check">节点检测</span>
                                                </FormItem>
                                                <Icon style={{ display: index == 0 ? 'none' : '' }} className="close" onClick={this.deletePeer.bind(this, index)} type="close" />
                                            </Form>
                                        )
                                    })
                                }
                                <p className="icon-plus" onClick={this.addPeer}><Icon className="icon" type="plus-square" />添加peer节点<span>最多添加5个节点</span></p>
                            </div>
                            <p className="peer-desc"><span>节点由用户提供外网节点，需要在节点上安装docker并支持Https调用</span></p>
                        </div>
                    </div>
                    <div className="confirm-wrapper">
                        <Button onClick={this.handleSubmit} className="confirm-btn">确认</Button>
                        <Button className="cancel-btn">取消</Button>
                    </div>
                </div>
            </div>
        )
    }
}
export default CreateOrganization = Form.create()(CreateOrganization);