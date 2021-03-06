import React from 'react';
import logo from 'images/logo.png';
import { Carousel } from 'antd';
import './banner.less';

export default class HomeBanner extends React.Component {
	render() {
		return (
			<Carousel autoplay className="homeBanner">
				<div>
					<img src={logo} alt="" />
				</div>
				<div>
					<h3>2</h3>
				</div>
				<div>
					<h3>3</h3>
				</div>
				<div>
					<h3>4</h3>
				</div>
			</Carousel>
		);
	}
}
