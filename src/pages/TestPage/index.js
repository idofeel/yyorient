import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

export default class Index extends Component {
	render() {
		return (
			<InfiniteScroll
				pageStart={0}
				loadMore={() => {
					console.log('加载更多');
				}}
				hasMore={true || false}
				loader={
					<div key="InfiniteScrollloader" className="loader">
						Loading ...
					</div>
				}>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
				<p>123</p>
			</InfiniteScroll>
		);
	}
}
