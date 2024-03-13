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
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Action" },
    { key: "Factory" },
    { key: "Staff Name" },
    { key: "Staff UserName" },
    { key: "Staff Email" },
    { key: "Staff Password" },

];

const fields = [
    { key: "SL No" },
    { key: "Factory Name" },
    { key: "Factory ID" },
    { key: "Factory Code" },
    { key: "Factory City" },
    { key: "Factory Address" },
];

const ManageFactoryStaff = () => {
    const history = useHistory();

    const [SelectedList, setSelectedList] = useState('');
    const [FactoryData, setFactoryData] = useState([]);

    const [FactoryStaffData, setFactoryStaffData] = useState([]);
    const [FactoryStaffName, setFactoryStaffName] = useState("");
    const [FactoryStaffPkid, setFactoryStaffPkid] = useState("");
    const [FactoryStaffUName, setFactoryStaffUName] = useState("");
    const [FactoryStaffEmail, setFactoryStaffEmail] = useState("");
    const [FactoryStaffPass, setFactoryStaffPass] = useState("Laundrexx!");
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);
    const [block, setBlock] = useState(false);
    const [InnerTableData, setInnerTableData] = useState([]);

    const setSelectedFactory = (val) => {
        setSelectedList(val)
    }

    const FactoryPasswordChange = (event) => {
        setFactoryStaffPass(event.target.value);
    };

    const FactoryEmailChange = (event) => {
        setFactoryStaffEmail(event.target.value);
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


    const GetFactory = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "FactoryForDropDown").then((response) => {
            if (response.data.length > 0) {
                setFactoryData(response.data);
                document.getElementById("divLoading").className = "hide";
            }
            else {
                setFactoryData([]);
                document.getElementById("divLoading").className = "hide";
            }
            document.getElementById("divLoading").className = "hide";
        })
            .catch((error) => {
                console.log(error);
            });
    }

    const ViewFactory = (list) => {
        var cnt = 0;
        const items = list.map((item) => {
            cnt++;
            return {
                ...item,
                "SL No": cnt,
                "Factory Name": item.FACTORY_NAME,
                "Factory ID": item.FACTORY_ID,
                "Factory Code": item.FACTORY_CODE,
                "Factory City": item.FACTORY_CITY,
                "Factory Address": item.FACTORY_ADDRESS,
            };
        });
        setInnerTableData(items);
        setBlock(!block);
    }

    const GetAllFactoryStaff = async () => {
        document.getElementById("divLoading").className = "show";
        await axios({
            method: "GET",
            url: MyApiUrl + "FactoryStaff",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "Staff Name": item.FACTORY_STAFF_NAME,
                        "Staff UserName": item.FACTORY_STAFF_USER_NAME,
                        "Staff Email": item.FACTORY_STAFF_EMAIL === "" || item.FACTORY_STAFF_EMAIL === null ? "-" : item.FACTORY_STAFF_EMAIL,
                        "Staff Password": item.FACTORY_STAFF_PASSWORD,
                    };
                });
                setFactoryStaffData(items)
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    };

    React.useEffect(() => {
        GetAllFactoryStaff();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
        GetFactory();
    }, []);


    const AddFactory = () => {
        if (SelectedList.length == 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Atleast One Factory!",
            });
        }
        else if (FactoryStaffName === "" || FactoryStaffName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Staff Name!",
            });
        } else if (FactoryStaffUName === "" || FactoryStaffUName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory User Name!",
            });
        } else if (FactoryStaffPass === "" || FactoryStaffPass == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Staff Password!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                FACTORY_STAFF_NAME: FactoryStaffName,
                FACTORY_STAFF_USER_NAME: FactoryStaffUName,
                FACTORY_STAFF_EMAIL: FactoryStaffEmail,
                FACTORY_STAFF_PASSWORD: FactoryStaffPass,
                Factory: SelectedList,
            };
            axios.post(MyApiUrl + "FactoryStaff", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "Factory Staff Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "Factory Staff Details Added!",
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

    const EditFactory = (pkid, Staffname, StaffUname, StaffEmail, StaffPass, FactoryTypeList) => {
        setFactoryStaffPkid(pkid);
        setFactoryStaffName(Staffname);
        setFactoryStaffUName(StaffUname);
        setFactoryStaffEmail(StaffEmail);
        setFactoryStaffPass(StaffPass);
        setSelectedList('' + FactoryTypeList + '');
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);
    }

    const DeleteFactory = (pkid) => {
        axios({
            method: "DELETE",
            url: MyApiUrl + "FactoryStaff/" + pkid + "",
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
                    document.getElementById("divLoading").className = "hide";
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const UpdateFactory = () => {
        if (SelectedList.length == 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Atleast One Factory!",
            });
        }
        else if (FactoryStaffName === "" || FactoryStaffName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Staff Name!",
            });
        } else if (FactoryStaffUName === "" || FactoryStaffUName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory User Name!",
            });
        } else if (FactoryStaffPass === "" || FactoryStaffPass == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Factory Staff Password!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                FACTORY_STAFF_NAME: FactoryStaffName,
                FACTORY_STAFF_USER_NAME: FactoryStaffUName,
                FACTORY_STAFF_EMAIL: FactoryStaffEmail,
                FACTORY_STAFF_PASSWORD: FactoryStaffPass,
                Factory: SelectedList,
            };
            axios.put(MyApiUrl + "FactoryStaff/" + FactoryStaffPkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Factory Staff Updated!",
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
        setFactoryStaffPkid("");
        setFactoryStaffName("");
        setFactoryStaffUName("");
        setFactoryStaffEmail("");
        setFactoryStaffPass("Laundrexx!");
        setSelectedList("");
        GetAllFactoryStaff();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
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
            <h1 id="ccmaster">Manage Factory Staff</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="4">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Add/Update Factory Staff</CCardHeader>
                        <CCardBody>

                            <CForm
                                action=""
                                method="post"
                                encType="multipart/form-data"
                                className="form-horizontal"
                            >
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Select Factory <span style={{ color: "red" }}>*</span></CLabel>
                                        <MultiSelect
                                            defaultValue={SelectedList}
                                            onChange={setSelectedFactory}
                                            options={FactoryData}
                                        />

                                    </CCol>
                                </CFormGroup>

                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Factory Staff Name <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInput
                                            id="text-input"
                                            name="text-input"
                                            placeholder="Enter Factory Staff Name"
                                            value={FactoryStaffName}
                                            onChange={(event) => {
                                                setFactoryStaffName(event.target.value)
                                            }}
                                        />
                                    </CCol>
                                </CFormGroup>

                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Factory Staff UserName <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInput
                                            id="text-input"
                                            name="text-input"
                                            placeholder="Enter Factory Staff UserName"
                                            value={FactoryStaffUName}
                                            onChange={(event) => {
                                                setFactoryStaffUName(event.target.value)
                                            }}
                                        />
                                    </CCol>
                                </CFormGroup>

                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Factory Staff Email</CLabel>
                                        <CInput
                                            id="text-input"
                                            name="text-input"
                                            placeholder="Enter Factory Staff Email"
                                            value={FactoryStaffEmail}
                                            onChange={FactoryEmailChange}
                                        />
                                    </CCol>
                                </CFormGroup>

                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Factory Staff Password <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInput
                                            id="text-input"
                                            name="text-input"
                                            placeholder="Enter Factory Staff Password"
                                            value={FactoryStaffPass}
                                            onChange={FactoryPasswordChange}
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
                </CCol>
                <CCol md="12" lg="8">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>View Factory Staff</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={FactoryStaffData}
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
                                                        item.FACTORY_STAFF_PKID,
                                                        item.FACTORY_STAFF_NAME,
                                                        item.FACTORY_STAFF_USER_NAME,
                                                        item.FACTORY_STAFF_EMAIL,
                                                        item.FACTORY_STAFF_PASSWORD,
                                                        item.FACTORY_LIST,
                                                    );
                                                }}
                                                id="war-btn"
                                            >
                                                <EditIcon />
                                                {item.status}
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    DeleteFactory(item.FACTORY_STAFF_PKID);
                                                }}
                                                id="war-btn1"
                                            >
                                                <DeleteSharpIcon />
                                                {item.status}
                                            </CButton>
                                        </td>
                                    ),
                                    "Factory": (i) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewFactory(i.FACTORY);
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
                    <CModalTitle>Service Category Under This Service Type</CModalTitle>
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

export default ManageFactoryStaff;
