import React , {Component} from 'react';
import { Button, Icon, Table } from 'antd'
import intl from "react-intl-universal";
import request from '../../../../Utils/Axios'
import apiconfig from '../../../../Utils/apiconfig'

const {api:{channel}} = apiconfig;

class Channel extends Component{
    constructor(props){
        super(props)
        this.state={
            tableArr: []
        }
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
            // render: (text,record) => {
            //     'a'
            // }
        }, {
            title: '节点数量',
            dataIndex: 'peers',
            key: 'peers',
            render: arr => arr.length
            // render: (text, record) => {
            //     'a'
            // }
        }, {
            title: '操作',
            key: 'operate',
            render: (text,record) => (
                <span className='table-item-btn'>
                    组织管理
                </span>
            ),
        }
    ]
    // columns = [
    //     {
    //         title: '通道名',
    //         dataIndex: 'name',
    //         key: 'name',
    //     }, {
    //         title: '组织数量',
    //         dataIndex: '__v',
    //         key: '__v',
    //         // render: arr => arr.length
            
    //     }, {
    //         title: '节点数量',
    //         dataIndex: 'consortium_id',
    //         key: 'consortium_id',
    //         // render: arr => arr.length
            
    //     }, {
    //         title: '操作',
    //         key: 'operate',
    //         render: (text,record) => (
    //             <span>
    //                 组织管理
    //             </span>
    //         ),
    //     }
    // ]
    getData = ()=>{
        request().get(channel).then(res => {
            if (res) {
                console.log(res.data)
                switch (res.status) {
                    case 200:
                        this.setState({
                            tableArr: res.data.data
                        })
                        break;
                    default:
                        return ''

                }
            }
        })
    }
    componentDidMount(){
        this.getData();
    }
    render(){
        return(
            <div className='channel-page'>
                <div className="create-channel-box">
                    <Button className="create-channel-btn">
                        创建通道<Icon type="plus-circle" theme="outlined" />
                    </Button>
                </div>
                <div className="table-box">
                    <Table 
                        columns= {this.columns}
                        dataSource = {this.state.tableArr}
                        rowKey = {record=>record.uuid}
                    />
                </div>
            </div>
        )
    }
}
export default Channel;