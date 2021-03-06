import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import {
	Message,
	Icon,
	Row,
	Carousel,
	Typography,
	List,
	Modal,
	Drawer,
} from 'antd';
import Page from '../../common/Page';
import PageConfig from '../../common/PageConfig';
import { get } from '../../../utils/request';
import api, { RootBase } from '../../../services/api';

import AutoCard from '../../common/autoCard/autoCard';
// import YModal from '../../../components/ymodal/ymodal';
import Video from '../../../components/Video/Video';
import FullscreenModal from '../../common/fullscreenModal/fullscreenModal';
import BannerList from '../../common/BannerList/BannerList';

import './zoneDetail.less';

const { Text } = Typography;

class ZoneDetail extends Page {
	constructor(props) {
		super(props, {
			bodyClass: 'bodyClass',
			mode: 'list',
			detailData: [],
		});
		this.detailId = this.query.detailId;
	}
	pageId = '3'; // 图库页对应名称
	pageName = PageConfig[this.pageId]; // 图库页对应名称
	pagePath = '/zone/list';
	loadMenu = false;
	async onReady() {
		const detailId = this.getDetailId(),
			reqestArr = [this.getData(detailId), this.getInfo(detailId)],
			[detailData, detailInfo] = await Promise.all(reqestArr);
		console.log(detailInfo);
		this.setState({
			loading: false,
			detailId,
			detailData,
		});
	}
	// 获取名家详情页id
	getDetailId() {
		if (!this.query.detailId) {
			Message.error('缺少空间ID参数，无法获取详情！');
			return this.props.history.length > 2
				? this.props.history.go(-1)
				: this.props.history.push('/zone');
		}
		return this.query.detailId;
	}

	renderBody() {
		const {
			detailId,
			title = '界画',
			date = '2019-03-04 22:00:00',
			viewer = 3445,
			collect = 234,
			mode = 'list',
			detailData,
		} = this.state;
		return (
			<Row className="zoneDetails">
				<h3>{title}</h3>
				<div className="toolsBar">
					<div className="tools">
						<span>{date}</span>
						<span>
							<Icon type="eye" />
							{viewer}
						</span>
						<span>
							<Icon type="heart" />
							{collect}
						</span>
					</div>
					<div className="tools" style={{ float: 'right' }}>
						{mode === 'list' ? (
							<span onClick={() => this.changeMode('carousel')}>
								<Icon type="file-image" />
								幻灯片查看
							</span>
						) : (
							<>
								<span onClick={() => this.changeMode('list')}>
									<Icon type="appstore" />
									列表查看
								</span>
								<span>|</span>
								<span onClick={() => this.openModal()}>
									<Icon type="fullscreen" />
									全屏查看
								</span>
							</>
						)}
					</div>
				</div>
				<ZoneItem
					type={this.state.mode}
					source={detailData}
					title={title}
				/>
				<FullscreenModal
					type={this.state.mode}
					title={title}
					detailData={detailData}
					visible={this.state.visible}
					onCancel={() => this.closeModal()}
				/>
			</Row>
		);
	}
	openModal() {
		this.fullScreen();

		this.setState({
			visible: true,
		});
	}

	// 全屏显示
	fullScreen() {
		const de = document.documentElement;
		if (de.requestFullscreen) {
			de.requestFullscreen();
		} else if (de.mozRequestFullScreen) {
			de.mozRequestFullScreen();
		} else if (de.webkitRequestFullScreen) {
			de.webkitRequestFullScreen();
		}
	}

	// 退出全屏
	exitFullscreen() {
		const de = document;
		if (de.exitFullscreen) {
			de.exitFullscreen();
		} else if (de.mozCancelFullScreen) {
			de.mozCancelFullScreen();
		} else if (de.webkitCancelFullScreen) {
			de.webkitCancelFullScreen();
		}
	}

	closeModal() {
		this.setState({
			visible: false,
		});
		this.exitFullscreen();
	}
	changeMode(mode) {
		if (mode === this.state.mode) return;
		this.setState({
			mode,
		});
	}

