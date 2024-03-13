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
    { key: "Status" },
    { key: "Assign Pickup" },
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
    const [PickupData, setPickupData] = useState([]);
    const [PickupID, setPickupID] = useState("");
    const [PickupCode, setPickupCode] = useState("");
    const [PickupDate, setPickupDate] = useState("");
    const [PickupCreatedBy, setPickupCreatedBy] = useState("");
    const [CustomerData, setCustomerData] = useState([]);
    const [CustomerType, setCustomerType] = useState("");
    const [PickupAddress, setPickupAddress] = useState([]);
    const [block, setBlock] = useState(false);
    const [block1, setBlock1] = useState(false);
    const [block2, setBlock2] = useState(false);
    const [block3, setBlock3] = useState(false);
    const [fromDate, setfromDate] = useState("");
    const [toDate, settoDate] = useState("");
    const [dates, setDates] = useState(false);
    const [CreatedType, setCreatedType] = useState("-");
    const [Driver, setDriver] = useState("-1");
    const [DriverList, setDriverList] = useState([]);
    const [AssignedPickup, setAssignedPickup] = useState([]);
    const [PickupForEdit, setPickupForEdit] = useState({});

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

    const DriverChange = (event) => {
        setDriver(event.target.value);
    };

    const GetAllPickup = async () => {
        document.getElementById("divLoading").className = "show";
        await axios({
            method: "GET",
            url: MyApiUrl + "Pickup",
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
    };

    const FilterData = () => {
        if (CreatedType == "-") {
            var Fdate = fromDate == "" || fromDate == null ? "-" : fromDate;
            var Todate = toDate == "" || toDate == null ? "-" : toDate;
            if (Fdate === "-") {
                GetAllPickup();
            } else {
                if (Todate === "-") {
                    Toast.fire({
                        icon: "warning",
                        title: "Please Select To Date!",
                    });
                } else {
                    axios({
                        method: "GET",
                        url: MyApiUrl + "PickupFilter/" + CreatedType + "/" + fromDate + "/" + toDate + "",
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
                            setPickupData(items);
                            document.getElementById("divLoading").className = "hide";
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            }

        } else {
            var Fdate = fromDate == "" || fromDate == null ? "-" : fromDate;
            var Todate = toDate == "" || toDate == null ? "-" : toDate;

            if (Fdate === "-") {
                axios({
                    method: "GET",
                    url: MyApiUrl + "PickupFilter/" + CreatedType + "/" + Fdate + "/" + Todate + "",
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
                        url: MyApiUrl + "PickupFilter/" + CreatedType + "/" + fromDate + "/" + toDate + "",
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
                            setPickupData(items);
                            document.getElementById("divLoading").className = "hide";
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }

            }


        }
    }

    const ViewAddress = (i) => {
        setBlock(!block);
        setPickupAddress(i);
    };

    const AssignPickup = (List) => {

        setPickupID(List.PICKUP_PKID);
        setPickupCode(List.PICKUP_CODE);
        setPickupDate(List.PICKUP_DATE);
        setPickupCreatedBy(List.CUSTOMER_DETAILS[0].CUSTOMER_NAME);

        axios({
            method: "GET",
            url: MyApiUrl + "Drivers",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                if (response.data.length > 0) {
                    const DriverOption = response.data.map((item) => (
                        <option value={item.DRIVER_PKID}>{item.DRIVER_NAME}</option>
                    ));
                    setDriverList(DriverOption);
                    setDriver(List.PICKUP_DRIVER_FKID === 0 ? "-1" : List.PICKUP_DRIVER_FKID);
                    setBlock2(!block2);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const UpdatePickupDriver = () => {
        if (Driver === "-1") {
            Toast.fire({
                icon: "warning",
                title: "Please Select Driver!",
            });
        } else {
            axios.get(MyApiUrl + "AssignDriver/" + PickupID + "/" + Driver + "").then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Driver Assigned!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
                    setBlock2(!block2);

                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Assign!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });

        }
    }

    const ViewCustomerDetails = (item, id) => {
        setCustomerData(item)
        setCustomerType(id);
        setBlock1(!block1);

    }

    const ViewAssignPickup = (item) => {
        setAssignedPickup(item.DRIVER_DETAILS);
        setPickupForEdit(item);
        setBlock3(!block3);

    }

    const EditDriver = () => {
        setBlock3(false);
        setBlock2(!block2);
        AssignPickup(PickupForEdit);
    }

    const FilterReset = () => {
        GetAllPickup();
        setfromDate("");
        settoDate("");
        setDates(false);
        setCreatedType("-");
    };


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

    const Reset = () => {
        GetAllPickup();
        setDriver("-1");
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
            <h1 id="ccmaster">View Pickups</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol col="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardBody>
                            <CRow>
                                <CCol md="1"></CCol>
                                <CCol md="2">
                                    <CLabel>Pickup Created By</CLabel>
                                    <CSelect
                                        custom
                                        name="merchant"
                                        value={CreatedType}
                                        onChange={(event) => {
                                            setCreatedType(event.target.value);
                                        }}
                                        id="merchant"
                                    >
                                        <option value="-">All</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Customer">Customer</option>
                                    </CSelect>
                                </CCol>
                                <CCol md="2">
                                    <CLabel>From Date</CLabel>
                                    <CInput
                                        type="date"
                                        onChange={(event) => {
                                            setfromDate(event.target.value);
                                        }}
                                        value={fromDate}
                                    />
                                </CCol>
                                <CCol md="2">
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
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "3%", }}>

                <CCol md="12" lg="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>
                            <CRow>
                                <CCol col="6">View All Pickups</CCol>
                            </CRow>
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
                                                    ViewCustomerDetails(item.CUSTOMER_DETAILS, item.PICKUP_CUSTOMER_FKID);
                                                }}
                                            >
                                                View
                                            </CButton>
                                        </td>
                                    ),

                                    "Assign Pickup": (item) => (
                                        item.PICKUP_DRIVER_FKID === 0 || item.PICKUP_DRIVER_FKID === "0" ?
                                            <td>
                                                <CButton
                                                    className="btn btn-success"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={() => {
                                                        AssignPickup(item);
                                                    }}
                                                >
                                                    Assign
                                                </CButton>
                                            </td> :
                                            <td>
                                                <CButton
                                                    className="btn btn-primary"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={() => {
                                                        ViewAssignPickup(item);
                                                    }}
                                                >
                                                    View
                                                </CButton>
                                            </td>
                                    ),
                                    "Status": (i) => {
                                        if (i.PICKUP_STATUS === "0" || i.PICKUP_STATUS === 0) {
                                            return (
                                                <td>
                                                    <span className="pickup_zero">Pickup Created</span>
                                                </td>
                                            );
                                        } else if (i.PICKUP_STATUS === "1" || i.PICKUP_STATUS === 1) {
                                            return (
                                                <td>
                                                    <span className="pickup_one">Driver Assigned</span>
                                                </td>
                                            );
                                        } else if (i.PICKUP_STATUS === "2" || i.PICKUP_STATUS === 2) {
                                            return (
                                                <td>
                                                    <span className="pickup_two">Order Picked Up</span>
                                                </td>
                                            );
                                        }
                                        else if (i.PICKUP_STATUS === "3" || i.PICKUP_STATUS === 3) {
                                            return (
                                                <td>
                                                    <span className="pickup_three">HandOver To Outlet</span>
                                                </td>
                                            );
                                        }
                                    }
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

            <CModal show={block2} onClose={() => setBlock2(!block2)} color="dark" style={{ height: 380 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Assigned Pickup</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Code</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{PickupCode}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Created Date</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{PickupDate.split("T")[0]}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{PickupCreatedBy}</span>
                            </CCol>
                        </CFormGroup>
                    </div>
                    <CForm
                        action=""
                        method="post"
                        encType="multipart/form-data"
                        className="form-horizontal"
                    >
                        <CFormGroup row style={{ marginTop: "4%", borderTop: "1px solid #c9bbbb" }}>
                            <CCol xs="12" md="12" style={{ marginTop: "3%" }}>
                                <CLabel>Driver Name <span style={{ color: "red" }}>*</span></CLabel>
                                <CSelect
                                    custom
                                    name="FactoryType"
                                    id="FactoryType"
                                    onChange={DriverChange}
                                    value={Driver}
                                >
                                    <option value="-1">Select Driver</option>
                                    {DriverList}
                                </CSelect>
                            </CCol>
                        </CFormGroup>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CRow>
                        <CCol md="6">
                            <CButton className="btn btn-success" style={{ fontSize: "13px" }} onClick={() => UpdatePickupDriver()}>
                                Assign
                            </CButton>
                        </CCol>
                    </CRow>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setBlock2(!block2)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal show={block3} onClose={() => setBlock3(!block3)} color="dark" style={{ height: 380 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Assign Pickup</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            {AssignedPickup.length > 0 ?
                                <div>
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Name</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{AssignedPickup[0].DRIVER_NAME === "" || AssignedPickup[0].DRIVER_NAME === null ? "-" : AssignedPickup[0].DRIVER_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Username</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{AssignedPickup[0].DRIVER_USERNAME == "" || AssignedPickup[0].DRIVER_USERNAME == null ? "-" : AssignedPickup[0].DRIVER_USERNAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Contact No.</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{AssignedPickup[0].DRIVER_PHONE == "" || AssignedPickup[0].DRIVER_PHONE == null ? "-" : AssignedPickup[0].DRIVER_PHONE}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Email</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{AssignedPickup[0].DRIVER_EMAIL == "" || AssignedPickup[0].DRIVER_EMAIL == null ? "-" : AssignedPickup[0].DRIVER_EMAIL}</span>
                                        </CCol>
                                    </CFormGroup>
                                </div>
                                :
                                null
                            }

                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CRow>
                        <CCol md="6">
                            <CButton className="btn btn-success" style={{ fontSize: "13px" }} onClick={() => EditDriver()}>
                                Edit
                            </CButton>
                        </CCol>
                    </CRow>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setBlock3(!block3)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div >
    );
};

export default ManagePickUp;
