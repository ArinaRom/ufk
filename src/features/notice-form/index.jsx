import { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space, message } from 'antd';
import { minLengthValidator } from '../../shared/lib/validators';
import { request } from '../../shared/api';
import { useLocation } from 'react-router-dom';

const {TextArea} = Input;

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 8 },
};

const initialOptionsState = {
	departments: [
		{ value: 'ПУР', label: 'Отдел ПУР' },
		{ value: 'ПИАО', label: 'Отдел ПИАО' },
		{ value: 'ПУиО', label: 'Отдел ПУиО' },
		{ value: 'ПУДС', label: 'Отдел ПУДС' },
		{ value: 'ПУР КС', label: 'Отдел ПУР КС' },
		{ value: 'НИС', label: 'Отдел НИС' },
		{ value: 'ПУНФА', label: 'Отдел ПУНФА' },
		{ value: 'ПУОТ', label: 'Отдел ПУОТ' },
	]
}

export const NoticeForm = ({ refetch, clearForm }) => {

	const { state } = useLocation()

	const [ form ] = Form.useForm();

	const [ formSelectOptions, setFormSelectOptions ] = useState(initialOptionsState)

	const [ programs, setPrograms ] = useState([])

	const [ subsystem, setSubsystem ] = useState([]);

	const [ messageApi, contextHolder ] = message.useMessage({ duration: 5 });


	useEffect(() => {
		getOptions()
	}, [])

	useEffect(() => {
		if(state?.id){
			request.post("api/applications/getById", { id: state.id }).then(data => form.setFieldsValue(data))
		}
	}, [state])

	const programIdValue = form.getFieldValue("programId")

	useEffect(() => {
		setSubsystem(programs?.find(el => el.id === programIdValue)?.subsystems)
	}, [programIdValue, programs])

	const getOptions = async () => {
		try {
			const programsData = await request.get('api/programs')
			const typesData = await request.get('api/types')

			setPrograms(programsData);

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

	const onFinish = async (val) => {
		try {
			if(state?.id){
				await request.put('api/applications', {...val, id: parseInt(state.id)})
				messageApi.open({
					type: 'success',
					content: 'Заявление изменено!',
				});
			}
			else{
				await request.post('api/applications', val)
				messageApi.open({
					type: 'success',
					content: 'Заявление создано!',
				});
			}

		} catch (error) {
			console.error(error);
			messageApi.open({
				type: 'error',
				content: 'Что-то пошло не так!',
			});
		}
	};

	const fetchClassifyProblem = async () => {

		const k = {
			program: {
				emptyError: "Не удалось найти необходимую программу",
				formField: "programId",
				findError: "Несоответствие выбранной программе. Возможно вы имели ввиду"
			},
			subs: {
				emptyError: "Не удалось найти необходимую подсистему",
				formField: "subsystemId",
				findError: "Несоответствие выбранной подсистеме. Возможно вы имели ввиду"
			},
			types: {
				emptyError: "Не удалось найти необходимый тип обращения",
				formField: "typeId",
				findError: "Несоответствие выбранного типа обращения. Возможно вы имели ввиду"
			},
		}

		await request.post("api/openai/classifyProblem", { description: form.getFieldValue("description") })
			.catch(error => {
				messageApi.open({
					type: 'error',
					content: 'Что-то пошло не так!',
				});
			})
			.then(response => {
				var counter = 0

				Object.entries(response).forEach(([key, value]) => {
					console.log(key, value)
					if (key === 'results') return
					if(!value.length){
						messageApi.open({
							type: 'warning',
							content: k[key].emptyError,
						});
						return
					}
					const isConfirmed = value.find(el => el.id === form.getFieldValue(k[key].formField))

					if(!isConfirmed){
						messageApi.open({
							type: 'warning',
							content: `${k[key].findError}: ${value[0].name}`,
						});
						return
					}

					counter += 1
				})

				if(counter === 3){
					messageApi.open({
						type: 'success',
						content: "Успешно!",
					});
				}
			})
	}

	const changeStatus = (status) => {
		request.put("api/applications/status", { id: parseInt(state.id), status })
			.then(res => {
				messageApi.open({
					type: 'success',
					content: 'Успешно',
				});
				refetch()
				form.resetFields()
				clearForm()
			})
			.catch(err => {
				messageApi.open({
					type: 'error',
					content: 'Что-то пошло не так!',
				});
			})

	}


	return (
		<>
			{contextHolder}
			<Form form={form} name="dynamic_rule" layout='vertical' onFinish={onFinish}>
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
					name="fullName"
					label="ФИО"
					rules={[{ required: true, message: 'Пожалуйста введите ваше ФИО!' }, { validator: minLengthValidator(6) }]}
				>
					<Input placeholder="ФИО" />
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					name="programId"
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
						onChange={data => setSubsystem(programs?.find(el => el.id === data)?.subsystems)}

					/>
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					name="subsystemId"
					label="Подсистема"
					rules={[{ required: true, message: 'Пожалуйста выберете подсистему!' }]}
				>
					<Select
						placeholder="Выберете подсистему"
						options={subsystem?.map(el => ({ label: el.name, value: el.id }))}
					/>
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					name="typeId"
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
					name="departureDepartment"
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

				<div style={{margin: 0, display: 'flex', justifyContent: "space-between", width: '100%'}}>
					<div>
						<Button size="large" type="primary" htmlType="submit" style={{ marginRight: '12px' }}>{ state?.id ? "Изменить" : "Отправить"}</Button>
						<Button size="large" type="primary" style={{ marginRight: '12px' }} onClick={fetchClassifyProblem}>Проверить</Button>
					</div>
					{
						state?.id &&
						<div>
							<Button size="large" type="primary" style={{ marginRight: '12px' }} onClick={() => changeStatus("completed")}>Принять</Button>
							<Button size="large" type="primary" danger onClick={() => changeStatus("rejected")}>Отклонить</Button>
						</div>
					}
				</div>
			</Form>
		</>
	)
}
