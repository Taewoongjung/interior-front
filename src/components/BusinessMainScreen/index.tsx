import React, {useEffect, useState} from "react";
import {
    Button,
    Col,
    Dropdown, Input,
    Layout,
    Menu, message, Modal,
    Row,
    Table,
    TableColumnsType,
    Typography,
    Form
} from "antd";
import {
    ArrowDownOutlined,
    UserOutlined,
    LogoutOutlined,
    EditOutlined,
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

interface DataType {
    key: React.Key;
    name: string;
    category: number;
    amount: string;
    memo: string;
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'No',
        width: 20,
        dataIndex: 'key',
        key: 'id',
        // fixed: 'left',
    },
    {
        title: '재료 명',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        // fixed: 'left',
    },
    {
        title: '카테고리',
        width: 40,
        dataIndex: 'category',
        key: 'category',
        // fixed: 'left',
    },
    {
        title: '수량',
        dataIndex: 'amount',
        key: 'category',
        width: 50,
        // fixed: 'left',
    },
    {
        title: '메모',
        dataIndex: 'memo',
        key: 'memo',
        width: 150,
    },
    {
        title: '-',
        key: 'operation',
        fixed: 'right',
        width: 30,
        render: () => <a>삭제</a>,
    },
];

const { Title } = Typography;

const BusinessMainScreen = (props:{navState:MainNavState; user:any; onEvent: () => void;}) => {
    const {user, onEvent} = props;

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

    const [sortKey, setSortKey] = useState(null);
    const [sortValue, setSortValue] = useState('');

    const handleMenuClick = (e:any) => {
        const keyToValueMap = {
            no: 'No',
            name: '재료 명',
            category: '카테고리'
        };

        setSortKey(e.key);
        // @ts-ignore
        setSortValue(keyToValueMap[e.key]);
    };

    const menuSortBy = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="no">No</Menu.Item>
            <Menu.Item key="name">재료 명</Menu.Item>
            <Menu.Item key="category">카테고리</Menu.Item>
        </Menu>
    );

    // 정렬된 데이터를 생성하는 함수
    const getSortedData = (data: DataType[]) => {
        if (!sortKey) return data;

        return data.slice().sort((a, b) => {
            // @ts-ignore
            if (a[sortKey] < b[sortKey]) return -1;
            // @ts-ignore
            if (a[sortKey] > b[sortKey]) return 1;
            return 0;
        });
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

    const [tableData, setTableData] = useState<DataType[]>([]);

    const sortedData = getSortedData(tableData);

    // 데이터가 업데이트될 때마다 실행되는 useEffect
    useEffect(() => {
        console.log("businessesMaterial = ", businessesMaterial)
        if (businessesMaterial) {
            // 새로운 데이터를 추가하기 위해 이전 데이터를 복제
            const newData: ((prevState: DataType[]) => DataType[]) | { key: any; name: any; category: any; amount: any; memo: any; }[] = [];

            let count = 1;
            // 새로운 데이터를 추가
            businessesMaterial.businessMaterialList.forEach((business: { id:any; name: any; category: any; amount: any; memo:any; }, index: any) => {
                // 이미 존재하는 아이템인지 확인
                const existingItemIndex = newData.findIndex(item => item.key === business.id);
                if (existingItemIndex === -1) {
                    // 존재하지 않는 경우에만 추가
                    newData.push({
                        key: count,
                        name: business.name,
                        category: business.category,
                        amount: business.amount,
                        memo: business.memo,
                    });
                    count++;
                }
            });

            // 업데이트된 데이터를 상태에 저장
            setTableData(newData);
        }
    }, [businessesMaterial]);

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
        }, 5000);

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
                }
            })
            .catch((error) => {
                console.log(error);
                errorModal(error);
            })

        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
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
                                    <Title level={2}>{businessesMaterial && businessesMaterial.name}</Title>
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
                    <Content style={{ background: 'white', padding: 48 }}>
                        <Row gutter={8} style={{ alignItems: 'center' }}>
                            <Col flex={1}>
                                <Row style={{ fontSize: 12 }}>
                                    <br />
                                </Row>
                                <Row>조회 결과&nbsp;<strong>({tableData.length})</strong></Row>
                            </Col>
                            <Col>
                                {tableData.length !== 0 &&
                                    <Row>
                                        <span style={{ fontSize: 10 }}>- 정렬 조건 -</span>
                                    </Row>
                                }
                                {tableData.length !== 0 &&
                                    <Row>
                                        <Dropdown overlay={menuSortBy}>
                                            <Button style={{ borderRadius: '15px 0 0 2px' }}>
                                                {sortValue ? sortValue : '-'}
                                            </Button>
                                        </Dropdown>
                                        <Button style={{ borderLeft: 0, borderRadius: '0 15px 2px 0' }}>
                                            <ArrowDownOutlined />
                                        </Button>
                                    </Row>
                                }
                            </Col>
                            <Col>
                                <Row style={{ fontSize: 12 }}>
                                    <br />
                                </Row>
                                <Row>
                                    <BusinessMaterialAddInput businessIdParam={businessId} onEvent={handleMutate} />
                                </Row>
                            </Col>
                        </Row>
                        <Table columns={columns} dataSource={sortedData} scroll={{ x: 1500, y: 700 }} />
                    </Content>
                }
            </Layout>
        </>
    ));
}

export default BusinessMainScreen;