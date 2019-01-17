import React, { Component } from 'react';
import { Form, Input, Row, Col, Card, Select, message, Button, Radio,Icon,Divider } from 'antd';
import request from '../../../../Utils/Axios'
import config from "../../../../Utils/apiconfig";
import Cookies from "js-cookie";
import { stringify } from 'qs';
import intl from 'react-intl-universal'
const { api: { chain, enterpriseChain } } = config
const FormItem = Form.Item;
const Option = Select.Option;

class IpInput extends Component{
    constructor(props){
        super(props)
        this.state={
            number1:"",
            number2:"",
            number3:"",
            number4:"",
        }
    }

    handleNumberChange1 = (e) =>{
        const number1 = e.target.value;
        this.setState({
            number1:number1
        })
        const {number2,number3,number4} = this.state
        this.triggerChange({ number1,number2,number3,number4 });
    }

    handleNumberChange2 = (e) =>{
        const number2 = e.target.value;
        this.setState({
            number2:number2
        })
        const {number1,number3,number4} = this.state
        this.triggerChange({ number1,number2,number3,number4 });
    }

    handleNumberChange3 = (e) =>{
        const number3 = e.target.value ;
        this.setState({
            number3:number3
        })
        const {number1,number2,number4} = this.state
        this.triggerChange({ number1,number2,number3,number4 });
    }

    handleNumberChange4 = (e) =>{
        const number4 = e.target.value ;
        this.setState({
            number4:number4
        })
        const {number1,number2,number3} = this.state
        this.triggerChange({ number1,number2,number3,number4 });
    }

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        const leastIpValue = changedValue.number1+"."+changedValue.number2+"."+changedValue.number3+"."+changedValue.number4
        changedValue.leastIpValue = leastIpValue
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="IpInput">
                <FormItem>
                    {getFieldDecorator("ip_1")(
                        <Input onChange={this.handleNumberChange1}
                               className="input-short"/>
                    )}
                </FormItem>
                <span>.</span>
                <FormItem>
                    {getFieldDecorator("ip_2")(
                        <Input onChange={this.handleNumberChange2}
                               className="input-short"/>
                    )}
                </FormItem>
                <span>.</span>
                <FormItem>
                    {getFieldDecorator("ip_3")(
                        <Input onChange={this.handleNumberChange3}
                               className="input-short"/>
                    )}
                </FormItem>
                <span>.</span>
                <FormItem>
                    {getFieldDecorator("ip_4")(
                        <Input onChange={this.handleNumberChange4}
                               className="input-short"/>
                    )}
                </FormItem>
            </div>
        )
    }
}


class FabricSetConfModal extends Component {
    constructor(props) {
        super(props)
        const AbortController = window.AbortController;
        this.controller = new AbortController()
        this.signal = this.controller.signal
        this.state = {
            expired: false,
            selectedConfigSize: null,
            selectedConfigType: null,
            selectedConfigId: null,
            allChainList: null,
            zigBtnLoadding: false,
            IRISnetLoadding: false,
            zigLen: true,
            fabricLen: true,
            fabricBtnLoadding: false,
            ethereumBtnLoadding: false,
            ipfsBtnLoading: false,
            ethLen: 0,
            responseEthTip: "",
            sizeEmptyTip: "",
            consensusPlugin: "solo",
            enterpriseLoading:false,
            selectEthereumNetwork: null,
            selectEthereumId: null,
            ethereumSelectTip: "",
            ethNetDetail: [
                {
                    img: "RopstenIcon",
                    netName: intl.get("service_selectService_Ropsten"),
                    netPro: intl.get("service_selectService_Ropsten_netPro"),
                    url: `${intl.get("service_selectService_Ropsten_browser")}"https://ropsten.etherscan.io/"`,
                    id: 0,
                    backLetter: 'Ropsten'
                },
                {
                    img: "RinkebyIcon",
                    netName: intl.get("service_selectService_Rinkeby"),
                    netPro: intl.get("service_selectService_Rinkeby_netpro"),
                    url: `${intl.get("service_selectService_Ropsten_browser")}"https://www.rinkeby.io/"`,
                    id: 1,
                    backLetter: 'Rinkeby'
                },
                {
                    img: "KovanIcon",
                    netName: intl.get("service_selectService_Kovan"),
                    netPro:intl.get("service_selectService_Kovan_netPro"),
                    url: `${intl.get("service_selectService_Ropsten_browser")}"https://kovan.etherscan.io/"`,
                    id: 2,
                    backLetter: 'Kovan'
                },
            ],
            ipfsTip: "",
            agentVersion: null,
            protocolVersion: null,
            peerId: null,
            isSuccess: false,
            isLoading: false,
            data:[
                {
                    peerName:"Kafka1"
                },
                {
                    peerName:"Kafka2"
                },
                {
                    peerName:"Kafka3"
                },
                {
                    peerName:"Kafka4"
                }
            ],
            odererCount:1,
            odererInner:[
                {
                     id:1,
                    checkStatus:"init"
                }
            ],
            peerGroupCount:1,
            peerGroup:[
                {
                    id:1,
                    peerOrgsCACheck:"init",
                    peerCount_1:1,
                    peerInner:[
                        {
                            id:1,
                            checkStatus:"init"
                        }
                    ],
                },
            ],
            coverInfo:false,
            waitCover:false,
            channelCount:1,
            channelInner:[
                {
                    ip:1
                }
            ],
            kafkaPeerArr:[
                {
                    id:1,
                    name:"Kafka1",
                    checkStatus:"init"
                },
                {
                    id:2,
                    name:"Kafka2",
                    checkStatus:"init"
                },
                {
                    id:3,
                    name:"Kafka3",
                    checkStatus:"init"
                },
                {
                    id:4,
                    name:"Kafka4",
                    checkStatus:"init"
                }
            ],
            zookeeperArr:[
                {
                    id:1,
                    name:"Zookeeper1",
                    checkStatus:"init"
                },
                {
                    id:2,
                    name:"Zookeeper2",
                    checkStatus:"init"
                },
                {
                    id:3,
                    name:"Zookeeper3",
                    checkStatus:"init"
                }
            ],
            OdererCACheck:"init",
            channelPeerNameList:[]
        }
    }

    componentDidMount() {
        this.setState({
            zigBtnLoadding: false,
            fabricBtnLoadding: false
        })
    }

