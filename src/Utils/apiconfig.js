const API = 'http://39.106.198.16:8080/api/v1';
const newAPI = sessionStorage.getItem('ConsortiumInfo') ? JSON.parse(sessionStorage.getItem('ConsortiumInfo'))["url"]+"/api/v1" : "";
console.log(newAPI)
// 192.168.2.38:8080
const elasticSearchUrl = "http://47.106.121.33/query"
const format = require('string-format');
format.extend(String.prototype);

module.exports = {
    API,
    elasticSearchUrl,
    api: {
        user: {
            login : `/user/login`,
            resetPassword: `/user/password/reset`,
            logout: `/user/logout`
        },
        channel: `/channel/{id}`,
        creatChannel:`/channel`,
        channelJoin: `/channel/join`,
        chain: {
            chainList: `/consortium`,
            container:`/container`
        },
        peer:{
            peerList:`/peer/{id}`,
            peerDetail:`/peer/{id}/{peerId}`,
            creatPeer:`/peer`
        },
        organization:{
            orgList:`/organization/{id}?type=0`,
            createOrg:`/channel/update`,
            peerCheck:`/peer/check`,
            creatOrg:`/organization`
        },
        organize: {
            organization: `/organization/{id}`
        },
        consortium: {
            overview: `/consortium/{consortiumId}`

        }
    },
    newAPI:""
}
