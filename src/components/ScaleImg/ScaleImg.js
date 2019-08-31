/**
 * 图片查看器组件
 *
 * PictureView Component API
 * 
 *  import PictureView from './PictureViewr';
 * 

 * Props
 *   Name            Type            Default             Description
 * --------------------------------------------------------------------------------
 * uri         |    String      |     ''        |     * 必填 图片的地址
 * options     |    Object      |     {}        |     可选参数 (见下方说明)
 * AerialShow  |    Boolean     |     true      |     是否显示鸟瞰图
 * AerialView  |    Number      |     200       |     可选参数
 * 
 * --------------------------------------------------------------------------------
 * 
 * options 参数  Object
 * 
 *  bounding   默认值：false   设置拖动边界
 *             类型：Boolean     true 有边界，以可显示区域的边为边界；false 无边界，可任意拖拽
 *             类型：Obejct      { offsetLeft: Number, offsetTop: Number } 图片在屏幕中剩余的宽度/高度 (最大值为图片的宽度高度，超出按图片最大值)
 *   
 *  offset  默认值：0    边界偏移量    * 当bounding为Bool时也可以使用  当有边界时，又想留一点边界时使用
 *          类型：Number      当前边界的总偏移量 
 *  
 * --------------------------------------------------------------------------------
 * AerialView 参数  Object / Number     默认值 200
 *  当为Object 时结束以下两个参数；
 *      width       Number        默认值：200
 *      height      Number        默认值：200
 * 
 * 
 * 
 */

import React from 'react';
// import logo from 'Assets/abcdef/abcdef-1x_0_0.jpg';
import './ScaleImg.less';
import { root } from '../../services/api';

// const imgs = require('../../assets/images/3.jpg')
export default class extends React.Component {
	constructor(props, state) {
		super(props);
		const {
			dataSource = [],
			options = { bounding: false },
			onDrag = () => {},
			AerialView = 200,
			AerialShow = true,
		} = props; //接收参数,设置默认值；
		this.state = {
			top: 0, //图片离顶部的距离
			left: 0, //图片左边界的距离
			scaleX: 1, //缩放X轴比例
			scaleY: 1, //缩放Y轴比例
			translateX: 0, //X轴移动距离
			translateY: 0, //Y轴移动距离
			originX: 0, // 放大X中心点
			originY: 0, // 放大Y中心点
			width: 0, //图片宽
			height: 0, //图片高
			rows: [],
			aerialLeft: 0, //鸟瞰图左边界的距离
			aerialTop: 0, //鸟瞰图离顶部的距离
			aerialWidth: 0, //鸟瞰图显示区域
			aerialHeight: 0, //鸟瞰图显示区域
			aerialViewShow: true, // 显示鸟瞰图  注：（暂由图片超宽超高控制显示不显示）
			aerialShow: AerialShow, //强制是否显示鸟瞰图。
			fullScreen: false, //是否全屏
			...state,
		};
		// 初始化一些需要用的参数；
		this.resizeBind = this.resize.bind(this); //绑定窗口改变事件
		this.bounding =
			options.bounding === undefined ? false : options.bounding; //设置是否允许边界
		this.maxOffset = options.offset ? options.offset : 0; // 兼容边界的偏移量
		this.onDrag = onDrag; // 拖动图片时的事件
		this.AerialViewWidth =
			typeof AerialView === 'number'
				? AerialView
				: AerialView.width || 200; //鸟瞰图容器宽度
		this.AerialViewHeight =
			typeof AerialView === 'number'
				? AerialView
				: AerialView.height || 200; //鸟瞰图容器高度
		this.initLoadData = dataSource.splice(0, 1)[0]; // 将第一条数据作为初始显示倍数。
		this.dataSource = dataSource;
		this.imgUrl = this.url({
			...this.initLoadData,
			row: 0,
			col: 0,
		});
	}
	scales = [1]; //缩放比例
	currentScale = 1; //当前比例
	minScale = 1; //最小缩放距离
	maxScale = 1;
	scaleLoop = false; // 缩放是否循环
	currentScaleIndex = 0; //当前比例下标
	touch = false; //是否触摸
	touchTime = 0; //记录touch端是否双击
	bounceTimer = null;
	doc = document;
	docFrag = document.createDocumentFragment();
	imageSource = {};
	imageData = [];
	url = (data) =>
		`${root}${data.baseurl}/${data.imgid}-${data.sizeid}_${data.row}_${
			data.col
		}.${data.ex || 'jpg'}`;
	onReay() {}
	onLoad() {}
	UNSAFE_componentWillMount() {
		// 文档碎片
		this.onLoad();
		// let { imgWidth, imgHeight } = this.getPictrueWidthAndHeight();

		this.scales = this.dataSource.map(
			(item) => (item.imgw / this.initLoadData.imgw).toFixed(1) * 1,
		);

		// this.setState({
		//     width: imgWidth,
		//     height: imgHeight
		// });
	}

