import React, { Component } from 'react';
import { Button, Input, Form, Icon, message } from 'antd';
import apiconfig from '../../../../../../Utils/apiconfig';
import request from '../../../../../../Utils/Axios';
import axios from 'axios';
import Cookies from 'js-cookie';
const FormItem = Form.Item;
const { api: { organization: { orgList, createOrg,peerCheck } } } = apiconfig;

class CreateOrganization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formArr: [],
            count: 0,
            loading: false,
            display: false,
            check:'noCheck',
            peer:false
        }
    }
    componentDidMount() {

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let orgName = document.getElementById('org-name').value;
            if (!orgName) {
                this.setState({ display: true });
            }
            else if (!err && orgName) {
                this.setState({ loading: true });
                let ip = values.ippeer1 + '.' + values.ippeer2 + '.' + values.ippeer3 + '.' + values.ippeer4;
                let consortiumId = JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id;
                let obj = {
                    'name': orgName,
                    'domainName': values.capeer,
                    'host': ip,
                    'username': values.sshuser,
                    'password': values.sshpassword,
                    'consortiumId': consortiumId,
                }
                request().post(orgList, obj).then((res) => {
                    if (res.status==200) {
                        let options = {};
                        options.channelType = 1;
                        options.organizationId = res.data.data._id;
                        request().post(createOrg, options).then((res) => {
                            if (res) {
                                this.setState({ loading: false });
                                switch (res.status) {
                                    case 200:
                                        message.success('组织创建成功');
                                        break;
                                    case 400:
                                        message.warning('你已经创建了组织');
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
        })
    }
    handleChange = () => {
        this.setState({ display: false });
    }
    peerCheck=(arr)=>{
        const {getFieldValue}=this.props.form;
        let obj={

        }
        obj.host=getFieldValue(arr[0])+getFieldValue(arr[1])+getFieldValue(arr[2])+getFieldValue(arr[3]);
        obj.username=getFieldValue(arr[4]);
        obj.password=getFieldValue(arr[5]);
        // request().post(peerCheck,obj).then((res)=>{
        //     console.log(res);
        // })
    }
    handleBack=()=>{
        window.history.go(-1);
    }
    render() {
        const { display } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="create-organization">
                <div className="create-wrapper">
                    <div className="organization-wrapper">
                        <p className="wrapper-input"><span className="organization-name">组织名称</span><Input onChange={this.handleChange} id="org-name" className="organization-input" /><span style={{ display: display ? '' : 'none' }} className="tip">请输入组织名称</span></p>
                        <p className="wrapper-peer"><span className="organization-name">节点组织类型</span><span className="peer">peer</span></p>
                        <div className="chaincode-mark">
                            <span className="mark">链码标识</span>
                            <div className="form-wrapper">
                                <Form className="form-user" onSubmit={this.handleSubmit}>
                                    <FormItem className="ca-peer" label="CA节点"  >
                                        {getFieldDecorator('capeer', {
                                            rules: [{
                                                required: true,
                                                pattern: /^[\w\?%&=\-+_]+$/,
                                                message: '数字、字母或字符组合',
                                            }, {
                                                validator: this.handlePeer
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem className="ip-peer peer-first" label="节点IP" >
                                        {getFieldDecorator('ippeer1', {
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
                                    <span className='dot'>·</span>
                                    <FormItem className="ip-peer" >
                                        {getFieldDecorator('ippeer2', {
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
                                    <span className='dot'>·</span>
                                    <FormItem className="ip-peer" >
                                        {getFieldDecorator('ippeer3', {
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
                                    <span className='dot'>·</span>
                                    <FormItem className="ip-peer" >
                                        {getFieldDecorator('ippeer4', {
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
                                    <FormItem className="ssh-user" label="SSH用户名" >
                                        {getFieldDecorator('sshuser', {
                                            rules: [{
                                                required: true,
                                                pattern: /^[\w\?%&=\-_]+$/,
                                                message: '数字、字母或字符组合',
                                            }, {
                                                validator: this.handleAddress
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem className="ssh-password" label="SSH密码" >
                                        {getFieldDecorator('sshpassword', {
                                            rules: [{
                                                required: true,
                                                pattern: /^[\w\?%&=\-+_]+$/,
                                                message: '数字、字母或字符组合',
                                            }, {
                                                validator: this.handleAddress
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    {/* <FormItem
                                        label='检测结果'
                                    >
                                            <span onClick={()=>{this.peerCheck(['ippeer1','ippeer2','ippeer3','ippeer4','sshuser','sshpassword'])}}>{this.state.check==='noCheck'?'点击检测':(this.state.check==='error'?'检测未通过请重新填写':"检测通过")}</span>
                                    </FormItem> */}
                                </Form>
                            </div>
                        </div>
                        <FormItem className="confirm-wrapper">
                            <Button onClick={this.handleSubmit} loading={this.state.loading} className="confirm-btn">确认</Button>
                            <Button onClick={this.handleBack} className="cancel-btn">取消</Button>
                        </FormItem>
                    </div>

                </div>
            </div>
        )
    }
}
export default CreateOrganization = Form.create()(CreateOrganization);