import { Calendar, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { useState } from 'react';
import React from 'react';

const FullCalendarPage = () => {

    const eventClick = (event: any) => {

        console.log("event = ", event);
    }

    return (
        <>
            <div style={{backgroundColor:'white',marginLeft: 20}}>
                <FullCalendar
                    initialView={'dayGridMonth'}
                    locale="kr"
                    plugins={[dayGridPlugin, interactionPlugin]}
                    events={[{
                        title: 'The Title',
                        start: '2024-07-12 13:00:00',
                        end: '2024-07-12 13:59:00',
                        color: 'green',
                        textColor: 'black'
                    }]}
                    selectable={true}
                    eventClick={eventClick}
                    headerToolbar={{
                        left: 'prev',
                        center: 'title',
                        right: 'next',
                    }}
                    height={770}
                />
            </div>
        </>
    );
};

export default FullCalendarPage;
