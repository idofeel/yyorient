import { connect } from 'dva';
import Page from '../common/Page';
import ReactBarrel from '../../components/react-barrel/react-barrel';
import './ycity.less';
import MouseDirection from '../../components/MouseDiretion/MouseDirection';

@connect()
class YCity extends Page {
	// constructor(props) {
	// 	super(props);
	// }
	pageName = 'city'; // 图库页对应名称

	renderBody() {
		return (
			<div>
				<MouseDirection />
				<ReactBarrel
					wrapClassName="barrel_container"
					margin={10}
					loadMode=""
					renderItem={(item, index) => {
						const imgProps = {
							key: index,
							src: item.src,
							style: {
								width: item.width,
								height: item.height,
							},
						};
						return (
							<div style={{ display: 'inline-block' }}>
								<MouseDirection
									wrapClassName=""
									bodyStyle={{
										marginRight: item.margin,
										marginBottom: 10,
									}}
									onMouseDirection={() => {
										console.log(...arguments, item);
									}}>
									<img {...imgProps} />
								</MouseDirection>
							</div>
						);
					}}
				/>
			</div>
		);
	}
	onReady() {
		this.setState({ loading: false });
	}
}

const cityProps = ({ menus }) => ({ menus });

export default connect(cityProps)(YCity);
