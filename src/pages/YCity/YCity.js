import { connect } from 'dva';
import Page from '../common/Page';

@connect()
class YCity extends Page {
	// constructor(props) {
	// 	super(props);
	// }
	pageName = 'city'; // 图库页对应名称

	renderBody() {
		return null;
	}
}

const cityProps = ({ menus }) => ({ menus });

export default connect(cityProps)(YCity);
