import React, {FormEventHandler, useCallback, useState} from "react";
import axios from "axios";
import { Button, Col, Drawer, Form, Input, Row, Select, Space, InputNumber } from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {options} from "./select";

const BusinessMaterialAddInputAntd = ((props: { businessIdParam?: any; onEvent: () => void;}) => {

    const {businessIdParam, onEvent} = props;

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const [form] = Form.useForm();
    const onClose = () => {
        setOpen(false);
    };

    const [value, setValue] = useState<string | number | null>('0');

    const onFinish = async (values: any) => {
        const materialAmount = values.materialAmount;
        const materialCategory = values.materialCategory;
        const materialMemo = values.materialMemo;
        const materialName = values.materialName;

        // Axios 요청 보내기
        await axios
            .post(`http://api-interiorjung.shop:7077/api/businesses/${businessIdParam}/materials`, {
            // .post(`http://localhost:7070/api/businesses/${businessIdParam[0]}/materials`, {
                materialAmount, materialCategory, materialMemo, materialName
        }, {
            withCredentials: true, // CORS 처리 옵션
            headers: {
                Authorization: localStorage.getItem("interiorjung-token")
            }
        })
            .then(response => {
                console.log('Response:', response);
                onClose();
                onEvent();
            })
            .catch(error => {
                console.error('Error:', error);
                // 실패 처리
                // 필요한 작업 수행
            });
    };

    return (
        <>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                재료 추가
            </Button>
            <Drawer
                title="인테리어 재료 추가하기"
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
                                name="materialName"
                                label="재료 명"
                                rules={[{ required: true, message: '⚠️ 재료명은 필수 응답 항목입니다.' }]}
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    id="material_name"
                                    placeholder="재료 명 입력..." type="text"
                                />

                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="materialAmount"
                                label="재료 개수"
                                rules={[{ required: true, message: '⚠️ 개수는 필수 입니다.' }]}
                            >
                                <Space>
                                    <InputNumber
                                        min={1} max={10000} value={value} onChange={setValue}
                                        id="material_amount" placeholder="재료 개수" type="text"/>

                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setValue(0);
                                        }}
                                    >
                                        리셋
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="materialCategory"
                                label="자재 종류"
                                rules={[{ required: true, message: '⚠️ 재료의 카테고리는 필수값입니다.' }]}
                            >
                                <Select placeholder="재료의 카테고리를 입력해주세요.">
                                    {options.map(option => (
                                        <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}></Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="materialMemo"
                                label="재료 설명"
                                rules={[
                                    {
                                        required: false
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} placeholder="자재에 대한 메모를 입력해주세요." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    )
});

export default BusinessMaterialAddInputAntd;