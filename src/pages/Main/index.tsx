import React, {useState} from "react";
import {Layout, FloatButton} from 'antd';
import NavMain from "../../components/Nav/Main";
import BusinessMainScreen from "../../components/BusinessMainScreen";
import {useObserver} from "mobx-react";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const { Sider } = Layout;

const Main = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [tourOpen, setTourOpen] = useState<boolean>(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const {data:userData, error, mutate} = useSWR(`${API_URL}/api/me`,
        fetcher,{
            dedupingInterval: 2000
        });

    const handleApiMeMutate = () => {
        mutate();
    };

    const handleTourOpen = (e:boolean) => {
        setTourOpen(e);
    }

    return useObserver(() => (
        <>
            <Layout style={{ height: '100%', width: '100%' }} hasSider>
                <Sider trigger={null} collapsible collapsed={collapsed}
                       style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0, top: 0, bottom: 0 }}>
                <div style={{background: '#e7a19a'}}>
                    <div style={{background: '#e7a19a'}}>
                        <NavMain tourOpen={tourOpen} onTourEvent={handleTourOpen} triggerCollapse={toggleCollapsed}/>
                    </div>
                </div>
                </Sider>
                <BusinessMainScreen user={userData} onEvent={handleApiMeMutate} onTourEvent={handleTourOpen} isCollapsed={collapsed}/>
                <FloatButton.BackTop />
            </Layout>
        </>
    ));
}

export default Main;
