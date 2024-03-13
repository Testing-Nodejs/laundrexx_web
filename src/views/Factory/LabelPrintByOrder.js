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
    CButton,
    CLink,
    CFormGroup,
    CInput,
    CLabel,
} from "@coreui/react";
import "../../style.css";
import { MyApiUrl, ViewImg } from "src/services/service";

const LabelPrintByOrder = () => {


    const [OrderNumber, setOrderNumber] = useState("");
    const [OrderNumberData, setOrderNumberData] = useState([]);

    const PrintStickers = () => {
        var mywindow = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));

        //                        alert(mywindow);
        var styles = "<style>";
        styles += ".card{width: 262px;height: 130px;border: 1px solid #000; margin: 0px 0px 0px 8px;}";
        styles += "@page { size: auto;  margin: 0mm; } @media print{ body{margin:0; padding:0;} .card:not(:first-child){margin-top:100px;}}";
        styles += "</style>";

        mywindow.document.write('<html><head><title>' + document.title + '</title>');
        mywindow.document.write(styles);
        mywindow.document.write('</head><body >');
        mywindow.document.write(document.getElementById("print1").innerHTML);

        //                mywindow.document.write(' <img  style="width: 60px; height: 60px;" src="../img/Customers.jpg" />');

        mywindow.document.write('</body></html>');
        //                mywindow.print();
        mywindow.document.close();


        setTimeout(function () {
            mywindow.print();
            mywindow.close();
            window.close();
            setOrderNumber("");
            document.getElementById("OrderNumber").focus();
        }, 1000);
    }

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    React.useEffect(() => {
        document.getElementById("OrderNumber").focus();
    }, []);

    return (
        <div className="123">
            <div id="divLoading"> </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/FactoryDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="12">
                    
                    <h1 id="ccmaster" style={{ textAlign: "center" }}>Print label Stickers By Order Number / QR Code</h1>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="3"></CCol>
                <CCol md="6">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Label Stickers</CCardHeader>
                        <CCardBody>
                            <CFormGroup>
                                <CLabel htmlFor="">Order Number <span style={{ color: "red" }}>*</span></CLabel>
                                <CInput
                                    type="text"
                                    id="OrderNumber"
                                    name="category"
                                    value={OrderNumber}
                                    placeholder="Enter Order Number / Scan QR"
                                    onChange={(event) => {
                                        setOrderNumber(event.target.value);
                                        var obj = {
                                            OrderNumber: event.target.value
                                        }
                                        console.log(obj)
                                        axios.post(MyApiUrl + "OrderDetailsByNumber", obj).then((response) => {
                                            if (response.data.length > 0) {
                                                setOrderNumberData(response.data);
                                                PrintStickers();
                                            }
                                        });
                                    }}

                                />
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="3"></CCol>
            </CRow>
            <div id="print1" style={{ display: "none" }} >
                {OrderNumberData.length > 0 ?
                    OrderNumberData.map((item) => {
                        return (
                            <React.Fragment>
                                <table style={{
                                    width: "100%", borderBottom: "2px solid black",
                                    borderTop: "4px solid black"
                                }}>
                                    <tr>
                                        <td style={{ textAlign: "right", paddingBottom: "6px" }}><p style={{ margin: "0px", fontSize: "21px", fontWeight: "900", marginRight: "5%" }}>{item.CUSTOMER_NAME}</p></td>
                                        <td rowspan="3">
                                            <img style={{ width: "96px", height: "96px", float: "right" }} alt="dsadsa" src={ViewImg + "/" + item.ORDER_QR} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><p style={{ margin: "0px", fontSize: "17px" }}>Due Date: <span style={{ fontWeight: "600" }}>{SplitDate(item.ORDER_DUE_DATE)}</span></p></td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingTop: "5px" }}><p style={{ margin: "0px", fontSize: "17px" }}>Order No: <span style={{ fontWeight: "600" }}>{item.ORDER_ORDER_NUMBER}</span></p></td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingTop: "5px" }}><p style={{ margin: "0px", fontSize: "17px" }}>Invoice No: <span style={{ fontWeight: "600" }}>{item.ORDER_INVOICE_NUMBER}</span></p></td>
                                    </tr>
                                    <tr>
                                        <td><p style={{ margin: "0px", fontSize: "17px" }}>Outlet: <span style={{ fontWeight: "600" }}>{item.STORE_NAME}</span></p></td>
                                        <td style={{ textAlign: "right", paddingRight: "8%" }}><p style={{ margin: "0px", fontSize: "30px", fontWeight: "900" }}>{item.STORE_CODE}</p></td>
                                    </tr>
                                </table>
                            </React.Fragment>
                        )
                    })
                    :
                    null}
            </div>
        </div>
    );
};

export default LabelPrintByOrder;
