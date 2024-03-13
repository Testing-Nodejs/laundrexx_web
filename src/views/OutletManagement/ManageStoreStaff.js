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
    CLink,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from "@coreui/react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Sl No." },
    { key: "Action" },
    { key: "Name" },
    { key: "Login Name" },
    { key: "Phone" },
    { key: "Password" },
    { key: "Email" },
    { key: "Outlet" },
];

const fields = [
    { key: "Outlet ID" },
    { key: "Outlet Code" },
    { key: "Outlet Name" },
];

const ManageStoreStaff = () => {

    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");
    const [StoreStaffData, setStoreStaffData] = useState([]);
    const [block, setBlock] = useState(false);
    const [InnerTableData, setInnerTableData] = useState([]);
    const history = useHistory();

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



    const GetAllStoreStaff = async () => {
        if (UserType == "Manager") {
            document.getElementById("divLoading").className = "show";
            await axios({
                method: "GET",
                url: MyApiUrl + "OutletStaffForManager/" + UserID + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Name": item.STORE_STAFF_NAME,
                            "Login Name": item.STORE_STAFF_USERNAME,
                            "Phone": item.STORE_STAFF_PHONE,
                            "Email": item.STORE_STAFF_EMAIL === "" || item.STORE_STAFF_EMAIL === null ? "-" : item.STORE_STAFF_EMAIL,
                            "Password": item.STORE_STAFF_PASSWORD,
                        };
                    });
                    setStoreStaffData(items)
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            document.getElementById("divLoading").className = "show";
            await axios({
                method: "GET",
                url: MyApiUrl + "OutletStaff",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Name": item.STORE_STAFF_NAME,
                            "Login Name": item.STORE_STAFF_USERNAME,
                            "Phone": item.STORE_STAFF_PHONE,
                            "Email": item.STORE_STAFF_EMAIL === "" || item.STORE_STAFF_EMAIL === null ? "-" : item.STORE_STAFF_EMAIL,
                            "Password": item.STORE_STAFF_PASSWORD,
                        };
                    });
                    setStoreStaffData(items)
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    React.useEffect(() => {
        GetAllStoreStaff();
    }, []);



    const DeleteStore = (pkid) => {
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "OutletStaff/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected Staff Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete Staff!",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        document.getElementById("divLoading").className = "hide";
                    }
                }).catch((error) => {
                    console.log(error);
                });
        }

    }


    const Reset = () => {

        GetAllStoreStaff();

    }

    const ViewOutlets = (list) => {
        const items = list.map((item) => {
            return {
                ...item,
                "Outlet ID": item.STORE_ID,
                "Outlet Code": item.STORE_CODE,
                "Outlet Name": item.STORE_NAME,
            };
        });
        setInnerTableData(items);
        setBlock(!block);
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

                <CCol md="12" lg="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>
                            <div style={{ float: 'left' }}>View Outlet Staff</div>
                            <div style={{ float: 'right' }}>
                                <CLink to="/AddStoreStaff">
                                    <CButton size="sm" className="btn btn-success" style={{ marginBottom: 0, marginTop: 0 }}>
                                        Add Outlet Staff
                                    </CButton>
                                </CLink>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={StoreStaffData}
                                fields={fields2}
                                hover
                                striped
                                bordered
                                sorter
                                tableFilter={table}
                                itemsPerPageSelect={items}
                                columnFilterSlot
                                size="sm"
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    Action: (item) => (
                                        <td>
                                            <CButton size="sm" id="war-btn"
                                                onClick={() =>
                                                    history.push("/EditStoreStaff", {
                                                        data: item,
                                                    })
                                                }>
                                                <EditIcon />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    DeleteStore(item.STORE_STAFF_PKID);
                                                }}
                                                id="war-btn1"
                                            >
                                                <DeleteSharpIcon />
                                            </CButton>
                                        </td>
                                    ),
                                    Outlet: (item) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewOutlets(item.Outlets);
                                                }}
                                            >
                                                View
                                            </CButton>
                                        </td>
                                    ),

                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal show={block} onClose={() => setBlock(!block)} color="dark" style={{ height: 480 }}>
                <CModalHeader closeButton>
                    <CModalTitle>View Outlets</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <CDataTable
                                items={InnerTableData}
                                fields={fields}
                                hover
                                striped
                                bordered
                                sorter
                                tableFilter={table}
                                itemsPerPageSelect={items}
                                columnFilterSlot
                                size="sm"
                                itemsPerPage={5}
                                pagination
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        className="btn btn-danger"
                        style={{ fontSize: "12px" }}
                        onClick={() => setBlock(!block)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ManageStoreStaff;
