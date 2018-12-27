/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React, { Component } from 'react';
import intl from 'react-intl-universal'
import { Layout, Menu, Breadcrumb, Icon, Modal,Popover,Form,Input, Spin } from 'antd';
import { Switch, Redirect, Route , Link} from 'react-router-dom';
import Loadable from 'react-loadable';
import Tip from '../../Utils/Tip'
// import logo from '../../images/logo.svg';
import { NavLink } from 'react-router-dom'
import overview from '../../images/slider/overview.svg';
// import block from '../../images/slider/blockchain.svg';
// import chain from '../../images/slider/chaincode.svg';
import channel from '../../images/slider/channel.svg';
import log from '../../images/slider/log.svg';
import organization from '../../images/slider/organization.svg';
import peer from '../../images/slider/peer.svg';
import unoverview from '../../images/slider/unoverview.svg';
// import unblock from '../../images/slider/unblockchain.svg';
// import unchain from '../../images/slider/unchaincode.svg';
import unchannel from '../../images/slider/unchannel.svg';
import unlog from '../../images/slider/unlog.svg';
import unorganization from '../../images/slider/unorganization.svg';
import unpeer from '../../images/slider/unpeer.svg';
import BlockChain from './components/BlockChain/index';
import ChainCode from './components/ChainCode/index';
// import Channel from './components/Channel/index';
import ChannelOrg from './components/Channel/components/ChannelOrg/ChannelOrg'
import CreateChannel from './components/Channel/components/CreateChannel/CreateChannel'
import PeerManagement from './components/Organization/components/PeerManagement/index';
import CreateOrganization from './components/Organization/components/CreateOrganization/index';
import CreatePeer from './components/Peer/components/CreatePeer/index';
import createPeer from './components/Organization/components/PeerManagement/createPeer/createPeer';
// import Log from './components/Log/index';
// import Organization from './components/Organization/index';
// import OverView from './components/OverView/index';
// import Peer from './components/Peer/index';
import Cookies from "js-cookie";
import request from "../../Utils/Axios";
import {message} from "antd/lib/index";
import config from "../../Utils/apiconfig";

