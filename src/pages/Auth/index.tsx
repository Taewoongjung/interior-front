import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import './styles.scss';
import {useForm} from "react-hook-form";
import {IFormValues} from "../../definitions/IFormValues";
import Modal from "../../components/Modal";
import {SIGNUP_ERROR_CODES} from "../../codes/ErrorCodes";

const Auth = () => {
    const [isLogIn, setIsLogIn] = useState(false);

    const toggleForm = () => {
        setIsLogIn(!isLogIn);
        allReset();
    };

    function allReset() {
        setEmail('');
        setPassword('');
        setEmailError('');
        setPasswordError('');
        clearErrors();
        reset();
    }

    const onSubmitSignUp = (data: { name: any; email: any; tel: any; password: any; reCheckPassword: any; }) => {
        const {name, email, tel, password, reCheckPassword} = data;

        const role = "ADMIN";

        if (password !== reCheckPassword) {
            openModal();
            setModalHeader("비밀번호가 다릅니다. 다시 확인해주세요.")
            return null;
        }

        axios
            .post("http://localhost:707/api/signup", {
            name, email, password, tel, role
            }, {
                withCredentials: true // CORS 처리 옵션
            }
        ).then((response) => {
            if (response.data.isSuccess === true) {
                openModal();
                setModalHeader("회원가입이 완료 되었습니다.");
                setIsLogIn(false);
            }}
        )
        .catch((error) => {
            const errorCode = error.response.data.errorCode;

            if (SIGNUP_ERROR_CODES.includes(errorCode)) {
                openModal();
                setModalHeader(error.response.data.message);
            }
            else{
                console.dir(error);
            }
        });
    };

    // 로그인전용 변수
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const onChangeLoginEmail = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setEmail(value);

        // 이메일 형식이 올바른지 확인
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)) {
            setEmailError('올바른 이메일 형식이 아닙니다.');
        } else {
            setEmailError('');
        }
    };

    const onChangeLoginPassword = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setPassword(value);

        // 비밀번호 형식이 올바른지 확인
        if (!/^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/.test(value)) {
            setPasswordError('영문, 숫자를 포함한 6자 이상의 비밀번호를 입력해주세요.');
        } else {
            setPasswordError('');
        }
    };

    const [isSuccessLogin, setIsSuccessLogin] = useState(false);

    const onSubmit = useCallback(async (e: { preventDefault: () => void; }) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("username", email);
            formData.append("password", password);

            await axios
                .post(
                    "http://localhost:707/api/login",
                    formData,
                    {
                        withCredentials: true,
                    },
                )
                .then((response) => {
                    const token = response.headers['authorization'];
                    console.dir("response.data = ", response.data);
                    console.dir("response.headers = ", response.headers["pragma"]);
                    console.log("response.headers2 = ", response.headers);
                    console.dir("success = ", token);
                    console.log("aa = ", axios.defaults.headers.common.Authorization)
                    console.dir("aa = ", axios.defaults.headers.common.Authorization)
                    console.dir("bb = ", response.headers.getAuthorization)
                    // 로그인 성공 시 로컬 스토리지에 토큰 저장
                    setIsSuccessLogin(true);
                    localStorage.setItem("interiorjung-token", token);
                })
                .catch((error) => {
                    console.dir("error = ", error);
                });
        },
        [email, password]
    );

    useEffect(() => {
        if (isSuccessLogin) {
            // 로그인 성공 시 리다이렉트
            window.location.href = '/main'; // 이 방법은 페이지를 새로고침하며 새로운 URL로 이동합니다.
        }
    }, [isSuccessLogin]);

    const { register, handleSubmit, formState: { errors },reset, clearErrors } = useForm<IFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {},
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: false,
        shouldUseNativeValidation: false,
        delayError: undefined
    });


    const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열림 상태를 관리하는 상태 변수
    const [modalHeader, setModalHeader] = useState(""); // 모달의 열림 상태를 관리하는 상태 변수

    // 모달을 열기 위한 함수
    const openModal = () => {
        setIsModalOpen(true);
    };

    // 모달을 닫기 위한 함수
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <section className={isLogIn ? 'active' : ''}>
                <div className="left">
                    <img src="/login/interior-jung-title-login.png" alt="로그인 이미지" width="800" height="450"/>
                    <div className="sign-up">
                            <h1>회원가입</h1>
                            <form onSubmit={handleSubmit(onSubmitSignUp)}>
                                <input
                                    id="name" placeholder="유저 이름"
                                    {...register("name", {
                                        required: "이름은 필수 응답 항목입니다.",
                                        pattern: {
                                            value: /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]{2,7}$/,
                                            message: "이름 형식이 맞지않습니다."
                                        },
                                    })} />
                                {errors.name && <div>{errors.name?.message}</div>}

                                <input
                                    type="email" placeholder="이메일"
                                    {...register("email", {
                                        required: "이메일은 필수 응답 항목입니다.",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                                            message: "이메일 형식이 아닙니다."
                                        }
                                    })} />
                                {errors.email && <div>{errors.email?.message}</div>}

                                <input
                                    type="tel" placeholder="전화번호"
                                    {...register("tel", {
                                        required: '전화번호는 필수 입력입니다.',
                                        pattern: {
                                            value: /^010[0-9]{8}$/,
                                            message: '전화번호 양식이 맞지 않습니다.',
                                        },
                                    })} />
                                {errors.tel && <div>{errors.tel?.message}</div>}

                                <input
                                    type="password" placeholder="비밀번호"
                                    {...register("password", {
                                        required: '비밀번호는 필수 입력입니다.',
                                        pattern: {
                                            value: /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/,
                                            message: '영문, 숫자를 포함한 6자 이상의 비밀번호를 입력해주세요.',
                                        },
                                    })} />
                                {errors.password && <div>{errors.password?.message}</div>}

                                <input
                                    type="password" placeholder="비밀번호 재확인"
                                    {...register("reCheckPassword", {
                                        required: '비밀번호는 필수 입력입니다.',
                                        pattern: {
                                            value: /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/,
                                            message: '영문, 숫자를 포함한 6자 이상의 비밀번호를 입력해주세요.',
                                        },
                                    })} />
                                <input type="submit" value="회원가입하기"/>
                            </form>
                        <p>
                            이미 계정이 있으신가요?
                            <a href="#!" id="sign-in" onClick={toggleForm}>로그인 하러 가기.</a>
                        </p>
                    </div>
                </div>
                <div className="right">
                    <img src="/signup/interior-jung-title-signup.jpg" alt="회원가입 이미지" width="700" height="450"/>
                    <div className="sign-in">
                        <h1>로그인</h1>
                        <form onSubmit={onSubmit}>
                            <input type="email" value={email} onChange={onChangeLoginEmail} placeholder="이메일"/>
                            {emailError && <div>{emailError}</div>}

                            <input type="password" value={password} onChange={onChangeLoginPassword} placeholder="패스워드"/>
                            {passwordError && <div>{passwordError}</div>}
                            <input type="submit" value="로그인하기"/>
                        </form>
                        <p>
                            아직 계정이 없으신가요? <a href="#!" onClick={toggleForm}>회원가입 하기.</a>
                        </p>
                    </div>
                </div>
            </section>

            <Modal open={isModalOpen} close={closeModal} header={modalHeader}/>
        </>
    );
};

export default Auth;