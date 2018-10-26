import React , {Component} from 'react';
import axios from 'axios'
import { List, Card, Badge } from 'antd'
import Cookies from 'js-cookie'
import moment from 'moment'
import request from '../../../../Utils/Axios'

import apiconfig from '../../../../Utils/apiconfig'
import './index.less'

const {api: {consortium}} = apiconfig;
const CancelToken = axios.CancelToken;
let cancel;

class OverView extends Component{
    constructor(props){
        super(props)
        this.state={
            detailLoading: true,
            basicInfo: [],
            organizationInfo: [],
            badgeType: "success"
        }
    }
    getData = (id)=>{
        request().get(consortium.overview.format({consortiumId: id}),{
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
            })
        }).then(res=>{
            // console.log(res)
            if(res){
                switch(res.status){
                    case 200: 
                        this.setState({
                            basicInfo: [
                                {
                                    title: '名称',
                                    desc: '区块链名称',
                                    text: res.data.data.name,
                                    display: false
                                },
                                {
                                    title: '类型',
                                    desc: '区块链类型',
                                    text: res.data.data.name,
                                    display: false
                                },
                                {
                                    title: '算法',
                                    desc: '共识算法',
                                    text: res.data.data.consensus_type === 0 ? "solo" : "kafka",
                                    display: false
                                },
                                {
                                    title: '时间',
                                    desc: '区块链创建时间',
                                    text: moment(res.data.data.create_time).format('YYYY-MM-DD HH:mm:ss'),
                                    display: false
                                },
                                {
                                    title: '状态',
                                    desc: '区块链运行状态',
                                    text: res.data.data.status === 0 ? "运行停止" : "运行正常",
                                    display: true
                                }
                            ],
                            organizationInfo: [
                                {
                                    title: '通道',
                                    desc: '全区块链通道个数',
                                    text: res.data.data.channel_count
                                },
                                {
                                    title: '组织',
                                    desc: '全区块链组织个数',
                                    text: res.data.data.org_count
                                },
                                {
                                    title: '节点',
                                    desc: '全区块链节点个数',
                                    text: res.data.data.peer_count
                                }
                            ],
                            badgeType: res.data.data.status === 0 ? "error" : "success",
                            detailLoading: false
                        })
                        break;
                    case 401:
                        Cookies.remove('userName')
                        Cookies.remove('token')
                        this.props.history.push('/login')
                        break;
                    default:
                        this.setState({
                            detailLoading: false
                        })
                        return ''
                }
            }
        })
    }
    componentDidMount(){
        let temp = sessionStorage.getItem('ConsortiumInfo')
        if(temp){
            temp = JSON.parse(temp)
        }
        this.getData(temp._id)
    }
    componentWillUnmount() {
        if (cancel) {
            cancel();
        }
        this.setState = () => {
            return;
        };
    }
    render(){
        return(
            <div className='overview-page'>
                <div className="basic-info-box">
                    <div className="basic-info-title">基本信息</div>
                    <List
                        loading={this.state.detailLoading}
                        className='ant-list-box'
                        grid={{ gutter: 24, column: 4,  md: 2,  lg: 2, xl: 4 }}
                        dataSource={this.state.basicInfo}
                        renderItem={item => (
                            <List.Item>
                                <Card>
                                    <div className="card-title">{item.title}</div>
                                    <div className="card-desc">{item.desc}</div>
                                    <div className="card-text">
                                        {
                                            item.display && (
                                                <Badge status={this.state.badgeType} text={item.text} className={this.state.badgeType} />
                                            )
                                        }
                                        {
                                            !item.display && <span>{item.text}</span>
                                        }
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
                <div className="organization-info-box">
                    <div className="organization-info-title">组织信息</div>
                    <List
                        loading={this.state.detailLoading}
                        className='ant-list-box'
                        grid={{ gutter: 24, column: 4,  md: 2,  lg: 2, xl: 4 }}
                        dataSource={this.state.organizationInfo}
                        renderItem={item => (
                            <List.Item>
                                <Card>
                                    <div className="card-title">{item.title}</div>
                                    <div className="card-desc">{item.desc}</div>
                                    <div className="card-text">
                                        <span className='card-number'>{item.text}</span> 个
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        )
    }
}
export default OverView;