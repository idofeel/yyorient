import React from 'react';
import logo from 'images/logo.png';

import './ScaleImg.less'

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
 * 
 * 
 * 
 *         
 * options 的属性说明
 *  设置边界
 *      bounding    类型：Boolean     true 有边界，以可显示区域的边为边界；false 无边界，可任意拖拽
 *                  类型：Obejct      {offsetLeft: Number, offsetTop: Number} 图片在屏幕中剩余的宽度/高度 (最大值为图片的宽度高度，超出按图片最大值)
 *      
 */


// const imgs = require('../../assets/images/3.jpg')
export default class extends React.Component {
    constructor(props) {
        super(props);
        const { options = { bounding: false }, onDrag = () => { } } = props; //接收参数
        this.state = {
            top: 0,//图片离顶部的距离
            left: 0,//图片左边界的距离
            scaleX: 1,//缩放X轴比例
            scaleY: 1,//缩放Y轴比例
            translateX: 0,//X轴移动距离
            translateY: 0,//Y轴移动距离
            originX: 0,// 放大X中心点
            originY: 0, // 放大Y中心点
            width: 0, //图片宽
            height: 0, //图片高
            rows: [],
            arerialLeft: 10,
            arerialTop: 0,
            arerialWidth: 0,
            arerialHeight: 0
        }
        this.resizeBind = this.resize.bind(this);
        this.bounding = options.bounding === undefined ? false : options.bounding; //设置是否允许边界
        this.onDrag = onDrag;
    }
    scales = [1, 2, 1, 3]; //缩放比例
    currentScale = 1; //当前比例
    currentScaleIndex = 0; //当前比例下标
    touch = false; //是否触摸
    touchTime = 0; //记录touch端是否双击 
    initWidth = 0;
    initHeight = 0;
    bounceTimer = null;

    UNSAFE_componentWillMount() {
        let { imgWidth, imgHeight } = this.getPictrueWidthAndHeight();
        this.setState({
            width: imgWidth,
            height: imgHeight
        });
    }

    componentDidMount() {
        this.screenChange();// 监听屏幕改变
        this.initPicture();

    }

    // 初始化图片宽高及显示位置
    initPicture(up) {
        let { visivbleWidth, visivbleHeight } = this.getVisivbleWidthAndHeight();
        let { imgWidth, imgHeight } = this.getPictrueWidthAndHeight();
        // 图片放大后
        // visivbleWidth = visivbleWidth % 2 != 0 ? visivbleWidth - 1 : visivbleWidth;
        // visivbleHeight = visivbleHeight % 2 != 0 ? visivbleHeight - 1 : visivbleHeight;

        // 根据屏幕宽高和图片的宽高进行取中显示
        let WScale = visivbleWidth / imgWidth,
            HScale = visivbleHeight / imgHeight,
            minScale = WScale < HScale ? WScale : HScale,
            { width, height, } = this.state,
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
        } else {
            if (up === false) return;
        }
        // 初始宽高
        this.initWidth = width;
        this.initHeight = height;
        // 可视区域
        // this.visivbleWidth = visivbleWidth;
        // this.visivbleHeight = visivbleHeight;

