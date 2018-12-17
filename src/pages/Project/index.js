/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React, { Component } from 'react';
// import './index.less';
import moment from "moment"
// import '../../styles/reset.less'
import { Icon,Breadcrumb, Modal,Form,Input,message, Popover,Card, Avatar,List,Spin } from 'antd';
import Cookies from 'js-cookie'
import { NavLink } from 'react-router-dom';
import intl from 'react-intl-universal'
import config from "../../Utils/apiconfig";
import request from '../../Utils/Axios'
const { Meta } = Card;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const {api:{user,chain}} = config


class Project extends Component {
    constructor(props){
        super(props)
        this.state = {
            expired : false,
            resetPasswordVisible:false,
            passErrorTip:"",
            passVisible:"none",
            passTip:'',
            passConfirmTip:"",
            visible: false,
            chainListLoading:false,
            chainlistArr:[],
        }
    }
    componentDidMount(){
        this.setState({
            chainListLoading:true
        })
        request().get(chain.chainList).then((chainListRes)=>{
            if(chainListRes){
                console.log(chainListRes)
                switch(chainListRes.status){
                    case 200:
                        this.setState({
                            chainListLoading:false,
                            chainlistArr:chainListRes.data.data
                        })
                        break;
                    case 401:
                        Cookies.remove('token');
                        Cookies.remove('userNameInfo');
                        sessionStorage.removeItem('projectData');
                        sessionStorage.removeItem('consortiumType');
                        this.props.history.push({
                            pathname:"/login"
                        })
                        break;
                    default: message.error(intl.get("Chain_List_Query_Failed"))
                }
            }
        })
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    okloginOut = ()=>{
        request().post(user.logout).then((response)=>{
            if(response){
                switch(response.status){
                    case 200:
                        Cookies.remove('token');
                        Cookies.remove('userNameInfo');
                        sessionStorage.removeItem('projectData');
                        sessionStorage.removeItem('consortiumType');
                        this.props.history.push({
                            pathname:"/login"
                        })
                        break;
                    default:
                        Cookies.remove('token');
                        Cookies.remove('userNameInfo');
                        sessionStorage.removeItem('projectData');
                        sessionStorage.removeItem('consortiumType');
                        this.props.history.push({
                            pathname:"/login"
                        })
                }
            }
        })
    }

    validateConfirmPassword = (rule, value, callback) => {
        const {form: {getFieldValue}} = this.props
        this.setState({
            passConfirmTip:""
        })
        if(getFieldValue('newPassword')){
            if (value && value !== getFieldValue('newPassword')) {
                this.setState({
                    passConfirmTip:intl.get("Password_Must_Match")
                })
            }else{
                this.setState({
                    passConfirmTip:""
                })
            }
        }
        callback()
    }

    //判断输入密码的类型
    CharMode = (iN)=> {
        if (iN>=48 && iN <=57) //数字
            return 1;
        if (iN>=65 && iN <=90) //大写
            return 2;
        if (iN>=97 && iN <=122) //小写
            return 4;
        else
            return 8;
    }
    //bitTotal函数
    //计算密码模式
    bitTotal = (num) =>{
        let modes=0;
        for (let i=0;i<4;i++){
            if (num & 1) modes++;
            num>>>=1;
        }
        return modes;
    }
    //返回强度级别
    checkStrong = (sPW) => {
        if (sPW.length<6)
            return 0; //密码太短，不检测级别
        let Modes=0;
        for (let i=0;i<sPW.length;i++){
            //密码模式
            Modes|=this.CharMode(sPW.charCodeAt(i));
        }
        return this.bitTotal(Modes);
    }

    pwStrength = (rule, pwd, callback) => {
        const _this = this
        const Dfault_color="#eef1f5";     //默认颜色
        const L_color="#f13640";      //低强度的颜色，且只显示在最左边的单元格中
        const M_color="#f5a623";      //中等强度的颜色，且只显示在左边两个单元格中
        const H_color="#7ed321";      //高强度的颜色，三个单元格都显示
        let Lcolor = null
        let Mcolor = null
        let Hcolor = null
        this.setState({
            passVisible:"flex",
        })
        if (pwd == null||pwd === ''){
            callback()
            _this.setState({
                passVisible:"none",
                passTip:""
            })
        }else if(pwd.length <6){
            callback(intl.get("Password_Cannot_Be_Less_Than_6"))
            _this.setState({
                passTip:""
            })
            Lcolor=Mcolor=Hcolor=Dfault_color;
        }
        else{
            let S_level=this.checkStrong(pwd);
            switch(S_level) {
                case 0:
                    Lcolor=Mcolor=Hcolor=Dfault_color;
                    _this.setState({
                        passTip:""
                    })
                    break;
                case 1:
                    Lcolor=L_color;
                    Mcolor=Hcolor=Dfault_color;
                    _this.setState({
                        passTip: intl.get("Password_Weak")
                    })
                    break;
                case 2:
                    Lcolor=L_color
                    Mcolor=M_color;
                    Hcolor=Dfault_color;
                    _this.setState({
                        passTip: intl.get("Password_Medium")
                    })
                    break;
                default:
                    Lcolor=L_color
                    Mcolor=M_color
                    Hcolor=H_color;
                    _this.setState({
                        passTip: intl.get("Password_Strong")
                    })
            }
            callback()

            const {form: {getFieldValue}} = this.props
            if(getFieldValue('confirmPassword')){
                if (pwd && pwd !== getFieldValue('confirmPassword')) {
                    this.setState({
                        passConfirmTip: intl.get("Password_Must_Match")
                    })
                }else{
                    this.setState({
                        passConfirmTip:""
                    })
                }
            }
        }
        document.getElementById("strength_L").style.background=Lcolor;
        document.getElementById("strength_M").style.background=Mcolor;
        document.getElementById("strength_H").style.background=Hcolor;
        return;
    }

    okResetPassword = (e)=>{
        const {form: {getFieldValue}} = this.props
        const userName = Cookies.get('userNameInfo')
        const _this = this
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                if(getFieldValue('newPassword') !== getFieldValue('confirmPassword')) {
                    this.setState({
                        passConfirmTip: intl.get("Password_Must_Match")
                    })
                }else{
                    request().post(user.resetPassword,{
                        "username": userName,
                        "password": values.password,
                        "newPassword": values.newPassword
                    }).then((response)=>{
                        if(response){
                            switch(response.status){
                                case 200:
                                    _this.setState({
                                        passErrorTip:'',
                                        resetPasswordVisible:false,
                                        passConfirmTip:"",
                                        passTip:"",
                                    })
                                    message.success(intl.get("Password_Modify_Successfully"), 1)
                                    setTimeout(()=>{
                                        _this.okloginOut()
                                    },1000)
                                    break;
                                case 401:
                                    let code = response.data.code
                                    if(code){
                                        code === 10002 ? message.error(intl.get("Password_Reset_Failed")) : ""
                                    }else{
                                        Cookies.remove('token');
                                        Cookies.remove('userNameInfo');
                                        sessionStorage.removeItem('projectData');
                                        sessionStorage.removeItem('consortiumType');
                                        this.props.history.push({
                                            pathname:"/login"
                                        })
                                    }
                                    break;
                                case 500:
                                    message.error(intl.get("Network_Error"))
                                    _this.setState({
                                        resetPasswordVisible:false,
                                        passConfirmTip:"",
                                        passTip:"",
                                        passErrorTip:""
                                    })
                                    break;
                                default:
                                    message.error(intl.get("Password_Modify_Failed"))
                                    _this.setState({
                                        resetPasswordVisible:false,
                                        passConfirmTip:"",
                                        passTip:"",
                                        passErrorTip:""
                                    })
                            }
                        }
                    })
                }
            }else{
                console.log("err")
            }
        })
    }

    CancelResetPassword = ()=>{
        this.setState({
            resetPasswordVisible:false,
            passConfirmTip:"",
            passTip:"",
            passErrorTip:""

        })
    }

    inputPassword = (rule, value, callback)=>{
        this.setState({
            passErrorTip:""
        })
        callback()
    }

    renderDropdown = () => {
        return  (
            <ul style={{minWidth: 60 }}>
                <li key='dash' className='drop-item'><a onClick={this.resetPasswordVisibleFn}>修改密码</a></li>
                <li key='loginout' className='drop-item'><a onClick={this.logoutTip}>注销</a></li>
            </ul>
        )
    }

    changeVisible = (a)=>{
        this.setState({
            visible: a
        })
    }

    logoutTip = ()=>{
        let _this = this;
        this.setState({
            visible: false
        })
        confirm({
            getContainer:()=>document.getElementById("dom"),
            title: intl.get("Logout_Title"),
            okText: intl.get("Logout_Confirm"),
            cancelText: intl.get("Logout_Cancel"),
            className: "creatModalConfirm",
            width: '380px',
            onOk() {
                _this.okloginOut()
            },
            onCancel() {

            },
        });
    }

    resetPasswordVisibleFn = ()=>{
        this.setState({
            resetPasswordVisible:true,
            visible: false
        })
    }

    enterDashboard = (item)=>{
        let ConsortiumInfo = JSON.stringify(item);
        sessionStorage.setItem('ConsortiumInfo', ConsortiumInfo);
        this.props.history.push({
            pathname:"/dashboard"
        })
    }
    render() {
        const userName = Cookies.get('userNameInfo')
        const {chainlistArr,chainListLoading} = this.state
        const {form: {getFieldDecorator}} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 2},
                sm: { span: 6,offset:1 },
                md: { span: 6,offset:1 },
                lg: { span: 6,offset:1 },
                xl: { span: 6,offset:1 },
                xxl: {span: 6,offset:1}
            },
            wrapperCol: {
                xs: { span: 22 },
                sm: { span: 16 },
                md: { span: 16 },
                lg: { span: 16 },
            },
        };


        return (
            <div id="dom" className="layout">
                <header>
                    <li className="headerImg">
                        {
                            intl.options.currentLocale === "zh-CN" ? <img src={require("../../images/zig-baas.svg")} alt=""/> : <img src={require("../../images/logo_en_blue.svg")} alt=""/>
                        }
                    </li>

                    <div className="headerRight">
                        <div className='user-name-box dropDown-link'>
                            <Popover
                                visible={this.state.visible}
                                onVisibleChange={this.changeVisible}
                                placement="bottom"
                                content={this.renderDropdown()}
                                trigger="hover"
                                overlayClassName='user-name-drop'
                                mouseLeaveDelay={0.3}
                            >
                                <span style={{marginRight:'8px',cursor:"pointer"}}><img style={{marginRight:"8px"}} src={require("../../images/ic-user.svg")} alt=""/>{userName}</span><Icon type="down" />
                            </Popover>
                        </div>
                    </div>
                </header>
                <Breadcrumb style={{padding:"0 24px",background:'#ffffff',height:"48px",lineHeight:"48px"}} >
                    <Breadcrumb.Item>{intl.get("My_League")}</Breadcrumb.Item>
                </Breadcrumb>

                <div className="servicePart">
                    { chainListLoading && <Spin className="chainCodeListSpin" size="large"> </Spin>}
                    <List
                        style={{width:"100%"}}
                        grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
                        dataSource={chainlistArr || []}
                        renderItem={item => (
                            <List.Item>
                                <Card
                                    className="chainliatItem"
                                    style={{marginBottom:"24px",height:"165px"}}
                                    actions={[<span onClick={()=>{this.enterDashboard(item)}}>{intl.get("League_Manangement")}<Icon type="right" theme="outlined" /></span>]}
                                >
                                    <Meta
                                        avatar={<Avatar src={require("../../images/invalid-name.svg")} />}
                                        title={item.name}
                                        description={<div>
                                            <p><code>{intl.get("Type")}:</code><span>{item.type}</span></p>
                                            <p><code>{intl.get("Time")}:</code><span>{moment(item.date).format('YYYY-MM-DD HH:mm:ss')}</span></p>
                                        </div>}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
                {
                    this.state.resetPasswordVisible ? <Modal
                        centered={true}
                        getContainer={()=>document.getElementById("dom")}
                        title={<h1 className="delectContractTit">{intl.get("Change_Password")}</h1>}
                        visible={this.state.resetPasswordVisible}
                        onOk={this.okResetPassword}
                        onCancel={this.CancelResetPassword}
                        okText={intl.get("Confirm")}
                        cancelText={intl.get("Cancel")}
                        bodyStyle={{textAlign:'center',fontSize:'16px',color:"#354052"}}
                        width='720px'
                    >
                        <Form
                            className="resetPassModalForm"
                            onSubmit={this.okResetPassword}
                            hideRequiredMark={true}
                        >
                            <FormItem label={intl.get("Old_Password")} {...formItemLayout} style={{marginBottom:"0px"}} className="resetPassFormItem">
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: intl.get("Please_Input_Old_Password"),

                                        },
                                        {
                                            validator: this.inputPassword,
                                        }
                                    ],
                                })(<Input type="password" placeholder={intl.get("Please_Input_Old_Password")} size="large"/>)}
                            </FormItem>
                            <code style={{top:"0px"}}>{this.state.passErrorTip}</code>
                            <FormItem
                                label={intl.get("New_Password")}
                                {...formItemLayout}
                                className="resetPassFormItem"
                                style={{marginBottom:"20px"}}
                            >
                                {getFieldDecorator('newPassword', {
                                    rules: [
                                        {
                                            required: true, message:intl.get("Please_Input_New_Password"),
                                        },
                                        {
                                            validator: this.pwStrength,
                                        }],
                                })(
                                    <Input type="password" placeholder={intl.get("Please_Input_New_Password")} size="large"/>
                                )}
                                <div className="passCaptchaBox" style={{display:this.state.passVisible}}>
                                    <span style={{flex:"1"}} id="strength_L"> </span>
                                    <span style={{flex:"1",margin:"0 5px"}} id="strength_M"> </span>
                                    <span style={{flex:"1"}} id="strength_H"> </span>
                                    <b className="passTip">{this.state.passTip}</b>
                                </div>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={intl.get("Confirm_New_Password")}
                                className="resetPassFormItem"
                                style={{marginBottom:"0px"}}
                            >
                                {getFieldDecorator('confirmPassword', {
                                    rules: [{
                                        required: true, message: intl.get("Please_Input_New_Password"),
                                    }, {
                                        validator: this.validateConfirmPassword,
                                    }],
                                })(
                                    <Input type="password" placeholder={intl.get("Confirm_New_Password")} size="large"/>
                                )}
                            </FormItem>
                            <code style={{top:"-9px"}}>{this.state.passConfirmTip}</code>
                        </Form>
                    </Modal> :""
                }

            </div>
        );

    }
}

Project = Form.create()(Project)
export default (Project);
