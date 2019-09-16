import React from 'react';
import { connect } from 'dva';
import Page from '../../common/Page';
import PageConfig from '../../common/PageConfig';
import { Message } from 'antd';
class ZoneDetail extends Page {
	constructor(props) {
		super(props, {
			detailId: '',
		});
	}
	pageId = '3'; // 图库页对应名称
	pageName = PageConfig[this.pageId]; // 图库页对应名称
	onReady() {
		this.setState({
			detailId: this.getDetailId(),
		});
	}
	// 获取名家详情页id
	getDetailId() {
		if (!this.query.detailId) {
			Message.error('缺少空间ID参数，无法获取详情！');
			return this.props.history.length > 2
				? this.props.history.go(-1)
				: this.props.history.push('/zone');
		}
		return this.query.detailId;
	}

	renderBody() {
		const { detailId } = this.state;
		return <div>{detailId}</div>;
	}

	selectTags(ids) {
		this.setState({
			loading: false,
			empty: false,
		});
	}
}

const detailsProps = ({ menus }) => ({ menus });

export default connect(detailsProps)(ZoneDetail);
