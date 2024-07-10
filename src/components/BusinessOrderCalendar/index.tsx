import React, {Component} from 'react';

import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import Calendar from "@toast-ui/react-calendar";
import CalendarEvent from "./definition/Icalendar-event";
import SelectDateTimeInfo from "./definition/Iselect-date-time-info";


class BusinessOrderCalendar extends Component {
    private calendarRef: React.RefObject<Calendar> | undefined;

    constructor(props: Component) {
        super(props);
        this.calendarRef = React.createRef();
    }

    onAfterRenderEvent = (event: { title: any }) => {
        console.log(event.title);
    };

    onBeforeCreateSchedule = (
        event: {
            id: string;
            calendarId: string;
            title: string;
            category: 'time' | 'allday';
            start: Date;
            end: Date;
            isAllday: boolean;
            nativeEvent: MouseEvent;
        }
    ) => {
        console.log(`Creating schedule: ${event.title}, start: ${event.start}, end: ${event.end}`);
    };

    onBeforeUpdateSchedule = (
        event: {
            schedule: CalendarEvent;
            changes: Partial<CalendarEvent>;
            start: Date;
            end: Date;
        }
    ) => {
        console.log(`Updating schedule: ${event.schedule.title}, start: ${event.start}, end: ${event.end}`);
    };

    onSelectDateTime = (info: SelectDateTimeInfo) => {
        console.log(`Selected start: ${info.start}, end: ${info.end}, all day: ${info.isAllday}`);
        if (info.nativeEvent) {
            console.log(`Native event: ${info.nativeEvent.type}`);
        }
        console.log(`Selected elements: ${info.gridSelectionElements.length}`);
    };

    onBeforeDeleteEvent = (
        event: {

        }
    ) => {
        console.log(`Deleting schedule:`);
        // console.log(`Updating schedule: ${event.schedule.title}, start: ${event.start}, end: ${event.end}`);
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
                color: '#fff',
                isAllday: true,
                backgroundColor: '#3c056d',
                dragBackgroundColor: '#3c056d',
            },
        ];

        return (
            <div style={{paddingLeft: 30, backgroundColor: "white"}}>
                <Calendar
                    ref={this.calendarRef}
                    width="200px"
                    height="800px"
                    view="month"
                    month={{
                        dayNames: ['월', '화', '수', '목', '금', '토', '일'],
                        visibleWeeksCount: 3,
                    }}
                    week={{
                        dayNames: ['월', '화', '수', '목', '금', '토', '일'],
                        startDayOfWeek: 1,
                        narrowWeekend: false,
                        hourStart: 6,
                        hourEnd: 20
                    }}
                    useFormPopup={true}
                    useDetailPopup={true}
                    calendars={calendars}
                    events={initialEvents}
                    usageStatistics={true}
                    onAfterRenderEvent={this.onAfterRenderEvent}
                    onSelectDateTime={this.onSelectDateTime}
                    onBeforeCreateEvent={(event) => this.onBeforeCreateSchedule(event)}
                    onBeforeUpdateEvent={(event) => this.onBeforeUpdateSchedule(event)}
                    onBeforeDeleteEvent={(event) => this.onBeforeDeleteEvent(event)}
                />
            </div>
        );
    }
}

export default BusinessOrderCalendar;
