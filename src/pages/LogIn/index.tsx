import React, {useCallback, useState} from "react";
import axios from "axios";
import './styles.scss';
import {useForm, useFormState} from "react-hook-form";
import {IFormValues} from "../../definitions/IFormValues";
import useInput from "../../hooks/useInput";

const LogIn = () => {
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

    const onSubmitSignUp = (data: { name: any; email: any; password: any; reCheckPassword: any; }) => {
        const {name, email, password, reCheckPassword} = data;

        const tel = "01011231237";
        const role = "ADMIN";

        axios.post(process.env.REACT_APP_API_URL + "signup", {
            name, email, password, tel, role
            }, {
                withCredentials: true // CORS 처리 옵션
            }
        ).catch((error) => {
            console.dir(error);
        });
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const onChangeEmail = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setEmail(value);

        // 이메일 형식이 올바른지 확인
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)) {
            setEmailError('올바른 이메일 형식이 아닙니다.');
        } else {
            setEmailError('');
        }
    };

    const onChangePassword = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setPassword(value);

        // 비밀번호 형식이 올바른지 확인
        if (!/^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/.test(value)) {
            setPasswordError('영문, 숫자를 포함한 6자 이상의 비밀번호를 입력해주세요.');
        } else {
            setPasswordError('');
        }
    };

    const onSubmit = useCallback((e: { preventDefault: () => void; }) => {
            e.preventDefault();
            // setLogInError(false);
            axios
                .post(
                    "http://localhost:7070/api/login",
                    {email, password},
                    {
                        withCredentials: true,
                    },
                )
                // .then((response) => {
                //     mutate(response.data, false);
                // })
                // .catch((error) => {
                //     setLogInError(error.response?.data?.statusCode === 401);
                // });
        },
        [email, password]
    );

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
    })

    return (
        <section className={isLogIn ? 'active' : ''}>
            <div className="left">
                <img src="/login/interior-jung-title-login.png" alt="로그인 이미지" width="700" height="400" />
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
                            })}
                        />
                        {errors.name && <div>{errors.name?.message}</div>}

                        <input
                            placeholder="이메일"
                            {...register("email", {
                                required:"이메일은 필수 응답 항목입니다.",
                                pattern:{
                                    value:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                                    message:"이메일 형식이 아닙니다."
                                }
                            })}
                        />
                        {errors.email && <div>{errors.email?.message}</div>}

                        <input
                            placeholder="비밀번호"
                            {...register("password", {
                                required: '비밀번호는 필수 입력입니다.',
                                pattern: {
                                    value: /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/,
                                    message:
                                        '영문, 숫자를 포함한 6자 이상의 비밀번호를 입력해주세요.',
                                },
                            })}
                        />
                        {errors.password && <div>{errors.password?.message}</div>}

                        <input
                            placeholder="비밀번호 재확인"
                            {...register("reCheckPassword", {
                                required: '비밀번호는 필수 입력입니다.',
                                pattern: {
                                    value: /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/,
                                    message:
                                        '영문, 숫자를 포함한 6자 이상의 비밀번호를 입력해주세요.',
                                },
                            })}
                        />
                        {errors.reCheckPassword && <div>{errors.reCheckPassword?.message}</div>}
                        <input type="submit" value="회원가입하기" />
                    </form>
                    <p>
                        이미 계정이 있으신가요?
                        <a href="#!" id="sign-in" onClick={toggleForm}>로그인 하러 가기.</a>
                    </p>
                </div>
            </div>
            <div className="right">
                <img src="/signup/interior-jung-title-signup.jpg" alt="회원가입 이미지" width="700" height="400" />
                <div className="sign-in">
                    <h1>로그인</h1>
                    <form onSubmit={onSubmit}>
                        <input type="email" onChange={onChangeEmail} placeholder="이메일" />
                        {emailError && <div>{emailError}</div>}

                        <input type="password" onChange={onChangePassword} placeholder="패스워드" />
                        {passwordError && <div>{passwordError}</div>}
                        <input type="submit" value="로그인하기" />
                    </form>
                    <p>
                        아직 계정이 없으신가요? <a href="#!" onClick={toggleForm}>회원가입 하기.</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LogIn;