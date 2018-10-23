import React , {Component} from 'react';
import axios from 'axios'
import { Spin } from 'antd'
import Cookies from 'js-cookie'
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
            detailLoading: true
        }
    }
    getData = (id)=>{
        request().get(consortium.overview,{
            params: {
                consortiumId: id
            }
        },{
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
                <Spin spinning={this.state.detailLoading}>
                    <div className="basic-info-box">
                        <div className="name-box item-box">
                            <div className="basic-info-desc"></div>
                            <div className="basic-info-tip">区块链名称</div>
                        </div>
                        <div className="name-box item-box">
                            <div className="basic-info-desc"></div>
                            <div className="basic-info-tip">区块链配置</div>
                        </div>
                        <div className="name-box item-box">
                            <div className="basic-info-desc"></div>
                            <div className="basic-info-tip">区块链共识算法</div>
                        </div>
                        <div className="name-box item-box">
                            <div className="basic-info-desc"></div>
                            <div className="basic-info-tip">区块链创建时间</div>
                        </div>
                        <div className="name-box item-box">
                            <div className="basic-info-desc"></div>
                            <div className="basic-info-tip">区块链运行状态</div>
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}
export default OverView;