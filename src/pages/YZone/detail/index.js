import React, { Component, PureComponent } from 'react';
import { Message, Icon, Row } from 'antd';
import TopMenus from '../../../layout/page/index';
import { queryString } from '../../../utils';
import { get } from '../../../utils/request';
import api, { RootBase } from '../../../services/api';
import AutoCard from '../../common/autoCard/autoCard';
import FullscreenModal from '../../common/fullscreenModal/fullscreenModal';
import BannerList from '../../common/BannerList/BannerList';
// 加载样式
import './zoneDetail.less';

export default class ZoneDetail extends Component {
	pageName = 'zone';
	state = {
		loading: true,
		mode: 'list',
		detailData: [],
	};
	zoneID = this.getDetailId();
	render() {
		const {
			title = '界画',
			date = '2019-03-04 22:00:00',
			viewer = 3445,
			collect = 234,
			mode = 'list',
			detailData,
		} = this.state;
		return (
			<div className='bodyClass'>
				<TopMenus
					pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
					showBreadcrumb={true}
					loading={this.state.loading}>
					<Row className='zoneDetails'>
						<h3>{title}</h3>
						<div className='toolsBar'>
							<div className='tools'>
								<span>{date}</span>
								<span>
									<Icon type='eye' />
									{viewer}
								</span>
								<span>
									<Icon type='heart' />
									{collect}
								</span>
							</div>
							<div className='tools' style={{ float: 'right' }}>
								{mode === 'list' ? (
									<span
										onClick={() =>
											this.changeMode('carousel')
										}>
										<Icon type='file-image' />
										幻灯片查看
									</span>
								) : (
									<>
										<span
											onClick={() =>
												this.changeMode('list')
											}>
											<Icon type='appstore' />
											列表查看
										</span>
										<span>|</span>
										<span onClick={() => this.openModal()}>
											<Icon type='fullscreen' />
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
				</TopMenus>
			</div>
		);
	}

	async componentDidMount() {
		const detailId = this.getDetailId(),
			reqestArr = [this.getData(detailId), this.getInfo(detailId)],
			[detailData, detailInfo] = await Promise.all(reqestArr);
		this.setState({
			loading: false,
			detailId,
			detailData,
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
		//
	}
	// 获取详情页id
	getDetailId() {
		const { detailId, c, cid } = queryString(this.props.location.search);
		if (!detailId) {
			Message.error('缺少空间ID，无法获取详情！');
			return this.props.history.length > 2
				? this.props.history.go(-1)
				: this.props.history.push('/zone');
		}
		return detailId;
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
}

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
