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
    { key: "Service Category" },
    { key: "Service Type" },
    { key: "No of Due Dates" },
];

const DueDateMaster = () => {
    const history = useHistory();

    const [ServiceTypeData, setServiceTypeData] = useState();
    const [ServiceCategoryData, setServiceCatData] = useState();
    const [DueDateData, setDueDateData] = useState([]);
    const [ServiceCat, setServiceCat] = useState("");
    const [ServiceType, setServiceType] = useState("");
    const [DueDatePkid, setDueDatePkid] = useState("");
    const [DueDate, setDueDate] = useState("");
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);

    const ServiceTypeChange = (event) => {
        setServiceType(event.target.value);
    };

    const ServiceCategoryChange = (event) => {
        setServiceCat(event.target.value);
        GetServiceType(event.target.value);
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

    const GetAllDueDate = async () => {
        // document.getElementById("divLoading").className = "show";
        await axios({
            method: "GET",
            url: MyApiUrl + "DueDates",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "Service Category": item.SERVICE_CATEGORY_NAME,
                        "Service Type": item.SERVICE_TYPE_NAME,
                        "No of Due Dates": item.DUE_DATE_NO_OF_DAYS,
                    };
                });
                setDueDateData(items)
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const GetServiceCat = React.useCallback(() => {
        axios.get(MyApiUrl + "ServiceCategory").then((response) => {
            console.log(response.data);
            const ServiceCatOption = response.data.map((item) => (
                <option value={item.SERVICE_CATEGORY_PKID}>{item.SERVICE_CATEGORY_NAME}</option>
            ));
            setServiceCatData(ServiceCatOption);

        });
    }, []);

    const GetServiceType = (CatId) => {
        axios.get(MyApiUrl + "ServiceTypeByCategory/" + CatId + "").then((response) => {
            console.log(response.data);
            const ServiceOption = response.data.map((item) => (
                <option value={item.SERVICE_TYPE_PKID}>{item.SERVICE_TYPE_NAME}</option>
            ));
            setServiceTypeData(ServiceOption);
        });
    };

    const UpdateGetServiceType = (CatId, Typeid) => {
        axios.get(MyApiUrl + "ServiceTypeByCategory/" + CatId + "").then((response) => {
            console.log(response.data);
            const ServiceOption = response.data.map((item) => (
                <option value={item.SERVICE_TYPE_PKID}>{item.SERVICE_TYPE_NAME}</option>
            ));
            setServiceTypeData(ServiceOption);
            setServiceType(Typeid);
        });
    };

    React.useEffect(() => {
        GetAllDueDate();
        GetServiceCat();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }, []);


    const AddDueDate = () => {
        if (ServiceCat === "-1") {
            Toast.fire({
                icon: "warning",
                title: "Please Select Service Category!",
            });
        } else if (ServiceType === "-1") {
            Toast.fire({
                icon: "warning",
                title: "Please Select service Type!",
            });
        } else if (DueDate === "" || DueDate == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter No Of Due Dates!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                DUE_DATE_SERVICE_CATEGORY_FKID: ServiceCat,
                DUE_DATE_SERVICE_TYPE_FKID: ServiceType,
                DUE_DATE_NO_OF_DAYS: DueDate,
            };
            axios.post(MyApiUrl + "DueDates", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "Due Date Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "Due Date Details Added!",
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

    const EditDueDate = (pkid, ServiceCat, Servicetype, Duedate) => {
        setDueDatePkid(pkid);
        setServiceCat(ServiceCat);
        setDueDate(Duedate);
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);
        UpdateGetServiceType(ServiceCat, Servicetype);
    }

    const DeleteDueDate = (pkid) => {
        document.getElementById("divLoading").className = "show";
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "DueDates/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected Due Date Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete Due Date!",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        document.getElementById("divLoading").className = "hide";
                    }
                })
        }
    };


    const UpdateDueDate = () => {
        if (ServiceCat === "-1") {
            Toast.fire({
                icon: "warning",
                title: "Please Select Service Category!",
            });
        } else if (ServiceType === "-1") {
            Toast.fire({
                icon: "warning",
                title: "Please Select service Type!",
            });
        } else if (DueDate === "" || DueDate == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter No Of Due Dates!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                DUE_DATE_SERVICE_CATEGORY_FKID: ServiceCat,
                DUE_DATE_SERVICE_TYPE_FKID: ServiceType,
                DUE_DATE_NO_OF_DAYS: DueDate,
            };
            axios.put(MyApiUrl + "DueDates/" + DueDatePkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Due Date Updated!",
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
        <CButton type="button" onClick={UpdateDueDate} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddDueDate} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
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
        setDueDatePkid("");
        setServiceCat("-1");
        setServiceType("-1");
        setDueDate("");
        GetAllDueDate();
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
            <h1 id="ccmaster">Manage Due Date</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="4">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add/Update Due Date</CCardHeader>
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
                                            <CSelect
                                                custom
                                                name="RouteCode"
                                                id="RouteCode"
                                                onChange={ServiceCategoryChange}
                                                value={ServiceCat}
                                            >
                                                <option value="-1">Select Service Category</option>
                                                {ServiceCategoryData}
                                            </CSelect>

                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Service Type <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="RouteCode"
                                                id="RouteCode"
                                                onChange={ServiceTypeChange}
                                                value={ServiceType}
                                            >
                                                <option value="-1">Select Service Type</option>
                                                {ServiceTypeData}
                                            </CSelect>

                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>No of due dates <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter No Of Due Dates"
                                                value={DueDate}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, ""); setDueDate(value)
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
                        <CCardHeader>View Due Date's</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={DueDateData}
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
                                                    EditDueDate(
                                                        item.DUE_DATE_PKID,
                                                        item.DUE_DATE_SERVICE_CATEGORY_FKID,
                                                        item.DUE_DATE_SERVICE_TYPE_FKID,
                                                        item.DUE_DATE_NO_OF_DAYS,
                                                    );
                                                }}
                                                id="war-btn"
                                            >
                                                <EditIcon />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    DeleteDueDate(item.DUE_DATE_PKID);
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

export default DueDateMaster;
