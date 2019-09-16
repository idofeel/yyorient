import ReactDOM from 'react-dom';
import { connect } from 'dva';
import Autoresponsive from 'autoresponsive-react';
import InfiniteScroll from 'react-infinite-scroller';
import ImgModal from '../ImgModal';
import { get } from '../../utils/request';
import api, { RootBase } from '../../services/api';
import Page from '../common/Page';
import PageConfig from '../common/PageConfig';
import './photoGallery.less';
import { Spin, Card, Typography, Icon, message, Divider } from 'antd';

const { Meta } = Card;

const IconFont = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_1396747_qda951ow38.js',
});

message.config({
	duration: 1,
	maxCount: 1,
});

class PhotoGallery extends Page {
	constructor(props) {
		super(props, {
			visible: false,
			source: [],
			detailid: null,
			scaleImgOptions: {
				bounding: true,
				offset: 80,
			},
			// selectedTags: [1],
			// activeKey: '0',
			// nextActiveKey: '',
			picList: [],
			picLoading: false,
			hasMore: false, // 是否有更多
		});
		this.pageId = '2'; // 图库页对应id
		this.pageName = PageConfig[this.pageId]; // 图库页对应名称
		// console.log('PhotoGallery', props);
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
		const { source, detailid, picLoading } = this.state;
		return (
			<div className="AutoresponsiveContainer">
				<Spin spinning={picLoading} size="large">
					{this.renderPicList()}
				</Spin>
				{source.length ? (
					<ImgModal
						visible={this.state.visible}
						options={this.state.scaleImgOptions}
						dataSource={source}
						detailid={detailid}
						hideModal={() => {
							this.handleImg();
						}}
					/>
				) : null}
			</div>
		);
	}

	renderPicList() {
		const AutoResponsiveProps = this.getAutoResponsiveProps();
		const { picList, hasMore } = this.state;
		if (!picList.length) return null;
		return (
			<>
				{/* <p>全部：</p> */}
				<div
					style={{
						width: AutoResponsiveProps.containerWidth,
						margin: '0 auto',
					}}>
					<InfiniteScroll
						initialLoad={false}
						pageStart={this.next}
						loadMore={() => {
							this.loadMore();
						}}
						hasMore={hasMore}
						loader={<Spin key="loader" />}>
						<Autoresponsive {...AutoResponsiveProps}>
							{picList.map((i, index) => (
								// <div
								// 	key={index}
								// 	onClick={() => {
								// 		this.clickItemHandle(i);
								// 	}}
								// 	style={{ width: i.imgw, height: i.imgh }}
								// 	className="picitem">
								// 	<img src={RootBase + i.img} alt={i.pname} />
								// </div>
								<Card
									hoverable
									key={index}
									style={{
										width: i.imgw,
										height: i.imgh * 1 + 80,
									}}
									className="picitem"
									cover={
										<img
											src={RootBase + i.img}
											alt={i.pname}
											onClick={() => {
												this.clickItemHandle(i);
											}}
										/>
									}>
									<Meta
										title={i.pname}
										description={
											<Typography.Paragraph
												ellipsis
												alt={i.pname}>
												{this.getAuthorsName(i.authors)}
											</Typography.Paragraph>
										}
										onClick={() => {
											this.clickItemHandle(i);
										}}
									/>
									<IconFont
										type="yyorientcollect-copy"
										className={`yy-collect ${
											i.fav ? 'yy-collect-active' : ''
										}`}
										onClick={() => {
											i.fav = !i.fav;
											this.setState({
												picList,
											});
											i.fav
												? message.success('收藏成功')
												: message.info('取消收藏');
										}}
									/>
								</Card>
							))}
						</Autoresponsive>
					</InfiniteScroll>
					<Divider hidden={hasMore} className="noMore">
						别扒拉了，我们是有底线的！
					</Divider>
				</div>
			</>
		);
	}

	onLoad() {
		this.arrayList = this.arrayList.map((i) => this.getItemStyle());
		this.resize = this.resize.bind(this);
	}

	onReady() {
		// this.setState({
		// 	containerWidth: ReactDOM.findDOMNode(this.refs.container)
		// 		.clientWidth,
		// });
		window.addEventListener('resize', this.resize, false);
	}

	// 选中的分类id 集合
	selectTags(categroyIds = []) {
		if (!categroyIds.length) return;
		this.setState(
			{
				loading: false,
				empty: false,
				picLoading: true,
				picList: [],
			},
			() => {},
		);
		this.next = 0;
		this.lastRenderIds = categroyIds.toString();
		this.loadPicList(categroyIds);
	}
	next = 0;
	lastRenderIds = '';
	// 加载图库列表
	async loadPicList(categroyIds = [], start = this.next) {
		console.log('加载图库', categroyIds);

		if (start === -1)
			return this.setState({
				loading: false,
				picLoading: false,
			});
		const res = await get(api.photoGallery.list, {
			ids: categroyIds,
			start,
		});
		//
		if (this.lastRenderIds === categroyIds.toString()) {
			let {
				data: picList = [],
				success,
				faildesc = '暂无数据',
				next = -1,
			} = res;
			let pageStatus = {
				loading: false,
				picLoading: false,
				hasMore: !(next < 0),
			};
			if (success) {
				// picList = this.arrayList.map((item) => picList[0]);
				this.next = next;
				pageStatus.empty = !picList.length;
			} else {
				pageStatus.empty = faildesc;
				pageStatus.picList = []; //
				this.next = 0;
			}
			// this.setPageStatus(pageStatus);
			picList = this.state.picList.concat(picList);
			this.setState(
				{
					picList,
					...pageStatus,
				},
				() => {
					this.replaceState();
				},
			);
		}
	}

	loadMore() {
		const { selectedTags, activeKey } = this.state;
		this.loadPicList(selectedTags[activeKey], this.next);
	}

	getAuthorsName(authors = []) {
		return authors.map((item) => item.aname).join();
	}
	async clickItemHandle(item = {}) {
		this.setState({ picLoading: true });

		const { pid } = item;
		const files = await get(api.photoGallery.files, { pid });
		files.data.splice(0, 1);
		this.setState({
			loading: false,
			picLoading: false,
			visible: true,
			source: files.data,
			detailid: pid,
		});
		// this.handleImg(true);
	}

	handleImg(e = false) {
		this.setState({
			visible: e,
		});
	}

	resize() {
		if (!this.refs || !this.refs.container) return;
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

export default connect(({ menus }) => ({ menus }))(PhotoGallery);
