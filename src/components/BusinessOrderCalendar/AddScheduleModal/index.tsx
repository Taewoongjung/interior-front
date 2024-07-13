import Modal from "antd/es/modal/Modal";
import React, { useState } from "react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
    DatePicker,
    GetProps,
    Space,
    Select,
    SelectProps,
    Input,
    Radio,
    Popover, Flex, Switch
} from "antd";
import {TagOutlined, QuestionCircleOutlined, PushpinOutlined} from "@ant-design/icons";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

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

dayjs.extend(utc);
dayjs.extend(timezone);

const AddScheduleModal = (props:{onOpen:boolean, onOpenHandler: (event:boolean) => void}) => {

    const {onOpen, onOpenHandler} = props;

    const range = (start: number, end: number) => {
        return Array.from(Array(end - start), (_, i) => start + i);
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        const koreaTime = dayjs().tz('Asia/Seoul');
        return current && current < koreaTime.startOf('day');
    };

    const disabledRangeTime: RangePickerProps['disabledTime'] = (current, type) => {

        const now = dayjs().tz('Asia/Seoul');
        const currentHour = now.hour();
        const currentMinute = now.minute();

        if (current && current.isSame(now, 'day')) {
            if (type === 'start' || type === 'end' || type === undefined) {
                return {
                    disabledHours: () => range(0, 24).filter(hour => hour < currentHour),
                    disabledMinutes: () => range(0, 60).filter(minute => minute < currentMinute),
                };
            }
        }

        return {
            disabledHours: () => [],
            disabledMinutes: () => [],
        };
    };

    const labelRender: LabelRender = (props) => {
        const { label, value } = props;

        if (label) {
            return label;
        }
    };

    const [scheduleType, setScheduleType] = useState('일정');
    const [isAlarmOn, setIsAlarmOn] = useState(false);
    const [title, setTitle] = useState('');
    const [titleWhereStemsFrom, setTitleWhereStemsFrom] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [isAllDay, setIsAllDay] = useState<boolean>(false);
    const [alarmTime, setAlarmTime] = useState('');

    const allReset = () => {
        setScheduleType('');
        setIsAlarmOn(false);
        setTitle('');
        setTitleWhereStemsFrom('');
        setStartDate('')
        setEndDate('');
        setOrderDate('');
        setIsAllDay(false);
        setAlarmTime('');
    }

    const handleChangeScheduleType = (value: string) => {
        console.log(`Selected: ${value}`);
        setScheduleType(value);
    };

    const onChangeOrderSchedule = (e: any) => {
        console.log("?? = ", JSON.stringify(e));

        // if (date) {
        //     console.log('Date: ', date);
        // } else {
        //     console.log('Clear');
        // }
    };

    const handleSetAlarm = (event: any) => {

        if (event.target.value === 'ON') {
            setIsAlarmOn(true);
        } else {
            setIsAlarmOn(false);
            setAlarmTime('');
        }
    }

    const onClearScheduleType = () => {
        setScheduleType('');
    }

    const handleStartAndEndDateInfoForWorkSchedule = (e:any) => {

        let startDate = JSON.stringify(e[0]);
        let endDate = JSON.stringify(e[1]);

        console.log("start = ", startDate);
        console.log("end = ", endDate);

        setStartDate(startDate);
        setEndDate(endDate);
    }

    const handleIsAllDay = (e:any) => {
        setIsAllDay(e);
    }

    const handChangeAlarmTime = (e:any) => {
        setAlarmTime(e);
    }


    return (
        <>
            <Modal
                title="스케줄 추가"
                centered
                open={onOpen}
                closable={false}
                onOk={() => onOpenHandler(false)}
                onCancel={() => {
                    allReset();
                    onOpenHandler(false)
                }}
                okText={"저장"}
                cancelText={"취소"}
            >
                <Space direction="vertical">

                    <br/>

                    <div style={{color:"grey"}}>1. 스케줄 타입 선택</div>
                    <Select
                        allowClear
                        onClear={onClearScheduleType}
                        value={scheduleType}
                        style={{ width: 80 }}
                        labelRender={labelRender}
                        onChange={handleChangeScheduleType}
                        options={selectionScheduleTypeOptions}
                    />

                    <div style={{color:"grey", marginTop: 15}}>2. 스케줄 타이틀</div>
                    <Input
                        placeholder="제목"
                        prefix={<TagOutlined />}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {scheduleType === 'orderSchedule' && <div style={{color:"grey", marginTop: 10}}>발주처 정보</div>}
                    {scheduleType === 'orderSchedule' &&
                        <Input
                            placeholder="발주처"
                            prefix={<PushpinOutlined />}
                            value={titleWhereStemsFrom}
                            onChange={(e) => {setTitleWhereStemsFrom(e.target.value)}}
                        />
                    }

                    <div style={{color:"grey", marginTop: 10}}>3. 스케줄 날짜 선택</div>
                    {(scheduleType !== 'orderSchedule' && !isAllDay) &&
                        <DatePicker.RangePicker
                            disabledDate={disabledDate}
                            disabledTime={disabledRangeTime}
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
                            }}
                            onCalendarChange={
                            (e) => {
                                handleStartAndEndDateInfoForWorkSchedule(e);
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    }
                    {(scheduleType !== 'orderSchedule' && isAllDay) &&
                        <DatePicker.RangePicker
                            disabledDate={disabledDate}
                            onCalendarChange={
                                (e) => {
                                    handleStartAndEndDateInfoForWorkSchedule(e);
                                }}
                            format="YYYY-MM-DD"
                        />
                    }
                    {scheduleType !== 'orderSchedule' &&
                        <Space direction="horizontal">
                            <Flex gap="small">
                                <div style={{color:"grey"}}>하루 종일</div>

                                <Switch
                                    onChange={(e) => handleIsAllDay(e)}
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                    defaultValue={false}
                                />
                            </Flex>
                        </Space>
                    }

                    {scheduleType === 'orderSchedule' &&
                        <DatePicker
                            disabledDate={disabledDate}
                            disabledTime={disabledRangeTime}
                            placeholder="발주 날짜/시간"
                            presets={[
                                { label: '내일', value: dayjs().add(1, 'd') },
                                { label: '다음주', value: dayjs().add(7, 'd') },
                                { label: '다음달', value: dayjs().add(1, 'month') },
                            ]}
                            onCalendarChange={(e) => {onChangeOrderSchedule(e)}}
                            showTime={{}}
                        />
                    }

                    <div style={{color:"grey", marginTop: 20}}>4. 알람 여부 &nbsp;
                        <Popover content={"알람을 설정하시면 대표님께 알림톡이 전송됩니다."}>
                            <QuestionCircleOutlined />
                        </Popover>
                    </div>

                    <Space direction="horizontal">
                        <Flex gap="large">
                            <Radio.Group defaultValue="OFF" buttonStyle="solid">
                                <Radio.Button onChange={handleSetAlarm} value="ON">켬</Radio.Button>
                                <Radio.Button onChange={handleSetAlarm} value="OFF">끄기</Radio.Button>
                            </Radio.Group>

                            {isAlarmOn && <div style={{color:"grey"}}>알람 시간 : </div>}
                            {isAlarmOn &&
                                <Select
                                    placeholder="알림 시간"
                                    style={{ width: 110, marginLeft:-20 }}
                                    labelRender={labelRender}
                                    options={selectionAlarmTime}
                                    value={alarmTime}
                                    onChange={handChangeAlarmTime}
                                />
                            }
                        </Flex>
                    </Space>
                </Space>
            </Modal>
        </>
    )
}

export default AddScheduleModal;
