const API = 'http://59.110.164.211:7066/api/v1';
const elasticSearchUrl = "http://47.94.224.229/query"
const format = require('string-format');
format.extend(String.prototype);

module.exports = {
    API,
    elasticSearchUrl,
    api: {
        user: {
            login : `${API}/user/login`,
            resetPassword: `${API}/user/password/reset`
        },
        channel: `${API}/channel`,
        chain: {
            chainList: `${API}/consortium`
        },
        peer:{
            peerList:`${API}/peer`,
            peerDetail:`${API}/peer?organization%20id={id}`
        },
        organization:{
            orgList:`${API}/organization`
        },
        organize: {
            organization: `${API}/organization`
        },
        consortium: {
            overview: `${API}/consortium`
        }
    },
}
