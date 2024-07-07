import React, {useEffect, useState} from "react";
import {
    Button,
    Col,
    Dropdown, Input,
    Layout,
    Menu, message, Modal,
    Row,
    Typography,
    Form, Result, Collapse, Flex,
} from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleFilled
} from "@ant-design/icons";
import BusinessMaterialAddInput from "./BusinessMaterialAddInput";
import {Content, Header} from "antd/es/layout/layout";
import {useHistory, useLocation, useParams} from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import RegisterBusiness from "../../pages/RegisterBusiness";
import {useObserver} from "mobx-react";
import axios from "axios";
import BusinessMainScreenTable from "./BusinessMaterialTable";
import BusinessMaterialLogTable from "./BusinessMaterialLogTable";
import {v4 as uuidv4} from 'uuid';
import ProgressBar from "../ProgressBar";
import BusinessManagement from "../BusinessManagement";
import mainNavStateInstance from "../../statemanager/mainNavState";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const { confirm } = Modal;

const { Title } = Typography;


const BusinessMainScreen = (props:{user:any; onEvent: () => void; onTourEvent: (e:boolean) => void; isCollapsed:boolean;}) => {

    const {user, onEvent, onTourEvent, isCollapsed} = props;

    const { companyId } = useParams();

    const history = useHistory();

    const [reviseBusinessName, setBusinessName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("interiorjung-token");

        if (token === null) {
            const redirectUrl = '/auth';
            history.push(redirectUrl);
            window.location.reload();
        }
    }, []);

    const handleGoBackManagement = () => {
        const redirectUrl = '/management';
        history.push(redirectUrl);
        window.location.reload();
    }

    const [taskId, setTaskId] = useState('');
    const [progressBarModalOpen, setProgressBarModalOpen] = useState(false);

    const handleLogout = () => {
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

    const {data:businesses, error, mutate} = useSWR(
            businessId ?
                `${API_URL}/api/businesses/${businessId}`
            : null,
        fetcher);

    const {data:materialLogData, error:logError, mutate:logMutate} = useSWR(
        businessId ?
                `${API_URL}/api/businesses/${businessId}/logs`
            : null,
        fetcher);

    const handleMutate = () => {
        mutate();
    };

    const handleLogMutate = () => {
        logMutate();
    }

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [fold, setFold] = useState(true);

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
            .patch(`${API_URL}/api/companies/${companyId}/businesses/${businessId}`, {
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
                    logMutate();
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
                    .delete(`${API_URL}/api/companies/${companyId}/businesses/${businessId}`, {
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

    const foldTable = () => {
        setFold(false);
        if (!fold) {
            setFold(true);
        }
    };

    useEffect(() => {
        const fetchExcel = async () => {
            if (taskId) {
                try {
                    const response = await axios.get(
                        `${API_URL}/api/excels/companies/${companyId}/businesses/${businessId}?taskId=${taskId}`,
                        {
                            responseType: 'blob', // 요청의 응답 형식을 'blob'으로 지정
                            withCredentials: true, // CORS 처리 옵션
                            headers: {
                                Authorization: localStorage.getItem('interiorjung-token')
                            }
                        }
                    );

                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '재료리스트.xlsx';
                    a.click();

                    window.URL.revokeObjectURL(url); // 사용한 URL 객체 해제
                } catch (error) {
                    console.error('Error downloading excel file:', error);
                } finally {
                    setTaskId('');
                }
            }
        };

        fetchExcel();

    }, [taskId]); // taskId가 변경될 때마다 실행

    const getExcel = async () => {
        await setTaskId(uuidv4());
        await setProgressBarModalOpen(true);
    }

    return useObserver(() => (
        <>
            {contextHolder}
            <Layout style={{ marginLeft: isCollapsed ? 65 : 185, width: "100%"}}>
                <Header style={{ background: 'white' }}>
                    <Row justify="space-between">
                        {mainNavStateInstance.getNavState() === '사업 등록' &&<Col></Col>}
                        {mainNavStateInstance.getNavState() === '사업 관리' &&<Col></Col>}
                        {(mainNavStateInstance.getNavState() !== '사업 등록' && mainNavStateInstance.getNavState() !== '사업 관리')  &&
                            <Row justify="space-between">
                                <Title level={2}>{businesses && businesses.businessName}</Title>
                                &nbsp;&nbsp;

                                {businesses && <EditOutlined onClick={showModal}/>}

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

                                {businesses &&
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
                {mainNavStateInstance.getNavState() === '사업 등록' && <RegisterBusiness/>}

                {mainNavStateInstance.getNavState() === '사업 관리' && <BusinessManagement/>}

                {(mainNavStateInstance.getNavState() !== '사업 등록' && mainNavStateInstance.getNavState() !== '사업 관리') &&
                    <Content style={{ background: 'white', padding: 28 }}>
                        <Row gutter={8}>
                            <Col flex={100}>
                                {/*<Tooltip title={fold ? '테이블 펴기' : '테이블 접기'}>*/}
                                {/*    <Button onClick={foldTable} shape="circle" icon={ fold ? <PlusOutlined /> : <MinusOutlined />} />*/}
                                {/*</Tooltip>*/}
                            </Col>
                            <Col flex={1}>
                                <Row>
                                    {businessId !== null &&
                                        <BusinessMaterialAddInput businessIdParam={businessId} onEvent={handleMutate} onLogEvent={handleLogMutate}/>}
                                </Row>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ alignItems: 'center' }}>
                            <Col flex={1}>
                                <Row style={{ fontSize: 12 }}>
                                    <br />
                                </Row>
                                {businesses && <Row> 조회 결과&nbsp;<strong>({businesses.count})</strong></Row>}
                            </Col>
                            <Col>
                                {(businesses && businesses.count > 0) &&
                                    <Button
                                        onClick={getExcel}
                                        type="dashed"
                                        icon={<img src="/mainScreen/excel-icon.png" alt="엑셀 다운로드 이미지" width="20" height="20"/>}
                                        size={"middle"}
                                    >
                                        엑셀 다운로드
                                    </Button>
                                }
                                <Modal
                                    title="재료 리스트 엑셀 다운로드"
                                    open={progressBarModalOpen}
                                    footer={null}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '200px', // 높이를 조정하여 중앙에 위치하도록 설정
                                    }}
                                >
                                    <ProgressBar taskId={taskId} setProgressBarModalOpen={setProgressBarModalOpen}/>
                                </Modal>
                            </Col>
                            <Col>
                                <Row style={{ fontSize: 12 }}>
                                    <br />
                                </Row>
                            </Col>
                        </Row>
                        {businesses === undefined &&
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
                        {businesses !== undefined &&
                            <Flex gap="middle">
                                <BusinessMainScreenTable businessesMaterial={businesses.businessMaterials}
                                                         businessProgress={businesses.businessProgressesList}
                                                         businessId={businessId}
                                                         companyId={companyId}
                                                         onEvent={handleMutate}
                                                         onLogEvent={handleLogMutate}
                                                         fold={fold}
                                />
                            </Flex>
                        }
                        <br/><br/><br/>
                        {materialLogData &&
                            <Collapse
                                size="large"
                                defaultActiveKey={['1']}
                                items={[{ key: '1', label: <strong>재료 변경 이력</strong>, children: <BusinessMaterialLogTable logData={materialLogData}/> }]}
                            />
                        }
                    </Content>
                }
            </Layout>
        </>
    ));
}

export default BusinessMainScreen;
