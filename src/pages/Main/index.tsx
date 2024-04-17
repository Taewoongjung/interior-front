import React, {useState} from "react";
import {Layout, Button} from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import NavMain from "../../components/Nav/Main";
import BusinessMainScreen from "../../components/BusinessMainScreen";
import {useObserver} from "mobx-react";
import MainNavState from "../../statemanager/mainNavState";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";

const { Header, Sider, Content } = Layout;

const Main = () => {
    const [collapsed, setCollapsed] = useState(false);

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

    const navState = new MainNavState();

    return useObserver(() => (
        <>
            <Layout style={{ height: '100vh' }} hasSider>
                <div style={{background: '#e7a19a'}}>
                    <Button
                        id={"menuBtn"}
                        type="text"
                        onClick={toggleCollapsed}
                        style={{
                            background: '#e7a19a',
                        }}
                    >{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</Button>
                    <NavMain inlineCollapsed={collapsed} navState={navState}/>
                </div>
                <BusinessMainScreen navState={navState} user={userData} onEvent={handleApiMeMutate}/>
            </Layout>
        </>
    ));
}

export default Main;