import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import './login.less';
import { Form, Input , Button,message } from 'antd';
import intl from 'react-intl-universal'
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
                                let code = response.data.code
                                if(code){
                                    code === 10001 ? _this.setState({emailTip:intl.get("Username_Not_Exist")}) : ( code === 10002 ? _this.setState({passwordTip:intl.get("Password_Not_Correct")}) : "")
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
                                message.error(intl.get("Network_Error_Try_Again"));
                                break;
                            default:
                                message.error(intl.get("Login_Failed"));
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
                    <div className="opreateLogo">
                        {
                            intl.options.currentLocale === "zh-CN" ? <img src={require('../../images/logo.svg')} alt=""/> : <img src={require('../../images/logo_en.svg')} alt=""/>
                        }
                    </div>
                    <div className="opreateLetter">
                        <h2>{intl.get("Welcome")}</h2>
                        <p>{intl.get("Welcome_Desc")}</p>
                    </div>
                    <img className="userOpreateImg" src={require('../../images/userOpreate.svg')} alt=""/>
                </div>
                <div  className="opreateForm" >
                    <Form onSubmit={this.handleSubmit}>
                        <h5>{intl.get("Login")}</h5>
                        <FormItem
                            {...formItemLayout}
                            style={{marginBottom:"8px"}}
                            className="loginFormItem"
                        >
                            {getFieldDecorator('username', {
                                rules: [{
                                    required: true, message: intl.get("Please_Input_Username"),
                                },{
                                    validator: this.email_loginValidator,
                                }],
                            })(
                                <Input placeholder={intl.get("Username")} size="large"/>
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
                                    required: true, message: intl.get("Please_Input_Password"),
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input placeholder={intl.get("Password")} type="password" size="large"/>
                            )}
                        </FormItem>
                        <code>{this.state.passwordTip}</code>
                        <FormItem
                            {...formItemLayout}
                        >
                            <Button loading={loginLoading} style={{height:"40px"}} type="primary" htmlType="submit" size="large">
                                {intl.get("Login")}
                            </Button>
                        </FormItem>
                    </Form>

                    <h4>Copyright © 2018  | {intl.get("Company_Name")} | {intl.get("Bei_An")}</h4>
                </div>
            </div>
        );
    }
}
Login = Form.create()(Login)
export default (Login);
