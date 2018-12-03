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
            login : `${newAPI}/user/login`,
            resetPassword: `${newAPI}/user/password/reset`,
            logout: `${newAPI}/user/logout`
        },
        channel: `${newAPI}/channel`,
        channelJoin: `${newAPI}/channel/join`,
        chain: {
            chainList: `${newAPI}/consortium`,
            container:`${newAPI}/container`
        },
        peer:{
            peerList:`${newAPI}/peer`,
            peerDetail:`${newAPI}/peer?organizationId={id}`
        },
        organization:{
            orgList:`${newAPI}/organization`,
            createOrg:`${newAPI}/channel/update`
        },
        organize: {
            organization: `${newAPI}/organization`
        },
        consortium: {
            overview: `${newAPI}/consortium/{consortiumId}`

        }
    },
}
