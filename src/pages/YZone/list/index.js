import React, { Component } from 'react';
import { Card, Spin, Empty } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import api, { RootBase } from '../../../services/api';
import TopMenus from '../../../layout/page/index';
import { joinUrlEncoded } from '../../../utils';
import { get } from '../../../utils/request';

import '../yzone.less';

export default class ZoneList extends Component {
	state = {
		loading: true,
		hasMore: false,
		specialTitle: false,
	};
	pageName = 'zone';
	lastRenderIds = [];
	next = 0;

	render() {
		const { source, hasMore, specialTitle, empty } = this.state;
		return (
			<>
				<TopMenus
					pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
					showBreadcrumb={true}
					loading={this.state.loading}>
					<div className='yyZone'>
						<InfiniteScroll
							initialLoad={false}
							pageStart={this.next}
							loadMore={() => {
								this.loadMore();
							}}
							hasMore={hasMore}
							loader={<Spin key='loader' />}>
							<Special
								source={source}
								title={
									specialTitle ? (
										<div className='pageTitle'>
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
				</TopMenus>
				{empty ? (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={empty === true ? '暂无数据' : empty}
					/>
				) : null}
			</>
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

	cateIdsLoad = ({ selectIds }) => {
		this.lastRenderIds = selectIds;
		this.loadZone(selectIds, 0);
	};

	async loadZone(tagsId, start = this.next) {
		this.setState({
			loading: true,
			empty: false,
			specialTitle: tagsId.indexOf('16') > -1,
		});
		const res = await get(api.zone.list, {
			ids: tagsId,
			start,
		});
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
		this.loadZone(this.lastRenderIds, this.next);
	}

	goDetailPage(item) {
		const params = this.props.location.search || '';
		const detailPath = joinUrlEncoded('/zone/detail' + params, {
			detailId: item.id,
			name: item.title,
		});
		// let { breadcrumb } = this.state;
		// breadcrumb.push({
		// 	path: detailPath,
		// });
		// this.setState({
		// 	breadcrumb,
		// });
		this.props.history.push(detailPath);

		// urlEncoded
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
}

function Special(props) {
	const { title = null } = props;
	return (
		<div className='specialPage'>
			{title}
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
			<div className='zoneItemContainer'>
				{source.map((item, index) => (
					<Card
						key={index}
						className='zoneItem'
						onClick={() => {
							this.props.onClick(item, index);
						}}
						title={
							<h3 className='zoneItemTitle'>
								{item.title}
								<span> {item.desc}</span>
							</h3>
						}
						bordered={false}>
						<img src={RootBase +'/'+ item.img} alt='' />
					</Card>
				))}
			</div>
		);
	}
}
