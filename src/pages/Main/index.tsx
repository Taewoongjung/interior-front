import React, {useState} from "react";
import {Layout, FloatButton} from 'antd';
import NavMain from "../../components/Nav/Main";
import BusinessMainScreen from "../../components/BusinessMainScreen";
import {useObserver} from "mobx-react";
import MainNavState from "../../statemanager/mainNavState";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";

const { Header, Sider, Content } = Layout;

const Main = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [tourOpen, setTourOpen] = useState<boolean>(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const {data:userData, error, mutate} = useSWR(
        'http://api-interiorjung.shop:7077/api/me',
        // 'http://localhost:7070/api/me',
        fetcher,{
            dedupingInterval: 2000
        });

    const handleApiMeMutate = () => {
        mutate();
    };

    const handleTourOpen = (e:boolean) => {
        setTourOpen(e);
    }

    const navState = new MainNavState();

    return useObserver(() => (
        <>
            <Layout style={{ height: '100%', width: '100%' }} hasSider>
                <div style={{background: '#e7a19a'}}>
                    <div style={{background: '#e7a19a'}}>
                        <NavMain navState={navState} tourOpen={tourOpen} onTourEvent={handleTourOpen}/>
                    </div>
                </div>
                <BusinessMainScreen navState={navState} user={userData} onEvent={handleApiMeMutate} onTourEvent={handleTourOpen}/>
                <FloatButton.BackTop />
            </Layout>
        </>
    ));
}

export default Main;