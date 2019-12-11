import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ global }) => ({ global }))
class ProfilePage extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { userInfo } = this.props.global;
		return <div>ProfilePage</div>;
	}
}

export default ProfilePage;
