
/* eslint-disable no-restricted-globals */
import React, { useState } from "react";
import axios from "axios";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CButton,
    CSelect,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
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
import { MultiSelect } from "react-multi-select-component";
import "../../style.css";
import Swal from "sweetalert2";
import { MyApiUrl, ViewImg } from "src/services/service";
var voucher_codes = require('voucher-code-generator');
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Action" },
    { key: "Customers" },
    { key: "Coupon Name" },
    { key: "Coupon Code" },
    { key: "Coupon Price/Percentage" },
    { key: "Coupon Discount" },
    { key: "Coupon Type" },
];

const fields = [
    { key: "Sl No." },
    { key: "Name" },
    { key: "Phone No" },
    { key: "Outlet" },
];

const CustomerCoupon = () => {
    const history = useHistory();
    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");

    const [couponPkid, setcouponPkid] = useState("");
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [ReloadButton, setReloadButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);
    const [block, setBlock] = useState(false);
    const [InnerTableData, setInnerTableData] = useState([]);
    const [CustomerList, setCustomerList] = useState([]);
    const [responseData, setResponseData] = useState("");
    const [customer, setCustomer] = useState([]);
    const [couponName, setcouponName] = useState("");
    const [couponCode, setcouponCode] = useState("");
    const [couponPrice, setcouponPrice] = useState("");
    const [couponDiscout, setcouponDiscout] = useState("");
    const [CouponType, setCouponType] = useState("Regular");
    const [Show, setShow] = useState(false);

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

    const GetCustomers = async () => {
        if (UserType == "Manager") {
            await axios.get(MyApiUrl + "GetAllCustomersForCouponsForManager/" + UserID + "").then((response) => {
                if (response.data.length > 0) {
                    setCustomerList(response.data);
                } else {
                    setCustomerList([]);
                }
            });
        } else {
            await axios.get(MyApiUrl + "GetAllCustomersForCoupons").then((response) => {
                if (response.data.length > 0) {
                    setCustomerList(response.data);
                } else {
                    setCustomerList([]);
                }
            });
        }


    };

    const couponCodeChange = (event) => {
        setcouponCode(event.target.value);
    };

    const couponPriceChange = (event) => {
        setcouponPrice(event.target.value);
    };

    const addCoupon = () => {
        if (customer.length == 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Customer",
            });
        } else if (couponName == "" || couponName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Coupon Name",
            });
        } else if (couponPrice == "" || couponPrice == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Coupon Price/Percentage",
            });
        } else if (couponDiscout == "" || couponDiscout == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Coupon Discout",
            });
        } else {
            const obj = {
                CustomerData: customer,
                CUSTOMER_COUPON_NAME: couponName,
                CUSTOMER_COUPON_CODE: couponCode,
                CUSTOMER_COUPON_PERCENT_OR_PRICE: couponPrice,
                CUSTOMER_COUPON_DISCOUNT: couponDiscout,
                CUSTOMER_COUPON_TYPE: CouponType,
            };
            axios.post(MyApiUrl + "AddCustomerCoupon", obj)
                .then((response) => {

                    console.log(response);
                    if (response.data == "0") {
                        Toast.fire({
                            icon: "error",
                            title: "Coupon Already Exist",
                        });
                    } else if (response.data === true) {
                        Toast.fire({
                            icon: "success",
                            title: "Coupon Details Added",
                        });
                        reset();
                    } else if (response.data === false) {
                        Toast.fire({
                            icon: "error",
                            title: "Failed To Add",
                        });
                    }
                });
        }
    };

    const UpdateCoupon = () => {
        if (customer.length == 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Customer",
            });
        } else if (couponName == "" || couponName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Coupon Name",
            });
        } else if (couponPrice == "" || couponPrice == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Coupon Price/Percentage",
            });
        } else if (couponDiscout == "" || couponDiscout == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Coupon Discout",
            });
        } else {
            const obj = {
                CustomerData: customer,
                CUSTOMER_COUPON_NAME: couponName,
                CUSTOMER_COUPON_CODE: couponCode,
                CUSTOMER_COUPON_PERCENT_OR_PRICE: couponPrice,
                CUSTOMER_COUPON_DISCOUNT: couponDiscout,
                CUSTOMER_COUPON_TYPE: CouponType,
            };
            axios.put(MyApiUrl + "UpdateCustomerCoupon/" + couponPkid + "", obj)
                .then((response) => {
                    if (response.data === true) {
                        Toast.fire({
                            icon: "success",
                            title: "Coupon Details Updated",
                        });
                        reset();
                    } else if (response.data === false) {
                        Toast.fire({
                            icon: "error",
                            title: "Fail to Update",
                        });
                    }
                });
        }
    };

    const EditCoupon = (id, customer, couponName, couponCode, couponPricePercentage, couponDiscout, couponType) => {
        setcouponPkid(id);
        setCustomer(customer);
        setcouponName(couponName);
        setcouponCode(couponCode);
        setcouponPrice(couponPricePercentage);
        setcouponDiscout(couponDiscout);
        setCouponType(couponType);
        setAddButton(false);
        setUpdateButton(true);
        setReloadButton(true);
        setClearButton(false);
    };

    const DeleteCoupon = (id) => {
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios.delete(MyApiUrl + "DeleteCustomerCoupon/" + id + "").then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Selected Coupon Deleted!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    reset();
                } else {
                    Swal.fire({
                        title: "Failed To Delete Coupon!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            });
        }
    };

    const Updatebtn = () => (
        <CButton type="button" onClick={UpdateCoupon} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={addCoupon} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            ADD
        </CButton>
    );

    const Reloadbtn = () => (
        <CButton type="button" onClick={reset} className="btn btn-danger" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CANCEL
        </CButton>
    );

    const Clearbtn = () => (
        <CButton type="button" onClick={reset} className="btn btn-warning" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CLEAR
        </CButton>
    );

    const fetchData = React.useCallback(async () => {
        if (UserType == "Manager") {
            await axios.get(MyApiUrl + "GetAllCustomerCouponsForManager/" + UserID + "").then((response) => {
                if (response.data.length != 0) {
                    const items = response.data.map((item) => {
                        return {
                            ...item,
                            "Coupon Name": item.CUSTOMER_COUPON_NAME,
                            "Coupon Code": item.CUSTOMER_COUPON_CODE,
                            "Coupon Price/Percentage": item.CUSTOMER_COUPON_PERCENT_OR_PRICE,
                            "Coupon Discount": item.CUSTOMER_COUPON_DISCOUNT,
                            "Coupon Type": item.CUSTOMER_COUPON_TYPE,
                        };
                    });
                    setResponseData(items);
                }
                else {
                    setResponseData([]);
                }
                const date = new Date();
                var couponCode = voucher_codes.generate({
                    postfix: "-" + date.getFullYear(),
                    length: 8,
                    count: 1
                });
                setcouponCode(couponCode.toString());
            });
        }
        else {
            await axios.get(MyApiUrl + "GetAllCustomerCoupons").then((response) => {
                if (response.data.length != 0) {
                    const items = response.data.map((item) => {
                        return {
                            ...item,
                            "Coupon Name": item.CUSTOMER_COUPON_NAME,
                            "Coupon Code": item.CUSTOMER_COUPON_CODE,
                            "Coupon Price/Percentage": item.CUSTOMER_COUPON_PERCENT_OR_PRICE,
                            "Coupon Discount": item.CUSTOMER_COUPON_DISCOUNT,
                            "Coupon Type": item.CUSTOMER_COUPON_TYPE,
                        };
                    });
                    setResponseData(items);
                }
                else {
                    setResponseData([]);
                }
                const date = new Date();
                var couponCode = voucher_codes.generate({
                    postfix: "-" + date.getFullYear(),
                    length: 8,
                    count: 1
                });
                setcouponCode(couponCode.toString());
            });
        }

    }, []);

    const reset = () => {
        setcouponPkid("");
        setCustomer([]);
        setcouponName("");
        setcouponCode("");
        setcouponPrice("");
        setcouponDiscout("");
        setCouponType("Regular")
        setAddButton(true);
        setUpdateButton(false);
        setReloadButton(false);
        setClearButton(true);
        GetCustomers();
        fetchData();
    };

    React.useEffect(() => {
        GetCustomers();
        fetchData();
    }, []);

    React.useEffect(() => {
        if (CustomerList.length > 0) {
            CustomerList.length == customer.length ? setShow(true) : setShow(false);
        }
    }, [customer]);

    const viewCustomers = (list) => {
        const items = list.map((item, index) => {
            return {
                ...item,
                "Sl No.": index + 1,
                "Name": item.CUSTOMER_NAME,
                "Phone No": item.CUSTOMER_CONTACT_NUMBER,
                "Outlet": item.STORE_NAME,
            };
        });
        setInnerTableData(items);
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
            <h1 id="ccmaster">Manage Customer Coupons</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="4">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Add/Update Coupons</CCardHeader>
                        <CCardBody>
                            <CForm action="" method="post">
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Customers <span style={{ color: "red" }}>*</span></CLabel>
                                        {Show == true ?
                                            <MultiSelect
                                                options={CustomerList}
                                                value={customer}
                                                onChange={setCustomer}
                                                labelledBy="Select Customers"
                                                valueRenderer={() => ("All Customers Selected")}
                                            />
                                            :
                                            <MultiSelect
                                                options={CustomerList}
                                                value={customer}
                                                onChange={setCustomer}
                                                labelledBy="Select Customers"
                                            />
                                        }
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="">Coupon Name <span style={{ color: "red" }}>*</span></CLabel>
                                    <CInput
                                        type="text"
                                        id="couponName"
                                        name="couponName"
                                        value={couponName}
                                        placeholder="Enter Coupon Name"
                                        onChange={(event) => {
                                            let value = event.target.value;
                                            value = value.replace(/\w+/g,
                                                function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); });
                                            setcouponName(value)
                                        }}

                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="">Coupon Code <span style={{ color: "red" }}>*</span></CLabel>
                                    <CInput
                                        id="text-input1"
                                        name="text-input"
                                        placeholder="Enter Coupon Code"
                                        type="text"
                                        readOnly="true"
                                        value={couponCode}
                                        onChange={couponCodeChange}
                                    />
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Coupon Price/Percentage <span style={{ color: "red" }}>*</span></CLabel>
                                        <CSelect
                                            custom
                                            name="couponPrice"
                                            id="couponPrice"
                                            value={couponPrice}
                                            onChange={couponPriceChange}
                                        >
                                            <option value="-1">Select Discount Type</option>
                                            <option value="Price">Price</option>
                                            <option value="Percentage"> Percentage</option>
                                        </CSelect>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="">Coupon Discount <span style={{ color: "red" }}>*</span></CLabel>
                                    <CInput
                                        type="numbers"
                                        id="couponDiscout"
                                        name="couponDiscout"
                                        value={couponDiscout}
                                        placeholder="Enter Coupon Discount"
                                        onChange={(event) => {
                                            let value = event.target.value;
                                            value = value.replace(/[^0-9]/gi, ""); setcouponDiscout(value)
                                        }}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="">Coupon Type <span style={{ color: "red" }}>*</span></CLabel>
                                    <CSelect
                                        custom
                                        name="couponPrice"
                                        id="couponPrice"
                                        value={CouponType}
                                        onChange={(event) => {
                                            setCouponType(event.target.value)
                                        }}
                                    >
                                        <option value="Regular">Regular</option>
                                        <option value="OneTimeUse">One Time Use</option>
                                    </CSelect>
                                </CFormGroup>
                                {ReloadButton && <Reloadbtn />}
                                {UpdateButton && <Updatebtn />}
                                {ClearButton && <Clearbtn />}
                                {AddButton && <Addbtn />}
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="8">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>View Customer Coupons</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={responseData}
                                fields={fields2}
                                striped
                                itemsPerPage={5}
                                pagination
                                sorter
                                size="sm"
                                tableFilter={table}
                                itemsPerPageSelect={items}
                                scopedSlots={{
                                    Action: (item) => (
                                        <td>
                                            <CButton
                                                onClick={() => {
                                                    EditCoupon(
                                                        item.CUSTOMER_COUPON_PKID,
                                                        item.CustomerDetailsEdit,
                                                        item.CUSTOMER_COUPON_NAME,
                                                        item.CUSTOMER_COUPON_CODE,
                                                        item.CUSTOMER_COUPON_PERCENT_OR_PRICE,
                                                        item.CUSTOMER_COUPON_DISCOUNT,
                                                        item.CUSTOMER_COUPON_TYPE,
                                                    );
                                                }}
                                                size="sm"
                                                id="war-btn"
                                            >
                                                <EditIcon />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                id="war-btn1"
                                                onClick={() => {
                                                    DeleteCoupon(item.CUSTOMER_COUPON_PKID);
                                                }}
                                            >
                                                <DeleteSharpIcon />
                                            </CButton>
                                        </td>
                                    ),
                                    "Customers": (item) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    viewCustomers(item.CustomerDetails);
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
            <CModal show={block} onClose={() => setBlock(!block)} color="dark" style={{ height: 480 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Customers</CModalTitle>
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

export default CustomerCoupon;
