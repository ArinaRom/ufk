import React from 'react'
import { NavLink } from 'react-router-dom'

const Main = () => {
	return (
		<div className='main-page'>
			<h2>Система обращений</h2>
			<p>Отправить заявку на рассмотрение можно тут!</p>
			<div className="link__container">
				<NavLink to="/notice" className="link">Создать обращение</NavLink>
				<NavLink to="/login" className="link">Для диспетчера</NavLink>
			</div>
		</div>
	)
}

export default Main
