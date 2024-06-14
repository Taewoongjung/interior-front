import React, {useState} from "react";
import {Col, Dropdown, Layout, Menu, Row, Typography, Tooltip, Divider, Empty, Spin, Modal, Result} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content, Footer} from "antd/es/layout/layout";
import UserView from "./views/user";
import './styles.css';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import CompanyListTable from "./views/table";
import CompanyRegister from "./register";
import PieChart from "./charts/Pie";
import {LogoutOutlined, PieChartOutlined, UserOutlined} from "@ant-design/icons";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const { Title } = Typography;

const Management = observer(() => {

    const history = useHistory();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const firstLogin = params.get('firstLogin');

    const handleLogout = () => {
        console.log("로그아웃");
        localStorage.removeItem("interiorjung-token");
        const redirectUrl = '/auth';
        history.push(redirectUrl);
        window.location.reload();
    };

    const menuUserAccount = (
        <Menu>
            <Menu.Item onClick={handleLogout}>로그아웃 <LogoutOutlined /></Menu.Item>
        </Menu>
    );

    const {data:userData, error, mutate} = useSWR(`${API_URL}/api/me`,
        fetcher,{
            dedupingInterval: 2000
        });

    const {data:businessesMaterial} = useSWR(`${API_URL}/api/businesses`,
        fetcher,{
            dedupingInterval: 2000
        });

    const handleApiMeMutate = () => {
        mutate();
    };

    const [welcomeModalOpen, setWelcomeModalOpen] = useState(true);

    const customIcon = (
        <span style={{ fontSize: '72px' }}>🎉</span> // Increase font size as needed
    );

    return (
        <div>
            <Layout style={{height: 920}}>
                {firstLogin === "true" &&
                    <Modal
                        centered
                        open={welcomeModalOpen && (firstLogin === "true")}
                        footer={null}
                        onCancel={() => {
                            history.replace('/management');
                            setWelcomeModalOpen(false)
                        }}
                    >
                        <Result
                            icon={customIcon}
                            title="축하합니다!!"
                            subTitle="사업체 등록 부터 시작해보세요 ~"
                        />
                    </Modal>
                }
                <Sider width={300} style={{backgroundColor: '#eee1'}}>
                    <Content style={{height: 300}}>
                        <UserView name={userData?.name} email={userData?.email}/>
                    </Content>
                    <Content style={{height: 300, marginTop: 50}}>
                        <Divider orientation="center"><Title level={4}>전체 재료 사용 현황</Title></Divider>
                        {businessesMaterial === undefined || businessesMaterial.length === 0 &&
                            <Spin tip="재료를 추가 해보세요">
                                <div className="container"
                                     style={{
                                         display: "flex",
                                         justifyContent: "center",
                                         alignItems: "center"
                                     }}
                                >
                                    <PieChartOutlined style={{fontSize: "100px"}}/>
                                </div>
                            </Spin>
                        }
                        <PieChart businessesMaterial={businessesMaterial} usageType={"대시보드"}/>
                        <Divider/>
                    </Content>
                </Sider>
                <Layout>
                    <Row justify="space-between">
                        <Col/>
                        <Col>
                            <Dropdown.Button
                                overlay={menuUserAccount}
                                icon={<UserOutlined/>}
                            >
                                <strong>{userData && userData.name}</strong>&nbsp;님
                            </Dropdown.Button>
                        </Col>
                    </Row>
                    <Content style={{height: 300, marginLeft: 20, marginTop: 60}}>
                        <Divider orientation="center">
                            <Tooltip color={"#e5ccab"} title="사업체는 최대 5개 까지 등록 가능">
                                <Title level={3}>사업체 리스트</Title>
                            </Tooltip>
                        </Divider>
                        <Content style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <CompanyRegister onEvent={handleApiMeMutate}/>
                        </Content>
                        {(userData?.companyList.length === 0 || userData?.companyList.length === undefined) &&
                            <Empty/>
                        }
                        {(userData?.companyList.length !== 0 && userData !== undefined) &&
                            <CompanyListTable tableData={userData?.companyList} onEvent={handleApiMeMutate}/>
                        }
                    </Content>
                    <Layout style={{height: 600}}>
                        <Content>
                            {/*<View5 data={filteredData}/>*/}
                        </Content>
                        {/*<Sider width={300} style={{backgroundColor:'#eee'}}>*/}
                        {/*    /!*<View6 data={filteredData} changeSelectUser={this.changeSelectUser}/>*!/*/}
                        {/*</Sider>*/}
                    </Layout>
                </Layout>
            </Layout>
            <Layout>
                <Footer style={{height: 20}}>
                    <div style={{marginTop: -10}}>
                        produced by tws
                        Author <a href='https://ydontustudy.tistory.com/'>鄭</a>
                    </div>
                </Footer>
            </Layout>
        </div>
    );
});

export default Management;