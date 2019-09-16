import React, { Component } from 'react';
import { connect } from 'dva';
import InfiniteScroll from 'react-infinite-scroller';
import Page from '../../common/Page';
import PageConfig from '../../common/PageConfig';
import { Typography, Card, Spin, Message } from 'antd';
import api, { RootBase } from '../../../services/api';
import { get } from '../../../utils/request';
import '../yzone.less';

const { Title } = Typography;
@connect()
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
							console.log(item, index);
							this.loadDetails(item, index);
						}}
					/>
				</InfiniteScroll>
			</div>
		);
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
		this.initState();
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

			const source = data.map((item) => {
				return {
					title: item.sname,
					desc: item.sname1,
					img: item.cover,
					id: item.sid,
				};
			});

			this.setState({ source, loading: false, empty: false });
		}
	}

	loadMore() {
		const { selectedTags, activeKey } = this.state;
		this.loadZone(selectedTags[activeKey], this.next);
	}

	loadDetails(item) {}
}

function Special(props) {
	const { titile = null } = props;
	return (
		<div className="specialPage">
			{props.title}
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
						<img src={RootBase + item.img} />
					</Card>
				))}
			</div>
		);
	}
}

export default connect((params) => ({ ...params }))(YZoneList);
