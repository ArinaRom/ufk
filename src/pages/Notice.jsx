import React from 'react'
import axios from 'axios';
import { Layout, Menu } from 'antd';
import { ContentContainer, NoticeForm } from '../components';
import { useParams, useLocation } from 'react-router-dom';

const { Content } = Layout;

const getItem = (label, key, icon, children, type) => {
	return {label, key, icon, children, type};
}

const items = [
	getItem('Программы', 'sub1', null, [
		getItem('Список обращений', 'g1', null, [getItem('Заявление 12215', '3'), getItem('Заявление 12213', '4'), getItem('Заявление 12214', '1')],),
	]),
	getItem('Завершенные', 'sub2', null, [
		// getItem('Заявление 12211', '5'),
		// getItem('Заявление 12212', '6'),
	]),
	getItem('Отказанные', 'sub3', null, [
		// getItem('Заявление 12210', '9'),
		// getItem('Заявление 12209', '10'),
		// getItem('Заявление 12208', '11'),
	]),
];

const Notice = () => {
	const {id: noticeId} = useParams();
	const location = useLocation();
	const isEdit = !!noticeId || (location.pathname === '/notice/list');

	const [currentNotice, setCurrentNotice] = React.useState(null);
	const [menuItems, setMenuItems] = React.useState(items)


	React.useEffect(() => {
		getTransactions();
	}, [])

	const getTransactions = async () => {
		try {
			const {data} = await axios.get('http://localhost:5000/api/applications')

			const complitedApplications = [];
			const rejectedApplications = [];
			const items = data.map(p => {
				const sub = p.subsystems.map(s => {
					const appl = s.applications.map(el => {
						switch (el.status) {
							case 'completed':
								complitedApplications.push(el)
								break
							case 'rejected':
								rejectedApplications.push(el)
								break
							default:
								return;
						}
						return getItem(el.organization, el.updatedAt)
					})
					return getItem(s.name, s.updatedAt, null, appl)
				})
				return getItem(p.name, p.updatedAt, null, sub)
			})

			setMenuItems(prev => [{...prev[0], children: items}, {...prev[1], children: complitedApplications}, {...prev[2], children: rejectedApplications}])


		} catch (error) {
			console.error(error)
		}
	}

	const onClick = (e) => {
		setCurrentNotice(e.key)
  };

	return (
		<React.Fragment>
			{
				isEdit ? (
					<ContentContainer withoutGap={true}>
						<Layout style={{ padding: '24px 0', width: 920, height: 780, background: 'var(--white)', display: 'grid', gridTemplateColumns: '256px 1fr'}}>
							<div width={256} style={{height: '100%', overflow: 'auto'}}>
								<Menu
									style={{height: '100%'}}
									onClick={onClick}
									defaultOpenKeys={['sub1']}
									selectedKeys={[currentNotice]}
									mode="inline"
									items={menuItems}
								/>
							</div>
							<Content style={{ padding: '24px', minHeight: 280, position: 'relative' }}>
								{
									currentNotice != null ?
									<NoticeForm isEdit={true} /> :
									<p style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 16, opacity: 0.6}}>Выберете заявку для проверки.</p>
								}
							</Content>
						</Layout>
					</ContentContainer>
				) : (
					<ContentContainer title={'Создание заявления'}>
						<Content style={{ padding: '24px', width: 920, minHeight: 718 }}>
							<NoticeForm/>
						</Content>
					</ContentContainer>
				)
			}
		</React.Fragment>
	)
}

export default Notice
