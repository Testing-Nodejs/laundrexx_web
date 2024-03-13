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
    CDropdownDivider,
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
    { key: "Pickup Code" },
    { key: "Pickup Time" },
    { key: "Created Date" },
    { key: "Created By" },
    { key: "Quantity" },
    { key: "Pickup Address" },
    { key: "Bulk Item" },
    { key: "Door Delivery" },
    { key: "Customer Details" },


];


const ManagePickUp = () => {
    const UserID = sessionStorage.getItem("UserID");
    const Manager = sessionStorage.getItem("SessionType");
    const [PickupData, setPickupData] = useState([]);
    const [CustomerData, setCustomerData] = useState([]);
    const [CustomerType, setCustomerType] = useState("");
    const [PickupAddress, setPickupAddress] = useState([]);
    const [block, setBlock] = useState(false);
    const [block1, setBlock1] = useState(false);
    const [fromDate, setfromDate] = useState("");
    const [toDate, settoDate] = useState("");
    const [dates, setDates] = useState(false);
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



    const FilterData = () => {
        if (Manager == "Manager") {
            var Fdate = fromDate == "" || fromDate == null ? "-" : fromDate;
            var Todate = toDate == "" || toDate == null ? "-" : toDate;
            if (Fdate === "-") {
                axios({
                    method: "GET",
                    url: MyApiUrl + "GetAllManagerPickupsFilter/" + Fdate + "/" + Todate + "/" + UserID + "",
                    headers: {
                        "content-type": "application/json",
                    },
                })
                    .then((response) => {
                        const items = response.data.map((item, index) => {
                            return {
                                ...item,
                                "Sl No.": index + 1,
                                "Pickup Code": item.PICKUP_CODE,
                                "Pickup Time": item.PICKUP_TIME,
                                "Created Date": SplitDate(item.PICKUP_DATE),
                                "Created By": item.PICKUP_CREATED_BY,
                                "Quantity": item.PICKUP_QUANTITY,
                                "Bulk Item": item.PICKUP_BULK_ITEMS === "true" || item.PICKUP_BULK_ITEMS === true ? "Yes" : "No",
                                "Door Delivery": item.PICKUP_DOOR_DELIVERY === "true" || item.PICKUP_DOOR_DELIVERY === true ? "Yes" : "No",
                            };
                        });
                        setPickupData(items)
                        document.getElementById("divLoading").className = "hide";
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            } else {
                if (Todate === "-") {
                    Toast.fire({
                        icon: "warning",
                        title: "Please Select To Date!",
                    });
                } else {
                    axios({
                        method: "GET",
                        url: MyApiUrl + "AdminPickupFilter/" + fromDate + "/" + toDate + "",
                        headers: {
                            "content-type": "application/json",
                        },
                    })
                        .then((response) => {
                            const items = response.data.map((item, index) => {
                                return {
                                    ...item,
                                    "Sl No.": index + 1,
                                    "Pickup Code": item.PICKUP_CODE,
                                    "Pickup Time": item.PICKUP_TIME,
                                    "Created Date": SplitDate(item.PICKUP_DATE),
                                    "Created By": item.PICKUP_CREATED_BY,
                                    "Quantity": item.PICKUP_QUANTITY,
                                    "Bulk Item": item.PICKUP_BULK_ITEMS === "true" || item.PICKUP_BULK_ITEMS === true ? "Yes" : "No",
                                    "Door Delivery": item.PICKUP_DOOR_DELIVERY === "true" || item.PICKUP_DOOR_DELIVERY === true ? "Yes" : "No",
                                };
                            });
                            setPickupData(items)
                            document.getElementById("divLoading").className = "hide";
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }

            }
        } else {
            if (Fdate === "-") {
                axios({
                    method: "GET",
                    url: MyApiUrl + "AdminPickupFilter/" + Fdate + "/" + Todate + "",
                    headers: {
                        "content-type": "application/json",
                    },
                })
                    .then((response) => {
                        const items = response.data.map((item, index) => {
                            return {
                                ...item,
                                "Sl No.": index + 1,
                                "Pickup Code": item.PICKUP_CODE,
                                "Pickup Time": item.PICKUP_TIME,
                                "Created Date": SplitDate(item.PICKUP_DATE),
                                "Created By": item.PICKUP_CREATED_BY,
                                "Quantity": item.PICKUP_QUANTITY,
                                "Bulk Item": item.PICKUP_BULK_ITEMS === "true" || item.PICKUP_BULK_ITEMS === true ? "Yes" : "No",
                                "Door Delivery": item.PICKUP_DOOR_DELIVERY === "true" || item.PICKUP_DOOR_DELIVERY === true ? "Yes" : "No",
                            };
                        });
                        setPickupData(items)
                        document.getElementById("divLoading").className = "hide";
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            } else {
                if (Todate === "-") {
                    Toast.fire({
                        icon: "warning",
                        title: "Please Select To Date!",
                    });
                } else {
                    axios({
                        method: "GET",
                        url: MyApiUrl + "AdminPickupFilter/" + fromDate + "/" + toDate + "",
                        headers: {
                            "content-type": "application/json",
                        },
                    })
                        .then((response) => {
                            const items = response.data.map((item, index) => {
                                return {
                                    ...item,
                                    "Sl No.": index + 1,
                                    "Pickup Code": item.PICKUP_CODE,
                                    "Pickup Time": item.PICKUP_TIME,
                                    "Created Date": SplitDate(item.PICKUP_DATE),
                                    "Created By": item.PICKUP_CREATED_BY,
                                    "Quantity": item.PICKUP_QUANTITY,
                                    "Bulk Item": item.PICKUP_BULK_ITEMS === "true" || item.PICKUP_BULK_ITEMS === true ? "Yes" : "No",
                                    "Door Delivery": item.PICKUP_DOOR_DELIVERY === "true" || item.PICKUP_DOOR_DELIVERY === true ? "Yes" : "No",
                                };
                            });
                            setPickupData(items)
                            document.getElementById("divLoading").className = "hide";
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }

            }
        }
    }

    const FilterReset = () => {
        GetAllPickup();
        setfromDate("");
        settoDate("");
        setDates(false);
    };


    const GetAllPickup = async () => {
        document.getElementById("divLoading").className = "show";
        if (Manager == "Manager") {
            await axios({
                method: "GET",
                url: MyApiUrl + "ManagerViewPickup/" + UserID + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Pickup Code": item.PICKUP_CODE,
                            "Pickup Time": item.PICKUP_TIME,
                            "Created Date": SplitDate(item.PICKUP_DATE),
                            "Created By": item.PICKUP_CREATED_BY,
                            "Quantity": item.PICKUP_QUANTITY,
                            "Bulk Item": item.PICKUP_BULK_ITEMS === "true" || item.PICKUP_BULK_ITEMS === true ? "Yes" : "No",
                            "Door Delivery": item.PICKUP_DOOR_DELIVERY === "true" || item.PICKUP_DOOR_DELIVERY === true ? "Yes" : "No",
                        };
                    });
                    setPickupData(items)
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            await axios({
                method: "GET",
                url: MyApiUrl + "AdminPickup",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Pickup Code": item.PICKUP_CODE,
                            "Pickup Time": item.PICKUP_TIME,
                            "Created Date": SplitDate(item.PICKUP_DATE),
                            "Created By": item.PICKUP_CREATED_BY,
                            "Quantity": item.PICKUP_QUANTITY,
                            "Bulk Item": item.PICKUP_BULK_ITEMS === "true" || item.PICKUP_BULK_ITEMS === true ? "Yes" : "No",
                            "Door Delivery": item.PICKUP_DOOR_DELIVERY === "true" || item.PICKUP_DOOR_DELIVERY === true ? "Yes" : "No",
                        };
                    });
                    setPickupData(items)
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const ViewAddress = (i) => {
        setBlock(!block);
        setPickupAddress(i);
    };

    const ViewCustomerDetails = (pickupid, customerid) => {
        setCustomerType(customerid);
        console.log(pickupid);
        console.log(customerid);
        axios({
            method: "GET",
            url: MyApiUrl + "GetPickupCustomerDetails/" + pickupid + "/" + customerid + "",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                console.log(response.data)
                setCustomerData(response.data);
                setBlock1(!block1);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', { month: 'long' });
    }

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + " " + getMonthName(OrderDates[1]) + ", " + OrderDates[0];
        return FinalDate;
    }


    React.useEffect(() => {
        GetAllPickup();
    }, []);



    const DeletePickup = (pkid) => {
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            document.getElementById("divLoading").className = "show";
            axios({
                method: "DELETE",
                url: MyApiUrl + "Pickup/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected PickUp Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete PickUp!",
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

    }


    const Reset = () => {
        GetAllPickup();
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
            <h1 id="ccmaster">Manage Pickup</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol col="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardBody>
                            <CRow>
                                <CCol md="1"></CCol>
                                <CCol md="3">
                                    <CLabel>From Date</CLabel>
                                    <CInput
                                        type="date"
                                        onChange={(event) => {
                                            setfromDate(event.target.value);
                                        }}
                                        value={fromDate}
                                    />
                                </CCol>
                                <CCol md="3">
                                    <CLabel>To Date</CLabel>
                                    <CInput
                                        type="date"
                                        onChange={(event) => {
                                            settoDate(event.target.value);
                                        }}
                                        value={toDate}
                                    />
                                </CCol>
                                <CCol md="2">
                                    <CButton
                                        size="sm"
                                        color="info"
                                        style={{ marginTop: "28px", width: "100%" }}
                                        onClick={FilterData}
                                    >
                                        Filter
                                    </CButton>
                                </CCol>
                                <CCol md="2">
                                    <CButton
                                        size="sm"
                                        color="danger"
                                        style={{ marginTop: "28px", width: "100%" }}
                                        onClick={FilterReset}
                                    >
                                        Reset
                                    </CButton>
                                </CCol>
                                <CCol md="1"></CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "3%", }}>

                <CCol md="12" lg="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>
                            <div style={{ float: 'left' }}>Manage Pickups</div>
                            <div style={{ float: 'right' }}>
                                <CLink to="/AddPickup">
                                    <CButton size="sm" className="btn btn-success" style={{ marginBottom: 0, marginTop: 0 }}>
                                        Create New Pickup
                                    </CButton>
                                </CLink>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={PickupData}
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
                                                    history.push("/EditPickup", {
                                                        data: item,
                                                    })
                                                }>
                                                <EditIcon />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    DeletePickup(item.PICKUP_PKID);
                                                }}
                                                id="war-btn1"
                                            >
                                                <DeleteSharpIcon />
                                            </CButton>
                                        </td>
                                    ),
                                    "Pickup Address": (item) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewAddress(item.PICKUP_ADDRESS);
                                                }}
                                            >
                                                View
                                            </CButton>
                                        </td>
                                    ),

                                    "Customer Details": (item) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewCustomerDetails(item.PICKUP_PKID, item.PICKUP_CUSTOMER_FKID);
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
                    <CModalTitle>Pickup Address</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Pickup Address</CLabel>
                                    <CTextarea
                                        id="text-input"
                                        name="text-input"
                                        value={PickupAddress}
                                        readOnly={true}
                                    />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setBlock(!block)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal show={block1} onClose={() => setBlock1(!block1)} color="dark" style={{ height: 480 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Customer Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        {CustomerData.length > 0 ?
                            <CCol md="12">
                                {CustomerType === "0" || CustomerType === 0 ?
                                    <div>
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].PICKUP_CUSTOMER_NAME}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Contact No.</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].PICKUP_CUSTOMER_PHONE}</span>
                                            </CCol>
                                        </CFormGroup>
                                    </div>
                                    : <div>
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_NAME}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Contact No.</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_CONTACT_NUMBER}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Email</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_EMAIL}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer GST No</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_GST_NUMBER === "" || CustomerData[0].CUSTOMER_GST_NUMBER === null ? "-" : CustomerData[0].CUSTOMER_GST_NUMBER}</span>
                                            </CCol>
                                        </CFormGroup>
                                    </div>}

                            </CCol>
                            :
                            null}
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setBlock1(!block1)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ManagePickUp;
