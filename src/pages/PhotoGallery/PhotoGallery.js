import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImgModal from '../ImgModal';
import './photoGallery.less';
import Autoresponsive from 'autoresponsive-react';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';
import { connect } from 'dva';
import { get } from '../../utils/request';

@connect()
class PhotoGallery extends Component {
	constructor(props) {
		super(props);
		const menuTabs = props.secondaryMenu['photo'] || [];
		this.state = {
			visible: false,
			scaleImgOptions: {
				bounding: true,
				offset: 80,
			},
			menuTabs,
			selectedTags: [1],
			activeKey: '0',
			nextActiveKey: '',
		};
	}

	arrayList = [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
	];

	UNSAFE_componentWillMount() {
		this.arrayList = this.arrayList.map((i) => this.getItemStyle());
		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		this.setState({
			containerWidth: ReactDOM.findDOMNode(this.refs.container)
				.clientWidth,
		});
		window.addEventListener('resize', this.resize, false);
	}
	getItemStyle() {
		return {
			width: 250,
			height: parseInt(Math.random() * 20 + 12, 10) * 10,
			// height: '200px',
			color: '#fff',
			cursor: 'pointer',
			borderRadius: 5,
			boxShadow: '0 1px 0 rgb(246, 170, 0, 0.5) inset',
			backgroundColor: '#F6AA00',
			borderColor: '#F6AA00',
			fontSize: '80px',
			lineHeight: '100px',
			textAlign: 'center',
			fontWeight: 'bold',
			textShadow: '1px 1px 0px rgb(246, 170, 0)',
			userSelect: 'none',
			// padding: '10px',
			margin: '10px',
		};
	}

	getAutoResponsiveProps() {
		const containerWidth =
			this.state.containerWidth ||
			this.props.containerWidth ||
			document.body.clientWidth;

		const cols = Math.floor((containerWidth - 261) / 270);

		// containerMargin = containerMargin < 20 ? 20 : containerMargin;
		return {
			itemMargin: 20,
			containerWidth: (cols + 1) * 270,
			itemClassName: 'item',
			transitionDuration: '.2',
			// closeAnimation:true,
			// gridWidth: containerMargin,
			transitionTimingFunction: 'easeIn',
		};
	}

	render() {
		const { menuTabs } = this.state;
		const AutoResponsiveProps = this.getAutoResponsiveProps();
		return (
			<>
				<SecondayClassfiy
					tabs={menuTabs}
					activeKey="0"
					mouseEnterTab={(item, index) =>
						this.mouseEnterTab(item, index)
					}
					onChange={(index) => {
						this.onChange(index);
					}}
					selectOptions={(item) => {
						this.selectOptions(item);
					}}
				/>
				<div className="AutoresponsiveContainer" ref="container">
					<p>全部：</p>
					<div
						style={{
							width: AutoResponsiveProps.containerWidth,
							margin: '0 auto',
						}}>
						<Autoresponsive {...AutoResponsiveProps}>
							{this.arrayList.map(function(i, index) {
								return (
									<div
										key={index}
										onClick={() => {
											this.clickItemHandle();
										}}
										style={i}
										className="item">
										{index}
									</div>
								);
							}, this)}
						</Autoresponsive>
					</div>
				</div>
				<ImgModal
					visible={this.state.visible}
					options={this.state.scaleImgOptions}
					hideModal={() => {
						this.handleImg();
					}}
				/>
			</>
		);
	}

	componentWillMount() {
		this.getCategory('2', 0); // 初始加载的数据
	}

	async getCategory(id = '2', index = 0) {
		let { menuTabs } = this.state;

		// tab 没有加载分类信息
		if (menuTabs[index] && !menuTabs[index].categories) {
			//  获取分类信息
			let categories = [];
			let selectTags = [];
			const res = await get('/?y=common&d=category', { id });
			if (res.success && res.data) {
				categories = res.data.map((item) => {
					const { id, name, sub } = item;

					if (sub && sub.length) {
						sub.unshift({ name: '全部', id: item.id }); // 默认值全部
						selectTags.push(sub[0].id);
					}

					return {
						id,
						name,
						data: sub || [],
					};
				});
			}

			menuTabs[index].categories = categories;
			menuTabs[index].selectTags = selectTags;

			this.setState({
				menuTabs,
			});
		}
	}
	mouseEnterTab(item, index) {
		this.getCategory(item.id, index);
	}

	onChange(index) {
		// let { menuTabs, categories } = this.state;
		// menuTabs[index].categories = categories;
		// this.setState({
		// 	menuTabs,
		// });
	}

	selectOptions(item) {
		console.log(item);
	}

	clickItemHandle() {
		this.handleImg(true);
	}

	handleImg(e = false) {
		this.setState({
			visible: e,
		});
	}

	resize() {
		this.setState({
			containerWidth: ReactDOM.findDOMNode(this.refs.container)
				.clientWidth,
		});
	}
	componentWillUnmount() {
		// 销毁监听事件
		window.removeEventListener('resize', this.resize);
		this.setState = (state, callback) => {
			return;
		};
	}

	componentWillReceiveProps(nextProps) {
		this.getMenutabsData(nextProps);
	}

	getMenutabsData(props) {
		const { menuTabs } = this.state;
		let tabs = props.secondaryMenu['photo'] || [];
		if (menuTabs.toString() !== tabs.toString()) {
			this.setState({
				menuTabs: tabs,
			});
		}
	}
}

export default connect(({ global }) => ({ ...global }))(PhotoGallery);
