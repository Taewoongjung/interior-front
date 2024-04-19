import React, {useCallback, useState} from "react";
import {
    Button,
    Descriptions,
    DescriptionsProps, Divider,
    Form,
    Input,
    Layout,
    notification,
    NotificationArgsProps,
    Space, Typography
} from "antd";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";
import { Header } from "antd/es/layout/layout";

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


    const onChangeBusinessName = (e: { target: { value: string; }; }) => {
        const value = e.target.value;
        setBusinessName(value);
    };

    const { companyId } = useParams();

    const history = useHistory();
    const newQueryParams = new URLSearchParams(history.location.search);

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
                    console.log("사업 등록 후 response = ", response);

                    if (response.data.isSuccess === true) {
                        // props.navState._newBusinessUpdate(); // 사업 등록 후 업데이트
                        setBusinessName('');
                        openNotification('top'); // 함수 호출

                        setTimeout(() => {
                            newQueryParams.set('businessId', response.data.createdBusinessId);
                            history.push({
                                pathname: `/main/${companyId}`,
                                search: newQueryParams.toString(),
                            });
                        }, 1000);
                    }
                })
                .catch((error) => {
                    console.dir("error = ", error);
                    error(error);
                });
        },
        [businessName]
    );

    return (
        <>
            {contextHolder}
            <Layout style={{ background: 'white' }}>
                <Header style={{ background: 'white' }}>
                    <Form form={form} onFinish={onSubmitCreateBusiness}>
                    <Title level={3}>사업 등록</Title>
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
                            <Space direction="horizontal" size="middle">
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input minLength={2} maxLength={15} onChange={onChangeBusinessName} />
                                    <Button onClick={() => form.submit()} type="primary">등록</Button>
                                </Space.Compact>
                            </Space>
                        </Form.Item>
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