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
import { Tabs, Anchor, Tag, Skeleton, Affix } from 'antd';
import './SecomdayClassfiy.less';
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
export default class SecondayClassfiy extends Component {
	static defaultProps = {
		tabChange: (item, index) => {}, //tab改变
	};
	constructor(props) {
		super(props);
		const {
			tabs = [], // tabs
			onChange = () => {}, // 点击tab 发生改变时
			nextActiveKey = '', //
			selectedTags,
			activeKey, // 初始选中的tabKey
			mouseEnterTab = (e) => {}, // 鼠标移入tab事件
			selectOptions = (e) => {}, // 选中子选项
			hideCate = false,
		} = props;

		this.state = {
			selectedTags,
			tabs,
			nextActiveKey,
			hidePop: hideCate,
			activeKey,
		};
		this.onChange = onChange; //
		this.mouseEnterTab = mouseEnterTab;
		this.selectOptions = selectOptions;
		this.skeletonLoding = false;
	}

	render() {
		const {
			tabs,
			activeKey,
			nextActiveKey,
			hidePop,
			// selectedTags,
		} = this.state;
		const { selectedTags, hideCate } = this.props;
		const currentKey = nextActiveKey || activeKey;
		if (!tabs.length) return null;
		return (
			<>
				<Affix className="yy-tabs-wrapper">
					<Tabs
						tabBarGutter={0}
						// animated={false}
						activeKey={currentKey}
						onChange={(index) => {
							this.onChange(index);
						}}
						className="menuTabs">
						{tabs.map((item, tabIndex) => (
							<TabPane
								tab={
									<div
										className="yy-tabs-tab"
										onMouseEnter={() => {
											this.mouseEnterTab(item, tabIndex);
											// if (item.sub === '0') return;
											// if (tabIndex != currentKey) return;
											// this.setState({
											// 	hidePop: false,
											// });
										}}
										onClick={() =>
											this.tabClick(item, tabIndex)
										}>
										{item.name}
									</div>
								}
								key={tabIndex}>
								<Reclassifys
									source={item.categories}
									loading={item.sub * 1}
									hidden={item.sub === '0' || hideCate}
									// onMouseLeave={() => {
									// 	this.setState({
									// 		hidePop: true,
									// 	});
									// }}
									selectedTags={selectedTags[tabIndex]}
									renderItem={(item, idx) => (
										<ReclassifysItem
											ref="ReclassifysItem"
											item={item}
											key={idx}
											selectedTags={
												selectedTags[tabIndex]
											}
											tagChange={(
												checked,
												tags,
												tagindex,
											) => {
												//
												this.props.selectOptions(
													item,
													tabIndex,
													tags,
												);
												console.log(checked, item, idx);
											}}
										/>
									)}
								/>
							</TabPane>
						))}
					</Tabs>
				</Affix>
				<div
					className="cateBoxMask"
					onClick={(e) => this.mouseLeave()}
					hidden={hidePop}
				/>
			</>
		);
	}

	nextCate(key) {
		this.setState({
			nextActiveKey: key + '',
			hidePop: false,
		});
	}

	tabClick(item, index) {
		console.log(this.state.hidePop);
		this.setState({
			activeKey: index + '',
			hidePop: false,
		});
		this.props.tabChange(item, index);
	}

	mouseLeave() {
		this.setState({
			hidePop: true,
		});
	}
}

export class Reclassifys extends Component {
	render() {
		const { source, renderItem = () => {}, hidden } = this.props;
		return (
			<div
				className={`categoriesBox ${hidden ? ' hideBox' : ''}`}
				// hidden={hidden}
				{...this.props.__proto__}>
				{source ? source.map(renderItem) : this.renderSkeleton()}
			</div>
		);
	}

	renderSkeleton() {
		const { loading } = this.props;
		if (!loading) return null;
		return (
			<Skeleton
				active={true}
				loading={true}
				paragraph={{
					rows: loading - 1,
				}}
			/>
		);
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
			<div className="categories">
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
								tagChange(checked, tag, index);
							}}>
							{tag.name}
						</CheckableTag>
					))}
			</div>
		);
	}
}
