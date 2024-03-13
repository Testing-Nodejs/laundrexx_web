import React, { useState } from "react";
import axios from "axios";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CDataTable,
    CButton,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CModal,
    CLabel,
    CInput,
    CSelect,
    CFormGroup,
    CTextarea,
    CDropdownDivider,
    CForm,
    CLink
} from "@coreui/react";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Sl No." },
    { key: "Status" },
    { key: "Bad Debt" },
    { key: "Order Number" },
    { key: "Order Date" },
    { key: "Due Date" },
    { key: "Order Invoice Number" },
    { key: "Order Quantity" },
    { key: "Outlet" },
    { key: "Customer Name" },
    { key: "Customer Phone" },
    { key: "Service Category" },
    { key: "Service Type" },
    { key: "Pickup Request" },
    { key: "Pickup ID" },
    { key: "Driver" },
    { key: "Coupon" },
    { key: "Door Delivery" },
    { key: "Order Amount" },
    { key: "Order Discount" },
    { key: "Total Order Amount" },
    { key: "CGST" },
    { key: "SGST" },
    { key: "Total Invoice Value" },
    { key: "Round Invoice Value" },
    { key: "Grand Total Amount" },
];

const BadDebtAdjustment = () => {

    const UserID = sessionStorage.getItem("UserID");
    const SessionType = sessionStorage.getItem("SessionType");

    const [ResponseData, setResponseData] = useState([]);
    const [PickupData, setPickupData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [toDate, settoDate] = useState("");
    const [BadDebt, setBadDebt] = useState("");

    const [YearsList, setYearsList] = useState();
    const [OutletList, setOutletList] = useState();
    const [Year, setYear] = useState("");
    const [block, setblock] = useState(false);
    const [block1, setblock1] = useState(false);
    const [block2, setblock2] = useState(false);
    const [block3, setblock3] = useState(false);
    const [block4, setblock4] = useState(false);
    const [block5, setblock5] = useState(false);
    const [block6, setblock6] = useState(false);
    const [dates, setDates] = useState(false);
    const [Outlet, setOutlet] = useState("-");
    const [DriverForEdit, setDriverForEdit] = useState([]);
    const [BadDebtData, setBadDebtData] = useState([]);

    const history = useHistory();

    const [OutletFields, setOutletFields] = useState({
        ID: "",
        Name: "",
        Address: "",
        Pkid: "",
        City: "",
        Phone: "",
        PriceTier: "",
        FactoryName: "",
        RouteName: "",
        ServiceCat: "",
        ServiceType: "",
    });

    const [CouponFields, setCouponFields] = useState({
        Name: "",
        Type: "",
        Pkid: "",
        Code: "",
        Price: "",
        Discount: "",
        Validity: "",
        Active: "",
    });

    const [CustomerFields, setCustomerFields] = useState({
        Name: "",
        Type: "",
        Pkid: "",
        Phone: "",
        Email: "",
        Address: "",
        Gst: "",
    });

    // Filters
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

    const getYear_Outlet = async () => {
        if (SessionType == "Manager") {
            await axios.get(MyApiUrl + "OutletsByManager/" + UserID + "").then((response) => {
                const Option = response.data.map((item, i) => (
                    <option key={i} value={item.STORE_PKID}>
                        {item.STORE_NAME}
                    </option>
                ));
                setOutletList(Option);
            });
        } else {
            await axios.get(MyApiUrl + "Outlets").then((response) => {
                const Option = response.data.map((item, i) => (
                    <option key={i} value={item.STORE_PKID}>
                        {item.STORE_NAME}
                    </option>
                ));
                setOutletList(Option);
            });
        }
        await axios.get(MyApiUrl + "GetYearsList").then((response) => {
            const Option = response.data.map((item, i) => (
                <option key={i} value={item.year}>
                    {item.year}
                </option>
            ));
            setYearsList(Option);
            setYear(response.data[0].year);
        });
    };

    const getAllOrders = () => {
        document.getElementById("divLoading").className = "show";
        if (SessionType == "Manager") {
            axios.get(MyApiUrl + "AllOrdersForBadDebitsForManager/" + UserID + "").then((response) => {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Order Date": SplitDate1(item.ORDER_DATE),
                        "Order Invoice Number": item.ORDER_INVOICE_NUMBER,
                        "Order Number": item.ORDER_ORDER_NUMBER,
                        "Pickup Request": item.ORDER_IS_PICKUP == "true" || item.ORDER_IS_PICKUP == true ? "Requested" : "-",
                        "Pickup ID": item.ORDER_IS_PICKUP_ID == "" || item.ORDER_IS_PICKUP_ID == null ? "-" : item.ORDER_IS_PICKUP_ID,
                        "Door Delivery": item.ORDER_DOOR_DELIVERY == "" || item.ORDER_DOOR_DELIVERY == null ? "-" : "Requested",
                        "Service Type": item.SERVICE_TYPE_NAME,
                        "Service Category": item.SERVICE_CATEGORY_NAME,
                        "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                        "Order Amount": item.ORDER_AMOUNT,
                        "Order Discount": item.ORDER_DISCOUNT,
                        "Total Order Amount": item.ORDER_TOTAL_ORDER_AMOUNT,
                        "CGST": item.ORDER_CGST,
                        "SGST": item.ORDER_SGST,
                        "Total Invoice Value": item.ORDER_TOTAL_INVOICE_VALUE,
                        "Round Invoice Value": item.ORDER_ROUND_OFF_INVOICE,
                        "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                        "Customer Phone": item.CUSTOMER_CONTACT_NUMBER,
                    };
                });
                setResponseData(items);
                document.getElementById("divLoading").className = "hide";
            })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            axios.get(MyApiUrl + "AllOrdersForBadDebits").then((response) => {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Order Date": SplitDate1(item.ORDER_DATE),
                        "Order Invoice Number": item.ORDER_INVOICE_NUMBER,
                        "Order Number": item.ORDER_ORDER_NUMBER,
                        "Pickup Request": item.ORDER_IS_PICKUP == "true" || item.ORDER_IS_PICKUP == true ? "Requested" : "-",
                        "Pickup ID": item.ORDER_IS_PICKUP_ID == "" || item.ORDER_IS_PICKUP_ID == null ? "-" : item.ORDER_IS_PICKUP_ID,
                        "Door Delivery": item.ORDER_DOOR_DELIVERY == "" || item.ORDER_DOOR_DELIVERY == null ? "-" : "Requested",
                        "Service Type": item.SERVICE_TYPE_NAME,
                        "Service Category": item.SERVICE_CATEGORY_NAME,
                        "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                        "Order Amount": item.ORDER_AMOUNT,
                        "Order Discount": item.ORDER_DISCOUNT,
                        "Total Order Amount": item.ORDER_TOTAL_ORDER_AMOUNT,
                        "CGST": item.ORDER_CGST,
                        "SGST": item.ORDER_SGST,
                        "Total Invoice Value": item.ORDER_TOTAL_INVOICE_VALUE,
                        "Round Invoice Value": item.ORDER_ROUND_OFF_INVOICE,
                        "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                        "Customer Phone": item.CUSTOMER_CONTACT_NUMBER,
                    };
                });
                setResponseData(items);
                document.getElementById("divLoading").className = "hide";
            })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const ViewOutlets = (pkid, id, name, address, city, phone, price, cat, type, factory, route) => {
        setOutletFields({
            ...OutletFields,
            ID: id,
            Name: name,
            Address: address,
            Pkid: pkid,
            City: city,
            Phone: phone,
            RouteName: route,
            FactoryName: factory,
            ServiceCat: cat,
            ServiceType: type,
            PriceTier: price,
        }
        );
        setblock(!block);
    };
    const ViewCoupon = (pkid, type, name, code, price, discount, validity, active) => {
        setblock1(!block1);
        setCouponFields({
            ...CouponFields,
            Pkid: pkid,
            Type: type,
            Name: name,
            Code: code,
            Price: price,
            Discount: discount,
            Validity: validity,
            Active: active,
        })
    };

    const ViewCustomer = (pkid, name, phone, gst, email, address, type) => {
        setblock2(!block2);
        setCustomerFields({
            ...CustomerFields,
            Pkid: pkid,
            Type: type,
            Name: name,
            Phone: phone,
            Gst: gst,
            Email: email,
            Address: address,
        })
    };

    const ViewPickupDetails = (Id) => {
        const obj = {
            PickupCode: Id,
        }

        axios.post(MyApiUrl + "GetPickupDetailsByCode", obj).then((response) => {
            if (response.data.length > 0) {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "Pickup Code": item.PICKUP_CODE,
                        "Created Time": item.PICKUP_TIME,
                        "Created By": item.PICKUP_CREATED_BY,
                        "Quantity": item.PICKUP_QUANTITY,
                        "Pickup Address": item.PICKUP_ADDRESS,
                    };
                });
                console.log(items);
                setPickupData(items);
                setblock3(!block3);
                document.getElementById("divLoading").className = "hide";
            } else {
                setPickupData([]);
                document.getElementById("divLoading").className = "hide";
            }
        })
            .catch((error) => {
                console.log(error);
            });
    };

    const filterData = (outlet, month, year) => {
        if (dates == true) {
            if (fromDate == "" || fromDate == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Select From Date!",
                });
                return;
            } else if (toDate == "" || toDate == null) {
                Toast.fire({
                    icon: "warning",
                    title: "Select To Date!",
                });
                return;
            }
        }
        if (SessionType == "Manager") {
            const object = {
                ManagerID: UserID,
                Outlet: outlet,
                Month: month,
                Year: year,
                FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
                ToDate: toDate == "" || toDate == null ? "-" : toDate,
            }
            document.getElementById("divLoading").className = "show";
            axios.post(MyApiUrl + "AllOrdersForBadDebitsFilterForManager", object).then((response) => {
                if (response.data.length > 0) {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Order Number": item.ORDER_ORDER_NUMBER,
                            "Order Date": SplitDate1(item.ORDER_DATE),
                            "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                            "Order Invoice Number": item.ORDER_INVOICE_NUMBER,
                            "Service Category": item.SERVICE_CATEGORY_NAME,
                            "Service Type": item.SERVICE_TYPE_NAME,
                            "Pickup Request": item.ORDER_IS_PICKUP == "true" || item.ORDER_IS_PICKUP == true ? "Requested" : "-",
                            "Door Delivery": item.ORDER_DOOR_DELIVERY == "" || item.ORDER_DOOR_DELIVERY == null ? "-" : "Requested",
                            "Order Amount": item.ORDER_AMOUNT,
                            "Order Discount": item.ORDER_DISCOUNT,
                            "Total Order Amount": item.ORDER_TOTAL_ORDER_AMOUNT,
                            "CGST": item.ORDER_CGST,
                            "SGST": item.ORDER_SGST,
                            "Total Invoice Value": item.ORDER_TOTAL_INVOICE_VALUE,
                            "Round Invoice Value": item.ORDER_ROUND_OFF_INVOICE,
                            "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                            "Customer Phone": item.CUSTOMER_CONTACT_NUMBER,
                        };
                    });
                    setResponseData(items);
                    document.getElementById("divLoading").className = "hide";
                } else {
                    setResponseData([]);
                    document.getElementById("divLoading").className = "hide";
                }
            })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            const object = {
                Outlet: outlet,
                Month: month,
                Year: year,
                FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
                ToDate: toDate == "" || toDate == null ? "-" : toDate,
            }
            document.getElementById("divLoading").className = "show";
            axios.post(MyApiUrl + "AllOrdersForBadDebitsFilter", object).then((response) => {
                if (response.data.length > 0) {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Order Number": item.ORDER_ORDER_NUMBER,
                            "Order Date": SplitDate1(item.ORDER_DATE),
                            "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                            "Order Invoice Number": item.ORDER_INVOICE_NUMBER,
                            "Service Category": item.SERVICE_CATEGORY_NAME,
                            "Service Type": item.SERVICE_TYPE_NAME,
                            "Pickup Request": item.ORDER_IS_PICKUP == "true" || item.ORDER_IS_PICKUP == true ? "Requested" : "-",
                            "Door Delivery": item.ORDER_DOOR_DELIVERY == "" || item.ORDER_DOOR_DELIVERY == null ? "-" : "Requested",
                            "Order Amount": item.ORDER_AMOUNT,
                            "Order Discount": item.ORDER_DISCOUNT,
                            "Total Order Amount": item.ORDER_TOTAL_ORDER_AMOUNT,
                            "CGST": item.ORDER_CGST,
                            "SGST": item.ORDER_SGST,
                            "Total Invoice Value": item.ORDER_TOTAL_INVOICE_VALUE,
                            "Round Invoice Value": item.ORDER_ROUND_OFF_INVOICE,
                            "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                            "Customer Phone": item.CUSTOMER_CONTACT_NUMBER,
                        };
                    });
                    setResponseData(items);
                    document.getElementById("divLoading").className = "hide";
                } else {
                    setResponseData([]);
                    document.getElementById("divLoading").className = "hide";
                }
            })
                .catch((error) => {
                    console.log(error);
                });
        }
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
        const FinalDate = OrderDates[2] + "-" + getMonthName(OrderDates[1]) + "-" + OrderDates[0];
        return FinalDate;
    }

    const SplitDate1 = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }
    const FilterReset = () => {
        getAllOrders();
        setfromDate("");
        settoDate("");
        setOmonth("-");
        getYear_Outlet();
        setOutlet("-");
        setDates(false);
    };

    const ViewAssignedDriver = (item) => {
        setDriverForEdit(item);
        setblock4(!block4);
    }

    const addBadDebt = (item) => {
        setBadDebt("");
        setBadDebtData(item);
        setblock5(!block5);
    }

    const viewBadDebt = (item) => {
        setBadDebt("");
        setBadDebt(item.ORDER_BAD_DEBITS);
        setBadDebtData(item);
        setblock6(!block6);
    }

    React.useEffect(() => {
        getAllOrders();
        getYear_Outlet();
    }, []);

    const addBadDebtFunc = () => {
        if (BadDebt == "" || BadDebt == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Bad Debt Amount!",
            });
        }
        else if (BadDebt == "0" || BadDebt == 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Bad Debt Amount greater than zero!",
            });
        }
        else {
            const obj = {
                OrderBadDebits: BadDebt,
                FinalOrderAmount: (parseFloat(BadDebtData.ORDER_GRAND_TOTAL_AMOUNT) - parseFloat(BadDebt == "" || BadDebt == null ? 0 : BadDebt)).toFixed(2),
                OrderPkid: BadDebtData.ORDER_PKID,
            }
            axios.post(MyApiUrl + "UpdateOrderBadDebits", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Bad Debt Added Sucessfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    setblock5(!block5);
                    getAllOrders();
                    getYear_Outlet();
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Add!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            });
        }
    }

    const updateBadDebtFunc = () => {
        if (BadDebt == "" || BadDebt == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Bad Debt Amount!",
            });
        }
        else if (BadDebt == "0" || BadDebt == 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Bad Debt Amount greater than zero!",
            });
        }
        else {
            const obj = {
                OrderBadDebits: BadDebt,
                FinalOrderAmount: (parseFloat(BadDebtData.ORDER_GRAND_TOTAL_AMOUNT) - parseFloat(BadDebt == "" || BadDebt == null ? 0 : BadDebt)).toFixed(2),
                OrderPkid: BadDebtData.ORDER_PKID,
            }
            axios.post(MyApiUrl + "UpdateOrderBadDebits", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Bad Debt Updated Sucessfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    setblock6(!block6);
                    getAllOrders();
                    getYear_Outlet();
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Update!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            });
        }
    }

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
            <h1 id="ccmaster">Door Delivery Orders</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol col="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardBody>
                            <CRow>
                                <CCol md="2">
                                    <CLabel htmlFor="nf-email">Outlet</CLabel>
                                    <CSelect
                                        custom
                                        name="merchant"
                                        value={Outlet}
                                        onChange={(event) => {
                                            setOutlet(event.target.value);
                                        }}
                                        id="merchant"
                                    >
                                        <option value="-">All</option>
                                        {OutletList}
                                    </CSelect>
                                </CCol>
                                <CCol md="2">
                                    <CLabel htmlFor="nf-email">Year</CLabel>
                                    <CSelect
                                        custom
                                        name="merchant"
                                        value={Year}
                                        onChange={(event) => {
                                            setYear(event.target.value);
                                        }}
                                        id="merchant"
                                    >
                                        {YearsList}
                                    </CSelect>
                                </CCol>
                                <CCol md="2">
                                    <CLabel htmlFor="nf-email">Month</CLabel>
                                    <CSelect
                                        custom
                                        name="Marchant"
                                        id="Marchant"
                                        value={Omonth}
                                        onChange={(event) => {
                                            setOmonth(event.target.value);
                                        }}
                                    >
                                        <option value="-">All</option>
                                        <option value="1">Jan</option>
                                        <option value="2">Feb</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">Jun</option>
                                        <option value="7">Jul</option>
                                        <option value="8">Aug</option>
                                        <option value="9">Sept</option>
                                        <option value="10">Oct</option>
                                        <option value="11">Nov</option>
                                        <option value="12">Dec</option>
                                    </CSelect>
                                </CCol>
                                <CCol md="2">
                                    <CLabel>From Date</CLabel>
                                    <CInput
                                        type="date"
                                        onChange={(event) => {
                                            setfromDate(event.target.value);
                                            if (event.target.value == "" || event.target.value == null) {
                                                if (fromDate == "" || fromDate == null) {
                                                    setDates(false);
                                                }
                                                else {
                                                    setDates(true);
                                                }
                                            } else {
                                                setDates(true);
                                            }
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
                                            if (event.target.value == "" || event.target.value == null) {
                                                if (toDate == "" || toDate == null) {
                                                    setDates(false);
                                                }
                                                else {
                                                    setDates(true);
                                                }
                                            } else {
                                                setDates(true);
                                            }
                                        }}
                                        value={toDate}
                                    />
                                </CCol>
                                <CCol md="1">
                                    <CButton
                                        size="sm"
                                        color="info"
                                        style={{ marginTop: "28px", width: "100%" }}
                                        onClick={() => {
                                            filterData(Outlet, Omonth, Year);
                                        }}
                                    >
                                        Filter
                                    </CButton>
                                </CCol>
                                <CCol md="1">
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
            <CRow>
                <CCol col="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>
                            <CRow>
                                <CCol col="6">View All  Door Delivery Orders</CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={ResponseData}
                                fields={fields2}
                                hover
                                striped
                                bordered
                                sorter
                                tableFilter={table}
                                itemsPerPageSelect={items}
                                size="sm"
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    "Outlet": (i) => (
                                        <td>
                                            <CButton
                                                className="OrderBtn"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewOutlets(i.STORE_PKID, i.STORE_ID, i.STORE_NAME, i.STORE_ADDRESS, i.STORE_CITY, i.STORE_PHONE, i.STORE_PRICE_TIER, i.SERVICE_CATEGORY_NAME, i.SERVICE_TYPE_NAME, i.FACTORY_NAME, i.ROUTE_NAME);
                                                }}
                                            >
                                                {i.STORE_NAME}
                                            </CButton>
                                        </td>
                                    ),
                                    "Coupon": (i) => (
                                        <td>
                                            {i.ORDER_COUPON_FKID === "" || i.ORDER_COUPON_FKID === null ?
                                                "-" : <CButton
                                                    className="OrderBtn"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={() => {
                                                        ViewCoupon(i.COUPON_PKID, i.COUPONS_TYPE_NAME, i.COUPONS_NAME, i.COUPONS_CODE, i.COUPONS_PRICE_OR_PERCENTAGE, i.COUPONS_DISCOUNT, i.COUPONS_VALIDITY, i.COUPONS_VALIDITY_DATE, i.COUPONS_ACTIVE);
                                                    }}
                                                >
                                                    {i.COUPONS_NAME}
                                                </CButton>
                                            }
                                        </td>
                                    ),

                                    "Order Quantity": (i) => (
                                        <td>
                                            <CButton
                                                className="OrderBtn"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    history.push("/OrderItems", {
                                                        data: i,
                                                    });
                                                }}
                                            >
                                                {i.TotalQuantity}
                                            </CButton>
                                        </td>
                                    ),
                                    "Customer Name": (i) => (
                                        <td>
                                            <CButton
                                                className="OrderBtn"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewCustomer(i.CUSTOMER_PKID, i.CUSTOMER_NAME, i.CUSTOMER_CONTACT_NUMBER, i.CUSTOMER_GST_TYPE, i.CUSTOMER_EMAIL, i.CUSTOMER_ADDRESS, i.CUSTOMER_TYPE_NAME);
                                                }}
                                            >
                                                {i.CUSTOMER_NAME}
                                            </CButton>
                                        </td>
                                    ),
                                    "Pickup ID": (i) => (
                                        <td>
                                            {i.ORDER_IS_PICKUP_ID === "" || i.ORDER_IS_PICKUP_ID === null ?
                                                "-" : <CButton
                                                    className="OrderBtn"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={() => {
                                                        ViewPickupDetails(i.ORDER_IS_PICKUP_ID);
                                                    }}
                                                >
                                                    {i.ORDER_IS_PICKUP_ID}
                                                </CButton>
                                            }
                                        </td>
                                    ),

                                    "Status": (i) => {
                                        if (i.ORDER_STATUS === "0" || i.ORDER_STATUS === 0) {
                                            return (
                                                <td>
                                                    <span className="status_zero">Pending</span>
                                                </td>
                                            );
                                        }
                                        else if (i.ORDER_STATUS === "1" || i.ORDER_STATUS === 1) {
                                            return (
                                                <td>
                                                    <span className="status_one">Sent to Factory</span>
                                                </td>
                                            );
                                        }
                                        else if (i.ORDER_STATUS === "2" || i.ORDER_STATUS === 2) {
                                            return (
                                                <td>
                                                    <span className="status_two">Received in Factory</span>
                                                </td>
                                            );
                                        }
                                        else if (i.ORDER_STATUS === "3" || i.ORDER_STATUS === 3) {
                                            return (
                                                <td>
                                                    <span className="status_three">Returned to Outlet</span>
                                                </td>
                                            );
                                        }
                                        else if (i.ORDER_STATUS === "4" || i.ORDER_STATUS === 4) {
                                            return (
                                                <td>
                                                    <span className="status_four">Ready for Delivery</span>
                                                </td>
                                            );
                                        }
                                        else if (i.ORDER_STATUS === "5" || i.ORDER_STATUS === 5) {
                                            return (
                                                <td>
                                                    <span className="status_five">Delivered</span>
                                                </td>
                                            );
                                        }
                                        else if (i.ORDER_STATUS === "6" || i.ORDER_STATUS === 6) {
                                            return (
                                                <td>
                                                    <span className="status_six">Out for Delivery</span>
                                                </td>
                                            );
                                        }
                                    },
                                    "Driver": (i) => {
                                        if (i.ORDER_STATUS === "5" || i.ORDER_STATUS === 5) {
                                            if (i.ASSIGNED_DOOR_DELIVERY_STATUS === "" || i.ASSIGNED_DOOR_DELIVERY_STATUS === null) {
                                                return (
                                                    <td>
                                                        <span>-</span>
                                                    </td>
                                                )
                                            }
                                            else {
                                                return (
                                                    <td>
                                                        <CButton
                                                            className="OrderBtn"
                                                            style={{ fontSize: "12px" }}
                                                            onClick={() => {
                                                                ViewAssignedDriver(i);
                                                            }}
                                                        >
                                                            {i.DRIVER_NAME}
                                                        </CButton>
                                                    </td>
                                                )
                                            }
                                        }
                                        else {
                                            if (i.ASSIGNED_DOOR_DELIVERY_STATUS === "" || i.ASSIGNED_DOOR_DELIVERY_STATUS === null) {
                                                return (
                                                    <td>
                                                        <span>-</span>
                                                    </td>
                                                )
                                            }
                                            else {
                                                return (
                                                    <td>
                                                        <CButton
                                                            className="OrderBtn"
                                                            style={{ fontSize: "12px" }}
                                                            onClick={() => {
                                                                ViewAssignedDriver(i);
                                                            }}
                                                        >
                                                            {i.DRIVER_NAME}
                                                        </CButton>
                                                    </td>
                                                )
                                            }
                                        }
                                    },
                                    "Bad Debt": (i) => {
                                        if (i.ORDER_BAD_DEBITS === "0" || i.ORDER_BAD_DEBITS === 0) {
                                            return (
                                                <td>
                                                    <CButton
                                                        className="btn btn-primary"
                                                        style={{ fontSize: "12px" }}
                                                        onClick={() => {
                                                            addBadDebt(i);
                                                        }}
                                                    >
                                                        Add Bad Debt
                                                    </CButton>
                                                </td>
                                            )
                                        }
                                        else {
                                            return (
                                                <td>
                                                    <CButton
                                                        className="btn btn-primary"
                                                        style={{ fontSize: "12px" }}
                                                        onClick={() => {
                                                            viewBadDebt(i);
                                                        }}
                                                    >
                                                        View
                                                    </CButton>
                                                </td>
                                            )
                                        }
                                    },
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CModal show={block} onClose={() => setblock(!block)} color="dark" style={{ height: 560, width: 600 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Outlet Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store ID</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.ID}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.Name}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Address</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.Address}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store City</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.City}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Phone</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.Phone}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Price Tier</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.PriceTier}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Factory Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.FactoryName}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Route Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.RouteName}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Category</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.ServiceCat}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Type</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.ServiceType}</span>
                            </CCol>
                        </CFormGroup>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock(!block)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal show={block1} onClose={() => setblock1(!block1)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Coupon Details</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ height: "330px" }}>
                    <div>
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Type</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Type}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Name}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Code</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Code}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Price/Percentage</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Price}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Discount</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Discount}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Validity</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Validity}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Active</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Active === "true" || CouponFields.Active === true ? "Active" : "-"}</span>
                            </CCol>
                        </CFormGroup>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock1(!block1)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal show={block2} onClose={() => setblock2(!block2)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Customer Details</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ height: "330px" }}>
                    <div>
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Name}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Phone</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Phone}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Email</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Email}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Address</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Address}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer GST No.</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Gst}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Type</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Type}</span>
                            </CCol>
                        </CFormGroup>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock2(!block2)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal show={block3} onClose={() => setblock3(!block3)} color="dark" style={{ height: 560 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Pickup Details</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ height: "330px" }}>
                    {PickupData.length > 0 ?
                        <div>
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Code</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_CODE}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Created Time</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_TIME}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Created By</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_CREATED_BY}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Quantity</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_QUANTITY}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Address</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_ADDRESS}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            {
                                PickupData[0].PICKUP_CUSTOMER_NAME === "" || PickupData[0].PICKUP_CUSTOMER_NAME === null ? null :
                                    <React.Fragment>
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_CUSTOMER_NAME}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Phone</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_CUSTOMER_PHONE}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                    </React.Fragment>
                            }
                        </div>
                        : null
                    }

                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock3(!block3)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal show={block4} onClose={() => setblock4(!block4)} color="dark" style={{ height: 380 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Assigned Driver</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <div>
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Name</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{DriverForEdit.DRIVER_NAME === "" || DriverForEdit.DRIVER_NAME === null ? "-" : DriverForEdit.DRIVER_NAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Username</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{DriverForEdit.DRIVER_USERNAME == "" || DriverForEdit.DRIVER_USERNAME == null ? "-" : DriverForEdit.DRIVER_USERNAME}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Contact No.</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{DriverForEdit.DRIVER_PHONE == "" || DriverForEdit.DRIVER_PHONE == null ? "-" : DriverForEdit.DRIVER_PHONE}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Email</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{DriverForEdit.DRIVER_EMAIL == "" || DriverForEdit.DRIVER_EMAIL == null ? "-" : DriverForEdit.DRIVER_EMAIL}</span>
                                    </CCol>
                                </CFormGroup>
                            </div>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock4(!block4)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal show={block5} onClose={() => setblock5(!block5)} color="dark" style={{
                height: 420,
                width: "200%",
                marginLeft: "-50%",
                marginTop: "20%"
            }}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Bad Debt</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <CRow>
                                <CCol md="6">
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order No.</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.ORDER_ORDER_NUMBER}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order Date</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.ORDER_DATE == "" || BadDebtData.ORDER_DATE == null ? "-" : SplitDate1(BadDebtData.ORDER_DATE)}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.CUSTOMER_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Phone</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.CUSTOMER_CONTACT_NUMBER}</span>
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                                <CCol md="6">
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Outlet Name</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.STORE_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Outlet Phone</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.STORE_PHONE}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Category</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.SERVICE_CATEGORY_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Type</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.SERVICE_TYPE_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <CDropdownDivider />
                            <CRow style={{ marginTop: 10 }}>
                                <CCol md="12">
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Actual Price</CLabel>
                                            <CInput
                                                type="text"
                                                id="couponName"
                                                name="couponName"
                                                value={BadDebtData.ORDER_GRAND_TOTAL_AMOUNT}
                                                readOnly="true"
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel htmlFor="">Bad Debt <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                type="text"
                                                id="couponName"
                                                name="couponName"
                                                value={BadDebt}
                                                placeholder="Enter Bad Debt Amount"
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, "");
                                                    if (parseFloat(BadDebtData.ORDER_GRAND_TOTAL_AMOUNT) < parseFloat(value)) {
                                                        setBadDebt(BadDebt);
                                                        Toast.fire({
                                                            icon: "error",
                                                            title: "Entered Amount is more than Actaul Amount!",
                                                        });
                                                    }
                                                    else {
                                                        setBadDebt(value);
                                                    }
                                                }}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel htmlFor="">Final Amount</CLabel>
                                            <CInput
                                                id="text-input1"
                                                name="text-input"
                                                type="text"
                                                readOnly="true"
                                                value={(parseFloat(BadDebtData.ORDER_GRAND_TOTAL_AMOUNT) - parseFloat(BadDebt == "" || BadDebt == null ? 0 : BadDebt)).toFixed(2)}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-success" style={{ fontSize: "13px" }} onClick={() => addBadDebtFunc()}>
                        Add Bad Debit
                    </CButton>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock5(!block5)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal show={block6} onClose={() => setblock6(!block6)} color="dark" style={{
                height: 420,
                width: "200%",
                marginLeft: "-50%",
                marginTop: "20%"
            }}>
                <CModalHeader closeButton>
                    <CModalTitle>View Bad Debt</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <CRow>
                                <CCol md="6">
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order No.</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.ORDER_ORDER_NUMBER}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order Date</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.ORDER_DATE == "" || BadDebtData.ORDER_DATE == null ? "-" : SplitDate1(BadDebtData.ORDER_DATE)}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.CUSTOMER_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Phone</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.CUSTOMER_CONTACT_NUMBER}</span>
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                                <CCol md="6">
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Outlet Name</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.STORE_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Outlet Phone</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.STORE_PHONE}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Category</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.SERVICE_CATEGORY_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Type</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{BadDebtData.SERVICE_TYPE_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <CDropdownDivider />
                            <CRow style={{ marginTop: 10 }}>
                                <CCol md="12">
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Actual Price</CLabel>
                                            <CInput
                                                type="text"
                                                id="couponName"
                                                name="couponName"
                                                value={BadDebtData.ORDER_GRAND_TOTAL_AMOUNT}
                                                readOnly="true"
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel htmlFor="">Bad Debt <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                type="text"
                                                id="couponName"
                                                name="couponName"
                                                value={BadDebt}
                                                placeholder="Enter Bad Debt Amount"
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, "");
                                                    if (parseFloat(BadDebtData.ORDER_GRAND_TOTAL_AMOUNT) < parseFloat(value)) {
                                                        setBadDebt(BadDebt);
                                                        Toast.fire({
                                                            icon: "error",
                                                            title: "Entered Amount is more than Actaul Amount!",
                                                        });
                                                    }
                                                    else {
                                                        setBadDebt(value);
                                                    }
                                                }}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel htmlFor="">Final Amount</CLabel>
                                            <CInput
                                                id="text-input1"
                                                name="text-input"
                                                type="text"
                                                readOnly="true"
                                                value={(parseFloat(BadDebtData.ORDER_GRAND_TOTAL_AMOUNT) - parseFloat(BadDebt == "" || BadDebt == null ? 0 : BadDebt)).toFixed(2)}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-success" style={{ fontSize: "13px" }} onClick={() => updateBadDebtFunc()}>
                        Update Bad Debit
                    </CButton>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock6(!block6)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default BadDebtAdjustment;
