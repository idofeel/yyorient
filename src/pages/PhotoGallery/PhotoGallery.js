import ReactDOM from 'react-dom';
import { connect } from 'dva';
import Autoresponsive from 'autoresponsive-react';
import ImgModal from '../ImgModal';
import { get } from '../../utils/request';
import api from '../../services/api';
import Page from '../common/Page';
import PageConfig from '../common/PageConfig';
import './photoGallery.less';

@connect()
class PhotoGallery extends Page {
	constructor(props) {
		super(props, {
			visible: false,
			scaleImgOptions: {
				bounding: true,
				offset: 80,
			},
			selectedTags: [1],
			activeKey: '0',
			nextActiveKey: '',
			picList: [],
		});
	}

	pageId = '2'; // 图库页对应id
	pageName = PageConfig[this.pageId]; // 图库页对应名称

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

	renderBody() {
		return (
			<>
				<div className="AutoresponsiveContainer" ref="container">
					{this.renderPicList()}
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

	renderPicList() {
		const AutoResponsiveProps = this.getAutoResponsiveProps();
		if (!this.state.picList.length) return null;
		return (
			<>
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
			</>
		);
	}

	onLoad() {
		this.arrayList = this.arrayList.map((i) => this.getItemStyle());
		this.resize = this.resize.bind(this);
	}

	onReady() {
		this.setState({
			containerWidth: ReactDOM.findDOMNode(this.refs.container)
				.clientWidth,
		});
		window.addEventListener('resize', this.resize, false);
	}

	// 选中的分类id 集合
	selectTags(categroyIds = []) {
		console.log('????');
		this.setPageStatus();
		if (!categroyIds.length) return;
		this.loadPicList(categroyIds);
	}

	// 加载图库列表
	async loadPicList(categroyIds = []) {
		const res = await get(api.photoGallery.list, { ids: categroyIds });
		const { picList = [1] } = res;
		this.setPageStatus({
			loading: false,
			empty: !picList.length,
		});
		this.setState({
			picList,
		});
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
		if (!this.refs.container) return;
		this.setState({
			containerWidth: ReactDOM.findDOMNode(this.refs.container)
				.clientWidth,
		});
	}
	onWillUnmount() {
		// 销毁监听事件
		window.removeEventListener('resize', this.resize);
	}
}

export default connect(({ global }) => ({ ...global }))(PhotoGallery);