	componentDidMount() {
		this.onReay();
		this.screenChange(); // 监听屏幕改变
		this.reset(); // 重置
	}

	reset() {
		const state = this.initPicture();
		this.setState(state);
	}

	initBefore() {}

	// 初始化图片宽高及显示位置
	initPicture(up) {
		// 初始化参数
		this.currentScaleIndex = 0;
		this.currentScale = 1;
		// 获取宽高
		const {
			visivbleWidth,
			visivbleHeight,
		} = this.getVisivbleWidthAndHeight();
		const { imgWidth, imgHeight } = this.getPictrueWidthAndHeight();
		// 图片放大后
		// visivbleWidth = visivbleWidth % 2 != 0 ? visivbleWidth - 1 : visivbleWidth;
		// visivbleHeight = visivbleHeight % 2 != 0 ? visivbleHeight - 1 : visivbleHeight;

		// 根据屏幕宽高和图片的宽高进行取中显示
		let WScale = visivbleWidth / imgWidth,
			HScale = visivbleHeight / imgHeight,
			minScale = WScale < HScale ? WScale : HScale,
			width = imgWidth,
			height = imgHeight,
			// { width, height, } = this.state,
			top = (visivbleHeight - imgHeight) / 2,
			left = (visivbleWidth - imgWidth) / 2;
		// 图片超宽超高 或 宽高某项小于2倍
		// if (minScale < 1 || minScale > 2) {

		if (minScale < 1) {
			width = imgWidth * minScale;
			height = imgHeight * minScale;
			top = (visivbleHeight - height) / 2;
			left = (visivbleWidth - width) / 2;
			this.currentScale = minScale;
			this.minScale = minScale;
		} else {
			// if (up === false) return;
		}

		// 可视区域
		// this.visivbleWidth = visivbleWidth;
		// this.visivbleHeight = visivbleHeight;
		const aerialState = this.AerialVisible({ left, top });

		this.maxScale = this.scales[this.scales.length - 1] || 1;

		this.renderMeta({ width, height, ...aerialState });
		// 初始化图片宽高，居中显示
		const nextState = {
			width,
			height,
			...aerialState,
			// originX: this.currentScale * imgWidth / 2,
			// originY: this.currentScale * imgHeight / 2,
			// windowMeta: this.visivbleMatrix({ width, height, ...aerialState }),
		};

		const state = this.initBefore(nextState) || nextState;

		return state;
	}

