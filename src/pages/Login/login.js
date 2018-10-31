import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import './login.less';
import { Form, Input , Button,message } from 'antd';
import request from '../../Utils/Axios'
import config from "../../Utils/apiconfig";
import Cookies from 'js-cookie'
const { api : {user} } = config
const FormItem = Form.Item;

class Login extends Component {

    constructor (props) {
        super(props);
        this.state = {
            emailTip:"",
            passwordTip:"",
            loginLoading:false,
            currentUserName:"",
        }
    }
    componentDidMount(){
        if(window._hmt){
            window._hmt.push(['_trackPageview', "/login"]);
        }
        const userName = Cookies.get('userNameInfo');
        const token = Cookies.get('token');
        // if(userName && token){
        //     this.props.history.push("/project")
        // }
    }
    handleSubmit = (e) => {
        const _this = this
        e.preventDefault();
        const {emailTip,passwordTip } = this.state
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && emailTip === '' && passwordTip === '') {
                this.setState({
                    loginLoading:true
                })

                request().post(user.login,{
                    "username": values.username,
                    "password": values.password
                }).then(response=>{
                    if(response){
                        this.setState({
                            loginLoading:false
                        })
                        switch(response.status){
                            case 200:
                                this.setState({
                                    currentUserName: values.username
                                })
                                Cookies.set('token', response.data.token, { expires: new Date(new Date().getTime() +( 24*60*60*1000)),path:"/"});
                                Cookies.set('userNameInfo', values.username, { expires: new Date(new Date().getTime() +( 24*60*60*1000)),path:"/"});
                                _this.setState({
                                    emailTip:"",
                                    passwordTip:""
                                },function(){
                                    _this.props.history.push({
                                        pathname:'/project'
                                    });
                                })
                                break;
                            case 401:
                                console.log(response.data.code)
                                let code = response.data.code
                                if(code){
                                    code === 10001 ? _this.setState({emailTip:"用户名不存在"}) : ( code === 10002 ? _this.setState({passwordTip:"密码不正确"}) : "")
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
                                message.error("网络错误，请重试");
                                break;
                            default:
                                message.error("登录失败");
                        }
                    }
                })
            }else{
                // message.error("请输入邮箱和密码")
            }
        });
    }

    email_loginValidator = (rule, value, callback)=>{
        this.setState({
            emailTip:""
        })
        callback()
    }
    validateToNextPassword = (rule, value, callback)=>{
        this.setState({
            passwordTip:""
        })
        callback()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {loginLoading} = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
                lg: { span: 6}
            },
            wrapperCol: {
                xs: {
                    span: 16,
                    offset: 4
                },
                lg :{
                    span: 16,
                    offset: 4
                },
                xl :{
                    span: 16,
                    offset: 4
                },
            },
        };

        return (
            <div className="userOpreate_login">
                <div className="opreateImg">
                    <div className="opreateLogo"><img src={require('../../images/logo.svg')} alt=""/></div>
                    <div className="opreateLetter">
                        <h2>欢迎</h2>
                        <p>帮助开发者快速构建区块链基础设施，提供区块链应用开发、部署、测试和监控的整套解决方案。</p>
                    </div>
                    <img className="userOpreateImg" src={require('../../images/userOpreate.svg')} alt=""/>
                </div>
                <div  className="opreateForm" >
                    <Form onSubmit={this.handleSubmit}>
                        <h5>登录</h5>
                        <FormItem
                            {...formItemLayout}
                            style={{marginBottom:"8px"}}
                            className="loginFormItem"
                        >
                            {getFieldDecorator('username', {
                                rules: [{
                                    required: true, message: "请输入用户名",
                                },{
                                    validator: this.email_loginValidator,
                                }],
                            })(
                                <Input placeholder="用户名" size="large"/>
                            )}
                        </FormItem>
                        <code style={{position:"relactive",top:'-10px'}}>{this.state.emailTip}</code>
                        <FormItem
                            {...formItemLayout}
                            className="loginFormItem loginFormItemPass"
                            style={{marginBottom:"0px"}}
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: "请输入密码",
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input placeholder="密码" type="password" size="large"/>
                            )}
                        </FormItem>
                        <code>{this.state.passwordTip}</code>
                        <FormItem
                            {...formItemLayout}
                        >
                            <Button loading={loginLoading} style={{height:"40px"}} type="primary" htmlType="submit" size="large">
                                登录
                            </Button>
                        </FormItem>
                    </Form>

                    <h4>Copyright © 2018  | 西安纸贵互联网科技有限公司 | 陕ICP备16011266号</h4>
                </div>
            </div>
        );
    }
}
Login = Form.create()(Login)
export default (Login);
