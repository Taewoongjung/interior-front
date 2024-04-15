import React, {useEffect, useState} from "react";
import {Button, Col, Dropdown, Input, Layout, Menu, Row, Table, TableColumnsType} from "antd";
import {ArrowDownOutlined, UserOutlined} from "@ant-design/icons";
import BusinessMaterialAddInput from "./BusinessMaterialAddInput";
import {Content, Header} from "antd/es/layout/layout";
import {useLocation} from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";

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
        width: 30,
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
        width: 50,
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
        title: '',
        key: 'operation',
        fixed: 'right',
        width: 30,
        render: () => <a>삭제</a>,
    },
];

const BusinessMainScreen = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const businessId = queryParams.get('businessId');
    console.log("businessId = ", businessId);

    const {data:businessesMaterial, error, mutate} = useSWR(
        `http://api-interiorjung.shop:7077/api/businesses/${businessId}`,
        // `http://localhost:7070/api/businesses/${businessId}`,
        fetcher);

    const handleMutate = () => {
        mutate();
    };

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const [tableData, setTableData] = useState<DataType[]>([]);

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

    return(
        <>
            <Layout>
                <Header style={{ background: 'white' }}>
                    <Row justify="space-between">
                        <Col>
                            <Input.Search
                                style={{
                                    verticalAlign: 'middle',
                                    minWidth: 400
                                }}
                                allowClear
                                placeholder="Search here..."
                                enterButton
                            />
                        </Col>
                        <Col>
                            <Dropdown.Button
                                overlay={menuUserAccount}
                                icon={<UserOutlined />}
                            >
                                Yoav Melamed
                            </Dropdown.Button>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ background: 'white', padding: 48 }}>
                    <Row gutter={8} style={{ alignItems: 'center' }}>
                        <Col flex={1}>
                            <Row style={{ fontSize: 12 }}>
                                <br />
                            </Row>
                            <Row>Profiles (3)</Row>
                        </Col>
                        <Col>
                            <Row>
                                <span style={{ fontSize: 12 }}>Sort by</span>
                            </Row>
                            <Row>
                                <Dropdown overlay={menuSortBy}>
                                    <Button style={{ borderRadius: '2px 0 0 2px' }}>
                                        Profile name
                                    </Button>
                                </Dropdown>
                                <Button style={{ borderLeft: 0, borderRadius: '0 2px 2px 0' }}>
                                    <ArrowDownOutlined />
                                </Button>
                            </Row>
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
                    <Table columns={columns} dataSource={tableData} scroll={{ x: 1500, y: 300 }} />
                </Content>
            </Layout>
        </>
    )
}

export default BusinessMainScreen;