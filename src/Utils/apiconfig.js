// const API = 'http://39.106.198.16:8080/api/v1';
// 192.168.2.38:8080
const API = process.env.REACT_APP_API || '';
const elasticSearchUrl = process.env.REACT_APP_ELK_URL || '';

// const elasticSearchUrl = "http://39.105.67.252/query"
const format = require('string-format');
format.extend(String.prototype);

module.exports = {
    API,
    elasticSearchUrl,
    api: {
        user: {
            login : `${API}/user/login`,
            resetPassword: `${API}/user/password/reset`,
            logout: `${API}/user/logout`
        },
        channel: `${API}/channel/{id}`,
        creatChannel:`${API}/channel`,
        channelJoin: `${API}/channel/join`,
        chain: {
            chainList: `${API}/consortium`,
            container:`${API}/container`
        },
        peer:{
            peerList:`${API}/peer/{id}`,
            peerDetail:`${API}/peer/{id}/{peerId}`,
            creatPeer:`${API}/peer`,
            organizationPeer:`${API}/peer/{id}?organizationId={orgId}`
        },
        organization:{
            orgList:`${API}/organization/{id}?type=0`,
            createOrg:`${API}/channel/update`,
            peerCheck:`${API}/peer/check`,
            creatOrg:`${API}/organization`
        },
        organize: {
            organization: `${API}/organization/{id}`
        },
        consortium: {
            overview: `${API}/consortium/{consortiumId}`
        },
        enterpriseChain: {
            checkPeer: `${API}/peer/check`,
            createChain:`${API}/request`,
            releaseEnterprise: `${API}/enterprise-chain/release/{id}`
        },
    },
    newAPI:""
}
