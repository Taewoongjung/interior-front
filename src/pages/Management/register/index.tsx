import React, {useState} from "react";
import {Button, Col, Drawer, Form, Input, message, Popover, Row, Space} from "antd";
import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import axios from "axios";
import SearchAddressPopUp from "../../../components/SearchAddressPopUp";
import {useObserver} from "mobx-react";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const CompanyRegister = (props:{onEvent: () => void; onTourEvent: () => void; tourRef:any}) => {
    const {onEvent, onTourEvent, tourRef} = props;

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


    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        onTourEvent();
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const {companyName, zipCode, mainAddress, subAddress, tel} = values;
        const bdgNumber = addressBuildingNum;
        await axios
            .post(`${API_URL}/api/companies`, {
                companyName, zipCode, mainAddress, subAddress, bdgNumber, tel
            },
            {
                withCredentials: true, // CORS 처리 옵션
                headers: {
                    Authorization: localStorage.getItem("interiorjung-token")
                }
            }
            ).then((response) => {
                if (response.data === true) {
                    success('등록 완료');
                    onClose();
                    onEvent();
                    form.resetFields();
                    setAddress('');
                    setAddressZoneCode('');
                    setAddressBuildingNum('');
                }}
            )
            .catch((error) => {
                if (error.response.data.errorCode === 1201) {
                    errorModal(error.response.data.message);
                }
                else{
                    console.dir(error);
                }
            });
    }

    const [openSearchAddr, setOpenSearchAddr] = useState(false);

    const handleOpenSearchAddrChange = (newOpen: boolean) => {
        setOpenSearchAddr(newOpen);
    };

    const [address, setAddress] = useState('');
    const [addressZoneCode, setAddressZoneCode] = useState("");
    const [addressBuildingNum, setAddressBuildingNum] = useState("");

    const handleAddress = (newAddress:any) => {
        setAddress(newAddress.address);
        setAddressZoneCode(newAddress.zonecode);
        setAddressBuildingNum(newAddress.buildingCode);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const formFields = [
        { name: ['zipCode'], value: addressZoneCode },
        { name: ['mainAddress'], value: address },
    ];

    return useObserver(() => (
        <>
            {contextHolder}
            <Button ref={tourRef} type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                사업체 등록
            </Button>
            <Drawer
                title="사업체 등록"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>취소</Button>
                        <Button onClick={() => form.submit()} type="primary">
                            등록
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish} fields={formFields}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="companyName"
                                label="사업체 명"
                                rules={[{ required: true, message: '⚠️ 사업체 명은 필수 응답 항목입니다.' }]}
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    id="company_name"
                                    type="text"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="zipCode"
                                label="사업체 메인주소"
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
                                    id="company_sub_address"
                                    type="text"
                                    placeholder = "사업체 나머지 주소"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="tel"
                                label="사업체 전화번호"
                                rules={[
                                    { required: true, message: '⚠️ 사업체 전화번호는 필수 입력입니다.' },
                                    { pattern: /^010[0-9]{8}$/, message: '⚠️ 전화번호 양식이 맞지 않습니다.',}
                                ]}
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    id="company_tel"
                                    type="text"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    ));
}

export default CompanyRegister;
