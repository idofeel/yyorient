import React, { PureComponent } from 'react';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';
import { Switch } from 'dva/router';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoute';
export default class Famous extends PureComponent {
	constructor(props) {
		super(props);
		// console.log('Famous', props);
	}
	state = {
		menuTabs: [
			{
				name: '全部',
			},
			{
				name: '绘画',
			},
			{
				name: '戏曲',
			},
			{
				name: '工艺',
			},
			{
				name: '其它',
			},
		],
	};

	render() {
		const { menuTabs } = this.state;
		const { routes, app } = this.props;

		return (
			<>
				<SecondayClassfiy
					tabs={menuTabs}
					activeKey="2"
					onChange={(index) => {
						this.onChange(index);
					}}
					// mouseEnterTab={this.onMouseEnter}
					selectOptions={(item) => {
						this.selectOptions(item);
					}}
				/>
				<Switch>
					{routes.map((route, i) => (
						<SubRoutes key={i} {...route} app={app} />
					))}
					<RedirectRoute from={'/famous'} routes={routes} />
				</Switch>
			</>
		);
	}

	onChange(index) {
		let { menuTabs } = this.state;
		// 发生改变
		if (!menuTabs[index].categories) {
			menuTabs[index].categories = [
				{
					name: 'xxx',
					id: 123,
					data: [
						{
							name: menuTabs[index].name,
							id: Math.random(),
						},
						{
							name: menuTabs[index].name,
							id: Math.random(),
						},
						{
							name: menuTabs[index].name,
							id: Math.random(),
						},
					],
				},
			];
		}
		this.setState({ menuTabs });
	}

	selectOptions(item) {
		console.log(item);
		// console.log(item)
	}
}
