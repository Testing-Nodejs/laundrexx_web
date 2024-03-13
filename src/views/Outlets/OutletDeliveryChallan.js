/* eslint-disable no-restricted-globals */
/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-07 17:32:50
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-02-11 18:55:47
 */
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
import { MyApiUrl, ViewImg } from "src/services/service";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Sl No." },
    { key: "DC" },
    { key: "Status" },
    { key: "DC Number" },
    { key: "Total Orders" },
    { key: "DC Date" },
    { key: "Prepared By" },
    { key: "Outlet" },
    { key: "Factory" },
    { key: "Total Quantity" },
    { key: "Total Bags" },
];
const fields = [
    { key: "Sl No." },
    { key: "Order Number" },
    { key: "Due Date" },
    { key: "Total Amount" },
    { key: "Attended By" },
    { key: "Customer Name" },
];

const OutletDeliveryChallan = () => {
    const StoreID = sessionStorage.getItem("StoreID");
    const StoreName = sessionStorage.getItem("StoreName");

    const [ResponseData, setResponseData] = useState([]);
    const [OrdersData, setOrdersData] = useState([]);
    const [PrintDCData, setPrintDCData] = useState([]);
    const [fromDate, setfromDate] = useState("");
    const [Omonth, setOmonth] = useState("-");
    const [Factory, setFactory] = useState("-");
    const [toDate, settoDate] = useState("");

    const [YearsList, setYearsList] = useState();
    const [Year, setYear] = useState("");
    const [block, setblock] = useState(false);
    const [dates, setDates] = useState(false);
    const [FactoryList, setFactoryList] = useState([]);

    const [modalPrint, setModalPrint] = useState(false);
    const [ModalOrdersData, setModalOrdersData] = useState([]);
    const [ModalPrintDCData, setModalPrintDCData] = useState([]);
    const [block4, setblock4] = useState(false);
    const [ModalOrderID, setModalOrderID] = useState("");

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

    const getFactory = async () => {
        await axios.get(MyApiUrl + "Factory").then((response) => {
            const FactoryOption = response.data.map((item) => (
                <option value={item.FACTORY_PKID}>{item.FACTORY_NAME}</option>
            ));
            setFactoryList(FactoryOption);
        });
    };
    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }
    const getAllOrders = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "GetOutletToFactoryDC/" + StoreID + "").then((response) => {
            const items = response.data.map((item, index) => {
                return {
                    ...item,
                    "Sl No.": index + 1,
                    "DC Date": SplitDate(item.FACTORY_DC_DATE),
                    "Outlet": StoreName,
                    "Factory": item.FACTORY_NAME,
                    "Prepared By": item.STORE_STAFF_NAME,
                    "Total Quantity": item.TotalCount,
                    "Total Bags": item.FACTORY_DC_TOTAL_BAGS,
                };
            });
            setResponseData(items);
            document.getElementById("divLoading").className = "hide";
        })
            .catch((error) => {
                document.getElementById("divLoading").className = "hide";
                console.log(error);
            });
    };

    const filterData = () => {
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
            Factory: Factory,
            Month: Omonth,
            Year: Year,
            FromDate: fromDate == "" || fromDate == null ? "-" : fromDate,
            ToDate: toDate == "" || toDate == null ? "-" : toDate,
        }
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "GetOutletToFactoryDCFilter", object).then((response) => {
            if (response.data.length > 0) {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "DC Date": SplitDate(item.FACTORY_DC_DATE),
                        "DC Number": item.FACTORY_DC_NUMBER,
                        "Outlet": StoreName,
                        "Factory": item.FACTORY_NAME,
                        "Prepared By": item.STORE_STAFF_NAME,
                        "Total Quantity": item.TotalCount,
                        "Total Bags": item.FACTORY_DC_TOTAL_BAGS,
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

    const FilterReset = () => {
        getAllOrders();
        setfromDate("");
        settoDate("");
        setOmonth("-");
        getYear();
        setFactory("-");
        setDates(false);
    };

    React.useEffect(() => {
        getAllOrders();
        getYear();
        getFactory();
    }, []);

    const viewOrders = async (id) => {
        await axios.get(MyApiUrl + "GetOutletToFactryDCItems/" + id + "").then((response) => {
            const items = response.data.map((item, index) => {
                return {
                    ...item,
                    "Sl No.": index + 1,
                    "Order Number": item.ORDER_ORDER_NUMBER,
                    "Due Date": SplitDate(item.ORDER_DUE_DATE),
                    "Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                    "Attended By": item.STORE_STAFF_NAME,
                    "Customer Name": item.CUSTOMER_NAME,
                };
            });
            setOrdersData(items);
        });
        setblock(!block);
    }

    const printDC = async (list) => {
        setPrintDCData([]);
        setPrintDCData([list]);
        await axios.get(MyApiUrl + "GetOutletToFactryDCItems/" + list.FACTORY_DC_PKID + "").then((response) => {
            const items = response.data.map((item, index) => {
                return {
                    ...item,
                    "Sl No.": index + 1,
                    "Order Number": item.ORDER_ORDER_NUMBER,
                    "Due Date": SplitDate(item.ORDER_DUE_DATE),
                    "Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                    "Attended By": item.STORE_STAFF_NAME,
                    "Customer Name": item.CUSTOMER_NAME,
                };
            });
            setOrdersData(items);
        });
        // Calculate the width of the screen
        const screenWidth = screen.width;

        // Calculate the left position for the tags window
        const DCWindowLeft = Math.floor((screenWidth - 780) / 4);

        // Open the windows with the calculated positions
        const DCWindow = window.open("", "Delivery Challan", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + DCWindowLeft);

        DCWindow.document.write('<html><head><title>Delivery Challan</title></head><body style="font-family: Arial; font-size: 9px; letter-spacing: 1px">');
        DCWindow.document.write(document.getElementById("DCWindow").innerHTML);
        DCWindow.document.write('</body></html>');
        DCWindow.document.close();

        setTimeout(() => {
            DCWindow.print();
            DCWindow.close();
        }, 1000);
    }

    const printModalInvoice = async (id) => {
        setModalPrintDCData([]);
        setModalOrdersData([]);
        const obj = {
            DCNumber: id,
        }
        await axios.post(MyApiUrl + "GetOutletToFactoryDCByDCNumber", obj).then(async (response) => {
            if (response.data.length > 0) {
                setblock4(false);
                setModalPrintDCData(response.data);
                await axios.get(MyApiUrl + "GetOutletToFactryDCItems/" + response.data[0].FACTORY_DC_PKID + "").then((response) => {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Order Number": item.ORDER_ORDER_NUMBER,
                            "Due Date": SplitDate(item.ORDER_DUE_DATE),
                            "Total Amount": item.ORDER_GRAND_TOTAL_AMOUNT,
                            "Attended By": item.STORE_STAFF_NAME,
                            "Customer Name": item.CUSTOMER_NAME,
                        };
                    });
                    setModalOrdersData(items);
                    // Calculate the width of the screen
                    const screenWidth = screen.width;

                    // Calculate the left position for the tags window
                    const DCWindowLeft = Math.floor((screenWidth - 780) / 4);

                    // Open the windows with the calculated positions
                    const DCWindow = window.open("", "Delivery Challan", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + DCWindowLeft);

                    DCWindow.document.write('<html><head><title>Delivery Challan</title></head><body style="font-family: Arial; font-size: 9px; letter-spacing: 1px">');
                    DCWindow.document.write(document.getElementById("DCModalWindow").innerHTML);
                    DCWindow.document.write('</body></html>');
                    DCWindow.document.close();

                    setTimeout(() => {
                        DCWindow.print();
                        DCWindow.close();
                    }, 1000);
                });
            }
        });
    }
    let footerQuantity = 0;
    let footerCount = 0;
    return (
        <div id="city">
            <div id="divLoading"></div>
            
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/OutletDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster">Delivery Challan</h1>
            <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "190px" }} id="DCModalWindow">
                <div style={{
                    width: "190px", textAlign: "center",
                }}>
                    {ModalPrintDCData.length > 0 ?
                        <center>
                            <table width="525" className="bottom" cellspacing="0" cellpadding="2" style={{ borderLeft: "1px solid #000", borderTop: "1px solid #000", }}>

                                <tr style={{ textAlign: "center" }}>
                                    <td colspan="4" style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid"
                                    }}>
                                        <h3 style={{ margin: "2px 0px 0px 0px", padding: "0px 0px 0px 0px", fontSize: 10 }}>
                                            DELIVERY CHALLAN</h3>
                                        <h2 style={{ padding: "0px 0px 0px 0px", fontSize: "14px" }}>Laundrexx Fabric Care India(P) Ltd.</h2>
                                    </td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <td colspan="3" style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid"
                                    }}>
                                        <img src="./assets/images/LogoN.png" width="170" height="50" alt="logo1" />
                                    </td>
                                    <td colspan="1" class="top bottom left right" style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid"
                                    }}>
                                        <img className="barcode" style={{ width: 70, height: 70 }} src={ViewImg + "/" + ModalPrintDCData[0].FACTORY_DC_QR} />
                                    </td>
                                </tr>

                                <tr style={{
                                    borderRight: "thin solid",
                                    borderBottom: "thin solid",
                                    borderColor: "black",
                                    fontWeight: "600",
                                    fontSize: "9px"
                                }}>
                                    <td style={{ paddingTop: 5, fontWeight: "300" }} width="15%">DC No</td>
                                    <td width="35%">
                                        : &nbsp;&nbsp;&nbsp;<b>{ModalPrintDCData[0].FACTORY_DC_NUMBER}</b>
                                    </td>
                                    <td style={{ fontWeight: "300" }} width="15%">Date</td>
                                    <td style={{ borderRight: "1px solid #000" }} width="35%">
                                        : &nbsp;&nbsp;&nbsp;<b>{SplitDate(ModalPrintDCData[0].FACTORY_DC_DATE)}</b>
                                    </td>
                                </tr>
                                <tr style={{
                                    borderRight: "thin solid",
                                    borderBottom: "thin solid",
                                    borderColor: "black",
                                    fontWeight: "600",
                                    fontSize: "9px"
                                }}>
                                    <td style={{ fontWeight: "300" }}>From Station</td>
                                    <td>: &nbsp;&nbsp;&nbsp;{StoreName}</td>
                                    <td style={{ fontWeight: "300" }}>To Station</td>
                                    <td style={{ borderRight: "1px solid #000" }}>: &nbsp;&nbsp;&nbsp;{ModalPrintDCData[0].FACTORY_NAME}</td>
                                </tr>
                                <tr style={{
                                    fontWeight: "600",
                                    fontSize: "9px"
                                }}>
                                    <td style={{ fontWeight: "300" }}>Prepared By</td>
                                    <td>: &nbsp;&nbsp;&nbsp;{ModalPrintDCData[0].STORE_STAFF_NAME}</td>
                                    <td style={{ fontWeight: "300", borderRight: "1px solid #000" }} colSpan={2}></td>
                                </tr>
                            </table>

                            <table width="525" border="0" cellspacing="0" cellpadding="2" style={{ borderTop: "1px solid #000", fontSize: 10 }}>
                                <tr>
                                    <th style={{
                                        borderLeft: "1px solid #000", borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Sl No.</th>
                                    <th style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Bill No.</th>
                                    <th style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Due Date</th>
                                    <th style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Quantity</th>
                                    <th style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Count</th>
                                </tr>
                                {ModalOrdersData.length > 0 ?
                                    ModalOrdersData.map((item, index) => {
                                        footerQuantity = footerQuantity + item.TotalQuantity;
                                        footerCount = footerCount + item.TotalCount;
                                        return (
                                            <tr>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid",
                                                    borderLeft: "1px solid #000", textAlign: "center",
                                                }}>{index + 1}</td>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid", textAlign: "center",
                                                }}>{item.ORDER_ORDER_NUMBER}</td>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid", textAlign: "center",
                                                }}>{SplitDate(item.ORDER_DUE_DATE)}</td>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid", textAlign: "center",
                                                }}>{item.TotalQuantity}</td>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid", textAlign: "center",
                                                }}>{item.TotalCount}</td>
                                            </tr>
                                        )
                                    }
                                    )
                                    : null}
                                <tr>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderLeft: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }}>Total Hangers: 0</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Bags: {ModalPrintDCData[0].FACTORY_DC_TOTAL_BAGS}</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Orders: {ModalOrdersData.length}</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Quantity: {footerQuantity}</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Count: {footerCount}</b></td>
                                </tr>
                                <tr>
                                    <td colSpan="5" style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000",
                                        height: 35,
                                        borderLeft: "1px solid #000",
                                    }}></td>
                                </tr>
                            </table>
                        </center>
                        :
                        null
                    }
                </div>
            </div>
            <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "190px" }} id="DCWindow">
                <div style={{
                    width: "190px", textAlign: "center",
                }}>
                    {PrintDCData.length > 0 ?
                        <center>
                            <table width="525" className="bottom" cellspacing="0" cellpadding="2" style={{ borderLeft: "1px solid #000", borderTop: "1px solid #000", }}>

                                <tr style={{ textAlign: "center" }}>
                                    <td colspan="4" style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid"
                                    }}>
                                        <h3 style={{ margin: "2px 0px 0px 0px", padding: "0px 0px 0px 0px", fontSize: 10 }}>
                                            DELIVERY CHALLAN</h3>
                                        <h2 style={{ padding: "0px 0px 0px 0px", fontSize: "14px" }}>Laundrexx Fabric Care India(P) Ltd.</h2>
                                    </td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <td colspan="3" style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid"
                                    }}>
                                        <img src="./assets/images/LogoN.png" width="170" height="50" alt="logo1" />
                                    </td>
                                    <td colspan="1" class="top bottom left right" style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid"
                                    }}>
                                        <img className="barcode" style={{ width: 70, height: 70 }} src={ViewImg + "/" + PrintDCData[0].FACTORY_DC_QR} />
                                    </td>
                                </tr>

                                <tr style={{
                                    borderRight: "thin solid",
                                    borderBottom: "thin solid",
                                    borderColor: "black",
                                    fontWeight: "600",
                                    fontSize: "9px"
                                }}>
                                    <td style={{ paddingTop: 5, fontWeight: "300" }} width="15%">DC No</td>
                                    <td width="35%">
                                        : &nbsp;&nbsp;&nbsp;<b>{PrintDCData[0].FACTORY_DC_NUMBER}</b>
                                    </td>
                                    <td style={{ fontWeight: "300" }} width="15%">Date</td>
                                    <td style={{ borderRight: "1px solid #000" }} width="35%">
                                        : &nbsp;&nbsp;&nbsp;<b>{SplitDate(PrintDCData[0].FACTORY_DC_DATE)}</b>
                                    </td>
                                </tr>
                                <tr style={{
                                    borderRight: "thin solid",
                                    borderBottom: "thin solid",
                                    borderColor: "black",
                                    fontWeight: "600",
                                    fontSize: "9px"
                                }}>
                                    <td style={{ fontWeight: "300" }}>From Station</td>
                                    <td>: &nbsp;&nbsp;&nbsp;{StoreName}</td>
                                    <td style={{ fontWeight: "300" }}>To Station</td>
                                    <td style={{ borderRight: "1px solid #000" }}>: &nbsp;&nbsp;&nbsp;{PrintDCData[0].FACTORY_NAME}</td>
                                </tr>
                                <tr style={{
                                    fontWeight: "600",
                                    fontSize: "9px"
                                }}>
                                    <td style={{ fontWeight: "300" }}>Prepared By</td>
                                    <td>: &nbsp;&nbsp;&nbsp;{PrintDCData[0].STORE_STAFF_NAME}</td>
                                    <td style={{ fontWeight: "300", borderRight: "1px solid #000" }} colSpan={2}></td>
                                </tr>
                            </table>

                            <table width="525" border="0" cellspacing="0" cellpadding="2" style={{ borderTop: "1px solid #000", fontSize: 10 }}>
                                <tr>
                                    <th style={{
                                        borderLeft: "1px solid #000", borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Sl No.</th>
                                    <th style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Bill No.</th>
                                    <th style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Due Date</th>
                                    <th style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Quantity</th>
                                    <th style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid", fontWeight: "800"
                                    }}>Count</th>
                                </tr>
                                {OrdersData.length > 0 ?
                                    OrdersData.map((item, index) => {
                                        footerQuantity = footerQuantity + item.TotalQuantity;
                                        footerCount = footerCount + item.TotalCount;
                                        return (
                                            <tr>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid",
                                                    borderLeft: "1px solid #000", textAlign: "center",
                                                }}>{index + 1}</td>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid", textAlign: "center",
                                                }}>{item.ORDER_ORDER_NUMBER}</td>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid", textAlign: "center",
                                                }}>{SplitDate(item.ORDER_DUE_DATE)}</td>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid", textAlign: "center",
                                                }}>{item.TotalQuantity}</td>
                                                <td style={{
                                                    borderBottom: "thin solid",
                                                    borderRight: "thin solid", textAlign: "center",
                                                }}>{item.TotalCount}</td>
                                            </tr>
                                        )
                                    }
                                    )
                                    : null}
                                <tr>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderLeft: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }}>Total Hangers: 0</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Bags: {PrintDCData[0].FACTORY_DC_TOTAL_BAGS}</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Orders: {OrdersData.length}</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Quantity: {footerQuantity}</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Count: {footerCount}</b></td>
                                </tr>
                                <tr>
                                    <td colSpan="5" style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000",
                                        height: 35,
                                        borderLeft: "1px solid #000",
                                    }}></td>
                                </tr>
                            </table>
                        </center>
                        :
                        null
                    }
                </div>
            </div>
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
                                            filterData();
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
                                <CCol col="6" style={{ alignSelf: "center" }}>All Delivery Challan's</CCol>
                                <CCol col="6">
                                    <CButton
                                        onClick={() => {
                                            setModalOrderID("");
                                            setblock4(!block4);
                                            setTimeout(() => {
                                                document.getElementById("ModalOrderID").focus();
                                            }, 1000);
                                        }}
                                        className="btn btn-primary"
                                        style={{
                                            float: "right",
                                            fontSize: "12px"
                                        }}
                                    >
                                        Print DC
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
                                    "Total Orders": (i) => (
                                        <td>
                                            <CButton
                                                className="OrderBtn"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    viewOrders(i.FACTORY_DC_PKID);
                                                }}
                                            >
                                                {i.FACTORY_DC_ORDER_COUNT}
                                            </CButton>
                                        </td>
                                    ),
                                    "DC": (i) => (
                                        <td>
                                            <CButton
                                                className="btn btn-primary"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    printDC(i);
                                                }}
                                            >
                                                Print DC
                                            </CButton>
                                        </td>
                                    ),
                                    "Status": (i) => {
                                        if (i.FACTORY_DC_STATUS === "0" || i.FACTORY_DC_STATUS === 0) {
                                            return (
                                                <td>
                                                    <span className="dc_zero">Sent to Factory</span>
                                                </td>
                                            );
                                        }
                                        else if (i.FACTORY_DC_STATUS === "1" || i.FACTORY_DC_STATUS === 1) {
                                            return (
                                                <td>
                                                    <span className="dc_one">Received in Factory</span>
                                                </td>
                                            );
                                        }
                                    },
                                    "DC Number": (i) => (
                                        <td>

                                            <CButton
                                                className="OrderBtn"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    history.push("/OutletDeliveryChallanView", {
                                                        data: i,
                                                    });
                                                }}
                                            >
                                                {i.FACTORY_DC_NUMBER}
                                            </CButton>
                                        </td>
                                    ),

                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CModal show={block4} onClose={() => setblock4(!block4)} color="dark" style={{ height: 250 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Print Delivery Challan</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormGroup row>
                        <CCol xs="12" md="12">
                            <CLabel>Order Number <span style={{ color: "red" }}>*</span></CLabel>
                            <CInput
                                id="ModalOrderID"
                                placeholder="Enter DC No./ Scan OR Code"
                                value={ModalOrderID}
                                onChange={(event) => {
                                    setModalOrderID(event.target.value);
                                    printModalInvoice(event.target.value);
                                }}
                            />
                        </CCol>
                    </CFormGroup>
                </CModalBody>
                <CModalFooter>
                    <CRow>
                        <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock4(!block4)}>
                            Close
                        </CButton>
                    </CRow>
                </CModalFooter>
            </CModal>
            <CModal show={block} onClose={() => setblock(!block)} color="dark" style={{ height: 480, width: "140%", margin: "0px 0px 0px -60px !important" }}>
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
            </CModal>
        </div>
    );
};

export default OutletDeliveryChallan;
