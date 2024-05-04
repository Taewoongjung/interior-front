import React, {useEffect, useState} from "react";
import {
    Button,
    Col,
    Dropdown, Input,
    Layout,
    Menu, message, Modal,
    Row,
    Typography,
    Form, Result,
} from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
    DownloadOutlined,
} from "@ant-design/icons";
import BusinessMaterialAddInput from "./BusinessMaterialAddInput";
import {Content, Header} from "antd/es/layout/layout";
import {useHistory, useLocation, useParams} from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import RegisterBusiness from "../../pages/RegisterBusiness";
import {useObserver} from "mobx-react";
import MainNavState from "../../statemanager/mainNavState";
import axios from "axios";
import BusinessMainScreenTable from "./BusinessMaterialTable";

const { confirm } = Modal;

const { Title } = Typography;

const BusinessMainScreen = (props:{navState:MainNavState; user:any; onEvent: () => void; onTourEvent: (e:boolean) => void;}) => {

    const {user, onEvent, onTourEvent} = props;

    const { companyId } = useParams();

    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("interiorjung-token");

        if (token === null) {
            const redirectUrl = '/auth';
            history.push(redirectUrl);
            window.location.reload();
        }
    }, []);

    const handleGoBackManagement = () => {
        console.log("대시보드로 이동");
        const redirectUrl = '/management';
        history.push(redirectUrl);
        window.location.reload();
    }

    const handleLogout = () => {
        console.log("로그아웃");
        onEvent();
        localStorage.removeItem("interiorjung-token");
        const redirectUrl = '/auth';
        history.push(redirectUrl);
        window.location.reload();
    };

    const menuUserAccount = (
        <Menu>
            <Menu.Item onClick={handleGoBackManagement}>대시보드 이동</Menu.Item>
            <Menu.Item onClick={handleLogout}>로그아웃 <LogoutOutlined /></Menu.Item>
        </Menu>
    );

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const businessId = queryParams.get('businessId');

    const url = businessId ?
        `http://api-interiorjung.shop:7077/api/businesses/${businessId}`
        // `http://localhost:7070/api/businesses/${businessId}`
        : null;

    const {data:businessesMaterial, error, mutate} = useSWR(url, fetcher);

    const handleMutate = () => {
        mutate();
    };

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const success = (successMsg:string) => {
        messageApi.open({
            type: 'success',
            content: successMsg,
        });
    };

    const errorModal = (errorMsg:string) => {
        messageApi.open({
            type: 'error',
            content: errorMsg
        });
    };

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);

        const changeBusinessName = reviseBusinessName;

        await axios
            .patch(`http://api-interiorjung.shop:7077/api/companies/${companyId}/businesses/${businessId}`, {
            // .patch(`http://localhost:7070/api/companies/${companyId}/businesses/${businessId}`, {
                    changeBusinessName
                }, {
                    withCredentials: true, // CORS 처리 옵션
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token")
                    }
                }
            ).then((response) => {
                if (response.data === true) {
                    setBusinessName('');
                    success('사업 수정 성공');
                    mutate();
                    window.location.reload();
                }
            })
            .catch((error) => {
                errorModal(error.response.data.message);
            })

        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const showDeleteConfirm = () => {
        confirm({
            title: '사업을 삭제 하시겠습니까?',
            icon: <ExclamationCircleFilled />,
            content: '삭제를 하시면 모든 재료도 함께 삭제 됩니다.',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk() {
                axios
                    .delete(`http://api-interiorjung.shop:7077/api/companies/${companyId}/businesses/${businessId}`, {
                    // .delete(`http://localhost:7070/api/companies/${companyId}/businesses/${businessId}`, {
                            withCredentials: true, // CORS 처리 옵션
                            headers: {
                                Authorization: localStorage.getItem("interiorjung-token")
                            }
                        }
                    ).then((response) => {
                        if (response.data === true) {
                            const redirectUrl = `/main/${companyId}`;
                            history.push(redirectUrl);
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        errorModal(error.response.data.message);
                    })
            },
            onCancel() {
            },
        });
    };

    const [reviseBusinessName, setBusinessName] = useState('');

    return useObserver(() => (
        <>
            {contextHolder}
            <Layout>
                <Header style={{ background: 'white' }}>
                    <Row justify="space-between">
                        {props.navState.getNavState() === '사업 등록' &&<Col></Col>}
                        {props.navState.getNavState() !== '사업 등록' &&
                            <Row justify="space-between">
                                    <Title level={2}>{businessesMaterial && businessesMaterial.businessName}</Title>
                                &nbsp;&nbsp;
                                {businessesMaterial &&
                                    <EditOutlined onClick={showModal}/>
                                }
                                <Modal
                                    open={open}
                                    width={300}
                                    title="사업 수정"
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    footer={[
                                        <Button key="back" onClick={handleCancel}>
                                            취소
                                        </Button>,
                                        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                                            수정
                                        </Button>,
                                    ]}
                                >
                                    <br/>
                                    <Form onFinish={handleOk}>
                                        <Form.Item label="수정 할 사업 명" >
                                            <Input value={reviseBusinessName} onChange={(e) => setBusinessName(e.target.value)} />
                                        </Form.Item>
                                    </Form>
                                </Modal>

                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                {businessesMaterial &&
                                    <DeleteOutlined onClick={showDeleteConfirm} />
                                }
                            </Row>
                        }
                        <Col>
                            <Dropdown.Button
                                overlay={menuUserAccount}
                                icon={<UserOutlined />}
                            >
                                <strong>{user && user.name}</strong>&nbsp;님
                            </Dropdown.Button>
                        </Col>
                    </Row>
                </Header>
                {props.navState.getNavState() === '사업 등록' && <RegisterBusiness/>}
                {props.navState.getNavState() !== '사업 등록' &&
                    <Content style={{ background: 'white', padding: 28 }}>
                        <Row gutter={8}>
                            <Col flex={100}/>
                            <Col flex={1}>
                                <Row>
                                    {businessId !== null &&
                                        <BusinessMaterialAddInput businessIdParam={businessId} onEvent={handleMutate} />}
                                </Row>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ alignItems: 'center' }}>
                            <Col flex={1}>
                                <Row style={{ fontSize: 12 }}>
                                    <br />
                                </Row>
                                {businessesMaterial && <Row> 조회 결과&nbsp;<strong>({businessesMaterial.count})</strong></Row>}
                            </Col>
                            <Col>
                                <Button type="dashed" icon={<img src="/mainScreen/excel-icon.png" alt="엑셀 다운로드 이미지" width="20" height="20"/>} size={"middle"}>
                                    엑셀 다운로드
                                </Button>
                            </Col>
                            <Col>
                                <Row style={{ fontSize: 12 }}>
                                    <br />
                                </Row>
                            </Col>
                        </Row>
                        {businessesMaterial === undefined &&
                            <Result
                                icon={null}
                                title={<div style={{color:'#cc5800'}}>반갑습니다. 귀하의 사업을 응원합니다.</div>}
                                subTitle={<div style={{color:'#d5a47f'}}>"새로운 사업을 등록 하시거나, 기존 사업을 이어나가보세요."
                                    <br/><br/>
                                    <Button onClick={() => onTourEvent(true)}>가이드 보기</Button></div>}
                                extra={
                                <>
                                    <img src="/mainScreen/정.png" alt="로그인 이미지" width="495" height="528"/>
                                </>}
                            />
                        }
                        {businessesMaterial !== undefined &&
                            <BusinessMainScreenTable businessesMaterial={businessesMaterial.businessMaterials}
                                                     businessId={businessId}
                                                     onEvent={handleMutate}
                            />
                        }
                    </Content>
                }
            </Layout>
        </>
    ));
}

export default BusinessMainScreen;