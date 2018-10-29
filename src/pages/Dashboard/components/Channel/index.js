import React , {Component} from 'react';
import { Button, Icon, Table, Pagination, Spin } from 'antd'
import Cookies from 'js-cookie'
import intl from "react-intl-universal";
import axios from 'axios'
import request from '../../../../Utils/Axios'
import apiconfig from '../../../../Utils/apiconfig'

const {api:{channel}} = apiconfig;

const CancelToken = axios.CancelToken;
let cancel;

class Channel extends Component{
    constructor(props){
        super(props)
        this.state={
            tableArr: [],
            loading: true
        }
    }
    toOrganization = (id)=>{
        this.props.history.push({
            pathname: "channel_management/org",
            query: id
        })
    }
    columns = [
        {
            title: '通道名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '组织数量',
            dataIndex: 'orgs',
            key: 'orgs',
            render: arr => arr.length
        }, {
            title: '节点数量',
            dataIndex: 'peers',
            key: 'peers',
            render: arr => arr.length
        }, {
            title: '操作',
            dataIndex: '_id',
            key: '_id',
            render: (text,record) => (
                <span onClick={()=>this.toOrganization(text)} className='table-item-btn'>
                    组织管理
                </span>
            ),
        }
    ]
    
    getData = ()=>{
        request().get(channel,{
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
            })
        }).then(res => {
            if (res) {
                // console.log(res.data)
                switch (res.status) {
                    case 200:
                        this.setState({
                            tableArr: res.data.data,
                            loading: false
                        })
                        break;
                    case 401: 
                        Cookies.remove('userNameInfo')
                        Cookies.remove('token')
                        this.props.history.push('/login')
                        break;
                    default:
                        this.setState({
                            loading: false
                        })
                        return ''

                }
            }
        })
    }
    createChannel = ()=>{
        this.props.history.push('/dashboard/channel_management/createChannel')
    }
    componentDidMount(){
        this.getData();
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
            <div className='channel-page'>
                {/* <div className="create-channel-box">
                    <Button onClick={this.createChannel} className="create-channel-btn">
                        创建通道<Icon type="plus-circle" theme="outlined" />
                    </Button>
                </div> */}
                <div className="table-box">
                    <Spin spinning={this.state.loading}>
                        <Table 
                            columns= {this.columns}
                            dataSource = {this.state.tableArr}
                            rowKey = {record=>record.uuid}
                            pagination={false}
                        />
                    </Spin>
                </div>
                <div className="pagination-box clearfix">
                    {/* <Pagination defaultCurrent={6} total={500} /> */}
                </div>
            </div>
        )
    }
}
export default Channel;