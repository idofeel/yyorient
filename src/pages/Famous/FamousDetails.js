import React, { Component } from 'react';
import { connect } from 'dva';
import sessionData from '../../utils/sessionData';
import Page from '../common/Page';
@connect()
class FamousDetails extends Page {
	constructor(props) {
		super(props, {});

		this.detailId = this.getDetailId();
		console.log('FamouseDetails', props);
	}

	pageId = '5'; // 图库页对应名称
	pageName = 'famous'; // 图库页对应名称

	// 获取名家详情页id
	getDetailId() {
		// const { state = {} } = this.props.location,
		// 	detailId = state.detailId || sessionData.get('detailId');
		// if (!detailId) {
		// 	// 未获取到详情id
		// 	return this.props.history.push({
		// 		pathname: '/famous',
		// 	});
		// }
		// return detailId;
	}

	renderBody() {
		return <div>FamouseDetails</div>;
	}

	selectTags() {
		this.setState({ loading: false });
	}
}

export default connect()(FamousDetails);
