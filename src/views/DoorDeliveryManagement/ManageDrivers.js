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
    CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Action" },
    { key: "Driver Name" },
    { key: "Driver Phone" },
    { key: "Driver LoginName" },
    { key: "Driver Email" },
    { key: "Driver Password" },
];

const ManageDrivers = () => {
    const history = useHistory();

    const [DriverData, setDriverData] = useState([]);
    const [DriverName, setDriverName] = useState("");
    const [DriverPkid, setDriverPkid] = useState("");
    const [DriverLName, setDriverLName] = useState("");
    const [DriverPhone, setDriverPhone] = useState("");
    const [DriverEmail, setDriverEmail] = useState("");
    const [DriverPass, setDriverPass] = useState("Laundrexx!");
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);



    const DriverPasswordChange = (event) => {
        setDriverPass(event.target.value);
    };

    const DriverEmailChange = (event) => {
        setDriverEmail(event.target.value);
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


    const GetAllDriver = async () => {
        document.getElementById("divLoading").className = "show";
        await axios({
            method: "GET",
            url: MyApiUrl + "Drivers",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "Driver Name": item.DRIVER_NAME,
                        "Driver Phone": item.DRIVER_PHONE,
                        "Driver LoginName": item.DRIVER_USERNAME,
                        "Driver Email": item.DRIVER_EMAIL == "" || item.DRIVER_EMAIL == null ? '-' : item.DRIVER_EMAIL,
                        "Driver Password": item.DRIVER_PASSWORD,
                    };
                });
                setDriverData(items)
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    };

    React.useEffect(() => {
        GetAllDriver();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }, []);


    const AddDriver = () => {
        if (DriverName === "" || DriverName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Driver Name!",
            });
        } else if (DriverPhone === "" || DriverPhone == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Driver Phone!",
            });
        } else if (DriverLName === "" || DriverLName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Driver Login Name!",
            });
        } else if (DriverPass === "" || DriverPass == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Driver Password!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                DRIVER_NAME: DriverName,
                DRIVER_PHONE: DriverPhone,
                DRIVER_USERNAME: DriverLName,
                DRIVER_PASSWORD: DriverPass,
                DRIVER_EMAIL: DriverEmail,
            };
            axios.post(MyApiUrl + "Drivers", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "Driver Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "Driver Details Added!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
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

    const EditDriver = (pkid, drivername, driverLname, driverphone, driverPass, driverEmail) => {
        setDriverPkid(pkid);
        setDriverName(drivername);
        setDriverLName(driverLname);
        setDriverPhone(driverphone);
        setDriverPass(driverPass);
        setDriverEmail(driverEmail);
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);
    }

    const DeleteDriver = (pkid) => {
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "Drivers/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected Driver Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete Driver!",
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


    const UpdateDriver = () => {
        if (DriverName === "" || DriverName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Driver Name!",
            });
        } else if (DriverPhone === "" || DriverPhone == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Driver Phone!",
            });
        } else if (DriverLName === "" || DriverLName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Driver Login Name!",
            });
        } else if (DriverPass === "" || DriverPass == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Driver Password!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                DRIVER_NAME: DriverName,
                DRIVER_PHONE: DriverPhone,
                DRIVER_USERNAME: DriverLName,
                DRIVER_PASSWORD: DriverPass,
                DRIVER_EMAIL: DriverEmail,
            };
            axios.put(MyApiUrl + "Drivers/" + DriverPkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Driver Details Updated!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
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

    const Updatebtn = () => (
        <CButton type="button" onClick={UpdateDriver} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddDriver} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            ADD
        </CButton>
    );

    const CancelBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-danger" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CANCEL
        </CButton>
    );

    const ClearBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-warning" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CLEAR
        </CButton>
    );

    const Reset = () => {
        setDriverPkid("");
        setDriverName("");
        setDriverLName("");
        setDriverPhone("");
        setDriverPass("Laundrexx!");
        setDriverEmail("");
        GetAllDriver();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }

    return (
        <div className="123">
            <div id="divLoading"> </div>
            <h1 id="ccmaster">Manage Driver</h1>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="4">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add/Update Driver</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Driver Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Driver Name"
                                                value={DriverName}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^A-Z a-z]/gi, ""); setDriverName(value)
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Driver Phone <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Driver Phone"
                                                value={DriverPhone}
                                                maxLength={10}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, ""); setDriverPhone(value)
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Driver Login Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Login Name"
                                                value={DriverLName}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setDriverLName(value)
                                                }}

                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Driver Email</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Driver Email"
                                                value={DriverEmail}
                                                onChange={DriverEmailChange}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Driver Password <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Driver Password"
                                                value={DriverPass}
                                                onChange={DriverPasswordChange}
                                            />
                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            {CancelButton && <CancelBtn />}
                                            {UpdateButton && <Updatebtn />}
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
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>View Driver's</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={DriverData}
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
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    EditDriver(
                                                        item.DRIVER_PKID,
                                                        item.DRIVER_NAME,
                                                        item.DRIVER_USERNAME,
                                                        item.DRIVER_PHONE,
                                                        item.DRIVER_PASSWORD,
                                                        item.DRIVER_EMAIL,
                                                    );
                                                }}
                                                id="war-btn"
                                            >
                                                <EditIcon />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    DeleteDriver(item.DRIVER_PKID);
                                                }}
                                                id="war-btn1"
                                            >
                                                <DeleteSharpIcon />
                                            </CButton>
                                        </td>
                                    ),
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};

export default ManageDrivers;
