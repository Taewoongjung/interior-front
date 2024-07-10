declare module '@toast-ui/react-calendar' {
    import * as React from 'react';

    interface CalendarEvent {
        id: string;
        calendarId: string;
        title: string;
        category: 'time' | 'allday';
        start: string;
        end: string;
    }

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
            narrowWeekend?: boolean; // 토, 일은 좁게
            workweek?: boolean; // 토, 일은 제외
        };
        calendars?: { id: string; name: string }[];
        events?: CalendarEvent[];
        usageStatistics?: boolean;
        onAfterRenderEvent?: (event: { title: string }) => void;
        template?: any;
    }

    export default class Calendar extends React.Component<CalendarProps> {}
}
