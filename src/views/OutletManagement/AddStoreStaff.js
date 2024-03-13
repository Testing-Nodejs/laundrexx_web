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

const ManageStoreStaff = () => {
    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");
    const [AllOutlets, setAllOutlets] = useState([]);
    const [StoreType, setStoreType] = useState("-1");
    const [StoreStaffName, setStoreStaffName] = useState("");
    const [StoreStaffUName, setStoreStaffUName] = useState("");
    const [StoreStaffPhone, setStoreStaffPhone] = useState("");
    const [StoreStaffEmail, setStoreStaffEmail] = useState("");
    const [StoreStaffPass, setStoreStaffPass] = useState("Laundrexx!");
    const [AddButton, setAddButton] = useState(true);
    const [ClearButton, setClearButton] = useState(true);
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



    const GetAllOutlets = () => {
        document.getElementById("divLoading").className = "show";
        if (UserType == "Manager") {
            axios({
                method: "GET",
                url: MyApiUrl + "OutletsByManager/" + UserID + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    setAllOutlets(response.data);
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            axios({
                method: "GET",
                url: MyApiUrl + "Outlets",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    setAllOutlets(response.data);
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    React.useEffect(() => {
        setAddButton(true);
        setClearButton(true);
        GetAllOutlets();
    }, []);

    const ParentCheckBoxChecked = (Outlets) => {
        let ParentCheckBox = 0;
        const updatedData = Outlets.map((item) => {
            if (item.checked === 1 || item.checked === true) {
                ParentCheckBox++;
            }
        });
        setParentChecked(ParentCheckBox === Outlets.length ? true : false);
    }
    const AddStore = () => {
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
                STORE_STAFF_ADDED_BY: UserType,
                STORE_STAFF_ADDED_BY_FKID: UserID,
                STORE_STAFF_NAME: StoreStaffName,
                STORE_STAFF_USERNAME: StoreStaffUName,
                STORE_STAFF_PHONE: StoreStaffPhone,
                STORE_STAFF_PASSWORD: StoreStaffPass,
                STORE_STAFF_EMAIL: StoreStaffEmail,
                Outlets: AllOutlets,

            };
            axios.post(MyApiUrl + "OutletStaff", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "Outlet Staff Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "Outlet Staff Details Added!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
                    history.push("/ManageStoreStaff");
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Add!",
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

    const Addbtn = () => (
        <CButton type="button" onClick={AddStore} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            ADD
        </CButton>
    );

    const ClearBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-warning" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CLEAR
        </CButton>
    );

    const Reset = () => {
        setStoreStaffName("");
        setStoreStaffUName("");
        setStoreStaffEmail("");
        setStoreStaffPass("Laundrexx!");
        setStoreStaffPhone("");
        setAddButton(true);
        setClearButton(true);

        setParentChecked(false);

        setAllOutlets([]);
        GetAllOutlets();

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
                            <CCardHeader>Add Outlet Staff</CCardHeader>
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
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setStoreStaffName(value)
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
                                            {ClearButton && <ClearBtn />}
                                            {AddButton && <Addbtn />}
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
