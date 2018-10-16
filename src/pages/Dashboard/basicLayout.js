import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Button, Modal } from 'antd';
import { Switch, Redirect, Route } from 'react-router-dom';
// import logo from '../../images/logo.svg';
import peer from '../../images/api.svg';
import './basicLayout.less';
import BlockChain from './components/BlockChain/index';
import ChainCode from './components/ChainCode/index';
import Channel from './components/Channel/index';
import Log from './components/Log/index';
import Organization from './components/Organization/index';
import OverView from './components/OverView/index';
import Peer from './components/Peer/index';
const { Header, Content, Sider } = Layout;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        }
        this.toggle = this.toggle.bind(this);
        this.routerList = this.routerList.bind(this);
    }
    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    routerList({ item, key, keyPath }) {
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
    getCurrentMenuSelectedKeys(props) {
        const { location: { pathname } } = props || this.props;
        const keys = pathname.split('/').slice(1);
        if (keys.length === 1 && keys[0] === '') {
            return [this.menus[0].key];
        }
        return keys;
    }
    render() {
        return (
            <Layout className="dashboard_layout" >
                <Sider className="slider"
                    breakpoint="lg"
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                    width='256px'
                >
                    <li className="logo" to='/index' target="_blank">
                        <img src={require('../../images/logo_en.svg')} alt="" />
                    </li>
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
                            <p className="fill-in"></p>
                            <img src={peer} alt=" " />
                            <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>概览</span>
                        </Menu.Item>
                        <Menu.Item className="list-item" key="blockchain_browser">
                            <img src={peer} alt=" " />
                            <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>区块链浏览器</span>
                        </Menu.Item>
                        <Menu.Item className="list-item" key="organization_management">
                            <img src={peer} alt=" " />
                            <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>组织管理</span>
                        </Menu.Item>
                        <Menu.Item className="list-item" key="channel_management">
                            <img src={peer} alt=" " />
                            <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>通道管理</span>
                        </Menu.Item>
                        <Menu.Item className="list-item" key="peer_management">
                            <img src={peer} alt=" " />
                            <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>节点管理</span>
                        </Menu.Item>
                        <Menu.Item className="list-item" key="chaincode_management">
                            <img src={peer} alt=" " />
                            <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>链码管理</span>
                        </Menu.Item>
                        <Menu.Item className="list-item" key="log_management">
                            <img src={peer} alt=" " />
                            <span style={{ opacity: (this.state.collapsed ? 0 : 1) }}>日志管理</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="layout-header">
                    <Header style={{ background: '#fff', padding: 0, borderBottom: '1px solid #e6eaee' }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        {/* <div className="header-list">
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
                                    <span style={{ marginRight: '8px' }}>姓名</span><Icon type="down" />
                                </Popover>
                            </div>
                        </div> */}
                        <Modal
                            title={<h1 className="delectContractTit">退出登录</h1>}
                            visible={this.state.loginOutVisible}
                            onOk={this.okloginOut}
                            onCancel={this.CancelloginOut}
                            footer={[
                                <Button style={{ padding: '0 21px', height: "38px" }} key="cancel" onClick={this.CancelloginOut}>我再想想</Button>,
                                <Button style={{ padding: '0 38px', height: "38px" }} key="submit" htmlType="submit" type="primary" onClick={this.okloginOut}>
                                    确认退出
                                </Button>,
                            ]}
                            bodyStyle={{ textAlign: 'center', fontSize: '16px', color: "#354052" }}
                            width='440px'
                            style={{ height: "180px", top: "50%", marginTop: "-90px" }}

                        >
                            <Icon type="exclamation-circle" style={{ color: "#efaa00", marginRight: '10px', fontSize: '16px' }} />确定退出登录吗？
                        </Modal>
                    </Header>

                    <div className="breadcrumb">
                        <Breadcrumb style={{ padding: "0 24px", background: '#ffffff', height: "48px", lineHeight: "48px", color: "#7f8fa4", float: "left" }} >
                            {/* {breadcrumbItems} */}
                        </Breadcrumb>
                    </div>
                    <Content className="content" style={{ borderRadius: "3px", background: "#ffffff", position: "relative" }}>
                        <Switch>
                            <Route path="/dashboard/overview" component={OverView} />
                            <Redirect exact from="/dashboard" to="/dashboard/overview" />
                            <Route path="/dashboard/blockchain_browser" component={BlockChain} />
                            <Route path="/dashboard/organization_management" component={Organization} />
                            <Route path="/dashboard/channel_management" component={Channel} />
                            <Route path="/dashboard/peer_management" component={Peer} />
                            <Route path="/dashboard/chaincode_management" component={ChainCode} />
                            <Route path="/dashboard/log_management" component={Log} />
                            <Route path="/dashboard/lost" component={Channel} />
                            <Route path="/dashboard/*" render={(props) => <Redirect to='/dashboard/lost' />} />
                        </Switch>
                    </Content>
                </Layout>
                {/* {
                    this.state.resetPasswordVisible && <Modal
                        title={<h1 className="delectContractTit">修改密码</h1>}
                        visible={this.state.resetPasswordVisible}
                        onCancel={this.CancelResetPassword}
                        footer={[
                            <Button style={{ padding: '0 38px', height: "38px" }} key="cancel" onClick={this.CancelResetPassword}>取消</Button>,
                            <Button style={{ padding: '0 38px', height: "38px" }} key="submit" htmlType="submit" type="primary" onClick={this.okResetPassword}>
                                确定
                            </Button>,
                        ]}
                        bodyStyle={{ textAlign: 'center', fontSize: '16px', color: "#354052" }}
                        width='700px'
                        style={{ height: "380px", top: "50%", marginTop: "-190px" }}
                    >
                        <Form
                            className="resetPassModalForm"
                            onSubmit={this.okResetPassword}
                        >
                            <FormItem label={intlData.service_resetPass_Oldpass} {...formItemLayout} style={{ marginBottom: "0px" }} className="resetPassFormItem">
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: intlData.service_resetPass_input_old,

                                        },
                                        {
                                            validator: this.inputPassword,
                                        }
                                    ],
                                })(<Input type="password" size="large" />)}
                            </FormItem>
                            <code style={{ top: "0px" }}>{this.state.passErrorTip}</code>
                            <FormItem
                                label={intlData.service_resetPass_newPass}
                                {...formItemLayout}
                                className="resetPassFormItem"
                                style={{ marginBottom: "20px" }}
                            >
                                {getFieldDecorator('newPassword', {
                                    rules: [
                                        {
                                            required: true, message: intlData.service_resetPass_input_new,
                                        },
                                        {
                                            validator: this.pwStrength,
                                        }],
                                })(
                                    <Input type="password" size="large" />
                                )}
                                <div className="passCaptchaBox" style={{ display: this.state.passVisible }}>
                                    <span style={{ flex: "1" }} id="strength_L"> </span>
                                    <span style={{ flex: "1", margin: "0 5px" }} id="strength_M"> </span>
                                    <span style={{ flex: "1" }} id="strength_H"> </span>
                                    <b className="passTip">{this.state.passTip}</b>
                                </div>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={intlData.service_resetPass_confirm_new}
                                className="resetPassFormItem"
                                style={{ marginBottom: "8px" }}
                            >
                                {getFieldDecorator('confirmPassword', {
                                    rules: [{
                                        required: true, message: intlData.service_resetPass_input_new,
                                    }, {
                                        validator: this.validateConfirmPassword,
                                    }],
                                })(
                                    <Input type="password" size="large" />
                                )}
                            </FormItem>
                            <code style={{ top: "-9px" }}>{this.state.passConfirmTip}</code>
                        </Form>

                    </Modal>
                } */}

            </Layout>
        );
    }
}

export default Dashboard;