	renderMeta(picWh) {
		const nextScale = this.scales.indexOf(
			this.scales.filter((i) => i >= this.currentScale)[0],
		);
		const scaleMeta = { ...picWh, nextScale };
		this.imageData[nextScale]
			? this.setScaleMeta(scaleMeta)
			: this.getScaleMeta(scaleMeta);
	}
	getRowsAndCols(data) {
		let { left, top } = data || this.state;
		const {
			visivbleWidth,
			visivbleHeight,
		} = this.getVisivbleWidthAndHeight();
		let meta = this.dataSource[data.nextScale];
		left = Math.abs(left);
		top = Math.abs(top);
		let minCol = Math.floor(left / meta.wmax), //从第几列开始显示
			maxCol = minCol + Math.ceil(visivbleWidth / meta.wmax),
			minRow = Math.floor(top / meta.hmax), //从第几行开始显示
			maxRow = minRow + Math.ceil(visivbleHeight / meta.hmax);

		maxCol = maxCol > 1 ? maxCol : maxCol > meta.cols ? meta.cols : maxCol;
		maxRow = maxRow > 1 ? maxRow : maxRow > meta.rows ? meta.rows : maxRow;

		return { minCol, maxCol, minRow, maxRow, meta };
	}
	setScaleMeta(data) {
		let { minCol, maxCol, minRow, maxRow } = this.getRowsAndCols(data);

		this.imageData[data.nextScale].map((item) => {
			if (
				item.col >= minCol &&
				item.col <= maxCol &&
				item.row >= minRow &&
				item.row <= maxRow
			)
				item.visible = true;
			return item;
		});

		// for (let i = minRow; i <= maxRow; i++) {
		//     for (let j = minCol; j < maxCol; j++) {
		//         const index = i * meta.cols + j;
		//         try {
		//             this.imageData[data.nextScale][index].visible = true;
		//         } catch (err) {
		//             console.log('errrrrr', index, this.imageData[data.nextScale])
		//             console.log(minCol, maxCol, minRow, maxRow)
		//         }
		//     }
		// }
	}
	getScaleMeta(data) {
		const { minCol, maxCol, minRow, maxRow, meta } = this.getRowsAndCols(
			data,
		);
		let lastRow = meta.imgw % meta.wmax || meta.wmax,
			lastCol = meta.imgh % meta.hmax || meta.hmax,
			metaLen = meta.rows * meta.cols,
			meteData = [];
		// meta.baseurl = this.baseurl;

		// datas[meta.sizeid] = this.imageSource[meta.sizeid] || [];
		let row = 1,
			col = 0;

		for (let i = 1; i <= metaLen; i++) {
			const tempi = i - 1;
			let isShow = {
				col: false,
				row: false,
			};
			//
			if (col >= minCol && col <= maxCol) isShow.col = true;
			if (row - 1 >= minRow && row - 1 <= maxRow) isShow.row = true;

			meteData[tempi] = { w: meta.wmax, h: meta.hmax, col, row: row - 1 };

			// 最后一行
			col = i % meta.cols;
			if (row % meta.rows === 0) {
				meteData[tempi].h = lastCol;
			}
			// 最后一列
			if (col === 0) {
				meteData[tempi].w = lastRow;
				row++;
			}
			meteData[tempi].visible = isShow.col && isShow.row;
			meteData[tempi].img = this.url({ ...meta, ...meteData[tempi] });
			meteData[tempi].imgw = meta.imgw;
			meteData[tempi].imgh = meta.imgh;
		}

		this.imageData[data.nextScale] = meteData;
		return meteData;
	}

	recalculate() {
		// 重新计算当前left top
		const { left, top } = this.state;
		this.setState({
			...this.ViewBounding({ left, top }),
		});
	}

	render() {
		const {
			width,
			height,
			top,
			left,
			translateX,
			translateY,
			originX,
			originY,
			scaleX,
			scaleY,
		} = this.state;
		// const { uri } = this.props;
		const pictrueStyle = {
			width,
			height,
			top,
			left,
			transform: `scale(${scaleX},${scaleY}) translate(${translateX}, ${translateY})`,
			transformOrigin: `${originX}px ${originY}px`,
		};
		return (
			<div
				ref="visivbleArea"
				className="visivbleArea"
				onMouseMove={this.touchMove.bind(this)}
				onTouchEnd={this.touchEnd.bind(this)}
				onMouseUp={this.touchEnd.bind(this)}
				onTouchMove={this.touchMove.bind(this)}>
				<div
					ref="imgContainer"
					className="pictureArea"
					onMouseDown={this.touchStrat.bind(this)}
					onTouchStart={this.touchStrat.bind(this)}
					onDoubleClick={this.doubleClick.bind(this)}
					style={pictrueStyle}>
					{/* 缩略图 */}
					<img src={this.imgUrl} alt="" draggable={false} />
					{/* 真实图片按比例加载区域图片*/}
					{/* <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                        <div style={{ ...imgStyle, background: `url(${imgs}) ` }} ></div>
                    </div> */}

					{this.renderPictureBlock()}
				</div>
				{this.renderAerialView()}
				{this.renderTools()}
			</div>
		);
	}

	renderTools() {
		return null;
	}

