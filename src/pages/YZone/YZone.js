import { connect } from 'dva';
import Page from '../common/Page';

@connect()
class YZone extends Page {
	constructor(props) {
		super(props);
	}
	pageName = 'zone'; // 图库页对应名称
	loadMenu = true;

	renderBody() {
		return null;
	}
}
export default connect(({ global }) => ({ ...global }))(YZone);
