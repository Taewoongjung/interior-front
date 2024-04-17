import React, {useState} from "react";
import {Button, Col, Drawer, Form, Input, message, Row, Select, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import {SIGNUP_ERROR_CODES} from "../../../codes/ErrorCodes";

const CompanyRegister = (props:{onEvent: () => void}) => {
    const {onEvent} = props;

    const [messageApi, contextHolder] = message.useMessage();

    const success = (successMsg:string) => {
        messageApi.open({
            type: 'success',
            content: successMsg,
        });
    };

    const error = (errorMsg:string) => {
        messageApi.open({
            type: 'error',
            content: errorMsg
        });
    };


    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const {companyName, mainAddress, subAddress, tel} = values;
        const bdgNumber = "1";
        await axios
            .post("http://api-interiorjung.shop:7077/api/companies", {
                // .post("http://localhost:7070/api/companies", {
                    companyName, mainAddress, subAddress, bdgNumber, tel
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
                }}
            )
            .catch((error) => {
                const errorCode = error.response.data.errorCode;

                if (SIGNUP_ERROR_CODES.includes(errorCode)) {

                }
                else{
                    console.dir(error);
                }
            });
    }

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
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
                <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish}>
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
                                name="mainAddress"
                                label="사업체 메인주소"
                                rules={[{ required: true, message: '⚠️ 주소는 필수 응답 항목입니다.' }]}
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    id="company_main_address"
                                    type="text"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="subAddress"
                                label="사업체 부 주소"
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    id="company_sub_address"
                                    type="text"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
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
    )
}

export default CompanyRegister;