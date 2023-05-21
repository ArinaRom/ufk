import React from 'react'
import { Layout, Menu, Alert, Space } from 'antd';
import { Outlet, NavLink, useLocation } from 'react-router-dom'

import logo from './assets/images/logo.png'

const App = () => {
	const { Header, Content, Footer } = Layout;
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
	]

	const {pathname} = useLocation();

	return (
		<Layout className="app">
      <Header style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <NavLink to="/" className="logo">
					<div className="logo__icon__wrapper">
						<img src={logo} alt="logo" className="logo__icon" />
					</div>
					<div className="logo__title">Просто большая биба</div>
				</NavLink>
				<Menu
          theme="light"
          mode="horizontal"
          selectedKeys={pathname}
          items={menuItems.map(el => {
						return {
							label: <NavLink to={el.route}>{el.label}</NavLink>,
							key: el.route
						}
					})}
        />
      </Header>
      <Content className='main'>
        <Outlet/>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
	)
}

export default App
