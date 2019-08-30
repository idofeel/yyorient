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
import { Tabs, Anchor, Tag, Skeleton } from 'antd';
import './SecomdayClassfiy.less';
const { TabPane } = Tabs;
const { CheckableTag } = Tag;

export default class SecondayClassfiy extends Component {
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
		} = props;

		this.state = {
			selectedTags,
			tabs,
			nextActiveKey,
			hidePop: true,
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
			selectedTags,
		} = this.state;
		const currentKey = nextActiveKey || activeKey;
		if (!tabs.length) return null;
		return (
			<>
				<Anchor className="yy-tabs-wrapper">
					<Tabs
						tabBarGutter={0}
						// animated={false}
						activeKey={currentKey}
						onChange={(index) => {
							this.onChange(index);
						}}
						className="menuTabs">
						{tabs.map((item, index) => (
							<TabPane
								tab={
									<div
										className="yy-tabs-tab"
										onMouseEnter={() => {
											this.nextCate(index);
											this.mouseEnterTab(item, index);
										}}
										onMouseLeave={() => {
											this.prevCate();
										}}
										onClick={() =>
											this.tabClick(item, index)
										}>
										{item.name}
									</div>
								}
								key={index}>
								{item.categories ? (
									<Reclassify
										ref={'Reclassify' + index}
										categories={item.categories || []}
										selectedTags={
											selectedTags ||
											item.selectTags ||
											[]
										}
										onSelect={(item) => this.onSelect(item)}
										mouseLeave={(selecteds) =>
											this.mouseLeave(selecteds)
										}
										getSelecteds={(selecteds) =>
											this.selectOptions(selecteds, index)
										}
										seleteReay={(select) => {
											// 组件初始化，是否是当前的tab
											const cateId = select.length
												? select
												: [item.id];
											activeKey == index
												? this.onSelect(
														cateId,
														activeKey,
												  )
												: null;
										}}
										hidden={hidePop}
									/>
								) : (
									!hidePop && this.renderSkeleton(item)
								)}
							</TabPane>
						))}
					</Tabs>
				</Anchor>
				<div
					className="cateBoxMask"
					onClick={(e) => this.mouseLeave()}
					hidden={hidePop}
				/>
			</>
		);
	}
	renderSkeleton(item) {
		if (item.sub < 1) return null;
		return (
			<Skeleton
				active={true}
				loading={true}
				paragraph={{
					rows: item.sub * 1 - 1 || 0,
				}}
			/>
		);
	}

	nextCate(key) {
		this.setState({
			nextActiveKey: key + '',
			hidePop: false,
		});
	}

	tabClick(item, index) {
		let tagId = item.sub < 1 ? [item.id] : []; // 初始为父级id
		// 当存在分类数据取分类的id
		if (item.categories && item.categories.length) {
			tagId = this.refs['Reclassify' + index].state.selectedTags;
		}
		this.onSelect(tagId); // 选中的tagid
	}

	mouseLeave(selecteds) {
		this.prevCate();
	}
	// 选择菜单选项
	onSelect(item) {
		const { nextActiveKey, activeKey } = this.state;
		if (nextActiveKey && nextActiveKey !== activeKey) {
			this.setState({
				activeKey: nextActiveKey,
				nextActiveKey: '',
				hidePop: false,
			});
		}
		this.selectOptions(item, nextActiveKey || activeKey);
	}

	prevCate() {
		const { activeKey } = this.state;
		this.setState({
			activeKey,
			nextActiveKey: '',
			hidePop: true,
		});
		// this.onChange(activeKey);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { tabs } = this.state;
		const propsTab = nextProps.tabs || [];
		if (tabs.toString() !== propsTab.toString()) {
			this.setState({
				tabs: propsTab,
			});
		}
	}
}

export class Reclassify extends Component {
	constructor(props) {
		super(props);
		const {
			categories = [], // 分类数据
			selectedTags = [], // 选中的分类
			mouseLeave = () => {}, // 鼠标移出事件
			onSelect = () => {}, // 选中分类回调的事件
			getSelecteds = () => {}, // 获取选中的分类
			hidden = false, // 是否隐藏分类
			seleteReay = () => {},
		} = props;

		// 数据状态
		this.state = {
			categories,
			selectedTags,
			hidden,
		};

		this.mouseLeave = mouseLeave; // 鼠标移出事件
		this.onSelect = onSelect; // 选中分类回调的事件
		this.getSelecteds = getSelecteds; // 获取选中的分类
		this.seleteReay = seleteReay;
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { categories, selectedTags } = this.state;
		const newdata = nextProps.categories.toString();
		if (categories.toString() !== newdata) {
			this.setState({
				categories: nextProps.categories,
			});
		}
	}

	render() {
		const { categories, selectedTags } = this.state;
		const { hidden } = this.props;
		if (categories.length < 1) return null;
		return (
			<div
				className="categoriesBox"
				onMouseLeave={() => {
					this.setState({
						hidden: true,
					});
					this.mouseLeave(selectedTags);
				}}
				hidden={hidden}>
				{categories &&
					categories.map((item, idx) => (
						<div className="categories" key={idx}>
							<h4 style={{ marginRight: 8, display: 'inline' }}>
								{item.name}:
							</h4>
							{item.data &&
								item.data.map((tag) => (
									<CheckableTag
										key={tag.id}
										checked={
											selectedTags.indexOf(tag.id) > -1
										}
										onChange={(checked) => {
											this.handleChange(
												item.data,
												tag,
												checked,
												idx,
											);
										}}>
										{tag.name}
									</CheckableTag>
								))}
						</div>
					))}
			</div>
		);
	}
	componentDidMount() {
		this.seleteReay(this.state.selectedTags);
	}
	getSelecteds() {
		return this.state.selectedTags;
	}

	handleChange(itemData = [], tag, checked, index) {
		const { selectedTags } = this.state;
		if (selectedTags.indexOf(tag.id) > -1) return; // 已存在id

		let nextSelectedTags = selectedTags;
		// 同行单选，删除一行数据中已选中的id
		itemData.forEach((i) => {
			nextSelectedTags = nextSelectedTags.filter((t) => t !== i.id); // 删除单行数据中的所有tagid
		});
		// checked ? 保存新的id : 删除当前
		nextSelectedTags = checked
			? [...nextSelectedTags, tag.id]
			: selectedTags.filter((t) => t !== tag.id);

		// 刷新数据，重新渲染
		this.setState(
			{
				selectedTags: nextSelectedTags,
				// activeKey: index + '',
			},
			() => {
				this.onSelect(this.state.selectedTags);
			},
		);
	}
}
