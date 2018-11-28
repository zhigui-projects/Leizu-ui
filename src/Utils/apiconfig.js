const API = 'http://39.106.198.16:8080/api/v1';

// const API = "http://192.168.2.38:8080/api/v1"
const elasticSearchUrl = "http://47.94.224.229/query"
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
        channel: `${API}/channel`,
        channelJoin: `${API}/channel/join`,
        chain: {
            chainList: `${API}/consortium`,
            container:`${API}/container`
        },
        peer:{
            peerList:`${API}/peer`,
            peerDetail:`${API}/peer?organizationId={id}`
        },
        organization:{
            orgList:`${API}/organization`,
        },
        organize: {
            organization: `${API}/organization`
        },
        consortium: {
            overview: `${API}/consortium/{consortiumId}`

        }
    },
}
