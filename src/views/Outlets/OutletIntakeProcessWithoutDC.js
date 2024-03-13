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

const OutletIntakeProcess = (props) => {

    const {
        FACTORY_DC_PKID,
        FACTORY_DC_NUMBER,
        FACTORY_DC_DATE,
        FACTORY_NAME,
        FACTORY_CODE,
        STORE_CODE,
        STORE_NAME,
        STORE_ADDRESS,
        STORE_CITY,
        ROUTE_NAME,
        ROUTE_CODE,
        FACTORY_DC_ORDER_COUNT,
        FACTORY_DC_TOTAL_BAGS,
        FACTORY_DC_STATUS,
        TotalQuantity,
        DCInnerItems,
    } = props.location.state.data;

    const history = useHistory();

    const [OrderID, setOrderID] = useState("");
    const [OrderDetails, setOrderDetails] = useState(DCInnerItems);

    const StoreID = sessionStorage.getItem("StoreID");
    const StoreName = sessionStorage.getItem("StoreName");
    const UserName = sessionStorage.getItem("UserName");

    const [Time, setTime] = useState();
    const [CDate, setCDate] = useState();

    let statuscnt = 0;

    const SubmitInventory = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "OutletConfirmIntakeWithoutFactoryDC/" + FACTORY_DC_PKID + "").then((response) => {
            console.log(response.data);
            if (response.data === true) {
                Swal.fire({
                    title: "Inventory Confirmed!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
                printReport();
                history.goBack();
            } else if (response.data === false) {
                Swal.fire({
                    title: "Failed To Confirm!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
            }
        });
    }

    React.useEffect(() => {
    }, []);

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
        const printWindow = window.open("", "Intake Report Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + printWindowLeft + "");

        printWindow.document.write('<html><head><title>Intake Report</title>');
        printWindow.document.write('<style>@page { size: portrait; }</style>');

        printWindow.document.write('</head><body style="margin: 5px;"><b style="font-size: 14px;">Laundrexx Fabric Care India(P). Ltd</b><br><b style="font-size: 14px;">Intake Report</b><br/>');
        printWindow.document.write(document.getElementById("printWindow").innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    };

    let FooterQuantity = 0;

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
                {OrderDetails.length > 0 ?
                    <div style={{ textAlign: "center" }}>
                        <table id="grdpaymentDetails" border="1" cellspacing="2px" cellpadding="2px" style={{ borderRight: "1px solid #999999", fontSize: 12, width: "100%", borderCollapse: "collapse", width: "100%" }} class="txtcss totalTable">
                            <thead>
                                <tr>
                                    <td colspan="18" style={{
                                        fontWeight: "bold",
                                        color: "black", bordeBottom: "2px solid #999", padding: 5
                                    }}>
                                        Intake Details &nbsp;&nbsp;Outlet Name: {StoreName} &nbsp;&nbsp;User Name: {UserName}
                                        <span style={{ float: "right" }}>Time : <span class="time" style={{ font: "bold", float: "right" }}>{CDate} {Time}</span> </span>
                                    </td>
                                </tr>
                                <tr style={{ color: "#000", fontWeight: "bold" }}>
                                    <th scope="col">Sl No.</th>
                                    <th scope="col">Order No.</th>
                                    <th scope="col">Order Date</th>
                                    <th scope="col">Due Date</th>
                                    <th scope="col">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {OrderDetails.map((item, index) => {
                                    FooterQuantity = FooterQuantity + item.ORDER_ITEMS;

                                    return (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ORDER_NUMBER}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate(item.ORDER_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{SplitDate(item.ORDER_DUE_DATE)}</td>
                                            <td style={{ textAlign: "center" }}>{item.ORDER_ITEMS}</td>

                                        </tr>
                                    )
                                }
                                )}

                            </tbody>
                            <tfoot>
                                <tr>
                                    <td Colspan="4" style={{ textAlign: "right" }}>Total Quantity</td>
                                    <td style={{ textAlign: "center" }}>{FooterQuantity}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    :
                    null
                }
            </div>

            <h1 id="ccmaster" style={{ marginTop: "2%" }}>Items Received</h1>
            <CRow style={{ marginTop: "2%" }}>
                <CCol md="12" lg="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>
                            Items Received Details
                        </CCardHeader>

                        <CCardBody>
                            <CRow>
                                <CCol md="6" style={{ borderRight: "1px solid #e9ecef" }}>
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>DC No: </span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{FACTORY_DC_NUMBER}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Factory:</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{FACTORY_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>DC Date:</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{SplitDate(FACTORY_DC_DATE)}</span>
                                        </CCol>
                                    </CFormGroup>
                                </CCol>
                                <CCol md="6" style={{ borderRight: "1px solid #e9ecef" }}>
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Name: </span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{STORE_NAME}</span>
                                        </CCol>
                                    </CFormGroup>

                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md="12">
                                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                        <div style={{ overflow: "auto" }}>
                                            <table
                                                className="table table-responsive-sm table-bordered table-hover"
                                                id="OutletPlaceOrderCouponTable"
                                            >

                                                <thead>
                                                    <tr>
                                                        <td>Total Hangers: 0</td>
                                                        <td colSpan={2}>Total Bags: {FACTORY_DC_TOTAL_BAGS}</td>
                                                        <td colSpan={2}>Total Orders: {FACTORY_DC_ORDER_COUNT}</td>
                                                        <td colSpan={2}>Total Quantity: {TotalQuantity}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>
                                                            <strong>Sl No</strong>
                                                        </th>
                                                        <th>
                                                            <strong>Bill No</strong>
                                                        </th>
                                                        <th>
                                                            <strong>Date</strong>
                                                        </th>
                                                        <th>
                                                            <strong>Invoice Number</strong>
                                                        </th>
                                                        <th>
                                                            <strong>Due Date</strong>
                                                        </th>
                                                        <th>
                                                            <strong>Quantity</strong>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {OrderDetails.length > 0 ?
                                                        OrderDetails.map((item, index) => {
                                                            return (
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.ORDER_ORDER_NUMBER}</td>
                                                                    <td>{SplitDate(item.ORDER_DATE)}</td>
                                                                    <td>{item.ORDER_INVOICE_NUMBER}</td>
                                                                    <td>{SplitDate(item.ORDER_DUE_DATE)}</td>
                                                                    <td>{item.ORDER_ITEMS}</td>
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
                            <CRow>
                                <CCol lg="12" md="12">
                                    <CButton
                                        className="btn btn-success"
                                        style={{
                                            fontSize: 16,
                                            float: "right",
                                        }}
                                        onClick={SubmitInventory}
                                    >
                                        SUBMIT
                                    </CButton>
                                </CCol>
                            </CRow>

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div >

    );
};

export default OutletIntakeProcess;
