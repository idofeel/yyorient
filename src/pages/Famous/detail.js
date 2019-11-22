import React, { Component } from 'react';
import { Message, Carousel, Row, Tabs, Card, Icon } from 'antd';
import Video from '../../components/Video/Video';
import AutoCard from '../common/autoCard/autoCard';
import TopMenus from '../../layout/page/index';
import { queryString } from '../../utils';

import './famousDetails.less';

const { TabPane } = Tabs;
const { Meta } = Card;

class FamouseDetail extends Component {
	pageName = 'famous';
	state = {
		loading: true,
	};
	detailId = this.getDetailId();
	render() {
		const famousTab = [
			{ name: '艺术简历', id: '', resume: {} },
			{ name: '作品欣赏', id: '' },
			{ name: '出版画册', id: '' },
			{ name: '相关视频', id: '' },
		];
		return (
			<>
				<TopMenus
					pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
					showBreadcrumb={true}
					loading={this.state.loading}>
					<div className='famousDetails'>
						<Row className='famousContainer'>
							<h3>这是谁来着</h3>
							<Carousel autoplay>
								<div>
									<h3>1</h3>
								</div>
							</Carousel>
							<div className='famous_tab'>
								<Tabs
									defaultActiveKey='0'
									onChange={this.callback}>
									{famousTab.map((item, index) => (
										<TabPane tab={item.name} key={index}>
											{this.renderTabItem(item, index)}
										</TabPane>
									))}
								</Tabs>
							</div>
						</Row>
					</div>
				</TopMenus>
			</>
		);
	}

	renderTabItem(item, index) {
		const component = {
			0: <FamouseResume />,
			1: <FamousWorks />,
			2: <FamousWorks />,
			3: (
				<FamousVideo
					ref='FamousVideo'
					src={this.state.source}
					onClickHandle={(item) => {
						console.log('click', this);
						this.setState(
							{
								source:
									'http://media.w3.org/2010/05/bunny/movie.mp4',
							},
							this.refs['FamousVideo'].player().load(),
						);
					}}
				/>
			),
		};
		return component[index] || null;
	}
	// 获取名家详情页id
	getDetailId() {
		const { detailId, c, cid } = queryString(this.props.location.search);
		if (!detailId) {
			Message.error('缺少作家ID参数，无法获取详情！');
			return this.props.history.length > 2
				? this.props.history.go(-1)
				: this.props.history.push('/famous');
		}
		return detailId;
	}

	cateIdsLoad = ({ selectIds, tabIndex }) => {
		console.log(selectIds, tabIndex);
		// this.lastIds = selectIds;
		this.setState({ loading: false });
		// if (!this.query.cateId) {
		// 	this.props.history.push('/famous/list');
		// }
	};

	tabChange() {}
}

class FamousVideo extends Component {
	render() {
		const {
			famousVideo = [
				{
					cover:
						'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
					name: '12313123',
				},
				{
					cover:
						'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
					name: '12313123',
				},
				{
					cover:
						'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
					name: '12313123',
				},
				{
					cover:
						'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
					name: '12313123',
				},
				{
					cover:
						'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
					name: '12313123',
				},
			],
		} = this.props;
		return (
			<div className='famousVideo'>
				{famousVideo.map((item, index) => (
					<Card
						key={index}
						className='famousItem'
						bordered={false}
						hoverable={true}
						onClick={() => {
							this.props.onClickHandle(item, index);
						}}
						cover={
							<div className='imgBox'>
								<img alt={item.name} src={item.cover} />
								<Icon
									type='play-circle'
									theme='filled'
									className='videoPlay'
								/>
							</div>
						}>
						<Meta description={item.name} />
					</Card>
				))}
				{/* <video src={this.props.src} controls /> */}
				<Video src={this.props.src} ref='video' autoPlay={true} />
			</div>
		);
	}

	player() {
		return this.refs['video'].player;
	}
}

function FamousWorks(props) {
	const {
		famousWorks = [
			{
				img:
					'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
			{
				img:
					'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
				meta: [
					{ name: '名称', content: '内容' },
					{ name: '规格', content: '150*200' },
					{ name: '年代', content: '去年' },
				],
			},
		],
	} = props;

	return (
		<AutoCard
			source={famousWorks}
			cardCover={true}
			renderMeta={(item, index) => {
				return item.meta.map((meta, idx) => (
					<p key={idx}>
						{meta.name}:{meta.content}
					</p>
				));
			}}
		/>
	);
	return (
		<div className='famousWorks'>
			{famousWorks.map((item, index) => (
				<Card
					key={index}
					className='famousItem'
					bordered={false}
					hoverable={true}
					onClick={() => {
						alert(1);
					}}
					cover={
						<div className='imgBox'>
							<img alt='example' src={item.img} />
						</div>
					}>
					<Meta
						description={item.detail.map((ditem, dindex) => (
							<p key={dindex}>
								{ditem.name}:{ditem.content}
							</p>
						))}
					/>
				</Card>
			))}
		</div>
	);
}

function FamouseResume(props) {
	const {
		resume = '12312312312312312312312312312312312',
		other = [
			{
				title: '作品收藏',
				content:
					'作品收藏作品收藏作品收藏作品收藏作品收藏作品收藏作品收藏作品收藏作品收藏',
			},
			{
				title: '媒体报道',
				content:
					'媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道媒体报道',
			},
		],
	} = props;
	return (
		<div className='famouseResume'>
			<p>{resume}</p>
			{other.map((item, index) => (
				<div key={index}>
					<h3>{item.title}</h3>
					<p>{item.content}</p>
				</div>
			))}
		</div>
	);
}

exports.VideoList = FamousVideo;

export default FamouseDetail;
