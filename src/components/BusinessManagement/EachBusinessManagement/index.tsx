import React from "react";

const EachBusinessManagement = (props: { business:any; }) => {

    const {business} = props;

    return (
        <>
            {business.name}
            <br/>
            {business.status}
            <br/>
            ㅎㅏ이
        </>
    );
}

export default EachBusinessManagement;