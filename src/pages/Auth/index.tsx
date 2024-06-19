import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import './styles.scss';
import {useForm} from "react-hook-form";
import {IFormValues} from "../../definitions/Auth/IFormValues";
import {SIGNUP_ERROR_CODES} from "../../codes/ErrorCodes";
import {Button, Input, message, Modal, Statistic} from "antd";
import {MailOutlined, CheckOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useStores} from "../../hooks/useStore";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const { Countdown } = Statistic;

const Auth = observer(() => {

    const [isLogIn, setIsLogIn] = useState(false);

    const { userState } = useStores();

    const toggleForm = () => {
        setIsLogIn(!isLogIn);
        allReset();
    };

    function allReset() {
        setEmail('');
        setPassword('');
        setEmailError('');
        setPasswordError('');
        setIsVerified(false);
        setVerifyTargetPhoneNumber('');
        setIsInProgressVerifyingPhoneNumber(false);
        clearErrors();
        reset();
    }

    const onSubmitSignUp = async (data: { name: any; email: any; tel: any; password: any; reCheckPassword: any; }) => {
        const {name, email, tel, password, reCheckPassword} = data;

        const role = "BUSINESS_MAN";

        if (password !== reCheckPassword) {
            errorModal("비밀번호가 다릅니다. 다시 확인해주세요.")
            return null;
        }

        await axios.post(`${API_URL}/api/signup`, {
            name, email, password, tel, role
            }, {
                withCredentials: true // CORS 처리 옵션
            }
        ).then((response) => {
            if (response.data.isSuccess === true) {
                success("회원가입이 완료 되었습니다.");
                setIsLogIn(false);
                userState.setUserFirstLogInState("true");
                console.log("signup = ", userState.userFirstLogInState);
                console.log("zz = ", userState);
                // 회원가입이 완료 되면 바로 로그인 하기
                setTimeout(() => {
                    logIn(email, password, "true");
                }, 370);
            }}
        )
        .catch((error) => {
            const errorCode = error.response.data.errorCode;

            if (SIGNUP_ERROR_CODES.includes(errorCode)) {
                errorModal(error.response.data.message);
            }
            else {
                errorModal('회원가입에 실패했습니다. 다시 시도해주세요.');
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

    const logIn = (email:string, password:string, firstLogin:string) => {

        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);

        axios.post(`${API_URL}/api/login`,
                formData,
                {
                    withCredentials: true,
                },
            )
            .then((response) => {

                const token = response.headers['authorization'];

                localStorage.setItem("interiorjung-token", token); // 로그인 성공 시 로컬 스토리지에 토큰 저장

                // 로그인 성공 시 리다이렉트
                if (firstLogin === "true") {
                    window.location.href = '/management?firstLogin=true'; // 이 방법은 페이지를 새로고침하며 새로운 URL로 이동합니다.
                } else {
                    window.location.href = '/management'; // 이 방법은 페이지를 새로고침하며 새로운 URL로 이동합니다.
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    errorModal('아이디나 비밀번호를 다시 확인해주세요.');
                }
            });
    }

    const onSubmit = useCallback(async (e: { preventDefault: () => void; }) => {
            e.preventDefault();

            logIn(email, password, "false");

        },
        [email, password]
    );

    useEffect(() => {
        const token = localStorage.getItem("interiorjung-token");

        if (token !== null) {
            if (token !== undefined) {
                axios.get(`${API_URL}/api/me`,
                        {
                            headers: {
                                Authorization: localStorage.getItem("interiorjung-token"),
                                withCredentials: true
                            },
                        })
                    .then((response) => {
                        window.location.href = '/management';
                    })
                    .catch((error) => {
                    });
            }
        }
    }, []);

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

    const [messageApi, contextHolder] = message.useMessage();

    const success = (successMsg:string) => {
        messageApi.open({
            type: 'success',
            content: successMsg,
        });
    };

    const errorModal = (errorMsg:string) => {
        messageApi.open({
            type: 'error',
            content: errorMsg
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const verifyEmailOkHandler = () => {
        axios.get(`${API_URL}/api/phones/validations?targetPhoneNumber=${verifyTargetPhoneNumber}&compNumber=${verifyCompareNumber}`,
            {
                withCredentials: true
            })
            .then((response) => {
                if (response.data === true) {
                    success("인증 완료")
                    setIsModalOpen(false);
                    setIsInProgressVerifyingPhoneNumber(false);
                    setIsVerified(true);
                }
            })
            .catch((error) => {
                stopLoading(2);
                errorModal(error.response.data.message);
            });
    };

    const handleCancel = () => {
        stopLoading(2);
        setIsVerified(false);
        setIsModalOpen(false);
        setIsInProgressVerifyingPhoneNumber(false);
    };

    const [verifyTargetPhoneNumber, setVerifyTargetPhoneNumber] = useState('');
    const [verifyCompareNumber, setVerifyCompareNumber] = useState('');
    const [isInProgressVerifyingPhoneNumber, setIsInProgressVerifyingPhoneNumber] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loadings, setLoadings] = useState<boolean[]>([]);

    const emailVerificationDeadline = Date.now() + 1000 * 60 * 3;

    const enterLoading = (index: number) => {
        if (verifyTargetPhoneNumber !== "" && verifyTargetPhoneNumber !== undefined && verifyTargetPhoneNumber !== null) {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = true;
                return newLoadings;
            })
        }
    };

    const stopLoading = (index: number) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
        })};

    const verifyPhone = () => {

        if (verifyTargetPhoneNumber !== "" && verifyTargetPhoneNumber !== undefined && verifyTargetPhoneNumber !== null) {

            const targetPhoneNumber = verifyTargetPhoneNumber;

            axios.post(`${API_URL}/api/phones/validations`,
                {
                    targetPhoneNumber
                }, {withCredentials: true, })
                .then((response) => {
                    if (response.data === true) {
                        stopLoading(2);
                        setIsModalOpen(true);
                        setIsInProgressVerifyingPhoneNumber(true);
                    }
                })
                .catch((error) => {
                    errorModal(error.response.data.message);
                    stopLoading(2);
                });
        }
    }

    const onFinishCountDown = () => {
        stopLoading(2);
        setIsInProgressVerifyingPhoneNumber(false);
        setIsModalOpen(false);
    };

    return (
        <>
            {contextHolder}
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
                                    })}
                                />
                                {errors.email && <div>{errors.email?.message}</div>}

                                <div className="phone-input-group">
                                    <input
                                        type="tel" placeholder="전화번호"
                                        {...register("tel", {
                                            required: '전화번호는 필수 입력입니다.',
                                            pattern: {
                                                value: /^010[0-9]{8}$/,
                                                message: '전화번호 양식이 맞지 않습니다.',
                                            },
                                        })}
                                        onChange={(e) => setVerifyTargetPhoneNumber(e.target.value)}
                                    />
                                    {errors.tel && <div>{errors.tel?.message}</div>}
                                    {!isInProgressVerifyingPhoneNumber &&
                                        <Button
                                            loading={loadings[2]}
                                            onClick={() => {
                                                enterLoading(2);
                                                verifyPhone();
                                            }}
                                        >
                                            {isVerified ? <CheckOutlined /> : "인증"}
                                        </Button>
                                    }
                                </div>
                                <Modal title="휴대폰 인증"
                                       centered
                                       open={isModalOpen}
                                       onOk={verifyEmailOkHandler}
                                       okText={"인증"}
                                       onCancel={handleCancel}
                                       cancelText={"취소"}
                                >
                                    <div className="verify-phone-input-group">
                                        <Input className="verification-input"
                                               size="large"
                                               placeholder="인증번호"
                                               prefix={<MailOutlined/>}
                                               onChange={(e) => setVerifyCompareNumber(e.target.value)}
                                        />
                                        <Countdown className="verification-count" value={emailVerificationDeadline} onFinish={onFinishCountDown} />
                                    </div>
                                </Modal>
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
        </>
    );
});

export default Auth;
