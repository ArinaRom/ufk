import React from 'react';
import axios from 'axios';

import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

import { ContentContainer } from '../components';
import { minLengthValidator } from '../utils/validators'

const Login = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();

  const onFinish = async ({login, password, remember}) => {
		try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        login,
        password,
      });

			axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

			if (remember) {
				localStorage.setItem('token', response.data.token);
			}

			navigate('/notice/list')

      // setLoggedIn(true);
      // setUsername(response.data.username);
    } catch (error) {
      console.error('Ошибка при входе:', error);
    }
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
					name="login"
					rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}
				>
					<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Имя" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: 'Пожалуйста введите пароль' }, { validator: minLengthValidator(5) },]}
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
