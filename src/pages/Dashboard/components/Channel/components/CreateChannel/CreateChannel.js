import React, { Component } from 'react';
import { Form, Icon, Input, Button, Select, message } from 'antd'
import Cookies from 'js-cookie'
import axios from 'axios'

import request from '../../../../../../Utils/Axios'
import {test} from '../../../../../../Utils/Axios'
import apiconfig from '../../../../../../Utils/apiconfig'
import './createChannel.less'

const { api: {organization, channel, channelJoin} } = apiconfig;

const CancelToken = axios.CancelToken;
let cancel1;
let cancel2;
let cancel3;

const FormItem = Form.Item;
const Option = Select.Option;
class CreateChannelContent extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            orgList: [],
            loading: false
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                // let [id, consortiumId] = ['','']
                // [id, consortiumId] = values.consortiumId.split('_')
                let id = values.id
                let chianId = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id : ""
                const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
                request().post(`${newApi}${channel.format({id:chianId})}`, {
                    name: values.name,
                    // consortiumId: consortiumId,
                    organizationIds: [values.id]
                },{
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        cancel1 = c;
                    })
                }).then(res=>{
                    if(res){
                        switch(res.status){
                            case 200:
                                // message.info(res.data.msg)
                                const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
                                request().post(`${newApi}${channelJoin}`, {
                                    organizationId: id,
                                    channelId: res.data.data._id
                                },{
                                    cancelToken: new CancelToken(function executor(c) {
                                        // An executor function receives a cancel function as a parameter
                                        cancel3 = c;
                                    })
                                }).then(res=>{
                                    this.setState({
                                        loading: false
                                    })
                                    if(res){
                                        switch(res.status){
                                            case 200:
                                                message.info("创建成功")
                                                break;
                                            case 401: 
                                                Cookies.remove('userNameInfo')
                                                Cookies.remove('token')
                                                this.props.history.push('/login')
                                                break;
                                            default: 
                                                message.error("创建失败")
                                        }
                                    }
                                })
                                break;
                            case 401: 
                                Cookies.remove('userNameInfo')
                                Cookies.remove('token')
                                this.props.history.push('/login')
                                break;
                            // case 400:
                            //     message.info('名字已占用，请重试')
                            //     break;
                            default: 
                                message.error("创建失败")
                                this.setState({
                                    loading: false
                                })
                        }
                    }
                })
            }
        });
    }
    getOrgList = () => {
        let id = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))._id : ""
        const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
        request().get(`${newApi}${organization.orgList.format({id:id})}`,{
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel2 = c;
            })
        }).then(res => {
            if (res) {
                switch (res.status) {
                    case 200:
                        this.setState({
                            orgList: res.data.data,
                            // loading: false
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

    componentDidMount(){
        this.getOrgList();
    }
    componentWillUnmount(){
        if(cancel1){
            cancel1()
        }
        if(cancel2){
            cancel2()
        }
    }
    render() { 
        const { getFieldDecorator } = this.props.form;
        return (  
            <div className='create-channel-page'>
                <div className="form-box">
                    <Form className='ant-form-custom' onSubmit={this.handleSubmit}>
                        <FormItem
                            label="通道名称"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 4 }}
                        >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入名称!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="选择组织"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 8 }}
                        >
                            {getFieldDecorator('id', {
                                rules: [{ required: true, message: '请选择组织!' }],
                            })(
                                <Select
                                    placeholder="Select a option and change input text above"
                                    onChange={this.handleSelectChange}
                                >
                                    {
                                        this.state.orgList.map((item,index)=>{
                                            return <Option key={item.id} >{item.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <div className="bottom-btn-box">
                            <FormItem
                            // wrapperCol={{ span: 12, offset: 5 }}
                            className='bottom-btn-content'
                            >
                                <Button className='submit' type="primary" htmlType="submit" loading={this.state.loading}>
                                    确认
                                </Button>
                                <Button className='cancel'>取消</Button>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

const CreateChannel = Form.create()(CreateChannelContent)
export default CreateChannel;