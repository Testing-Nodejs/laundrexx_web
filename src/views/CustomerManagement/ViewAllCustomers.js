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
    CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Sl No." },
    { key: "Customer Name" },
    { key: "Outlet" },
    { key: "Outlet Code" },
    { key: "Coupon" },
    { key: "Address" },
    { key: "Contact No." },
    { key: "Alt-Contact No." },
    { key: "Email" },
    { key: "GST Type" },
    { key: "GST No." },
    { key: "Customer Type" },
    { key: "Reference" },
    { key: "Added Date" },
];

const ViewAllCustomers = () => {
    const history = useHistory();
    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");

    const [ResponseData, setResponseData] = useState([]);
    const [ExcelData, setExcelData] = useState([]);
    const [ShippingAddress, setShippingAddress] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [toDate, settoDate] = useState("");
    const [block, setblock] = useState(false);
    const [YearsList, setYearsList] = useState();
    const [OutletList, setOutletList] = useState();
    const [Year, setYear] = useState("-");
    const [block1, setblock1] = useState(false);
    const [CouponName, setCouponName] = useState("");
    const [CouponCode, setCouponCode] = useState("");
    const [CouponDIS, setCouponDIS] = useState("");
    const [CouponAvailed, setCouponAvailed] = useState("");
    const [dates, setDates] = useState(false);
    const [Outlet, setOutlet] = useState("-");

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
        if (UserType == "Manager") {
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
    const getAllCustomers = () => {
        document.getElementById("divLoading").className = "show";
        if (UserType == "Manager") {
            axios.get(MyApiUrl + "GetAllCustomersForManager/" + UserID + "").then((response) => {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Customer Name": item.CUSTOMER_NAME,
                        "Outlet": item.STORE_NAME,
                        "Outlet Code": item.STORE_CODE,
                        "Contact No.": item.CUSTOMER_CONTACT_NUMBER,
                        "Alt-Contact No.": item.CUSTOMER_ALT_NUMBER == "" || item.CUSTOMER_ALT_NUMBER == null ? "-" : item.CUSTOMER_ALT_NUMBER,
                        "Email": item.CUSTOMER_EMAIL,
                        "GST Type": item.CUSTOMER_GST_TYPE == "" || item.CUSTOMER_GST_TYPE == null ? "-" : item.CUSTOMER_GST_TYPE,
                        "GST No.": item.CUSTOMER_GST_NUMBER == "" || item.CUSTOMER_GST_NUMBER == null ? "-" : item.CUSTOMER_GST_NUMBER,
                        "Customer Type": item.CUSTOMER_TYPE_NAME,
                        "Reference": item.CUSTOMER_HOW_HEAR_US,
                        "Added Date": SplitDate(item.CUSTOMER_CREATED_DATE),
                    };
                });
                setResponseData(items);
                setExcelData(response.data);
                document.getElementById("divLoading").className = "hide";
            })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            axios.get(MyApiUrl + "Customers").then((response) => {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Customer Name": item.CUSTOMER_NAME,
                        "Outlet": item.STORE_NAME,
                        "Outlet Code": item.STORE_CODE,
                        "Contact No.": item.CUSTOMER_CONTACT_NUMBER,
                        "Alt-Contact No.": item.CUSTOMER_ALT_NUMBER == "" || item.CUSTOMER_ALT_NUMBER == null ? "-" : item.CUSTOMER_ALT_NUMBER,
                        "Email": item.CUSTOMER_EMAIL,
                        "GST Type": item.CUSTOMER_GST_TYPE == "" || item.CUSTOMER_GST_TYPE == null ? "-" : item.CUSTOMER_GST_TYPE,
                        "GST No.": item.CUSTOMER_GST_NUMBER == "" || item.CUSTOMER_GST_NUMBER == null ? "-" : item.CUSTOMER_GST_NUMBER,
                        "Customer Type": item.CUSTOMER_TYPE_NAME,
                        "Reference": item.CUSTOMER_HOW_HEAR_US,
                        "Added Date": SplitDate(item.CUSTOMER_CREATED_DATE),
                    };
                });
                setResponseData(items);
                setExcelData(response.data);
                document.getElementById("divLoading").className = "hide";
            })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const ViewShippingAddress = (i) => {
        setblock(!block);
        setShippingAddress(i);
    };
    const ViewCoupon = (COUPON_NAME, COUPON_CODE, COUPON_DISCOUNT, COUPON_AVAILED) => {
        setblock1(!block1);
        setCouponName(COUPON_NAME);
        setCouponCode(COUPON_CODE);
        setCouponDIS(COUPON_DISCOUNT);
        setCouponAvailed(COUPON_AVAILED);
    };

    const filterData = (outlet, month, year) => {
        console.log("Hii");
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
        document.getElementById("divLoading").className = "show";
        if (UserType == "Manager") {
            const object = {
                ManagerID: UserID,
                Outlet: outlet,
                Month: month,
                Year: year,
                FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
                ToDate: toDate == "" || toDate == null ? "-" : toDate,
            }
            axios.post(MyApiUrl + "GetAllCustomersWithFilterByManager", object).then((response) => {
                if (response.data.length > 0) {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Customer Name": item.CUSTOMER_NAME,
                            "Outlet": item.STORE_NAME,
                            "Outlet Code": item.STORE_CODE,
                            "Contact No.": item.CUSTOMER_CONTACT_NUMBER,
                            "Alt-Contact No.": item.CUSTOMER_ALT_NUMBER == "" || item.CUSTOMER_ALT_NUMBER == null ? "-" : item.CUSTOMER_ALT_NUMBER,
                            "Email": item.CUSTOMER_EMAIL,
                            "GST Type": item.CUSTOMER_GST_TYPE == "" || item.CUSTOMER_GST_TYPE == null ? "-" : item.CUSTOMER_GST_TYPE,
                            "GST No.": item.CUSTOMER_GST_NUMBER == "" || item.CUSTOMER_GST_NUMBER == null ? "-" : item.CUSTOMER_GST_NUMBER,
                            "Customer Type": item.CUSTOMER_TYPE_NAME,
                            "Reference": item.CUSTOMER_HOW_HEAR_US,
                            "Added Date": SplitDate(item.CUSTOMER_CREATED_DATE),
                        };
                    });
                    setExcelData(response.data);
                    setResponseData(items);
                    document.getElementById("divLoading").className = "hide";
                } else {
                    setExcelData([]);
                    setResponseData([]);
                    document.getElementById("divLoading").className = "hide";
                }
            })

                .catch((error) => {
                    console.log(error);
                });
        } else {
            const object = {
                Outlet: outlet,
                Month: month,
                Year: year,
                FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
                ToDate: toDate == "" || toDate == null ? "-" : toDate,
            }
            console.log(object);
            axios.post(MyApiUrl + "AllCustomersFilter", object).then((response) => {
                if (response.data.length > 0) {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Customer Name": item.CUSTOMER_NAME,
                            "Outlet": item.STORE_NAME,
                            "Outlet Code": item.STORE_CODE,
                            "Contact No.": item.CUSTOMER_CONTACT_NUMBER,
                            "Alt-Contact No.": item.CUSTOMER_ALT_NUMBER == "" || item.CUSTOMER_ALT_NUMBER == null ? "-" : item.CUSTOMER_ALT_NUMBER,
                            "Email": item.CUSTOMER_EMAIL,
                            "GST Type": item.CUSTOMER_GST_TYPE == "" || item.CUSTOMER_GST_TYPE == null ? "-" : item.CUSTOMER_GST_TYPE,
                            "GST No.": item.CUSTOMER_GST_NUMBER == "" || item.CUSTOMER_GST_NUMBER == null ? "-" : item.CUSTOMER_GST_NUMBER,
                            "Customer Type": item.CUSTOMER_TYPE_NAME,
                            "Reference": item.CUSTOMER_HOW_HEAR_US,
                            "Added Date": SplitDate(item.CUSTOMER_CREATED_DATE),
                        };
                    });
                    setExcelData(response.data);
                    setResponseData(items);
                    document.getElementById("divLoading").className = "hide";
                } else {
                    setExcelData([]);
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
        const FinalDate = OrderDates[2] + " " + getMonthName(OrderDates[1]) + ", " + OrderDates[0];
        return FinalDate;
    }
    const FilterReset = () => {
        getAllCustomers();
        setfromDate("");
        settoDate("");
        setOmonth("-");
        getYear_Outlet();
        setOutlet("-");
        setDates(false);
    };

    const ToExcel = () => {
        var cnt = 0;
        // eslint-disable-next-line no-array-constructor
        var csvData = new Array();
        csvData.push(
            '"Sl No","Customer Name","Outlet","Outlet Code","Coupon Name","Coupon Code","Coupon Discount","Coupon Availed","Address","Contact No.","Alt-Contact No.","Email","GST Type","GST No.","Customer Type","Reference","Added Date"'
        );
        ExcelData.map((item) => {
            const couponAvailed = item.CUSTOMER_COUPON_AVAILED == true ? "Coupon Availed" : "Coupon not Availed";
            const altNo = item.CUSTOMER_ALT_NUMBER == "" || item.CUSTOMER_ALT_NUMBER == null ? "-" : item.CUSTOMER_ALT_NUMBER;
            const gstType = item.CUSTOMER_GST_TYPE == "" || item.CUSTOMER_GST_TYPE == null ? "-" : item.CUSTOMER_GST_TYPE;
            const gstNo = item.CUSTOMER_GST_NUMBER == "" || item.CUSTOMER_GST_NUMBER == null ? "-" : item.CUSTOMER_GST_NUMBER;
            return (
                cnt++,
                csvData.push(
                    '"' +
                    cnt +
                    '","' +
                    item.CUSTOMER_NAME +
                    '","' +
                    item.STORE_NAME +
                    '","' +
                    item.STORE_CODE +
                    '","' +
                    item.CUSTOMER_COUPON_NAME +
                    '","' +
                    item.CUSTOMER_COUPON_CODE +
                    '","' +
                    item.CUSTOMER_COUPON_DISCOUNT +
                    '","' +
                    couponAvailed +
                    '","' +
                    item.CUSTOMER_ADDRESS +
                    '","' +
                    item.CUSTOMER_CONTACT_NUMBER +
                    '","' +
                    altNo +
                    '","' +
                    item.CUSTOMER_EMAIL +
                    '","' +
                    gstType +
                    '","' +
                    gstNo +
                    '","' +
                    item.CUSTOMER_TYPE_NAME +
                    '","' +
                    item.CUSTOMER_HOW_HEAR_US +
                    '","' +
                    SplitDate(item.CUSTOMER_CREATED_DATE) +
                    '"'
                )
            );
        });

        const fileName = "Customers.csv";
        const buffer = csvData.join("\n");
        const blob = new Blob([buffer], {
            type: "text/csv;charset=utf8;",
        });

        //IN IE
        const link = document.createElement("a");
        if (link.download !== undefined) {
            link.setAttribute("href", window.URL.createObjectURL(blob));
            link.setAttribute("download", fileName);
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
        }
    };

    React.useEffect(() => {
        getAllCustomers();
        getYear_Outlet();
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
            <h1 id="ccmaster">View All Customers</h1>
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
                                            // filterData(event.target.value, Omonth, Year);
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
                                            // filterData(Outlet, Omonth, event.target.value);
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
                                            // filterData(Outlet, event.target.value, Year);
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
                                <CCol col="6">View All Customers</CCol>
                                <CCol col="6">
                                    <CButton
                                        onClick={ToExcel}
                                        color="info"
                                        style={{
                                            marginTop: "0%",
                                            marginBottom: "0%",
                                            float: "right"
                                        }}
                                        size="sm"
                                    >
                                        Export To Excel
                                    </CButton>
                                </CCol>
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
                                    "Address": (i) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewShippingAddress(i.CUSTOMER_ADDRESS);
                                                }}
                                            >
                                                View
                                            </CButton>
                                        </td>
                                    ),
                                    "Coupon": (i) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewCoupon(i.CUSTOMER_COUPON_NAME, i.CUSTOMER_COUPON_CODE, i.CUSTOMER_COUPON_DISCOUNT, i.CUSTOMER_COUPON_AVAILED);
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
            <CModal show={block} onClose={() => setblock(!block)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Customer Address</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Customer Address</CLabel>
                                    <CTextarea
                                        id="text-input"
                                        name="text-input"
                                        value={ShippingAddress}
                                        readOnly={true}
                                    />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock(!block)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal show={block1} onClose={() => setblock1(!block1)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Customer Welcome Coupon</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ height: "330px" }}>
                    <CRow>
                        <CCol md="12">
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Coupon Name</CLabel>
                                    <CInput
                                        id="text-input"
                                        name="text-input"
                                        value={CouponName}
                                        readOnly={true}
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Coupon Code</CLabel>
                                    <CInput
                                        id="text-input"
                                        name="text-input"
                                        value={CouponCode}
                                        readOnly={true}
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Coupon Discount</CLabel>
                                    <CInput
                                        id="text-input"
                                        name="text-input"
                                        value={CouponDIS}
                                        readOnly={true}
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Coupon Availed</CLabel>
                                    {CouponAvailed == true ?
                                        <CInput
                                            id="text-input"
                                            name="text-input"
                                            value="Coupon Availed"
                                            readOnly={true}
                                            style={{ color: "red" }}
                                        />
                                        :
                                        <CInput
                                            id="text-input"
                                            name="text-input"
                                            value="Coupon not Availed"
                                            readOnly={true}
                                            style={{ color: "green" }}
                                        />
                                    }
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock1(!block1)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ViewAllCustomers;
