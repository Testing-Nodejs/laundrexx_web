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
    { key: "Audit Date" },
    { key: "Audit Time" },
    { key: "Action" },
]

const ViewSelfAudit = () => {

    const StoreID = sessionStorage.getItem("StoreID");
    const UserName = sessionStorage.getItem("UserName");
    const StoreName = sessionStorage.getItem("StoreName");

    const [ResponseData, setResponseData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [Type, setType] = useState("-1");
    const [toDate, settoDate] = useState("");
    const [OrdersData, setOrdersData] = useState([]);
    const [block, setblock] = useState(false)

    const [YearsList, setYearsList] = useState();
    const [OutletList, setOutletList] = useState();
    const [Year, setYear] = useState("");
    const [dates, setDates] = useState(false);
    const [Outlet, setOutlet] = useState("-");

    const [FactoryList, setFactoryList] = useState();
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

    const getYear_Outlet_Factory = async () => {
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
        axios.get(MyApiUrl + "ViewSelfAuditReport/" + StoreID + "").then((response) => {
            console.log(response.data)
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Audit Date": SplitDate1(item.STORE_SELF_AUDIT_DATE),
                        "Audit Time": item.STORE_SELF_AUDIT_TIME,
                    };
                });
                setResponseData(items);
                // setExcelData(response.data);
                document.getElementById("divLoading").className = "hide";
            } else {

                setResponseData([]);
                // setExcelData([]);
                document.getElementById("divLoading").className = "hide";
            }

        })
            .catch((error) => {
                console.log(error);
            });
    };


    const filterData = (month, year) => {
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

        const object = {
            Outlet: StoreID,
            Month: month,
            Year: year,
            FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
            ToDate: toDate == "" || toDate == null ? "-" : toDate,
        }

        console.log(object);
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "ViewSelfAuditReportFilter", object).then((response) => {
            console.log(response.data)
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Audit Date": SplitDate1(item.STORE_SELF_AUDIT_DATE),
                        "Audit Time": item.STORE_SELF_AUDIT_TIME,
                    };
                });

                console.log(items)
                setResponseData(items);
                // setExcelData(response.data);
                document.getElementById("divLoading").className = "hide";
            } else {
                setResponseData([]);
                // setExcelData([]);
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
        getYear_Outlet_Factory();
        setOutlet("-");
        setDates(false);
        setFactory("-");
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

   

    // const printReport = async () => {
    //     await GetDates();
    //     // Calculate the width of the screen
    //     const screenWidth = screen.width;

    //     // Calculate the left position for the tags window
    //     const printWindowLeft = Math.floor((screenWidth - 780) / 4);

    //     // Open the windows with the calculated positions
    //     const printWindow = window.open("", "Current Inventory Report Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + printWindowLeft + "");

    //     printWindow.document.write('<html><head><title>Current Inventory Report</title>');
    //     printWindow.document.write('<style>@page { size: landscape; }</style>');

    //     printWindow.document.write('</head><body style="margin: 5px;"><b style="font-size: 14px;">Current Inventory report</b><br/>');
    //     printWindow.document.write(document.getElementById("printWindow").innerHTML);
    //     printWindow.document.write('</body></html>');
    //     // printWindow.document.close();

    //     setTimeout(() => {
    //         printWindow.print();
    //         // printWindow.close();
    //     }, 1000);
    // };

    // const ToExcel = () => {
    //     var cnt = 0;
    //     // eslint-disable-next-line no-array-constructor
    //     var csvData = new Array();
    //     csvData.push(
    //         '"Sl No","Order Number","Order Date","Total Quantity","Due Date","DC Number","Factory Name","Customer Name","Customer Contact Number","Service Category","Service Type","Inventory Date","Inventory Time","Grand Total Amount"'
    //     );
    //     ExcelData.map((item) => {


    //         return (
    //             cnt++,
    //             csvData.push(
    //                 '"' +
    //                 cnt +
    //                 '","' +
    //                 item.ORDER_ORDER_NUMBER +
    //                 '","' +
    //                 SplitDate1(item.ORDER_DATE) +
    //                 '","' +
    //                 item.TotalQuantity +
    //                 '","' +
    //                 SplitDate1(item.ORDER_DUE_DATE) +
    //                 '","' +
    //                 item.FACTORY_TO_OUTLET_DC_NUMBER +
    //                 '","' +
    //                 item.FACTORY_NAME +
    //                 '","' +
    //                 item.CUSTOMER_NAME +
    //                 '","' +
    //                 item.CUSTOMER_CONTACT_NUMBER +
    //                 '","' +
    //                 item.SERVICE_CATEGORY_NAME +
    //                 '","' +
    //                 item.SERVICE_TYPE_NAME +
    //                 '","' +
    //                 SplitDate1(item.STORE_INVENTORY_DATE) +
    //                 '","' +
    //                 item.STORE_INVENTORY_TIME +
    //                 '","' +
    //                 item.ORDER_GRAND_TOTAL_AMOUNT +
    //                 '","' +
    //                 '"'
    //             )
    //         );
    //     });

    //     const fileName = "CurrentInventoryOutlet.csv";
    //     const buffer = csvData.join("\n");
    //     const blob = new Blob([buffer], {
    //         type: "text/csv;charset=utf8;",
    //     });

    //     //IN IE
    //     const link = document.createElement("a");
    //     if (link.download !== undefined) {
    //         link.setAttribute("href", window.URL.createObjectURL(blob));
    //         link.setAttribute("download", fileName);
    //         link.style = "visibility:hidden";
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     } else if (navigator.msSaveBlob) {
    //         navigator.msSaveBlob(blob, fileName);
    //     } else {
    //     }
    // };

    React.useEffect(() => {
        getAllOrders();
        getYear_Outlet_Factory();
    }, []);

    let Orders = 0;
    let Quantity = 0;
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

            <h1 id="ccmaster" style={{ marginTop: "3%" }}>Audit Report</h1>

            <div>
                <CRow>
                    <CCol col="12">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardBody>
                                <CRow>
                                    <CCol md="1"></CCol>
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
                                                filterData(Omonth, Year);
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
                                    </CCol><CCol md="1"></CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol col="12">
                        <CCard>
                            <CCardHeader>
                                <CCol md="12" lg="8" style={{ float: 'left' }}>
                                    View Audit Report
                                </CCol>
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
                                        "Action": (i) => (
                                            <td>
                                                <CButton
                                                    className="btn btn-primary"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={() =>
                                                        history.push("/ViewSelfAuditReport", {
                                                            data: i,
                                                        })
                                                    }
                                                >
                                                    View Report
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
        </div >
    );
};

export default ViewSelfAudit;
