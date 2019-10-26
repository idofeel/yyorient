import React, { Component } from 'react';
import {
	Player,
	ControlBar,
	BigPlayButton,
	PlaybackRateMenuButton,
	// VolumeMenuButton,
} from 'video-react';
import 'video-react/dist/video-react.css';
import './video.less';
export default class Video extends Component {
	static defaultProps = {
		position: 'center',
		src: '',
		autoPlay: false,
		warpClassName: '',
		onload: () => {},
	};

	// constructor(props) {
	// 	super(props);
	// }
	player = null;
	render() {
		const { position, src, autoPlay, warpClassName } = this.props;
		return (
			<Player
				ref={(player) => {
					this.player = player;
				}}
				autoPlay={autoPlay}
				className={`videoPlayer ${warpClassName}`}
				{...this.props}>
				<source src={src} />
				<BigPlayButton position={position} />
				<ControlBar className="videoControl">
					<PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
				</ControlBar>
			</Player>
		);
	}
	componentDidMount() {
		console.log(this.player.videoWidth);
		this.props.onload(this.player);
		if (this.props.autoPlay) {
			this.play();
		}
	}
	pause() {
		this.player.pause();
	}

	play() {
		this.player.play();
	}
}
