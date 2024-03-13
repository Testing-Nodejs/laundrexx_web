/* eslint-disable no-restricted-globals */
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
    { key: "Modification Status" },
    { key: "Order Number" },
    { key: "Order Date" },
    { key: "Due Date" },
    { key: "Order Invoice Number" },
    { key: "Order Quantity" },
    { key: "Outlet" },
    { key: "Customer Name" },
    { key: "Service Category" },
    { key: "Service Type" },
    { key: "Pickup Request" },
    { key: "Pickup ID" },
    { key: "Coupon" },
    { key: "Door Delivery" },
    { key: "Order Amount" },
    { key: "Order Surcharge" },
    { key: "Order Discount" },
    { key: "Total Order Amount" },
    { key: "CGST" },
    { key: "SGST" },
    { key: "Total Invoice Value" },
    { key: "Round Invoice Value" },
    { key: "Grand Total Amount" },
];

const OrderDetailsReport = () => {

    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");

    const [ResponseData, setResponseData] = useState([]);
    const [ExcelData, setExcelData] = useState([]);
    const [PickupData, setPickupData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [toDate, settoDate] = useState("");

    const [YearsList, setYearsList] = useState();
    const [OutletList, setOutletList] = useState();
    const [Year, setYear] = useState("");
    const [block, setblock] = useState(false);
    const [block1, setblock1] = useState(false);
    const [block2, setblock2] = useState(false);
    const [block3, setblock3] = useState(false);
    const [dates, setDates] = useState(false);
    const [Outlet, setOutlet] = useState("-");

    const [Time, setTime] = useState();
    const [CDate, setCDate] = useState();

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
    const getAllOrders = () => {
        document.getElementById("divLoading").className = "show";
        if (UserType == "Manager") {
            axios.get(MyApiUrl + "AllOrdersForManager/" + UserID + "").then((response) => {
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
                        "Order Surcharge": item.ORDER_TOTAL_SUR_CHARGE,
                        "Order Discount": item.ORDER_DISCOUNT,
                        "Total Order Amount": item.ORDER_TOTAL_ORDER_AMOUNT,
                        "CGST": item.ORDER_CGST,
                        "SGST": item.ORDER_SGST,
                        "Total Invoice Value": item.ORDER_TOTAL_INVOICE_VALUE,
                        "Round Invoice Value": item.ORDER_ROUND_OFF_INVOICE,
                        "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
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
            axios.get(MyApiUrl + "AllOrders").then((response) => {
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
                        "Order Surcharge": item.ORDER_TOTAL_SUR_CHARGE,
                        "Order Discount": item.ORDER_DISCOUNT,
                        "Total Order Amount": item.ORDER_TOTAL_ORDER_AMOUNT,
                        "CGST": item.ORDER_CGST,
                        "SGST": item.ORDER_SGST,
                        "Total Invoice Value": item.ORDER_TOTAL_INVOICE_VALUE,
                        "Round Invoice Value": item.ORDER_ROUND_OFF_INVOICE,
                        "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
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
                        "Customer Name": item.CUSTOMER_NAME,
                        "Customer Phone": item.CUSTOMER_CONTACT_NUMBER,
                        "Driver Name": item.DRIVER_NAME,
                        "Driver Phone": item.DRIVER_PHONE,
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
            axios.post(MyApiUrl + "AllOrdersFilterForManager", object).then((response) => {
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
                            "Order Surcharge": item.ORDER_TOTAL_SUR_CHARGE,
                            "Order Discount": item.ORDER_DISCOUNT,
                            "Total Order Amount": item.ORDER_TOTAL_ORDER_AMOUNT,
                            "CGST": item.ORDER_CGST,
                            "SGST": item.ORDER_SGST,
                            "Total Invoice Value": item.ORDER_TOTAL_INVOICE_VALUE,
                            "Round Invoice Value": item.ORDER_ROUND_OFF_INVOICE,
                            "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                        };
                    });
                    setResponseData(items);
                    setExcelData(response.data);
                    document.getElementById("divLoading").className = "hide";
                } else {
                    setResponseData([]);
                    setExcelData([]);
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
            axios.post(MyApiUrl + "AllOrdersFilter", object).then((response) => {
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
                            "Order Surcharge": item.ORDER_TOTAL_SUR_CHARGE,
                            "Order Discount": item.ORDER_DISCOUNT,
                            "Total Order Amount": item.ORDER_TOTAL_ORDER_AMOUNT,
                            "CGST": item.ORDER_CGST,
                            "SGST": item.ORDER_SGST,
                            "Total Invoice Value": item.ORDER_TOTAL_INVOICE_VALUE,
                            "Round Invoice Value": item.ORDER_ROUND_OFF_INVOICE,
                            "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                        };
                    });
                    setResponseData(items);
                    setExcelData(response.data);
                    document.getElementById("divLoading").className = "hide";
                } else {
                    setResponseData([]);
                    setExcelData([]);
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


    React.useEffect(() => {
        getAllOrders();
        getYear_Outlet();
    }, []);

    const ToExcel = () => {
        var cnt = 0;
        // eslint-disable-next-line no-array-constructor
        var csvData = new Array();
        csvData.push(
            '"Sl No","Status","Order Number","Order Date","Due Date","Order Invoice Number","Quantity","Quantity","Outlet","Outlet Phone","Customer Name","Contact Phone","Service Category","Service Type","Pickup Request","Pickup ID","Pickup Address","Pickup Date","Driver Name","Coupon","Coupon Discount","Bulk Item","Door Delivery","Order Amount","Order Discount","Surcharge","Total Order Amount","CGST","SGST","Total Invoice Value","Round Invoice Value","Grand TotalAmount"'
        );
        ExcelData.map((item) => {
            const DoorDelivery = item.ORDER_DOOR_DELIVERY === "true" || item.ORDER_DOOR_DELIVERY === true ? "Yes" : "No";
            const Pickup = item.ORDER_IS_PICKUP === "true" || item.ORDER_IS_PICKUP === true ? "Yes" : "No";
            const BulkItem = item.PICKUP_BULK_ITEMS === "true" || item.PICKUP_BULK_ITEMS === true ? "Yes" : "No";
            const Coupon = item.COUPONS_NAME === "" || item.COUPONS_NAME === null ? "-" : item.COUPONS_NAME;
            const CouponDiscount = item.COUPONS_DISCOUNT === "" || item.COUPONS_DISCOUNT === null ? "-" : item.COUPONS_DISCOUNT;
            const PickupId = item.ORDER_IS_PICKUP_ID === "" || item.ORDER_IS_PICKUP_ID === null ? "-" : item.ORDER_IS_PICKUP_ID;
            let Status = "";
            if (item.ORDER_STATUS === "0" || item.ORDER_STATUS === 0) {
                Status = "Pending";
            }
            else if (item.ORDER_STATUS === "1" || item.ORDER_STATUS === 1) {
                Status = "Sent to Factory";
            }
            else if (item.ORDER_STATUS === "2" || item.ORDER_STATUS === 2) {
                Status = "Received in Factory";
            }
            else if (item.ORDER_STATUS === "3" || item.ORDER_STATUS === 3) {
                Status = "Returned to Outlet";
            }
            else if (item.ORDER_STATUS === "4" || item.ORDER_STATUS === 4) {
                Status = "Ready for Delivery";
            }
            else if (item.ORDER_STATUS === "5" || item.ORDER_STATUS === 5) {
                Status = "Delivered";
            }
            else if (item.ORDER_STATUS === "6" || item.ORDER_STATUS === 6) {
                Status = "Out for Delivery";
            }
            return (
                cnt++,
                csvData.push(
                    '"' +
                    cnt +
                    '","' +
                    Status +
                    '","' +
                    item.ORDER_ORDER_NUMBER +
                    '","' +
                    SplitDate1(item.ORDER_DATE) +
                    '","' +
                    SplitDate1(item.ORDER_DUE_DATE) +
                    '","' +
                    item.ORDER_INVOICE_NUMBER +
                    '","' +
                    item.TotalQuantity +
                    '","' +
                    item.TotalCount +
                    '","' +
                    item.STORE_NAME +
                    '","' +
                    item.STORE_PHONE +
                    '","' +
                    item.CUSTOMER_NAME +
                    '","' +
                    item.CUSTOMER_CONTACT_NUMBER +
                    '","' +
                    item.SERVICE_CATEGORY_NAME +
                    '","' +
                    item.SERVICE_TYPE_NAME +
                    '","' +
                    Pickup +
                    '","' +
                    PickupId +
                    '","' +
                    item.PICKUP_ADDRESS +
                    '","' +
                    item.PICKUP_DATE +
                    '","' +
                    item.DRIVER_NAME +
                    '","' +
                    Coupon +
                    '","' +
                    CouponDiscount +
                    '","' +
                    BulkItem +
                    '","' +
                    DoorDelivery +
                    '","' +
                    item.ORDER_AMOUNT +
                    '","' +
                    item.ORDER_TOTAL_SUR_CHARGE +
                    '","' +
                    item.ORDER_DISCOUNT +
                    '","' +
                    item.ORDER_TOTAL_ORDER_AMOUNT +
                    '","' +
                    item.ORDER_CGST +
                    '","' +
                    item.ORDER_SGST +
                    '","' +
                    item.ORDER_TOTAL_INVOICE_VALUE +
                    '","' +
                    item.ORDER_ROUND_OFF_INVOICE +
                    '","' +
                    item.ORDER_GRAND_TOTAL_AMOUNT +
                    '","' +
                    '"'
                )
            );
        });

        const fileName = "AllOrdersReport.csv";
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
    const printReport = async () => {
        await GetDates();
        // Calculate the width of the screen
        const screenWidth = screen.width;

        // Calculate the left position for the tags window
        const printWindowLeft = Math.floor((screenWidth - 780) / 4);

        // Open the windows with the calculated positions
        const printWindow = window.open("", "Order Report Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + printWindowLeft + "");

        printWindow.document.write('<html><head><title>Order Report</title>');
        printWindow.document.write('<style>@page { size: landscape; }</style>');

        printWindow.document.write('</head><body style="margin: 5px;"><b style="font-size: 14px;">Order report</b><br/>');
        printWindow.document.write(document.getElementById("printWindow").innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    };

    let footerQuantity = 0;
    let footerCount = 0;
    let footerAmount = 0.00;
    let footerSurcharge = 0.00;
    let footerDiscount = 0.00;
    let footerTotalAmount = 0.00;
    let footerCGST = 0.00;
    let footerSGST = 0.00;
    let footerTotalInvoice = 0.00;
    let footerRoundOff = 0.00;
    let footerGrandTotal = 0.00;

    const GetDates = () => {
        var showdate = new Date();
        const mon = (showdate.getMonth() + 1).toString().padStart(2, "0");
        setCDate(
            showdate.getDate().toString().padStart(2, "0") +
            "-" +
            mon +
            "-" +
            showdate.getUTCFullYear()
        );
        setTime(showdate.toLocaleTimeString());
    };

    return (
        <div id="city">
            <div id="divLoading"> </div>

            <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "100%" }} id="printWindow">
                {ResponseData.length > 0 ?
                    <div style={{ textAlign: "center" }}>
                        <div id="bills" style={{ width: "100%", height: "30px", fontSize: 14 }}>
                            <p style={{ textAlign: "left" }}>Total Bills : <b>{ResponseData.length}</b></p>
                        </div><br />

                        <table id="grdpaymentDetails" border="1" cellspacing="2px" cellpadding="2px" style={{ borderRight: "1px solid #999999", fontSize: 12, borderCollapse: "collapse" }} class="txtcss totalTable">
                            <thead>
                                <tr>
                                    <td colspan="21" style={{
                                        fontWeight: "bold",
                                        color: "black", bordeBottom: "2px solid #999", padding: 5
                                    }}>
                                        Item Details
                                        <span style={{ float: "right" }}>Time : <span class="time" style={{ font: "bold", float: "right" }}>{CDate} {Time}</span> </span>
                                    </td>
                                </tr>
                                <tr style={{ color: "#000", fontWeight: "bold" }}>
                                    <th scope="col" style={{ width: "1%" }}>Sl No.</th>
                                    <th scope="col" style={{ width: "8%" }}>Order No.</th>
                                    <th scope="col" style={{ width: "6%" }}>Date</th>
                                    <th scope="col" style={{ width: "9%" }}>Customer Name</th>
                                    <th scope="col" style={{ width: "7%" }}>Phone Number</th>
                                    <th scope="col" style={{ width: "6%" }}>Due Date</th>
                                    <th scope="col" style={{ width: "4%" }}>Quantity</th>
                                    <th scope="col" style={{ width: "4%" }}>Count</th>
                                    <th scope="col" style={{ width: "4%" }}>Order Amount</th>
                                    <th scope="col" style={{ width: "4%" }}>Surcharge</th>
                                    <th scope="col" style={{ width: "4%" }}>Discount</th>
                                    <th scope="col" style={{ width: "4%" }}>Total Amount</th>
                                    <th scope="col" style={{ width: "3%" }}>CGST</th>
                                    <th scope="col" style={{ width: "3%" }}>SGST</th>
                                    <th scope="col" style={{ width: "4%" }}>Total Invoice</th>
                                    <th scope="col" style={{ width: "3%" }}>Round Off</th>
                                    <th scope="col" style={{ width: "3%" }}>Grand Total</th>
                                    <th scope="col" style={{ width: "5%" }}>Outlet</th>
                                    <th scope="col" style={{ width: "5%" }}>Service Category</th>
                                    <th scope="col" style={{ width: "5%" }}>Service Type</th>
                                    <th scope="col" style={{ width: "5%" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ResponseData.map((item, index) => {
                                    footerQuantity = footerQuantity + item.TotalQuantity;
                                    footerCount = footerCount + item.TotalCount;
                                    footerAmount = footerAmount + parseFloat(item.ORDER_AMOUNT);
                                    footerDiscount = footerDiscount + parseFloat(item.ORDER_DISCOUNT);
                                    footerSurcharge = footerSurcharge + parseFloat(item.ORDER_TOTAL_SUR_CHARGE);
                                    footerTotalAmount = footerTotalAmount + parseFloat(item.ORDER_TOTAL_ORDER_AMOUNT);
                                    footerCGST = footerCGST + parseFloat(item.ORDER_CGST);
                                    footerSGST = footerSGST + parseFloat(item.ORDER_SGST);
                                    footerTotalInvoice = footerTotalInvoice + parseFloat(item.ORDER_TOTAL_INVOICE_VALUE);
                                    footerRoundOff = footerRoundOff + parseFloat(item.ORDER_ROUND_OFF_INVOICE);
                                    footerGrandTotal = footerGrandTotal + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                                    return (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ORDER_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate(item.ORDER_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.CUSTOMER_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.CUSTOMER_CONTACT_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate(item.ORDER_DUE_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.TotalQuantity}</td>
                                            <td style={{ textAlign: "center" }}>{item.TotalCount}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_AMOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_TOTAL_SUR_CHARGE}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_DISCOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_TOTAL_ORDER_AMOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_CGST} ({item.SERVICE_CATEGORY_CGST}%)</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_SGST} ({item.SERVICE_CATEGORY_SGST}%)</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_TOTAL_INVOICE_VALUE}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ROUND_OFF_INVOICE}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.STORE_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.SERVICE_CATEGORY_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.SERVICE_TYPE_NAME}</td>
                                            <td style={{ textAlign: "center" }}>
                                                {item.ORDER_STATUS == "0" || item.ORDER_STATUS == 0 ? "Pending" :
                                                    item.ORDER_STATUS == "1" || item.ORDER_STATUS == 1 ? "Sent to Factory" :
                                                        item.ORDER_STATUS == "2" || item.ORDER_STATUS == 2 ? "Recieved in Factory" :
                                                            item.ORDER_STATUS == "3" || item.ORDER_STATUS == 3 ? "Returned to Outlet" :
                                                                item.ORDER_STATUS == "4" || item.ORDER_STATUS == 4 ? "Ready for Delivery" :
                                                                    item.ORDER_STATUS == "5" || item.ORDER_STATUS == 5 ? "Delivered" :
                                                                        item.ORDER_STATUS == "6" || item.ORDER_STATUS == 6 ? "Out for Delivery" : "-"}
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                                <tr>
                                    <td colspan="6" style={{ textAlign: "right" }}><b>Totals : </b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerQuantity}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerCount}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerAmount.toFixed(2)}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerSurcharge.toFixed(2)}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerDiscount.toFixed(2)}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerTotalAmount.toFixed(2)}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerCGST.toFixed(2)}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerSGST.toFixed(2)}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerTotalInvoice.toFixed(2)}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerRoundOff.toFixed(2)}</b></td>
                                    <td style={{ textAlign: "right" }}><b>{footerGrandTotal.toFixed(2)}</b></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    :
                    null
                }
            </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster">View All Orders</h1>
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
                            <CCol md="12" lg="8" style={{ float: 'left' }}>View All Orders
                            </CCol>
                            <CButton
                                className="btn btn-success"
                                onClick={ToExcel}
                                style={{
                                    float: "right",
                                    fontSize: "12px",
                                }}
                                disabled={ResponseData.length > 0 ? false : true}
                            >
                                Export To Excel
                            </CButton>
                            <CButton
                                onClick={() => {
                                    printReport();
                                }}
                                className="btn btn-primary"
                                style={{
                                    float: "right",
                                    fontSize: "12px",
                                    marginRight: "2%"
                                }}
                                disabled={ResponseData.length > 0 ? false : true}
                            >
                                Print Report
                            </CButton>
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
                                                {i.TotalCount}
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
                                    "Modification Status": (i) => (
                                        <td>
                                            {i.ORDER_MODIFICATION_STATUS === "New Order" ?
                                                "Regular Order" :
                                                <CButton
                                                    className="OrderBtn"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={() => {
                                                        history.push("/ModifiedOrders", {
                                                            data: i.ORDER_PKID,
                                                        });
                                                    }}
                                                >
                                                    {i.ORDER_MODIFICATION_STATUS}
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
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Name</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData
                                    [0].DRIVER_NAME}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Phone</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData
                                    [0].DRIVER_PHONE}</span>
                                </CCol>
                            </CFormGroup>
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
        </div>
    );
};

export default OrderDetailsReport;
