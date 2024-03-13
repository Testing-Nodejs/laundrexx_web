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
    { key: "DC Number" },
    { key: "DC Date" },
    { key: "DC Time" },
    { key: "Factory" },
    { key: "Factory Staff" },
    { key: "Total Orders" },
    { key: "Total Items" },
    { key: "Total Bags" },
];

const OutletViewIntakeProcess = () => {
    const StoreID = sessionStorage.getItem("StoreID");
    const [ResponseData, setResponseData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [toDate, settoDate] = useState("");

    const [YearsList, setYearsList] = useState([]);
    const [FactoryList, setFactoryList] = useState([]);
    const [Factory, setFactory] = useState("-");
    const [Year, setYear] = useState("");
    const [dates, setDates] = useState(false);

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

    const getYear_Factory = async () => {
        await axios.get(MyApiUrl + "GetYearsList").then((response) => {
            const Option = response.data.map((item, i) => (
                <option key={i} value={item.year}>
                    {item.year}
                </option>
            ));
            setYearsList(Option);
            setYear(response.data[0].year);
        });
        await axios.get(MyApiUrl + "Factory").then((response) => {
            const FactoryOption = response.data.map((item) => (
                <option value={item.FACTORY_PKID}>{item.FACTORY_NAME}</option>
            ));
            setFactoryList(FactoryOption);
        });
    };
    const getAllOrders = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "GetDCFromFactory/" + StoreID + "").then((response) => {
            const items = response.data.map((item, index) => {
                return {
                    ...item,
                    "Sl No.": index + 1,
                    "DC Number": item.FACTORY_TO_OUTLET_DC_NUMBER,
                    "DC Date": SplitDate(item.FACTORY_TO_OUTLET_DC_DATE),
                    "DC Time": item.FACTORY_TO_OUTLET_DC_TIME,
                    "Factory": item.FACTORY_NAME,
                    "Factory Staff": item.FACTORY_STAFF_NAME,
                    "Total Orders": item.FACTORY_TO_OUTLET_DC_ORDER_COUNT,
                    "Total Items": item.FACTORY_TO_OUTLET_DC_ITEMS_COUNT,
                    "Total Bags": item.FACTORY_TO_OUTLET_DC_TOTAL_BAGS,
                };
            });
            setResponseData(items);
            document.getElementById("divLoading").className = "hide";
        })
            .catch((error) => {
                console.log(error);
            });
    };

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    const filterData = (factory, month, year) => {
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
            OutletID: StoreID,
            Factory: factory,
            Month: month,
            Year: year,
            FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
            ToDate: toDate == "" || toDate == null ? "-" : toDate,
        }
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "GetDCFromFactoryWithFilter", object).then((response) => {
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "DC Number": item.FACTORY_TO_OUTLET_DC_NUMBER,
                        "DC Date": SplitDate(item.FACTORY_TO_OUTLET_DC_DATE),
                        "DC Time": item.FACTORY_TO_OUTLET_DC_TIME,
                        "Factory": item.FACTORY_NAME,
                        "Factory Staff": item.FACTORY_STAFF_NAME,
                        "Total Orders": item.FACTORY_TO_OUTLET_DC_ORDER_COUNT,
                        "Total Items": item.FACTORY_TO_OUTLET_DC_ITEMS_COUNT,
                        "Total Bags": item.FACTORY_TO_OUTLET_DC_TOTAL_BAGS,
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

    const FilterReset = () => {
        getAllOrders();
        setfromDate("");
        settoDate("");
        setOmonth("-");
        setFactory("-");
        getYear_Factory();
        setDates(false);
    };


    React.useEffect(() => {
        getAllOrders();
        getYear_Factory();
    }, []);
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

            <CRow style={{ marginTop: "3%"}}>
                <CCol md="4"></CCol>
                <CCol md="4"><h1 id="ccmaster">Intake Process</h1></CCol>
                <CCol md="4"><CButton
                    onClick={() => {
                        history.push("/ViewIntakeProcessWithoutDC")
                    }}
                    className="btn btn-primary"
                    style={{
                        float: "right",
                        fontSize: "12px"
                    }}
                >
                    Confirm Intake Without DC
                </CButton></CCol>
            </CRow>
            <CRow style={{ marginTop: "3%" }}>
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
                                            filterData(Factory, Omonth, Year);
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
                                <CCol col="6">View All Factory DC</CCol>
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
                                    "Action": (i) => (
                                        <td>
                                            {i.FACTORY_TO_OUTLET_DC_STATUS == "0" || i.FACTORY_TO_OUTLET_DC_STATUS == 0 ?
                                                <CButton
                                                    className="btn btn-primary"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={() =>
                                                        history.push("/OutletIntakeProcess", {
                                                            data: i,
                                                        })
                                                    }
                                                >
                                                    Start Intake
                                                </CButton>
                                                :
                                                <CButton
                                                    className="btn btn-primary"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    DC Received
                                                </CButton>
                                            }
                                        </td>
                                    ),
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};

export default OutletViewIntakeProcess;
