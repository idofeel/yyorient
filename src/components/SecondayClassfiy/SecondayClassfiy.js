
/**
 * 二级分类组件 SecondayClassfiy
 * 
 * 
 * 
 * 
 * event 
 * 
 *  鼠标移动到tab时   参数
 *  
 *  mouseEnterTab   call(item, index)
 * 
 * 点击tab时
 * 
 * 
 * 选取自选项时
 * 
 * 
 * 
 */

import React, { Component } from 'react'
import { Tabs, Anchor, Tag } from 'antd';
import './SecomdayClassfiy.less';
const { TabPane } = Tabs;
const { CheckableTag } = Tag;

export default class SecondayClassfiy extends Component {
    constructor(props) {
        super(props);

        const {
            tabs = [], // tabs
            onChange = () => { }, // 点击tab 发生改变时
            nextActiveKey, // 
            activeKey = '0',
            mouseEnterTab = e => { },
            selectOptions = e => { }
        } = props;

        this.state = {
            tabs,
            nextActiveKey,
            hidePop: true,
            activeKey: activeKey || '0',
        }

        this.onChange = onChange;
        this.mouseEnterTab = mouseEnterTab;
        this.selectOptions = selectOptions;
    }


    render() {
        const { tabs, activeKey, nextActiveKey, hidePop } = this.state;

        return (
            <>
                <Anchor className="yy-tabs-wrapper" >
                    <Tabs
                        tabBarGutter={0}
                        // animated={false}
                        activeKey={nextActiveKey || activeKey}
                        onChange={(index) => {
                            this.onChange(index);
                        }}

                        className="menuTabs" >
                        {tabs.map((item, index) => (
                            <TabPane
                                tab={
                                    <div
                                        className="yy-tabs-tab"
                                        onMouseEnter={() => {
                                            this.mouseEnterTab(item, index);
                                            this.nextCate(index);
                                        }}
                                        onClick={() => {
                                            this.setState({
                                                activeKey: index + '',
                                            });
                                            this.selectOptions(this.refs['Reclassify'+index].state.selectedTags);
                                            this.onChange(index);
                                        }}>
                                        {item.name}
                                    </div>
                                }
                                key={index}
                            >
                                <Reclassify
                                    ref={"Reclassify" + index}
                                    categories={item.categories || []}
                                    // selectedTags={[]}
                                    onSelect={(item) => this.onSelect(item)}
                                    mouseLeave={(selecteds) => this.mouseLeave(selecteds)}
                                    getSelecteds={selecteds => this.selectOptions(selecteds)}
                                    hidden={hidePop}
                                />
                            </TabPane>
                        ))}
                    </Tabs>
                </Anchor>
                <div
                    className="cateBoxMask"
                    onClick={e => this.mouseLeave()}
                    hidden={hidePop}>
                </div>
            </>
        )
    }

    nextCate(key) {
        this.setState({
            nextActiveKey: key + '',
            hidePop: false
        });
        this.onChange(key)
    }

    mouseLeave(selecteds) {
        this.prevCate();
    }
    // 选择菜单选项
    onSelect(item) {
        const { nextActiveKey, activeKey } = this.state;
        if (nextActiveKey && nextActiveKey !== activeKey) {
            this.setState({
                activeKey: nextActiveKey,
                nextActiveKey: '',
                hidePop: false,
            });
        }
        this.selectOptions(item);
    }

    prevCate() {
        const { activeKey } = this.state
        this.setState({
            activeKey: activeKey,
            nextActiveKey: '',
            hidePop: true
        })
        this.onChange(activeKey);
    }
}


export class Reclassify extends Component {

    constructor(props) {
        super(props);

        const {
            categories = [],
            selectedTags = [],
            mouseLeave = () => { },
            onSelect = () => { },
            getSelecteds = () => { },
            hidden = false
        } = props;


        this.state = {
            categories,
            selectedTags,
            hidden
        }

        this.mouseLeave = mouseLeave;
        this.onSelect = onSelect;
        this.getSelecteds = getSelecteds

    }

    render() {
        const { categories, selectedTags } = this.state;
        const { hidden } = this.props;
        if (categories.length < 1) return null;
        return (
            <div
                className="categoriesBox"
                onMouseLeave={() => {
                    this.setState({
                        hidden: true
                    })
                    this.mouseLeave(selectedTags)
                }}
                hidden={hidden}
            >
                {categories && categories.map((item, idx) => (
                    <div className="categories" key={idx}>
                        <h4 style={{ marginRight: 8, display: 'inline' }}>{item.name}:</h4>
                        {item.data && item.data.map(tag => (
                            <CheckableTag
                                key={tag.id}
                                checked={selectedTags.indexOf(tag.id) > -1}
                                onChange={checked => {
                                    // this.onSelect(selectedTags)
                                    this.handleChange(tag.id, checked, idx)
                                }}
                            >
                                {tag.name}
                            </CheckableTag>
                        ))}
                    </div>
                ))}
            </div>

        );
    }
    getSelecteds() {
        return this.state.selectedTags
    }

    handleChange(tag, checked, index) {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        this.setState(
            { 
                selectedTags: nextSelectedTags, 
                activeKey: index + '' 
            },
            () => {
                this.onSelect(this.state.selectedTags);
            });
    }

}