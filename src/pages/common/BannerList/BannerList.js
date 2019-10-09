import React, { Component } from 'react';
import { Icon, Carousel, List, Typography } from 'antd';

import './BannerList.less';

const { Text } = Typography;

//
class BannerList extends Component {
	state = {
		currentIndex: 1,
	};
	render() {
		const { source, title, height } = this.props;
		const { currentIndex } = this.state;
		const totalLen = source.length;
		return (
			<div className="bannerList">
				<DetailCarousel
					{...this.props}
					beforeChange={(p, n) => this.beforeChange(p, n)}
				/>
				<DescList
					dataSource={[
						{
							currentIndex,
							totalLen,
							title,
							desc: source[currentIndex - 1].desc,
						},
					]}
				/>
			</div>
		);
	}

	beforeChange(prev, next) {
		this.setState({ currentIndex: next + 1 });
	}
}

class DetailCarousel extends Component {
	static defaultProps = { source: [], beforeChange: () => {} };

	state = {
		currentIndex: 1,
		data: [
			// {
			// 	title:'',
			// 	currentIndex,
			// 	totalLen,
			// 	desc: source[currentIndex - 1].desc,
			// },
		],
	};
	carousel = null;
	render() {
		const { source, height } = this.props;
		// { currentIndex, data } = this.state;
		// const totalLen = source.length;

		return (
			<div className="carouselBox">
				<Carousel
					ref={(ref) => (this.carousel = ref)}
					className="detailCarousel"
					dots={false}
					beforeChange={(form, to) => this.beforeChange(form, to)}>
					{source.map((item, index) => (
						<div>
							<div
								className="imgItem"
								style={{ height }}
								key={index}>
								<img src={item.img} className="img" />
							</div>
						</div>
					))}
				</Carousel>
				<Icon
					type="left"
					className="prev"
					onClick={() => this.carousel.prev()}
				/>
				<Icon
					type="right"
					className="next"
					onClick={() => this.carousel.next()}
				/>
			</div>
		);
	}
	beforeChange(prev, next) {
		this.props.beforeChange(prev, next);
		// this.setState({ currentIndex: next + 1 });
	}
}

class DescList extends Component {
	static defaultProps = {
		dataSource: [
			{
				currentIndex: 0,
				totalLen: 0,
				title: '',
				desc: '',
			},
		],
	};
	render() {
		const { dataSource } = this.props;
		// const { currentIndex, totalLen, title, desc } = dataSource;
		return (
			<List
				itemLayout="horizontal"
				dataSource={dataSource}
				className="desc"
				renderItem={(item) => (
					<List.Item>
						<List.Item.Meta
							avatar={
								<div className="pageNum">
									<Text type="warning">
										{item.currentIndex}
									</Text>
									/ {item.totalLen}
								</div>
							}
							title={item.title}
							description={item.desc}
						/>
					</List.Item>
				)}
			/>
		);
	}
}

export default BannerList;
exports.DescList = DescList;
exports.DetailCarousel = DetailCarousel;
