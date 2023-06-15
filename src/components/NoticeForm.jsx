import React from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, message } from 'antd';
import { minLengthValidator } from '../utils/validators'

const {TextArea} = Input;
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 8 },
};

const NoticeForm = ({isEdit}) => {
	const [form] = Form.useForm();
	const [formSelectOptions, setFormSelectOptions] = React.useState({
		programs: [
			{ value: 'jack', label: 'Электронный бюджет' },
			{ value: 'lucy', label: 'ЛАНДОКС' },
			{ value: 'tom', label: '1С' },
		],
		types: [
			{ value: '400', label: 'Обращение' },
			{ value: '500', label: 'Инцидент' },
			{ value: '600', label: 'Консультация' },
		],
		subsystem: [],
		departments: [
			{ value: 'first', label: 'Отдел ПУР' },
			{ value: 'second', label: 'Отдел ПИАО' },
			{ value: 'third', label: 'Отдел ПУиО' },
			{ value: 'fourth', label: 'Отдел ПУДС' },
			{ value: 'fifth', label: 'Отдел ПУР КС' },
			{ value: 'sixth', label: 'Отдел НИС' },
			{ value: 'seventh', label: 'Отдел ПУНФА' },
			{ value: 'eighth', label: 'Отдел ПУОТ' },
		]
	})

	const [programsFields, setProgramsFields] = React.useState([]);
	const [messageApi, contextHolder] = message.useMessage();


	const getOptions = async () => {
		try {
			const {data: programsData} = await axios.get('http://localhost:5000/api/programs')
			const {data: typesData} = await axios.get('http://localhost:5000/api/types')

			setProgramsFields(programsData);

			const programs = programsData.map(el => {
				return {value: el.id, label: el.name}
			})

			const types = typesData.map(el => {
				return {value: el.id, label: el.name}
			})

			setFormSelectOptions(prev => ({...prev, programs, types}));
		} catch (error) {
			console.error(error)
		}
	}

	React.useState(() => {
		getOptions()
	}, [])


  const onFinish = async (val) => {
    try {
			const request = {
				departureDepartment: val.department,
				fullName: val.name,
				organization: val.organization,
				programId: val.program,
				subsystemId: val.subsystem,
				typeId: val.type,
				description: val.description,
			}
			await axios.post('http://localhost:5000/api/applications', request)

			messageApi.open({
				type: 'success',
				content: 'Заявление создано!',
			});
		} catch (error) {
      console.error(error);
			messageApi.open({
				type: 'error',
				content: 'Что-то пошло не так!',
			});
    }
  };

	const handleFormChange = (changedValues, allValues) => {
		const programValue = changedValues['program'];
		if (programValue) {
			const subs = programsFields.find(el => el.id === programValue).subsystems.map(el => ({label: el.name, value: el.id}))
			form.setFieldsValue({ subsystem: null });
			setFormSelectOptions(prev => {
				return {...prev, subsystem: subs}
			})
		}
  };

	return (
		<>
		{contextHolder}
			<Form form={form} name="dynamic_rule" layout='vertical' onFinish={onFinish} onValuesChange={handleFormChange}>
				<Form.Item
					{...formItemLayout}
					name="organization"
					label="Организация"
					rules={[{ required: true, message: 'Пожалуйста введите название организации!' }, { validator: minLengthValidator(5) }]}
				>
					<Input placeholder="Организация" />
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					name="name"
					label="ФИО"
					rules={[{ required: true, message: 'Пожалуйста введите ваше ФИО!' }, { validator: minLengthValidator(6) }]}
				>
					<Input placeholder="ФИО" />
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					name="program"
					label="Программа"
					rules={[{ required: true, message: 'Пожалуйста выберете программу!' }]}
				>
					<Select
						placeholder="Выберете программу"
						optionFilterProp="children"
						filterOption={(input, option) =>
							(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
						}
						options={formSelectOptions.programs}
					/>
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					name="subsystem"
					label="Подсистема"
					rules={[{ required: true, message: 'Пожалуйста выберете подсистему!' }]}
				>
					<Select
						placeholder="Выберете подсистему"
						options={formSelectOptions.subsystem}
					/>
				</Form.Item>
			<Form.Item
					{...formItemLayout}
					name="type"
					label="Тип обращения"
					rules={[{ required: true, message: 'Пожалуйста выберете тип обращения!' }]}
				>
					<Select
						placeholder="Выберете тип обращения"
						options={formSelectOptions.types}
					/>
				</Form.Item>

				<Form.Item
					{...formItemLayout}
					name="department"
					label="Отдел отправления"
					rules={[{ required: false}]}
				>
					<Select
						showSearch
						placeholder="Выберете отдел отправления"
						options={formSelectOptions.departments}
					/>
				</Form.Item>
				<Form.Item
					name="description"
					label="Описание проблемы"
					rules={[{ required: true, message: 'Пожалуйста опишите проблему!' }, { validator: minLengthValidator(40) }]}
				>
					<TextArea rows={4} placeholder="Опишите проблему" maxLength={400} />
				</Form.Item>


				<Form.Item style={{margin: 0}}>
					<Button size="large" type="primary" htmlType="submit">Отправить</Button>
				</Form.Item>
			</Form>
		</>
	)
}

export default NoticeForm
