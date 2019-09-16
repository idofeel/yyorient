import React, { Component } from 'react';
import { Form, Input, Icon, Row, Col, Button } from 'antd';

// 样式加载
import './register.less';
import logo from 'images/logo.png';

// const { Option } = Select;
// const AutoCompleteOption = AutoComplete.Option;
class Register extends Component {
	state = {
		confirmDirty: false,
		autoCompleteResult: [],
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values);
			}
		});
	};

	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		// const { autoCompleteResult } = this.state;

		// const formItemLayout = {
		// 	labelCol: {
		// 		xs: { span: 24 },
		// 		sm: { span: 8 },
		// 	},
		// 	wrapperCol: {
		// 		xs: { span: 24 },
		// 		sm: { span: 16 },
		// 	},
		// };
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					// span: 16,
					// offset: 8,
				},
			},
		};
		// const prefixSelector = getFieldDecorator('prefix', {
		// 	initialValue: '86',
		// })(
		// 	<Select style={{ width: 70 }}>
		// 		<Option value="86">+86</Option>
		// 		<Option value="87">+87</Option>
		// 	</Select>,
		// );

		// const websiteOptions = autoCompleteResult.map((website) => (
		// 	<AutoCompleteOption key={website}>{website}</AutoCompleteOption>
		// ));

		return (
			<Form
				// {...formItemLayout}
				onSubmit={this.handleSubmit}
				className="registerForm">
				<h3>立即注册</h3>
				已是会员？<a href="#/login">立即登录</a>
				<Form.Item extra="">
					{getFieldDecorator('username', {
						rules: [
							{
								type: 'username',
								message: 'The input is not valid E-mail!',
							},
							{
								required: true,
								message: 'Please input your E-mail!',
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
							placeholder="请输入用户名"
						/>,
					)}
				</Form.Item>
				<Form.Item hasFeedback>
					{getFieldDecorator('password', {
						rules: [
							{
								required: true,
								message: 'Please input your password!',
							},
							{
								validator: this.validateToNextPassword,
							},
						],
					})(
						<Input.Password
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
				<Form.Item hasFeedback>
					{getFieldDecorator('repassword', {
						rules: [
							{
								required: true,
								message: 'Please input your password!',
							},
							{
								validator: this.compareToFirstPassword,
							},
						],
					})(
						<Input.Password
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
					{getFieldDecorator('phone', {
						rules: [
							{
								required: true,
								message: 'Please input your phone number!',
							},
						],
					})(
						<Input
							prefix={
								<Icon
									type="mobile"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							// addonBefore={prefixSelector}
							style={{ width: '100%' }}
							placeholder="请输入手机号码"
						/>,
					)}
				</Form.Item>
				<Form.Item>
					<Row gutter={8}>
						<Col span={15}>
							{getFieldDecorator('captcha', {
								rules: [
									{
										required: true,
										message:
											'Please input the captcha you got!',
									},
								],
							})(
								<Input
									prefix={
										<Icon
											type="message"
											style={{ color: 'rgba(0,0,0,.25)' }}
										/>
									}
									placeholder="请输入右侧验证码"
								/>,
							)}
						</Col>
						<Col span={9}>
							<img src={logo} width="100%" alt="" />
						</Col>
					</Row>
				</Form.Item>
				<Form.Item>
					<Row gutter={8}>
						<Col span={12}>
							{getFieldDecorator('captcha', {
								rules: [
									{
										required: true,
										message:
											'Please input the captcha you got!',
									},
								],
							})(
								<Input
									prefix={
										<Icon
											type="message"
											style={{ color: 'rgba(0,0,0,.25)' }}
										/>
									}
									placeholder="请输入手机验证码"
								/>,
							)}
						</Col>
						<Col span={12}>
							<Button>获取验证码</Button>
						</Col>
					</Row>
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<Button
						type="primary"
						htmlType="submit"
						className="register-button">
						立即注册
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

export default Form.create({ name: 'register' })(Register);
