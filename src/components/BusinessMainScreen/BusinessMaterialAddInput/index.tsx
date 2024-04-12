import React, {FormEventHandler, useState} from "react";
import {useForm} from "react-hook-form";
import {IFormValues} from "../../../definitions/BusinessMaterialAddInput/IFormValues";
import "./styles.css";
import {options} from "./select";
import axios from "axios";

const BusinessMaterialAddInput = ((props: { businessIdParam?: any; onEvent: () => void;}) => {
    const {businessIdParam, onEvent} = props;

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

    const textareaAutosize: FormEventHandler<HTMLTextAreaElement> = (e) => {
        const element = e.target as HTMLTextAreaElement;
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };

    const onSubmitRegisterMaterial = async (data: { materialName: any; materialAmount: any; materialCategory: any; materialMemo: any; }) => {
        const {materialName, materialAmount, materialCategory, materialMemo} = data;

        await axios
            .post(`http://api-interiorjung.shop:7077/api/businesses/${businessIdParam}/materials`, {
                // .post(`http://localhost:7070/api/businesses/${businessIdParam[0]}/materials`, {
                materialName, materialAmount, materialCategory, materialMemo
                }, {
                    withCredentials: true, // CORS 처리 옵션
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token")
                    }
                }
            ).then((response) => {
                if (response.data === true) {
                    onEvent();
                    reset();
                }}
        )
            .catch((error) => {
                // const errorCode = error.response.data.errorCode;
                console.dir(error);
            });
    };


    return (
        <>
        <div className="container">
            <details>
            <summary>자재 등록하기</summary>
                <br/>
                <section>
                    <form className="well form-horizontal" action=" " method="post" id="contact_form"
                          onSubmit={handleSubmit(onSubmitRegisterMaterial)}>
                        <fieldset>

                            <div className="form-group">
                                <label className="col-md-4 control-label">자재 명</label>
                                <div className="col-md-4 inputGroupContainer">
                                    <div className="input-group">
                                        <input id="material_name"
                                            placeholder="입력..." type="text"
                                            {...register("materialName", {
                                                required: "이름은 필수 응답 항목입니다."
                                            })} />
                                        {errors.materialName && <div className="error_msg">⚠️ {errors.materialName.message}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label">수량</label>
                                <div className="col-md-4 inputGroupContainer">
                                    <div className="input-group">
                                        <input id="material_amount"
                                               placeholder="입력..." type="text"
                                               {...register("materialAmount", {
                                                   required: "필수 항목입니다.",
                                                   valueAsNumber: true,
                                                   validate: {
                                                       isNumber: value => !isNaN(value) || "숫자만 입력하세요."
                                                   }
                                               })} />
                                        {errors.materialAmount && <div className="error_msg">⚠️️️ {errors.materialAmount.message}<br/></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label">자재 종류</label>
                                <div className="col-md-4 selectContainer">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-list"></i></span>
                                        <select
                                            className="form-control selectpicker"
                                            {...register("materialCategory")}>
                                            {options.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <br/>
                            <div className="form-group">
                                <label className="col-md-4 control-label">메모</label>
                                <div className="col-md-4 inputGroupContainer">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-pencil"></i></span>
                                        <textarea id="material_memo"
                                              rows={1} placeholder="자재에 대한 메모를 입력해주세요."
                                               {...register("materialMemo", {
                                                   // maxLength: 200,
                                                   onChange: textareaAutosize,
                                               })} />
                                    </div>
                                </div>
                            </div>

                            <br/>
                            <hr/>

                            <div className="alert alert-success" role="alert" id="normal_message"><i className="glyphicon glyphicon-thumbs-up"></i> *<u>자재 명</u> 과 <u>수량</u> 은 필수값 입니다.</div>

                            <div className="form-group">
                                <label className="col-md-4 control-label"></label>
                                <div className="col-md-4">
                                    <button type="submit" className="btn btn-warning" >등록<span className="glyphicon glyphicon-send"></span></button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </section>
            </details>
        </div>
        </>
    );
});

export default BusinessMaterialAddInput;