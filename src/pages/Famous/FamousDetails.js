import React, { Component } from 'react';
import { connect } from 'dva';
import sessionData from '../../utils/sessionData';
import Page from '../common/Page';
import { Message } from 'antd';
@connect()
class FamousDetails extends Page {
	constructor(props) {
		super(props, {});

		this.detailId = this.getDetailId();
	}

	pageId = '5'; // 图库页对应名称
	pageName = 'famous'; // 图库页对应名称

	// 获取名家详情页id
	getDetailId() {
		console.log(this.query.detailId);
		if (!this.query.detailId) {
			Message.error('缺少作家ID参数，无法获取详情！');
			return this.props.history.length > 2
				? this.props.history.go(-1)
				: this.props.history.push('/famous');
		}
	}

	renderBody() {
		return <div>FamouseDetails</div>;
	}

	selectTags(ids) {
		this.setState({ loading: false });
		if (this.state.selectedTags.toString() !== this.query.cateId) {
			this.props.history.push('/famous/list' + this.getPath(ids));
		}
	}
}

export default connect()(FamousDetails);
