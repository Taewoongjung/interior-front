import Modal from "antd/es/modal/Modal";
import React, { useState } from "react";
import dayjs from 'dayjs';
import {
    DatePicker,
    GetProps,
    Space,
    Select,
    SelectProps,
    Input,
    Radio,
    Popover, Flex,
} from "antd";
import {TagOutlined, QuestionCircleOutlined, PushpinOutlined} from "@ant-design/icons";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;

type LabelRender = SelectProps['labelRender'];

const selectionScheduleTypeOptions = [
    { label: '일정', value: 'workSchedule' },
    { label: '발주', value: 'orderSchedule' },
];

const selectionAlarmTime = [
    { label: '이벤트시간', value: 'atTheTime'},
    { label: '10분 전', value: '10minutesAgo'},
    { label: '30분 전', value: '30minutesAgo'},
    { label: '1시간 전', value: 'aHourAgo'},
    { label: '2시간 전', value: 'twoHoursAgo'},
    { label: '1일 전', value: 'aDayAgo'},
    { label: '2일 전', value: 'twoDayAgo'},
    { label: '1주 전', value: 'aWeekAgo'},
]


const AddScheduleModal = (props:{onOpen:boolean, onOpenHandler: (event:boolean) => void}) => {

    const {onOpen, onOpenHandler} = props;

    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().endOf('day');
    };

    const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => range(0, 60).splice(4, 20),
                disabledMinutes: () => range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => range(0, 60).splice(20, 4),
            disabledMinutes: () => range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    };

    const labelRender: LabelRender = (props) => {
        const { label, value } = props;

        if (label) {
            return label;
        }
    };

    const [scheduleType, setScheduleType] = useState('');

    const handleChange = (value: string) => {
        console.log(`Selected: ${value}`);
        setScheduleType(value);
    };

    return (
        <>
            <Modal
                title="스케줄 추가"
                centered
                open={onOpen}
                onOk={() => onOpenHandler(false)}
                onCancel={() => onOpenHandler(false)}
            >
                <Space direction="vertical">

                    <br/>
                    <div style={{color:"grey"}}>스케줄 타입 선택</div>
                    <Select
                        // status="error"
                        placeholder="스케줄 타입"
                        style={{ width: 200 }}
                        labelRender={labelRender}
                        onChange={handleChange}
                        options={selectionScheduleTypeOptions}
                    />

                    <div style={{color:"grey", marginTop: 15}}>스케줄 타이틀</div>
                    <Input placeholder="제목" prefix={<TagOutlined />} />

                    {scheduleType === 'orderSchedule' && <div style={{color:"grey", marginTop: 10}}>발주처 정보</div>}
                    {scheduleType === 'orderSchedule' && <Input placeholder="발주처" prefix={<PushpinOutlined />} />}

                    <div style={{color:"grey", marginTop: 10}}>스케줄 날짜 선택</div>
                    <RangePicker
                        disabledDate={disabledDate}
                        disabledTime={disabledRangeTime}
                        showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                    />

                    <div style={{color:"grey", marginTop: 10}}>스케줄 날짜 선택
                        알람 여부 &nbsp;
                        <Popover content={"알람을 설정하시면 대표님께 알림톡이 전송됩니다."}>
                            <QuestionCircleOutlined />
                        </Popover>
                    </div>

                    <Space direction="horizontal">
                        <Flex gap="large">
                            <Radio.Group defaultValue="OFF" buttonStyle="solid">
                                <Radio.Button value="ON">ON</Radio.Button>
                                <Radio.Button value="OFF">OFF</Radio.Button>
                            </Radio.Group>

                            <Select
                                placeholder="알림 시간"
                                style={{ width: 110 }}
                                labelRender={labelRender}
                                options={selectionAlarmTime}
                            />
                        </Flex>
                    </Space>
                </Space>
            </Modal>
        </>
    )
}

export default AddScheduleModal;
