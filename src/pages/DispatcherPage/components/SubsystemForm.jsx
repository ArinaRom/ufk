import { Button, Form, Input, Modal, Select, Space, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react'
import { request } from '../../../shared/api';

const SubsystemForm = () => {

    const [ modalState, setModalState ] = useState({
        isActive: false,
        current: null,
    })

    const [ subsystems, setSubsystems ] = useState(null)

    const [ programs, setPrograms ] = useState(null)

	const [ form ] = Form.useForm();

    const getData = () => {
        request.get("api/subsystems").then(data => setSubsystems(data))
    }

    useEffect(() => {
        getData()
        request.get("api/programs").then(programs => setPrograms(programs.map(el => ({ label: el.name, value: el.id }))))
    }, [])

    const handleDelete = async (id) => {
        await request.delete("api/subsystems", { id })
        getData()
    }

    const handleCreate = (data) => {
        return request.post("api/subsystems", data)
    }

    const handleUpdate = (data) => {
        return request.put("api/subsystems", data)
    }


    const handleSubmit = async (data) => {

        if(modalState.current === "create"){
            await handleCreate(data)
        }
        if(modalState.current === "edit"){
            await handleUpdate(data)
        }

        setModalState({ isActive: false })
        form.resetFields()
        getData()
    }

    const handleGetKeywords = async () => {
        const problemsArray = await request.post("api/openai/generateArray", { prompt: form.getFieldValue("description") })
        form.setFieldValue("keywords", problemsArray.results)
    }

    const columns = useMemo(() => [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: "ascend",
            sorter: (a, b) => a.id - b.id,
            width: 50
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (data) => (
                <Space size="middle">
                    <Button
                        onClick={() => {
                            setModalState({ isActive: true, current: "edit"})
                            form.setFieldsValue(data)
                        }}
                        size='small'
                    >
                        Редактировать
                    </Button>
                    <Button onClick={() => handleDelete(data.id)} size='small' danger>Удалить</Button>
                </Space>
            ),
        },
    ], [])

    return (
        <>
            <Modal
                open={modalState.isActive}
                onCancel={() => {
                    setModalState({ isActive: false })
                    form.resetFields()
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setModalState({ isActive: false })
                            form.resetFields()
                        }}
                    >
                        Отменить
                    </Button>,
                    <Button key="keywords" type="primary" onClick={handleGetKeywords}>
                        Запрос
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={form.submit}
                    >
                        Подтвердить
                    </Button>,
                ]}
            >
                <Typography.Title level={3}>{modalState.current === "create" ? "Создание подсистемы" : "Редактирование подсистемы"}</Typography.Title>
                <Form
                    form={form}
                    name="subsystems"
                    layout='vertical'
                    onFinish={handleSubmit}
                >
                    {
                        modalState.current === "create" ?
                        <Form.Item
                            name="programId"
                            label="Программа"
                            rules={[{ required: true, message: 'Пожалуйста, выберите программу' }]}
                        >
                            <Select
                                options={programs}
                            />
                        </Form.Item>
                        :
                        <Form.Item
                            name="id"
                            label="ID"
                        >
                            <Input disabled/>
                        </Form.Item>
                    }
                    <Form.Item
                        name="name"
                        label="Подсистема"
                        rules={[{ required: true, message: 'Пожалуйста, введите тип обращения' }]}
                    >
                        <Input placeholder="Название" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Промпт"
                    >
                        <Input.TextArea placeholder="Промпт" />
                    </Form.Item>
                    <Form.Item
                        name="keywords"
                        label="Теги"
                    >
                        <Select
                            mode="tags"
                            options={form.getFieldValue("keywords")?.map(el => ({ value: el, label: el }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Button
                onClick={() => setModalState({ isActive: true, current: "create" })}
                style={{ marginBottom: "16px" }}
            >
                Создать
            </Button>
            <Table scroll={{ y: 600 }} pagination={false} dataSource={subsystems} columns={columns} />
        </>
    )
}

export default SubsystemForm
