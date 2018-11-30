import React, { Component } from 'react';
import { Form, Icon, Input, Button, Select, message } from 'antd'
import intl from 'react-intl-universal'
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
                console.log('Received values of form: ', values);
                let id = values.id
                request().post(channel, {
                    name: values.name,
                    organizationIds: [values.id]
                },{
                    cancelToken: new CancelToken(function executor(c) {
                        // An executor function receives a cancel function as a parameter
                        cancel1 = c;
                    })
                }).then(res=>{
                    console.log(res)
                    if(res){
                        switch(res.status){
                            case 200:
                                // message.info(res.data.msg)
                                request().post(channelJoin, {
                                    organizationId: id,
                                    channelId: res.data.data._id
                                },{
                                    cancelToken: new CancelToken(function executor(c) {
                                        // An executor function receives a cancel function as a parameter
                                        cancel3 = c;
                                    })
                                }).then(res=>{
                                    console.log(res)
                                    this.setState({
                                        loading: false
                                    })
                                    if(res){
                                        switch(res.status){
                                            case 200:
                                                // message.info("创建成功")
                                                this.props.history.push("/dashboard/channel_management")
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
        request().get(organization.orgList,{
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel2 = c;
            })
        }).then(res => {
            if (res) {
                console.log(res)
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
    goBack = ()=>{
        this.props.history.push('/dashboard/channel_management')
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
        if(cancel3){
            cancel3()
        }
    }
    render() { 
        const { getFieldDecorator } = this.props.form;
        return (  
            <div className='create-channel-page'>
                <div className="form-box">
                    <Form className='ant-form-custom' onSubmit={this.handleSubmit}>
                        <FormItem
                            label={intl.get("Channel_Name_Long")}
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
                            label={intl.get("Select_Org")}
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
                    </Form>
                </div>
                <div className="bottom-btn-box">
                    <FormItem
                    // wrapperCol={{ span: 12, offset: 5 }}
                    className='bottom-btn-content'
                    >
                        <Button onClick={this.handleSubmit} className='submit' type="primary" htmlType="submit" loading={this.state.loading}>
                            {intl.get("Confirm")}
                        </Button>
                        <Button onClick={this.goBack} className='cancel'>{intl.get("Cancel")}</Button>
                    </FormItem>
                </div>
            </div>
        );
    }
}

const CreateChannel = Form.create()(CreateChannelContent)
export default CreateChannel;