import Modal from "antd/es/modal/Modal";
import React, {useState, useEffect} from "react";
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
    Popover, Flex, Switch, message, Menu, Dropdown, Tag
} from "antd";
import {TagOutlined, QuestionCircleOutlined, PushpinOutlined} from "@ant-design/icons";
import {useBusinessStores} from "../../../hooks/useBusinessStore";
import {useObserver} from "mobx-react";
import axios from "axios";
import { SketchPicker, ColorResult } from 'react-color';
import {BUSINESS_SCHEDULE_ERROR_CODES} from "../../../codes/ErrorCodes";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

type LabelRender = SelectProps['labelRender'];

const selectionScheduleTypeOptions = [
    { label: '일정', value: 'WORK' },
    { label: '발주', value: 'ORDER' },
];

export const selectionAlarmTime = [
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

const AddScheduleModal = (props:{onOpen:boolean, onOpenHandler: (event:boolean) => void, targetStartDate:any, targetEndDate:any, businessSchedulesMutate: () => void}) => {

    const {onOpen, onOpenHandler, targetStartDate, targetEndDate, businessSchedulesMutate} = props;

    const [messageApi, contextHolder] = message.useMessage();
    const { businessListState } = useBusinessStores();

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
    const [startDate, setStartDate] = useState(targetStartDate);
    const [endDate, setEndDate] = useState(targetEndDate);
    const [orderDate, setOrderDate] = useState(targetStartDate);
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
        setColor('');
    }

    useEffect(() => {
        setStartDate(targetStartDate);
    }, [targetStartDate]);

    useEffect(() => {
        setEndDate(targetEndDate);
    }, [targetEndDate]);

    useEffect(() => {
        setOrderDate(targetStartDate);
    }, [targetStartDate]);

    // 스케줄 타입 설정 핸들러
    const handleChangeScheduleType = (value: string) => {
        if (value === 'orderSchedule') {
            if (IsNotAvailableOrderSchedule()) {

                errorModal('발주 스케줄은 하루만 설정 가능합니다.')
                return;
            }
        }

        setScheduleType(value);
    };

    const onChangeOrderSchedule = (date: any) => {

        let updateDate = dayjs(date).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss');

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

        if (dates && dates.length === 1) {
            setStartDate(dayjs(dates[0]).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'));
        }

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

    const [isDisableAlarm, setIsDisableAlarm] = useState(true);

    useEffect(() => {

        if (orderDate !== null && orderDate !== "") {
            const now = new Date();
            now.setDate(now.getDate() + 1);
            const nowD = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Current date (year, month, day)

            const targetD = new Date(orderDate);
            const targetDateOnly = new Date(targetD.getFullYear(), targetD.getMonth(), targetD.getDate());

            if (nowD.getTime() > targetDateOnly.getTime()) {
                setIsDisableAlarm(true);
            } else {
                setIsDisableAlarm(false);
            }
        }

    }, [orderDate]);


    const IsNotAvailableOrderSchedule = () => {
        return isMoreThanOneDayApart(new Date(targetStartDate), new Date(targetEndDate));
    }

    const isMoreThanOneDayApart = (date1:Date, date2:Date) => {
        const oneDayInMillis = 24 * 60 * 60 * 1000; // 하루를 밀리초로 환산
        const timeDiff = Math.abs(date1.getTime() - date2.getTime()); // 두 날짜의 차이를 절대값으로 계산
        return timeDiff >= oneDayInMillis;
    }

    const createScheduleHandler = () => {

        let relatedBusinessId = JSON.parse(JSON.stringify(relatedBusinesses[0])).value;

        let startDateForWorkOrOrder = scheduleType === "WORK" ? startDate : orderDate

        let alarmTimeWhenAlarmIsOn = isAlarmOn ? alarmTime : null;

        axios.post(`${API_URL}/api/businesses/schedules`,
            {
                scheduleType,
                relatedBusinessId,
                title,
                titleWhereStemsFrom,
                startDate: startDateForWorkOrOrder,
                endDate,
                isAlarmOn,
                alarmTime: alarmTimeWhenAlarmIsOn,
                isAllDay,
                colorHexInfo
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
                    businessSchedulesMutate();
                }
            })
            .catch((error) => {
                const errorCode = error.response.data.errorCode;
                if (BUSINESS_SCHEDULE_ERROR_CODES.includes(errorCode)) {
                    errorModal(error.response.data.message);
                } else {
                    errorModal("스케줄 추가에 실패했습니다.");
                    errorModal(error);
                }
            });
    }

    const [colorHexInfo, setColor] = useState<string>('#000');

    const handleChangeSketchPicker = (selectedColor: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setColor(selectedColor.hex);  // 색상 변경 값의 hex 적용
    };

    const [isDropdownShow, setIsDropdownShow] = useState<boolean>(false);

    const verifyIfCreateButtonAble = () => {
        if (scheduleType !== ''
            && title !== ''
            && startDate !== null
            && endDate !== null
            && (scheduleType === 'ORDER' && orderDate !== null) &&
            ((scheduleType === 'ORDER' && isAlarmOn && alarmTime !== '') || (scheduleType === 'ORDER' && !isAlarmOn)) || (scheduleType === 'WORK' && !isAlarmOn)
            && relatedBusinesses.length !== 0
        ) {
            return false;
        }

        return true;
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
                okButtonProps={
                    { disabled: verifyIfCreateButtonAble() }
                }
                cancelText={"취소"}
            >
                <Space direction="vertical">
                    <br/>

                    <div style={{color:"grey"}}>스케줄 색상 선택</div>
                    <Dropdown
                        overlay={<Menu>
                            <Menu.Item>
                                <SketchPicker
                                    color={colorHexInfo}
                                    onChange={handleChangeSketchPicker}
                                />
                            </Menu.Item>
                        </Menu>}
                        trigger={['click']}
                        visible={isDropdownShow}
                        onVisibleChange={(visible) => {
                            setIsDropdownShow(visible);
                        }
                        }>
                        <a onClick={(e) => e.preventDefault()}>
                            <Tag color={colorHexInfo}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Tag>
                        </a>
                    </Dropdown>

                    <br/>

                    <div style={{color:"grey"}}>1. 스케줄 타입 선택 <a style={{color:'red'}}>*</a></div>
                    <Select
                        allowClear
                        onClear={onClearScheduleType}
                        value={scheduleType}
                        style={{ width: 80 }}
                        labelRender={labelRender}
                        onChange={handleChangeScheduleType}
                        options={selectionScheduleTypeOptions}
                    />

                    <div style={{color:"grey", marginTop: 15}}>2. 연관 사업 선택 <a style={{color:'red'}}>*</a>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '400px' }}
                            value={relatedBusinesses}
                            placeholder="연관 사업 리스트"
                            onChange={handleChange}
                            options={options}
                            maxCount={1}
                        />
                    </div>

                    {/* 타이틀은 100자 까지만.*/}
                    <div>
                        <div style={{color:"grey", marginTop: 15}}>3. 스케줄 타이틀 <a style={{color:'red'}}>*</a></div>
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
                    <div style={{color:"grey", marginTop: 10}}>4. 스케줄 날짜 선택 <a style={{color:'red'}}>*</a></div>
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
                                    <Radio.Button onChange={handleSetAlarm} value="ON" disabled={isDisableAlarm}>켬</Radio.Button>
                                    <Radio.Button onChange={handleSetAlarm} value="OFF" defaultChecked={true}>끄기</Radio.Button>
                                </Radio.Group>

                                {isAlarmOn && <div style={{color:"grey"}}><a style={{color:'red'}}>*</a> 알람 시간 : </div>}
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
