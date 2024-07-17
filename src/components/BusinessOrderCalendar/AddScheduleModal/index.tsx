import Modal from "antd/es/modal/Modal";
import React, {useState} from "react";
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
    Popover, Flex, Switch, message
} from "antd";
import {TagOutlined, QuestionCircleOutlined, PushpinOutlined} from "@ant-design/icons";
import {useBusinessStores} from "../../../hooks/useBusinessStore";
import {useObserver} from "mobx-react";
import axios from "axios";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

type LabelRender = SelectProps['labelRender'];

const selectionScheduleTypeOptions = [
    { label: '일정', value: 'WORK' },
    { label: '발주', value: 'ORDER' },
];

const selectionAlarmTime = [
    { label: '이벤트시간', value: 'AT_THE_TIME'},
    { label: '5분 전', value: 'FIVE_M_AGO'},
    { label: '10분 전', value: 'TEN_M_AGO'},
    { label: '15분 전', value: 'FIFTY_M_AGO'},
    { label: '30분 전', value: 'THIRTY_M_AGO'},
    { label: '1시간 전', value: 'A_HOUR_AGO'},
    { label: '2시간 전', value: 'TWO_HOURS_AGO'},
    { label: '5시간 전', value: 'FIVE_HOURS_AGO'},
    { label: '1일 전', value: 'A_DAY_AGO'},
    { label: '2일 전', value: 'TWO_DAYS_AGO'},
    { label: '5일 전', value: 'FIVE_DAYS_AGO'},
    { label: '1주 전', value: 'A_WEEK_AGO'},
]

dayjs.extend(utc);
dayjs.extend(timezone);

const AddScheduleModal = (props:{onOpen:boolean, onOpenHandler: (event:boolean) => void, targetStartDate:any, targetEndDate:any}) => {

    const {onOpen, onOpenHandler, targetStartDate, targetEndDate} = props;

    const [messageApi, contextHolder] = message.useMessage();
    const { businessListState } = useBusinessStores();

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

    const now = dayjs().tz('Asia/Seoul');

    const range = (start: number, end: number) => {
        return Array.from(Array(end - start), (_, i) => start + i);
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        const koreaTime = dayjs().tz('Asia/Seoul');
        return current && current < koreaTime.startOf('day');
    };

    const disabledRangeTime: RangePickerProps['disabledTime'] = (current, type) => {

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

    const [scheduleType, setScheduleType] = useState('WORK');
    const [isAlarmOn, setIsAlarmOn] = useState(false);
    const [title, setTitle] = useState('');
    const [titleWhereStemsFrom, setTitleWhereStemsFrom] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [isAllDay, setIsAllDay] = useState<boolean>(false);
    const [alarmTime, setAlarmTime] = useState('');
    const [relatedBusinesses, setRelatedBusinesses] = useState<string[]>([]);

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
        setRelatedBusinesses([]);
    }

    // 스케줄 타입 설정 핸들러
    const handleChangeScheduleType = (value: string) => {
        if (value === 'orderSchedule') {
            if (IsNotAvailableOrderSchedule()) {

                error('발주 스케줄은 하루만 설정 가능합니다.')
                return;
            }
        }

        setScheduleType(value);
    };

    const onChangeOrderSchedule = (date: any) => {

        let updateDate = dayjs(date).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss');
        console.log("@!!@ = ", updateDate);

        setOrderDate(updateDate);
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

    const handleStartAndEndDateInfoForWorkSchedule = (dates:any) => {

        if (dates && dates.length === 2) {
            const startDate = dayjs(dates[0]).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss');
            const endDate = dayjs(dates[1]).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss');

            console.log('Start Date:', startDate);
            console.log('End Date:', endDate);

            setStartDate(startDate);
            setEndDate(endDate);
        }
    }

    const handleIsAllDay = (e:any) => {
        setIsAllDay(e);
    }

    const handChangeAlarmTime = (e:any) => {
        setAlarmTime(e);
    }

    const options: SelectProps['options'] = [];
    businessListState.businessList.forEach(e =>{
        let business = JSON.parse(JSON.stringify(e));
        options.push({
            label: business.name,
            value: business.id,
        })
    })

    const handleChange = (value: string[]) => {

        const filteredOptions = options.filter(option => {
            return value.includes(option.value as string);
        });

        // @ts-ignore
        setRelatedBusinesses(filteredOptions);
    };

    const isPastDay = () => {

        if (targetStartDate === null || targetStartDate === "") {
            return true;
        }

        console.log("@@ = ", new Date(targetStartDate));
        console.log("!! = ", targetEndDate);

        let nowD = now.toDate();
        let targetD = new Date(targetStartDate);

        return nowD.getTime() >= targetD.getTime()
    }

    const IsNotAvailableOrderSchedule = () => {
        return isMoreThanOneDayApart(new Date(targetStartDate), new Date(targetEndDate));
    }

    const isMoreThanOneDayApart = (date1:Date, date2:Date) => {
        const oneDayInMillis = 24 * 60 * 60 * 1000; // 하루를 밀리초로 환산
        const timeDiff = Math.abs(date1.getTime() - date2.getTime()); // 두 날짜의 차이를 절대값으로 계산
        return timeDiff >= oneDayInMillis;
    }


    const createScheduleHandler = () => {

        let relatedBusinessList: any[] = [];

        relatedBusinesses.map((e) => relatedBusinessList.push(JSON.parse(JSON.stringify(e)).value));

        {/*등록 될 값들 확인*/}
        // console.log("scheduleType = ", scheduleType);
        // console.log("relatedBusinesses = ", relatedBusinessList);
        // console.log("title = ", title);
        // console.log("titleWhereStemsFrom = ", titleWhereStemsFrom);
        // console.log("startDate = ", startDate);
        // console.log("endDate = ", endDate);
        // console.log("isAlarmOn = ", isAlarmOn);
        // console.log("alarmTime = ", alarmTime);
        // console.log("orderDate = ", scheduleType === "WORK" ? startDate : orderDate);

        let startDateForWorkOrOrder = scheduleType === "WORK" ? startDate : orderDate
        let alarmTimeWhenAlarmIsOn = isAlarmOn ? alarmTime : null;

        axios.post(`${API_URL}/api/businesses/schedules`,
            {
                scheduleType,
                relatedBusinessList,
                title,
                titleWhereStemsFrom,
                startDate: startDateForWorkOrOrder,
                endDate,
                isAlarmOn,
                alarmTime: alarmTimeWhenAlarmIsOn,
                isAllDay
            },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token")
                    }
                }
            )
            .then((response) => {
                if (response.data === true) {
                    success("새로운 스케줄이 추가되었습니다.")
                    allReset();
                    onOpenHandler(false);
                }
            })
            .catch((e) => {
                error("스케줄 추가에 실패했습니다.")
                error(e);
            });
    }

