import { connect } from 'dva';
import Page from '../common/Page';
import Video from '../../components/Video/Video';
import api, { RootBase } from '../../services/api';
import { get } from '../../utils/request';
import VideoList from '../../layout/VideoList';
import YModal from '../../components/ymodal/ymodal';
import { Row, Col } from 'antd';
import './yvideo.less';

class YVideo extends Page {
	constructor(props) {
		const state = {
			data: [],
			src: '',
			videoHeight: window.innerHeight - 20,
		};
		super(props, state);

		this.resizebind = this.resize.bind(this);
	}
	pageId = '4'; // 图库页对应id
	pageName = 'video'; // 图库页对应名称
	pagePath = '/video'; // 图库页对应名称

	renderBody() {
		const { data, src, closable, videoHeight } = this.state;
		return (
			<>
				<VideoList
					preView={true}
					source={data}
					click={this.videoItemClick.bind(this)}
				/>
				<YModal
					closable={closable}
					onCancel={this.cancelModal.bind(this)}
					visible={!!src}
					ref={(ref) => {
						this.modal = ref;
					}}>
					<div
						onMouseEnter={() => {
							this.setState({
								closable: true,
							});
						}}
						onMouseLeave={() => {
							// this.setState({
							// 	closable: false,
							// });
						}}>
						<div
							className="videomodal"
							style={{ maxHeight: videoHeight }}>
							<Video
								src={src}
								autoPlay={true}
								fluid={false}
								height={videoHeight}
							/>
						</div>
					</div>
				</YModal>
			</>
		);
	}

	videoItemClick(item) {
		this.setState(
			{
				src: item.src,
			},
			() => {
				console.log(this.modal);
			},
		);
	}
	onReady() {
		window.addEventListener('resize', this.resizebind);
	}

	resize() {
		this.setState({
			videoHeight: window.innerHeight - 20,
		});
	}
	onWillUnmount() {
		window.removeEventListener('resize', this.resizeBind);
	}
	cancelModal() {
		this.setState({
			src: '',
		});
	}

	selectTags(ids) {
		this.getData(ids);
	}
	async getData(ids) {
		const { data = [] } = await get(api.video.list, { ids, start: 0 });
		// 转换数据格式
		const videoDaata = data.map((item, index) => {
			const poster = index
				? 'http://img4.imgtn.bdimg.com/it/u=2891947786,1564100578&fm=26&gp=0.jpg'
				: '';
			RootBase + item.cover;
			return {
				src: RootBase + item.video,
				poster,
				vid: item.vid,
				name: item.vname,
			};
		});

		this.setState({
			data: videoDaata,
			loading: false,
			empty: false,
		});
	}

	get;
}

const videoProps = ({ menus }) => ({ menus });

export default connect(videoProps)(YVideo);
