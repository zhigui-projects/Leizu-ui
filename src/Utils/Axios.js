/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import axios from 'axios'
import Cookies from 'js-cookie'

function getData(){
    let token = Cookies.get("token")
    var fetch = axios.create({
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': `Bearer ${token}`,
            'Content-Security-Policy': 'upgrade-insecure-requests',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'x-request-from':'BaaS'
        }
    })
    fetch.interceptors.response.use((response) => {
        // Do something with response data
        return response;
    }, (err) => {
        // console.log(err)
        const res = JSON.parse(JSON.stringify(err));
        // console.log(res)
        return res.response;
    });
    return fetch
}

export function test() {
    // let token = Cookies.get("token")
    var fetch = axios.create({
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZWNkNzcwY2ExODEzNjNlZTE0MTlhNSIsImlhdCI6MTU0MjI0ODUwNSwiZXhwIjoxNTQyMjg0NTA1fQ.mZbPk5mlMft0VG6qka3TwduO4JynldYDI-RMq_pafLQ`,
            'Content-Security-Policy': 'upgrade-insecure-requests',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'x-request-from':'BaaS'
        }
    })
    fetch.interceptors.response.use((response) => {
        // Do something with response data
        return response;
    }, (err) => {
        console.log(err)
        const res = JSON.parse(JSON.stringify(err));
        console.log(res)
        return res.response;
    });
    return fetch
}



export default getData;