/*
* - 여러 날짜를 드레그 추가할 시 발주 일정 추가 못함
*   - 즉 알람 설정을 못함
* */
    return useObserver(() => (
        <>
            {contextHolder}
            <Modal
                title="스케줄 추가"
                centered
                open={onOpen}
                closable={false}
                onOk={() => {
                    createScheduleHandler();
                    onOpenHandler(false);
                }}
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

                    <div style={{color:"grey", marginTop: 15}}>2. 연관 사업 선택
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '400px' }}
                            value={relatedBusinesses}
                            placeholder="연관 사업 리스트"
                            onChange={handleChange}
                            options={options}
                        />
                    </div>

                    {/* 타이틀은 100자 까지만.*/}
                    <div>
                        <div style={{color:"grey", marginTop: 15}}>3. 스케줄 타이틀</div>
                        <Input
                            placeholder="제목"
                            style={{ width: '400px' }}
                            prefix={<TagOutlined />}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        {scheduleType === 'ORDER' &&
                            <Input
                                style={{ marginTop: 10, width: '400px' }}
                                placeholder="발주처 정보"
                                prefix={<PushpinOutlined />}
                                value={titleWhereStemsFrom}
                                onChange={(e) => {setTitleWhereStemsFrom(e.target.value)}}
                            />
                        }
                    </div>
                    <div style={{color:"grey", marginTop: 10}}>4. 스케줄 날짜 선택</div>
                    {(scheduleType !== 'ORDER' && !isAllDay) &&
                        <DatePicker.RangePicker
                            disabledDate={disabledDate}
                            disabledTime={disabledRangeTime}
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [
                                    dayjs().hour(0).minute(0).second(0).tz('Asia/Seoul'),
                                    dayjs().hour(23).minute(59).second(59).tz('Asia/Seoul')
                                ],
                            }}
                            onCalendarChange={
                            (e) => {
                                handleStartAndEndDateInfoForWorkSchedule(e);
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    }
                    {(scheduleType !== 'ORDER' && isAllDay) &&
                        <DatePicker.RangePicker
                            disabledDate={disabledDate}
                            onCalendarChange={
                                (e) => {
                                    handleStartAndEndDateInfoForWorkSchedule(e);
                                }}
                            format="YYYY-MM-DD"
                        />
                    }
                    {scheduleType !== 'ORDER' &&
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

                    {scheduleType === 'ORDER' &&
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

                    {scheduleType === 'ORDER' &&
                        <div style={{color:"grey", marginTop: 20}}>5. 알람 여부 &nbsp;
                            <Popover content={<div style={{ fontSize: 12, color:"grey" }}>알람을 설정하시면 대표님께 알림톡이 전송됩니다.<br/>* D + 1 이상인 발주 스케줄만 알림톡 발송을 합니다.</div>}>
                                <QuestionCircleOutlined />
                            </Popover>
                        </div>
                    }
                    {scheduleType === 'ORDER' &&
                        <Space direction="horizontal">
                            <Flex gap="large">
                                <Radio.Group defaultValue="OFF" buttonStyle="solid">
                                    <Radio.Button onChange={handleSetAlarm} value="ON" disabled={isPastDay()}>켬</Radio.Button>
                                    <Radio.Button onChange={handleSetAlarm} value="OFF" defaultChecked={true}>끄기</Radio.Button>
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
                    }
                </Space>
            </Modal>
        </>
    ));
}

export default AddScheduleModal;