	renderAerialView() {
		if (this.state.aerialViewShow !== true || !this.state.aerialShow)
			return null;

		const pos = {
			left: this.state.aerialLeft,
			top: this.state.aerialTop,
			width: this.state.aerialWidth,
			height: this.state.aerialHeight,
		};

		return (
			<div
				ref="aerialView"
				className="aerialView"
				style={{
					width: this.AerialViewWidth,
					height: this.AerialViewHeight,
				}}>
				<div className="aerialImgBox">
					<div
						ref="aerialImg"
						className="aerialImg"
						style={this.aerialImgSize()}>
						<img
							src={this.imgUrl}
							draggable={false}
							className="notSelect"
							alt=""
						/>
					</div>
					<div
						ref="aerial"
						className="aerial"
						style={{ ...pos }}
						onMouseDown={this.AerialTouchStrat.bind(this)}
						// onMouseMove={this.touchMove.bind(this)}
						// onMouseUp={this.AerialTouchEnd.bind(this)}
						onTouchStart={this.AerialTouchStrat.bind(this)}
					/>
					<div />
				</div>
			</div>
		);
	}

	AerialTouchStrat(e) {
		this.handleClick(
			{ x: this.state.aerialLeft, y: this.state.aerialTop },
			e,
		);
		//绑定移动事件
		this.BindTouchMove = this.AerialTouchMove;
	}

	AerialTouchMove(e) {
		const position = this.handleMove(e);
		if (!position) return;
		const { left: aerialLeft, top: aerialTop } = position;

		const {
			offsetWidth: aerialImgWidth,
			offsetHeight: aerialImgHeight,
		} = this.refs.aerialImg; // 鸟瞰图宽高
		const { showWidth, showHeight } = this.getShowWidthAndHeight(); // 图片高度

		const states = this.ViewBounding({
			left: (showWidth / (aerialImgWidth / aerialLeft)) * -1,
			top: (showHeight / (aerialImgHeight / aerialTop)) * -1,
		});
		//
		this.setState(states);
	}

	// 可显示区域的矩阵
	// 根据当前比例和，图片的
	visivbleMatrix(picWh) {
		// this.imageData = [];

		let { left, top } = picWh || this.state;
		const {
			visivbleWidth,
			visivbleHeight,
		} = this.getVisivbleWidthAndHeight();
		const nextScale = this.scales.indexOf(
			this.scales.filter((i) => i >= this.currentScale)[0],
		);

		let meta = this.dataSource[nextScale],
			lastRow = meta.imgw % meta.wmax || meta.wmax,
			lastCol = meta.imgh % meta.hmax || meta.hmax,
			metaLen = meta.rows * meta.cols,
			meteData = [];
		left = left < 0 ? (left *= -1) : left;
		top = top < 0 ? top * -1 : top;
		let minCol = Math.floor(left / meta.wmax + 1 - 1), //从第几列开始显示
			maxCol = minCol + Math.ceil(visivbleWidth / meta.wmax),
			minRow = Math.floor(top / meta.hmax + 1 - 1), //从第几行开始显示
			maxRow = minRow + Math.ceil(visivbleHeight / meta.hmax);
		meta.baseurl = '/src/assets';

		this.imageSource[meta.sizeid] = this.imageSource[meta.sizeid] || [];
		// this.imageData[this.imageData.length]
		// const url = data => `${data.baseurl}/${data.imgid}/${data.imgid}-${data.sizeid}_${data.row}_${data.col}.${data.ex || 'jpg'}`;
		let row = 1,
			col = 0;

		for (let i = 1; i <= metaLen; i++) {
			const tempi = i - 1;
			let pv = {};
			//
			if (col >= minCol && col <= maxCol) pv.col = col;
			if (row - 1 >= minRow && row - 1 <= maxRow) pv.row = row - 1;

			meteData[tempi] = { w: meta.wmax, h: meta.hmax, ...pv };

			// 最后一行
			col = i % meta.cols;
			if (row % meta.rows === 0) {
				meteData[tempi].h = lastCol;
			}
			// 最后一列
			if (col === 0) {
				meteData[tempi].w = lastRow;
				row++;
			}

			const img =
				pv.row !== undefined && pv.col !== undefined
					? this.url({ ...meta, ...meteData[tempi] })
					: '';

			// let image = {};
			// let images= {};
			// let imgsrc = this.imageSource[meta.sizeid];
			// if(img && !imgsrc.row){
			//     // image = document.createElement('img',{src:img});
			//     // // images = document.createElement('img');
			//     // images.src = img;
			//     // // // image.id = `src${pv.row}${pv.col}`;
			//     // this.docFrag.appendChild(image);
			//     this.imageSource[meta.sizeid]
			//     // this.imageSource[`${pv.row}_${pv.col}`] = images;
			// }

			meteData[tempi].img = img;

			const currentMeta = this.imageSource[meta.sizeid][tempi];
			this.imageSource[meta.sizeid][tempi] =
				currentMeta && currentMeta.img ? currentMeta : meteData[tempi];

			// meteData[tempi].reactDom = image.type ? image : '';
		}
		// document.body.appendChild(this.docFrag);
		// document.body.appendChild(this.docFrag);

		return this.imageSource[meta.sizeid].map((item, index) => {
			return (
				// <div className="imgStyle" style={{ width: item.w / meta.imgw * 100 + '%', height: item.h / meta.imgh * 100 + '%' }}
				<div
					className="imgStyle"
					style={{
						width: (item.w / meta.imgw) * 100 + '%',
						height: (item.h / meta.imgh) * 100 + '%',
					}}
					key={index}>
					{<img src={item.img} lazy={item.img} alt="" />}
				</div>
			);
		});
	}

