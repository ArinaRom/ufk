import { useEffect, useMemo, useState, cloneElement } from "react"
import { Button, Layout, Menu } from "antd"
import { ContentContainer } from "../../components"
import { NoticeForm } from "../../features";
import { request } from "../../shared/api";
import ProgramForm from "./components/ProgramForm";
import SubsystemForm from "./components/SubsystemForm";
import TypeForm from "./components/TypeForm";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const getItem = (label, key, icon, children, type) => {
	return {label, key, icon, children, type};
}

const dispatcherForms = {
    "notice": <NoticeForm/>,
    "program": <ProgramForm/>,
    "subsystem": <SubsystemForm/>,
    "type": <TypeForm/>,
}

export const DispatcherPage = () => {

    const navigate = useNavigate()


    const [ currentForm, setCurrentForm ] = useState(null)
    const [ applications, setApplications ] = useState(null)

    const fetch = () => request.get('api/applications').then(data => setApplications(data))

    useEffect(() => {
        fetch()
    }, [])

    const menuItems = useMemo(() => (
        [
            {
                label: "Новые",
                key: "new",
                children: applications?.created?.map(el => getItem(el.organization, el.id)) || []
            },
            {
                label: "Завершенные",
                key: "completed",
                children: applications?.completed?.map(el => getItem(el.organization, `${el.id}`)) || []

            },
            {
                label: "Отказанные",
                key: "rejected",
                children: applications?.rejected?.map(el => getItem(el.organization, `${el.id}`)) || []
            },
        ]
    ), [applications])

    return (
        <ContentContainer withoutGap={true}>
            <Layout style={{ padding: '24px 0', width: 920, height: 780, background: 'var(--white)', display: 'grid', gridTemplateColumns: '256px 1fr'}}>
                <div width={256} style={{height: '100%', overflow: 'auto', display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Menu
                        // style={{height: '100%'}}
                        onClick={(el) => {
                            setCurrentForm("notice")
                            navigate("", { state: { id: el.key }})
                        }}
                        defaultOpenKeys={['sub1']}
                        // selectedKeys={[currentNotice]}
                        mode="inline"
                        items={menuItems}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 20px"}}>
                        <Button onClick={() => setCurrentForm("program")}>Программа</Button>
                        <Button onClick={() => setCurrentForm("subsystem")}>Подсистема</Button>
                        <Button onClick={() => setCurrentForm("type")}>Тип обращения</Button>
                    </div>
                </div>
                <Content style={{ padding: '24px', minHeight: 280, position: 'relative' }}>
                    {
                        // currentNotice != null
                        // ?
                        currentForm && cloneElement(dispatcherForms[currentForm], {
                            refetch: fetch,
                            clearForm: () => setCurrentForm(null)
                        })
                        // :
                        // <p style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 16, opacity: 0.6}}>Выберете заявку для проверки.</p>
                    }
                </Content>
            </Layout>
        </ContentContainer>
    )
}
