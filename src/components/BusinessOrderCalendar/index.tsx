import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import {useEffect, useState} from 'react';
import React from 'react';
import AddScheduleModal from "./AddScheduleModal";
import {useBusinessStores} from "../../hooks/useBusinessStore";
import {SelectProps} from "antd";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

interface IScheduleEvent {
    id: string
    title: string
    start: string
    end: string
    color: string
    textColor: string
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
    
    useEffect(() => {
        let allEvents:IScheduleEvent[] = [];

        if (businessSchedules !== undefined) {

            businessSchedules.forEach((e:any) => {
                let element: IScheduleEvent = {
                    id: e.id,
                    title: e.title,
                    start: e.startDate,
                    end: e.endDate,
                    color: 'red',
                    textColor: 'white',
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
                    eventClick={eventClick}
                    headerToolbar={{
                        left: 'prev',
                        center: 'title',
                        right: 'next',
                    }}
                    height={770}
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