	renderBlock(index) {
		let meta = this.dataSource[index];
		meta.baseurl = '/src/assets';
		const lastRow = meta.imgw % meta.wmax || meta.wmax,
			lastCol = meta.imgh % meta.hmax || meta.hmax,
			metaLen = meta.rows * meta.cols,
			meteData = [];
		// let x = Math.ceil(meta.imgw / meta.wmax)
		// let y = Math.ceil(meta.imgh / meta.hmax)
		let row = 1,
			col = 0;
		// const url = data => `${data.baseurl}/${data.imgid}/${data.imgid}-${data.sizeid}_${data.row}_${data.col}.${data.ex || 'jpg'}`;

		for (let i = 1; i <= metaLen; i++) {
			meteData[i - 1] = {
				w: meta.wmax,
				h: meta.hmax,
				row: row - 1,
				col: col,
			};
			// 最后一行
			col = i % meta.cols;
			if (row % meta.rows === 0) {
				meteData[i - 1].h = lastCol;
			}
			// 最后一列
			if (col === 0) {
				meteData[i - 1].w = lastRow;
				row++;
			}
			meteData[i - 1].img = this.url({ ...meta, ...meteData[i - 1] });
		}

		return meteData.map((item, index) => {
			return (
				// <div className="imgStyle" style={{ width: item.w / meta.imgw * 100 + '%', height: item.h / meta.imgh * 100 + '%' }}
				<div
					className="imgStyle"
					style={{
						width: (item.w / meta.imgw) * 100 + '%',
						height: (item.h / meta.imgh) * 100 + '%',
					}}
					key={index}>
					<img
						src={item.img}
						lazy={item.img}
						alt=""
						draggable={false}
					/>
				</div>
			);
		});
	}

	renderPictureBlock() {
		// 根据当前比例 获取对应的比例盒子
		let hideScale = this.scales.indexOf(
			this.scales.filter((i) => i >= this.currentScale)[0],
		);
		return this.imageData.map((items, index) => {
			// if (index !== nextScale) return null
			return (
				<div
					className={`scalebox${index} scaleBox`}
					key={index}
					hidden={index > hideScale}>
					{items.map((item, index) => {
						return (
							<div
								className="imgStyle"
								style={{
									width: (item.w / item.imgw) * 100 + '%',
									height: (item.h / item.imgh) * 100 + '%',
								}}
								key={index}>
								{item.visible && <img src={item.img} alt="" />}
							</div>
						);
					})}
				</div>
			);
		});
	}

	// 点击、触摸事件
	touchStrat(e) {
		// 模拟双击事件
		// 单指/单鼠标
		const SingleFinger = (e) => {
			this.touch = true;
			this.handleClick({ x: this.state.left, y: this.state.top }, e);
			// 绑定一个其它移动事件
			this.BindTouchMove = this.ViewerTouchMove;
		};
		e.preventDefault();
		if (e.type === 'touchstart') {
			if (e.touches.length > 1) {
				this.isDobleTouch = true;
				this.touchTime = 0;
				this.getTouchPos(e);
				this.BindTouchMove = this.twoFingers;
			} else {
				if (Date.now() - this.touchTime < 300) {
					this.touchTime = 0;
					this.doubleClick(e);
				}
				this.touchTime = Date.now();
				SingleFinger(e);
			}
		} else {
			SingleFinger(e);
		}
	}

