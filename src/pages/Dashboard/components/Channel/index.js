import React , {Component} from 'react';
import request from '../../../../Utils/Axios'
import apiconfig from '../../../../Utils/apiconfig'

const {api:{channel}} = apiconfig;

class Channel extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    componentDidMount(){
        request().get(channel).then(res=>{
            console.log(res)
        })
    }
    render(){
        return(
            <div>channel</div>
        )
    }
}
export default Channel;