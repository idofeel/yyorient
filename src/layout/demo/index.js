import React, { Component } from 'react';
import TopMenus from '../../layout/page';

class TopMenusDemo extends Component {
	pageName = 'pageName';
	state = {
		empty: false,
		loading: true,
		showBreadcrumb: true,
	};
	render() {
		const { empty, loading, showBreadcrumb } = this.state;
		return (
			<div>
				<TopMenus
					pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
					showBreadcrumb={showBreadcrumb}
					empty={empty}
					loading={loading}></TopMenus>
			</div>
		);
	}

	cateIdsLoad = ({ selectids, tabIndex, breadcrumb }) => {};
	tabChange = (item, index) => {};

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
}

export default TopMenusDemo;