    handleSubmitEnterprise = (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                const {odererInner, peerGroup, channelPeerNameList,kafkaPeerArr,zookeeperArr,OdererCACheck} = this.state
                let flag = true
                for(var i=0;i<kafkaPeerArr.length;i++){
                    if(kafkaPeerArr[i].checkStatus === "error"){
                        message.error(intl.get("chain_create_kafka_check_enter"))
                        flag = false
                        return false;
                    }
                    if(kafkaPeerArr[i].checkStatus === "init"){
                        message.error(intl.get("chain_create_kafka_check_tip"))
                        flag = false
                        return false;
                    }
                }

                for(var i=0;i<zookeeperArr.length;i++){
                    if(zookeeperArr[i].checkStatus === "error"){
                        message.error(intl.get("chain_create_zookeeper_check_enter"))
                        flag = false
                        return false;
                    }
                    if(zookeeperArr[i].checkStatus === "init"){
                        message.error(intl.get("chain_create_zookeeper_check_tip"))
                        flag = false
                        return false;
                    }
                }

                if(OdererCACheck === "error"){
                    message.error(intl.get("chain_create_Oderer_ca_check_enter"))
                    flag = false
                }else if(OdererCACheck === "init"){
                    message.error(intl.get("chain_create_Oderer_ca_check_tip"))
                    flag = false
                }

                for(var i=0;i<odererInner.length;i++){
                    if(odererInner[i].checkStatus === "error"){
                        message.error(intl.get("chain_create_Oderer_check_enter"))
                        flag = false
                        return false;
                    }else if (odererInner[i].checkStatus === "init"){
                        message.error(intl.get("chain_create_Oderer_check_tip"))
                        flag = false
                        return false;
                    }
                }

                for(var i=0;i<peerGroup.length;i++){
                    if(peerGroup[i].peerOrgsCACheck === "error"){
                        message.error(intl.get("chain_create_Peer_ca_check_enter"))
                        flag = false
                        return false;
                    }
                    if(peerGroup[i].peerOrgsCACheck === "init"){
                        message.error(intl.get("chain_create_Peer_ca_check_tip"))
                        flag = false
                        return false;
                    }

                    for(var k = 0;k<peerGroup[i].peerInner.length;k++){
                        if(peerGroup[i].peerInner[k].checkStatus === "error"){
                            message.error(intl.get("chain_create_Peer_check_enter"))
                            flag = false
                            return false;
                        }
                        if(peerGroup[i].peerInner[k].checkStatus === "init"){
                            message.error(intl.get("chain_create_Peer_check_tip"))
                            flag = false
                            return false;
                        }
                    }
                }

                if(flag){
                    let kafka = [
                        {
                            name:"Kafka1"
                        },
                        {
                            name:"Kafka2"
                        },
                        {
                            name:"Kafka3"
                        },
                        {
                            name:"Kafka4"
                        }
                    ]
                    let Zookeeper = [
                        {
                            name:"Zookeeper1"
                        },
                        {
                            name:"Zookeeper2"
                        },
                        {
                            name:"Zookeeper3"
                        }
                    ]
                    let ordererOrg = {
                        name:"",
                        ca:{

                        },
                        orderer:[]
                    }
                    for(var i=0;i<odererInner.length;i++){
                        ordererOrg["orderer"].push({
                            _id:i+1
                        })
                    }
                    let peerOrgs = []
                    for(var j=0;j<peerGroup.length;j++){
                        let peers = []
                        for(var k = 0;k<peerGroup[j].peerInner.length;k++){
                            peers.push({
                                _id:k+1
                            })
                        }
                        peerOrgs.push({
                            _id:j+1,
                            ca:{
                                _id:j+1
                            },
                            peers
                        })
                    }
                    let channel = {
                        orgs:[]
                    }
                    for(var i in values){
                        //Kafka
                        for(var a=0;a<kafkaPeerArr.length;a++){
                            kafka[a]["name"] = `kafka${a+1}`
                            if(i.indexOf("Kafka") !== -1 && Number(i.split("_")[i.split("_").length-2]) === Number(a+1)){
                                if(i.split("_")[(i.split("_").length)-1] === "sshUsername"){
                                    kafka[a]["ssh_username"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }else if(i.split("_")[(i.split("_").length)-1] === "sshPassword"){
                                    kafka[a]["ssh_password"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                                else{
                                    kafka[a][i.split("_")[(i.split("_").length)-1]] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }

                            }
                        }

                        //zookeeper
                        for(var b=0;b<zookeeperArr.length;b++){
                            Zookeeper[b]["name"] = `zookeeper${b+1}`
                            if(i.indexOf("Zookeeper") !== -1 && Number(i.split("_")[i.split("_").length-2]) === Number(b+1)){
                                if(i.split("_")[(i.split("_").length)-1] === "sshUsername"){
                                    Zookeeper[b]["ssh_username"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }else if(i.split("_")[(i.split("_").length)-1] === "sshPassword"){
                                    Zookeeper[b]["ssh_password"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                                else{
                                    Zookeeper[b][i.split("_")[(i.split("_").length)-1]] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }

                            }
                        }

                        //ordererOrg
                        if(i === "ordererOrg_name"){
                            ordererOrg["name"] = values[i]
                        }
                        if(i.indexOf("ordererOrg") !== -1 && i.indexOf("ca") !== -1){
                            if(i.split("_")[(i.split("_").length)-1] === "sshUsername"){
                                ordererOrg["ca"]["ssh_username"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                            }else if(i.split("_")[(i.split("_").length)-1] === "sshPassword"){
                                ordererOrg["ca"]["ssh_password"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                            }
                            else{
                                ordererOrg["ca"][i.split("_")[(i.split("_").length)-1]] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                            }
                        }

                        for(var k =0;k<odererInner.length;k++){
                            if(i.indexOf("ordererOrg") !== -1 && i.indexOf("peer") !== -1 && i.indexOf(`${k+1}`) !== -1){
                                if(i.split("_")[(i.split("_").length)-1] === "sshUsername"){
                                    ordererOrg["orderer"][k]["ssh_username"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                                else if(i.split("_")[(i.split("_").length)-1] === "sshPassword"){
                                    ordererOrg["orderer"][k]["ssh_password"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                                else if(i.split("_")[(i.split("_").length)-1] === "ip"){
                                    ordererOrg["orderer"][k]["ip"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                                else if(i.split("_")[(i.split("_").length)-1] === "name"){
                                    ordererOrg["orderer"][k]["name"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                            }
                        }

                        //peerOrgs
                        for(var j =0;j<peerGroup.length;j++){
                            if(i.indexOf("peerOrgs") !== -1 && i.indexOf("name") !== -1 && i.indexOf("peers") === -1 && i.indexOf("ca") === -1 && Number(i.split("_")[i.split("_").length-2]) === Number(j+1)){
                                peerOrgs[j]["name"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                            }
                            if(i.indexOf("peerOrgs") !== -1 && i.indexOf("peers") === -1 && i.indexOf("ca") !== -1 && Number(i.split("_")[i.split("_").length-3]) === Number(j+1)){
                                if(i.split("_")[(i.split("_").length)-1] === "sshUsername"){
                                    peerOrgs[j]["ca"]["ssh_username"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                                else if(i.split("_")[(i.split("_").length)-1] === "sshPassword"){
                                    peerOrgs[j]["ca"]["ssh_password"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                                else if(i.split("_")[(i.split("_").length)-1] === "ip"){
                                    peerOrgs[j]["ca"]["ip"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                                else if(i.split("_")[(i.split("_").length)-1] === "name"){
                                    peerOrgs[j]["ca"]["name"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                }
                            }

                            for(var index = 0;index<peerGroup[j].peerInner.length;index++){
                                if(i.indexOf("peerOrgs") !== -1 && i.indexOf("peers") !== -1 && i.indexOf("ca") === -1 && Number(i.split("_")[i.split("_").length-4]) === Number(j+1) && Number(i.split("_")[i.split("_").length-2]) === Number(index+1)){
                                    if(i.split("_")[(i.split("_").length)-1] === "sshUsername"){
                                        peerOrgs[j]["peers"][index]["ssh_username"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                    }
                                    else if(i.split("_")[(i.split("_").length)-1] === "sshPassword"){
                                        peerOrgs[j]["peers"][index]["ssh_password"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                    }
                                    else if(i.split("_")[(i.split("_").length)-1] === "ip"){
                                        peerOrgs[j]["peers"][index]["ip"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                    }
                                    else if(i.split("_")[(i.split("_").length)-1] === "name"){
                                        peerOrgs[j]["peers"][index]["name"] = values[i] && values[i].leastIpValue ? values[i].leastIpValue : values[i]
                                    }
                                }
                            }

                            if(i === "channel_name"){
                                channel["name"] = values[i]
                            }
                        }
                    }

                    for(var p=0;p<document.getElementsByClassName("channel-item-actived").length;p++){
                        channel["orgs"].push(document.getElementsByClassName("channel-item-actived")[p].innerText)
                    }

                    for(var i=0;i<ordererOrg.orderer.length;i++){
                        delete ordererOrg.orderer[i]["_id"]
                    }
                    for(var i=0;i<peerOrgs.length;i++){
                        delete peerOrgs[i]["_id"]
                        delete peerOrgs[i]["ca"]["_id"]
                        for(var k=0;k<peerOrgs[i].peers.length;k++){
                            delete peerOrgs[i].peers[k]["_id"]
                        }
                    }
                    this.setState({
                        enterpriseLoading:true
                    })
                    request().post(enterpriseChain.createChain,{
                        "name": values.name,
                        "type": "fabric",
                        "version": "1.3",
                        "db": values.db,
                        "consensus": "kafka",
                        "kafka": kafka,
                        "zookeeper": Zookeeper,
                        "ordererOrg": ordererOrg,
                        "peerOrgs": peerOrgs,
                        "channel": channel
                    }).then((response)=>{
                        this.setState({
                            enterpriseLoading:false
                        })
                        if(response){
                            switch (response.status){
                                case 200:
                                    if (window._hmt) {
                                        window._hmt.push(["_trackEvent", "创建链", "企业版","fabric",values.name])
                                    }
                                    message.success(intl.get("chain_create_enterprise_success"),_this.props.history.push("/project"))
                                    break;
                                case 500:
                                    message.error(intl.get("IRISnet_creatIRISnet_default"))
                                    break;
                                case 503:
                                    message.error(intl.get("IRISnet_creatIRISnet_default"))
                                    break;
                                case 401:
                                    Cookies.remove('token');
                                    Cookies.remove('userName');
                                    sessionStorage.removeItem('projectData');
                                    sessionStorage.removeItem('consortiumType');
                                    this.props.history.push({
                                        pathname: "/login"
                                    })
                                    break;
                                default:
                                    message.error(intl.get("IRISnet_creatIRISnet_default"))
                            }
                        }
                    })
                }
            }
        })
    }

    fabricPrevClickFn = () =>{
        this.props.history.push({
            pathname:"/project"
        })
    }

    addOrdererFn = () => {
        let { odererInner,odererCount } = this.state
        if(odererInner && odererInner.length > 4){
            message.error(intl.get("creatChain_creat_node_oderer_up"))
            return false
        }else{
            this.setState({
                odererCount:odererCount+1
            },function(){
                odererInner.push({
                    id:this.state.odererCount,
                    checkStatus:"init"
                })
                this.setState({
                    odererInner:odererInner
                })
            })
        }
    }

    deleteOderer = (i,arr) =>{
        const {resetFields} = this.props.form
        let { odererInner } = this.state
        const _this = this
        // resetFields(arr[i],[])
            odererInner.splice(i,1)
            _this.setState({
                odererInner:odererInner
            })


    }

    addPeerFn = (i) => {
        let { peerGroup } = this.state
        if(peerGroup[i].peerInner && peerGroup[i].peerInner.length > 4){
            message.error(intl.get("creatChain_creat_peer_up"))
            return false
        }else{
            peerGroup[i].peerInner.push({
                id:peerGroup[i].peerCount_1+1,
                checkStatus:"init"
            })
            this.setState({
                peerGroup:peerGroup
            })
        }
    }

    deletePeer = (index,i) =>{
        let { peerGroup } = this.state
        peerGroup[i].peerInner.splice(index,1)
        this.setState({
            peerGroup:peerGroup
        })
    }

    addPeerGroupFn = () =>{
        let { peerGroup,peerGroupCount } = this.state
        if(peerGroup && peerGroup.length > 4){
            message.error(intl.get("creatChain_creat_node_peer_up"))
            return false
        }else{
            peerGroup.push({
                id:peerGroupCount + 1,
                peerOrgsCACheck:"init",
                peerCount_1:1,
                peerInner:[
                    {
                        id:1,
                        checkStatus:"init"
                    }
                ],
            },)
            this.setState({
                peerGroup:peerGroup
            })
        }
    }

    deletePeerGroupFn = (i) => {
        //i是peerGroup
        let { peerGroup,channelPeerNameList } = this.state
        peerGroup.splice(i,1)
        channelPeerNameList.splice(i,1)
        this.setState({
            peerGroup:peerGroup,
            channelPeerNameList
        })

    }

    checkIpInput = (rule, value, callback) =>{
        if (value && value.number1 && value.number2 && value.number3 && value.number4  ) {
            callback();
            return;
        }else{
            callback(intl.get("creatChain_creat_enter_node_ip"));
        }
    }

    kafkaCheckAutoFn = (arr,i) =>{
        const {getFieldValue} = this.props.form
        if(getFieldValue(arr[0]) && getFieldValue(arr[0]).leastIpValue && getFieldValue(arr[1]) && getFieldValue(arr[2]) ) {
            const {kafkaPeerArr} = this.state;
            kafkaPeerArr[i].checkStatus = "ing"
            this.setState({
                kafkaPeerArr: kafkaPeerArr
            })
            request().post(enterpriseChain.checkPeer, {
                    host: getFieldValue(arr[0]).leastIpValue,
                    username: getFieldValue(arr[1]),
                    password: getFieldValue(arr[2])
            }).then((response) => {
                if (response) {
                    const {kafkaPeerArr} = this.state;
                    switch (response.status) {
                        case 200:
                            kafkaPeerArr[i].checkStatus = "success"
                            this.setState({
                                kafkaPeerArr: kafkaPeerArr
                            })
                            break;
                        default:
                            kafkaPeerArr[i].checkStatus = "error"
                            this.setState({
                                kafkaPeerArr: kafkaPeerArr
                            })
                    }
                }
            })
        }else{
            const {kafkaPeerArr} = this.state;
            kafkaPeerArr[i].checkStatus = "init"
            this.setState({
                kafkaPeerArr: kafkaPeerArr
            })
        }
    }

    zookcheckPeerFn = (arr,i) =>{
        const {getFieldValue} = this.props.form
        if(getFieldValue(arr[0]) && getFieldValue(arr[0]).leastIpValue && getFieldValue(arr[1]) && getFieldValue(arr[2]) ){
            const {zookeeperArr} = this.state;
            zookeeperArr[i].checkStatus = "ing"
            this.setState({
                zookeeperArr:zookeeperArr
            })
            request().post(enterpriseChain.checkPeer,{
                    host:getFieldValue(arr[0]).leastIpValue,
                    username:getFieldValue(arr[1]),
                    password:getFieldValue(arr[2])
            }).then((response)=>{
                if(response){
                    const {zookeeperArr} = this.state;
                    switch(response.status){
                        case 200:
                            zookeeperArr[i].checkStatus = "success"
                            this.setState({
                                zookeeperArr:zookeeperArr
                            })
                            break;
                        default:
                            zookeeperArr[i].checkStatus = "error"
                            this.setState({
                                zookeeperArr:zookeeperArr
                            })
                    }
                }
            })
        }else{
            const {zookeeperArr} = this.state;
            zookeeperArr[i].checkStatus = "init"
            this.setState({
                zookeeperArr:zookeeperArr
            })
        }
    }

    PeerInnercheckFn = (arr,k,i) =>{
        const {getFieldValue} = this.props.form
        if(getFieldValue(arr[0]) && getFieldValue(arr[0]).leastIpValue && getFieldValue(arr[1]) && getFieldValue(arr[2]) && getFieldValue(arr[3]) ){
            const {peerGroup} = this.state;
            peerGroup[i].peerInner[k].checkStatus = "ing"
            this.setState({
                peerGroup:peerGroup
            })
            request().post(enterpriseChain.checkPeer,{
                    host:getFieldValue(arr[0]).leastIpValue,
                    username:getFieldValue(arr[1]),
                    password:getFieldValue(arr[2])
            }).then((response)=>{
                if(response){
                    const {peerGroup} = this.state;
                    switch(response.status){
                        case 200:
                            peerGroup[i].peerInner[k].checkStatus = "success"
                            this.setState({
                                peerGroup:peerGroup
                            })
                            break;
                        default:
                            peerGroup[i].peerInner[k].checkStatus = "error"
                            this.setState({
                                peerGroup:peerGroup
                            })
                    }
                }
            })
        }else{
            const {peerGroup} = this.state;
            peerGroup[i].peerInner[k].checkStatus = "init"
            this.setState({
                peerGroup:peerGroup
            })
        }
    }

    backJumpPageFn = ()=>{
        this.props.history.go(-1)
    }

    cancelApply = () =>{
        this.props.history.go(-1)
    }

    OdererCApeerCheckFn = (arr) =>{
        const {getFieldValue} = this.props.form
        if(getFieldValue(arr[0]) && getFieldValue(arr[0]).leastIpValue && getFieldValue(arr[1]) && getFieldValue(arr[2]) && getFieldValue(arr[3]) ) {
            this.setState({
                OdererCACheck: "ing"
            })
            request().post(enterpriseChain.checkPeer, {
                    host: getFieldValue(arr[0]).leastIpValue,
                    username: getFieldValue(arr[1]),
                    password: getFieldValue(arr[2])
            }).then((response) => {
                if (response) {
                    switch (response.status) {
                        case 200:
                            this.setState({
                                OdererCACheck: "success"
                            })
                            break;
                        default:
                            this.setState({
                                OdererCACheck: "error"
                            })
                    }
                }
            })
        }else{
            this.setState({
                OdererCACheck: "init"
            })
        }
    }

    ordererOrgPeerCheckFn = (arr,i) =>{
        const {getFieldValue} = this.props.form
        if(getFieldValue(arr[0]) && getFieldValue(arr[0]).leastIpValue && getFieldValue(arr[1]) && getFieldValue(arr[2]) && getFieldValue(arr[3]) ){
            const {odererInner} = this.state;
            odererInner[i].checkStatus = "ing"
            this.setState({
                odererInner:odererInner
            })
            request().post(enterpriseChain.checkPeer,{
                    host:getFieldValue(arr[0]).leastIpValue,
                    username:getFieldValue(arr[1]),
                    password:getFieldValue(arr[2])
            }).then((response)=>{
                if(response){
                    const {odererInner} = this.state;
                    switch(response.status){
                        case 200:
                            odererInner[i].checkStatus = "success"
                            this.setState({
                                odererInner:odererInner
                            })
                            break;
                        default:
                            odererInner[i].checkStatus = "error"
                            this.setState({
                                odererInner:odererInner
                            })
                    }
                }
            })
        }else{
            const {odererInner} = this.state;
            odererInner[i].checkStatus = "init"
            this.setState({
                odererInner:odererInner
            })
        }
    }

    peerOrgsCACheckFn = (arr,i) =>{
        const {getFieldValue} = this.props.form
        if(getFieldValue(arr[0]) && getFieldValue(arr[0]).leastIpValue && getFieldValue(arr[1]) && getFieldValue(arr[2]) && getFieldValue(arr[3]) ){
            const {peerGroup} = this.state;
            peerGroup[i].peerOrgsCACheck = "ing"
            this.setState({
                peerGroup:peerGroup
            })
            request().post(enterpriseChain.checkPeer,{
                    host:getFieldValue(arr[0]).leastIpValue,
                    username:getFieldValue(arr[1]),
                    password:getFieldValue(arr[2])
            }).then((response)=>{
                if(response){
                    const {peerGroup} = this.state;
                    switch(response.status){
                        case 200:
                            peerGroup[i].peerOrgsCACheck = "success"
                            this.setState({
                                peerGroup:peerGroup
                            })
                            break;
                        default:
                            peerGroup[i].peerOrgsCACheck = "error"
                            this.setState({
                                peerGroup:peerGroup
                            })
                    }
                }
            })
        }else{
            const {peerGroup} = this.state;
            peerGroup[i].peerOrgsCACheck = "init"
            this.setState({
                peerGroup:peerGroup
            })
        }
    }

    changePeerListName = (e,index,name) =>{
        const {channelPeerNameList} = this.state
        let flag = true

        if(channelPeerNameList.length){
            for(let i=0;i<channelPeerNameList.length;i++){
                if(channelPeerNameList[i].index === index){
                    channelPeerNameList[i].name = e.target.value
                    flag = false
                }
            }
        }
        if(flag){
            channelPeerNameList.push({
                "index": index,
                "name":e.target.value,
                "status":false
            })
        }
        this.setState({
            channelPeerNameList
        })
    }

    changeKafkaCheckFn = (item)=>{
        const {kafkaPeerArr} = this.state
        kafkaPeerArr[item.id-1].checkStatus = "init"
        this.setState({
            kafkaPeerArr
        })
        // this.enterCancalRequest()
    }

    changeZookeeperCheckFn = (item)=>{
        const {zookeeperArr} = this.state
        zookeeperArr[item.id-1].checkStatus = "init"
        this.setState({
            zookeeperArr
        })
    }

    changeOdererCACheckFn = (item)=>{
        this.setState({
            OdererCACheck:"init"
        })
    }

    changeOdererPeerCheckFn = (item) =>{
        const {odererInner} = this.state
        odererInner[item.id-1].checkStatus = "init"
        this.setState({
            odererInner
        })
    }

    changePeerCACheckFn = (item) =>{
        const {peerGroup} = this.state
        peerGroup[item.id-1].peerOrgsCACheck = "init"
        this.setState({
            peerGroup
        })
    }

    changePeerCheckFn = (item,peerItem) =>{
        const {peerGroup} = this.state
        peerGroup[item.id-1].peerInner[peerItem.id-1].checkStatus = "init"
        this.setState({
            peerGroup
        })
    }

    selectChannelFn = (item,idx) =>{
        const {channelPeerNameList} = this.state
        channelPeerNameList[idx].status = !channelPeerNameList[idx].status
        this.setState({
            channelPeerNameList
        })
    }

    enterCancalRequest = () =>{
        this.controller.abort()
        // this.setState = (state,callback)=>{
        //     return;
        // };
    }

    render() {

        const formItemLayoutTable = {
            labelCol: {
                xs: { span: 4 ,offset:0 },
                sm: { span: 4 , offset:2 },
                md: { span: 4 , offset:2 },
                lg: { span: 4 , offset:1 },
                xl: { span: 4 ,offset:1 },
                xxl: { span: 4 ,offset:2 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
                md: { span: 16 },
                lg: { span: 18 },
                xl: { span: 18 },
                xxl:{ span: 16 }
            },
        };

        const formItemLayoutTableName = {
            labelCol: {
                xs: { span: 24 ,offset:0 },
                sm: { span: 1 },
                md: { span: 1 },
                lg: { span: 1 },
                xxl: { span: 1 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
                md: { span: 15 },
                lg: { span: 15 },
                xxl:{ span: 15 }
            },
        };

        const formItemLayoutChannel = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
                md: { span: 6 },
                lg: { span: 6 },
                xl: { span:5 },
                xxl: { span: 5 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:  6},
                md: { span: 4 },
                lg: { span: 4 },
                xl: { span:4 },
                xxl:{ span: 4 }
            },
        }

        const pathnameArr = window.location.pathname.split("/")

        const {odererInner, peerGroup, channelInner, kafkaPeerArr, zookeeperArr, OdererCACheck, channelPeerNameList} = this.state

        const { getFieldDecorator ,getFieldValue} = this.props.form;

        //Fabric  solo

        const odererPartList = odererInner && odererInner.map((item,i)=> {
            return (<ul key={i} id={item.id} style={{display: "flex", height: "38px",marginBottom:"15px"}}>
                        <FormItem className="peer-name">
                            {getFieldDecorator(`ordererOrg_peer_${item.id}_name`, {
                                rules: [
                                    {
                                        required: true,
                                        message: intl.get("creatChain_enter_name"),
                                    },
                                    {
                                        whitespace: true,
                                        message: intl.get("creatChain_enter_name"),
                                    },
                                ],
                            })(
                                <Input onBlur={()=>{this.ordererOrgPeerCheckFn([`ordererOrg_peer_${item.id}_ip`,`ordererOrg_peer_${item.id}_sshUsername`,`ordererOrg_peer_${item.id}_sshPassword`,`ordererOrg_peer_${item.id}_name`],i)}} className="input-mid"/>
                            )}
                        </FormItem>
                        <FormItem className="peer-ip">
                            {getFieldDecorator(`ordererOrg_peer_${item.id}_ip`, {
                                rules: [{ validator: this.checkIpInput }],
                            })(
                                <IpInput onBlur={()=>{this.ordererOrgPeerCheckFn([`ordererOrg_peer_${item.id}_ip`,`ordererOrg_peer_${item.id}_sshUsername`,`ordererOrg_peer_${item.id}_sshPassword`,`ordererOrg_peer_${item.id}_name`],i)}}
                                         onChange={()=>{this.changeOdererPeerCheckFn(item)}}/>
                            )}
                        </FormItem>
                        <FormItem className="ssh-username">
                            {getFieldDecorator(`ordererOrg_peer_${item.id}_sshUsername`,{
                                rules: [{
                                    required: true,
                                    message: intl.get("creatChain_enter_ssh_username_name"),
                                },],
                            })(
                                <div>
                                    <Input onBlur={()=>{this.ordererOrgPeerCheckFn([`ordererOrg_peer_${item.id}_ip`,`ordererOrg_peer_${item.id}_sshUsername`,`ordererOrg_peer_${item.id}_sshPassword`,`ordererOrg_peer_${item.id}_name`],i)}}
                                           className="input-len" onChange={()=>{this.changeOdererPeerCheckFn(item)}}/>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className="ssh-username">
                            {getFieldDecorator(`ordererOrg_peer_${item.id}_sshPassword`,{
                                rules: [{
                                    required: true,
                                    message: intl.get("creatChain_enter_ssh_username_pass"),
                                },],
                            })(
                                <div>
                                    <Input type="password" onBlur={()=>{this.ordererOrgPeerCheckFn([`ordererOrg_peer_${item.id}_ip`,`ordererOrg_peer_${item.id}_sshUsername`,`ordererOrg_peer_${item.id}_sshPassword`,`ordererOrg_peer_${item.id}_name`],i)}}
                                           className="input-len" onChange={()=>{this.changeOdererPeerCheckFn(item)}}/>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className="test-peer-item">
                            <span className={item.checkStatus === "init" ? (getFieldValue(`ordererOrg_peer_${item.id}_name`) && getFieldValue(`ordererOrg_peer_${item.id}_ip`) && getFieldValue(`ordererOrg_peer_${item.id}_sshUsername`) && getFieldValue(`ordererOrg_peer_${item.id}_sshPassword`) ? "test-peer test-peer-init" : "test-peer test-peer-default" ) : item.checkStatus === "error" ? "test-peer test-peer-error" :item.checkStatus === "success" ? "test-peer test-peer-success" :item.checkStatus === "ing" ? "test-peer test-peer-init" : ""} onClick={()=>{this.ordererOrgPeerCheckFn([`ordererOrg_peer_${item.id}_ip`,`ordererOrg_peer_${item.id}_sshUsername`,`ordererOrg_peer_${item.id}_sshPassword`],i)}}>{item.checkStatus === "init" ? intl.get("creatChain_creat_check_Detect") : item.checkStatus === "error" ? intl.get("creatChain_creat_check_Detect_fail") :item.checkStatus === "success" ? intl.get("creatChain_creat_check_Detect_success") : item.checkStatus === "ing" ? intl.get("creatChain_creat_peer_detection") : " " }</span>
                        </FormItem>
                    {
                        i && i > 0 ? <span style={{top:`180+${(i+1)*40}`}} className="add-close"><Icon onClick={()=>{this.deleteOderer(i,[`ordererOrg_peer_${item.id}_name`,`ordererOrg_peer_${item.id}_ip`,`ordererOrg_peer_${item.id}_sshUsername`,`ordererOrg_peer_${item.id}_sshPassword`])}} style={{color:"#bec3c8",cursor:"pointer"}} type="close-circle" /></span> : ""
                    }
                    </ul>)

        })

        const kafkaPeerList = kafkaPeerArr && kafkaPeerArr.map((item,i)=>{
            return (
                <ul key={i} className="ul-item">
                    <FormItem className="peer-name">
                        {getFieldDecorator(`Kafka_${item.id}_name`)(
                            <span>{item.name}</span>
                        )}
                    </FormItem>
                    <FormItem className="peer-ip">
                        {getFieldDecorator(`Kafka_${item.id}_ip`, {
                            rules: [{ validator: this.checkIpInput }],
                        })(
                            <IpInput onBlur={()=>{this.kafkaCheckAutoFn([`Kafka_${item.id}_ip`,`Kafka_${item.id}_sshUsername`,`Kafka_${item.id}_sshPassword`],i)}} onChange={()=>{this.changeKafkaCheckFn(item)}}/>
                        )}
                    </FormItem>
                    <FormItem className="ssh-username">
                        {getFieldDecorator(`Kafka_${item.id}_sshUsername`,{
                            rules: [
                                {
                                    required: true,
                                    message: intl.get("creatChain_enter_ssh_username_name"),
                                }
                            ],
                        })(
                            <div>
                                <Input onBlur={()=>{this.kafkaCheckAutoFn([`Kafka_${item.id}_ip`,`Kafka_${item.id}_sshUsername`,`Kafka_${item.id}_sshPassword`],i)}} onChange={()=>{this.changeKafkaCheckFn(item)}} style={{width:"132px"}} />
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="ssh-username">
                        {getFieldDecorator(`Kafka_${item.id}_sshPassword`,{
                            rules: [
                                {
                                    required: true,
                                    message: intl.get("creatChain_enter_ssh_username_pass"),
                                }
                            ],
                        })(
                            <div>
                                <Input type="password"  onBlur={()=>{this.kafkaCheckAutoFn([`Kafka_${item.id}_ip`,`Kafka_${item.id}_sshUsername`,`Kafka_${item.id}_sshPassword`],i)}} onChange={()=>{this.changeKafkaCheckFn(item)}} style={{width:"132px"}} />
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="test-peer-item">
                        <span className={item.checkStatus === "init" ? (getFieldValue(`Kafka_${item.id}_ip`) && getFieldValue(`Kafka_${item.id}_sshUsername`) && getFieldValue(`Kafka_${item.id}_sshPassword`) ? "test-peer test-peer-init" : "test-peer test-peer-default" ) : item.checkStatus === "error" ? "test-peer test-peer-error" :item.checkStatus === "success" ? "test-peer test-peer-success" : item.checkStatus === "ing" ? "test-peer test-peer-init" : ""}>{item.checkStatus === "init" ? intl.get("creatChain_creat_check_Detect") : item.checkStatus === "error" ? intl.get("creatChain_creat_check_Detect_fail") :item.checkStatus === "success" ? intl.get("creatChain_creat_check_Detect_success") : item.checkStatus === "ing" ? intl.get("creatChain_creat_peer_detection") : "" }</span>
                    </FormItem>
                </ul>
            )
        })

        const zookeeperList = zookeeperArr && zookeeperArr.map((item,i)=>{
            return (
                <ul key={i} className="ul-item">
                    <FormItem className="peer-name">
                        {getFieldDecorator(`Zookeeper_${item.id}_name`)(
                            <span>{item.name}</span>
                        )}
                    </FormItem>
                    <FormItem className="peer-ip">
                        {getFieldDecorator(`Zookeeper_${item.id}_ip`, {
                            rules: [{ validator: this.checkIpInput }],
                        })(
                            <IpInput onBlur={()=>{this.zookcheckPeerFn([`Zookeeper_${item.id}_ip`,`Zookeeper_${item.id}_sshUsername`,`Zookeeper_${item.id}_sshPassword`],i)}} onChange={()=>{this.changeZookeeperCheckFn(item)}}/>
                        )}
                    </FormItem>
                    <FormItem className="ssh-username">
                        {getFieldDecorator(`Zookeeper_${item.id}_sshUsername`,{
                            rules: [{
                                required: true,
                                message: intl.get("creatChain_enter_ssh_username_name"),
                            },],
                        })(
                            <div>
                                <Input onBlur={()=>{this.zookcheckPeerFn([`Zookeeper_${item.id}_ip`,`Zookeeper_${item.id}_sshUsername`,`Zookeeper_${item.id}_sshPassword`],i)}} onChange={()=>{this.changeZookeeperCheckFn(item)}} style={{width:"132px"}} />
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="ssh-username">
                        {getFieldDecorator(`Zookeeper_${item.id}_sshPassword`,{
                            rules: [{
                                required: true,
                                message: intl.get("creatChain_enter_ssh_username_pass"),
                            },],
                        })(
                            <div>
                                <Input type="password"  onBlur={()=>{this.zookcheckPeerFn([`Zookeeper_${item.id}_ip`,`Zookeeper_${item.id}_sshUsername`,`Zookeeper_${item.id}_sshPassword`],i)}} onChange={()=>{this.changeZookeeperCheckFn(item)}} style={{width:"132px"}} />
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="test-peer-item">
                        <span className={item.checkStatus === "init" ? (getFieldValue(`Zookeeper_${item.id}_ip`) && getFieldValue(`Zookeeper_${item.id}_sshUsername`) && getFieldValue(`Zookeeper_${item.id}_sshPassword`) ? "test-peer test-peer-init" : "test-peer test-peer-default" ) : item.checkStatus === "error" ? "test-peer test-peer-error" :item.checkStatus === "success" ? "test-peer test-peer-success" : item.checkStatus === "ing" ? "test-peer test-peer-init" : ""} >{item.checkStatus === "init" ? intl.get("creatChain_creat_check_Detect") : item.checkStatus === "error" ? intl.get("creatChain_creat_check_Detect_fail") :item.checkStatus === "success" ? intl.get("creatChain_creat_check_Detect_success") : item.checkStatus === "ing" ? intl.get("creatChain_creat_peer_detection") : "" }</span>
                    </FormItem>
                </ul>
            )
        })

        return (
            <div className='page-part-fabric'>
                {/*<div className={!this.state.coverInfo ? "coverHidd" : "cover"}> </div>*/}
                {/*<div className={!this.state.coverInfo ? "coverHidd" : "tip-form"}>*/}
                    {/*<h1>{intl.get("creatChain_creat_apply_form}</h1>*/}
                    {/*<p>{intl.get("creatChain_creat_apply_form_no}</p>*/}
                    {/*<div className="tip-form-btn">*/}
                        {/*<Button onClick={()=>{this.cancelApply()}}>{intl.get("service_resetPass_cancel}</Button>*/}
                        {/*<Button type="primary" onClick={()=>{this.formApplyJumpFn()}} style={{marginLeft:"12px"}}>{intl.get("creatChain_creat_apply_form_go_apply}</Button>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<div className={!this.state.waitCover ? "coverHid" : "cover"}> </div>*/}
                {/*<div className={!this.state.waitCover ? "coverHidd" : "tip-form"}>*/}
                    {/*<h1>{intl.get("creatChain_creat_apply_form}</h1>*/}
                    {/*<p style={{padding:"0 50px 0 50px",lineHeight:"25px"}}>{intl.get("creatChain_creat_apply_form_pending}</p>*/}
                    {/*<div className="tip-form-btn">*/}
                        {/*<Button type="primary" onClick={()=>{this.backJumpPageFn()}} style={{marginLeft:"12px"}}>{intl.get("Dashboard_IPFS_Side_Upload_Sure}</Button>*/}
                    {/*</div>*/}
                {/*</div>*/}

                <div className='configPartFabric'>
                    <Form
                        hideRequiredMark
                        onSubmit={this.handleSubmitEnterprise}
                        style={{marginTop:"5%"}}
                    >
                        <FormItem label={intl.get("service_modal_detail_name")} {...formItemLayoutTable} style={{ marginBottom: "20px" }}>
                            {getFieldDecorator('name', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: intl.get("service_enter_chain_name"),
                                    },
                                    {
                                        whitespace: true,
                                        message: intl.get("service_enter_chain_name"),
                                    },
                                ],
                            })(<Input style={{width:"225px"}} placeholder={intl.get("service_enter_chain_name_tip")} />)}
                        </FormItem>
                        <FormItem label={intl.get("creatChain_creat_version")} {...formItemLayoutTable} style={{ marginBottom: "23.5px" }}>
                            {getFieldDecorator('version', {
                                initialValue: '1.3',
                            })(
                                <Radio.Group>
                                    <Radio.Button value="1.3">fabric 1.3</Radio.Button>
                                    <Radio.Button value="1.2" disabled>fabric 1.2</Radio.Button>
                                </Radio.Group>
                            )}
                        </FormItem>
                        <FormItem label={intl.get("creatChain_creat_Method")} {...formItemLayoutTable} style={{ marginBottom: "23.5px" }}>
                            {getFieldDecorator('db', {
                                initialValue: 'leveldb',
                            })(
                                <div>goleveldb</div>
                            )}
                        </FormItem>
                        <Col xxl={{span:18,offset:3}} xl={{span:18,offset:3}} lg={{span:20,offset:2}} md={{span:18,offset:3}} sm={{span:20,offset:2}} >
                            <Divider style={{margin:"0 0 25px 0"}}/>
                        </Col>
                        <FormItem label={intl.get("creatChain_creat_Strategy")} {...formItemLayoutTable} style={{ marginBottom: "23.5px" }}>
                            {getFieldDecorator('consensus', {
                                initialValue: 'kafka',
                            })(
                                <div>
                                    <Radio.Group defaultValue="kafka" style={{marginBottom:"15px"}}>
                                        <Radio.Button value="kafka">kafka</Radio.Button>
                                        <Radio.Button value="tendermint" disabled>tendermint</Radio.Button>
                                    </Radio.Group>
                                    <div className="fabric-kafka-tab" style={{background:"rgba(242, 242, 242, 0.7)"}}>
                                        <p>{intl.get("creatChain_creat_node_type")}：Kafka</p>
                                        <ul>
                                            <FormItem className="peer-name">
                                                <span>{intl.get("creatChain_creat_node_name")}</span>
                                            </FormItem>
                                            <FormItem className="peer-ip">
                                                <span>{intl.get("creatChain_creat_node_ip")}</span>
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                <span>{intl.get("creatChain_creat_SSH_username")}</span>
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                <span>{intl.get("creatChain_creat_SSH_password")}</span>
                                            </FormItem>
                                            <FormItem className="test-peer-item">
                                                <span>{intl.get("creatChain_creat_check_result")}</span>
                                            </FormItem>
                                        </ul>
                                        {kafkaPeerList}
                                    </div>
                                    <p className="tip-peer">{intl.get("creatChain_creat_ip_enter_tip")}</p>
                                    <div className="fabric-kafka-tab" style={{background:"rgba(242, 242, 242, 0.7)"}}>
                                        <p>{intl.get("creatChain_creat_node_type")}：Zookeeper</p>
                                        <ul>
                                            <FormItem className="peer-name">
                                                <span>{intl.get("creatChain_creat_node_name")}</span>
                                            </FormItem>
                                            <FormItem className="peer-ip">
                                                <span>{intl.get("creatChain_creat_node_ip")}</span>
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                <span>{intl.get("creatChain_creat_SSH_username")}</span>
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                <span>{intl.get("creatChain_creat_SSH_password")}</span>
                                            </FormItem>
                                            <FormItem className="test-peer-item">
                                                <span>{intl.get("creatChain_creat_check_result")}</span>
                                            </FormItem>
                                        </ul>
                                        {zookeeperList}
                                    </div>
                                    <p className="tip-peer">{intl.get("creatChain_creat_ip_enter_tip")}</p>
                                </div>
                            )}
                        </FormItem>
                        <Col xxl={{span:18,offset:3}} xl={{span:18,offset:3}} lg={{span:20,offset:2}} md={{span:18,offset:3}} sm={{span:20,offset:2}} >
                            <Divider style={{margin:"0 0 25px 0"}} />
                        </Col>
                        <FormItem label={intl.get("creatChain_creat_new_orderer")} {...formItemLayoutTable} style={{ marginBottom: "23.5px" }}>
                            {getFieldDecorator('ordererOrg', {
                            })(
                                <div>
                                    <div id="addOrdererPart" className="fabric-kafka-tab" style={{background:"rgba(242, 242, 242, 0.7)"}}>
                                        <FormItem label={intl.get("service_modal_detail_name")} {...formItemLayoutTableName} style={{marginBottom:"10px"}}>
                                            {getFieldDecorator('ordererOrg_name',{
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:intl.get("creatChain_enter_name"),
                                                    },
                                                    {
                                                        whitespace:true,
                                                        message:intl.get("creatChain_enter_name"),
                                                    },
                                                ],
                                            })(
                                                <Input style={{width:"135px"}} />
                                            )}
                                        </FormItem>
                                        <ul>
                                            <FormItem className="peer-name">
                                                <span>{intl.get("creatChain_creat_CA_node_name")}</span>
                                            </FormItem>
                                            <FormItem className="peer-ip">
                                                <span> {intl.get("creatChain_creat_node_ip")}</span>
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                <span>{intl.get("creatChain_creat_SSH_username")}</span>
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                <span>{intl.get("creatChain_creat_SSH_password")}</span>
                                            </FormItem>
                                            <FormItem className="test-peer-item">
                                                <span>{intl.get("creatChain_creat_check_result")}</span>
                                            </FormItem>
                                        </ul>
                                        <ul style={{display:"flex",height:"38px",marginBottom:"10px"}}>
                                            <FormItem className="peer-name">
                                                {getFieldDecorator('ordererOrg_ca_name',{
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:intl.get("creatChain_enter_name"),
                                                        },
                                                        {
                                                            whitespace:true,
                                                            message:intl.get("creatChain_enter_name"),
                                                        },
                                                    ],
                                                })(
                                                    <Input onBlur={()=>{this.OdererCApeerCheckFn(["ordererOrg_ca_ip","ordererOrg_ca_sshUsername","ordererOrg_ca_sshPassword",'ordererOrg_ca_name'])}} style={{width:"100px"}} />
                                                )}
                                            </FormItem>
                                            <FormItem className="peer-ip">
                                                {getFieldDecorator("ordererOrg_ca_ip", {
                                                    rules: [{ validator: this.checkIpInput }],
                                                })(
                                                    <IpInput onBlur={()=>{this.OdererCApeerCheckFn(["ordererOrg_ca_ip","ordererOrg_ca_sshUsername","ordererOrg_ca_sshPassword",'ordererOrg_ca_name'])}} onChange={()=>{this.changeOdererCACheckFn()}}/>
                                                )}
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                {getFieldDecorator('ordererOrg_ca_sshUsername',{
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get("creatChain_enter_ssh_username_name"),
                                                    },],
                                                })(
                                                    <div>
                                                        <Input onBlur={()=>{this.OdererCApeerCheckFn(["ordererOrg_ca_ip","ordererOrg_ca_sshUsername","ordererOrg_ca_sshPassword",'ordererOrg_ca_name'])}} onChange={()=>{this.changeOdererCACheckFn()}} style={{width:"132px"}} />
                                                    </div>
                                                )}
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                {getFieldDecorator('ordererOrg_ca_sshPassword',{
                                                    rules: [{
                                                        required: true,
                                                        message: intl.get("creatChain_enter_ssh_username_pass"),
                                                    },],
                                                })(
                                                    <div>
                                                        <Input type="password"  onBlur={()=>{this.OdererCApeerCheckFn(["ordererOrg_ca_ip","ordererOrg_ca_sshUsername","ordererOrg_ca_sshPassword",'ordererOrg_ca_name'])}} onChange={()=>{this.changeOdererCACheckFn()}} style={{width:"132px"}} />
                                                    </div>
                                                )}
                                            </FormItem>
                                            <FormItem className="test-peer-item">
                                                <span className={OdererCACheck === "init" ? ( getFieldValue('ordererOrg_ca_name') && getFieldValue("ordererOrg_ca_ip") && getFieldValue('ordererOrg_ca_sshUsername') && getFieldValue('ordererOrg_ca_sshPassword') ? "test-peer test-peer-init" : "test-peer test-peer-default" ) : OdererCACheck === "error" ? "test-peer test-peer-error" :OdererCACheck === "success" ? "test-peer test-peer-success" : OdererCACheck === "ing" ? "test-peer test-peer-init" : ""} >{OdererCACheck === "init" ? intl.get("creatChain_creat_check_Detect") : OdererCACheck === "success" ? intl.get("creatChain_creat_check_Detect_success") :OdererCACheck === "error" ? intl.get("creatChain_creat_check_Detect_fail") : OdererCACheck === "ing" ? intl.get("creatChain_creat_peer_detection") : "" }</span>
                                            </FormItem>
                                        </ul>
                                        <ul>
                                            <FormItem className="peer-name">
                                                <span>{intl.get("creatChain_creat_Oderer_node_name")}</span>
                                            </FormItem>
                                            <FormItem className="peer-ip">
                                                <span>{intl.get("creatChain_creat_node_ip")}</span>
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                <span>{intl.get("creatChain_creat_SSH_username")}</span>
                                            </FormItem>
                                            <FormItem className="ssh-username">
                                                <span>{intl.get("creatChain_creat_SSH_password")}</span>
                                            </FormItem>
                                            <FormItem className="test-peer-item">
                                                <span>{intl.get("creatChain_creat_check_result")}</span>
                                            </FormItem>
                                        </ul>
                                        {odererPartList}
                                        <p className="add-order-tip"><span onClick={()=>{this.addOrdererFn()}} className="add-order-btn">{intl.get("creatChain_creat_node_orderer")}</span>({intl.get("creatChain_creat_add_up")}) </p>
                                    </div>
                                    <p className="tip-peer">{intl.get("creatChain_creat_ip_enter_tip")}</p>
                                </div>
                            )}
                        </FormItem>
                        <FormItem label={intl.get("creatChain_creat_new_peer_Organization")} {...formItemLayoutTable} style={{ marginBottom: "23.5px" }}>
                            {getFieldDecorator('peerOrg', {
                            })(
                                <div>
                                    {
                                        peerGroup && peerGroup.map((item,i) => {
                                            return (
                                                <div key={i} id="addOrdererPart" className="fabric-kafka-tab" style={{background:"rgba(242, 242, 242, 0.7)"}}>
                                                    {
                                                        i && i > 0 ? <span className="peer-group-close"><Icon onClick={()=>{this.deletePeerGroupFn(i)}} style={{color:"#bec3c8",cursor:"pointer"}} type="close-circle" /></span> : ""
                                                    }
                                                    <FormItem label={intl.get("service_modal_detail_name")} {...formItemLayoutTableName} style={{marginBottom:"10px"}}>
                                                        {getFieldDecorator(`peerOrgs_${i+1}_name`,{
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message:intl.get("creatChain_enter_name"),
                                                                },
                                                                {
                                                                    whitespace:true,
                                                                    message:intl.get("creatChain_enter_name"),
                                                                },
                                                            ],
                                                        })(
                                                            <Input onBlur={(e)=>{this.changePeerListName(e,i,`peerOrgs_${i+1}_name`)}} style={{width:"135px"}} />
                                                        )}
                                                    </FormItem>
                                                    <ul>
                                                        <FormItem className="peer-name">
                                                            <span>{intl.get("creatChain_creat_CA_node_name")}</span>
                                                        </FormItem>
                                                        <FormItem className="peer-ip">
                                                            <span>{intl.get("creatChain_creat_node_ip")}</span>
                                                        </FormItem>
                                                        <FormItem className="ssh-username">
                                                            <span>{intl.get("creatChain_creat_SSH_username")}</span>
                                                        </FormItem>
                                                        <FormItem className="ssh-username">
                                                            <span>{intl.get("creatChain_creat_SSH_password")}</span>
                                                        </FormItem>
                                                        <FormItem className="test-peer-item">
                                                            <span>{intl.get("creatChain_creat_check_result")}</span>
                                                        </FormItem>
                                                    </ul>
                                                    <ul style={{display:"flex",height:"38px",marginBottom:"10px"}}>
                                                        <FormItem className="peer-name">
                                                            {getFieldDecorator(`peerOrgs_${i+1}_ca_name`,{
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message:intl.get("creatChain_enter_name"),
                                                                    },
                                                                    {
                                                                        whitespace:true,
                                                                        message:intl.get("creatChain_enter_name"),
                                                                    },
                                                                ],
                                                            })(
                                                                <Input onBlur={()=>{this.peerOrgsCACheckFn([`peerOrgs_${i+1}_ca_ip`,`peerOrgs_${i+1}_ca_sshUsername`,`peerOrgs_${i+1}_ca_sshPassword`,`peerOrgs_${i+1}_ca_name`],i)}} style={{width:"100px"}} />
                                                            )}
                                                        </FormItem>
                                                        <FormItem className="peer-ip">
                                                            {getFieldDecorator(`peerOrgs_${i+1}_ca_ip`, {
                                                                rules: [{ validator: this.checkIpInput }],
                                                            })(
                                                                <IpInput onBlur={()=>{this.peerOrgsCACheckFn([`peerOrgs_${i+1}_ca_ip`,`peerOrgs_${i+1}_ca_sshUsername`,`peerOrgs_${i+1}_ca_sshPassword`,`peerOrgs_${i+1}_ca_name`],i)}} onChange={()=>{this.changePeerCACheckFn(item)}}/>
                                                            )}
                                                        </FormItem>
                                                        <FormItem className="ssh-username">
                                                            {getFieldDecorator(`peerOrgs_${i+1}_ca_sshUsername`,{
                                                                rules: [{
                                                                    required: true,
                                                                    message: intl.get("creatChain_enter_ssh_username_name"),
                                                                },],
                                                            })(
                                                                <div>
                                                                    <Input onBlur={()=>{this.peerOrgsCACheckFn([`peerOrgs_${i+1}_ca_ip`,`peerOrgs_${i+1}_ca_sshUsername`,`peerOrgs_${i+1}_ca_sshPassword`,`peerOrgs_${i+1}_ca_name`],i)}} onChange={()=>{this.changePeerCACheckFn(item)}} style={{width:"132px"}} />
                                                                </div>
                                                            )}
                                                        </FormItem>
                                                        <FormItem className="ssh-username">
                                                            {getFieldDecorator(`peerOrgs_${i+1}_ca_sshPassword`,{
                                                                rules: [{
                                                                    required: true,
                                                                    message: intl.get("creatChain_enter_ssh_username_pass"),
                                                                },],
                                                            })(
                                                                <div>
                                                                    <Input type="password"  onBlur={()=>{this.peerOrgsCACheckFn([`peerOrgs_${i+1}_ca_ip`,`peerOrgs_${i+1}_ca_sshUsername`,`peerOrgs_${i+1}_ca_sshPassword`,`peerOrgs_${i+1}_ca_name`],i)}} onChange={()=>{this.changePeerCACheckFn(item)}} style={{width:"132px"}} />
                                                                </div>
                                                            )}
                                                        </FormItem>
                                                        <FormItem className="test-peer-item">
                                                            <span className={item.peerOrgsCACheck === "init" ? (getFieldValue(`peerOrgs_${i+1}_ca_name`) && getFieldValue(`peerOrgs_${i+1}_ca_ip`) && getFieldValue(`peerOrgs_${i+1}_ca_sshUsername`) && getFieldValue(`peerOrgs_${i+1}_ca_sshPassword`) ? "test-peer test-peer-init" : "test-peer test-peer-default" ) : item.peerOrgsCACheck === "error" ? "test-peer test-peer-error" :item.peerOrgsCACheck === "success" ? "test-peer test-peer-success" : item.peerOrgsCACheck === "ing" ? "test-peer test-peer-init" : "" } onClick={()=>{this.peerOrgsCACheckFn([`peerOrgs_${i+1}_ca_ip`,`peerOrgs_${i+1}_ca_sshUsername`,`peerOrgs_${i+1}_ca_sshPassword`],i)}}>{item.peerOrgsCACheck === "init" ? intl.get("creatChain_creat_check_Detect") : item.peerOrgsCACheck === "success" ? intl.get("creatChain_creat_check_Detect_success") :item.peerOrgsCACheck === "error" ? intl.get("creatChain_creat_check_Detect_fail") : item.peerOrgsCACheck === "ing" ? intl.get("creatChain_creat_peer_detection") : "" }</span>
                                                        </FormItem>
                                                    </ul>
                                                    <ul>
                                                        <FormItem className="peer-name">
                                                            <span>{intl.get("creatChain_creat_Peer_node_name")}</span>
                                                        </FormItem>
                                                        <FormItem className="peer-ip">
                                                            <span>{intl.get("creatChain_creat_node_ip")}</span>
                                                        </FormItem>
                                                        <FormItem className="ssh-username">
                                                            <span>{intl.get("creatChain_creat_SSH_username")}</span>
                                                        </FormItem>
                                                        <FormItem className="ssh-username">
                                                            <span>{intl.get("creatChain_creat_SSH_password")}</span>
                                                        </FormItem>
                                                        <FormItem className="test-peer-item">
                                                            <span>{intl.get("creatChain_creat_check_result")}</span>
                                                        </FormItem>
                                                    </ul>
                                                    {
                                                        item.peerInner && item.peerInner.map((peerItem,k)=> {
                                                            return (<ul key={k+"-"+i} id={peerItem.ip} className="ul-item" style={{marginBottom:"15px"}}>
                                                                <FormItem className="peer-name">
                                                                    {getFieldDecorator(`peerOrgs_${i+1}_peers_${k+1}_name`, {
                                                                        rules: [
                                                                            {
                                                                                required: true,
                                                                                message: intl.get("creatChain_enter_name"),
                                                                            },
                                                                            {
                                                                                whitespace: true,
                                                                                message: intl.get("creatChain_enter_name"),
                                                                            },
                                                                        ],
                                                                    })(
                                                                        <Input onBlur={()=>{this.PeerInnercheckFn([`peerOrgs_${i+1}_peers_${k+1}_ip`,`peerOrgs_${i+1}_peers_${k+1}_sshUsername`,`peerOrgs_${i+1}_peers_${k+1}_sshPassword`,`peerOrgs_${i+1}_peers_${k+1}_name`],k,i)}} className="input-mid"/>
                                                                    )}
                                                                </FormItem>
                                                                <FormItem className="peer-ip">
                                                                    {getFieldDecorator(`peerOrgs_${i+1}_peers_${k+1}_ip`, {
                                                                        rules: [{ validator: this.checkIpInput }],
                                                                    })(
                                                                        <IpInput onBlur={()=>{this.PeerInnercheckFn([`peerOrgs_${i+1}_peers_${k+1}_ip`,`peerOrgs_${i+1}_peers_${k+1}_sshUsername`,`peerOrgs_${i+1}_peers_${k+1}_sshPassword`,`peerOrgs_${i+1}_peers_${k+1}_name`],k,i)}} onChange={()=>{this.changePeerCheckFn(item,peerItem)}}/>
                                                                    )}
                                                                </FormItem>
                                                                <FormItem className="ssh-username">
                                                                    {getFieldDecorator(`peerOrgs_${i+1}_peers_${k+1}_sshUsername`,{
                                                                        rules: [{
                                                                            required: true,
                                                                            message: intl.get("creatChain_enter_ssh_username_name"),
                                                                        },],
                                                                    })(
                                                                        <div>
                                                                            <Input onBlur={()=>{this.PeerInnercheckFn([`peerOrgs_${i+1}_peers_${k+1}_ip`,`peerOrgs_${i+1}_peers_${k+1}_sshUsername`,`peerOrgs_${i+1}_peers_${k+1}_sshPassword`,`peerOrgs_${i+1}_peers_${k+1}_name`],k,i)}} onChange={()=>{this.changePeerCheckFn(item,peerItem)}} className="input-len"/>
                                                                        </div>
                                                                    )}
                                                                </FormItem>
                                                                <FormItem className="ssh-username">
                                                                    {getFieldDecorator(`peerOrgs_${i+1}_peers_${k+1}_sshPassword`,{
                                                                        rules: [{
                                                                            required: true,
                                                                            message: intl.get("creatChain_enter_ssh_username_pass"),
                                                                        },],
                                                                    })(
                                                                        <div>
                                                                            <Input type="password"  onBlur={()=>{this.PeerInnercheckFn([`peerOrgs_${i+1}_peers_${k+1}_ip`,`peerOrgs_${i+1}_peers_${k+1}_sshUsername`,`peerOrgs_${i+1}_peers_${k+1}_sshPassword`,`peerOrgs_${i+1}_peers_${k+1}_name`],k,i)}} onChange={()=>{this.changePeerCheckFn(item,peerItem)}} className="input-len"/>
                                                                        </div>
                                                                    )}
                                                                </FormItem>
                                                                <FormItem className="test-peer-item">
                                                                    <span  className={peerItem.checkStatus === "init" ? ( getFieldValue(`peerOrgs_${i+1}_peers_${k+1}_name`) && getFieldValue(`peerOrgs_${i+1}_peers_${k+1}_ip`) && getFieldValue(`peerOrgs_${i+1}_peers_${k+1}_sshUsername`) && getFieldValue(`peerOrgs_${i+1}_peers_${k+1}_sshPassword`) ? "test-peer test-peer-init" : "test-peer test-peer-default" ) : peerItem.checkStatus === "error" ? "test-peer test-peer-error" :peerItem.checkStatus === "success" ? "test-peer test-peer-success" : peerItem.checkStatus === "ing" ? "test-peer test-peer-init" : ""} >{peerItem.checkStatus === "init" ? intl.get("creatChain_creat_check_Detect") : peerItem.checkStatus === "error" ? intl.get("creatChain_creat_check_Detect_fail") :peerItem.checkStatus === "success" ? intl.get("creatChain_creat_check_Detect_success") : peerItem.checkStatus === "ing" ? intl.get("creatChain_creat_peer_detection") : "" }</span>
                                                                </FormItem>
                                                                {
                                                                    k && k > 0 ? <span className="add-close"><Icon onClick={()=>{this.deletePeer(k,i)}} style={{color:"#bec3c8",cursor:"pointer"}} type="close-circle" /></span> : ""
                                                                }
                                                            </ul>)

                                                        })
                                                    }
                                                    <p className="add-order-tip"><span onClick={()=>{this.addPeerFn(i)}} className="add-order-btn">{intl.get("creatChain_creat_node_peer")}</span>({intl.get("creatChain_creat_add_up")})</p>
                                                </div>
                                            )
                                        })
                                    }
                                    <p className="tip-peer">{intl.get("creatChain_creat_ip_enter_tip")}</p>
                                    <Button onClick={()=>{this.addPeerGroupFn()}} className="add-peer-btn" type="dashed">{intl.get("creatChain_creat_new_peer")}</Button>  <span style={{fontSize:"12px",color:"#7f8fa4"}}>({intl.get("creatChain_creat_add_up")})</span>
                                </div>
                            )}
                        </FormItem>
                        <Col xxl={{span:18,offset:3}} xl={{span:18,offset:3}} lg={{span:20,offset:2}} md={{span:18,offset:3}} sm={{span:20,offset:2}} >
                            <Divider style={{margin:"0 0 25px 0"}} />
                        </Col>
                        <FormItem label={intl.get("creatChain_creat_new_channel")} {...formItemLayoutTable} style={{ marginBottom: "23.5px" }}>
                            <div>
                                {
                                    channelInner && channelInner.map((item,i)=> {
                                        return (
                                            <div key={i} className="fabric-kafka-tab"
                                                 style={{background: "rgba(242, 242, 242, 0.7)"}}>
                                                <FormItem label={intl.get("service_modal_detail_name")} {...formItemLayoutChannel}>
                                                    {getFieldDecorator('channel_name',{
                                                        rules: [{
                                                            required: true,
                                                            pattern:/^[a-z][a-z0-9.-]*$/,
                                                            message: intl.get("creatChain_enter_channel_name"),
                                                        },],
                                                    })(
                                                        <Input style={{ width: 135 }} className="input-len"/>
                                                    )}
                                                </FormItem>
                                                <div className="channel-peers-part">
                                                    <Col className="channel-peers-label" xs={{span:24}} sm={{span:6}} md={{span:6}} lg={{span:6}} xl={{span:5}} xxl={{span:5}}>{intl.get("creatChain_Choose_Peer_Organization")}</Col>
                                                    <div className="channel-peers">

                                                        <ul className="channel-item-list">

                                                            {/*<Select style={{ width: 135 }}>*/}
                                                                {/*{*/}
                                                                    {/*channelPeerNameList && channelPeerNameList.length && channelPeerNameList.map((channelPeerNameItem,index)=>{*/}
                                                                        {/*return(*/}
                                                                            {/*<Option key={channelPeerNameItem.name + channelPeerNameItem.index} value={channelPeerNameItem.name}>{channelPeerNameItem.name}</Option>*/}
                                                                        {/*)*/}

                                                                    {/*})*/}
                                                                {/*}*/}
                                                            {/*</Select>*/}
                                                        {
                                                            channelPeerNameList && channelPeerNameList.length ? channelPeerNameList.map((channelPeerNameItem,index)=>{
                                                                return(
                                                                    <li className={channelPeerNameItem.status ? "channel-item-actived" : "channel-item-init"} onClick={()=>{this.selectChannelFn(channelPeerNameItem,index)}} key={channelPeerNameItem.name + channelPeerNameItem.index}>{channelPeerNameItem.name}</li>
                                                                )

                                                            }) : ""
                                                        }
                                                        </ul>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                                {/*<Button onClick={()=>{this.addChannelFn()}} className="add-peer-btn" type="dashed">新建通道</Button>*/}
                            </div>
                        </FormItem>
                        <FormItem
                        >
                            <Row type='flex' justify='start' align='middle' className="ethereumbtnMiddle">
                                <Col span={2} xs={{offset:4}} sm={{offset:6}} md={{offset:6}} lg={{offset:5}} xl={{offset:5}} xxl={{offset:6}}><Button size="large" style={{ width: "100%" }} className="completedBthZigPrev" disabled={this.state.enterpriseLoading} onClick={() => { this.fabricPrevClickFn() }} >{intl.get("service_back")}</Button></Col>
                                <Col span={2} offset={1}><Button style={{ width: "100%" }} size="large" type="primary" htmlType="submit" loading={this.state.enterpriseLoading}>{intl.get("service_finish")}</Button></Col>
                            </Row>
                        </FormItem>
                    </Form>
                </div>

            </div>
        );
    }
}
FabricSetConfModal = Form.create()(FabricSetConfModal)
IpInput = Form.create()(IpInput)
export default FabricSetConfModal;
