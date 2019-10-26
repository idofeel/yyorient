import { connect } from 'dva';
import Page from '../common/Page';
import ReactBarrel from '../../components/react-barrel';
import './ycity.less';
import MouseDirection from '../../components/MouseDiretion/MouseDirection';
import InfiniteScroll from 'react-infinite-scroller';

let fakeData = [{ src: 'http://yy.aijk.xyz/rs/img//1/1/1-2_0_0.jpg' }];
for (let i = 1; i < 37; i++) {
	fakeData[i] = { src: require(`./images/${i}.jpg`) };
}

fakeData[37] = { src: 'http://yy.aijk.xyz/rs/img//1/1/1-2_0_0.jpg' };

@connect()
class YCity extends Page {
	// constructor(props) {
	// 	super(props);
	// }
	pageName = 'city'; // 图库页对应名称

	renderBody() {
		return <div>{this.renderBarrel()}</div>;
	}

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
					wrapClassName="barrel_container"
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

	renderGraphic() {
		return null;
	}

	renderList() {
		return null;
	}

	selectTags(item) {
		this.setState({ loading: false });
		this.getData();
	}
	pageStart = 0; //起始页

	getData() {}
	loadMore() {
		console.log('load');
	}
}

const cityProps = ({ menus }) => ({ menus });

export default connect(cityProps)(YCity);
