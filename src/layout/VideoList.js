import React, { Component } from 'react';
import Video from '../components/Video/Video';

import { Card, Icon } from 'antd';
import './videolist.less';
const { Meta } = Card;

const IconFont = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_1466546_e5rpye7uors.js',
});

class VideoList extends Component {
	static defaultProps = {
		source: [], // 视频列表的数据
		click: () => {}, // 点击事件
		warpClassName: '', // 容器的类名
	};

	state = {
		hoverPlay: false,
		src: '',
	};

	render() {
		const { warpClassName, source } = this.props;

		return (
			<div className={`videoList ${warpClassName}`}>
				{source.map((item, index) => (
					<Card
						key={index}
						className="videoItem"
						bordered={false}
						hoverable={true}
						onClick={() => this.props.click(item, index)}
						cover={
							<div
								className="videoBox"
								onMouseEnter={() => this.hoverPlay(item, index)}
								onMouseLeave={() => this.hoverPlay()}>
								{item.poster ? (
									<img alt={item.name} src={item.poster} />
								) : (
									<IconFont
										type="icon-video"
										onClick={() => {}}
									/>
								)}
								{this.state.hoverPlay === index && (
									<Video
										warpClassName="yyvideo"
										src={this.state.src}
										autoPlay={true}
										disableDefaultControls={true}
										ref="video"
									/>
								)}
							</div>
						}>
						<Meta description={item.name} />
					</Card>
				))}
			</div>
		);
	}
	mouseUp() {
		this.hoverPlay();
	}

	mouseleav() {}

	hoverPlay(item, index) {
		if (!this.props.preView) return null;
		if (index === undefined) {
			console.log('移除');
			this.setState(
				{
					src: '',
				},
				() => {
					this.setState({
						hoverPlay: '',
					});
				},
			);
		} else {
			this.setState({
				hoverPlay: index,
				src: item.src,
			});
		}
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
}

export default VideoList;
