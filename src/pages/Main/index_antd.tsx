import React, {useState} from "react";
import {Layout, Row, Col, Input, Button, Dropdown, Menu, MenuProps, Drawer} from 'antd';
import {ArrowDownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from '@ant-design/icons';
import NavMainAntd from "../../components/Nav/Main/index_antd";
import BusinessMainScreenAntd from "../../components/BusinessMainScreen/index_antd";

const { Header, Sider, Content } = Layout;

const Mainantd = () => {
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


    const [collapsed, setCollapsed] = useState(true);
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('list');

    const onMenuClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrentSelectedMenu(e.key);
    };

    return (
        <>
            <Layout style={{ height: '100vh' }} hasSider>
                <Button
                    id={"menuBtn"}
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined className="icon"/> : <MenuFoldOutlined className="icon"/>}
                    onClick={() => setCollapsed(!collapsed)}
                />
                <Sider
                    style={{
                        background: '#050F33',
                        overflow: 'auto'
                    }}
                    trigger={null} collapsible={true} collapsed={collapsed} collapsedWidth={0}
                >
                    <div
                        style={{
                            width: 130,
                            height: 130,
                            background: 'black',
                            margin: 'auto',
                            marginTop: 16,
                            marginBottom: 32
                        }}
                    />

                    <NavMainAntd/>
                </Sider>

                <BusinessMainScreenAntd/>
            </Layout>
        </>
    )
}

export default Mainantd;