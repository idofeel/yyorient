import React, { Component } from 'react'
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';


export default class YZone extends Component {
    state = {
        menuTabs: [
            {
                name: '全部'
            },
            { name: '中国书法' },
            {
                name: '油画',
            },
            { name: '版画' },
            { name: '水彩水粉' },
            { name: '素描速写' },
            { name: '漆画' },
            { name: '雕塑' },
        ],

    }

    render() {
        const { menuTabs } = this.state;

        return (
            <>
                <SecondayClassfiy
                    tabs={menuTabs}
                    onChange={(index) => { this.onChange(index) }}
                    // mouseEnterTab={this.onMouseEnter}
                    selectOptions={item => {
                        this.selectOptions(item);
                    }}
                />

                1111
            </>
        )
    }

    onChange(index) {
        let { menuTabs } = this.state;

        // 发生改变
        if (!menuTabs[index].categories) menuTabs[index].categories = [{
            name: 'xxx', id: 123,
            data: [
                {
                    name: menuTabs[index].name, id: Math.random(),
                },
                {
                    name: menuTabs[index].name, id: Math.random(),
                }
                , {
                    name: menuTabs[index].name, id: Math.random(),
                }
            ]
        }];

        this.setState({ menuTabs });
    }

    selectOptions(item) {
        console.log(item)

    }

}
