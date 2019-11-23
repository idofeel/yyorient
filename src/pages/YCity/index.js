import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import TopMenus from '../../layout/page';
import ReactBarrel from '../../components/react-barrel';

let fakeData = [{ src: 'http://yy.aijk.xyz/rs/img//1/1/1-2_0_0.jpg' }];
for (let i = 1; i < 37; i++) {
	fakeData[i] = { src: require(`./images/${i}.jpg`) };
}

fakeData[37] = { src: 'http://yy.aijk.xyz/rs/img//1/1/1-2_0_0.jpg' };

class YCity extends Component {
	pageName = 'city';
	state = {
		empty: false,
		loading: true,
		showBreadcrumb: true,
	};

	pageStart = 0; //起始页
	render() {
		const { empty, loading, showBreadcrumb } = this.state;
		return (
			<div>
				<TopMenus
					pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
					showBreadcrumb={showBreadcrumb}
					empty={empty}
					loading={loading}>
					{this.renderBarrel()}
				</TopMenus>
			</div>
		);
	}

	cateIdsLoad = ({ selectids, tabIndex, breadcrumb }) => {
		this.getData(selectids);
	};
	tabChange = (item, index) => {};

	renderBarrel() {
		return (
			<InfiniteScroll
				initialLoad={false}
				pageStart={0}
				hasMore={true}
				loadMore={() => {
					this.loadMore();
				}}>
				<ReactBarrel
					wrapClassName='barrel_container'
					margin={10}
					data={fakeData}
					renderItem={(item, index) => {
						const imgProps = {
							key: index,
							src: item.src,
							style: {
								width: item.width,
								height: item.height,
								marginRight: item.margin,
							},
						};
						return (
							<div
								key={index}
								style={{
									float: 'left',
									marginBottom: 10,
								}}>
								{/* <MouseDirection
									wrapClassName=""
									bodyStyle={{
										marginRight: item.margin,
										marginBottom: 10,
									}}
									onMouseDirection={() => {
										console.log(...arguments, item);
									}}> */}
								<img {...imgProps} />
								<div>123123</div>
								{/* </MouseDirection> */}
							</div>
						);
					}}
				/>
			</InfiniteScroll>
		);
	}

	getData() {
		this.setState({ loading: false });
	}

	loadMore() {
		console.log('load');
	}

	renderGraphic() {
		return null;
	}

	renderList() {
		return null;
	}
}

export default YCity;
