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
    { key: "Order Number" },
    { key: "Order Date" },
    { key: "Due Date" },
    { key: "Order Count" },
    { key: "DC Number" },
    { key: "DC Date" },
    { key: "Service Category" },
    { key: "Service Type" },
    { key: "Item Number" },
    { key: "Item Name" },
    { key: "Additional Service Name" },
    { key: "Customer Name " },
    { key: "Customer Type" },
    { key: "Outlet Code" },
    { key: "Outlet Name" },

];

const CurrentInventoryFactory = () => {

    const FactoryID = sessionStorage.getItem("FactoryID");
    const FactoryName = sessionStorage.getItem("StoreName");
    const UserName = sessionStorage.getItem("UserName");

    const [ResponseData, setResponseData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [toDate, settoDate] = useState("");
    const [OrdersData, setOrdersData] = useState([]);
    const [block, setblock] = useState(false)

    const [YearsList, setYearsList] = useState();
    const [FactoryList, setFactoryList] = useState();
    const [Year, setYear] = useState("");
    const [dates, setDates] = useState(false);
    const [Factory, setFactory] = useState("-");

    const [Time, setTime] = useState();
    const [CDate, setCDate] = useState();

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
        await axios.get(MyApiUrl + "ReturnToFactoryList/" + FactoryID + "").then((response) => {
            console.log(response.data);
            const Option = response.data.map((item) => (
                <option value={item.FACTORY_PKID}>{item.FACTORY_NAME}</option>
            ));
            setFactoryList(Option);
        });
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
        // printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
            // printWindow.close();
        }, 1000);
    };

    const getAllOrders = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "CurrentFactoryInventory/" + FactoryID + "").then((response) => {
            const items = response.data.map((item, index) => {
                return {
                    ...item,
                    "Sl No.": index + 1,
                    "Order Number": item.ORDER_ORDER_NUMBER,
                    "Order Date": SplitDate1(item.ORDER_DATE),
                    "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                    "Order Count": item.FACTORY_DC_ORDER_COUNT,
                    "DC Number": item.FACTORY_DC_NUMBER,
                    "DC Date": SplitDate1(item.FACTORY_DC_DATE),
                    "Service Category": item.SERVICE_CATEGORY_NAME,
                    "Service Type": item.SERVICE_TYPE_NAME,
                    "Item Number": item.ORDER_ITEM_NUMBER,
                    "Item Name": item.ITEMS_NAME,
                    "Additional Service Name": item.ADDITIONAL_SERVICE_NAME === "" || item.ADDITIONAL_SERVICE_NAME === null ? "-" : item.ADDITIONAL_SERVICE_NAME,
                    "Item Defect": item.ORDER_ITEM_DEFECT,
                    "Customer Name ": item.CUSTOMER_NAME,
                    "Customer Type": item.CUSTOMER_TYPE_NAME,
                    "Outlet Code": item.STORE_CODE,
                    "Outlet Name": item.STORE_NAME
                };
            });
            setResponseData(items);
            document.getElementById("divLoading").className = "hide";
        })
            .catch((error) => {
                console.log(error);
            });
    };


    const filterData = (factory, month, year) => {
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
            FactoryID: FactoryID,
            Factory: factory,
            Month: month,
            Year: year,
            FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
            ToDate: toDate == "" || toDate == null ? "-" : toDate,
        }
        console.log(object);
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "CurrentFactoryInventoryFilter", object).then((response) => {
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Order Number": item.ORDER_ORDER_NUMBER,
                        "Order Date": SplitDate1(item.ORDER_DATE),
                        "Due Date": SplitDate1(item.ORDER_DUE_DATE),
                        "Order Count": item.FACTORY_DC_ORDER_COUNT,
                        "DC Number": item.FACTORY_DC_NUMBER,
                        "DC Date": SplitDate1(item.FACTORY_DC_DATE),
                        "Service Category": item.SERVICE_CATEGORY_NAME,
                        "Service Type": item.SERVICE_TYPE_NAME,
                        "Item Number": item.ORDER_ITEM_NUMBER,
                        "Item Name": item.ITEMS_NAME,
                        "Additional Service Name": item.ADDITIONAL_SERVICE_NAME === "" || item.ADDITIONAL_SERVICE_NAME === null ? "-" : item.ADDITIONAL_SERVICE_NAME,
                        "Item Defect": item.ORDER_ITEM_DEFECT,
                        "Customer Name ": item.CUSTOMER_NAME,
                        "Customer Type": item.CUSTOMER_TYPE_NAME,
                        "Outlet Code": item.STORE_CODE,
                        "Outlet Name": item.STORE_NAME
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
        setOutlet("-");
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
    

    // const ViewOrders = async (id) => {
    //     await axios.get(MyApiUrl + "ReturnToOutletOrderList/" + id + "").then((response) => {
    //         const items = response.data.map((item, index) => {
    //             return {
    //                 ...item,
    //                 "Sl No.": index + 1,
    //                 "Order Number": item.ORDER_ORDER_NUMBER,
    //                 "Due Date": SplitDate(item.ORDER_DUE_DATE),
    //                 "Total Quantity": item.TotalQuantity,
    //                 "Customer Name": item.CUSTOMER_NAME,
    //                 "Total Bags": item.FACTORY_TO_OUTLET_DC_ITEMS_BAGS,
    //             };
    //         });
    //         setOrdersData(items);
    //     });
    //     setblock(!block);
    // }


    React.useEffect(() => {
        getAllOrders();
        getYear_Outlet();
    }, []);
    return (
        <div id="city">
            <div id="divLoading"> </div>
            <h1 id="ccmaster">Factory Current Inventory</h1>

            <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "100%" }} id="printWindow">
                {ResponseData.length > 0 ?
                    <div style={{ textAlign: "center" }}>
                        <div id="bills" style={{ width: "100%", height: "30px", fontSize: 14 }}>
                            <p style={{ textAlign: "left" }}>Total Number of Inventory : <b>{ResponseData.length}</b></p>
                        </div><br />

                        <table id="grdpaymentDetails" border="1" cellspacing="2px" cellpadding="2px" style={{ borderRight: "1px solid #999999", fontSize: 12, width: "100%" }} class="txtcss totalTable">
                            <thead>
                                <tr>
                                    <td colspan="18" style={{
                                        fontWeight: "bold",
                                        color: "black", bordeBottom: "2px solid #999", padding: 5
                                    }}>
                                        Item Details &nbsp;&nbsp;Outlet Name: {FactoryName} &nbsp;&nbsp;Staff Name: {UserName}
                                        <span style={{ float: "right" }}>Time : <span class="time" style={{ font: "bold", float: "right" }}>{CDate} {Time}</span> </span>
                                    </td>
                                </tr>
                                <tr style={{ color: "#000", fontWeight: "bold" }}>
                                    <th scope="col" style={{width:"2%"}}>Sl No.</th>
                                    <th scope="col" style={{width:"12%"}}>DC No.</th>
                                    <th scope="col" style={{width:"8%"}}>DC Date</th>
                                    <th scope="col" style={{width:"10%"}}>Outlet Name</th>
                                    <th scope="col" style={{width:"2%"}}>Total Orders</th>
                                    <th scope="col" style={{width:"10%"}}>Order No</th>
                                    <th scope="col" style={{width:"8%"}}>Order Date</th>
                                    <th scope="col" style={{width:"8%"}}>Due Date</th>
                                    <th scope="col" style={{width:"5%"}}>Service Category</th>
                                    <th scope="col" style={{width:"5%"}}>Service Type</th>
                                    <th scope="col" style={{width:"12%"}}>Item No</th>
                                    <th scope="col" style={{width:"5%"}}>Item Name</th>
                                    <th scope="col" style={{width:"5%"}}>Additional Service</th>
                                    <th scope="col" style={{width:"5%"}}>Defects</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ResponseData.map((item, index) => {
                                    return (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                            <td style={{ textAlign: "center" }}>{item.FACTORY_DC_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate1(item.FACTORY_DC_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.STORE_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.FACTORY_DC_ORDER_COUNT}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ORDER_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate1(item.ORDER_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate1(item.ORDER_DUE_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.SERVICE_CATEGORY_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.SERVICE_TYPE_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ITEM_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{item.ITEMS_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.ADDITIONAL_SERVICE_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ITEM_DEFECT}</td>
                                        </tr>
                                    )
                                }
                                )}
                                
                            </tbody>
                        </table>
                    </div>
                    :
                    null
                }
            </div>


            <CRow>
                <CCol md="12" lg="12">
                    <CLink to="/CurrentInventory">
                        <CButton size="sm" className="btn btn-danger" style={{ marginBottom: 0, marginTop: 0, float: "right", width: "7%" }}>
                            Back
                        </CButton>
                    </CLink>
                </CCol>
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
                    <CCard>
                        <CCardHeader>
                            <div style={{ float: 'left' }}>View Factory Current Inventory</div>
                            <div style={{ float: 'right' }}>
                                <CButton
                                    onClick={() => {
                                        printReport();
                                    }}
                                    className="btn btn-primary"
                                    style={{
                                        float: "right",
                                        fontSize: "12px"
                                    }}
                                >
                                    Print Report
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardHeader>
                            <CRow>
                                <CCol col="6"></CCol>
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

                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* <CModal show={block} onClose={() => setblock(!block)} color="dark" style={{ height: 480, width: "140%", margin: "0px 0px 0px -60px !important" }}>
                <CModalHeader closeButton>
                    <CModalTitle>DC Order Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {OrdersData.length > 0 ?
                        <CRow>
                            <CCol md="12">
                                <CDataTable
                                    items={OrdersData}
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
                        :
                        null
                    }
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock(!block)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal> */}
        </div>
    );
};

export default CurrentInventoryFactory;
