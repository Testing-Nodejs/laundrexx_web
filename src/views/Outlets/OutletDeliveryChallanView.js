/* eslint-disable no-restricted-globals */
/**
 * @author KIMOSABE
 * @email Kimosabe@mail.com
 * @create date 2021-11-25 17:00:15
 * @modify date 2021-12-06 15:32:46
 * @desc [description]
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
    CFormGroup,
    CDropdownDivider,
    CLink
} from "@coreui/react";
import { MyApiUrl, ViewImg } from "src/services/service";
import "../../style.css";
import { useHistory } from "react-router-dom";

const OutletDeliveryChallanView = (props) => {

    const StoreID = sessionStorage.getItem("StoreID");
    const StoreName = sessionStorage.getItem("StoreName");

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }
    const [OrdersData, setOrdersData] = useState([]);

    const {
        Bags,
        TotalQuantity,
        FACTORY_CODE,
        TotalCount,
        FACTORY_DC_DATE,
        FACTORY_DC_FACCTORY_FKID,
        FACTORY_DC_NUMBER,
        FACTORY_DC_ORDER_COUNT,
        FACTORY_DC_OUTLET_FKID,
        FACTORY_DC_PKID,
        FACTORY_DC_QR,
        FACTORY_DC_STAFF_FKID,
        FACTORY_DC_STATUS,
        FACTORY_DC_TOTAL_BAGS,
        FACTORY_ID,
        FACTORY_NAME,
        Outlet,
        STORE_STAFF_NAME,
    } = props.location.state.data;

    const viewDC = async () => {
        await axios.get(MyApiUrl + "GetOutletToFactryDCItems/" + FACTORY_DC_PKID + "").then((response) => {
            setOrdersData(response.data);
        });
    }

    React.useEffect(() => {
        viewDC();
        // viewOrders();
    }, []);

    let history = useHistory();
    let footerQuantity = 0;
    let footerCount = 0;
    return (
        <div>
            <div id="divLoading"> </div>
            
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/OutletDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <CRow>
                <CCol md="12">
                    <h1 id="ccmaster">Delivery Challan Preview </h1>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "2%", marginBottom: "2%" }}>
                <CCol md="2" />
                <CCol md="8">
                    <center>
                        <table width="100%" className="bottom DCView" cellspacing="0" cellpadding="2" style={{ borderLeft: "1px solid #000", borderTop: "1px solid #000", }}>

                            <tr style={{ textAlign: "center" }}>
                                <td colspan="4" style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid"
                                }}>
                                    <h3 style={{ margin: "2px 0px 0px 0px", padding: "0px 0px 0px 0px", fontSize: 12, textAlign: "center" }}>
                                        DELIVERY CHALLAN</h3>
                                    <h2 style={{ padding: "0px 0px 0px 0px", fontSize: "16px", textAlign: "center", marginTop: "5px" }}>Laundrexx Fabric Care India(P) Ltd.</h2>
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td colspan="3" style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    textAlign: "center"
                                }}>
                                    <img src="./assets/images/LogoN.png" alt="logo1" style={{ width: "60%", height: 65 }} />
                                </td>
                                <td colspan="1" class="top bottom left right" style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    textAlign: "center"
                                }}>
                                    <img className="barcode" style={{ width: 70, height: 70 }} src={ViewImg + "/" + FACTORY_DC_QR} />
                                </td>
                            </tr>

                            <tr>
                                <td style={{ paddingTop: 5, fontWeight: "300", textAlign: "left" }} width="15%">DC No</td>
                                <td width="35%" style={{ textAlign: "left" }}>
                                    : &nbsp;&nbsp;&nbsp;<b>{FACTORY_DC_NUMBER}</b>
                                </td>
                                <td style={{ fontWeight: "300", textAlign: "left" }} width="15%">Date</td>
                                <td style={{ borderRight: "1px solid #000", textAlign: "left" }} width="35%">
                                    : &nbsp;&nbsp;&nbsp;<b>{SplitDate(FACTORY_DC_DATE)}</b>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "300", textAlign: "left" }}>From Station</td>
                                <td style={{ textAlign: "left" }}>: &nbsp;&nbsp;&nbsp;<b>{StoreName}</b></td>
                                <td style={{ fontWeight: "300", textAlign: "left" }}>To Station</td>
                                <td style={{ borderRight: "1px solid #000", textAlign: "left" }}>: &nbsp;&nbsp;&nbsp;<b>{FACTORY_NAME}</b></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "300", textAlign: "left" }}>Prepared By</td>
                                <td style={{ textAlign: "left" }}>: &nbsp;&nbsp;&nbsp;<b>{STORE_STAFF_NAME}</b></td>
                                <td style={{ fontWeight: "300", borderRight: "1px solid #000" }} colSpan={2}></td>
                            </tr>
                        </table>

                        <table width="100%" border="0" cellspacing="0" cellpadding="2" style={{ borderTop: "1px solid #000", fontSize: 10 }}>
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
                                }}><b style={{ fontWeight: "800" }} >Total Bags: {FACTORY_DC_TOTAL_BAGS}</b></td>
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
                </CCol>
                <CCol md="2" />
            </CRow>

        </div>
    );
};

export default OutletDeliveryChallanView;
