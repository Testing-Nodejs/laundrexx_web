/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
    CTextarea,
    CRow,
    CLink,
} from "@coreui/react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl, ViewImg } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import { useHistory } from "react-router-dom";

const OutletDeliveryByPhoneNo = () => {
    const history = useHistory();

    const StoreID = sessionStorage.getItem("StoreID");
    const UserName = sessionStorage.getItem("UserName");
    const StoreName = sessionStorage.getItem("StoreName");

    const [PhoneNo, setPhoneNo] = useState("");


    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });


    const GetPhonenumber = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "SendOTP/" + StoreID + "/" + PhoneNo + "").then((response) => {
            console.log(response.data);
            if (response.data === false) {
                Swal.fire({
                    title: "Phone Number Does Not Exist!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
            }
            else {
                localStorage.setItem("DeliveryOTP", "0");
                history.push("/OutletVerifyOtp", {
                    PhoneNo
                });
            }
        });

    }



    React.useEffect(() => {
        document.getElementById("NumOrder").focus();

    }, []);

    return (
        <div className="123">
            <div id="divLoading"> </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/OutletDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster" style={{ marginTop: "3%" }}>Outlet Delivery</h1>



            <CRow style={{ marginTop: "3%", alignContent: "center" }}>
                <CCol md="12" lg="3"></CCol>
                <CCol md="12" lg="6">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Enter Phone Number</CCardHeader>
                        <CCardBody>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Phone Number<span style={{ color: "red" }}> *</span></CLabel>
                                    <CInput
                                        id="NumOrder"
                                        name="NumOrder"
                                        placeholder="Enter Phone Number"
                                        value={PhoneNo}
                                        onChange={(event) => {
                                            setPhoneNo(event.target.value);
                                        }}
                                    />
                                </CCol>
                                    <CCol xs="12" md="12">
                                        <CButton
                                            className="btn btn-success"
                                            style={{
                                                fontSize: 13,
                                                float: "right",
                                                marginTop: "4%"
                                            }}
                                            onClick={GetPhonenumber}
                                        >
                                            Send OTP
                                        </CButton>
                                        
                                        <CButton
                                            className="btn btn-success"
                                            style={{
                                                fontSize: 13,
                                                float: "right",
                                                marginTop: "4%",
                                                marginRight: "3%"
                                            }}
                                            onClick={() => {
                                                localStorage.setItem("DeliveryCode", "0");
                                                history.push("/OutletDeliveryByDeliveryCode", {
                                                    PhoneNo
                                                });
                                            }

                                            }
                                        >
                                            By Delivery Code
                                        </CButton>
                                    </CCol>
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="12" lg="3"></CCol>
            </CRow>
        </div>
    );
};

export default OutletDeliveryByPhoneNo;