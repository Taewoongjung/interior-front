export default interface SelectDateTimeInfo {
    start: Date;
    end: Date;
    isAllday: boolean;
    nativeEvent?: MouseEvent; // 마우스를 떼었을 때의 네이티브 이벤트
    gridSelectionElements: Element[]; // 선택 영역에 해당하는 엘리먼트 목록
}
