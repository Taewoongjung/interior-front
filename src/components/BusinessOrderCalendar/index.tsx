import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { useState } from 'react';
import React from 'react';
import AddScheduleModal from "./AddScheduleModal";

const FullCalendarPage = () => {

    const [addModalOpen, setAddModalOpen] = useState(false);

    const eventClick = (event: any) => {
        setAddModalOpen(true);
        console.log("event = ", event);
    }

    const [events, setEvent] = useState([
        {
            id: '200',
            title: 'The Title',
            start: '2024-07-12 13:00:00',
            end: '2024-07-12 13:59:00',
            color: 'green',
            textColor: 'black'
        },{
            id: '100',
            title: 'The Title2',
            start: '2024-07-16 13:00:00',
            end: '2024-07-17 13:59:00',
            color: 'red',
            textColor: 'white',
            resourceEditable: true
        }
    ]);

    const [instanceId, setInstanceId] = useState('');

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
        console.log("aa = ", event);
        setAddModalOpen(true);
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

                <AddScheduleModal onOpen={addModalOpen} onOpenHandler={setAddModalOpen}/>
            </div>
        </>
    );
};

export default FullCalendarPage;