const MyLoadingComponent = ({ isLoading, error }) => {
    if (isLoading) {
        return <div style={{position:"absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><Spin size="large" /></div>;
    }
    else if (error) {
        return <Tip />;
    }
    else {
        return null;
    }
};


const OverView = Loadable({
    loader: () => import('./components/OverView/index'),
    loading: MyLoadingComponent
})
const Organization = Loadable({
    loader: () => import('./components/Organization/index'),
    loading: MyLoadingComponent
})
const Channel = Loadable({
    loader: () => import('./components/Channel/index'),
    loading: MyLoadingComponent
})
const Peer = Loadable({
    loader: () => import('./components/Peer/index'),
    loading: MyLoadingComponent
})
const Log = Loadable({
    loader: () => import('./components/Log/index'),
    loading: MyLoadingComponent
})

const {api:{user}} = config
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Header, Content, Sider } = Layout;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            passVisible:"none",
            resetPasswordVisible:false,
            visible: false,
            passConfirmTip:"",
            passTip:"",
            passErrorTip:"",
        }
        this.defaultLang = ''
    }

    // base64转字符串
    decode = (base64) =>{
        // 对base64转编码
        let decode = atob(base64);
        // 编码转字符串
        let str = decodeURI(decode);
        return str;
    }

    // 字符串转base64
    encode = (str) =>{
        // 对字符串进行编码
        let encode = encodeURI(str);
        // 对编码的字符串转化base64
        let base64 = btoa(encode);
        return base64;
    }

    componentWillMount() {
        if (!Cookies.get('lang')) {
            let lang = window.navigator.language;
            if (lang === 'zh') lang = 'zh-CN';
            Cookies.set("lang", lang, { expires: 7 });
        }
        const lang = Cookies.get('lang');
        switch (lang) {
            case 'zh-CN':
            case 'zh': this.defaultLang = '简体中文'; break;
            case 'en-US': this.defaultLang = 'English'; break;
            default: this.defaultLang = 'English';
        }
    }
    changeLanguage = (e) => {
        Cookies.set('lang', e, { expires: 7 });
        window.location.reload();
    }
    renderLang = () => {
        return (
            <ul style={{ minWidth: 30 }}>
                <li className='language-item'><a onClick={() => this.changeLanguage('zh-CN')}><span className='language-item-span'>简体中文</span></a></li>
                <li className='language-item'><a onClick={() => this.changeLanguage('en-US')}><span className='language-item-span'>English</span></a></li>
            </ul>
        )
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    validateConfirmPassword = (rule, value, callback) => {
        const {form: {getFieldValue}} = this.props
        this.setState({
            passConfirmTip:""
        })
        if(getFieldValue('newPassword')){
            if (value && value !== getFieldValue('newPassword')) {
                this.setState({
                    passConfirmTip: intl.get("Password_Must_Match")
                })
            }else{
                this.setState({
                    passConfirmTip:""
                })
            }
        }
        callback()
    }
    inputPassword = (rule, value, callback)=>{
        this.setState({
            passErrorTip:""
        })
        callback()
    }
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

    routerList = ({ item, key, keyPath }) => {
        switch (key) {
            case "overview":
                this.props.history.push({
                    pathname: "/dashboard/overview"
                })
                break;
            case "blockchain_browser":
                this.props.history.push({
                    pathname: "/dashboard/blockchain_browser"
                })
                break;
            case "organization_management":
                this.props.history.push({
                    pathname: "/dashboard/organization_management"
                })
                break;
            case "channel_management":
                this.props.history.push({
                    pathname: "/dashboard/channel_management"
                })
                break;
            case "peer_management":
                this.props.history.push('/dashboard/peer_management')
                break;
            case "chaincode_management":
                this.props.history.push("/dashboard/chaincode_management")
                break;
            case "log_management":
                this.props.history.push("/dashboard/log_management")
                break;
            default:
                this.props.history.push({
                    pathname: "/dashboard/overview"
                })
        }
    }

    resetPasswordVisibleFn = ()=>{
        this.setState({
            resetPasswordVisible:true,
            visible: false
        })
    }

    okloginOut = ()=>{
        const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
        request().post(`${newApi}${user.logout}`).then((response)=>{
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

    logoutTip = ()=>{
        let _this = this;
        this.setState({
            visible: false
        })
        confirm({
            getContainer:()=>document.getElementById("dom_dashboard"),
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
                    const newApi = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1":""
                    request().post(`${newApi}${user.resetPassword}`,{
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

    renderDropdown = () => {
        return  (
            <ul style={{minWidth: 60 }}>
                <li key='dash' className='drop-item'><a onClick={this.resetPasswordVisibleFn}>{intl.get("Change_Password")}</a></li>
                <li key='loginout' className='drop-item'><a onClick={this.logoutTip}>{intl.get("Logout")}</a></li>
            </ul>
        )
    }

    changeVisible = (a)=>{
        this.setState({
            visible: a
        })
    }

    getCurrentMenuSelectedKeys(props) {
        const { location: { pathname } } = props || this.props;
        const keys = pathname.split('/').slice(1);
        if (keys.length === 1 && keys[0] === '') {
            return [this.menus[0].key];
        }
        return keys;
    }

    CancelResetPassword = ()=>{
        this.setState({
            resetPasswordVisible:false,
            passConfirmTip:"",
            passTip:"",
            passErrorTip:""

        })
    }
    componentDidMount(){

    }
    render() {
        let pathArr = this.props.location.pathname.split('/');
        let path = pathArr[2];
        // const userName = Cookies.get('userNameInfo')
        // if (!sessionStorage.getItem('ConsortiumInfo')) {
        //     this.props.history.push('/project')
        // }
        const {form: {getFieldDecorator}} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 2},
                sm: { span: 4,offset:1 },
                md: { span: 4,offset:2 },
                lg: { span: 4,offset:1 },
                xl: { span: 4,offset:1 },
                xxl: {span: 4,offset:1}
            },
            wrapperCol: {
                xs: { span: 22 },
                sm: { span: 16 },
                md: { span: 16 },
                lg: { span: 16 },
            },
        };
        const breadcrumbNameMap={
            '/dashboard':intl.get("Dashboard"),
            '/dashboard/overview': intl.get("Overview"),
            '/dashboard/blockchain_browser':"区块链浏览器",
            '/dashboard/channel_management': intl.get("Channel_Management"),
            '/dashboard/peer_management': intl.get("Node_Management"),
            '/dashboard/chaincode_management':"链码管理",
            '/dashboard/log_management': intl.get("Log_Management"),
            '/dashboard/organization_management': intl.get("Orgnization_Management"),
            '/dashboard/organization_management/peer':intl.get("Node_Info"),
            '/dashboard/channel_management/org': intl.get("Org_Info"),
            '/dashboard/channel_management/create_channel':intl.get("New_Channel"),
            '/dashboard/organization_management/create':intl.get("New_Org"),
            '/dashboard/peer_management/create':intl.get("New_Node"),
            '/dashboard/organization_management/peer/create':intl.get("New_Node")
        }
        let breadcrumbItems = null
        const location = this.props.location || window.location;
        const userName = Cookies.get('userNameInfo')
        if (location && location.pathname) {
            const pathSnippets = location.pathname.split('/').filter(i => i);
            const extraBreadcrumbItems = pathSnippets.map((_, index) => {
                const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                return (
                    <Breadcrumb.Item className="breadcrumb-section" key={url}>
                        <Link to={url}>
                            {breadcrumbNameMap[url]}
                        </Link>
                    </Breadcrumb.Item>
               )
            });

            breadcrumbItems = [].concat(extraBreadcrumbItems);
        }

        if(window.location.search.indexOf("?") !== -1){
            let request = new Object();
            const search = window.location.search.substr(1).split("&")
            for (var i = 0; i < search.length; i++) {
                if(i<2){
                    request[search[i].split("=")[0]] = this.decode(search[i].split("=")[1]);
                }else{
                    request[search[i].split("=")[0]] = search[i].split("=")[1];
                }

            }
            config.newAPI = request["url"]
            sessionStorage.setItem('ConsortiumInfo', JSON.stringify(request));
            Cookies.set("lang", request["local"] === "zh" ? "zh-CN" : request["local"] === "en" ? "en-US" :"", { expires: 7 });
        }
        return (
                <Layout className="dashboard_layout" >
                        <Sider className="slider"
                               breakpoint="lg"
                               collapsed={this.state.collapsed}
                               onCollapse={this.onCollapse}
                        >
                            {
                                this.state.collapsed
                                ?
                                (
                                    <li className="logo-side">
                                        <img src={require('../../images/dashboard_img.svg')} alt="" />
                                    </li>
                                )
                                :
                                    intl.options.currentLocale === "zh-CN" ? (
                                    <li className="logo">
                                        <img src={require('../../images/dashboard_white_zh.svg')} alt="" />
                                    </li>
                                )
                                :
                                (
                                    <li className="logo">
                                        <img src={require('../../images/dashboard_white_en.svg')} alt="" />
                                    </li>
                                )
                            }
                            <Menu
                                className="List"
                                theme="dark"
                                defaultSelectedKeys={['overview']}
                                mode="inline"
                                onClick={this.routerList}
                                selectedKeys={this.getCurrentMenuSelectedKeys()}>
                                <Menu.Item className="list-item" key="overview">
                                    <p className="fill-in" style={{visibility:path==="overview"?"":"hidden"}}></p>
                                    <img src={path==="overview"?overview:unoverview} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>{intl.get("Overview")}</span>
                                </Menu.Item>
                                {/* <Menu.Item className="list-item" key="blockchain_browser">
                                    <p className="fill-in" style={{visibility:path==="blockchain_browser"?"":"hidden"}}></p>
                                    <img src={path==="blockchain_browser"?block:unblock} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>区块链浏览器</span>
                                </Menu.Item> */}
                                <Menu.Item className="list-item" key="organization_management">
                                    <p className="fill-in" style={{visibility:(path==="organization"||path==="organization_management")?"":"hidden"}}></p>
                                    <img src={(path==="organization"||path==="organization_management")?organization:unorganization} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>{intl.get("Orgnization_Management")}</span>
                                </Menu.Item>
                                <Menu.Item className="list-item" key="channel_management">
                                    <p className="fill-in" style={{visibility:path==="channel_management"?"":"hidden"}}></p>
                                    <img src={path==="channel_management"?channel:unchannel} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>{intl.get("Channel_Management")}</span>
                                </Menu.Item>
                                <Menu.Item className="list-item" key="peer_management">
                                    <p className="fill-in" style={{visibility:path==="peer_management"?"":"hidden"}}></p>
                                    <img src={path==="peer_management"?peer:unpeer} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>{intl.get("Node_Management")}</span>
                                </Menu.Item>
                                {/* <Menu.Item className="list-item" key="chaincode_management">
                                    <p className="fill-in" style={{visibility:path==="chaincode_management"?"":"hidden"}}></p>
                                    <img src={path==="chaincode_management"?chain:unchain} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>链码管理</span>
                                </Menu.Item> */}
                                <Menu.Item className="list-item" key="log_management">
                                    <p className="fill-in" style={{visibility:path==="log_management"?"":"hidden"}}></p>
                                    <img src={path==="log_management"?log:unlog} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>{intl.get("Log_Management")}</span>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout className="layout-header">
                            <div id="dom_dashboard" className="dom_dashboard">
                                <Header style={{ background: '#fff', padding: 0, borderBottom: '1px solid #e6eaee' }}>
                                    <Icon
                                        className="trigger"
                                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                        onClick={this.toggle}
                                    />
                                    <div className="header-list">
                                        <div className="language-box" ref="languageBox">
                                            <Popover
                                                placement="bottom"
                                                content={this.renderLang()}
                                                trigger="hover"
                                                // getPopupContainer={() => this.refs.navBox}
                                                mouseLeaveDelay={0.3}
                                            >
                                                <span className='current-lang'>{this.defaultLang}</span><Icon type="down" />
                                            </Popover>
                                        </div>
                                        <div className="consortiumJump"><NavLink to="/project" style={{cursor:"pointer"}}>{intl.get("My_League")}</NavLink></div>
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
                                </Header>
                                <div className="breadcrumb">
                                    <Breadcrumb style={{ padding: "0 24px", background: '#ffffff', height: "48px", lineHeight: "48px", color: "#7f8fa4", float: "left" }} >
                                        {breadcrumbItems}
                                    </Breadcrumb>
                                </div>
                                <Content className="content" style={{ borderRadius: "3px", background: "#f0f2f5", position: "relative" }}>
                                    <Switch>
                                        <Route path="/dashboard/overview" component={OverView} />
                                        <Redirect exact from="/dashboard" to="/dashboard/overview" />
                                        <Route path="/dashboard/blockchain_browser" component={BlockChain} />
                                        <Route exact path="/dashboard/organization_management" component={Organization} />
                                        <Route exact path="/dashboard/channel_management" component={Channel} />
                                        <Route path="/dashboard/channel_management/org" component={ChannelOrg} />
                                        <Route path="/dashboard/channel_management/create_channel" component={CreateChannel} />
                                        <Route exact path="/dashboard/peer_management" component={Peer} />
                                        <Route exact path="/dashboard/organization_management/peer" component={PeerManagement} />
                                        <Route path="/dashboard/organization_management/peer/create" component={createPeer} />
                                        <Route path="/dashboard/organization_management/create" component={CreateOrganization} />
                                        <Route path="/dashboard/peer_management/create" component={CreatePeer} />
                                        <Route path="/dashboard/chaincode_management" component={ChainCode} />
                                        <Route path="/dashboard/log_management" component={Log} />
                                        {/* <Route path="/dashboard/lost" component={Channel} /> */}
                                        <Route path="/dashboard/*" render={(props) => <Redirect to='/dashboard/overview' />} />
                                    </Switch>
                                </Content>
                                {
                                    this.state.resetPasswordVisible ? <Modal
                                        centered={true}
                                        getContainer={()=>document.getElementById("dom_dashboard")}
                                        title={<h1 className="delectContractTit">{intl.get("Change_Password")}</h1>}
                                        visible={this.state.resetPasswordVisible}
                                        onOk={this.okResetPassword}
                                        onCancel={this.CancelResetPassword}
                                        okText={intl.get("Confirm")}
                                        cancelText={intl.get("Cancel")}
                                        bodyStyle={{textAlign:'center',fontSize:'16px',color:"#354052"}}
                                        width='521px'
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
                                                            required: true, message: intl.get("Please_Input_New_Password"),
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
                                                    <Input type="password" placeholder={intl.get("Please_Input_New_Password")} size="large"/>
                                                )}
                                            </FormItem>
                                            <code style={{top:"-9px"}}>{this.state.passConfirmTip}</code>
                                        </Form>
                                    </Modal> :""
                                }
                            </div>
                        </Layout>

                </Layout>
        );
    }
}

Dashboard = Form.create()(Dashboard)
export default Dashboard;