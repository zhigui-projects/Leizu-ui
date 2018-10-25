// const API = 'http://59.110.164.211:7066/api/v1';
const API = 'http://192.168.2.6:8081/api/v1';
const elasticSearchUrl = "https://staging-elk.baas.ziggurat.cn/"
const format = require('string-format');
format.extend(String.prototype);

module.exports = {
    API,
    elasticSearchUrl,
    api: {
        user: {
            login : `${API}/user/login`,
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
            overview: `${API}/consortium/{consortiumId}`

        }
    },
}
