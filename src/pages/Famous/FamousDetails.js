import React, { Component } from 'react';
import { connect } from 'dva';
import sessionData from '../../utils/sessionData';
@connect()
class FamouseDetails extends Component {
	constructor(props) {
		super(props);

		this.detailId = this.getDetailId();
		// console.log('FamouseDetails', props);
	}

	// 获取名家详情页id
	getDetailId() {
		const { state = {} } = this.props.location,
			detailId = state.detailId || sessionData.get('detailId');

		if (!detailId) {
			// 未获取到详情id
			return this.props.history.push({
				pathname: '/famous',
			});
		}
		return detailId;
	}

	render() {
		return <div>FamouseDetails</div>;
	}
}

export default connect(({ global }) => ({ ...global }))(FamouseDetails);
