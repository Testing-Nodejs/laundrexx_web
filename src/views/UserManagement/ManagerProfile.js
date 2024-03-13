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
    CImg,
    CDropdownDivider,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import { MyApiUrl } from "src/services/service";
import EditIcon from "@material-ui/icons/Edit";
import Swal from "sweetalert2";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import "../../style.css";
import avatar from '../../assets/Zeus_Images/user-icon.png';

const ManagerProfile = () => {
    const history = useHistory();
    const UserID = sessionStorage.getItem("UserID");
    const [UserName, setUserName] = useState("");
    const [ManagerType, setManagerType] = useState("");
    const [Email, setEmail] = useState("");
    const [LoginName, setLoginName] = useState("");
    const [Phone, setPhone] = useState("");

    const [UpdateEmail, setUpdateEmail] = useState("");
    const [UpdateLoginName, setUpdateLoginName] = useState("");
    const [UpdateUserName, setUpdateUserName] = useState("");
    const [UpdatePhone, setUpdatePhone] = useState("");

    const [block, setBlock] = useState(false);

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
    const getManagerProfile = () => {
        axios.get(MyApiUrl + "GetManagerProfile/" + UserID + "").then((response) => {
            if (response.data.length > 0) {
                setManagerType(response.data[0].USER_TYPE_NAME);
                setEmail(response.data[0].USER_EMAIL);
                setLoginName(response.data[0].USER_LOGIN_NAME);
                setUserName(response.data[0].USER_NAME);
                setPhone(response.data[0].USER_PHONE);

                setUpdateEmail(response.data[0].USER_EMAIL);
                setUpdateLoginName(response.data[0].USER_LOGIN_NAME);
                setUpdateUserName(response.data[0].USER_NAME);
                setUpdatePhone(response.data[0].USER_PHONE);
            }
            else {
                setManagerType("");
                setEmail("");
                setLoginName("");
                setUserName("");
                setPhone("");

                setUpdateEmail("");
                setUpdateLoginName("");
                setUpdateUserName("");
                setUpdatePhone("");
            }
        });
    };
    React.useEffect(() => {
        getManagerProfile();
    }, []);
    const ViewServiceCategory = () => {
        setBlock(!block);
    }
    const reset = () => {
        setBlock(!block);
        setUpdateEmail("");
        setUpdateLoginName("");
        setUpdateUserName("");
        setUpdatePhone("");
        getManagerProfile();
    }

    const updateProfile = () => {
        if (UpdateUserName === "" || UpdateUserName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Name!",
            });
        } else if (UpdateLoginName === "" || UpdateLoginName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter LoginName!",
            });
        } else if (UpdateEmail === "" || UpdateEmail == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Email!",
            });
        } else if (UpdatePhone === "" || UpdatePhone == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Phone No.!",
            });
        } else {
            const obj = {
                USER_LOGIN_NAME: UpdateLoginName,
                USER_NAME: UpdateUserName,
                USER_EMAIL: UpdateEmail,
                USER_PHONE: UpdatePhone,
            };
            document.getElementById("divLoading").className = "show";
            axios.put(MyApiUrl + "UsersProfileUpdate/" + UserID + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Profile Updated Successfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    sessionStorage.setItem("UserName", UpdateUserName);
                    reset();
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed to Update Profile!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });
        }
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
            <h1 id="ccmaster">My Profile</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="12" lg="1"></CCol>
                <CCol md="12" lg="4">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardBody>
                            <CFormGroup row>
                                <CCol xs="12" md="12" style={{ textAlign: "center" }}>
                                    <CImg src={avatar} size="md" style={{ width: "130px" }} />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12" style={{ textAlign: "center" }}>
                                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>{UserName}</span>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12" style={{ textAlign: "center" }}>
                                    <span style={{ fontSize: "13px", fontWeight: "400", color: "#757575" }}>{ManagerType}</span>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12" style={{ textAlign: "center" }}>
                                    <CButton
                                        className="btn btn-info"
                                        style={{ fontSize: "12px" }}
                                        onClick={() => {
                                            ViewServiceCategory();
                                        }}
                                    >
                                        Edit Profile
                                    </CButton>
                                </CCol>
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="12" lg="6">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardBody>
                            <CFormGroup row>
                                <CCol md="3">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Name</span>
                                </CCol>
                                <CCol md="9">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{UserName}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="3">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Login Name</span>
                                </CCol>
                                <CCol md="9">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{LoginName}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="3">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Manager Type</span>
                                </CCol>
                                <CCol md="9">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ManagerType}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="3">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Email</span>
                                </CCol>
                                <CCol md="9">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{Email}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="3">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Phone No.</span>
                                </CCol>
                                <CCol md="9">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{Phone}</span>
                                </CCol>
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="12" lg="1"></CCol>
            </CRow>
            <CModal show={block}
                onClose={() => {
                    setBlock(!block);
                    reset();
                }}
                color="dark"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Edit Profile</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ height: "330px" }}>
                    <CRow>
                        <CCol md="12">
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Name</CLabel>
                                    <CInput
                                        id="text-input"
                                        name="text-input"
                                        placeholder="Enter Name"
                                        value={UpdateUserName}
                                        onChange={(event) => {
                                            setUpdateUserName(event.target.value);
                                        }}
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Login Name</CLabel>
                                    <CInput
                                        id="text-input"
                                        name="text-input"
                                        placeholder="Enter Login Name"
                                        value={UpdateLoginName}
                                        onChange={(event) => {
                                            setUpdateLoginName(event.target.value);
                                        }}
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Email</CLabel>
                                    <CInput
                                        id="text-input"
                                        name="text-input"
                                        placeholder="Enter Email"
                                        value={UpdateEmail}
                                        onChange={(event) => {
                                            setUpdateEmail(event.target.value);
                                        }}
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Phone</CLabel>
                                    <CInput
                                        id="text-input"
                                        name="text-input"
                                        placeholder="Enter Phone"
                                        value={UpdatePhone}
                                        onChange={(event) => {
                                            let value = event.target.value;
                                            value = value.replace(/[^0-9]/gi, "");
                                            setUpdatePhone(value)
                                        }}
                                        maxLength={10}
                                    />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        className="btn btn-success"
                        style={{ fontSize: "12px" }}
                        onClick={() => {
                            updateProfile();
                        }}>
                        Update
                    </CButton>
                    <CButton
                        className="btn btn-danger"
                        style={{ fontSize: "12px" }}
                        onClick={() => {
                            setBlock(!block);
                            reset();
                        }}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ManagerProfile;
