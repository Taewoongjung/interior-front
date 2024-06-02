import React, {useState, useRef} from "react";
import axios from "axios";
import {Button, Col, Drawer, Form, Input, Row, Select, Space, InputNumber, Alert, Divider, InputRef} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {amountUnitOptions, categoryOptions} from "./select";

let index = 0;

const BusinessMaterialAddInput = ((props: { businessIdParam?: any; onEvent: () => void; onLogEvent: () => void;}) => {

    const {businessIdParam, onEvent, onLogEvent} = props;

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
        const materialUsageCategory = values.materialUsageCategory;
        const materialCategory = values.materialCategory;
        const materialMemo = values.materialMemo;
        const materialAmountUnit = values.materialAmountUnit;
        const materialName = values.materialName;
        const laborCostPerUnit = values.laborCostPerUnit;
        const materialCostPerUnit = values.materialCostPerUnit;

        await axios
            .post(`http://api-interiorjung.shop:7077/api/businesses/${businessIdParam}/materials`, {
            // .post(`http://localhost:7070/api/businesses/${businessIdParam[0]}/materials`, {
                materialAmount, materialUsageCategory, materialCategory, materialMemo, materialAmountUnit, materialName,
                materialCostPerUnit, laborCostPerUnit
        }, {
            withCredentials: true, // CORS 처리 옵션
            headers: {
                Authorization: localStorage.getItem("interiorjung-token")
            }
        })
            .then(response => {
                onClose();
                onEvent();
                onLogEvent();
                form.resetFields();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const [items, setItems] = useState(categoryOptions);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const [selectedValue, setSelectedValue] = useState(null);
    const handleSelectChange = (value: React.SetStateAction<null>) => {
        setSelectedValue(value); // 선택된 값 업데이트
        form.setFieldsValue({ materialAmountUnit: value }); // Form 필드에 선택된 값 업데이트
    };

    return (
        <>
            <Button onClick={showDrawer} icon={<PlusOutlined />}>
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
                                name="materialUsageCategory"
                                label="재료 사용 분류"
                                rules={[{ required: true, message: '⚠️ 재료 사용 분류는 필수 응답 항목입니다.' }]}
                            >
                                <Input
                                    style={{ width: '100%' }}
                                    id="material_usage"
                                    placeholder="ex) 화장실 공사, 주방 공사 ..." type="text"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

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
                    </Row>
                    <Row gutter={16}>
                        <Col span={4.5}>
                            <Form.Item
                                name="materialAmount"
                                label="재료 개수"
                            >
                                <Space>
                                    <InputNumber min={1} max={10} defaultValue={3} value={value} onChange={setValue}/>
                                </Space>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                name="materialAmountUnit"
                                label="단위"
                                rules={[{ required: true, message: '⚠️ 수량에 대한 단위는 필수값입니다.' }]}
                                style={{ width: "170px" }}
                            >
                                <Space>
                                    <Select
                                        placeholder="단위"
                                        style={{ width: "100%" }}
                                        onChange={handleSelectChange}
                                        value={selectedValue}
                                    >
                                        {amountUnitOptions.map(option => (
                                            <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                                        ))}
                                    </Select>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={10}>
                            <Form.Item
                                name="materialCostPerUnit"
                                label="재료 단가"
                                style={{ width: "200px" }}
                            >
                                <Input suffix="₩"/>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                name="laborCostPerUnit"
                                label="노무비 단가"
                                style={{ width: "200px" }}
                            >
                                <Input suffix="₩"/>
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
                                <Select
                                    style={{ width: 300 }}
                                    placeholder="재료의 카테고리를 입력해주세요."
                                    dropdownRender={(categoryOptions) => (
                                        <>
                                            {categoryOptions}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <Input
                                                    placeholder="원하는 카테고리 추가"
                                                    ref={inputRef}
                                                    value={name}
                                                    onChange={onNameChange}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                                    추가
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                    options={items.map((item) => ({ label: item, value: item }))}
                                />
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

                <Divider/>
                <br/>

                <Alert
                    message="알림"
                    description="추가 후 각 재료의 재료명과 카테고리는 수정 하지 못합니다."
                    type="warning"
                    showIcon
                />
            </Drawer>
        </>
    )
});

export default BusinessMaterialAddInput;