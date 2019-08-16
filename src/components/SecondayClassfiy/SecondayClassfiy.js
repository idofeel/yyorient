/**
 * 二级分类组件 SecondayClassfiy
 *
 * event
 *
 *  鼠标移动到tab时   参数
 *
 *  mouseEnterTab   call(item, index)
 *
 * 点击tab时
 *
 * 选取自选项时
 *
 *
 */

import React, { Component } from 'react';
import { Tabs, Anchor, Tag } from 'antd';
import './SecomdayClassfiy.less';
const { TabPane } = Tabs;
const { CheckableTag } = Tag;

export default class SecondayClassfiy extends Component {
	constructor(props) {
		super(props);

		const {
			tabs = [], // tabs
			onChange = () => {}, // 点击tab 发生改变时
			nextActiveKey, //
			activeKey = '0', // 初始选中的tabKey
			mouseEnterTab = (e) => {}, // 鼠标移入tab事件
			selectOptions = (e) => {}, // 选中子选项
		} = props;

		this.state = {
			tabs,
			nextActiveKey,
			hidePop: true,
			activeKey: activeKey || '0',
		};

		this.onChange = onChange;
		this.mouseEnterTab = mouseEnterTab;
		this.selectOptions = selectOptions;
	}

	render() {
		const { tabs, activeKey, nextActiveKey, hidePop } = this.state;
		return (
			<>
				<Anchor className="yy-tabs-wrapper">
					<Tabs
						tabBarGutter={0}
						// animated={false}
						activeKey={nextActiveKey || activeKey}
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
											this.mouseEnterTab(item, index);
											this.nextCate(index);
										}}
										onClick={() => {
											this.setState({
												activeKey: index + '',
											});
											this.selectOptions(
												this.refs['Reclassify' + index]
													.state.selectedTags,
											);
											this.onChange(index);
										}}>
										{item.name}
									</div>
								}
								key={index}>
								<Reclassify
									ref={'Reclassify' + index}
									categories={item.categories || []}
									selectedTags={[]}
									onSelect={(item) => this.onSelect(item)}
									mouseLeave={(selecteds) =>
										this.mouseLeave(selecteds)
									}
									getSelecteds={(selecteds) =>
										this.selectOptions(selecteds)
									}
									hidden={hidePop}
								/>
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

	nextCate(key) {
		this.setState({
			nextActiveKey: key + '',
			hidePop: false,
		});
		this.onChange(key);
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
		this.selectOptions(item);
	}

	prevCate() {
		const { activeKey } = this.state;
		this.setState({
			activeKey: activeKey,
			nextActiveKey: '',
			hidePop: true,
		});
		this.onChange(activeKey);
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
	}

	componentWillReceiveProps(nextProps) {
		const { categories } = this.state;
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
											// this.onSelect(selectedTags)
											this.handleChange(
												tag.id,
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
	getSelecteds() {
		return this.state.selectedTags;
	}

	handleChange(tag, checked, index) {
		const { selectedTags } = this.state;
		const nextSelectedTags = checked
			? [...selectedTags, tag]
			: selectedTags.filter((t) => t !== tag);
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
