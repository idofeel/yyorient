import React, { Component } from 'react';
import { connect } from 'dva';

@connect()
class ProfilePage extends Component {
	render() {
		return <div>ProfilePage</div>;
	}
}

export default connect()(ProfilePage);
