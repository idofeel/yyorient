import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import ImgModal from '../ImgModal'
import { Tabs, Anchor, Tag } from 'antd';
import './photoGallery.less';
import Autoresponsive from 'autoresponsive-react';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;

export default class PhotoGallery extends Component {

    state = {
        visible: false,
        scaleImgOptions: {
            bounding: true,
            offset: 80,
        },
        menuTabs: [
            { name: '全部', id: 123 },
            { name: '中国画' },
            { name: '中国书法' },
            { name: '油画' },
            { name: '版画' },
            { name: '水彩水粉' },
            { name: '素描速写' },
            { name: '漆画' },
            { name: '紫砂' },
            { name: '素描速写' },
            { name: '漆画' },
            { name: '素描速写' },
            { name: '漆画' },
            { name: '民间艺术' },
            { name: '建筑' },
            { name: '雕塑' },
        ],
        categories: [
            {
                name: '年代', data: [
                    { id: 1, name: '全部' },
                    { id: 2, name: '秦朝' },
                    { id: 3, name: '魏晋南北朝' },
                    { id: 4, name: '隋' },
                    { id: 5, name: '唐' },
                    { id: 6, name: '五代' },
                    { id: 7, name: '宋' },
                    { id: 8, name: '元' },
                    { id: 9, name: '明' },
                    { id: 10, name: '当代' },

                ]
            },
            { name: '素材', data: [{ id: 2, name: '全部' }] },
            { name: '技法', data: [{ id: 3, name: '全部' }] },
            { name: '型制', data: [{ id: 4, name: '全部' }] },
        ],
        selectedTags: [1],
        activeKey: "0",
        nextActiveKey: '',
    }
    arrayList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    UNSAFE_componentWillMount() {
        this.arrayList = this.arrayList.map(i => this.getItemStyle());
        this.resize = this.resize.bind(this);

    }

    componentDidMount() {
        this.setState({
            containerWidth: ReactDOM.findDOMNode(this.refs.container).clientWidth
        });
        window.addEventListener('resize', this.resize, false);
    }
    getItemStyle() {
        return {
            width: 250,
            height: parseInt(Math.random() * 20 + 12, 10) * 10,
            // height: '200px',
            color: '#fff',
            cursor: 'pointer',
            borderRadius: 5,
            boxShadow: '0 1px 0 rgb(246, 170, 0, 0.5) inset',
            backgroundColor: '#F6AA00',
            borderColor: '#F6AA00',
            fontSize: '80px',
            lineHeight: '100px',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 0px rgb(246, 170, 0)',
            userSelect: 'none',
            // padding: '10px',
            margin: '10px',
        };
    }

    getAutoResponsiveProps() {
        const containerWidth = (this.state.containerWidth || this.props.containerWidth || document.body.clientWidth);

        const cols = Math.floor((containerWidth - 261) / 270);

        // containerMargin = containerMargin < 20 ? 20 : containerMargin;
        return {
            itemMargin: 20,
            containerWidth: (cols + 1) * 270,
            itemClassName: 'item',
            transitionDuration: '.2',
            // closeAnimation:true,
            // gridWidth: containerMargin,
            transitionTimingFunction: 'easeIn'
        };
    }

    render() {
        const { menuTabs, activeKey, hideCate } = this.state;
        const AutoResponsiveProps = this.getAutoResponsiveProps();
        return (
            <>
                <SecondayClassfiy
                    tabs={menuTabs}
                    onChange={(index) => { this.onChange(index) }}
                    selectOptions={(item) => { this.selectOptions(item) }}
                />
                <div className="AutoresponsiveContainer" ref="container">
                    <p>全部：</p>
                    <div style={{ width: AutoResponsiveProps.containerWidth, margin: '0 auto' }}>
                        <Autoresponsive  {...AutoResponsiveProps} >
                            {
                                this.arrayList.map(function (i, index) {
                                    return <div key={index} onClick={() => { this.clickItemHandle() }} style={i} className="item">{index}</div>;
                                }, this)
                            }
                        </Autoresponsive>
                    </div>
                </div>
                <ImgModal
                    visible={this.state.visible}
                    options={this.state.scaleImgOptions}
                    hideModal={() => {
                        this.handleImg();
                    }}
                />
            </>
        )
    }

    onChange(index) {
        let { menuTabs, categories } = this.state;
        menuTabs[index].categories = categories
        this.setState({
            menuTabs
        })
    }

    selectOptions(item) {
        console.log(item)

    }

    clickItemHandle() {
        this.handleImg(true)
    }

    handleImg(e = false) {
        this.setState({
            visible: e
        });

    }

    resize() {
        this.setState({
            containerWidth: ReactDOM.findDOMNode(this.refs.container).clientWidth
        });
    }
    componentWillUnmount() {
        // 销毁监听事件
        window.removeEventListener('resize', this.resize);
    }

}
