
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
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import { useHistory } from "react-router-dom";

const EditCustomerDetails = (props) => {
    const {
        CUSTOMER_PKID,
        Outlet,
        CUSTOMER_OUTLET_FKID,
        CUSTOMER_NAME,
        CUSTOMER_CONTACT_NUMBER,
        CUSTOMER_ALT_NUMBER,
        CUSTOMER_GST_TYPE,
        CUSTOMER_EMAIL,
        CUSTOMER_ADDRESS,
        CUSTOMER_GST_NUMBER,
        CUSTOMER_TYPE_FKID,
        CUSTOMER_HOW_HEAR_US,
    } = props.location.state.data;
    const history = useHistory();
    console.log(props.location.state.data);
    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");
    
    const [CustomerTypeData, setCustomerTypeData] = useState("");
    const [CustomerGstType, setCustomerGstType] = useState(CUSTOMER_GST_TYPE);
    const [HearUs, setHearUs] = useState(CUSTOMER_HOW_HEAR_US);
    const [ContactNumber, setContactNumber] = useState(CUSTOMER_CONTACT_NUMBER);
    const [CustomerName, setCustomerName] = useState(CUSTOMER_NAME);
    const [CustomerEmail, setCustomerEmail] = useState(CUSTOMER_EMAIL);
    const [AltNumber, setAltNumber] = useState(CUSTOMER_ALT_NUMBER);
    const [CustomerAddress, setCustomerAddress] = useState(CUSTOMER_ADDRESS);
    const [CustomerGST, setCustomerGST] = useState(CUSTOMER_GST_NUMBER);
    const [CustomerType, setCustomerType] = useState(CUSTOMER_TYPE_FKID);

    const [GSTNumber, setGSTNumber] = useState(CUSTOMER_GST_TYPE === "B2B" ? true : false);

    const CustomerChange = (event) => {
        setCustomerGstType(event.target.value);
        event.target.value === "B2B" ? setGSTNumber(true) : changeGST();
    };
    const changeGST = () => {
        setCustomerGST("");
        setGSTNumber(false);
    }

    const CustomerEmailChange = (event) => {
        setCustomerEmail(event.target.value);
    };

    const CustomerAddressChange = (event) => {
        setCustomerAddress(event.target.value);
    };

    const CustomerTypeChange = (event) => {
        setCustomerType(event.target.value);
    };


    const HearUsChange = (event) => {
        setHearUs(event.target.value);
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

    const GetCustomerType = React.useCallback(async () => {
            await axios.get(MyApiUrl + "GetCustomerType").then((response) => {
                console.log(response.data);
                const CustTypeOption = response.data.map((item) => (
                    <option value={item.CUSTOMER_TYPE_PKID}>{item.CUSTOMER_TYPE_NAME}</option>
                ));
                setCustomerTypeData(CustTypeOption);
            });
    }, []);

    React.useEffect(() => {
        GetCustomerType();
    }, []);


    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    const AddCustomer = () => {
        if (CustomerName === "" || CustomerName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Customer Name!",
            });
        } else if (ContactNumber === "" || ContactNumber == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Contact Number!",
            });
        } else if (CustomerEmail === "" || CustomerEmail == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Customer Email!",
            });
        } else if (regEmail.test(CustomerEmail) === false) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Valid Email!",
            });
        } else if (CustomerType == "-1" || CustomerType == "") {
            Toast.fire({
                icon: "warning",
                title: "Please Select Customer Type!",
            });
        } else if (CustomerGstType == "-1" || CustomerGstType == "") {
            Toast.fire({
                icon: "warning",
                title: "Please Select GST Type!",
            });
        } else if (CustomerAddress === "" || CustomerAddress == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Customer Address!",
            });
        } else if (CustomerGstType == "B2B" && (CustomerGST == "" || CustomerGST == null)) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter GST Number!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                CUSTOMER_NAME: CustomerName,
                CUSTOMER_CONTACT_NUMBER: ContactNumber,
                CUSTOMER_ALT_NUMBER: AltNumber,
                CUSTOMER_GST_TYPE: CustomerGstType,
                CUSTOMER_EMAIL: CustomerEmail,
                CUSTOMER_ADDRESS: CustomerAddress,
                CUSTOMER_GST_NUMBER: CustomerGST,
                CUSTOMER_TYPE_FKID: CustomerType,
            };
            if (UserType == "Manager") {
            axios.put(MyApiUrl+ "GetAllCustomersForManager/" + UserID + "" + CUSTOMER_PKID + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Customer Details Updated!",
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
        }else{
            axios.put(MyApiUrl + "Customers/" + CUSTOMER_PKID + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Customer Details Updated!",
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
    }

    const Reset = () => {
        history.goBack();
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
            <h1 id="ccmaster">Edit Customer</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="12">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Edit Customer</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                value={Outlet}
                                                disabled
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Name"
                                                value={CustomerName}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setCustomerName(value)
                                                }}

                                            />
                                        </CCol>

                                        <CCol lg="4" md="12">
                                            <CLabel>Contact Number <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Contact Number"
                                                value={ContactNumber}
                                                maxLength={10}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, ""); setContactNumber(value)
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Alternate Number</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Alternate Number"
                                                value={AltNumber}
                                                maxLength={10}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, "");
                                                    setAltNumber(value);
                                                }}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Email <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Email"
                                                value={CustomerEmail}
                                                onChange={CustomerEmailChange}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Customer Type <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="FactoryType"
                                                id="FactoryType"
                                                onChange={CustomerTypeChange}
                                                value={CustomerType}
                                            >
                                                <option value="-1">Select Customer Type</option>
                                                {CustomerTypeData}
                                            </CSelect>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>GST Type <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="FactoryType"
                                                id="FactoryType"
                                                onChange={CustomerChange}
                                                value={CustomerGstType}
                                            >
                                                <option value="-1">Select GST Type</option>
                                                <option value="B2B">B2B</option>
                                                <option value="B2C">B2C</option>
                                            </CSelect>
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Address <span style={{ color: "red" }}>*</span></CLabel>
                                            <CTextarea
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Address"
                                                value={CustomerAddress}
                                                onChange={CustomerAddressChange}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>How did you hear about us?</CLabel>
                                            <CSelect
                                                readOnly={true}
                                                custom
                                                name="FactoryType"
                                                id="FactoryType"
                                                onChange={HearUsChange}
                                                value={HearUs}
                                                disabled
                                            >
                                                <option value="-1">Select the below Option</option>
                                                <option value="House Nearby">House Nearby</option>
                                                <option value="Saw board on the way">Saw board on the way</option>
                                                <option value="Google Maps">Google Maps</option>
                                                <option value="Social Media - Facebook/Instagram">Social Media - Facebook / Instagram</option>
                                                <option value="Flyer/Local Ad">Flyer / Local Ad</option>
                                                <option value="Customer Referral">Customer Referral</option>
                                                <option value="SMS Champaign">SMS Champaign</option>
                                                <option value="Email Champaign">Email Champaign</option>
                                                <option value="N/A">N/A</option>
                                            </CSelect>
                                        </CCol>
                                    </CFormGroup>

                                    {GSTNumber == true ?
                                        <CFormGroup row>
                                            <CCol lg="4" md="12">
                                                <CLabel>GST Number <span style={{ color: "red" }}>*</span></CLabel>
                                                <CInput
                                                    id="text-input"
                                                    name="text-input"
                                                    placeholder="Enter GST Number"
                                                    value={CustomerGST}
                                                    onChange={(event) => {
                                                        setCustomerGST(event.target.value)
                                                    }}
                                                />
                                            </CCol>
                                        </CFormGroup>
                                        : null}
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CButton
                                                type="button"
                                                onClick={Reset}
                                                className="btn btn-danger"
                                                style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}
                                            >
                                                CANCEL
                                            </CButton>
                                            <CButton type="button" onClick={AddCustomer} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
                                                UPDATE
                                            </CButton>
                                        </CCol>
                                    </CFormGroup>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
            </CRow>
        </div>
    );
};

export default EditCustomerDetails;
