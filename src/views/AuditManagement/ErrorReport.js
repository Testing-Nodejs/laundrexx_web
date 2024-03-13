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
    { key: "Action" },
    { key: "Outlet" },
    { key: "Outlet Code" },
    { key: "Audit Date" },
    { key: "Audit Time" },
    { key: "Audited By" },
]

const ErrorReport = () => {

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


    const getOutlet = async () => {
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

    const getAllOrders = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "GetErrorReportForUsers/" + SessionType + "/" + UserID + "").then((response) => {
            console.log(response.data)
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Outlet": item.STORE_NAME,
                        "Outlet Code": item.STORE_CODE,
                        "Audit Date": SplitDate1(item.AUDIT_REPORT_DATE),
                        "Audit Time": item.AUDIT_REPORT_TIME,
                        "Audited By": item.AuditBy,
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
            UserBy: SessionType,
            UserFkid: UserID,
            OutletID: Outlet,
            Month: month,
            Year: year,
            FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
            ToDate: toDate == "" || toDate == null ? "-" : toDate,
        }
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "GetErrorReportForUsersFilter", object).then((response) => {
            console.log(response.data)
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Outlet": item.STORE_NAME,
                        "Outlet Code": item.STORE_CODE,
                        "Audit Date": SplitDate1(item.AUDIT_REPORT_DATE),
                        "Audit Time": item.AUDIT_REPORT_TIME,
                        "Audited By": item.AuditBy,
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
        setfromDate("");
        settoDate("");
        setOmonth("-");
        getYear();
        setOutlet("-");
        setDates(false);
        getAllOrders();
    };

    React.useEffect(() => {
        getAllOrders();
        getOutlet();
        getYear();
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
            <h1 id="ccmaster">Error Report</h1>
            <div style={{ marginTop: "2%" }}>
                <CRow>
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
                                            <option value="-">Select Outlet</option>
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
                                    View Error Report
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
                                                        history.push("/ViewErrorReport", {
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
        </div>
    );
};

export default ErrorReport;
