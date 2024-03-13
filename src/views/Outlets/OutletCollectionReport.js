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
    { key: "Collection Date" },
    { key: "Collection Amount" },
    { key: "Order Amount" },
    { key: "Bad Debits" },
    { key: "Final Amount" },
    { key: "Payment Mode" },
    { key: "Balance Amount" },
    { key: "Order Number" },
    { key: "Order Date" },
    { key: "Due Date" },
    { key: "Customer" },

];

const OutletCollectionReport = () => {

    const StoreID = sessionStorage.getItem("StoreID");
    const StoreName = sessionStorage.getItem("StoreName");
    const UserName = sessionStorage.getItem("UserName");

    const [ResponseData, setResponseData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [toDate, settoDate] = useState("");

    const [YearsList, setYearsList] = useState();
    const [Year, setYear] = useState("");

    const [dates, setDates] = useState(false);
    const [Time, setTime] = useState();
    const [CDate, setCDate] = useState();

    const [PrintDCData, setPrintDCData] = useState([]);


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

    const getYear_Outlet = async () => {
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
        axios.get(MyApiUrl + "GetOutletCollectionReport/" + StoreID + "").then((response) => {
            const items = response.data.map((item, index) => {
                return {
                    ...item,
                    "Sl No.": index + 1,
                    "Collection Date": SplitDate1(item.ORDER_PAYMENT_DATE),
                    "Collection Amount": item.ORDER_PAYMENT_COLLECTED_AMOUNT,
                    "Order Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                    "Bad Debits": item.ORDER_PAYMENT_BAD_DEBITS,
                    "Final Amount": item.ORDER_PAYMENT_FINAL_AMOUNT,
                    "Payment Mode": item.ORDER_PAYMENT_MODE,
                    "Balance Amount": item.ORDER_PAYMENT_BALANCE_AMOUNT,
                    "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                    "Order Date": SplitDate1(item.ORDER_DATE),
                    "Order Number": item.ORDER_ORDER_NUMBER,
                    "Customer": item.CUSTOMER_NAME,
                };
            });
            setResponseData(items);
            document.getElementById("divLoading").className = "hide";
        })
            .catch((error) => {
                console.log(error);
            });
    };


    const filterData = (month, year) => {
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
        axios.post(MyApiUrl + "GetOutletCollectionReportFilter", object).then((response) => {
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Collection Date": SplitDate1(item.ORDER_PAYMENT_DATE),
                        "Collection Amount": item.ORDER_PAYMENT_COLLECTED_AMOUNT,
                        "Order Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                        "Bad Debits": item.ORDER_PAYMENT_BAD_DEBITS,
                        "Final Amount": item.ORDER_PAYMENT_FINAL_AMOUNT,
                        "Payment Mode": item.ORDER_PAYMENT_MODE,
                        "Balance Amount": item.ORDER_PAYMENT_BALANCE_AMOUNT,
                        "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                        "Order Date": SplitDate1(item.ORDER_DATE),
                        "Order Number": item.ORDER_ORDER_NUMBER,
                        "Customer": item.CUSTOMER_NAME,
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
        const printWindow = window.open("", "Collection Report Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + printWindowLeft + "");

        printWindow.document.write('<html><head><title>Collection Report</title>');
        printWindow.document.write('<style>@page { size: portrait; }</style>');

        printWindow.document.write('</head><body style="margin: 5px;"><b style="font-size: 14px;">Laundrexx Fabric Care India(P). Ltd</b><br><b style="font-size: 14px;">Collection Report</b><br/>');
        printWindow.document.write(document.getElementById("printWindow").innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    };


    React.useEffect(() => {
        getAllOrders();
        getYear_Outlet();
    }, []);

    let totcash = 0.00;
    let totcard = 0.00;
    let totupi = 0.00;
    let totwallet = 0.00;

    let paidcash = 0.00;
    let paidcard = 0.00;
    let paidupi = 0.00;
    let paidwallet = 0.00;

    let Amountcash = 0.00;
    let Amountcard = 0.00;
    let Amountupi = 0.00;
    let Amountwallet = 0.00;

    let FinalTotal = 0.00;
    let FinalPaid = 0.00;
    let FinalAmount = 0.00;

    return (
        <div id="city">
            <div id="divLoading"> </div>

            <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "100%" }} id="printWindow">
                {ResponseData.length > 0 ?
                    <div style={{ textAlign: "center" }}>
                        <table id="grdpaymentDetails" border="1" cellspacing="2px" cellpadding="2px" style={{ borderRight: "1px solid #999999", fontSize: 12, width: "100%", borderCollapse: "collapse", width: "100%" }} class="txtcss totalTable">
                            <thead>
                                <tr>
                                    <td colspan="18" style={{
                                        fontWeight: "bold",
                                        color: "black", bordeBottom: "2px solid #999", padding: 5
                                    }}>
                                        Collection Details &nbsp;&nbsp;Outlet Name: {StoreName} &nbsp;&nbsp;User Name: {UserName}
                                        <span style={{ float: "right" }}>Time : <span class="time" style={{ font: "bold", float: "right" }}>{CDate} {Time}</span> </span>
                                    </td>
                                </tr>
                                <tr style={{ color: "#000", fontWeight: "bold" }}>
                                    <th scope="col">Order No.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Mobile</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Paid Amount</th>
                                    <th scope="col">Final Amount</th>
                                    <th scope="col">Bad Debits</th>
                                    <th scope="col">Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ResponseData.map((item, index) => {
                                    if (item.ORDER_PAYMENT_MODE === "Cash") {
                                        totcash = totcash + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                                        paidcash = paidcash + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                                        Amountcash = Amountcash + parseFloat(item.ORDER_PAYMENT_FINAL_AMOUNT);
                                    } else if (item.ORDER_PAYMENT_MODE === "UPI") {
                                        totupi = totupi + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                                        paidupi = paidupi + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                                        Amountupi = Amountupi + parseFloat(item.ORDER_PAYMENT_FINAL_AMOUNT);
                                    } else if (item.ORDER_PAYMENT_MODE === "Credit/Debit Card") {
                                        totcard = totcard + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                                        paidcard = paidcard + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                                        Amountcard = Amountcard + parseFloat(item.ORDER_PAYMENT_FINAL_AMOUNT);
                                    } else if (item.ORDER_PAYMENT_MODE === "Wallet") {
                                        totwallet = totwallet + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                                        paidwallet = paidwallet + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                                        Amountwallet = Amountwallet + parseFloat(item.ORDER_PAYMENT_FINAL_AMOUNT);
                                    }

                                    FinalTotal = parseFloat(totcash) + parseFloat(totupi) + parseFloat(totcard) + parseFloat(totwallet);
                                    FinalPaid = parseFloat(paidcash) + parseFloat(paidupi) + parseFloat(paidcard) + parseFloat(paidwallet);
                                    FinalAmount = parseFloat(Amountcash) + parseFloat(Amountupi) + parseFloat(Amountcard) + parseFloat(Amountwallet);

                                    return (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ORDER_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{item.CUSTOMER_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.CUSTOMER_CONTACT_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate1(item.ORDER_PAYMENT_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_PAYMENT_COLLECTED_AMOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_PAYMENT_FINAL_AMOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_PAYMENT_BAD_DEBITS}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_PAYMENT_CREDIT}</td>
                                        </tr>
                                    )
                                }
                                )}

                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "right" }}>Cash:</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{totcash.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{paidcash.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{Amountcash.toFixed(2)}</td>
                                    <td colSpan="2"></td>
                                </tr>
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "right" }}>Credit/Debit Card:</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{totcard.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{paidcard.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{Amountcard.toFixed(2)}</td>
                                    <td colSpan="2"></td>
                                </tr>
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "right" }}>Gpay/Paytm:</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{totupi.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{paidupi.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{Amountupi.toFixed(2)}</td>
                                    <td colSpan="2"></td>
                                </tr>
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "right" }}>Wallet:</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{totwallet.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{paidwallet.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{Amountwallet.toFixed(2)}</td>
                                    <td colSpan="2"></td>
                                </tr>
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "right" }}>Total:</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{FinalTotal.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{FinalPaid.toFixed(2)}</td>
                                    <td colSpan="1" style={{ textAlign: "center" }}>{FinalAmount.toFixed(2)}</td>
                                    <td colSpan="2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    :
                    null
                }
            </div>

            <h1 id="ccmaster">Collection Report</h1>
            <CRow style={{ marginTop: "3%" }}>
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
                                </CCol>
                                <CCol md="1"></CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow>
                <CCol col="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>
                            <div style={{ float: "left" }}>View Collection Report</div>
                            <div style={{ float: "right" }}>
                                <CButton
                                    className="btn btn-primary"
                                    style={{ fontSize: "12px" }}
                                    onClick={() => {
                                        printReport();
                                    }}
                                >
                                    Print Report
                                </CButton>
                            </div>
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

                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};

export default OutletCollectionReport;
