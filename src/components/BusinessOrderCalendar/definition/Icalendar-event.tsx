import {TZDate} from "@toast-ui/calendar";

export default interface CalendarEvent {
    id?: string; // 일정 ID
    calendarId?: string; // 	캘린더 ID
    title?: string; // 일정 제목
    body?: string; // 일정 내용
    isAllday?: boolean; // 종일 일정 여부
    start?: Date | string | number | TZDate; // 일정이 시작하는 일시. 일정을 생성할 때는 Date, string, number, TZDate로 지정할 수 있으며, 캘린더 API 파라미터 또는 반환값에서는 TZDate 객체이다.
    end?: Date | string | number | TZDate; // 일정이 끝나는 일시. 일정을 생성할 때는 Date, string, number, TZDate로 지정할 수 있으며, 캘린더 API 파라미터 또는 반환값에서는 TZDate 객체이다.
    goingDuration?: number; // 일정 장소까지 이동하는 데 걸리는 시간. 분 단위의 숫자이다.
    comingDuration?: number; // 일정 다음 장소까지 이동하는 데 걸리는 시간. 분 단위의 숫자이다.
    location?: string; // 일정 장소
    attendees?: string[]; // 일정 참석자 목록
    category?: 'milestone' | 'task' | 'allday' | 'time'; // 일정 카테고리. milestone, task, allday, time 중 하나이다.
    recurrenceRule?: string; // 일정 반복 규칙
    state?: 'Busy' | 'Free'; // 일정 상태. 바쁨(Busy), 한가함(Free) 중 하나이다.
    isVisible?: boolean; // 일정 표시 여부
    isPending?: boolean; // 미정인 일정 여부
    isFocused?: boolean; // 일정 강조 여부
    isReadOnly?: boolean; // 수정 가능한 일정 여부
    isPrivate?: boolean; // 개인적인 일정 여부
    color?: string; // 일정 요소의 텍스트 색상
    backgroundColor?: string; // 일정 요소의 배경 색상
    dragBackgroundColor?: string; // 일정 요소를 드래그했을 때 배경 색상
    borderColor?: string; // 일정 요소의 좌측 테두리 색상
    raw?: any; // 실제 일정 데이터
}

// https://github.com/nhn/tui.calendar/blob/main/docs/ko/apis/event-object.md
