import React, { Component } from 'react';
import { connect } from 'dva';
import { Message, Card } from 'antd';
import Page from '../../common/Page';
import PageConfig from '../../common/PageConfig';
import './zoneDetail.less';
const { Meta } = Card;

class ZoneDetail extends Page {
	constructor(props) {
		super(props, {
			bodyClass: 'bodyClass',
		});
		this.detailId = this.query.detailId;
	}
	pageId = '3'; // 图库页对应名称
	pageName = PageConfig[this.pageId]; // 图库页对应名称
	pagePath = '/zone/list';
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
		return <div className="zoneDetails"></div>;
	}

	selectTags(ids) {
		if (this.query.cateId === ids.toString()) {
			const { pathname, search } = this.props.location;
			const breadcrumb = this.pushTrack({
				name: this.query.name,
				path: pathname + search,
			});
			this.setState({
				loading: false,
				empty: false,
				breadcrumb,
			});
		} else {
			this.props.history.push(this.pagePath + this.getPath());
		}
	}
}

const detailsProps = ({ menus }) => ({ menus });

export default connect(detailsProps)(ZoneDetail);

class detailsList extends Component {
	static defaultProps = {
		backList: () => {}, // 返回列表
		addCollect: () => {}, // 添加收藏
	};

	render() {
		return (
			<Card
				// key={index}
				className="famousItem"
				bordered={false}
				hoverable={true}
				onClick={() => {
					alert(1);
				}}
				cover={
					<div className="imgBox">
						<img alt="example" src={'item.img'} />
					</div>
				}>
				<Meta description={'123'} />
			</Card>
		);
	}
}
