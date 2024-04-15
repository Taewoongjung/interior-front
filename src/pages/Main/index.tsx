import React, {useState} from "react";
import {Layout, Button, Menu} from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import NavMain from "../../components/Nav/Main";
import BusinessMainScreen from "../../components/BusinessMainScreen";
import {useObserver} from "mobx-react";
import MainNavState from "../../statemanager/mainNavState";

const { Header, Sider, Content } = Layout;

const Main = () => {

    const menuSortBy = (
        <Menu>
            <Menu.Item>No</Menu.Item>
            <Menu.Item>재료 명</Menu.Item>
            <Menu.Item>카테고리</Menu.Item>
            <Menu.Item>수량</Menu.Item>
        </Menu>
    );

    const menuUserAccount = (
        <Menu>
            <Menu.Item>마이페이지</Menu.Item>
            <Menu.Item>로그아웃</Menu.Item>
        </Menu>
    );


    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
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
                <BusinessMainScreen navState={navState}/>
            </Layout>
        </>
    ));
}

export default Main;