import { Layout, Menu } from 'antd';
import { Outlet, NavLink } from 'react-router-dom'

import logo from '../assets/images/logo.png'

const { Header, Content, Footer } = Layout;


const AppContainer = () => {

	const isAuthorized = localStorage.getItem("token")

	const menuItems = [
		{
			label: 'Новое обращение',
			route: '/notice',
		},
		{
			label: 'Инструкция',
			route: '/manual',
		},
		{
			label: 'Авторизация диспетчера',
			route: '/login',
		},
		{
			label: isAuthorized && "Список обращений",
			route: isAuthorized && "/notice/list",
		},
	]

	return (
		<Layout className="app">
			<Header style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<NavLink to="/" className="logo">
					<div className="logo__icon__wrapper">
						<img src={logo} alt="logo" className="logo__icon" />
					</div>
					<div className="logo__title">Управление Федерального Казначейства</div>
					</NavLink>
					<Menu
						theme="light"
						mode="horizontal"
						items={menuItems.map(el => {
							return {
								label: <NavLink to={el.route}>{el.label}</NavLink>,
								key: el.route
							}
						}
					)}
				/>
			</Header>
			<Content className='main'>
				<Outlet/>
			</Content>
			<Footer style={{ textAlign: 'center' }}>©2023 Управление Федерального казначейства</Footer>
    	</Layout>
	)
}

export default AppContainer
