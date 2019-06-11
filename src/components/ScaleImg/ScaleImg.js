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
 * AerialView  |    Number      |     200       |     可选参数
 * 
 * --------------------------------------------------------------------------------
 * options 参数  Object
 * 
 *  bounding   默认值：false   设置边界
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
import logo from 'images/logo.png';

import './ScaleImg.less'


// const imgs = require('../../assets/images/3.jpg')
export default class extends React.Component {
    constructor(props) {
        super(props);
        const { options = { bounding: false }, onDrag = () => { }, AerialView = 200 } = props; //接收参数,设置默认值；
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
            aerialLeft: 0, //鸟瞰图左边界的距离
            aerialTop: 0, //鸟瞰图离顶部的距离
            aerialWidth: 0, //鸟瞰图显示区域
            aerialHeight: 0, //鸟瞰图显示区域
            aerialViewShow: true // 显示鸟瞰图  注：（暂由图片超宽超高控制）
        }
        // 初始化一些需要用的参数；
        this.resizeBind = this.resize.bind(this); //绑定窗口改变事件
        this.bounding = options.bounding === undefined ? false : options.bounding; //设置是否允许边界
        this.maxOffset = options.offset ? options.offset : 0; // 兼容边界的偏移量
        this.onDrag = onDrag; // 拖动图片时的事件 
        this.AerialViewWidth = typeof AerialView === 'number' ? AerialView : AerialView.width || 200; //鸟瞰图容器宽度
        this.AerialViewHeight = typeof AerialView === 'number' ? AerialView : AerialView.height || 200; //鸟瞰图容器高度
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
        const aerialState = this.AerialVisible({ left, top });

        // 初始化图片宽高，居中显示
        this.setState({
            width,
            height,
            ...aerialState,
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
                {this.renderAerialView()}
            </div>);

    }

    renderTools() {
        return null;
    }

    renderAerialView() {

        if (this.state.aerialViewShow !== true) return null;

        const src = logo;
        // const left = 
        const pos = {
            left: this.state.aerialLeft,
            top: this.state.aerialTop,
            width: this.state.aerialWidth,
            height: this.state.aerialHeight
        }

        // width = 200 * (width / height);
        // height = 200;
        return (
            <div ref="aerialView" className="aerialView" style={{ width: this.AerialViewWidth, height: this.AerialViewHeight }}>
                <div className="aerialImgBox">
                    <div ref="aerialImg" className="aerialImg" style={this.aerialImgSize()}>
                        <img src={src} draggable={false} className="notSelect" />
                    </div>
                    <div
                        ref="aerial"
                        className="aerial"
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
        this.handleClick({ x: this.state.aerialLeft, y: this.state.aerialTop }, e);
        //绑定移动事件
        this.BindTouchMove = this.AerialTouchMove;
    }

    AerialTouchMove(e) {
        const position = this.handleMove(e);
        if (!position) return;
        const { left: aerialLeft, top: aerialTop } = position;

        const { offsetWidth: aerialImgWidth, offsetHeight: aerialImgHeight } = this.refs.aerialImg; // 鸟瞰图宽高
        console.log(aerialImgWidth, aerialImgHeight)
        const { showWidth, showHeight } = this.getShowWidthAndHeight();// 图片高度

        const states = this.ViewBounding({
            left: showWidth / (aerialImgWidth / aerialLeft) * -1,
            top: showHeight / (aerialImgHeight / aerialTop) * -1
        });
        // 
        this.setState(states);
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
        // 绑定一个其它移动事件
        this.BindTouchMove = this.ViewerTouchMove;
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

    // 鸟瞰图大小
    aerialImgSize() {
        let { AerialViewWidth: width, AerialViewHeight: height } = this;
        const { imgWidth, imgHeight } = this.getPictrueWidthAndHeight(); // 图片高度

        if (imgWidth > imgHeight) {
            height = width / (imgWidth / imgHeight); // 当图片宽度大于高度 
        } else {
            width = height * (imgWidth / imgHeight); // 当图片高度大于宽度 
        }

        return { width, height };
    }

    // 拖动放大进度条时的放大缩小
    dragScale() {

    }



    // 设置图片显示的位置
    setPicturePos(e) {
        return this.ViewBounding(this.handleMove(e));
    }

    // 视图边界
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

        // 增加偏移量
        let MaxLeft = bounding.offsetLeft - showWidth - this.maxOffset,
            MaxTop = bounding.offsetTop - showHeight,
            MaxRight = visivbleWidth - bounding.offsetLeft,
            MaxBottom = visivbleHeight - bounding.offsetTop;

        if (showWidth > visivbleWidth && isBound) {
            MaxRight -= this.maxOffset;
            left = left > this.maxOffset ? this.maxOffset : left < MaxRight ? MaxRight : left;
        } else {
            MaxRight += this.maxOffset
            left = left < MaxLeft ? MaxLeft : left > MaxRight ? MaxRight : left;
        }

        if (showHeight > visivbleHeight && isBound) {
            MaxBottom -= this.maxOffset;
            top = top > this.maxOffset ? this.maxOffset : top < MaxBottom ? MaxBottom : top;
        } else {
            MaxTop -= this.maxOffset;
            MaxBottom += this.maxOffset;
            top = top < MaxTop ? MaxTop : top > MaxBottom ? MaxBottom : top;
        }
        // this.AerialVisible({left,top});

        return this.AerialVisible({ left, top });
    }

    // 鸟瞰图显示
    AerialVisible(imgPosition) {
        let aerialState = {};
        const { left, top } = imgPosition || this.state;
        const { showWidth, showHeight } = this.getShowWidthAndHeight(); // 图片高度
        const { visivbleWidth, visivbleHeight } = this.getVisivbleWidthAndHeight(); // 可显示区域高度
        const { width, height } = this.aerialImgSize() || this.refs.aerialImg; // 鸟瞰图宽高

        aerialState = {
            aerialWidth: width / (showWidth / visivbleWidth),
            aerialHeight: height / (showHeight / visivbleHeight),
            aerialLeft: - (width / (showWidth / left)),
            aerialTop: - (height / (showHeight / top))
        }

        return {
            aerialViewShow: showWidth > visivbleWidth || showHeight > visivbleHeight, //当屏幕显示不全图片时展示 鸟瞰图
            ...aerialState,
            left,
            top
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
        let imgWidth = 1300,
            imgHeight = 100;
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
