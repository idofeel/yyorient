import { connect } from 'dva';
import Page from '../common/Page';
import Video from '../../components/Video/Video';
@connect()
class YVideo extends Page {
	constructor(props) {
		const state = {
			src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
		};
		super(props, state);
	}
	pageId = '4'; // 图库页对应id
	pageName = 'video'; // 图库页对应名称

	renderBody() {
		const { src } = this.state;
		return <Video src={src} />;
	}

	selectTags(ids) {
		this.setState({ loading: false });
	}
}
export default connect()(YVideo);
