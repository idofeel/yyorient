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
		src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
		autoPlay: false,
	};

	// constructor(props) {
	// 	super(props);
	// }

	render() {
		const { position, src, autoPlay } = this.props;
		return (
			<Player
				ref={(player) => {
					this.player = player;
				}}
				autoPlay={autoPlay}
				className="videoPlayer"
				{...this.props}>
				<source src={src} />
				<BigPlayButton position={position} />
				<ControlBar className="videoControl">
					<PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
				</ControlBar>
			</Player>
		);
	}
}
