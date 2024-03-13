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
    CSelect,
    CRow,
    CLink,
} from "@coreui/react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import { useHistory } from "react-router-dom";

const ManageStoreStaff = (props) => {

    const {
        STORE_STAFF_PKID,
        STORE_STAFF_NAME,
        STORE_STAFF_USERNAME,
        STORE_STAFF_PHONE,
        STORE_STAFF_EMAIL,
        STORE_STAFF_PASSWORD,
        OutletsForEdit,
    } = props.location.state.data;

    const [AllOutlets, setAllOutlets] = useState(OutletsForEdit);
    const [StoreStaffName, setStoreStaffName] = useState(STORE_STAFF_NAME);
    const [StoreStaffPkid, setStoreStaffPkid] = useState(STORE_STAFF_PKID);
    const [StoreStaffUName, setStoreStaffUName] = useState(STORE_STAFF_USERNAME);
    const [StoreStaffPhone, setStoreStaffPhone] = useState(STORE_STAFF_PHONE);
    const [StoreStaffEmail, setStoreStaffEmail] = useState(STORE_STAFF_EMAIL);
    const [StoreStaffPass, setStoreStaffPass] = useState(STORE_STAFF_PASSWORD);
    const [UpdateButton, setUpdateButton] = useState(true);
    const [CancelButton, setCancelButton] = useState(true);
    const [ParentChecked, setParentChecked] = useState(false);
    const history = useHistory();

    const StorePasswordChange = (event) => {
        setStoreStaffPass(event.target.value);
    };

    const StoreEmailChange = (event) => {
        setStoreStaffEmail(event.target.value);
    };


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

    React.useEffect(() => {
        setUpdateButton(true);
        setCancelButton(true);
        ParentCheckBoxChecked1();
    }, []);

    const ParentCheckBoxChecked1 = () => {
        let ParentCheckBox1 = 0;
        const updatedData = AllOutlets.map((item) => {
            if (item.checked === 1 || item.checked === true) {
                ParentCheckBox1++;
            }
        });
        setParentChecked(ParentCheckBox1 === AllOutlets.length ? true : false);
    }

    const ParentCheckBoxChecked = (Outlets) => {
        let ParentCheckBox = 0;
        const updatedData = Outlets.map((item) => {
            if (item.checked === 1 || item.checked === true) {
                ParentCheckBox++;
            }
        });
        setParentChecked(ParentCheckBox === Outlets.length ? true : false);
    }

    const UpdateStore = () => {
        if (StoreStaffName === "" || StoreStaffName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Staff Name!",
            });
        } else if (StoreStaffUName === "" || StoreStaffUName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Staff Login Name!",
            });
        } else if (StoreStaffPhone === "" || StoreStaffPhone == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Staff Phone!",
            });
        } else if (StoreStaffPass === "" || StoreStaffPass == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Staff Password!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                STORE_STAFF_NAME: StoreStaffName,
                STORE_STAFF_USERNAME: StoreStaffUName,
                STORE_STAFF_PHONE: StoreStaffPhone,
                STORE_STAFF_PASSWORD: StoreStaffPass,
                STORE_STAFF_EMAIL: StoreStaffEmail,
                Outlets: AllOutlets,

            };
            axios.put(MyApiUrl + "OutletStaff/" + StoreStaffPkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Outlet Staff Updated!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
                    history.push("/ManageStoreStaff");
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Update!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });

        }
    }

    const HandleParentCheckbox = (event) => {
        setParentChecked(event.target.checked);
        const updatedData = AllOutlets.map((item) => {
            return { ...item, checked: event.target.checked };
        });
        setAllOutlets(updatedData);
    }

    const InnerCheckBoxChecked = (event) => {
        const updatedData = AllOutlets.map((item) => {
            if (item.STORE_PKID === parseInt(event.target.value)) {
                return { ...item, checked: event.target.checked };
            }
            return item;
        });
        ParentCheckBoxChecked(updatedData);
        setAllOutlets(updatedData);
    }

    const Updatebtn = () => (
        <CButton type="button" onClick={UpdateStore} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );


    const CancelBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-danger" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CANCEL
        </CButton>
    );


    const Reset = () => {
        history.goBack();
    }

    return (
        <div className="123">
            <div id="divLoading"> </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster">Manage Outlet Staff</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="4">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Update Outlet Staff</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol lg="12" md="12">
                                            <CLabel>Outlet Staff Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Staff Name"
                                                value={StoreStaffName}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^A-Z a-z]/gi, ""); setStoreStaffName(value)
                                                }}
                                            />
                                        </CCol>
                                        <CCol lg="12" md="12">
                                            <CLabel>Outlet Staff Login Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Staff Login Name"
                                                value={StoreStaffUName}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^A-Z a-z]/gi, ""); setStoreStaffUName(value)
                                                }}
                                            />
                                        </CCol>
                                        <CCol lg="12" md="12">
                                            <CLabel>Outlet Staff Phone <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Staff Phone"
                                                value={StoreStaffPhone}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, ""); setStoreStaffPhone(value)
                                                }}
                                                maxLength={10}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol lg="12" md="12">
                                            <CLabel>Outlet Staff Email</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Staff Email"
                                                value={StoreStaffEmail}
                                                onChange={StoreEmailChange}
                                            />
                                        </CCol>
                                        <CCol lg="12" md="12">
                                            <CLabel>Outlet Staff Password <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Staff Password"
                                                value={StoreStaffPass}
                                                onChange={StorePasswordChange}
                                            />
                                        </CCol>

                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol lg="12" md="12">
                                            {CancelButton && <CancelBtn />}
                                            {UpdateButton && <Updatebtn />}
                                        </CCol>
                                    </CFormGroup>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
                <CCol md="12" lg="8">
                    <div id="country-table">
                        <table id="OutletTable">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: "3%", width: "70%" }}>Outlets</th>
                                    <th style={{ textAlign: "center", width: "30%" }}>
                                        <div className="checkboxes__row">
                                            <div className="checkboxes__item">
                                                <label className="checkbox style-d">
                                                    <input type="checkbox" value="All" checked={ParentChecked} id="Parent" onChange={HandleParentCheckbox} />
                                                    <div className="checkbox__checkmark" style={{ top: "-12px" }}></div>
                                                    <div class="checkbox__body">Select All</div>
                                                </label>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ height: 415 }}>
                                {
                                    AllOutlets.map((item) => {
                                        return (
                                            <React.Fragment>
                                                <tr>
                                                    <td style={{ textAlign: "left", width: "70%" }}>
                                                        <span style={{ marginLeft: "5%", color: "black", fontWeight: "400", fontSize: "14px" }}>{item.STORE_NAME}</span>
                                                    </td>
                                                    <td style={{ width: "30%" }}>
                                                        <div className="checkboxes__row">
                                                            <div className="checkboxes__item">
                                                                <label className="checkbox style-d">
                                                                    <input type="checkbox" onChange={InnerCheckBoxChecked} value={item.STORE_PKID} id={"ParentCheckbox_" + item.STORE_PKID} checked={item.checked} />
                                                                    <div className="checkbox__checkmark"></div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </CCol>
            </CRow>
        </div>
    );
};

export default ManageStoreStaff;
