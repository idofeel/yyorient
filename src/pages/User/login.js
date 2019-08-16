import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Checkbox, Icon, Message } from 'antd';
import { email_reg } from '../../utils/Regexp';
import './login.less';

@connect()
class Login extends Component {
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<Form.Item>
					{getFieldDecorator('username', {
						rules: [
							{ required: true, message: '请输入您的用户名' },
							{
								pattern: email_reg,
								validator: this.validatorForm,
								message:
									'请输入正确的邮箱格式,如: 375163888@qq.com',
							},
						],
					})(
						<Input
							prefix={
								<Icon
									type="user"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							placeholder="请输入您的手机号/邮箱"
						/>,
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: '请输入您的密码!' }],
					})(
						<Input
							prefix={
								<Icon
									type="lock"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							type="password"
							placeholder="请输入密码"
						/>,
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('remember', {
						valuePropName: 'checked',
						initialValue: true,
					})(<Checkbox>记住我</Checkbox>)}
					<a className="login-form-forgot" href="">
						忘记密码
					</a>
					<Button
						type="primary"
						htmlType="submit"
						onClick={(e) => {
							this.onSubmit(e);
						}}
						className="login-form-button">
						登录
					</Button>
					<a href="#/register">现在注册！</a>
				</Form.Item>
			</Form>
		);
	}

	// login
	onSubmit() {
		// console.log(this)
		this.props.form.validateFields((err, values) => {
			if (err) return;
			const { username, password } = values;
			const res = { username: '375163888@qq.com', password: '123456' };
			let login = [res];
			if (res) {
				// 匹配账号密码
				login = login.filter(
					(user) =>
						user.password === password &&
						user.username === username,
				);
			}

			if (login && login.length > 0) {
				// 存储登录信息
				this.props
					.dispatch({
						type: 'global/setUserInfo',
						payload: login[0],
					})
					.then(() => {
						this.props.history.push('/');
					});
			} else {
				Message.error('账号或密码错误');
			}
			// console.log(login);
		});
	}
}

export default Form.create({ name: 'normal_login' })(Login);
