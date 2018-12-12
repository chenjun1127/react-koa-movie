import React, { Component } from 'react';
import InputHOC from './InputHOC';
class Input extends Component {

	componentDidMount(){
		console.log(this)
	}

    render() {
        return ( 
        	<div>
	        	<input className = "input" type = "text" { ...this.props }/>
	        	<p>{this.props.value}</p>
        	</div>
        )
    }
}

export default InputHOC(Input);

// React高阶组件
// https://blog.hhking.cn/2018/09/28/react-high-order-components/
// 2018-09-30 17:57