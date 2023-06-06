import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

import { ContentContainer } from '../components';


// Подключение к базе данных
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  password: '123456',
  host: 'localhost',
  port: 5432,
  database: 'servise_yfk'
});

// Функция для проверки авторизации пользователя
async function checkAuthorization(username, password) {
  try {
    // Формируем SQL-запрос для проверки совпадения имени пользователя и пароля
    const query = `SELECT * FROM Dispatcher WHERE Login = ${username} AND Pass =${password} `;
    const values = [username, password];
    const result = await pool.query(query, values);

    // Если найдена запись с указанным именем пользователя и паролем
    if (result.rows.length > 0) {
      return true; // Авторизация прошла успешно
    } else {
      return false; // Авторизация не удалась
    }
  } catch (error) {
    throw error;
  }
}

// Пример использования функции проверки авторизации
const username = 'пользователь';
const password = 'пароль';

checkAuthorization(username, password)
  .then(authorized => {
    if (authorized) {
      console.log('Пользователь авторизован');
      // Дополнительные действия для авторизованного пользователя
    } else {
      console.log('Ошибка авторизации');
      // Действия в случае неудачной авторизации
    }
  })
  .catch(error => {
    console.error('Ошибка при проверке авторизации:', error);
  });

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
