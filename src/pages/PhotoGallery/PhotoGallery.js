import React, { Component } from 'react'
import ImgModal from '../ImgModal'
import { Tabs, Anchor, Tag } from 'antd';
import './photoGallery.less';
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
        activeKey: "0"
    }
    render() {
        const { menuTabs, activeKey } = this.state;
        return (
            <>
                <Anchor className="tabs-wrapper">
                    <Tabs
                        tabBarGutter={0}
                        animated={false}
                        activeKey={activeKey}
                        onChange={(index) => {
                            this.tabChange(index);
                        }}
                        className="menuTabs" >
                        {menuTabs.map((item, index) => (
                            <TabPane
                                tab={
                                    <div className="yy-tabs-tab" onMouseEnter={() => {
                                        this.tabChange(index);
                                    }}>
                                        {item.name}
                                    </div>
                                }
                                key={index}
                            >

                                {this.renderCategories(item)}
                            </TabPane>
                        ))}
                    </Tabs>
                    123
                </Anchor>

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
    hide = false;
    renderCategories(item) {
        const { categories, selectedTags, hideCate } = this.state
        return (
            <div className="categoriesBox" onMouseLeave={() => {
                this.setState({
                    hideCate: true
                })
            }} hidden={hideCate}>
                {categories.map((item, index) => (
                    <div className="categories" key={index}>
                        <h4 style={{ marginRight: 8, display: 'inline' }}>{item.name}:</h4>
                        {item.data.map(tag => (
                            <CheckableTag
                                key={tag.id}
                                checked={selectedTags.indexOf(tag.id) > -1}
                                onChange={checked => this.handleChange(tag.id, checked)}
                            >
                                {tag.name}
                            </CheckableTag>
                        ))}
                    </div>
                ))}
            </div>

        );

    }

    handleChange(tag, checked) {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        // console.log('You are interested in: ', nextSelectedTags);
        this.setState({ selectedTags: nextSelectedTags });
    }

    handleImg(e = false) {
        this.setState({
            visible: e
        });

    }

    tabChange(key) {
        // this.hide = false;
        this.setState({
            activeKey: key + '',
            hideCate: false
        });
    }

}
