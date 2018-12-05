/*
Copyright Zhigui.com. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './Router/App';
import 'antd/dist/antd.css';
import './styles/reset.less'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
