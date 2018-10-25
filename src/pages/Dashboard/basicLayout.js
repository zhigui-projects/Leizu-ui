import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Modal,Popover,Form,Input } from 'antd';
import { Switch, Redirect, Route , Link} from 'react-router-dom';
// import logo from '../../images/logo.svg';
import overview from '../../images/slider/overview.svg';
import block from '../../images/slider/blockchain.svg';
import chain from '../../images/slider/chaincode.svg';
import channel from '../../images/slider/channel.svg';
import log from '../../images/slider/log.svg';
import organization from '../../images/slider/organization.svg';
import peer from '../../images/slider/peer.svg';
import unoverview from '../../images/slider/unoverview.svg';
import unblock from '../../images/slider/unblockchain.svg';
import unchain from '../../images/slider/unchaincode.svg';
import unchannel from '../../images/slider/unchannel.svg';
import unlog from '../../images/slider/unlog.svg';
import unorganization from '../../images/slider/unorganization.svg';
import unpeer from '../../images/slider/unpeer.svg';
import './basicLayout.less';
import BlockChain from './components/BlockChain/index';
import ChainCode from './components/ChainCode/index';
import Channel from './components/Channel/index';
import ChannelOrg from './components/Channel/components/ChannelOrg/ChannelOrg'
import CreateChannel from './components/Channel/components/CreateChannel/CreateChannel'
import Log from './components/Log/index';
import Organization from './components/Organization/index';
import OverView from './components/OverView/index';
import Peer from './components/Peer/index';
import Cookies from "js-cookie";
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
                    passConfirmTip:"两次输入密码必须一致"
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
            callback("密码不能小于6位")
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
                        passTip:"密码强度：弱 请尝试添加符号（！＃@）和字母（AZ）"
                    })
                    break;
                case 2:
                    Lcolor=L_color
                    Mcolor=M_color;
                    Hcolor=Dfault_color;
                    _this.setState({
                        passTip:"密码强度：中  请尝试添加符号（！＃@）和字母（AZ）"
                    })
                    break;
                default:
                    Lcolor=L_color
                    Mcolor=M_color
                    Hcolor=H_color;
                    _this.setState({
                        passTip:"密码强度：强"
                    })
            }
            callback()

            const {form: {getFieldValue}} = this.props
            if(getFieldValue('confirmPassword')){
                if (pwd && pwd !== getFieldValue('confirmPassword')) {
                    this.setState({
                        passConfirmTip:"两次输入密码必须一致"
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
        Cookies.remove('token');
        Cookies.remove('userNameInfo');
        sessionStorage.removeItem('projectData');
        sessionStorage.removeItem('consortiumType');
        this.props.history.push({
            pathname:"/login"
        })
    }
    logoutTip = ()=>{
        let _this = this;
        this.setState({
            visible: false
        })
        confirm({
            getContainer:()=>document.getElementById("dom_dashboard"),
            title: "确认退出登录吗",
            okText: "确认退出",
            cancelText: "我再想想",
            className: "creatModalConfirm",
            width: '380px',
            onOk() {
                _this.okloginOut()
            },
            onCancel() {

            },
        });
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
    render() {
        let pathArr = this.props.location.pathname.split('/');
        let path = pathArr[2];
        const userName = Cookies.get('userNameInfo')
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
            '/dashboard':"控制台",
            '/dashboard/overview':"概览",
            '/dashboard/blockchain_browser':"区块链浏览器",
            '/dashboard/channel_management':"通道管理",
            '/dashboard/peer_management':"节点管理",
            '/dashboard/chaincode_management':"链码管理",
            '/dashboard/log_management':"日志管理",
            '/dashboard/organization_management':"组织管理",
            '/dashboard/organization_management/organization':"组织信息",
            '/dashboard/organization_management/peer':"节点信息"
        }
        let breadcrumbItems = null
        const location = this.props.location || window.location;
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
                                    <li className="logo-side" to='/index' target="_blank">
                                        <img src={require('../../images/logo_side.svg')} alt="" />
                                    </li>
                                )
                                :
                                (
                                    <li className="logo" to='/index' target="_blank">
                                        <img src={require('../../images/logo.svg')} alt="" />
                                    </li>
                                )
                            }
                            
                            {/* <NavLink className="logo" to='/index' target="_blank">
                            {
                                this.props.intl.locale === "en" ? <img src={require('../../images/logo_en_dash.svg')} alt="" /> : <img src={logo} alt="" />
                            }
                        </NavLink> */}
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
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>概览</span>
                                </Menu.Item>
                                <Menu.Item className="list-item" key="blockchain_browser">
                                    <p className="fill-in" style={{visibility:path==="blockchain_browser"?"":"hidden"}}></p>
                                    <img src={path==="blockchain_browser"?block:unblock} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>区块链浏览器</span>
                                </Menu.Item>
                                <Menu.Item className="list-item" key="organization_management">
                                    <p className="fill-in" style={{visibility:(path==="organization"||path==="organization_management")?"":"hidden"}}></p>
                                    <img src={(path==="organization"||path==="organization_management")?organization:unorganization} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>组织管理</span>
                                </Menu.Item>
                                <Menu.Item className="list-item" key="channel_management">
                                    <p className="fill-in" style={{visibility:path==="channel_management"?"":"hidden"}}></p>
                                    <img src={path==="channel_management"?channel:unchannel} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>通道管理</span>
                                </Menu.Item>
                                <Menu.Item className="list-item" key="peer_management">
                                    <p className="fill-in" style={{visibility:path==="peer_management"?"":"hidden"}}></p>
                                    <img src={path==="peer_management"?peer:unpeer} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>节点管理</span>
                                </Menu.Item>
                                <Menu.Item className="list-item" key="chaincode_management">
                                    <p className="fill-in" style={{visibility:path==="chaincode_management"?"":"hidden"}}></p>
                                    <img src={path==="chaincode_management"?chain:unchain} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>链码管理</span>
                                </Menu.Item>
                                <Menu.Item className="list-item" key="log_management">
                                    <p className="fill-in" style={{visibility:path==="log_management"?"":"hidden"}}></p>
                                    <img src={path==="log_management"?log:unlog} alt=" " />
                                    <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>日志管理</span>
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
                                        <div className="language-box">
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
                                        </div>
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
                                                <span style={{marginRight:'8px'}}><img style={{marginRight:"8px"}} src={require("../../images/ic-user.svg")} alt=""/>{userName}</span><Icon type="down" />
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
                                        <Route path="/dashboard/organization_management" component={Organization} />
                                        <Route exact path="/dashboard/channel_management" component={Channel} />
                                        <Route path="/dashboard/channel_management/org/:id" component={ChannelOrg} />
                                        <Route path="/dashboard/channel_management/createChannel" component={CreateChannel} />
                                        <Route path="/dashboard/peer_management" component={Peer} />
                                        <Route path="/dashboard/chaincode_management" component={ChainCode} />
                                        <Route path="/dashboard/log_management" component={Log} />
                                        <Route path="/dashboard/lost" component={Channel} />
                                        <Route path="/dashboard/*" render={(props) => <Redirect to='/dashboard/lost' />} />
                                    </Switch>
                                </Content>
                                {
                                    this.state.resetPasswordVisible ? <Modal
                                        centered={true}
                                        getContainer={()=>document.getElementById("dom_dashboard")}
                                        title={<h1 className="delectContractTit">修改密码</h1>}
                                        visible={this.state.resetPasswordVisible}
                                        onOk={this.okResetPassword}
                                        onCancel={this.CancelResetPassword}
                                        okText="确认"
                                        cancelText="取消"
                                        bodyStyle={{textAlign:'center',fontSize:'16px',color:"#354052"}}
                                        width='521px'
                                    >
                                        <Form
                                            className="resetPassModalForm"
                                            onSubmit={this.okResetPassword}
                                            hideRequiredMark={true}
                                        >
                                            <FormItem label="旧密码" {...formItemLayout} style={{marginBottom:"0px"}} className="resetPassFormItem">
                                                {getFieldDecorator('password', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:"请输入旧密码",

                                                        },
                                                        {
                                                            validator: this.inputPassword,
                                                        }
                                                    ],
                                                })(<Input type="password" placeholder="请输入旧密码" size="large"/>)}
                                            </FormItem>
                                            <code style={{top:"0px"}}>{this.state.passErrorTip}</code>
                                            <FormItem
                                                label="新密码"
                                                {...formItemLayout}
                                                className="resetPassFormItem"
                                                style={{marginBottom:"20px"}}
                                            >
                                                {getFieldDecorator('newPassword', {
                                                    rules: [
                                                        {
                                                            required: true, message:"请输入新密码",
                                                        },
                                                        {
                                                            validator: this.pwStrength,
                                                        }],
                                                })(
                                                    <Input type="password" placeholder="请输入新密码" size="large"/>
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
                                                label="重复密码"
                                                className="resetPassFormItem"
                                                style={{marginBottom:"0px"}}
                                            >
                                                {getFieldDecorator('confirmPassword', {
                                                    rules: [{
                                                        required: true, message: "请输入新密码",
                                                    }, {
                                                        validator: this.validateConfirmPassword,
                                                    }],
                                                })(
                                                    <Input type="password" placeholder="请确认新密码" size="large"/>
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