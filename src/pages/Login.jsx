import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

import { ContentContainer } from '../components';

const Login = ({setToken}) => {
	const [form] = Form.useForm();
	const navigate = useNavigate();

  const onFinish = ({username, password, remember}) => {
		console.log('test')
    // if (username === 'admin' && password === 'password') {
			navigate('/notice/list')
    // }
  };

	return (
		<ContentContainer title={'Авторизация диспетчера'}>
			<Form
				form={form}
				name="normal_login"
				className="login-form"
				initialValues={{ remember: true }}
				onFinish={onFinish}
			>
				<Form.Item
					name="username"
					rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}
				>
					<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Имя" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: 'Пожалуйста введите пароль' }]}
				>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Пароль"
					/>
				</Form.Item>
				<Form.Item>
					<Form.Item name="remember" valuePropName="checked" noStyle>
						<Checkbox>Запомнить меня!</Checkbox>
					</Form.Item>
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button">
						Войти
					</Button>
				</Form.Item>
			</Form>
		</ContentContainer>
	)
}

export default Login
