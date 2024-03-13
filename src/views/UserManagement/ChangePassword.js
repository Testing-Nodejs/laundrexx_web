/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import axios from "axios";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormGroup,
    CInput,
    CSelect,
    CRow,
    CDataTable,
    CLabel,
    CInputGroup, CInputGroupText, CInputGroupAppend,
    CLink

} from "@coreui/react";
import { useHistory } from "react-router-dom";
import { MyApiUrl } from "src/services/service";
import EditIcon from "@material-ui/icons/Edit";
import Swal from "sweetalert2";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import "../../style.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const ChangePassword = () => {
    const history = useHistory();
    const [OldPassword, setOldPassword] = useState();
    const [NewPassword, setNewPassword] = useState();
    const [RepeatNewPassword, setRepeatNewPassword] = useState();
    const UserID = sessionStorage.getItem("UserID");
    const UserPassword = sessionStorage.getItem("UserPassword");
    const SessionType = sessionStorage.getItem("SessionType");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);

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

    const reset = () => {
        setOldPassword("");
        setNewPassword("");
        setRepeatNewPassword("");
    }
    const changePassword = () => {
        if (OldPassword === "" || OldPassword == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Old Password!",
            });
        } else if (NewPassword === "" || NewPassword == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter New Password!",
            });
        } else if (OldPassword == NewPassword) {
            Toast.fire({
                icon: "warning",
                title: "Old Password and New Password must be different!",
            });
        } else if (RepeatNewPassword === "" || RepeatNewPassword == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Confirm Password!",
            });
        } else if (NewPassword != RepeatNewPassword) {
            Toast.fire({
                icon: "warning",
                title: "New Password and Confirm Password must be same!",
            });
        } else if (UserPassword != OldPassword) {
            Toast.fire({
                icon: "error",
                title: "Old Password is wrong!",
            });
        } else {
            const obj = {
                "Password": NewPassword,
                "id": SessionType == "Admin" ? "All" : UserID
            };
            document.getElementById("divLoading").className = "show";
            axios.post(MyApiUrl + "ChangePassword/", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Password Changed Successfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    sessionStorage.setItem("UserPassword", NewPassword);
                    reset();
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed to Change Password!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });
        }
    };

    const changeOldPassword = (event) => {
        setOldPassword(event.target.value);
    };
    const changeNewPassword = (event) => {
        setNewPassword(event.target.value);
    };
    const changeRepeatNewPassword = (event) => {
        setRepeatNewPassword(event.target.value);
    };
    return (
        <div id="city">
            <div id="divLoading"> </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster">Manage Password</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="3"></CCol>
                <CCol md="12" lg="6">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Change Password</CCardHeader>
                        <CCardBody>
                            <CForm
                                action=""
                                method="post"
                                encType="multipart/form-data"
                                className="form-horizontal"
                            >
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Old Password <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInputGroup>
                                            <CInput
                                                id="text-input1"
                                                name="text-input"
                                                placeholder="Enter Old Password"
                                                value={OldPassword}
                                                onChange={changeOldPassword}
                                                type={showOldPassword ? "text" : "password"}
                                            />
                                            <CInputGroupAppend>
                                                <CButton
                                                    color="secondary"
                                                    className="changePassword"
                                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                                >
                                                    {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </CButton>
                                            </CInputGroupAppend>
                                        </CInputGroup>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>New Password <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInputGroup>
                                            <CInput
                                                id="text-input1"
                                                name="text-input"
                                                placeholder="Enter New Password"
                                                value={NewPassword}
                                                onChange={changeNewPassword}
                                                type={showNewPassword ? "text" : "password"}
                                            />
                                            <CInputGroupAppend>
                                                <CButton
                                                    color="secondary"
                                                    className="changePassword"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </CButton>
                                            </CInputGroupAppend>
                                        </CInputGroup>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Confirm Password <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInputGroup>
                                            <CInput
                                                id="text-input1"
                                                name="text-input"
                                                placeholder="Enter Confirm Password"
                                                value={RepeatNewPassword}
                                                onChange={changeRepeatNewPassword}
                                                type={showRepeatNewPassword ? "text" : "password"}
                                            />
                                            <CInputGroupAppend>
                                                <CButton
                                                    color="secondary"
                                                    className="changePassword"
                                                    onClick={() => setShowRepeatNewPassword(!showRepeatNewPassword)}
                                                >
                                                    {showRepeatNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </CButton>
                                            </CInputGroupAppend>
                                        </CInputGroup>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CButton type="button" onClick={changePassword} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
                                            Change Password
                                        </CButton>
                                    </CCol>
                                </CFormGroup>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="3"></CCol>
            </CRow>
        </div>
    );
};

export default ChangePassword;
