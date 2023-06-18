import { Button, Form, Input, Modal, Select, Space, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react'
import { request } from '../../../shared/api';

const ProgramForm = () => {

    const [ modalState, setModalState ] = useState({
        isActive: false,
        current: null,
    })

    const [ programs, setPrograms ] = useState(null)

	const [ form ] = Form.useForm();

    const getData = () => {
        request.get("api/programs").then(data => setPrograms(data))
    }

    useEffect(() => {
        getData()
    }, [])

    const handleDelete = async (id) => {
        await request.delete("api/programs", { id })
        getData()
    }

    const handleCreate = (data) => {
        return request.post("api/programs", data)
    }

    const handleUpdate = (data) => {
        return request.put("api/programs", data)
    }


    const handleSubmit = async (data) => {

        if(modalState.current === "create"){
            await handleCreate(data)
        }
        if(modalState.current === "edit"){
            await handleUpdate(data)
        }
        
        setModalState(false)
        form.resetFields()
        getData()
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
                    setModalState(false)
                    form.resetFields()
                }}
                onOk={form.submit}
            >
                <Typography.Title level={3}>{modalState.current === "create" ? "Создание программы" : "Редактирование программы"}</Typography.Title>
                <Form 
                    form={form} 
                    name="programs" 
                    layout='vertical'
                    onFinish={handleSubmit}
                >
                    {
                        modalState.current === "edit" &&
                        <Form.Item
                            name="id"
                            label="ID"
                        >
                            <Input disabled/>
                        </Form.Item>
                    }
                    <Form.Item
                        name="name"
                        label="Программа"
                        rules={[{ required: true, message: 'Пожалуйста, введите название' }]}
                    >
                        <Input placeholder="Название" />
                    </Form.Item>
                </Form>
            </Modal>
            <Button 
                onClick={() => setModalState({ isActive: true, current: "create" })}
                style={{ marginBottom: "16px" }}
            >
                Создать
            </Button>
            <Table scroll={{ y: 600 }} pagination={false} dataSource={programs} columns={columns} />
        </>
    )
}

export default ProgramForm