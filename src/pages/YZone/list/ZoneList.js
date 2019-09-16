import React, { Component } from 'react';
import { connect } from 'dva';
import InfiniteScroll from 'react-infinite-scroller';
import Page from '../../common/Page';
import PageConfig from '../../common/PageConfig';
import { Card, Spin } from 'antd';
import api, { RootBase } from '../../../services/api';
import { get } from '../../../utils/request';
import '../yzone.less';
import { joinUrlEncoded } from '../../../utils';

class YZoneList extends Page {
	constructor(props) {
		super(props, {
			source: [],
			hasMore: false,
		});
	}
	pageId = '3'; // 图库页对应名称
	pageName = PageConfig[this.pageId]; // 图库页对应名称

	lastRenderIds = '';

	renderBody() {
		const { selectedTags = [], activeKey, source, hasMore } = this.state;
		const specialTitle = selectedTags[activeKey].indexOf('16') > -1;
		return (
			<div className="yyZone">
				<InfiniteScroll
					initialLoad={false}
					pageStart={this.next}
					loadMore={() => {
						this.loadMore();
					}}
					hasMore={hasMore}
					loader={<Spin key="loader" />}>
					<Special
						source={source}
						title={
							specialTitle ? (
								<div className="pageTitle">
									<h3>空间精选</h3>
									<h4>···· SPECIAL ····</h4>
								</div>
							) : null
						}
						onClick={(item, index) => {
							this.goDetailPage(item, index);
						}}
					/>
				</InfiniteScroll>
			</div>
		);
	}

	onReady() {
		this.initState();
	}
	initState(call = () => {}) {
		this.setState(
			{
				source: [],
				loading: true,
				empty: false,
			},
			call,
		);
	}

	selectTags(tagsId) {
		this.loadZone(tagsId);
	}

	next = 0;
	async loadZone(tagsId, start = this.next) {
		this.setState({
			loading: true,
			empty: false,
		});
		this.lastRenderIds = tagsId;
		const res = await get(api.zone.list, { ids: tagsId, start });
		this.replaceState();
		const { data, success, faildesc } = res;

		if (this.lastRenderIds.toString() === tagsId.toString()) {
			if (!success) {
				this.setState({
					source: [],
					loading: false,
					empty: faildesc,
				});
				return;
			}

			let source = data.map((item) => {
				return {
					title: item.sname,
					desc: item.sname1,
					img: item.cover,
					id: item.sid,
				};
			});

			for (let i = 0; i < 20; i++) {
				source[i] = source[0];
			}

			this.setState({ source, loading: false, empty: false }, () => {});
		}
	}

	loadMore() {
		const { selectedTags, activeKey } = this.state;
		this.loadZone(selectedTags[activeKey], this.next);
	}

	goDetailPage(item) {
		console.log(item);
		// const detailId = Math.random();
		// const params = this.props.location.search || '';
		const detailPath = joinUrlEncoded('/zone/detail' + this.getPath(), {
			detailId: item.id,
		});
		this.props.history.push(detailPath);

		// urlEncoded
	}
}

function Special(props) {
	const { titile = null } = props;
	return (
		<div className="specialPage">
			{titile}
			<ZoneItem {...props} />
		</div>
	);
}

class ZoneItem extends Component {
	static defaultProps = {
		onClick: () => {},
	};

	render() {
		const {
			source = [
				// { title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				// { title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				// { title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				// { title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				// { title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				// { title: '名家讲坛', desc: '写意花鸟专题', img: '' },
			],
		} = this.props;
		return (
			<div className="zoneItemContainer">
				{source.map((item, index) => (
					<Card
						key={index}
						className="zoneItem"
						onClick={() => {
							this.props.onClick(item, index);
						}}
						title={
							<h3 className="zoneItemTitle">
								{item.title}
								<span> {item.desc}</span>
							</h3>
						}
						bordered={false}>
						<img src={RootBase + item.img} alt="" />
					</Card>
				))}
			</div>
		);
	}
}

export default connect(({ menus }) => ({ menus }))(YZoneList);
