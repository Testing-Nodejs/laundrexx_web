/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
import ReactSwitch from 'react-switch';
import "../../style.css";
import { useHistory } from "react-router-dom";


const ManagePickup = () => {
    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");
    const [CustomerName, setCustomerName] = useState("");
    const [CustomerPhone, setCustomerPhone] = useState("");
    const [CustomerType, setCustomerType] = useState("-1");
    const [CustomerAddress, setCustomerAddress] = useState("");
    const [PickupTime, setPickupTime] = useState("");
    const [PickupTime1, setPickupTime1] = useState("");
    const [Quantity, setQuantity] = useState("");
    const [BulkItem, setBulkItem] = useState("");
    const [AddButton, setAddButton] = useState(true);
    const [ClearButton, setClearButton] = useState(true);
    const [PickUp, setPickUp] = useState(false);
    const [CustomerData, setCustomerData] = useState("");
    const [CustomerList, setCustomerList] = useState([]);
    const [Customer, setCustomer] = useState(null);
    const history = useHistory();


    const CustomerTypeChange = (event) => {
        setCustomerType(event.target.value);
        getCustomer();
    };

    const PickupTimeChange = (event) => {
        var inputEle = document.getElementById('timeInput');
        var timeSplit = inputEle.value.split(':'),
            hours,
            minutes,
            meridian;
        hours = timeSplit[0];
        minutes = timeSplit[1];
        if (hours > 12) {
            meridian = 'PM';
            hours -= 12;
        } else if (hours < 12) {
            meridian = 'AM';
            if (hours == 0) {
                hours = 12;
            }
        } else {
            meridian = 'PM';
        }
        setPickupTime(event.target.value);
        setPickupTime1(hours + ':' + minutes + ' ' + meridian);
    };

    // const CustomerChange = (event) => {
    //     setCustomer(event.target.value);
    // };

    const CustomerAddressChange = (event) => {
        setCustomerAddress(event.target.value);
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


    React.useEffect(() => {
        setAddButton(true);
        setClearButton(true);
    }, []);


    const handleCustomerChange = (event, newValue) => {
        if (newValue) {
            setCustomer(newValue.id);
            console.log(`Selected customer: ${newValue ? newValue.label : 'None'}`);
        } else {
            console.log('No customer selected');
        }
    };

    const getCustomer = () => {
        if (UserType == "Manager") {
            axios.get(MyApiUrl + "GetAllCustomersForCouponsForManager/" + UserID + "").then((response) => {
                console.log(response.data)
                if (response.data.length > 0) {
                    setCustomerList(response.data);
                } else {
                    setCustomerList([]);
                }
            });
        } else {
            axios.get(MyApiUrl + "GetAllCustomersForPickup").then((response) => {
                console.log(response.data)
                if (response.data.length > 0) {
                    setCustomerList(response.data);
                } else {
                    setCustomerList([]);
                }
            });
        }
    };

    const AddStore = () => {
        if (CustomerType == "1" || CustomerType == 1) {
            if (CustomerType === "-1") {
                Toast.fire({
                    icon: "warning",
                    title: "Please Select Customer Type!",
                });
            }
            else if (CustomerName === "" || CustomerName == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Customer Name!",
                });
            }
            else if (CustomerPhone === "" || CustomerPhone == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Customer Phone!",
                });
            }
            else if (CustomerPhone.length != 10) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter 10 Digits Phone Number!",
                });
            }
            else if (CustomerAddress === "" || CustomerAddress == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Pickup Address!",
                });
            }
            else if (PickupTime === "" || PickupTime == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Pickup Time!",
                });
            } else if (Quantity === "" || Quantity == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Quantity!",
                });
            } else {
                document.getElementById("divLoading").className = "show";
                var obj = {
                    ManagerID: UserID,
                    PICKUP_CUSTOMER_FKID: Customer,
                    PICKUP_CUSTOMER_NAME: CustomerName,
                    PICKUP_CUSTOMER_PHONE: CustomerPhone,
                    PICKUP_ADDRESS: CustomerAddress,
                    PICKUP_TIME: PickupTime1,
                    PICKUP_TIME_1: PickupTime,
                    PICKUP_QUANTITY: Quantity,
                    PICKUP_BULK_ITEMS: BulkItem,
                    PICKUP_DOOR_DELIVERY: PickUp,
                };
                if (UserType == "Manager") {
                    axios.post(MyApiUrl + "ManagerAddPickup ", obj).then((response) => {
                        if (response.data === "0") {
                            Swal.fire({
                                title: "Pickup Details Already Exist!",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                            document.getElementById("divLoading").className = "hide";
                        } else if (response.data === true) {
                            Swal.fire({
                                title: "Pickup Details Added!",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                            document.getElementById("divLoading").className = "hide";
                            Reset();
                            history.push("/CreatePickup");
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
                else {
                    axios.post(MyApiUrl + "Pickup", obj).then((response) => {
                        if (response.data === "0") {
                            Swal.fire({
                                title: "Pickup Details Already Exist!",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                            document.getElementById("divLoading").className = "hide";
                        } else if (response.data === true) {
                            Swal.fire({
                                title: "Pickup Details Added!",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                            document.getElementById("divLoading").className = "hide";
                            Reset();
                            history.push("/CreatePickup");
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
        }
        else {
            if (CustomerType === "-1") {
                Toast.fire({
                    icon: "warning",
                    title: "Please Select Customer Type!",
                });
            }
            else if (Customer === "" || Customer == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Select Customer!",
                });
            }
            else if (CustomerAddress === "" || CustomerAddress == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Pickup Address!",
                });
            }
            else if (PickupTime === "" || PickupTime == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Pickup Time!",
                });
            } else if (Quantity === "" || Quantity == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Quantity!",
                });
            }
            else {
                document.getElementById("divLoading").className = "show";
                var obj = {
                    ManagerID: UserID,
                    PICKUP_CUSTOMER_FKID: Customer,
                    PICKUP_CUSTOMER_NAME: CustomerName,
                    PICKUP_CUSTOMER_PHONE: CustomerPhone,
                    PICKUP_ADDRESS: CustomerAddress,
                    PICKUP_TIME: PickupTime1,
                    PICKUP_TIME_1: PickupTime,
                    PICKUP_QUANTITY: Quantity,
                    PICKUP_BULK_ITEMS: BulkItem,
                    PICKUP_DOOR_DELIVERY: PickUp,

                };
                if (UserType == "Manager") {
                    axios.post(MyApiUrl + "ManagerAddPickup", obj).then((response) => {
                        if (response.data === "0") {
                            Swal.fire({
                                title: "Pickup Details Already Exist!",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                            document.getElementById("divLoading").className = "hide";
                        } else if (response.data === true) {
                            Swal.fire({
                                title: "Pickup Details Added!",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                            document.getElementById("divLoading").className = "hide";
                            Reset();
                            history.push("/CreatePickup");
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
                else {
                    axios.post(MyApiUrl + "Pickup", obj).then((response) => {
                        if (response.data === "0") {
                            Swal.fire({
                                title: "Pickup Details Already Exist!",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                            document.getElementById("divLoading").className = "hide";
                        } else if (response.data === true) {
                            Swal.fire({
                                title: "Pickup Details Added!",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                            document.getElementById("divLoading").className = "hide";
                            Reset();
                            history.push("/CreatePickup");
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
        }


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
        setCustomerName("");
        setCustomerType("-1");
        setCustomerAddress("");
        setCustomerPhone("");
        setPickupTime("");
        setQuantity("");
        setBulkItem("");
        setPickUp(false);
        setAddButton(true);
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
            <h1 id="ccmaster">Manage PickUp</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="5">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add PickUp</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >

                                    <CFormGroup row>
                                        <CCol lg="12" md="12">
                                            <CLabel>Customer Type <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="FactoryType"
                                                id="FactoryType"
                                                onChange={CustomerTypeChange}
                                                value={CustomerType}
                                            >
                                                <option value="-1">Select Customer Type</option>
                                                <option value="1">New Customer</option>
                                                <option value="2">Existing Customer</option>
                                            </CSelect>
                                        </CCol>
                                    </CFormGroup>
                                    {CustomerType == 1 || CustomerType == "1" ?
                                        <CFormGroup row>
                                            <CCol lg="12" md="12">
                                                <CLabel>Customer Name <span style={{ color: "red" }}>*</span></CLabel>
                                                <CInput
                                                    id="text-input"
                                                    name="text-input"
                                                    placeholder="Enter Customer Name"
                                                    value={CustomerName}
                                                    onChange={(event) => {
                                                        let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                        value = value.replace(/\w+/g,
                                                            function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setCustomerName(value)
                                                    }}
                                                />
                                            </CCol>

                                            <CCol lg="12" md="12">
                                                <CLabel>Customer Phone <span style={{ color: "red" }}>*</span></CLabel>
                                                <CInput
                                                    id="text-input"
                                                    name="text-input"
                                                    placeholder="Enter Customer Phone"
                                                    value={CustomerPhone}
                                                    onChange={(event) => {
                                                        let value = event.target.value;
                                                        value = value.replace(/[^0-9]/gi, ""); setCustomerPhone(value)
                                                    }}
                                                    maxLength={10}
                                                />
                                            </CCol>
                                        </CFormGroup>
                                        :
                                        null
                                    }
                                    {CustomerType == 2 || CustomerType == "2" ?
                                        <CFormGroup row>
                                            <CCol lg="12" md="12">
                                                <CLabel>Select Customer<span style={{ color: "red" }}>*</span></CLabel>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={CustomerList}
                                                    sx={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} />}
                                                    onChange={handleCustomerChange}
                                                />
                                            </CCol>

                                        </CFormGroup>
                                        :
                                        null
                                    }
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
                <CCol md="12" lg="7">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>PickUp Details</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol lg="12" md="6">
                                            <CLabel>Pickup Time <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="timeInput"
                                                name="text-input"
                                                type="time"
                                                placeholder="Enter Pickup Time"
                                                value={PickupTime}
                                                onChange={PickupTimeChange}
                                            />
                                        </CCol>

                                        <CCol lg="12" md="6">
                                            <CLabel>Quantity <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Quantity"
                                                value={Quantity}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, ""); setQuantity(value)
                                                }}
                                            />
                                        </CCol>

                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol lg="12" md="6">
                                            <CLabel>Required Door Delivery</CLabel>
                                            <div>
                                                <ReactSwitch
                                                    checked={PickUp}
                                                    onChange={(event) => {
                                                        setPickUp(event);
                                                    }}
                                                />
                                            </div>
                                        </CCol>

                                        <CCol lg="12" md="6">
                                            <CLabel>Order Included any Bulk item</CLabel>
                                            <div>
                                                <ReactSwitch
                                                    checked={BulkItem}
                                                    onChange={(event) => {
                                                        setBulkItem(event);
                                                    }}
                                                />
                                            </div>
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol lg="12" md="12">
                                            <CLabel>Pickup Address <span style={{ color: "red" }}>*</span></CLabel>
                                            <CTextarea
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Pickup Address"
                                                value={CustomerAddress}
                                                onChange={CustomerAddressChange}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                </CForm>
                            </CCardBody>
                        </CCard>
                        <CFormGroup row>
                            <CCol lg="12" md="12">
                                {ClearButton && <ClearBtn />}
                                {AddButton && <Addbtn />}
                            </CCol>
                        </CFormGroup>
                    </div>
                </CCol>
            </CRow>
        </div>
    );
};

export default ManagePickup;
