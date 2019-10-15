import React, { Component } from 'react';

class MouseDirection extends Component {
	static defaultProps = {
		onMouseDirection: (direction) => {},
		bodyStyle: {},
	};

	render() {
		const { bodyStyle, children } = this.props;
		return (
			<div
				style={bodyStyle}
				onMouseEnter={(e) => this.enter(e)}
				onMouseLeave={(e) => this.leave(e)}>
				{children}
			</div>
		);
	}

	componentDidMount() {}

	enter(e) {
		const dire = this.getDirection(e);
		console.log('鼠标移入' + this.direction[dire]);
		this.props.onMouseDirection(this.direction[dire]);
	}
	leave(e) {
		const dire = this.getDirection(e);
		console.log('鼠标移出' + this.direction[dire]);
		this.props.onMouseDirection(this.direction[dire]);
	}

	onMouseDirection(e) {
		this.getDirection(e);
	}
	// 获取方向
	direction = ['top', 'right', 'bottom', 'left'];
	getDirection(e) {
		const dom = e.currentTarget,
			{ clientWidth: w, clientHeight: h, offsetLeft, offsetTop } = dom,
			x = (e.pageX - offsetLeft - w / 2) * (w > h ? h / w : 1),
			y = (e.pageY - offsetTop - h / 2) * (h > w ? w / h : 1);

		return (
			Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4
		);
	}
}

export default MouseDirection;
