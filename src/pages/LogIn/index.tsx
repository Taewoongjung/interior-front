import React, {useState} from "react";
import './styles.scss';

const LogIn = () => {
    const [isLogIn, setIsLogIn] = useState(false);

    const toggleForm = () => {
        setIsLogIn(!isLogIn);
    };

    return (
        <section className={isLogIn ? 'active' : ''}>
            <div className="left">
                <img src="/login/interior-jung-title-login.png" alt="로그인 이미지" width="700" height="400" />
                <div className="sign-up">
                    <h1>회원가입</h1>
                    <form action="">
                        <input type="text" placeholder="유저 이름" />
                        <input type="email" placeholder="이메일" />
                        <input type="password" placeholder="새 비밀번호" />
                        <input type="password" placeholder="비밀번호 재확인" />
                        <input type="submit" value="회원가입하기" />
                    </form>
                    <p>
                        이미 계정이 있으신가요?
                        <a href="#" id="sign-in" onClick={toggleForm}>로그인 하러 가기.</a>
                    </p>
                </div>
            </div>
            <div className="right">
                <img src="/signup/interior-jung-title-signup.jpg" alt="회원가입 이미지" width="700" height="400" />
                <div className="sign-in">
                    <h1>로그인</h1>
                    <form action="">
                        <input type="text" placeholder="이메일" />
                        <input type="password" placeholder="패스워드" />
                        <input type="submit" value="로그인하기" />
                    </form>
                    <p>
                        아직 계정이 없으신가요? <a href="#" onClick={toggleForm}>회원가입 하기.</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LogIn;