import React , {Component} from 'react';
import axios from 'axios'
import { List, Card, Badge } from 'antd'
import Cookies from 'js-cookie'
import moment from 'moment'
import intl from 'react-intl-universal'
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
                                    title: intl.get("Name"),
                                    desc: intl.get("Blockchain_Name"),
                                    text: res.data.data.name,
                                    display: false
                                },
                                {
                                    title: intl.get("Type"),
                                    desc: intl.get("Blockchain_Type"),
                                    text: res.data.data.type,
                                    display: false
                                },
                                {
                                    title: intl.get("Algorithm"),
                                    desc: intl.get("Consencus_Algorithm"),
                                    text: res.data.data.consensus_type === 0 ? "solo" : "kafka",
                                    display: false
                                },
                                {
                                    title: intl.get("Time"),
                                    desc: intl.get("Blockchain_Create_Time"),
                                    text: moment(res.data.data.create_time).format('YYYY-MM-DD HH:mm:ss'),
                                    display: false
                                },
                                {
                                    title: intl.get("Status"),
                                    desc: intl.get("Blockchain_Create_Time"),
                                    text: res.data.data.status === 0 ? intl.get("Stop_Running") : intl.get("Operating_Normally"),
                                    display: true
                                }
                            ],
                            organizationInfo: [
                                {
                                    title: intl.get("Channel"),
                                    desc: intl.get("Blockchain_Channel"),
                                    text: res.data.data.channel_count
                                },
                                {
                                    title: intl.get("Orgnization"),
                                    desc: intl.get("Blockchain_Orgnization"),
                                    text: res.data.data.org_count
                                },
                                {
                                    title: intl.get("Node"),
                                    desc: intl.get("Blockchain_Node"),
                                    text: res.data.data.peer_count
                                }
                            ],
                            badgeType: res.data.data.status === 0 ? "error" : "success",
                            detailLoading: false
                        })
                        break;
                    case 401:
                        Cookies.remove('userNameInfo')
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
            this.getData(temp._id)
        }
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
                    <div className="basic-info-title">{intl.get("Basic_Info")}</div>
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
                    <div className="organization-info-title">{intl.get("Network_Configuration")}</div>
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