/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
const API = process.env.REACT_APP_API || '';
const elasticSearchUrl = process.env.REACT_APP_ELK_URL || '';
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
            createOrg:`${API}/channel/update`,
            peerCheck:`${API}/peer/check`
        },
        organize: {
            organization: `${API}/organization`
        },
        consortium: {
            overview: `${API}/consortium/{consortiumId}`

        }
    },
}
