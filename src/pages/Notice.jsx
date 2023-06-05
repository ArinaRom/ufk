import React from 'react'
import { Layout, Menu } from 'antd';
import { ContentContainer, NoticeForm } from '../components';
import { useParams, useLocation } from 'react-router-dom';

const { Content } = Layout;

function getItem(label, key, icon, children, type) {
	return {label, key, icon, children, type};
}
const items = [
	getItem('Программы', 'sub1', null, [
		getItem('Список обращений', 'g1', null, [getItem('Заявление 12215', '3'), getItem('Заявление 12213', '4'), getItem('Заявление 12214', '1')],),
	]),
	getItem('Завершенные', 'sub2', null, [
		getItem('Заявление 12211', '5'),
		getItem('Заявление 12212', '6'),
	]),
	getItem('Отказанные', 'sub3', null, [
		getItem('Заявление 12210', '9'),
		getItem('Заявление 12209', '10'),
		getItem('Заявление 12208', '11'),
	]),
];

const Notice = () => {
	const {id: noticeId} = useParams();
	const location = useLocation();
	const isEdit = !!noticeId || (location.pathname === '/notice/list');

	const [currentNotice, setCurrentNotice] = React.useState(null);

	const onClick = (e) => {
		setCurrentNotice(e.key)
    console.log('click ', e);
  };

	return (
		<React.Fragment>
			{
				isEdit ? (
					<ContentContainer withoutGap={true}>
						<Layout style={{ padding: '24px 0', width: 920, minHeight: 718, background: 'var(--white)', display: 'grid', gridTemplateColumns: '256px 1fr'}}>
							<div width={256} style={{maxHeight: 670, overflow: 'auto'}}>
								<Menu
									style={{height: '100%'}}
									onClick={onClick}
									defaultOpenKeys={['sub1']}
									selectedKeys={[currentNotice]}
									mode="inline"
									items={items}
								/>
							</div>
							<Content style={{ padding: '24px', minHeight: 280, position: 'relative' }}>
								{
									currentNotice != null ?
									<NoticeForm/> :
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
