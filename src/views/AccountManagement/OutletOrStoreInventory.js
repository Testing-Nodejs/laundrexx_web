/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
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
    CLink,
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
    { key: "Order Number" },
    { key: "Order Date" },
    { key: "Due Date" },
    { key: "DC Number" },
    { key: "Factory Name" },
    { key: "Customer Name" },
    { key: "Customer Phone Number" },
    { key: "Service Category" },
    { key: "Service Type" },
    { key: "Inventory Date" },
    { key: "Inventory Time" },
    { key: "Grand Total Amount" },
];

const OutletOrStoreInventory = () => {
    const UserID = sessionStorage.getItem("UserID");
    const SessionType = sessionStorage.getItem("SessionType");

    const [ResponseData, setResponseData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [toDate, settoDate] = useState("");

    const [YearsList, setYearsList] = useState();
    const [OutletList, setOutletList] = useState();
    const [Year, setYear] = useState("");
    const [dates, setDates] = useState(false);
    const [Outlet, setOutlet] = useState("-");
    const [OutletName, setOutletName] = useState("");

    const [FactoryList, setFactoryList] = useState([]);
    const [Factory, setFactory] = useState("-");

    const [Time, setTime] = useState();
    const [CDate, setCDate] = useState();
    const [ExcelData, setExcelData] = useState([]);

    const history = useHistory();

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

    const getOutlet_Factory = async () => {
        if (SessionType == "Manager") {
            await axios.get(MyApiUrl + "OutletsByManager/" + UserID + "").then((response) => {
                const Option = response.data.map((item, i) => (
                    <option key={i} value={item.STORE_PKID + "-" + item.STORE_NAME}>
                        {item.STORE_NAME}
                    </option>
                ));
                setOutletList(Option);
            });
        } else {
            await axios.get(MyApiUrl + "Outlets").then((response) => {
                const Option = response.data.map((item, i) => (
                    <option key={i} value={item.STORE_PKID + "-" + item.STORE_NAME}>
                        {item.STORE_NAME}
                    </option>
                ));
                setOutletList(Option);
            });
        }
        await axios.get(MyApiUrl + "Factory").then((response) => {
            console.log(response.data);
            const Option = response.data.map((item) => (
                <option value={item.FACTORY_PKID}>{item.FACTORY_NAME}</option>
            ));
            setFactoryList(Option);
        });
    };

    const getYear = async () => {
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

    const getAllOrders = (outlet) => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "OutletCurrentInventory/" + outlet.split("-")[0] + "").then((response) => {
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Order Number": item.ORDER_ORDER_NUMBER,
                        "Order Date": SplitDate1(item.ORDER_DATE),
                        "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                        "DC Number": item.FACTORY_TO_OUTLET_DC_NUMBER,
                        "Factory Name": item.FACTORY_NAME,
                        "Customer Name": item.CUSTOMER_NAME,
                        "Customer Phone Number": item.CUSTOMER_CONTACT_NUMBER,
                        "Service Category": item.SERVICE_CATEGORY_NAME,
                        "Service Type": item.SERVICE_TYPE_NAME,
                        "Inventory Date": SplitDate1(item.STORE_INVENTORY_DATE),
                        "Inventory Time": item.STORE_INVENTORY_TIME,
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
    };


    const filterData = (factory, outlet, month, year) => {
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

        const object = {
            Outlet: outlet.split("-")[0],
            Factory: factory,
            Month: month,
            Year: year,
            FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
            ToDate: toDate == "" || toDate == null ? "-" : toDate,
        }

        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "OutletCurrentInventoryFilter", object).then((response) => {
            console.log(response.data)
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Order Number": item.ORDER_ORDER_NUMBER,
                        "Order Date": SplitDate1(item.ORDER_DATE),
                        "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                        "DC Number": item.FACTORY_TO_OUTLET_DC_NUMBER,
                        "Factory Name": item.FACTORY_NAME,
                        "Customer Name": item.CUSTOMER_NAME,
                        "Customer Phone Number": item.CUSTOMER_CONTACT_NUMBER,
                        "Service Category": item.SERVICE_CATEGORY_NAME,
                        "Service Type": item.SERVICE_TYPE_NAME,
                        "Inventory Date": SplitDate1(item.STORE_INVENTORY_DATE),
                        "Inventory Time": item.STORE_INVENTORY_TIME,
                        "Grand Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                    };
                });
                console.log(items)
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

    };

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', { month: 'long' });
    }

    const SplitDate1 = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }
    const FilterReset = () => {
        setfromDate("");
        settoDate("");
        setOmonth("-");
        getOutlet_Factory();
        getYear();
        setOutlet("-");
        setFactory("-");
        setDates(false);
    };

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

    const printReport = async () => {
        await GetDates();
        // Calculate the width of the screen
        const screenWidth = screen.width;

        // Calculate the left position for the tags window
        const printWindowLeft = Math.floor((screenWidth - 780) / 4);

        // Open the windows with the calculated positions
        const printWindow = window.open("", "Current Inventory Report Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + printWindowLeft + "");

        printWindow.document.write('<html><head><title>Current Inventory Report</title>');
        printWindow.document.write('<style>@page { size: landscape; }</style>');

        printWindow.document.write('</head><body style="margin: 5px;"><b style="font-size: 14px;">Current Inventory report</b><br/>');
        printWindow.document.write(document.getElementById("printWindow").innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    };

    const ToExcel = () => {
        var cnt = 0;
        // eslint-disable-next-line no-array-constructor
        var csvData = new Array();
        csvData.push(
            '"Sl No","Status","Order Number","Order Date","Total Quantity","Total Count","Due Date","DC Number","Factory Name","Outlet Name","Outlet Code","Customer Name","Customer Phone","Service Category","Service Type","Inventory Date","Inventory Time","Grand Total Amount"'
        );
        ExcelData.map((item) => {
            const Status = item.STORE_INVENTORY_STATUS === true || item.STORE_INVENTORY_STATUS === "0" || item.STORE_INVENTORY_STATUS === 0 ? "Out for Delivery" : item.STORE_INVENTORY_STATUS === "1" || item.STORE_INVENTORY_STATUS === 1 ? "Received in Inventory" : item.STORE_INVENTORY_STATUS === "2" || item.STORE_INVENTORY_STATUS === 2 ? "Order Delivered" : "-";
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
                    item.TotalQuantity +
                    '","' +
                    item.TotalCount +
                    '","' +
                    SplitDate1(item.ORDER_DUE_DATE) +
                    '","' +
                    item.FACTORY_TO_OUTLET_DC_NUMBER +
                    '","' +
                    item.FACTORY_NAME +
                    '","' +
                    item.STORE_NAME +
                    '","' +
                    item.STORE_CODE +
                    '","' +
                    item.CUSTOMER_NAME +
                    '","' +
                    item.CUSTOMER_CONTACT_NUMBER +
                    '","' +
                    item.SERVICE_CATEGORY_NAME +
                    '","' +
                    item.SERVICE_TYPE_NAME +
                    '","' +
                    SplitDate1(item.STORE_INVENTORY_DATE) +
                    '","' +
                    item.STORE_INVENTORY_TIME +
                    '","' +
                    item.ORDER_GRAND_TOTAL_AMOUNT +
                    '","' +
                    '"'
                )
            );
        });

        const fileName = "CurrentInventoryReport.csv";
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
        getOutlet_Factory();
        getYear();
    }, []);

    let Orders = 0;
    let Quantity = 0;
    let Count = 0;
    return (
        <div id="city">
            <div id="divLoading"> </div>

            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/OutletDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "100%" }} id="printWindow">
                {ResponseData.length > 0 ?
                    <div style={{ textAlign: "center" }}>
                        <div id="bills" style={{ width: "100%", height: "30px", fontSize: 14 }}>
                            <p style={{ textAlign: "left" }}>Total Number of Orders : <b>{ResponseData.length}</b></p>
                        </div><br />
                        <table id="grdpaymentDetails" border="1" cellspacing="2px" cellpadding="2px" style={{ borderRight: "1px solid #999999", fontSize: 12, width: "100%", borderCollapse: "collapse" }} class="txtcss totalTable">
                            <thead>
                                <tr>
                                    <td colspan="18" style={{
                                        fontWeight: "bold",
                                        color: "black", bordeBottom: "2px solid #999", padding: 5
                                    }}>
                                        Item Details &nbsp;&nbsp;Outlet Name: {ResponseData[0].STORE_NAME} &nbsp;&nbsp;Outlet Code: {ResponseData[0].STORE_CODE}
                                        <span style={{ float: "right" }}>Time : <span class="time" style={{ font: "bold", float: "right" }}>{CDate} {Time}</span> </span>
                                    </td>
                                </tr>
                                <tr style={{ color: "#000", fontWeight: "bold" }}>
                                    <th scope="col" style={{ width: "2%" }}>Sl No.</th>
                                    <th scope="col" style={{ width: "11%" }}>DC No.</th>
                                    <th scope="col" style={{ width: "10%" }}>Factory Name</th>
                                    <th scope="col" style={{ width: "10%" }}>Order No</th>
                                    <th scope="col" style={{ width: "6%" }}>Quantity</th>
                                    <th scope="col" style={{ width: "6%" }}>Count</th>
                                    <th scope="col" style={{ width: "6%" }}>Order Date</th>
                                    <th scope="col" style={{ width: "6%" }}>Due Date</th>
                                    <th scope="col" style={{ width: "11%" }}>Customer Name</th>
                                    <th scope="col" style={{ width: "5%" }}>Customer Contact No</th>
                                    <th scope="col" style={{ width: "7%" }}>Service Category</th>
                                    <th scope="col" style={{ width: "7%" }}>Service Type</th>
                                    <th scope="col" style={{ width: "6%" }}>Inventory Date</th>
                                    <th scope="col" style={{ width: "5%" }}>Inventory Time</th>
                                    <th scope="col" style={{ width: "5%" }}>Grand Total Amount</th>
                                    <th scope="col" style={{ width: "5%" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ResponseData.map((item, index) => {
                                    Quantity = Quantity + item.TotalQuantity;
                                    Count = Count + item.TotalCount;
                                    return (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                            <td style={{ textAlign: "center" }}>{item.FACTORY_TO_OUTLET_DC_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{item.FACTORY_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ORDER_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{item.TotalQuantity}</td>
                                            <td style={{ textAlign: "center" }}>{item.TotalCount}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate1(item.ORDER_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate1(item.ORDER_DUE_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.CUSTOMER_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.CUSTOMER_CONTACT_NUMBER}
                                            </td>
                                            <td style={{ textAlign: "center" }}>{item.SERVICE_CATEGORY_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.SERVICE_TYPE_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate1(item.STORE_INVENTORY_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.STORE_INVENTORY_TIME}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.STORE_INVENTORY_STATUS === true || item.STORE_INVENTORY_STATUS === "0" || item.STORE_INVENTORY_STATUS === 0 ? "Out for Delivery" : item.STORE_INVENTORY_STATUS === "1" || item.STORE_INVENTORY_STATUS === 1 ? "Received in Inventory" : item.STORE_INVENTORY_STATUS === "2" || item.STORE_INVENTORY_STATUS === 2 ? "Order Delivered" : "-"}</td>
                                        </tr>
                                    )
                                }
                                )}

                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "right" }}>Totals:</td>
                                    <td style={{ textAlign: "center" }}>{Quantity}</td>
                                    <td style={{ textAlign: "center" }}>{Count}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    :
                    null
                }
            </div>

            <CRow style={{ marginTop: "1%", borderBottom: "1px solid #d4d4d4", paddingBottom: "2%" }}>
                <CCol md="3" style={{ alignSelf: "center" }}>
                    <CSelect
                        custom
                        name="merchant"
                        value={Outlet}
                        onChange={(event) => {
                            const val = event.target.value;
                            if (val == "-") {
                                setOutlet(val);
                                setResponseData([]);
                            }
                            else {
                                setOutlet(val);
                                const splitVal = val.split("-");
                                setOutletName(splitVal[1]);
                                getAllOrders(splitVal[0]);
                            }
                            setfromDate("");
                            settoDate("");
                            setOmonth("-");
                            setFactory("-");
                            getYear();
                            setDates(false);
                        }}
                        id="merchant"
                    >
                        <option value="-">Select Outlet</option>
                        {OutletList}
                    </CSelect>
                </CCol>
                <CCol md="7" style={{ alignSelf: "center" }}>
                    {Outlet == "-" ?
                        <h1 id="ccmaster">Current Inventory</h1>
                        :
                        <h1 id="ccmaster">Current {OutletName} Inventory</h1>
                    }
                </CCol>
            </CRow>
            {Outlet == "-" ? null :
                <div>
                    <CRow style={{ marginTop: "2%" }}>
                        <CCol col="12">
                            <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                <CCardBody>
                                    <CRow>
                                        <CCol md="2">
                                            <CLabel htmlFor="nf-email">Factory</CLabel>
                                            <CSelect
                                                custom
                                                name="merchant"
                                                value={Factory}
                                                onChange={(event) => {
                                                    setFactory(event.target.value);
                                                }}
                                                id="merchant"
                                            >
                                                <option value="-">All</option>
                                                {FactoryList}
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
                                                    filterData(Factory, Outlet, Omonth, Year);
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
                                    <CCol md="12" lg="8" style={{ float: 'left' }}>
                                        View Current Inventory
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
                                            "Status": (i) => {
                                                if (i.STORE_INVENTORY_STATUS === "0" || i.STORE_INVENTORY_STATUS === 0) {
                                                    return (
                                                        <td>
                                                            <span className="pending">Out for Delivery</span>
                                                        </td>
                                                    );
                                                }
                                                else if (i.STORE_INVENTORY_STATUS === "1" || i.STORE_INVENTORY_STATUS === 1) {
                                                    return (
                                                        <td>
                                                            <span className="assigned">Received in Inventory</span>
                                                        </td>
                                                    );
                                                } else if (i.STORE_INVENTORY_STATUS === "2" || i.STORE_INVENTORY_STATUS === 2) {
                                                    return (
                                                        <td>
                                                            <span className="success">Order Delivered</span>
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
                </div>
            }
        </div>
    );
};

export default OutletOrStoreInventory;