	/**
	 *两点的距离
	 *
	 */
	getSqrt(e) {
		const { pageX: x, pageY: y } = this.getTouchesPage(e, 0),
			{ pageX: x1, pageY: y1 } = this.getTouchesPage(e, 1),
			dfx = x1 - x,
			dfy = y1 - y;

		return Math.sqrt(dfx * dfx + dfy * dfy).toFixed(2);
	}
	/**
	 * 两点的夹角
	 */
	getAngle(e) {
		const p1 = this.getTouchesPage(e, 0),
			p2 = this.getTouchesPage(e, 1),
			x = p1.pageX - p2.pageX,
			y = p1.pageY - p2.pageY;
		return (Math.atan2(y, x) * 180) / Math.PI;
	}

	/*
	 * 获取中❤️点
	 */
	getMidpoint(e) {
		const p1 = this.getTouchesPage(e, 0),
			p2 = this.getTouchesPage(e, 1),
			// x = (p1.pageX + p2.pageX) / 2,
			// y = (p1.pageY + p2.pageY) / 2;
			x = (p1.pageX + p2.pageX) / 2 - e.target.offsetLeft,
			y = (p1.pageY + p2.pageY) / 2 - e.target.offsetTop;
		return { x, y };
	}

	DobTouchStart = 0; // 双指触摸
	tempScale = 1; //临时存储缩放比例
	midPoint = null;
	getTouchPos(e) {
		this.DobTouchStart = this.getSqrt(e);
		this.tempScale = this.currentScale;
		this.midPoint = this.getMidpoint(e);
	}

	twoFingers(e) {
		if (e.touches.length > 1 && this.isDobleTouch) {
			// 获取缩放比例
			const scale =
				this.tempScale + (this.getSqrt(e) / this.DobTouchStart - 1);
			this.setState({
				...this.scale(scale, this.midPoint),
			});
		}
	}

	getTouchesPage(event, index) {
		const touches = event.touches[index];
		return {
			pageX: touches.pageX,
			pageY: touches.pageY,
		};
	}

	// 移动事件
	touchMove(e) {
		this.BindTouchMove(e);
	}

	// 视图中移动
	ViewerTouchMove(e) {
		const position = this.handleMove(e);
		if (!position) return;
		this.onDrag(true);
		this.setState(this.ViewBounding(position));
	}

	// 触摸结束，鼠标抬起事件
	touchEnd(e) {
		this.handleEnd(e);
		this.onDrag(false);
	}

	// 鼠标点击、触摸事件处理
	handleClick(currentPos, event) {
		this.touch = true;
		const pos = this.getClientPos(event);
		this.x = pos.x + currentPos.x * -1;
		this.y = pos.y + currentPos.y * -1;
	}
	// 鼠标、触摸 移动事件处理
	handleMove(event) {
		if (!this.touch) return;
		const { x, y } = this.getClientPos(event),
			left = (this.x - x) * -1,
			top = (this.y - y) * -1;
		// this.touchMoveCallBack(event);
		return { left, top };
	}

	// 鼠标、触摸 结束事件处理
	handleEnd(event) {
		this.touch = false;
		this.isDobleTouch = false;
		this.BindTouchMove = () => {}; //
	}

	// 双击事件
	doubleClick(e) {
		// const nextScale = this.scales.filter(i => i > this.currentScale)[0] || this.minScale;
		const nextScale =
			this.currentScale + (this.maxScale - this.minScale) / 10;
		// if (!nextScale) return this.initPicture();
		const nextScaleState = this.scale(nextScale, this.getClientPos(e));

		this.setState(nextScaleState);
	}

	BindTouchMove() {}

	scaleBefore() {}

