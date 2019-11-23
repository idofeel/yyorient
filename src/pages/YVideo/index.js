import React, { Component } from 'react';
import api, { RootBase } from '../../services/api';
import { get } from '../../utils/request';
import TopMenus from '../../layout/page';
import VideoList from '../../layout/VideoList';
import YModal from '../../components/ymodal/ymodal';
import Video from '../../components/Video/Video';

class YVideo extends Component {
	pageName = 'video';
	state = {
		loading: true,
		data: [],
		src: '',
		videoHeight: window.innerHeight - 20,
	};
	render() {
		const { data, src, closable, videoHeight, empty } = this.state;

		return (
			<div>
				<TopMenus
					pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
					showBreadcrumb={true}
					empty={empty}
					loading={this.state.loading}>
					<VideoList
						preView={true}
						source={data}
						click={this.videoItemClick.bind(this)}
					/>
				</TopMenus>
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
							className='videomodal'
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
			</div>
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
	componentDidMount() {
		window.addEventListener('resize', this.resizebind);
	}

	resize() {
		this.setState({
			videoHeight: window.innerHeight - 20,
		});
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeBind);
	}
	cancelModal() {
		this.setState({
			src: '',
		});
	}

	cateIdsLoad = ({ selectIds }) => {
		this.getData(selectIds);
	};
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
			empty: !videoDaata.length && '暂无数据',
		});
	}
}

export default YVideo;
