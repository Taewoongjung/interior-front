import React, {useState} from "react";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import {SIGNUP_ERROR_CODES} from "../../codes/ErrorCodes";
import {useForm} from "react-hook-form";
import {IFormValues} from "../../definitions/Management/IFormValues";
import Modal from "../../components/Modal";
import {Link} from 'react-router-dom';
import './styles.css';
import ManagementNav from "../../components/Nav/Management";

const Management = () => {
    const {data:userData, error, mutate} = useSWR(
        'http://api-interiorjung.shop:7077/api/me',
        // 'http://localhost:7070/api/me',
        fetcher,{
            dedupingInterval: 2000
        });

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열림 상태를 관리하는 상태 변수
    const [modalHeader, setModalHeader] = useState(""); // 모달의 열림 상태를 관리하는 상태 변수

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSubmitAddCompany = async (data: { companyName: string; mainAddress: string; subAddress:string; tel: string; }) => {
        const {companyName, mainAddress, subAddress, tel} = data;
        const bdgNumber = "1";

        await axios
            .post("http://api-interiorjung.shop:7077/api/companies", {
            // .post("http://localhost:7070/api/companies", {
                    companyName, mainAddress, subAddress, bdgNumber, tel
                },
                {
                    withCredentials: true, // CORS 처리 옵션
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token")
                    }
                }
            ).then((response) => {
            if (response.data === true) {
                openModal();
                setModalHeader("회사가 등록됐습니다.");
                mutate();
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

    return(
        <>
            <ManagementNav userName={userData?.name} userEmail={userData?.email}/>
            <section>회사 리스트</section>
            {userData?.companyList.length !== 0 &&
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {userData?.companyList.map((company: { id: string | number | bigint | null | undefined; name: React.ReactNode; address: React.ReactNode; subAddress: React.ReactNode; buildingNumber: React.ReactNode; tel: React.ReactNode; }) => (
                                <tr key={company.id}>
                                    <td>{company.name}</td>
                                    <td>{company.address}</td>
                                    <td><Link to={`/main/${company.id}`}><button>→</button></Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

            <form onSubmit={handleSubmit(onSubmitAddCompany)}>
                <input
                    id="name" placeholder="회사명"
                    {...register("companyName", {
                        required: "회사명은 필수 응답 항목입니다.",
                        pattern: {
                            value: /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]{2,7}$/,
                            message: "이름 형식이 맞지않습니다."
                        },
                    })} />
                {errors.companyName && <div>{errors.companyName?.message}</div>}

                <input
                    type="address" placeholder="회사 주소"
                    {...register("mainAddress", {
                        required: "주소는 필수 응답 항목입니다.",
                        pattern: {

                            value: /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]{2,7}$/,
                            message: "주소 형식이 아닙니다."
                        }
                    })} />
                {errors.mainAddress && <div>{errors.mainAddress?.message}</div>}

                <input
                    type="address" placeholder="회사 주소"
                    {...register("subAddress", {
                        required: "서브 주소는 필수 응답 항목입니다.",
                        pattern: {

                            value: /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]{2,7}$/,
                            message: "주소 형식이 아닙니다."
                        }
                    })} />
                {errors.subAddress && <div>{errors.subAddress?.message}</div>}

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

                <input type="submit" value="+"/>
            </form>

            <Modal open={isModalOpen} close={closeModal} header={modalHeader}/>
        </>
    )
}

export default Management;