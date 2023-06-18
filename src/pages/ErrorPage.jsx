import React from 'react'
import { Button, Result } from 'antd'
import { NavLink } from 'react-router-dom'

export const ErrorPage = () => {
	return (
		<div className="error-page">
			<Result
				status="warning"
				title="There are some problems with your operation."
				extra={
					<Button type="primary" key="console">
						<NavLink to="/">Главная страница</NavLink>
					</Button>
				}
			/>
		</div>
	)
}

