import React from 'react';
import {inject, observer} from 'mobx-react';
import Nav from './common/Nav';
@inject("userInfo")
@observer
export default class Home extends React.Component {	 

	render() {
		return (
			<div className="container">
                <Nav history={this.props.history}/>
        		<div className="inner">
                    <h1 className="public_title">
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-xiaogantanhao"></use>
                        </svg>
                        This is icon!{this.props.userInfo.time}
                        <img src={require('../static/images/poster-1.jpg')} alt=""/>
                    </h1>
				</div>
      		</div>
		);
	}
}