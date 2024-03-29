import React from "react"
import './styles.scss';

const Modal = (props: { children?: any; open?: any; close?: any; header?: string; }) => {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, header } = props

    if (!open) return null;

    return (
        <>
            <div className="modal-overlay" onClick={close} />
            <div className="modal-wrapper">
                <div className="modal-content"> {header} </div>
                <button className="modal-close-button" onClick={close}>닫기</button>
            </div>
        </>
    )
};

export default Modal;