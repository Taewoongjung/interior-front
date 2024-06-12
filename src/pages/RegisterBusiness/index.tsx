import React, {useCallback, useState} from "react";
import {
    Button,
    Descriptions,
    DescriptionsProps, Divider,
    Form,
    Input,
    Layout,
    notification,
    NotificationArgsProps, Popover,
    Space, Typography, Row, Col
} from "antd";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import SearchAddressPopUp from "../../components/SearchAddressPopUp";
import {SearchOutlined} from "@ant-design/icons";
import mainNavStateInstance from "../../statemanager/mainNavState";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

type NotificationPlacement = NotificationArgsProps['placement'];

const items: DescriptionsProps['items'] = [
    {
        key: '1',
        label: '사업 명',
        children: '대장동 인테리어건'
    }
]

const { Title } = Typography;

const RegisterBusiness = () => {

    const [form] = Form.useForm();

    const [businessName, setBusinessName] = useState('');

    const [api, contextHolder] = notification.useNotification();

    const openNotification = async (placement: NotificationPlacement) => {
        await api.info({
            message: "등록 성공",
            description: "사업이 등록 완료 되었습니다.",
            placement
        });
    };

    const openErrorNotification = async (placement: NotificationPlacement, msg:string) => {
        await api.error({
            message: "등록 중 에러 발생",
            description: msg,
            placement
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [openSearchAddr, setOpenSearchAddr] = useState(false);

    const handleOpenSearchAddrChange = (newOpen: boolean) => {
        setOpenSearchAddr(newOpen);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleAddress = (newAddress:any) => {
        setAddress(newAddress.address);
        setAddressZoneCode(newAddress.zonecode);
        setAddressBuildingNum(newAddress.buildingCode);
    };

    const [address, setAddress] = useState('');
    const [addressZoneCode, setAddressZoneCode] = useState('');
    const [bdgNumber, setAddressBuildingNum] = useState('');


    const formFields = [
        { name: ['zipCode'], value: addressZoneCode },
        { name: ['mainAddress'], value: address },
        { name: ['bdgNumber'], value: bdgNumber },
    ];

    const onChangeBusinessName = (e: { target: { value: string; }; }) => {
        const value = e.target.value;
        setBusinessName(value);
    };

    const { companyId } = useParams();

    const history = useHistory();

    const onSubmitCreateBusiness = useCallback(async (values: any) => {
            const {zipCode, mainAddress, subAddress, bdgNumber} = values;

            await axios.post(`${API_URL}/api/companies/${companyId}/businesses`, {
                        businessName, zipCode, mainAddress, subAddress, bdgNumber
                    }, {
                        withCredentials: true, // CORS 처리 옵션
                        headers: {
                            Authorization: localStorage.getItem("interiorjung-token")
                        }
                    }
                ).then((response) => {
                    if (response.data.isSuccess === true) {
                        setBusinessName('');
                        openNotification('top');

                        const newQueryParams = new URLSearchParams(history.location.search);
                        newQueryParams.set('businessId', response.data.createdBusinessId);

                        setTimeout(() => {
                            history.push({
                                pathname: `/main/${companyId}`,
                                search: newQueryParams.toString(),
                            });
                            mainNavStateInstance.setNavState("사업 목록");
                        }, 1000);
                    }
                })
                .catch((error) => {
                    openErrorNotification('top', error.toString());
                });
        },
        [businessName]
    );

    return (
        <>
            {contextHolder}
            <Layout style={{ background: 'white' }}>
                <Header style={{ background: 'white' }}>
                    <Form layout="vertical" form={form} onFinish={onSubmitCreateBusiness} fields={formFields}>
                        <Title level={3}>사업 등록</Title>
                        <Row>
                            <Form.Item
                                name="businessName"
                                label="사업 명"
                                style={{ marginTop: '10%' }}
                                rules={[
                                    { required: true, message: '⚠️ 사업 명은 필수 입니다.' },
                                    { min: 2, message: '사업 명은 최소 2글자 이상이어야 합니다.' },
                                    { max: 30, message: '사업 명은 최대 30글자까지만 가능합니다.' },
                                ]}
                            >
                                <Input minLength={2} maxLength={15} onChange={onChangeBusinessName} />
                            </Form.Item>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="zipCode"
                                    label="사업지 주소"
                                    rules={[{ required: true, message: '⚠️ 주소는 필수 응답 항목입니다.' }]}
                                >
                                    <Input addonAfter={
                                        (
                                            <Popover
                                                content={<SearchAddressPopUp setAddress={handleAddress} setOpenSearchAddr={setOpenSearchAddr}/>}
                                                trigger="click"
                                                open={openSearchAddr}
                                                placement="bottom"
                                                onOpenChange={handleOpenSearchAddrChange}
                                            >
                                                <SearchOutlined onClick={(e) => {
                                                    e.preventDefault();
                                                    showModal();
                                                }}
                                                />
                                            </Popover>
                                        )
                                    } style={{width:"200px"}} readOnly
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}/>
                        </Row>
                        <Row gutter={16}>
                            <Col>
                                <Form.Item
                                    name="mainAddress"
                                >
                                    <Input
                                        style={{ width: '300px' }}
                                        readOnly
                                    />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    name="subAddress"
                                    rules={[
                                        { required: true, message: '⚠️ 나머지 주소는 필수 응답 항목입니다.' },
                                    ]}
                                >
                                    <Input
                                        style={{ width: '300px' }}
                                        id="business_sub_address"
                                        type="text"
                                        placeholder = "사업 나머지 주소"
                                    />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    name="bdgNumber"
                                    style={{ visibility: 'hidden' }}
                                />
                            </Col>
                        </Row>
                        <br/>
                        <br/>
                        <Space direction="horizontal" size="middle">
                            <Space.Compact style={{ width: '100%' }}>
                                <Button onClick={() => form.submit()} type="primary">등록</Button>
                            </Space.Compact>
                        </Space>
                    </Form>
                    <br/>
                    <Divider />
                    <Descriptions title="등록 예시" items={items} />
                </Header>
            </Layout>
        </>
    );
};

export default RegisterBusiness;