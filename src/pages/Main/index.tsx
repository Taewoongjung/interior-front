import React, {useState} from "react";
import {Layout, Button, Menu, MenuProps, Avatar} from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from '@ant-design/icons';
import NavMain from "../../components/Nav/Main";
import BusinessMainScreen from "../../components/BusinessMainScreen";

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
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('list');

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <>
            <Layout style={{ height: '100vh' }} hasSider>
                <div style={{ width: 256 }}>
                    <Button
                        id={"menuBtn"}
                        type="text"
                        onClick={toggleCollapsed}
                    >{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</Button>

                    <NavMain inlineCollapsed={collapsed}/>
                </div>
                <BusinessMainScreen/>
            </Layout>
        </>
    )
}

export default Main;