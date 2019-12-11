import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import Autoresponsive from 'autoresponsive-react';
import InfiniteScroll from 'react-infinite-scroller';
import ImgModal from '../ImgModal';
import { get } from '../../utils/request';
import api, { RootBase } from '../../services/api';
import {
	Spin,
	Card,
	Typography,
	Icon,
	message,
	Divider,
	Empty,
	Breadcrumb,
} from 'antd';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';
import './photoGallery.less';
import TopMenus from '../../layout/page/index';
const { Meta } = Card;

const IconFont = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_1466546_e5rpye7uors.js',
});

message.config({
	duration: 1,
	maxCount: 1,
});
class Gallery extends Component {
	state = {
		visible: false,
		source: [],
		detailid: null,
		scaleImgOptions: {
			bounding: true,
			offset: 80,
		},
		picList: [],
		hasMore: false,
		loading: true,
	};
	pageName = 'photo';
	next = 0;
	render() {
		const {
			source,
			detailid,
			empty,
			loading,
			visible,
			scaleImgOptions,
		} = this.state;

		return (
			<div>
				<TopMenus
					pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
					showBreadcrumb={true}
					loading={loading}>
					<div
						className='AutoresponsiveContainer'
						ref={(ref) => (this.container = ref)}>
						{this.renderPicList()}
						{source.length ? (
							<ImgModal
								visible={visible}
								options={scaleImgOptions}
								dataSource={source}
								detailid={detailid}
								hideModal={() => {
									this.handleImg();
								}}
							/>
						) : null}
					</div>
				</TopMenus>

				{empty ? (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={empty === true ? '暂无数据' : empty}
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
						loader={<Spin key='loader' />}>
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
									className='picitem'
									cover={
										<img
											src={RootBase + '/' + i.img}
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
										type='icon-collect'
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
					<Divider hidden={hasMore} className='noMore'>
						别扒拉了，我们是有底线的！
					</Divider>
				</div>
			</>
		);
	}

	cateIdsLoad = ({ selectIds, tabIndex }) => {
		if (!selectIds.length) return;
		this.setState({
			loading: true,
			// loading: false,
			picList: [],
			empty: false,
		});
		this.next = 0;
		this.lastRenderIds = selectIds;
		this.getData(selectIds, 0);
	};

	componentDidMount() {
		this.resize = this.resize.bind(this);
		window.addEventListener('resize', this.resize, false);
	}

	handleImg(e = false) {
		this.setState({
			visible: e,
		});
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
	tabChange = () => {
		this.setState({
			loading: true,
			empty: false,
			// picList: [],
		});
	};
	async getData(ids, start) {
		if (start === -1) {
			this.setState({
				loading: false,
			});
			return;
		}

		const res = await get(api.photoGallery.list, {
			ids,
			start,
		});

		//
		if (this.lastRenderIds.toString() === ids.toString()) {
			let {
				data: picList = [],
				success,
				faildesc = '暂无数据',
				next = -1,
			} = res;
			let pageStatus = {
				loading: false,
				hasMore: !(next < 0),
			};
			if (success) {
				this.next = next;
				pageStatus.empty = !picList.length;
			} else {
				pageStatus.empty = faildesc;
				pageStatus.picList = []; //
				this.next = 0;
			}
			picList = this.state.picList.concat(picList);
			this.setState({
				picList,
				...pageStatus,
			});
		}
	}

	loadMore() {
		this.getData(this.lastRenderIds, this.next);
	}
	async clickItemHandle(item = {}) {
		this.setState({ loading: true });

		const { pid } = item;
		const files = await get(api.photoGallery.files, { pid });
		files.data.splice(0, 1);
		this.setState({
			loading: false,
			visible: true,
			source: files.data,
			detailid: pid,
		});
		// this.handleImg(true);
	}
	getAuthorsName(authors = []) {
		return authors.map((item) => item.aname).join();
	}

	resize() {
		if (!this.container) return;
		this.setState({
			containerWidth: ReactDOM.findDOMNode(this.container).clientWidth,
		});
	}

	componentWillUnmount() {
		// 销毁监听事件
		window.removeEventListener('resize', this.resize);
		this.setState = (state, callback) => {
			return;
		};
	}
}

export default Gallery;
