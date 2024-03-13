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
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
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
    { key: "Factory ID" },
    { key: "Code" },
    { key: "Name" },
    { key: "Address" },
    { key: "City" },
];

const ManageFactory = () => {
    const history = useHistory();

    const [FactoryData, setFactoryData] = useState([]);
    const [FactoryID, setFactoryID] = useState(Math.floor(1000 + Math.random() * 9000));
    const [FactoryCode, setFactoryCode] = useState("");
    const [FactoryPkid, setFactoryPkid] = useState("");
    const [FactoryName, setFactoryName] = useState("");
    const [FactoryAddress, setFactoryAddress] = useState("");
    const [FactoryCity, setFactoryCity] = useState("");
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);
    const [block, setBlock] = useState(false);
    const [ModalData, setModalData] = useState("");

    const FactoryIDChange = (event) => {
        setFactoryID(event.target.value);
    };

    const FactoryAddressChange = (event) => {
        setFactoryAddress(event.target.value);
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


    const GetAllFactory = async () => {
        document.getElementById("divLoading").className = "show";
        await axios({
            method: "GET",
            url: MyApiUrl + "Factory",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "Factory ID": item.FACTORY_ID,
                        "Code": item.FACTORY_CODE,
                        "Name": item.FACTORY_NAME,
                        "City": item.FACTORY_CITY,
                    };
                });
                setFactoryData(items)
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    };

    React.useEffect(() => {
        GetAllFactory();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }, []);


    const AddFactory = () => {
        if (FactoryCode === "" || FactoryCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Code!",
            });
        } else if (FactoryName === "" || FactoryName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Name!",
            });
        } else if (FactoryAddress === "" || FactoryAddress == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Address!",
            });
        } else if (FactoryCity === "" || FactoryCity == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory City!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                FACTORY_ID: FactoryID,
                FACTORY_CODE: FactoryCode,
                FACTORY_NAME: FactoryName,
                FACTORY_ADDRESS: FactoryAddress,
                FACTORY_CITY: FactoryCity,
            };
            axios.post(MyApiUrl + "Factory", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "Factory Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "Factory Details Added!",
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

    const EditFactory = (pkid, FactCode, FactName, FactAdd, FactCity) => {
        setFactoryPkid(pkid);
        setFactoryCode(FactCode);
        setFactoryName(FactName);
        setFactoryAddress(FactAdd);
        setFactoryCity(FactCity);
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);
    }

    const DeleteFactory = (pkid) => {
        document.getElementById("divLoading").className = "show";
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "Factory/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected Factory Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete Factory!",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    }
                })
        }
    };

    const UpdateFactory = () => {
        if (FactoryCode === "" || FactoryCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Code!",
            });
        } else if (FactoryName === "" || FactoryName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Name!",
            });
        } else if (FactoryAddress === "" || FactoryAddress == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Address!",
            });
        } else if (FactoryCity === "" || FactoryCity == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory City!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                FACTORY_ID: FactoryID,
                FACTORY_CODE: FactoryCode,
                FACTORY_NAME: FactoryName,
                FACTORY_ADDRESS: FactoryAddress,
                FACTORY_CITY: FactoryCity,
            };
            axios.put(MyApiUrl + "Factory/" + FactoryPkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Factory Updated!",
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
        <CButton type="button" onClick={UpdateFactory} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddFactory} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
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
        setFactoryID(Math.floor(1000 + Math.random() * 9000));
        setFactoryCode("");
        setFactoryName("");
        setFactoryAddress("");
        setFactoryCity("");
        setFactoryPkid("");
        GetAllFactory();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }

    const ViewServiceCategory = (list) => {
        setModalData(list);
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
            <h1 id="ccmaster">Manage Factory</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="4">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add/Update Factory</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Factory ID</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Factory ID"
                                                readOnly="true"
                                                value={FactoryID}
                                                onChange={FactoryIDChange}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Factory Code <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Factory Code"
                                                value={FactoryCode}
                                                onChange={(event) => {
                                                    setFactoryCode(event.target.value)
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Factory Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Factory Name"
                                                value={FactoryName}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setFactoryName(value)
                                                }}

                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Factory Address <span style={{ color: "red" }}>*</span></CLabel>
                                            <CTextarea
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Factory Address"
                                                value={FactoryAddress}
                                                onChange={FactoryAddressChange}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Factory City <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Factory City"
                                                value={FactoryCity}
                                                onChange={(event) => {
                                                    setFactoryCity(event.target.value);
                                                }}
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
                        <CCardHeader>View Factory</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={FactoryData}
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
                                                    EditFactory(
                                                        item.FACTORY_PKID,
                                                        item.FACTORY_CODE,
                                                        item.FACTORY_NAME,
                                                        item.FACTORY_ADDRESS,
                                                        item.FACTORY_CITY,
                                                    );
                                                }}
                                                id="war-btn"
                                            >
                                                <EditIcon />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    DeleteFactory(item.FACTORY_PKID);
                                                }}
                                                id="war-btn1"
                                            >
                                                <DeleteSharpIcon />
                                            </CButton>
                                        </td>
                                    ),
                                    "Address": (i) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewServiceCategory(i.FACTORY_ADDRESS);
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
            <CModal show={block} onClose={() => setBlock(!block)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Factory Address</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Factory Address</CLabel>
                                    <CTextarea
                                        id="text-input"
                                        name="text-input"
                                        value={ModalData}
                                        readOnly={true}
                                    />
                                </CCol>
                            </CFormGroup>
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

export default ManageFactory;