	async getData(sid) {
		const res = await get(api.zone.detail, { sid });
		let data = [];
		if (res.success) {
			data = res.data.map((item) => ({
				img: RootBase + item.url,
				meta: [item.id],
				desc: item.memo,
			}));
		}
		return data;
	}
	async getInfo(sid) {
		// const res = await get(api.zone.info, { sid });
		// return
	}

	selectTags(ids) {
		if (this.query.cateId === ids.toString()) {
			const { pathname, search } = this.props.location;
			const breadcrumb = this.pushTrack({
				name: this.query.name,
				path: pathname + search,
			});
			this.setState({
				// loading: false,
				empty: false,
				breadcrumb,
			});
		} else {
			this.props.history.push(this.pagePath + this.getPath());
		}
	}

	onWillUnmount() {
		console.log('卸载');
	}
}

const detailsProps = ({ menus }) => ({ menus });

export default connect(detailsProps)(ZoneDetail);

class ZoneItem extends PureComponent {
	static defaultProps = {
		source: [],
		type: '', // list | carousel
	};
	// constructor() {}
	render() {
		const { type } = this.props;
		const component = this[type] ? this[type]() : null;
		return component;
	}

	list() {
		const { source = [] } = this.props;
		const totalLen = source.length;
		return (
			<AutoCard
				source={source}
				cardCover={true}
				renderMeta={(item, index) => (
					<p key={index} style={{ textAlign: 'center' }}>
						{index + 1 + '/' + totalLen}
					</p>
				)}
				ItemStyle={{
					height: 300,
					width: 280,
				}}
				coverStyle={{
					height: 240,
					width: 280,
					padding: 40,
				}}
			/>
		);
	}

	carousel() {
		return <BannerList {...this.props} height={500} />;
	}
}
exports.ZoneItem = ZoneItem;

// class DetailCarousel extends Component {
// 	static defaultProps = { source: [], beforeChange: () => {} };

// 	state = {
// 		currentIndex: 1,
// 		data: [
// 			// {
// 			// 	title:'',
// 			// 	currentIndex,
// 			// 	totalLen,
// 			// 	desc: source[currentIndex - 1].desc,
// 			// },
// 		],
// 	};
// 	carousel = null;
// 	render() {
// 		const { source, title, height } = this.props;
// 		const totalLen = source.length;

// 		return (
// 			<>
// 				<div className="carouselBox">
// 					<Carousel
// 						ref={(ref) => (this.carousel = ref)}
// 						className="detailCarousel"
// 						dots={false}
// 						beforeChange={(form, to) =>
// 							this.beforeChange(form, to)
// 						}>
// 						{source.map((item, index) => (
// 							<div>
// 								<div
// 									className="imgItem"
// 									style={{ height }}
// 									key={index}>
// 									<img src={item.img} className="img" />
// 								</div>
// 							</div>
// 						))}
// 					</Carousel>
// 					<Icon
// 						type="left"
// 						className="prev"
// 						onClick={() => this.carousel.prev()}
// 					/>
// 					<Icon
// 						type="right"
// 						className="next"
// 						onClick={() => this.carousel.next()}
// 					/>
// 				</div>
// 				{/* <List
// 					itemLayout="horizontal"
// 					dataSource={[
// 						{
// 							currentIndex,
// 							totalLen,
// 							title,
// 							desc: source[currentIndex - 1].desc,
// 						},
// 					]}
// 					className="desc"
// 					renderItem={(item) => (
// 						<List.Item>
// 							<List.Item.Meta
// 								avatar={
// 									<div className="pageNum">
// 										<Text type="warning">
// 											{item.currentIndex}
// 										</Text>
// 										/ {item.totalLen}
// 									</div>
// 								}
// 								title={item.title}
// 								description={item.desc}
// 							/>
// 						</List.Item>
// 					)}
// 				/> */}
// 			</>
// 		);
// 	}
// 	beforeChange(prev, next) {
// 		this.props.beforeChange(prev, next);
// 		this.setState({ currentIndex: next + 1 });
// 	}
// }

// exports.DetailCarousel = DetailCarousel;
