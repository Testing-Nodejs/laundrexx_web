/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import axios from "axios";
import {
    CCard,
    CCardBody,
    CCol,
    CFormGroup,
    CRow,
    CImg,
    CDropdownDivider,
    CCardHeader,
    CLink,
} from "@coreui/react";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import avatar from '../../assets/Zeus_Images/user-icon.png';
import { useHistory } from "react-router-dom";

const OutletProfile = () => {
    const history = useHistory();
    const UserID = sessionStorage.getItem("UserID");
    const StoreID = sessionStorage.getItem("StoreID");
    const [ProfileDetails, setProfileDetails] = useState([]);

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
        console.log(StoreID + "/" + UserID);
        axios.get(MyApiUrl + "Outlets/" + StoreID + "/" + UserID + "").then((response) => {
            setProfileDetails(response.data);
        });
    };
    React.useEffect(() => {
        getManagerProfile();
    }, []);

    return (
        <div id="city">
            <div id="divLoading"> </div>
            
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/OutletDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster">My Profile Details</h1>
            <CRow style={{ marginTop: "3%", paddingLeft: "20px", paddingRight: "20px" }}>
                <CCol md="12" lg="5">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        {ProfileDetails.length > 0 ?
                            <CCardBody>
                                <CFormGroup row>
                                    <CCol xs="12" md="12" style={{ textAlign: "center" }}>
                                        <CImg src={avatar} size="md" style={{ width: "130px" }} />
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12" style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>{ProfileDetails[0].STORE_STAFF_NAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="5">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Login Name</span>
                                    </CCol>
                                    <CCol md="7">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_STAFF_USERNAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="5">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Phone No.</span>
                                    </CCol>
                                    <CCol md="7">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_STAFF_PHONE}</span>
                                    </CCol>
                                </CFormGroup>
                                {ProfileDetails[0].STORE_STAFF_EMAIL == null || ProfileDetails[0].STORE_STAFF_EMAIL == "" ? null :
                                    <div>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="5">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Email</span>
                                            </CCol>
                                            <CCol md="7">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_STAFF_EMAIL}</span>
                                            </CCol>
                                        </CFormGroup>
                                    </div>
                                }
                            </CCardBody>
                            : null
                        }
                    </CCard>
                </CCol>
                <CCol md="12" lg="7">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        {ProfileDetails.length > 0 ?
                            <CCardBody>
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store ID</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_ID}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Code</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_CODE}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Name</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_NAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Phone No.</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_PHONE}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Default Factory</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].FACTORY_NAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Route Name</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].ROUTE_NAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Default Service Type</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].SERVICE_TYPE_NAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Default Service Category</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].SERVICE_CATEGORY_NAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store City</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_CITY}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Address</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{ProfileDetails[0].STORE_ADDRESS}</span>
                                    </CCol>
                                </CFormGroup>
                            </CCardBody>
                            :
                            null
                        }
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};

export default OutletProfile;