	// 缩放(放大的倍数，放大起点)
	scale(nextScale, origin) {
		const scale = this.currentScale,
			{ isMaxScale, nextScale: NextScale } = this.scaleBounding(
				nextScale,
			),
			scaleDiff = NextScale - scale;
		// 没有变化时
		if (scaleDiff === 0) return;
		//需要循环 且 已达到最大值；
		if (isMaxScale === true) return this.initPicture();
		//需要循环 且 已达到最小值；
		// if (isMaxScale === false) ;
		const imgBounding = this.refs.imgContainer.getBoundingClientRect(),
			// { visivbleWidth, visivbleHeight } = this.getVisivbleWidthAndHeight(),
			{ imgWidth, imgHeight } = this.getPictrueWidthAndHeight(),
			{ showWidth, showHeight } = this.getShowWidthAndHeight(),
			{ x, y } = origin || {
				x: this.state.left + showWidth / 2,
				y: this.state.top + showHeight / 2,
			},
			imgLeft = (x - imgBounding.left) / scale,
			imgTop = (y - imgBounding.top) / scale,
			left = imgBounding.left - scaleDiff * imgLeft,
			top = imgBounding.top - scaleDiff * imgTop;
		const NextSize = {
			width: imgWidth * NextScale,
			height: imgHeight * NextScale,
		};

		this.currentScale = NextScale;

		this.renderMeta({ ...NextSize, left, top });
		const scaleState = {
				...this.ViewBounding({ left, top }),
				...NextSize,
				// windowMeta: this.visivbleMatrix({ ...NextSize, left, top }),
			},
			state = this.scaleBefore(scaleState) || scaleState;
		return state;
	}

	scaleBounding(scale = this.currentScale) {
		// 当前缩放 =  小于按最小值处理 大于按最大值处理 都不符合按当前值
		let isMaxScale = null,
			nextScale = scale;
		const isMax = scale > this.maxScale,
			isMin = scale < this.minScale;

		if (this.scaleLoop === true) {
			// 循环
			nextScale = isMin ? this.maxScale : isMax ? this.minScale : scale;
			isMaxScale = isMax ? isMax : isMin ? false : null;
		} else {
			// 不循环，到最小按最小显示；
			nextScale = isMin ? this.minScale : isMax ? this.maxScale : scale;
			isMaxScale = null;
		}

		// isMaxScale  true 需要循环且最大
		//             false 需要循环且最小
		//             null 不循环 或 不是最大页不是最小
		return { isMaxScale, nextScale };
	}

	// 鸟瞰图大小
	aerialImgSize() {
		let { AerialViewWidth: width, AerialViewHeight: height } = this;
		const { imgWidth, imgHeight } = this.getPictrueWidthAndHeight(); // 图片高度

		if (imgWidth * 1 > imgHeight * 1) {
			height = width / (imgWidth / imgHeight); // 当图片宽度大于高度
		} else {
			width = height * (imgWidth / imgHeight); // 当图片高度大于宽度
		}

		return { width, height };
	}

	// // 设置图片显示的位置
	// setPicturePos(e) {
	//     return this.ViewBounding(this.handleMove(e));
	// }

	// 视图边界
	ViewBounding(pos) {
		if (this.bounding === false) return this.AerialVisible(pos); //无边界，可任意拖拽
		const {
				visivbleWidth,
				visivbleHeight,
			} = this.getVisivbleWidthAndHeight(),
			{ showWidth, showHeight } = this.getShowWidthAndHeight(),
			isBound = this.bounding === true;
		let { left, top } = pos,
			bounding = isBound
				? {
						offsetLeft: showWidth,
						offsetTop: showHeight,
				  }
				: this.bounding;
		if (bounding.offsetLeft > showWidth) bounding.offsetLeft = showWidth;
		if (bounding.offsetTop > showHeight) bounding.offsetTop = showHeight;

		// 增加偏移量
		let MaxLeft = bounding.offsetLeft - showWidth - this.maxOffset,
			MaxTop = bounding.offsetTop - showHeight,
			MaxRight = visivbleWidth - bounding.offsetLeft,
			MaxBottom = visivbleHeight - bounding.offsetTop;

		if (showWidth > visivbleWidth && isBound) {
			MaxRight -= this.maxOffset;
			left =
				left > this.maxOffset
					? this.maxOffset
					: left < MaxRight
					? MaxRight
					: left;
		} else {
			MaxRight += this.maxOffset;
			left = left < MaxLeft ? MaxLeft : left > MaxRight ? MaxRight : left;
		}

		if (showHeight > visivbleHeight && isBound) {
			MaxBottom -= this.maxOffset;
			top =
				top > this.maxOffset
					? this.maxOffset
					: top < MaxBottom
					? MaxBottom
					: top;
		} else {
			MaxTop -= this.maxOffset;
			MaxBottom += this.maxOffset;
			top = top < MaxTop ? MaxTop : top > MaxBottom ? MaxBottom : top;
		}
		// this.AerialVisible({left,top});
		const aerialState = this.AerialVisible({ left, top });
		this.renderMeta({ left, top, widht: showWidth, height: showHeight });
		// const windowMeta = this.visivbleMatrix({ left, top, widht: showWidth, height: showHeight })

		return {
			...aerialState,
			// windowMeta,
		};
	}

