import React , {Component} from 'react';
import axios from 'axios'
import { Spin, List, Card } from 'antd'
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
            detailInfo: '',
            detailLoading: true,
            data: []
        }
    }
    getData = (id)=>{
        request().get(consortium.overview.format({consortiumId: id}),{
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
            })
        }).then(res=>{
            console.log(res)
            if(res){
                switch(res.status){
                    case 200: 
                        this.setState({
                            detailInfo: res.data.data,
                            data: [
                                {
                                    title: '名称',
                                    desc: '区块链名称',
                                    text: res.data.data.name
                                },
                                {
                                    title: '类型',
                                    desc: '区块链类型',
                                    text: res.data.data.name
                                },
                                {
                                    title: '算法',
                                    desc: '共识算法',
                                    text: res.data.data.consensus_type
                                },
                                {
                                    title: '时间',
                                    desc: '区块链创建时间',
                                    text: moment(res.data.data.create_time).format('YYYY-MM-DD HH:mm:ss')
                                },
                                {
                                    title: '状态',
                                    desc: '区块链运行状态',
                                    text: res.data.data.status
                                }
                            ],
                            detailLoading: false
                        })
                        break;
                    case 401:
                        Cookies.remove('userName')
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
        let temp = sessionStorage.getItem('ConsortiumInfo')
        if(temp){
            temp = JSON.parse(temp)
        }
        console.log(temp)
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
                <List
                    loading={this.state.detailLoading}
                    className='ant-list-box'
                    grid={{ gutter: 24, column: 4,  md: 2,  lg: 2, xl: 4 }}
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item>
                            <Card  >
                                <div className="card-title">{item.title}</div>
                                <div className="card-desc">{item.desc}</div>
                                <div className="card-text">{item.text}</div>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
export default OverView;