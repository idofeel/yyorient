import React, { Component } from 'react';
import { connect } from 'dva';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';
import { Breadcrumb, Spin } from 'antd';
import Style from './index.less';

@connect(({ menus }) => ({ menus }))
class TopMenus extends Component {
	static defaultProps = {
		loading: false,
		showBreadcrumb: false,
		pageName: 'home',
		cateIdsLoad: () => {},
		tabChange: () => {},
	};
	state = {
		loading: true,
		breadcrumb: [],
	};
	render() {
		const { breadcrumb } = this.state;
		const { showBreadcrumb, loading, children } = this.props;
		return (
			<div>
				<SecondayClassfiy
					// pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
				/>
				{showBreadcrumb && (
					<Breadcrumb separator='>' className={Style.pageBreadcumb}>
						{breadcrumb.map((item, index) => (
							<Breadcrumb.Item key={index} href={'#' + item.path}>
								{item.name}
							</Breadcrumb.Item>
						))}
					</Breadcrumb>
				)}
				<div className={Style.menusContent}>
					<Spin spinning={loading} size='large'>
						{children}
					</Spin>
				</div>
			</div>
		);
	}
	cateIdsLoad = (params) => {
		this.setState({
			breadcrumb: params.breadcrumb,
		});
		this.props.cateIdsLoad(params);
	};

	tabChange = (item, index) => {
		this.props.tabChange(item, index);
	};
}

export default TopMenus;