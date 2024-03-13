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
    CRow,
    CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import ReactSwitch from 'react-switch';
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Action" },
    { key: "Category Name" },
    { key: "Short Code" },
    { key: "HSN Code" },
    { key: "CGST (%)" },
    { key: "SGST (%)" },
    { key: "Based on Count" },
];

const ServiceCategory = () => {
    const history = useHistory();

    const [CategoryName, setCategoryName] = useState("");
    const [ShortCode, setShortCode] = useState("");
    const [HSNCode, setHSNCode] = useState("");
    const [CategoryPkid, setCategoryPkid] = useState("");
    const [CGST, setCGST] = useState("");
    const [SGST, setSGST] = useState("");
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);
    const [ServiceCategoryData, setServiceCategoryData] = useState([]);
    const [CountBased, setCountBased] = useState(false);


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
    const getServiceCategory = async () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "ServiceCategory").then((response) => {
            if (response.data.length > 0) {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "Category Name": item.SERVICE_CATEGORY_NAME,
                        "Short Code": item.SERVICE_CATEGORY_CODE,
                        "HSN Code": item.SERVICE_CATEGORY_HSN === "" || item.SERVICE_CATEGORY_HSN === null ? "-" : item.SERVICE_CATEGORY_HSN,
                        "CGST (%)": item.SERVICE_CATEGORY_CGST,
                        "SGST (%)": item.SERVICE_CATEGORY_SGST,
                        "Based on Count": item.SERVICE_CATEGORY_ORDER_COUNT,
                    };
                });
                setServiceCategoryData(items);
                document.getElementById("divLoading").className = "hide";
            }
            else {
                setServiceCategoryData([]);
                document.getElementById("divLoading").className = "hide";
            }
        });
    };
    React.useEffect(() => {
        getServiceCategory();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }, []);

    const AddServiceCategory = () => {
        if (CategoryName === "" || CategoryName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Category Name!",
            });
        } else if (ShortCode === "" || ShortCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Short Code!",
            });
        } else if (CGST === "" || CGST == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter CGST (%)!",
            });
        } else if (SGST === "" || SGST == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter SGST (%)!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                SERVICE_CATEGORY_NAME: CategoryName,
                SERVICE_CATEGORY_CODE: ShortCode,
                SERVICE_CATEGORY_HSN: HSNCode,
                SERVICE_CATEGORY_CGST: CGST,
                SERVICE_CATEGORY_SGST: SGST,
                SERVICE_CATEGORY_ORDER_COUNT: CountBased,
            };
            axios.post(MyApiUrl + "ServiceCategory", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "Service Category Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "Service Category Added!",
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

    const EditServiceCategory = (pkid, categorycame, shortcode, hsncode, cgst, sgst, count) => {
        setCategoryPkid(pkid);
        setCategoryName(categorycame);
        setShortCode(shortcode);
        setHSNCode(hsncode);
        setCGST(cgst);
        setSGST(sgst);
        setCountBased(count);
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);
    }

    const DeleteServiceCategory = (pkid) => {
        document.getElementById("divLoading").className = "show";
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "ServiceCategory/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected Service Category Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete Service Category!",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        document.getElementById("divLoading").className = "hide";
                    }
                })
        }
    };


    const UpdateServiceCategory = () => {
        if (CategoryName === "" || CategoryName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Category Name!",
            });
        } else if (ShortCode === "" || ShortCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Short Code!",
            });
        } else if (CGST === "" || CGST == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter CGST (%)!",
            });
        } else if (SGST === "" || SGST == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter SGST (%)!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                SERVICE_CATEGORY_NAME: CategoryName,
                SERVICE_CATEGORY_CODE: ShortCode,
                SERVICE_CATEGORY_HSN: HSNCode,
                SERVICE_CATEGORY_CGST: CGST,
                SERVICE_CATEGORY_SGST: SGST,
                SERVICE_CATEGORY_ORDER_COUNT: CountBased,
            };
            axios.put(MyApiUrl + "ServiceCategory/" + CategoryPkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Service Category Updated!",
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
        <CButton type="button" onClick={UpdateServiceCategory} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddServiceCategory} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
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
        getServiceCategory();
        setCategoryPkid("");
        setCategoryName("");
        setShortCode("");
        setHSNCode("");
        setCGST("");
        setSGST("");
        setCountBased(false);
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
            <h1 id="ccmaster">Manage Service Category</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="12" lg="4">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add/Update Service Category</CCardHeader>
                            <CCardBody>
                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Category Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Category Name"
                                                value={CategoryName}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); });
                                                    setCategoryName(value)
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Short Code <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Short Code"
                                                value={ShortCode}
                                                onChange={(event) => {
                                                    setShortCode(event.target.value);
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>HSN Code</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter HSN Code"
                                                value={HSNCode}
                                                onChange={(event) => {
                                                    setHSNCode(event.target.value);
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>CGST (%) <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter CGST (%)"
                                                value={CGST}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, "");
                                                    setCGST(value);
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>SGST (%) <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter SGST (%)"
                                                value={SGST}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, "");
                                                    setSGST(value);
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel htmlFor="">Count Based</CLabel>
                                            <div>
                                                <ReactSwitch
                                                    checked={CountBased}
                                                    onChange={(event) => {
                                                        setCountBased(event);
                                                    }}
                                                />
                                            </div>
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
                    <div id="country-table">
                        <CCard id="Loccard" style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>View Service Category</CCardHeader>
                            <CCardBody>
                                <CDataTable
                                    items={ServiceCategoryData}
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
                                                        EditServiceCategory(
                                                            item.SERVICE_CATEGORY_PKID,
                                                            item.SERVICE_CATEGORY_NAME,
                                                            item.SERVICE_CATEGORY_CODE,
                                                            item.SERVICE_CATEGORY_HSN,
                                                            item.SERVICE_CATEGORY_CGST,
                                                            item.SERVICE_CATEGORY_SGST,
                                                            item.SERVICE_CATEGORY_ORDER_COUNT,
                                                        );
                                                    }}
                                                    id="war-btn"
                                                >
                                                    <EditIcon />
                                                </CButton>
                                                <CButton
                                                    size="sm"
                                                    onClick={() => {
                                                        DeleteServiceCategory(item.SERVICE_CATEGORY_PKID);
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
                    </div>
                </CCol>
            </CRow>
        </div>
    );
};

export default ServiceCategory;
