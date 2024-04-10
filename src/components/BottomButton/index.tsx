import React from "react";

const BottomButton = () => {

    return(
        <>
            {/*Social Icons*/}
            <ul className="icons">
                <li><a href="#" className="icon brands fa-twitter"><span className="label">Twitter</span></a></li>
                <li><a href="#" className="icon brands fa-facebook-f"><span className="label">Facebook</span></a></li>
                <li><a href="#" className="icon brands fa-github"><span className="label">Github</span></a></li>
                <li><a href="#" className="icon brands fa-dribbble"><span className="label">Dribbble</span></a></li>
                <li><a href="#" className="icon solid fa-envelope"><span className="label">Email</span></a></li>
            </ul>
        </>
    )
}

export default BottomButton;