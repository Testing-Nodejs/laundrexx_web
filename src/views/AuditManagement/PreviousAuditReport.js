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

const PreviousAuditReport = () => {

    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");

    const [ResponseData, setResponseData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [toDate, settoDate] = useState("");

    const [YearsList, setYearsList] = useState();
    const [OutletList, setOutletList] = useState();
    const [Year, setYear] = useState("");
    const [dates, setDates] = useState(false);
    const [Outlet, setOutlet] = useState("-");
    const [CurrentDate, setCurrentDate] = useState("");

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
        axios.get(MyApiUrl + "GetPreviousAuditReport/" + UserType + "/" + UserID + "").then((response) => {
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

        var showdate = new Date();
        const mon = (showdate.getMonth() + 1).toString().padStart(2, "0");
        setCurrentDate(
            showdate.getUTCFullYear() +
            "-" +
            mon +
            "-" +
            showdate.getDate().toString().padStart(2, "0")
        );
    };


    const filterData = (outlet, month, year) => {
        const object = {
            UserBy: UserType,
            UserFkid: UserID,
            OutletID: outlet,
            Month: month,
            Year: year,
            FromDate: CurrentDate,
            ToDate: CurrentDate,
        }
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "GetPreviousAuditReportFilter", object).then((response) => {
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

                console.log(items)
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
        getYear_Outlet_Factory();
        setOutlet("-");
        setDates(false);
    };

    React.useEffect(() => {
        getAllOrders();
        getYear_Outlet_Factory();
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
                                filterData(val, Omonth, Year);
                            }
                            setfromDate("");
                            settoDate("");
                            setOmonth("-");
                            setDates(false);
                        }}
                        id="merchant"
                    >
                        <option value="-">Select Outlet</option>
                        {OutletList}
                    </CSelect>
                </CCol>
                <CCol md="7" style={{ alignSelf: "center" }}>
                    <h1 id="ccmaster">Previous Audit Report</h1>
                </CCol>
            </CRow>
            <div style={{ marginTop: "2%" }}>
                <CRow>
                    <CCol col="12">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>
                                <CCol md="12" lg="8" style={{ float: 'left' }}>
                                    View Previous Audit Report
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
                                                        history.push("/ViewPreviousAuditReport", {
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

export default PreviousAuditReport;
