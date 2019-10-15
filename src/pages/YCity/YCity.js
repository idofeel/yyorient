import { connect } from 'dva';
import Page from '../common/Page';
import ReactBarrel from '../../components/react-barrel/react-barrel';
import './ycity.less';

@connect()
class YCity extends Page {
	// constructor(props) {
	// 	super(props);
	// }
	pageName = 'city'; // 图库页对应名称

	renderBody() {
		return (
			<div>
				<ReactBarrel
					wrapClassName="barrel_container"
					margin={10}
					// renderItem={(item, index) => {
					// 	const imgProps = {
					// 		key: index,
					// 		src: item.src,
					// 		style: {
					// 			width: item.width,
					// 			height: item.height,
					// 			marginRight: item.margin,
					// 			marginBottom: this.margin,
					// 		},
					// 	};
					// 	return <img {...imgProps} />;
					// }}
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
