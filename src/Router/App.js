import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/basicLayout';
import Project from '../pages/Project/index'
class App extends Component {
    componentDidMount() {
        window._hmt = window._hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?dcfa96faf5ee69ddda4993204aa24544";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    }
    render() {
        return <Router>
            <div className="App">
                <Switch>
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/project" component={Project} />
                    <Route path="/*" render={(props) => <Redirect to='/project' />} />
                </Switch>
            </div>
        </Router>
    }
}

export default App;
