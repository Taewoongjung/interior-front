import React, {useState} from "react";
import {Layout, Button, Menu, MenuProps, Avatar, Radio} from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from '@ant-design/icons';
import NavMain from "../../components/Nav/Main";
import BusinessMainScreen from "../../components/BusinessMainScreen";
import {useLocalObservable, useObserver} from "mobx-react";
import MainNavState from "../../statemanager/mainNavState";
import RegisterBusiness from "../RegisterBusiness";
import {observable} from "mobx";

const { Header, Sider, Content } = Layout;

const Main = () => {

    const menuSortBy = (
        <Menu>
            <Menu.Item>Profile name</Menu.Item>
            <Menu.Item>Agent</Menu.Item>
            <Menu.Item>State</Menu.Item>
        </Menu>
    );

    const menuUserAccount = (
        <Menu>
            <Menu.Item>Change password</Menu.Item>
            <Menu.Item>Logout</Menu.Item>
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