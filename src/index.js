import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './Router/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
