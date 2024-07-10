import React, {Component} from 'react';

import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import Calendar from "@toast-ui/react-calendar";

interface CalendarEvent {
    id: string;
    calendarId: string;
    title: string;
    category: 'time' | 'allday';
    start: string;
    end: string;
}

const template = {
    milestone(event: { backgroundColor: any; title: any; }) {
        return `<span style="color: #fff; background-color: ${event.backgroundColor};">${event.title}</span>`;
    },
    allday(event: { title: any; }) {
        return `[All day] ${event.title}`;
    },
};

class BusinessOrderCalendar extends Component {
    private calendarRef: React.RefObject<Calendar> | undefined;

    constructor(props: Component) {
        super(props);
        this.calendarRef = React.createRef();
    }

    onAfterRenderEvent = (event: { title: any }) => {
        console.log(event.title);
    };


    render() {
        const calendars = [{ id: 'cal1', name: 'Personal' }];
        const initialEvents: CalendarEvent[] = [
            {
                id: '1',
                calendarId: 'cal1',
                title: 'Lunch',
                category: 'time',
                start: '2024-07-11T12:00:00',
                end: '2024-07-11T13:30:00',
            },
            {
                id: '2',
                calendarId: 'cal1',
                title: 'Coffee Break',
                category: 'time',
                start: '2024-07-11T15:00:00',
                end: '2024-07-11T15:30:00',
            },
        ];

        return (
            <div style={{paddingLeft:30, backgroundColor:"white"}}>
                <Calendar
                    width="200px"
                    height="800px"
                    view="week"
                    month={{
                        dayNames: ['월', '화', '수', '목', '금', '토', '일'],
                        visibleWeeksCount: 3,
                    }}
                    week={{
                        dayNames: ['월', '화', '수', '목', '금', '토', '일'],
                        startDayOfWeek: 1,
                        narrowWeekend: false
                    }}
                    calendars={calendars}
                    events={initialEvents}
                    usageStatistics={false}
                    onAfterRenderEvent={this.onAfterRenderEvent}
                    template={template}
                />
            </div>
        );
    }
}

export default BusinessOrderCalendar;
