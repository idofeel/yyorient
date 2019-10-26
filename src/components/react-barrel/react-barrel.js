import React, { Component } from 'react';

/**
 *
 *
 * @class ReactBarrel
 * @extends {Component}
 *
 * api
 *
 * params 			default		type		desc
 *
 * wrapClassName	''			String		外层容器的类名，用于修改样式
 * baseHeight  		250			Number		基础高度
 * totalWidth		null		Number		继承父级的宽度
 * margin			5			Number		设置每个元素之间的间距
 * children 		null		ReactNode
 * data				[item]		Array		渲染的数据，加载的类型不一样数组的item也不一样（item的数据格式参考loadMethod参数）
 * autoload			true		Boolean		自动加载图片，自动从图片中获取宽高，进行布局(注：{src)
 * 					false		Boolean		关闭自动加载。item为Object，格式：{width,height}
 *
 * renderItem	(item,index)=>{}	function	自定义渲染，回调item，index 样式包含在item中，用于进行自定义调整。
 *
 */

class ReactBarrel extends Component {
	// 默认传入的参数
	static defaultProps = {
		baseHeight: 250, // 基础高度
		data: [], // 数据
		margin: 5, // 图片间的间距
		totalWidth: null,
		wrapClassName: '', // 外层容器的类名
		autoload: true, // 自动加载图片
	};
	constructor(props) {
		super(props);
		this.state = {
			barrelData: [], //木桶布局的数据
		};

		this.totalWidth = props.width; // 木桶布局总宽度
		this.baseHeight = props.baseHeight; // 基础高度
		this.margin = props.margin; // 图片之间间距
		this.autoload = props.autoload === undefined ? true : props.autoload; // 自动加载
		this.resize = this.resize.bind(this); // 绑定事件 窗口重置事件
		this.BarrelContainer = React.createRef();
		if (props.renderItem && typeof props.renderItem !== 'function')
			throw 'renderItem is a not function';
		this.renderItem = props.renderItem || this.renderItem;
	}
	render() {
		const { barrelData } = this.state;
		return (
			<div
				ref={this.BarrelContainer}
				className={this.props.wrapClassName}>
				{barrelData.map(this.renderItem.bind(this))}
			</div>
		);
	}

	renderItem(item, index) {
		const imgProps = {
			key: index,
			src: item.src,
			style: {
				width: item.width,
				height: item.height,
				marginRight: item.margin,
				marginBottom: this.margin,
			},
		};
		return <img {...imgProps} alt="" />;
	}
	async componentDidMount() {
		this.totalWidth = this.totalWidth || this.getAutoWidh();
		// 获取所有来源的图片实际宽高
		let { data } = this.props;
		data = this.autoload
			? await Promise.all(data.map((item) => this.getImgInfo(item.src)))
			: data;
		console.log(data);
		this.initRender(data);
		// 监听屏幕变化
		window.addEventListener('resize', this.resize);
		if (this.totalWidth !== this.getAutoWidh()) this.resize(data);
	}

	getAutoWidh() {
		const dom = this.BarrelContainer.current;
		if (!dom) return 0;
		const style = window.getComputedStyle(dom),
			width =
				dom.offsetWidth -
				parseInt(style.paddingLeft) -
				parseInt(style.paddingRight);
		return width;
	}
	/**
	 * 窗口重置事件，重新初始化渲染
	 */
	resize() {
		if (this.totalWidth === this.getAutoWidh()) return;
		this.totalWidth = this.props.width || this.getAutoWidh(); // 重置高度
		this.initRender(this.firstLoadData);
	}

