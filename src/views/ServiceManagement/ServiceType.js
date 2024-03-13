/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-07 17:32:50
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-02-11 18:55:47
 */
/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
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
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import Swal from "sweetalert2";
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import "../../style.css";
import { reset } from "enzyme/build/configuration";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Action" },
    { key: "Service Category" },
    { key: "Service Type Name" },
    { key: "Service Code" },
    { key: "Surcharge (%)" },
];

const fields = [
    { key: "SL No" },
    { key: "Category Name" },
];

const ServiceType = () => {
    const history = useHistory();
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);

    const [pkid, setpkid] = useState();
    const [ServiceTypeName, setServiceTypeName] = useState();
    const [ServiceCode, setServiceCode] = useState();
    const [Surcharge, setSurcharge] = useState();

    const [SelectedList, setSelectedList] = useState('');
    const [ServiceCategoryData, setServiceCategoryData] = useState([]);

    const [block, setBlock] = useState(false);
    const [InnerTableData, setInnerTableData] = useState([]);
    const [TableData, setTableData] = useState([]);

    const setSelectedServiceCategory = (val) => {
        setSelectedList(val)
    }

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

    const getServiceCategory = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "ServiceCategoryFroDropDown").then((response) => {
            if (response.data.length > 0) {
                setServiceCategoryData(response.data);
                document.getElementById("divLoading").className = "hide";
            }
            else {
                setServiceCategoryData([]);
                document.getElementById("divLoading").className = "hide";
            }
            document.getElementById("divLoading").className = "hide";
        })
            .catch((error) => {
                console.log(error);
            });
    }

    const AddServiceType = () => {
        if (SelectedList.length == 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Atleast One Service Category!",
            });
        }
        else if (ServiceTypeName == "" || ServiceTypeName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Service Type Name!",
            });
        }
        else if (ServiceCode == "" || ServiceCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Service Code!",
            });
        }
        else if (Surcharge == "" || Surcharge == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Surcharge (%)!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            const obj = {
                SERVICE_TYPE_NAME: ServiceTypeName,
                SERVICE_TYPE_CODE: ServiceCode,
                SERVICE_TYPE_SURCHARGE: Surcharge,
                ServiceTypeCategory: SelectedList
            };
            axios.post(MyApiUrl + "ServiceType", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Service Type Added!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    Reset();
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Service Type Failed To Add!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else {
                    Swal.fire({
                        title: "Already Exist!",
                        icon: "info",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });
        }
    };

    const EditServiceType = (id, name, code, surcharge, EMPList) => {
        setpkid(id);
        setServiceTypeName(name);
        setServiceCode(code);
        setSurcharge(surcharge);
        setSelectedList('' + EMPList + '');
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);
    };

    const UpdateServiceType = () => {
        if (SelectedList.length == 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Atleast One Service Category!",
            });
        }
        else if (ServiceTypeName == "" || ServiceTypeName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Service Type Name!",
            });
        }
        else if (ServiceCode == "" || ServiceCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Service Code!",
            });
        }
        else if (Surcharge == "" || Surcharge == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Surcharge (%)!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            const obj = {
                SERVICE_TYPE_NAME: ServiceTypeName,
                SERVICE_TYPE_CODE: ServiceCode,
                SERVICE_TYPE_SURCHARGE: Surcharge,
                ServiceTypeCategory: SelectedList
            };
            axios.put(MyApiUrl + "ServiceType/" + pkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Service Type Details Updated!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    Reset();
                    document.getElementById("divLoading").className = "hide";
                } else {
                    Swal.fire({
                        title: "Failed To Update!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });
        }
    };

    const DeleteServiceType = (id) => {
        document.getElementById("divLoading").className = "show";
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "ServiceType/" + id + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected Service Type Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete Service Type!",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        document.getElementById("divLoading").className = "hide";
                    }
                })
        }
    };


    const GetServiceType = React.useCallback(() => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "ServiceType")
            .then((response) => {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "Service Type Name": item.SERVICE_TYPE_NAME,
                        "Service Code": item.SERVICE_TYPE_CODE,
                        "Surcharge (%)": item.SERVICE_TYPE_SURCHARGE,
                    };
                });
                setTableData(items);
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const Reset = () => {
        getServiceCategory();
        GetServiceType();
        setpkid("");
        setServiceTypeName("");
        setServiceCode("");
        setSurcharge("");
        setSelectedList("");
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }

    const Updatebtn = () => (
        <CButton type="button" onClick={UpdateServiceType} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddServiceType} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
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

    const ViewServiceCategory = (list) => {
        console.log(list);
        var cnt = 0;
        const items = list.map((item) => {
            cnt++;
            return {
                ...item,
                "SL No": cnt,
                "Category Name": item.SERVICE_CATEGORY_NAME,
            };
        });
        setInnerTableData(items);
        setBlock(!block);
    }

    React.useEffect(() => {
        getServiceCategory();
        GetServiceType();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }, []);

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
            <h1 id="ccmaster">Manage Service Type</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="12" lg="4">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Add/Update Service Type</CCardHeader>
                        <CCardBody>
                            <CForm
                                action=""
                                method="post"
                                encType="multipart/form-data"
                                className="form-horizontal"
                            >
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Service Category <span style={{ color: "red" }}>*</span></CLabel>
                                        <MultiSelect
                                            defaultValue={SelectedList}
                                            onChange={setSelectedServiceCategory}
                                            options={ServiceCategoryData}
                                        />
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Service Type Name <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInput
                                            id="text-input1"
                                            name="text-input"
                                            placeholder="Enter Service Type Name"
                                            value={ServiceTypeName}
                                            onChange={(event) => {
                                                let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                value = value.replace(/\w+/g,
                                                    function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setServiceTypeName(value)
                                            }}
                                        />
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Service Code <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInput
                                            id="text-input1"
                                            name="text-input"
                                            placeholder="Enter Service Code"
                                            value={ServiceCode}
                                            onChange={(event) => {
                                                setServiceCode(event.target.value);
                                            }}
                                        />
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Surcharge (%) <span style={{ color: "red" }}>*</span></CLabel>
                                        <CInput
                                            id="text-input1"
                                            name="text-input"
                                            placeholder="Enter Surcharge (%)"
                                            value={Surcharge}
                                            onChange={(event) => {
                                                let value = event.target.value;
                                                value = value.replace(/[^0-9-]/gi, "");
                                                setSurcharge(value);
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
                </CCol>
                <CCol md="12" lg="8">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>View Service Type</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={TableData}
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
                                                    EditServiceType(
                                                        item.SERVICE_TYPE_PKID,
                                                        item.SERVICE_TYPE_NAME,
                                                        item.SERVICE_TYPE_CODE,
                                                        item.SERVICE_TYPE_SURCHARGE,
                                                        item.CATEGORY_LIST,
                                                    );
                                                }}
                                                id="war-btn"
                                            >
                                                <EditIcon />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    DeleteServiceType(item.SERVICE_TYPE_PKID);
                                                }}
                                                id="war-btn1"
                                            >
                                                <DeleteSharpIcon />
                                            </CButton>
                                        </td>
                                    ),
                                    "Service Category": (i) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewServiceCategory(i.SERVICE_TYPE_CATEGORY);
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

export default ServiceType;