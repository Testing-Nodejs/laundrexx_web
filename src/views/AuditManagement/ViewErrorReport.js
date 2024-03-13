/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormGroup,
    CInput,
    CSelect,
    CRow,
    CDataTable,
    CLabel,
    CDropdownDivider,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CLink,
    CTextarea,
} from "@coreui/react";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import { useHistory } from "react-router-dom";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ViewErrorReport = (props) => {

    const {
        AUDIT_REPORT_PKID,
        AUDIT_REPORT_DATE,
        AUDIT_REPORT_TIME,
    } = props.location.state.data;

    const history = useHistory();

    const [ResponseData, setResponseData] = useState([]);

    const [Time, setTime] = useState();
    const [CDate, setCDate] = useState();

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

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
        const printWindow = window.open("", "Self Audit Report Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + printWindowLeft + "");

        printWindow.document.write('<html><head><title>Self Audit Report</title>');
        printWindow.document.write('<style>@page { size: landscape; }</style>');

        printWindow.document.write('</head><body style="margin: 5px;"><b style="font-size: 14px;">Self Audit report</b><br/>');
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
            '"Sl No","Status","Remark","Order Number","Order Date","Invoice Number","Customer Name","Customer Contact Number","Door Delivery","Order Amount","Audit Date","Audit Time","Outlet"'
        );
        ResponseData.map((item) => {
            let Status = item.STORE_SELF_AUDIT_ORDERS_STATUS === "false" || item.STORE_SELF_AUDIT_ORDERS_STATUS === false ? "Not In Inventory" : "In Inventory";
            const DoorDelivery = item.ORDER_DOOR_DELIVERY === "true" || item.ORDER_DOOR_DELIVERY === true ? "Yes" : "No";
            return (
                cnt++,
                csvData.push(
                    '"' +
                    cnt +
                    '","' +
                    Status +
                    '","' +
                    item.AUDIT_REPORT_ORDERS_REMARK +
                    '","' +
                    item.ORDER_ORDER_NUMBER +
                    '","' +
                    SplitDate(item.ORDER_DATE) +
                    '","' +
                    item.ORDER_INVOICE_NUMBER +
                    '","' +
                    item.CUSTOMER_NAME +
                    '","' +
                    item.CUSTOMER_CONTACT_NUMBER +
                    '","' +
                    DoorDelivery +
                    '","' +
                    item.ORDER_GRAND_TOTAL_AMOUNT +
                    '","' +
                    SplitDate(AUDIT_REPORT_DATE) +
                    '","' +
                    AUDIT_REPORT_TIME +
                    '","' +
                    item.STORE_NAME +
                    '","' +
                    '"'
                )
            );
        });

        const fileName = "StoreAuditRepor.csv";
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

    const getOrders = () => {
        console.log(AUDIT_REPORT_PKID);
        axios.get(MyApiUrl + "ViewAuditReportForUser/" + AUDIT_REPORT_PKID + "").then((response) => {
            setResponseData(response.data);
        });
    }

    React.useEffect(() => {
        getOrders();
    }, []);

    return (
        <div id="city">
            <div id="divLoading"> </div>

            <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "100%" }} id="printWindow">
                {ResponseData.length > 0 ?
                    <div style={{ textAlign: "center" }}>
                        <div id="bills" style={{ width: "100%", height: "30px", fontSize: 14 }}>
                            <p style={{ textAlign: "left" }}>Total Number of Orders : <b>{ResponseData.length}</b></p>
                        </div><br />
                        <table id="grdpaymentDetails" border="1" cellspacing="2px" cellpadding="2px" style={{ borderRight: "1px solid #999999", fontSize: 12, width: "100%", borderCollapse: "collapse", width: "100%" }} class="txtcss totalTable">
                            <thead>
                                <tr>
                                    <td colspan="18" style={{
                                        fontWeight: "bold",
                                        color: "black", bordeBottom: "2px solid #999", padding: 5
                                    }}>
                                        Order Details &nbsp;&nbsp;Outlet Name: {ResponseData[0].STORE_NAME}
                                        <span style={{ float: "right" }}>Time : <span class="time" style={{ font: "bold", float: "right" }}>{CDate} {Time}</span> </span>
                                    </td>
                                </tr>
                                <tr style={{ color: "#000", fontWeight: "bold" }}>
                                    <th scope="col">Sl No.</th>
                                    <th scope="col">Order Date</th>
                                    <th scope="col">Order Number</th>
                                    <th scope="col">Invoice Number</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Contact Number</th>
                                    <th scope="col">Door Delivery</th>
                                    <th scope="col">Order Amount</th>
                                    <th scope="col">Audit Date</th>
                                    <th scope="col">Audit Time</th>
                                    <th scope="col">Remark</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ResponseData.map((item, index) => {
                                    return (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate(item.ORDER_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ORDER_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_INVOICE_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{item.CUSTOMER_NAME}</td>
                                            <td style={{ textAlign: "center" }}>{item.CUSTOMER_CONTACT_NUMBER}
                                            </td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_DOOR_DELIVERY === "true" || item.ORDER_DOOR_DELIVERY === true ? "Yes" : "No"}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate(AUDIT_REPORT_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{AUDIT_REPORT_TIME}</td>
                                            <td style={{ textAlign: "center" }}>{item.AUDIT_REPORT_ORDERS_REMARK}</td>
                                            <td style={{ textAlign: "center" }}>{item.AUDIT_REPORT_ORDERS_STATUS === "false" || item.AUDIT_REPORT_ORDERS_STATUS === false ? "Not In Inventory" : "In Inventory"}</td>
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
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            {ResponseData.length > 0 ?
                <h1 id="ccmaster">{ResponseData[0].STORE_NAME} Audit Report</h1>
                :
                <h1 id="ccmaster">Audit Report</h1>
            }
            <div style={{ marginTop: "2%" }}>
                <CRow>
                    <CCol col="12">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardBody>
                                <CRow>
                                    <CCol md="3">
                                        <CLabel htmlFor="nf-email">Audit Date</CLabel>
                                        <CInput
                                            type="text"
                                            value={SplitDate(AUDIT_REPORT_DATE)}
                                            readOnly={true}
                                        />
                                    </CCol>
                                    <CCol md="3">
                                        <CLabel htmlFor="nf-email">Audit Time</CLabel>
                                        <CInput
                                            type="text"
                                            value={AUDIT_REPORT_TIME}
                                            readOnly={true}
                                        />
                                    </CCol>
                                    <CCol md="2"></CCol>
                                    <CCol md="2">
                                        <CButton
                                            onClick={ToExcel}
                                            color="info"
                                            style={{ marginTop: "28px", width: "100%" }}
                                            disabled={ResponseData.length > 0 ? false : true}
                                            size="sm"
                                        >
                                            Export To Excel
                                        </CButton>
                                    </CCol>
                                    <CCol md="2">
                                        <CButton
                                            onClick={() => {
                                                printReport();
                                            }}
                                            className="btn btn-primary"
                                            style={{ marginTop: "28px", width: "100%" }}
                                            size="sm"
                                            disabled={ResponseData.length > 0 ? false : true}
                                        >
                                            Print Report
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow style={{ marginTop: "1%" }}>
                    <CCol md="12" lg="12">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <div style={{ overflow: "auto" }}>
                                <table
                                    className="table table-responsive-sm table-bordered table-hover"
                                    id="OutletPlaceOrderCouponTable"
                                >

                                    <thead>
                                        <tr>
                                            <th>
                                                <strong>Sl No</strong>
                                            </th>
                                            <th>
                                                <strong>Order Date</strong>
                                            </th>
                                            <th>
                                                <strong>Invoice No.</strong>
                                            </th>
                                            <th>
                                                <strong>Order No.</strong>
                                            </th>
                                            <th>
                                                <strong>Customer</strong>
                                            </th>
                                            <th>
                                                <strong>Contact No.</strong>
                                            </th>
                                            <th>
                                                <strong>Door Delivery</strong>
                                            </th>
                                            <th>
                                                <strong>Order Amount</strong>
                                            </th>
                                            <th>
                                                <strong>Remark</strong>
                                            </th>
                                            <th>
                                                <strong>Status</strong>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ResponseData.length > 0 ?
                                            ResponseData.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{SplitDate(item.ORDER_DATE)}</td>
                                                        <td>{item.ORDER_INVOICE_NUMBER}</td>
                                                        <td><CButton
                                                            className="OrderBtn"
                                                            style={{ fontSize: "12px" }}
                                                            onClick={() => {
                                                                history.push("/TagInvoiceReprintView", {
                                                                    data: item,
                                                                });
                                                            }}
                                                        >
                                                            {item.ORDER_ORDER_NUMBER}
                                                        </CButton></td>
                                                        <td>{item.CUSTOMER_NAME}</td>
                                                        <td>{item.CUSTOMER_CONTACT_NUMBER}</td>
                                                        <td>{item.ORDER_DOOR_DELIVERY === "true" || item.ORDER_DOOR_DELIVERY === true ? "Yes" : "No"}</td>
                                                        <td>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                                        <td style={{ textWrap: "balance" }}>{item.AUDIT_REPORT_ORDERS_REMARK}</td>
                                                        <td>
                                                            {item.AUDIT_REPORT_ORDERS_STATUS == true || item.AUDIT_REPORT_ORDERS_STATUS == "true" ?
                                                                <TaskAltIcon className="IntakeTick" />
                                                                :
                                                                <HighlightOffIcon className="IntakeUnTick" />
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            : null}
                                    </tbody>

                                </table>
                            </div>
                        </CCard>
                    </CCol>
                </CRow>
            </div>

        </div>

    );
};

export default ViewErrorReport;
