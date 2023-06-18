import { Button, Checkbox, Form, Input } from 'antd';
import { minLengthValidator } from "../../shared/lib/validators";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { request } from '../../shared/api';

export const LoginForm = () => {

	const navigate = useNavigate();

    const [ form ] = Form.useForm();

    const onFinish = async ({ login, password, remember }) => {
        try {
            const response = await request.post('api/user/login', {
                login,
                password,
            });

            localStorage.clear()
            sessionStorage.clear()

            if (remember) {
                localStorage.setItem('token', response.token);
            }
            if(!remember){
                sessionStorage.setItem('token', response.token)
            }

            navigate('/notice/list')

        } catch (error) {
            console.error('Ошибка при входе:', error);
        }
    };

    return (
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
    )
}
