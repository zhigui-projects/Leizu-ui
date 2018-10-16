import React, { Component } from 'react';
import { Button } from 'antd';
import { injectIntl } from 'react-intl';
import './lost.less'

class Lost extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {
        const intlData=this.props.intl.messages;
        return  (  
            <div className='lost-box'>
                <div className="big-box clearfix">
                    <div className="img-box">
                        <img src={require('../../../../../../images/dashboard/browser/404.png')} alt=""/>
                    </div>
                    <div className="text-box">
                        <p className="text-title">{intlData.dashboard_lost_404}</p>
                        <p className="text-desc">{intlData.dashboard_lost_404_content}</p>
                        <Button onClick={()=>{this.props.history.push('/index')}} className='lost-index-btn'>{intlData.dashboard_lost_404_back_btn}</Button>
                    </div>
                </div>
            </div>
        )
    }
}
 
export default injectIntl(Lost);