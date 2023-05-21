import React from 'react';
import { Button, Form, Input, Select } from 'antd';

const {TextArea} = Input;
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 8 },
};

const NoticeForm = () => {
	const [form] = Form.useForm();
	const [formSelectOptions, setFormSelectOptions] = React.useState({
		programs: [
			{ value: 'jack', label: 'Jack' },
			{ value: 'lucy', label: 'Lucy' },
			{ value: 'tom', label: 'Tom' },
		],
		errorTypes: [
			{ value: '400', label: 'Что-то сломалося' },
			{ value: '500', label: 'Что-то умерло' },
			{ value: '600', label: 'Что-то погибло' },
		],
		departments: [
			{ value: 'first', label: 'я' },
			{ value: 'second', label: 'не я' },
		]
	})

  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

	return (
		<Form form={form} name="dynamic_rule" layout='vertical'>
      <Form.Item
        {...formItemLayout}
        name="organization"
        label="Организация"
        rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}
      >
        <Input placeholder="Организация" />
      </Form.Item>
			<Form.Item
				{...formItemLayout}
				name="program"
				label="Программа"
				rules={[{ required: true, message: 'Пожалуйста выберете программу!' }]}
			>
				<Select
					showSearch
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
        name="errorType"
        label="Вид ошибки"
        rules={[{ required: true, message: 'Пожалуйста выберете вид ошибки!' }]}
      >
        <Select
					placeholder="Выберете вид ошибки"
					options={formSelectOptions.errorTypes}
				/>
      </Form.Item>
			<Form.Item
        {...formItemLayout}
        name="subsystem"
        label="Подсистема"
        rules={[{ message: 'Пожалуйста введите подсистему!' }]}
      >
        <Input placeholder="Введите подсистему" />
      </Form.Item>
			<Form.Item
				{...formItemLayout}
				name="department"
				label="Отдел отправления"
				rules={[{ required: true, message: 'Пожалуйста выберете отдел отправления!' }]}
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
				rules={[{ required: true, message: 'Пожалуйста опишите проблему!' }]}
			>
				<TextArea rows={4} placeholder="Опишите проблему" maxLength={400} />
			</Form.Item>


			<Form.Item style={{margin: 0}}>
				<Button
					size="large"
					type="primary"
					htmlType="submit"
					onClick={onCheck}>Отправить</Button>
			</Form.Item>
		</Form>
	)
}

export default NoticeForm