	/**
	 *
	 * @param {[{width,height,src}]}} data
	 */
	initRender(data) {
		this.firstLoadData = data; // 保留初始化加载的数据，当屏幕重置时重新计算
		// 获取行高一样的图片数据
		const rowHeights = this.getStandardHeight(data);

		let barrelData = []; // 最终渲染的数据
		let wholeWidth = 0; // 计算一行图片的宽度总和
		let tempBarrel = []; // 临时存储一行的数据
		rowHeights.forEach((item) => {
			// 最小高度
			let minHeight = (wholeWidth / this.totalWidth) * this.baseHeight,
				maxHeight;
			// 累加宽度
			wholeWidth += item.width;
			// 将数据放入渲染
			tempBarrel.push(item);
			// 是否够一行数据
			if (wholeWidth > this.totalWidth) {
				// 已经够一行的数据
				maxHeight = (wholeWidth / this.totalWidth) * this.baseHeight; // 最大高度

				const minh = this.baseHeight - minHeight, // 最小高度和基础高度差
					maxh = maxHeight - this.baseHeight; // 最大高度和基础高度差

				if (maxh < minh) {
					// 超出部分离基础值最近
					// 一行总宽度
					const barrel = this.getBarrel(tempBarrel);
					barrelData.push(...barrel); // 放入到一行
					tempBarrel = []; // 重置，新起一行
					wholeWidth = 0; // 重置总宽度
				} else {
					const lastImg = tempBarrel.pop(); // 删除最后一个元素
					const barrel = this.getBarrel(tempBarrel);
					barrelData.push(...barrel); // 放入到一行
					tempBarrel = [lastImg]; // 将最后一个元素的宽度作为最后一行的开始
					wholeWidth = lastImg.width; // 最后一个宽度作为下一行的开始
				}
			}
		});

		barrelData.push(...tempBarrel); //将剩余的不够一行的数据追加到最后

		// 渲染数据
		this.setState({
			barrelData,
		});
	}
	/**
	 * @method 按总宽度获取一行的平均高度
	 * @param {width,height,src} tempBarrel
	 * @returns {width,height,src,marign}
	 */
	getBarrel(tempBarrel) {
		if (!tempBarrel.length) return tempBarrel;
		let sumWidth =
			this.sum(...tempBarrel.map((item) => item.width)) +
			tempBarrel.length * this.margin; // 计算总宽度

		let Barrel = this.getStandardHeight(
			tempBarrel,
			this.baseHeight / (sumWidth / this.totalWidth),
		); // 根据总宽度设置新的高度
		Barrel[Barrel.length - 1].margin = 0; //将最后一个marin设置为 0
		return Barrel;
	}

	sum(...nums) {
		let res = 0;
		for (let i of nums) {
			res += i;
		}
		return res;
	}

	/**
	 *
	 * @param {*} currentWidth
	 * @param {*} baseHeight
	 */
	barrelLayout(currentWidth, baseHeight = this.baseHeight) {
		return (currentWidth / this.totalWidth) * baseHeight;
	}

	/**
	 *	1.根据获取的实际宽高设置成标准高度
	 * @param {[{width:number,height:number,src:string}]} imgwh 图片的宽高
	 * @returns {width,height,src,margin} // 返回标准高度的等比例
	 */
	getStandardHeight(
		imgwh,
		baseHeight = this.baseHeight,
		margin = this.margin,
	) {
		return imgwh.map((item) => {
			const { width, height, src } = item;
			const imgRatio = height / baseHeight; // 根据基础高度获取图片比例
			return {
				height: baseHeight, // 将图片设置为基础高度
				width: width / imgRatio, // 等比缩放宽度
				src, // 图片地址
				// realWidth: width, // 图片真实宽度
				// realHeight: height, // 图片真实高度
				margin,
			};
		});
	}

	/**
	 * 0.获取图片真实宽高
	 * @param {*} url 图片地址
	 * @returns {Promise}  res {width,height,src}
	 */
	getImgInfo(url) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.src = url;
			const run = () => {
				if (img.width > 0 || img.height > 0) {
					resolve({
						width: img.width,
						height: img.height,
						src: url,
					});
				} else {
					window.requestAnimationFrame(run);
				}
			};
			run();

			// let timer = setInterval(function () {

			// 	if (img.width > 0 || img.height > 0) {
			// 		resolve({
			// 			width: img.width,
			// 			height: img.height,
			// 			src: url,
			// 		});
			// 		clearInterval(timer);
			// 	}
			// }, 50);
		});
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
}

export default ReactBarrel;
