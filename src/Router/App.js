import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { LocaleProvider } from 'antd'
import Cookies from 'js-cookie'
import Dashboard from '../pages/Dashboard/basicLayout';
import Project from '../pages/Project/index'

// react-intl-universal国际化配置
import intl from "react-intl-universal";
import IntlPolyfill from "intl";
//universal国际化文件
const intl_locales = {
    "en-US": require("../locales/en_US.json"),
    "zh-CN": require("../locales/zh_CN.json"),
};

//antd国际化文件
const antd_locales = {
    zh_CN: require("antd/lib/locale-provider/zh_CN"),
    en_US: require("antd/lib/locale-provider/en_US"),
};

// For Node.js, common locales should be added in the application
global.Intl = IntlPolyfill;
require("intl/locale-data/jsonp/en.js");
require("intl/locale-data/jsonp/zh.js");


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
    componentWillMount() {
        if (!Cookies.get("lang")) {
            let lang = window.navigator.language;
            switch (lang) {
                case 'zh-CN':
                case 'zh':
                    lang = 'zh-CN';
                    break;
                default:
                    lang = 'en-US';
                    break;
            }
            Cookies.set("lang", lang, { expires: 7 });
        }
        this.loadLocales();
    }
    loadLocales = () => {
        const lang = Cookies.get("lang");
        // init method will load CLDR locale data according to currentLocale
        // react-intl-universal is singleton, so you should init it only once in your app
        const currentLocale = intl_locales[lang];
        intl
            .init({
                currentLocale: lang, // TODO: determine locale here
                locales: {
                    [lang]: currentLocale
                }
            })
            .then(() => {
                // After loading CLDR locale data, start to render
                // this.intl.lanFlag = !this.intl.lanFlag;
                //window.location.reload();
            });
    };
    render() {
        const antd_locale = Cookies.get("lang").replace("-", "_");
        const locale = antd_locales[antd_locale];
        return <div className="App">
            < LocaleProvider locale={locale}>
                <Router>
                    <Switch>
                        <Route path="/dashboard" component={Dashboard} />
                        <Route path="/project" component={Project} />
                        <Route path="/*" render={(props) => <Redirect to='/project' />} />
                    </Switch>
                </Router>
            </LocaleProvider>
        </div>
    }
}

export default App;
