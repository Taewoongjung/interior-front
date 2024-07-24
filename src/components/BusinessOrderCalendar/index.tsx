import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import {useEffect, useState} from 'react';
import React from 'react';
import AddScheduleModal from "./AddScheduleModal";
import {useBusinessStores} from "../../hooks/useBusinessStore";
import {SelectProps, Popover, Descriptions, Button, DescriptionsProps} from "antd";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import {BellFilled, BellOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

interface IScheduleEvent {
    id: string
    title: string
    start: string
    end: string
    color: string
    textColor: string
    scheduleType: string
    isAlarmOn: string
    resourceEditable: boolean
}

const FullCalendarPage = () => {

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [instanceId, setInstanceId] = useState('');
    const [targetStartDate, setTargetStartDate] = useState<any>();
    const [targetEndDate, setTargetEndDate] = useState<any>();
    const [businessIdList] = useState<any>([]);
    const { businessListState } = useBusinessStores();

    const eventClick = (event: any) => {
        setAddModalOpen(true);
        console.log("event = ", event);
    }

    const [events, setEvents] = useState<IScheduleEvent[]>([]);

    useEffect(() => {

        if (businessListState.businessList.length > 0) {
            const options: SelectProps['options'] = [];
            businessListState.businessList.forEach(e =>{
                let business = JSON.parse(JSON.stringify(e));

                businessIdList.push(business.id);

                options.push({
                    label: business.name,
                    value: business.id,
                })
            })
        }

    },[businessListState.businessList]);

    const handleSetScheduleEvent = (target:IScheduleEvent[]) => {
        setEvents(target);
    }

    const { data: businessSchedules, error: logError, mutate: businessSchedulesMutate } = useSWR(
        businessIdList.length > 0 ? `${API_URL}/api/businesses/schedules?businessIds=${businessIdList.join(',')}` : null,
        fetcher
    );

    function hexToRgb(hex: string) {
        // Remove the hash at the start if it's there
        hex = hex.replace(/^#/, '');

        // Parse the r, g, b values
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        return { r, g, b };
    }

    function rgbToHex(r: number, g: number, b: number) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function findComplementaryColor(hex: any) {
        // Convert hex to RGB
        let { r, g, b } = hexToRgb(hex);

        // Find the complementary color
        let compR = 255 - r;
        let compG = 255 - g;
        let compB = 255 - b;

        // Convert the complementary RGB color back to hex
        return rgbToHex(compR, compG, compB);
    }

    useEffect(() => {
        let allEvents:IScheduleEvent[] = [];

        if (businessSchedules !== undefined) {

            businessSchedules.forEach((e:any) => {
                let element: IScheduleEvent = {
                    id: e.id,
                    title: e.title,
                    start: e.startDate,
                    end: e.endDate,
                    color: e.colorHexInfo,
                    textColor: findComplementaryColor(e.colorHexInfo),
                    scheduleType : e.type,
                    isAlarmOn: e.isAlarmOn,
                    resourceEditable: true
                }

                allEvents.push(element);
            })

        }
        handleSetScheduleEvent(allEvents);

    }, [businessSchedules]);

    const eventDragStart = (event: any) => {
        const bfrStart = event.event._instance.range.start;
        const bfrEnd = event.event._instance.range.end;

        console.log("bfrStart = ", bfrStart);
        console.log("bfrEnd = ", bfrEnd);

        setInstanceId(event.event._instance.instanceId);
    }

    const eventDrop = (changeEvent: any) => {

        const afrStart = changeEvent.event._context.calendarApi.currentData.emitter.thisContext.currentData.eventStore.instances[instanceId].range.start;
        const afrEnd = changeEvent.event._context.calendarApi.currentData.emitter.thisContext.currentData.eventStore.instances[instanceId].range.end;

        console.log("afrStart = ", afrStart);
        console.log("afrEnd = ", afrEnd);
    }

    const mouseEvent = (event: any) => {
        setAddModalOpen(true);

        const start = event.start;
        const end = new Date(event.end);
        end.setSeconds(end.getSeconds() - 1);

        setTargetStartDate(start);
        setTargetEndDate(end);
    }

    const [visiblePopover, setVisiblePopover] = useState<string | null>(null);
    const [popoverContent, setPopoverContent] = useState<string>('');

    const handleMouseEnter = (info: any) => {
        setPopoverContent(info.event.title || '');
        setVisiblePopover(info.event.id);
    };

    const padToTwoDigits = (num: number | undefined) => {
        return num !== undefined ? String(num).padStart(2, '0') : '00';
    };


    return (
        <>
            <div style={{backgroundColor:'white',marginLeft: 20}}>
                <FullCalendar
                    initialView={'dayGridMonth'}
                    locale="kr"
                    plugins={[dayGridPlugin, interactionPlugin]}
                    events={events}
                    select={mouseEvent}
                    selectable={true}
                    dragScroll={true}
                    editable={true}
                    eventDragStart={eventDragStart}
                    eventDrop={eventDrop}
                    eventStartEditable={true}
                    headerToolbar={{
                        left: 'prev',
                        center: 'title',
                        right: 'next',
                    }}
                    height={770}

                    eventMouseEnter={handleMouseEnter}

                    eventContent={(eventInfo) => {
                        const startYear = eventInfo.event.start?.getFullYear();
                        const startMonth = eventInfo.event.start?.getMonth();
                        const startDay = padToTwoDigits(eventInfo.event.start?.getDay());
                        const startHours = padToTwoDigits(eventInfo.event.start?.getHours());
                        const startSeconds = padToTwoDigits(eventInfo.event.start?.getSeconds());

                        const endMonth = eventInfo.event.end?.getMonth();
                        const endDay = padToTwoDigits(eventInfo.event.end?.getDay());
                        const endHours = padToTwoDigits(eventInfo.event.end?.getHours());
                        const endSeconds = padToTwoDigits(eventInfo.event.end?.getSeconds());

                        let endDate = eventInfo.event.end ? ` ~  ${endMonth}월 ${endDay}일 ${endHours}:${endSeconds}` : '';

                        let scheduleType = eventInfo.event.extendedProps.scheduleType === 'WORK' ? "일정" : "발주";

                        const alarmStatus = eventInfo.event.extendedProps.isAlarmOn === 'T'
                            ? <>
                                <span>켜짐</span>&nbsp;
                                <BellFilled />
                            </>
                            : <>
                                <span>꺼짐</span>&nbsp;
                                <BellOutlined />
                            </>;

                        const items: DescriptionsProps['items'] = [
                            {
                                key: '1',
                                label: '타입',
                                children: scheduleType,
                                span:3
                            },
                            {
                                key: '2',
                                label: '타이틀',
                                children: eventInfo.event.title,
                                span:3
                            },
                            {
                                key: '3',
                                label: '시간',
                                children: startMonth + "월 " + startDay + "일 " + startHours + ":" + startSeconds + endDate,
                                span:3
                            },
                            {
                                key: '4',
                                label: '알람 여부',
                                children: alarmStatus,
                                span:3
                            }
                        ];

                        const contents =
                            <div>{
                                <Descriptions
                                    bordered
                                    size={'small'}
                                    items={items}
                                />
                            }
                            <hr/>
                            <p style={{textAlign: 'right', margin:10}}>
                                <Button danger type="dashed" icon={<DeleteOutlined />} size={"middle"} style={{ marginRight: 5 }}/>
                                <Button type="primary" icon={<EditOutlined />} size={"middle"} />
                            </p>
                        </div>


                        return (


                            <Popover
                                content={contents}
                                title="Event Info"
                                trigger="click"
                            >
                                <div>
                                    <i>
                                        [{startHours}:{startSeconds}
                                        {eventInfo.event.end ? ` ~ ${endHours}:${endSeconds}` : ''}]
                                        &nbsp;{eventInfo.event.title}
                                    </i>
                                </div>
                            </Popover>
                        );
                    }}
                />

                <AddScheduleModal
                    onOpen={addModalOpen}
                    onOpenHandler={setAddModalOpen}
                    targetStartDate={targetStartDate}
                    targetEndDate={targetEndDate}
                    businessSchedulesMutate={businessSchedulesMutate}
                />

            </div>
        </>
    );
};

export default FullCalendarPage;
