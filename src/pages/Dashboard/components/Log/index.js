import React, { Component } from 'react';
import { Card, Select, message } from 'antd';
import ReactDOM from 'react-dom'
// import Cookies from "js-cookie";
// import request from '../../../../Utils/Axios'
import './index.less'
import config from "../../../../Utils/apiconfig";
import request from '../../../../Utils/Axios'
import Cookies from "js-cookie";
const {api:{chain}} = config

// const {api:{chain}}  = config
const elasticsearch = require('elasticsearch');
const Option = Select.Option;
const {elasticSearchUrl} = config

class Log extends Component {
    constructor(props){
        super(props)

        this.state = {
            containers:null,
            currentPage: 1,
            perPage: 50,
            esClient: null,
            log: [],
            containerId: "",
            loadingLog: false,
            loadLog: true,
            intervalTime: 5000,
            lastTimestamp: 0,
            intervalId: null,
        }
    }
    getContainerLog = (containerId) => {
        const {esClient, intervalTime, perPage} = this.state
        let {intervalId} = this.state;
        const _that = this;
        this.setState({
            loadingLog: true
        })
        let log = []
        if (esClient) {
            esClient.search({
                index: "docker-logs*",
                type: 'doc',
                size: perPage,
                body: {
                    sort: [{
                        "@timestamp": "desc"
                    }],
                    query: {
                        bool: {
                            must: [
                                {
                                    query_string: {
                                        fields : ["docker.container.name"],
                                        query: `*${containerId}*`
                                    }
                                }
                            ]
                        }
                    }
                },
            }).then(function (resp) {
                let {lastTimestamp} = _that.state;
                lastTimestamp = resp.hits.hits.length > 0 ? resp.hits.hits[0].sort[0] : lastTimestamp;
                const hits = resp.hits.hits.reverse();
                hits.map((hit, index) => {
                    log.push(`${hit._source["@timestamp"]}: ${hit._source.message}`)
                    return ''
                })
                _that.setState({
                    log,
                    loadingLog: false,
                    containerId,
                    lastTimestamp
                })
                _that.scrollLogBottom()
                if (intervalId) {
                    clearInterval(intervalId)
                }
                //请求
                intervalId = setInterval(_that.queryLog, intervalTime);
                _that.setState({
                    intervalId
                })
            }, function (err) {
                console.error(err.message);
            });
        }
        setTimeout(function(){
            if(log.length === 0 && window.location.pathname === "/dashboard/log_management"){
                message.error("网络错误,日志加载失败")
            }
        },5000)

    }
    queryLog = () => {
        const {esClient, perPage, containerId, lastTimestamp} = this.state
        let {log} = this.state;
        const _that = this;
        if (esClient) {
            esClient.search({
                index: "docker-logs*",
                type: 'doc',
                size: perPage,
                body: {
                    sort: [{
                        "@timestamp": "desc"
                    }],
                    query: {
                        bool: {
                            must: [
                                {
                                    query_string: {
                                        // fields : ["source"],
                                        query: `*${containerId}*`
                                    }
                                },
                                {
                                    range: {
                                        "@timestamp": {
                                            gt: lastTimestamp,
                                            lte: "now"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
            }).then(function (resp) {
                let {lastTimestamp} = _that.state;
                lastTimestamp = resp.hits.hits.length > 0 ? resp.hits.hits[0].sort[0] : lastTimestamp;
                const hits = resp.hits.hits.reverse();
                hits.map((hit, index) => {
                    log.push(`${hit._source["@timestamp"]}: ${hit._source.message}`)
                    return ''
                })
                _that.setState({
                    log,
                    lastTimestamp
                })
            }, function (err) {
                console.error(err.message);
            });
        }
    }
    componentDidUpdate() {
        // this.scrollLogBottom();
    }
    componentWillUnmount() {
        const {intervalId} = this.state;
        if (intervalId) {
            clearInterval(intervalId)
        }
    }
    componentDidMount() {
        request().get(chain.container).then((response)=>{
            if(response){
                switch(response.status){
                    case 200:
                        this.setState({
                            containers:response.data.data
                            })
                        const client = new elasticsearch.Client({
                            host: elasticSearchUrl
                        });
                        const _this = this;
                        const containers = response.data.data || []

                        const defaultContainer = containers.length > 0 ? containers[0].name : ""
                        _this.setState({
                            esClient: client,
                            containerId: defaultContainer
                        }, function () {
                            if (defaultContainer) {
                                _this.getContainerLog(defaultContainer)
                            }
                        })
                        break;
                    case 401:
                        Cookies.remove('token');
                        Cookies.remove('userNameInfo');
                        sessionStorage.removeItem('projectData');
                        sessionStorage.removeItem('consortiumType');
                        this.props.history.push({
                            pathname:"/login"
                        })
                        break;
                    default:message.error("链列表查询失败")
                }
            }
        })
    }
    containerChange = (value) => {
        this.setState({
            containerId: value
        })
        this.getContainerLog(value)
        var objDiv = document.getElementById("logScroll");
        objDiv.scrollTop = objDiv.scrollHeight;
        this.scrollLogBottom()
    }

    scrollLogBottom = () => {
        if (this.logRel) {
            const messagesContainer = ReactDOM.findDOMNode(this.logRel);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    render() {
        const {containerId,log,loadingLog, containers} = this.state
        const containerOptions = containers && containers.length ?containers.map((container, index) =>
            <Option key={index} value={container.name}>{container.name}</Option>
        ):""
        return (
            <div className='logShowPage'>
                {containers && containers.length > 0 &&
                <Select style={{width: 250}} value={containerId} onChange={this.containerChange}>
                    {containerOptions}
                </Select>
                }
                {
                    containers && containers.length > 0 &&
                    <Card ref={rel => {this.logRel = rel}} id="logScroll" className="logPage" loading={loadingLog}>
                        {log.map((item, index) =>
                            <p key={index}>
                                {item}
                            </p>
                        )}
                    </Card>
                }
            </div>
        );
    }
}
export default (Log);
