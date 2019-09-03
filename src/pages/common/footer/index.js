import React from 'react';
import './footer.less';

export default function Footer() {
	return (
		<div className="pageFooter">
			<div className="footer">
				<span>
					<a>关于我们</a> | <a>联系我们</a> | <a>商务合作</a>
				</span>

				<span>
					版权所有&copy;北京雅韵东方文化科技有限公司
					<span style={{ marginLeft: '30px' }}>京ICP备090326号</span>
				</span>
			</div>
		</div>
	);
}
