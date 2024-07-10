declare module '@toast-ui/react-calendar' {
    import * as React from 'react';
    // @ts-ignore
    import CalendarEvent from './definition/Icalendar-event';
    // @ts-ignore
    import SelectDateTimeInfo from "./definition/Iselect-date-time-info";

    export interface CalendarProps {
        width?: string;
        height?: string;
        view?: 'month' | 'week' | 'day';
        month?: {
            dayNames?: string[];
            visibleWeeksCount?: number;
        };
        week?: {
            dayNames?: string[];
            startDayOfWeek?: number;
            narrowWeekend?: boolean; // 토, 일은 좁게 할지 여부
            workweek?: boolean; // 토, 일은 제외 할지 여부
            showNowIndicator?: boolean; // 주간/일간뷰에서 현재 시간선을 표시할지 여부
            hourStart?: number; // 주간/일간뷰에서 각 컬럼의 시작 시간을 지정한다. 기본값은 0이며, 원하는 시작 시간을 지정
            hourEnd?: number; // 주간/일간뷰에서 각 컬럼의 끝나는 시간을 지정한다. 기본값은 0이며, 원하는 시작 시간을 지정
        };
        useFormPopup?: boolean;
        useDetailPopup?: boolean;
        calendars?: { id: string; name: string }[];
        events?: CalendarEvent[];
        usageStatistics?: boolean;
        onAfterRenderEvent?: (event: { title: string }) => void;
        template?: any;
        onSelectDateTime?: (event: SelectDateTimeInfo) => void;
        onBeforeCreateEvent?: (
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
        ) => void;
        onBeforeUpdateEvent?: (
            event: {
                schedule: CalendarEvent;
                changes: Partial<CalendarEvent>;
                start: Date;
                end: Date;
            }
        ) => void;
        onBeforeDeleteEvent?: (event: {}) => void;
    }

    export default class Calendar extends React.Component<CalendarProps> {}
}