	// 鸟瞰图显示
	AerialVisible(imgPosition) {
		let aerialState = {};
		const { left, top } = imgPosition || this.state;
		const { showWidth, showHeight } = this.getShowWidthAndHeight(); // 图片高度
		const {
			visivbleWidth,
			visivbleHeight,
		} = this.getVisivbleWidthAndHeight(); // 可显示区域高度
		const { width, height } = this.aerialImgSize() || this.refs.aerialImg; // 鸟瞰图宽高

		aerialState = {
			aerialWidth: width / (showWidth / visivbleWidth),
			aerialHeight: height / (showHeight / visivbleHeight),
			aerialLeft: -(width / (showWidth / left)),
			aerialTop: -(height / (showHeight / top)),
		};
		return {
			aerialViewShow:
				showWidth > visivbleWidth || showHeight > visivbleHeight, //当屏幕显示不全图片时展示 鸟瞰图
			...aerialState,
			left,
			top,
		};
	}

	// 获取当前触达的坐标点
	getClientPos(e) {
		let x = e.clientX,
			y = e.clientY;
		if (e.type.indexOf('touch') > -1) {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		}
		return { x, y };
	}

	// 获取可显示区域的宽高
	getVisivbleWidthAndHeight() {
		const getBoundingClientRect = () => {
				return { clientWidth: 0, clientHeight: 0, left: 0, top: 0 };
			},
			{ visivbleArea = { getBoundingClientRect } } = this.refs,
			container = visivbleArea.getBoundingClientRect(),
			visivbleWidth = container.width - container.left,
			visivbleHeight = container.height - container.top;
		return {
			visivbleWidth,
			visivbleHeight,
		};
	}

	getShowWidthAndHeight() {
		const { imgWidth, imgHeight } = this.getPictrueWidthAndHeight();
		return {
			showWidth: (this.currentScale * imgWidth).toFixed(2) * 1,
			showHeight: (this.currentScale * imgHeight).toFixed(2) * 1,
		};
	}

	// 获取图片的宽高
	getPictrueWidthAndHeight() {
		let imgWidth = this.initLoadData.imgw,
			imgHeight = this.initLoadData.imgh;
		return {
			imgWidth,
			imgHeight,
		};
	}

	// 全屏显示
	fullScreen() {
		const de = document.documentElement;
		if (de.requestFullscreen) {
			de.requestFullscreen();
		} else if (de.mozRequestFullScreen) {
			de.mozRequestFullScreen();
		} else if (de.webkitRequestFullScreen) {
			de.webkitRequestFullScreen();
		}
	}

	// 退出全屏
	exitFullscreen() {
		const de = document;
		if (de.exitFullscreen) {
			de.exitFullscreen();
		} else if (de.mozCancelFullScreen) {
			de.mozCancelFullScreen();
		} else if (de.webkitCancelFullScreen) {
			de.webkitCancelFullScreen();
		}
	}

	// 判断是否在全屏状态
	isFullscreen() {
		return (
			document.fullscreenElement ||
			document.msFullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			false
		);
	}

	onResize() {}
	// 窗口发生改变执行的回调
	resize() {
		// 重新计算
		this.currentScale === this.minScale ? this.reset() : this.recalculate();
		// this.reset()
		this.onResize();
	}
	// 监听窗口发生改变
	screenChange() {
		window.addEventListener('resize', this.resizeBind);
	}
	componentWillUnmount() {
		// 销毁监听事件
		window.removeEventListener('resize', this.resizeBind);
		clearTimeout(this.bounceTimer);
	}
	onUpdate() {}
	componentDidUpdate(prevProps, prevState) {
		this.onUpdate(prevProps, prevState);
	}
}
