import React, {useCallback, useState} from "react";
import {Button, Form, Input, Layout, Space} from "antd";
import axios from "axios";
import {useParams} from "react-router-dom";
import { Header } from "antd/es/layout/layout";

const RegisterBusiness = () => {

    const [form] = Form.useForm();

    const [businessName, setBusinessName] = useState('');

    const onChangeBusinessName = (e: { target: { value: string; }; }) => {
        const value = e.target.value;
        setBusinessName(value);
    };

    const { companyId } = useParams();

    const onSubmitCreateBusiness = useCallback(async (e: { preventDefault: () => void; }) => {

            await axios
                .post(`http://api-interiorjung.shop:7077/api/companies/${companyId}/businesses`, {
                // .post(`http://localhost:7070/api/companies/${companyId}/businesses`, {
                        businessName
                    }, {
                        withCredentials: true, // CORS 처리 옵션
                        headers: {
                            Authorization: localStorage.getItem("interiorjung-token")
                        }
                    }
                ).then((response) => {
                    if (response.data === true) {
                        // props.navState._newBusinessUpdate(); // 사업 등록 후 업데이트
                        setBusinessName('');
                    }
                })
                .catch((error) => {
                    console.dir("error = ", error);
                });
        },
        [businessName]
    );

    return (
        <>
            <Layout>
                <Header style={{ background: 'white' }}>
                    <Form form={form} onFinish={onSubmitCreateBusiness}>
                        <Form.Item
                            name="businessName"
                            label="사업 명"
                            style={{ marginTop: '30%' }}
                            rules={[{ required: true, message: '⚠️ 사업 명은 필수 입니다.' }]}
                        >
                            <Space direction="horizontal" size="middle">
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input minLength={2} maxLength={15} onChange={onChangeBusinessName} />
                                    <Button onClick={() => form.submit()} type="primary">등록</Button>
                                </Space.Compact>
                            </Space>
                        </Form.Item>
                    </Form>
                </Header>
            </Layout>
        </>
    );
};

export default RegisterBusiness;