        // 初始化图片宽高，居中显示
        this.setState({
            width,
            height,
            top,
            left,
            // originX: this.currentScale * imgWidth / 2,
            // originY: this.currentScale * imgHeight / 2,
            rows: this.visivbleMatrix(1, { width, height }),
        });

    }

    render() {
        const { width, height, top, left, translateX, translateY, originX, originY, scaleX, scaleY } = this.state;
        const { uri } = this.props;
        const pictrueStyle = {
            width,
            height,
            top,
            left,
            transform: `scale(${scaleX},${scaleY}) translate(${translateX}, ${translateY})`,
            transformOrigin: `${originX}px ${originY}px`,
        };
        return (
            <div ref="visivbleArea" className="visivbleArea"
                onMouseMove={this.touchMove.bind(this)}
                onTouchEnd={this.touchEnd.bind(this)}
                onMouseUp={this.touchEnd.bind(this)}
                onTouchMove={this.touchMove.bind(this)}>

                <div ref="imgContainer"
                    className="pictureArea"
                    onMouseDown={this.touchStrat.bind(this)}
                    onTouchStart={this.touchStrat.bind(this)}
                    onDoubleClick={this.doubleClick.bind(this)}
                    style={pictrueStyle}>
                    {/* 缩略图 */}
                    <img src={uri || logo} alt="" draggable={false} />

                    {/* 真实图片按比例加载区域图片*/}
                    {/* <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                        <div style={{ ...imgStyle, background: `url(${imgs}) ` }} ></div>
                    </div> */}

                    {this.renderPictureBlock()}
                </div>
                {this.renderTools()}
                {this.AerialView()}
            </div>);

    }

    renderTools() {
        return null;
    }

    AerialView() {
        const src = logo;
        // const left = 
        const pos = {
            left: this.state.arerialLeft,
            top: this.state.arerialTop,
            width: this.state.arerialWidth,
            height: this.state.arerialHeight
        }
        return (
            <div ref="arerialView" className="arerialView" >
                <div className="arerialImgBox">
                    <img src={src} draggable={false} ref="arerialImg" />
                    <div
                        ref="arerial"
                        className="arerial"
                        style={{ ...pos }}
                        onMouseDown={this.AerialTouchStrat.bind(this)}
                        // onMouseMove={this.touchMove.bind(this)}
                        // onMouseUp={this.AerialTouchEnd.bind(this)}
                        onTouchStart={this.AerialTouchStrat.bind(this)}
                    ></div>
                    <div></div>
                </div>
            </div>
        );
    }

    AerialTouchStrat(e) {
        this.handleClick({ x: this.state.arerialLeft, y: this.state.arerialTop }, e);
        //绑定移动事件
        this.BindTouchMove = this.AerialTouchMove;
    }

    AerialTouchMove(e) {
        const position = this.handleMove(e);
        if (!position) return;
        const { left: arerialLeft, top: arerialTop } = position;

        const { offsetWidth: arerialImgWidth, offsetHeight: arerialImgHeight } = this.refs.arerialImg; // 鸟瞰图宽高
        const { showWidth, showHeight } = this.getShowWidthAndHeight();// 图片高度

        this.setState(
            this.ViewBounding({
                left: showWidth / (arerialImgWidth / arerialLeft) * -1,
                top: showHeight / (arerialImgHeight / arerialTop) * -1
            }),
        );
    }

    renderPictureBlock() {
        const distance = index => this.state.rows[0].w / this.state.scaleX * index;
        return this.scales.map((item, index) =>
            <div className={`scalebox${item}${index} scaleBox`}
                key={index}
                hidden={item !== this.state.scaleX}>
                {this.state.rows.map((v, i) =>
                    <div className="imgStyle"
                        key={i}
                        style={{ left: distance(i), top: 0, width: v.w / this.state.scaleX, height: v.h / this.state.scaleY }}>
                        <img src={logo} alt=""
                            style={{ position: 'relative', left: -distance(i) + 'px', width: this.state.width, height: this.state.height }}
                            draggable={false} />
                    </div>
                )}
            </div>
        );

    }

    // 点击、触摸事件
    touchStrat(e) {
        // 模拟双击事件
        if (e.type === 'touchstart') {
            if (Date.now() - this.touchTime < 300) {
                this.doubleClick(e);
            }
            this.touchTime = Date.now();
        }
        this.touch = true;
        this.handleClick({ x: this.state.left, y: this.state.top }, e);
        // 绑定一个 独有的移动事件
        this.BindTouchMove = this.ViewerTouchMove;
    }
    // 移动事件
    touchMove(e) {
        this.BindTouchMove(e);
    }

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


    handleClick(currentPos, event) {
        this.touch = true;
        const pos = this.getClientPos(event);
        this.x = pos.x + currentPos.x * -1;
        this.y = pos.y + currentPos.y * -1;
    }

    handleMove(event) {
        if (!this.touch) return;
        const { x, y } = this.getClientPos(event),
            left = (this.x - x) * -1,
            top = (this.y - y) * -1;
        // this.touchMoveCallBack(event);
        return { left, top };
    }

    handleEnd(event) {
        this.touch = false;
        this.BindTouchMove = () => { };//
    }

    // 双击事件
    doubleClick(e) {
        const scale = this.scales[this.currentScaleIndex];
        // 
        if (++this.currentScaleIndex === this.scales.length) this.currentScaleIndex = 0;
        const nextScale = this.scales[this.currentScaleIndex];

        this.scale(nextScale, scale, this.getClientPos(e));

    }

    BindTouchMove() { };

    // 缩放(放大的倍数，当前倍数，放大起点)
    scale(nextScale, scale, origin) {

        const imgBounding = this.refs.imgContainer.getBoundingClientRect(),
            { x, y } = origin || {
                x: this.initWidth * scale / 2 + imgBounding.left,
                y: this.initHeight * scale / 2 + imgBounding.top,
            },
            scaleDiff = nextScale - scale,
            imgLeft = (x - imgBounding.left) / scale,
            imgTop = (y - imgBounding.top) / scale,
            left = imgBounding.left - scaleDiff * imgLeft,
            top = imgBounding.top - scaleDiff * imgTop;
        this.setState({
            ...this.ViewBounding({ left, top }),
            width: this.initWidth * nextScale,
            height: this.initHeight * nextScale,
            rows: this.visivbleMatrix(nextScale),
        }, function () {
            if (this.currentScaleIndex === 0) this.initPicture();
        });



    }

    AerialVisible(imgPosition) {

        const { showWidth, showHeight } = this.getShowWidthAndHeight();// 图片高度
        const { left, top } = imgPosition || this.state;
        const { visivbleWidth, visivbleHeight } = this.getVisivbleWidthAndHeight();// 可显示区域高度

        let { offsetWidth: arerialImgWidth, offsetHeight: arerialImgHeight } = this.refs.arerialImg; // 鸟瞰图宽高

        const arerialLeft = 0 - (arerialImgWidth / (showWidth / left));
        const arerialTop = 0 - (arerialImgHeight / (showHeight / top));

        const arerialWidth = arerialImgWidth / (showWidth / visivbleWidth),
            arerialHeight = arerialImgHeight / (showHeight / visivbleHeight);

        return {
            arerialWidth,
            arerialHeight,
            arerialLeft,
            arerialTop,
            left,
            top
        };

    }

    // 拖动放大进度条时的放大缩小
    dragScale() {

    }



    // 设置图片显示的位置
    setPicturePos(e) {
        return this.ViewBounding(this.handleMove(e));
    }

    ViewBounding(pos) {
        if (this.bounding === false) return this.AerialVisible(pos); //无边界，可任意拖拽
        const { visivbleWidth, visivbleHeight } = this.getVisivbleWidthAndHeight(),
            { showWidth, showHeight } = this.getShowWidthAndHeight(), isBound = this.bounding === true;
        let { left, top } = pos,
            bounding = isBound ? {
                offsetLeft: showWidth,
                offsetTop: showHeight
            } : this.bounding;

        if (bounding.offsetLeft > showWidth) bounding.offsetLeft = showWidth;
        if (bounding.offsetTop > showHeight) bounding.offsetTop = showHeight;

        let MaxLeft = bounding.offsetLeft - showWidth,
            MaxTop = bounding.offsetTop - showHeight,
            MaxRight = visivbleWidth - bounding.offsetLeft,
            MaxBottom = visivbleHeight - bounding.offsetTop;

        if (showWidth > visivbleWidth && isBound) {
            left = left > 0 ? 0 : left < MaxRight ? MaxRight : left;
        } else {
            left = left < MaxLeft ? MaxLeft : left > MaxRight ? MaxRight : left;
        }

        if (showHeight > visivbleHeight && isBound) {
            top = top > 0 ? 0 : top < MaxBottom ? MaxBottom : top;
        } else {
            top = top < MaxTop ? MaxTop : top > MaxBottom ? MaxBottom : top;
        }
        // this.AerialVisible({left,top});

        return this.AerialVisible({ left, top });
    }

    // 获取当前触达的坐标点
    getClientPos(e) {
        let x = e.clientX,
            y = e.clientY;
        if (e.type.indexOf('touch') > -1) {
            x = e.touches[0].pageX;
            y = e.touches[0].pageY;
        }
        return { x, y }
    }
    // 获取可显示区域的宽高
    getVisivbleWidthAndHeight() {
        let { visivbleArea } = this.refs;
        // console.log(`可视区域：${visivbleArea.clientWidth} * ${visivbleArea.clientHeight}`)
        return {
            visivbleWidth: visivbleArea.clientWidth,
            visivbleHeight: visivbleArea.clientHeight
        }
    }

    genCenterPoint() {
        const { visivbleWidth, visivbleHeight } = this.getVisivbleWidthAndHeight();

    }

    getShowWidthAndHeight() {
        return {
            showWidth: (this.scales[this.currentScaleIndex] * this.initWidth).toFixed(2) * 1,
            showHeight: (this.scales[this.currentScaleIndex] * this.initHeight).toFixed(2) * 1
        }
    }

    // 获取图片的宽高
    getPictrueWidthAndHeight() {
        let imgWidth = 1480,
            imgHeight = 410;
        // console.log(`图片尺寸：${imgWidth} * ${imgHeight}`)
        return {
            imgWidth,
            imgHeight
        }
    }

    // 可显示区域的矩阵
    visivbleMatrix(scale, picWh) {
        let { width, height } = picWh || this.state;
        width *= scale;
        height *= scale;
        // let matrix = [];

        let row = Math.floor(width / 100),
            lastRow = width % 100,
            cols = height * scale / 100;
        let matrix = [];
        for (let i = 0; i < row; i++) {
            matrix[i] = { w: 100, h: 100 };
        }
        matrix[matrix.length] = { w: lastRow, h: 100 };

        // console.log(matrix)
        return matrix


    }
    // 窗口发生改变执行的回调
    resize() {
        this.initPicture(false)
    }
    // 监听窗口发生改变
    screenChange() {
        window.addEventListener('resize', this.resizeBind);
    }
    componentWillUnmount() {
        // 销毁监听事件
        window.removeEventListener('resize', this.resizeBind);
        clearTimeout(this.bounceTimer)
    }
}




// 图片和屏幕的关系

/**
    图片的宽度是固定的。 200px * 200px
    屏幕的比例 4:3
    鸟瞰图 200px




*/