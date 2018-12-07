import React from 'react';
import {Link} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import Nav from './common/Nav';
@inject("userInfo")
@observer
export default class Home extends React.Component {	 

	render() {
		return (
			<div>
                <Nav history={this.props.history}/>
        		<h1 className="public_title">
        			<svg className="icon" aria-hidden="true">
		          		<use xlinkHref="#icon-xiaogantanhao"></use>
		        	</svg> 
		        	This is icon!{this.props.userInfo.time}
		        </h1>			               
      		</div>
		);
	}
}