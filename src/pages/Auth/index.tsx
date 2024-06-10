import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import './styles.scss';
import {useForm} from "react-hook-form";
import {IFormValues} from "../../definitions/Auth/IFormValues";
import {SIGNUP_ERROR_CODES} from "../../codes/ErrorCodes";
import {Button, Input, message, Modal, Statistic} from "antd";
import {MailOutlined, CheckOutlined} from "@ant-design/icons";

const { Countdown } = Statistic;

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
        setIsVerified(false);
        setVerifyTargetEmail('');
        setIsInProgressVerifyingEmail(false);
        clearErrors();
        reset();
    }

    const onSubmitSignUp = async (data: { name: any; email: any; tel: any; password: any; reCheckPassword: any; }) => {
        const {name, email, tel, password, reCheckPassword} = data;

        const role = "CUSTOMER";

        if (password !== reCheckPassword) {
            errorModal("비밀번호가 다릅니다. 다시 확인해주세요.")
            return null;
        }

        await axios
            .post("http://api-interiorjung.shop:7077/api/signup", {
            // .post("http://localhost:7070/api/signup", {
            name, email, password, tel, role
            }, {
                withCredentials: true // CORS 처리 옵션
            }
        ).then((response) => {
            if (response.data.isSuccess === true) {
                success("회원가입이 완료 되었습니다.");
                setIsLogIn(false);
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

    const onSubmit = useCallback(async (e: { preventDefault: () => void; }) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("username", email);
            formData.append("password", password);

            await axios
                .post(
                    "http://api-interiorjung.shop:7077/api/login",
                    // "http://localhost:7070/api/login",
                    formData,
                    {
                        withCredentials: true,
                    },
                )
                .then((response) => {

                    const token = response.headers['authorization'];

                    localStorage.setItem("interiorjung-token", token); // 로그인 성공 시 로컬 스토리지에 토큰 저장

                    // 로그인 성공 시 리다이렉트
                    window.location.href = '/management'; // 이 방법은 페이지를 새로고침하며 새로운 URL로 이동합니다.
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        errorModal('아이디나 비밀번호를 다시 확인해주세요.');
                    }
                });
        },
        [email, password]
    );

    useEffect(() => {
        const token = localStorage.getItem("interiorjung-token");

        if (token !== null) {
            if (token !== undefined) {
                axios.get(
                        "http://api-interiorjung.shop:7077/api/me",
                        // "http://localhost:7070/api/me",
                        {
                            headers: {
                                Authorization: localStorage.getItem("interiorjung-token"),
                                withCredentials: true
                            },
                        })
                    .then((response) => {
                        window.location.href = '/management';
                    })
                    .catch((error) => {}
                    );
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
        axios.get(
            `http://api-interiorjung.shop:7077/api/emails/validations?targetEmail=${verifyTargetEmail}&compNumber=${verifyCompareNumber}`,
            // `http://localhost:7070/api/emails/validations?targetEmail=${verifyTargetEmail}&compNumber=${verifyCompareNumber}`,
            {
                withCredentials: true
            })
            .then((response) => {
                if (response.data === true) {
                    success("인증 완료")
                    setIsModalOpen(false);
                    setIsInProgressVerifyingEmail(false);
                    setIsVerified(true);
                }
            })
            .catch((error) => {
                errorModal(error.response.data.message);
            });
    };

    const handleCancel = () => {
        stopLoading(2);
        setIsVerified(false);
        setIsModalOpen(false);
        setIsInProgressVerifyingEmail(false);
    };

    const [verifyTargetEmail, setVerifyTargetEmail] = useState('');
    const [verifyCompareNumber, setVerifyCompareNumber] = useState('');
    const [isInProgressVerifyingEmail, setIsInProgressVerifyingEmail] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loadings, setLoadings] = useState<boolean[]>([]);

    const emailVerificationDeadline = Date.now() + 1000 * 60 * 3;

    const enterLoading = (index: number) => {
        if (verifyTargetEmail !== "" && verifyTargetEmail !== undefined && verifyTargetEmail !== null) {
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

    const verifyEmail = () => {

        if (verifyTargetEmail !== "" && verifyTargetEmail !== undefined && verifyTargetEmail !== null) {

            const targetEmail = verifyTargetEmail;

            axios.post(
                "http://api-interiorjung.shop:7077/api/emails/validations",
                // "http://localhost:7070/api/emails/validations",
                {
                    targetEmail
                }, {withCredentials: true, })
                .then((response) => {
                    if (response.data === true) {
                        stopLoading(2);
                        setIsModalOpen(true);
                        setIsInProgressVerifyingEmail(true);
                    }
                })
                .catch((error) => {
                    errorModal(error.response.data.message);
                });
        }
    }

    const onFinishCountDown = () => {
        stopLoading(2);
        setIsInProgressVerifyingEmail(false);
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
                                <div className="email-input-group">
                                    <input
                                        type="email" placeholder="이메일"
                                        {...register("email", {
                                            required: "이메일은 필수 응답 항목입니다.",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                                                message: "이메일 형식이 아닙니다."
                                            }
                                        })}
                                        onChange={(e) => setVerifyTargetEmail(e.target.value)}
                                    />
                                    {errors.email && <div>{errors.email?.message}</div>}
                                    {!isInProgressVerifyingEmail &&
                                        <Button
                                            loading={loadings[2]}
                                            onClick={() => {
                                                enterLoading(2);
                                                verifyEmail();
                                            }}
                                        >
                                            {isVerified ? <CheckOutlined /> : "인증"}
                                        </Button>
                                    }
                                </div>
                                <Modal title="이메일 인증" 
                                       centered 
                                       open={isModalOpen}
                                       onOk={verifyEmailOkHandler}
                                       okText={"인증"}
                                       onCancel={handleCancel}
                                       cancelText={"취소"}
                                >
                                    <div className="verify-email-input-group">
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
        </>
    );
};

export default Auth;