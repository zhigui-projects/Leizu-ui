import React, { Component } from 'react';
import { Card, Select } from 'antd';
import ReactDOM from 'react-dom'
// import Cookies from "js-cookie";
import config from "../../../../Utils/apiconfig";
// import request from '../../../../Utils/Axios'
import './index.less'
// const {api:{chain}}  = config
const elasticsearch = require('elasticsearch');
const Option = Select.Option;
const {elasticSearchUrl} = config

class Log extends Component {
    constructor(props){
        super(props)

        this.state = {
            currentChain:null,
            currentPage: 1,
            perPage: 100,
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
        const {esClient, intervalTime} = this.state
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
                size: 100,
                body: {
                    sort: [{
                        "@timestamp": "desc"
                    }],
                    query: {
                        bool: {
                            must: [
                                {
                                    query_string: {
                                        fields : ["source"],
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
                intervalId = setInterval(_that.queryLog, intervalTime);
                _that.setState({
                    intervalId
                })
            }, function (err) {
                console.error(err.message);
            });
        }
        // setTimeout(function(){
        //     if(log.length === 0 && window.location.pathname === "/dashboard/log"){
        //         message.error("网络错误,日志加载失败")
        //     }
        // },5000)

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
                                        fields : ["source"],
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
        // if(window._hmt){
        //     window._hmt.push(['_trackPageview', "/dashboard/log"]);
        // }
        // const intlData=this.props.intl.messages;
        // const dataId = sessionStorage.getItem("projectData") ? JSON.parse(sessionStorage.getItem("projectData")).id : ""
        // const _this  = this
        // request(`${chain.queryConsortium.format({id:dataId})}`).then((response)=>{
        //     if(typeof response === 'number'){
        //         switch(response){
        //             case 401:
        //                 Cookies.remove('token');
        //                 Cookies.remove('userName');
        //                 sessionStorage.removeItem('projectData');
        //                 sessionStorage.removeItem('consortiumType');
        //                 _this.props.history.push({
        //                     pathname:"/login"
        //                 })
        //                 break;
        //             case 500:
        //                 message.error(intlData.service_model_update_500)
        //                 break;
        //             default:message.error("查询失败")
        //         }
        //     }else{
        //         this.setState({
                    // currentChain:response
                // })

                const client = new elasticsearch.Client({
                    host: elasticSearchUrl
                });
                const _this = this;
                // const containers = response.containers || []

                const containers = [
                    {
                        "id": "5182aefd8df79d68501a92bd4949a4c6def79668404ee82260ce15390960c86d",
                        "name": "peer0.org1.example.com"
                    },
                    {
                        "id": "3a02b9cf91b758c081c04b7cd9082be7db1051732318422c855501707676cc81",
                        "name": "ca.peerOrg1"
                    },
                    {
                        "id": "fb14f453451ed192ec29ae73ae1305be78e3654da3c1978e107f17ac09e04fb9",
                        "name": "orderer.example.com"
                    }
                ] || []

                const defaultContainer = containers.length > 0 ? containers[0].id : ""
                _this.setState({
                    esClient: client,
                    containerId: defaultContainer
                }, function () {
                    if (defaultContainer) {
                        _this.getContainerLog(defaultContainer)
                    }
                })
        //
        //
        //     }
        // })





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
        const {currentChain,containerId,log,loadingLog} = this.state
        const containers = currentChain ? currentChain.containers : [
            {
                "id": "5182aefd8df79d68501a92bd4949a4c6def79668404ee82260ce15390960c86d",
                "name": "peer0.org1.example.com"
            },
            {
                "id": "3a02b9cf91b758c081c04b7cd9082be7db1051732318422c855501707676cc81",
                "name": "ca.peerOrg1"
            },
            {
                "id": "fb14f453451ed192ec29ae73ae1305be78e3654da3c1978e107f17ac09e04fb9",
                "name": "orderer.example.com"
            }
        ]
        const containerOptions = containers && containers.length ?containers.map((container, index) =>
            <Option key={index} value={container.id}>{container.name}</Option>
        ):""
        return (
            <div className='logShowPage'>
                {containers.length > 0 &&
                <Select style={{width: 250}} value={containerId} onChange={this.containerChange}>
                    {containerOptions}
                </Select>
                }
                {
                    containers.length > 0 &&
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
