/**
 * 二级分类组件 SecondayClassfiy
 *
 * event
 *
 *  鼠标移动到tab时   参数
 *
 *  mouseEnterTab   call(item, index) // 加载三级分类
 * 	onChange call (index) 切换tab
 * 点击tab时
 *
 * 选取自选项时
 *
 *
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'dva';
import { Tabs, Tag, Skeleton, Affix, Breadcrumb } from 'antd';
import { queryString, joinUrlEncoded } from '../../utils';
import './SecomdayClassfiy.less';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;

@connect(({ menus }) => ({ menus }))
class SecondayClassfiy extends Component {
	static defaultProps = {
		cateIdsLoad: () => {},
		tabChange: () => {},
	};
	state = {
		breadcrumb: [],
	};
	render() {
		const { menus, pageName } = this.props;
		const { secondaryMenu = {}, selectedTags } = menus || {};
		const tabs = secondaryMenu[pageName] || [];
		if (!tabs.length) return null;
		return (
			<>
				<Affix className='yy-tabs-wrapper'>
					<YYTabs
						{...this.props}
						tabs={secondaryMenu[pageName]}
						selectedTags={selectedTags}
						changeHandle={this.changeHandle}
					/>
				</Affix>
			</>
		);
	}

	changeHandle = ({ selectIds, track, tabIndex }) => {
		console.log(selectIds);
		this.props.cateIdsLoad({
			selectIds,
			breadcrumb: this.getBreadcrumb(tabIndex),
			tabIndex,
		});
	};

	getBreadcrumb(tabIndex) {
		const { location, pageName, menus } = this.props;
		const { topCategory = [], secondaryMenu } = menus || {};
		const tabs = secondaryMenu[pageName] || [];
		// 一级菜单
		let breadcrumb = topCategory.filter(
			(item) => location.pathname.indexOf(item.path) > -1,
		);

		// 二级菜单
		let temptabs = tabs[tabIndex];
		temptabs.path = location.pathname + location.search;
		breadcrumb.push(temptabs);

		breadcrumb.unshift({
			name: '首页',
			path: '/home',
		});

		return breadcrumb;
	}
}

class YYTabs extends Component {
	static defaultProps = {
		changeHandle: () => {},
	};
	urlParams = this.getUrlParams();
	currentActived = this.urlParams.cateIndex || '0';
	state = {
		activeKey: this.currentActived,
		showCate: true,
	};

	render() {
		const { tabs } = this.props;
		const { activeKey, showCate } = this.state;
		return (
			<>
				<Tabs
					tabBarGutter={0}
					// animated={false}
					activeKey={activeKey}
					className='menuTabs'>
					{tabs.map((item, tabIndex) => {
						return (
							<TabPane
								tab={
									<div
										className='yy-tabs-tab'
										onClick={() =>
											this.tabClick(item, tabIndex)
										}
										onMouseEnter={() => {
											tabIndex * 1 ===
												this.state.activeKey * 1 &&
												this.toggleCate(true);
										}}>
										{item.name}
									</div>
								}
								key={tabIndex}>
								{this.renderReClass(item, tabIndex)}
							</TabPane>
						);
					})}
				</Tabs>
				<div
					className='cateBoxMask'
					onClick={() => this.toggleCate(false)}
					hidden={showCate}
				/>
			</>
		);
	}
	mounted = false;
	componentDidMount() {
		let { activeKey = '0' } = this.state;
		const { tabs } = this.props;

		if (!tabs[activeKey]) {
			activeKey = '0';
			this.setState({
				activeKey,
			});
			this.currentActived = activeKey;
		}
		this.getCategory(tabs[activeKey], activeKey);
	}

	renderReClass(item, index) {
		const { selectedTags } = this.props;

		if (item.sub * 1 === 0) return null;

		return (
			<div
				className={`categoriesBox ${
					this.state.showCate ? '' : 'hideBox'
				}`}
				onMouseLeave={() => {
					this.toggleCate(false);
				}}>
				<Skeleton
					loading={!item.categories}
					paragraph={{
						rows: item.sub * 1 - 1,
					}}>
					{item.categories &&
						item.categories.map((cates, idx) => (
							<ReclassifysItem
								ref='ReclassifysItem'
								item={cates}
								key={idx}
								selectedTags={selectedTags[index]}
								tagChange={(tags, checked, tagindex) => {
									//
									this.tagChange(cates, tags, index);
								}}
							/>
						))}
				</Skeleton>
			</div>
		);
	}

	toggleCate = (bool) => {
		this.setState({
			showCate: !!bool,
		});
	};

	getCategory(item, index) {
		if (item.sub * 1 > 0 && !item.categories) {
			this.props.dispatch({
				type: 'menus/getCategory',
				payload: {
					item,
					index,
					pageName: this.props.pageName,
					selectedTag: this.urlParams.cateIds.split(','),
				},
				callback: async (selectedTags, activeKey) => {
					if (this.currentActived !== activeKey) return;
					this.replaceState(selectedTags, activeKey);
					if (!this.mounted) {
						await this.sleep(500);
						this.setState({
							showCate: false,
						});
						this.mounted = true;
					}
				},
			});
		} else {
			const { selectedTags } = this.props.menus;
			let ids = selectedTags[index];
			if (!ids) ids = [item.id];

			this.replaceState(ids, index);
		}
	}

	sleep(time) {
		return new Promise(function(resolve, reject) {
			setTimeout(() => {
				resolve();
			}, time);
		});
	}

	replaceState(selectedTags, activeKey) {
		if (!selectedTags || !selectedTags.length) return;
		const pathName = this.props.location.pathname;
		// 保留原有参数更新地址栏
		let params = {
			...queryString(this.props.location.search),
			cid: selectedTags,
			c: activeKey,
		};
		const path = joinUrlEncoded('#' + pathName, params);
		this.props.changeHandle({
			selectIds: selectedTags,
			tabIndex: activeKey,
			track: [],
		});
		window.history.replaceState({}, 0, path);
	}
	tabClick(item, index) {
		this.setState({
			activeKey: index + '',
			showCate: true,
		});
		this.currentActived = index;
		this.props.tabChange(item, index);
		this.getCategory(item, index);
	}

	tagChange = async (tabItem, tags, tabIndex) => {
		let { selectedTags } = this.props.menus;
		let nextSeleted = selectedTags[tabIndex];
		tabItem.data.forEach((i) => {
			nextSeleted = nextSeleted.filter((t) => t !== i.id); // 删除单行数据中的所有tagid
		});
		if (tags.id) nextSeleted = [...nextSeleted, tags.id];
		selectedTags[tabIndex] = nextSeleted;
		this.replaceState(selectedTags[tabIndex], tabIndex);
		this.props.dispatch({
			type: 'menus/save',
			payload: {
				selectedTags,
			},
		});
	};
	getUrlParams() {
		const params = new URLSearchParams(this.props.location.search);
		return {
			cateIndex: params.get('c') || 0,
			cateIds: params.get('cid') || '',
		};
	}
}
export class ReclassifysItem extends Component {
	static defaultProps = {
		item: {},
		selectedTags: [],
		tagChange: () => {},
	};

	render() {
		const { item, selectedTags, tagChange } = this.props;
		return (
			<div className='categories'>
				<h4
					style={{
						marginRight: 8,
						display: 'inline',
					}}>
					{item.name}:
				</h4>
				{item.data &&
					item.data.map((tag, index) => (
						<CheckableTag
							key={tag.id}
							checked={selectedTags.indexOf(tag.id) > -1}
							onChange={(checked) => {
								tagChange(tag, checked, index);
							}}>
							{tag.name}
						</CheckableTag>
					))}
			</div>
		);
	}
}

export default withRouter(SecondayClassfiy);
