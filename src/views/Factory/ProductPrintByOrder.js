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
import { useHistory } from "react-router-dom";



const ProductPrintByOrder = () => {

    let history = useHistory();
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
                    
                    <h1 id="ccmaster" style={{ textAlign: "center" }}>Print Product Stickers By Order Number / QR Code</h1>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="3"></CCol>
                <CCol md="6">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Product Stickers</CCardHeader>
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
                                        axios.post(MyApiUrl + "OrderDetailsByNumberPrint", obj).then((response) => {
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
                                {
                                    item.Items.length > 0 ?
                                        item.Items.map((ItemInner, cnt) => {
                                            return (
                                                <table style={{ height: "80px", width: "100%", borderBottom: "3px solid rgb(0, 0, 0)", borderTop: "3px solid black" }} cellpadding="4" cellspacing="2" class="tbl">
                                                    <tr>
                                                        <td style={{ border: "0px", width: "30%" }}>
                                                            <img class="barcode" alt="barcode" style={{ width: "85px", height: "85px" }} src={ViewImg + "/" + ItemInner.ORDER_ITEM_QR} />
                                                        </td>
                                                        <td style={{ border: "0px" }}>
                                                            <b style={{ fontSize: "20px" }}>{item.CUSTOMER_NAME}</b>
                                                        </td>
                                                        <td style={{ border: "0px" }}>
                                                            <b>SD - {cnt + 1} / {item.Items.length}</b>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ width: "100%" }} align="center" >
                                                        <td colspan="2" style={{ paddingLeft: "20px" }}>
                                                            <table style={{ width: "140%", borderCollapse: "collapse", padding: "0px" }}>
                                                                <tr>
                                                                    <td style={{ borderBottom: "1px solid black", borderRight: "1px solid black" }} rowspan="2"><b>{item.STORE_CODE}</b></td>
                                                                    <td style={{ borderBottom: "1px solid black", fontSize: "16px", textAlign: "center" }} align="center">{item.STORE_NAME}</td>
                                                                </tr>
                                                                <td style={{ borderBottom: "1px solid black", fontSize: "16px", textAlign: "center" }} align="center"><b>{ItemInner.ORDER_ITEM_NUMBER}</b></td>

                                                                <tr>
                                                                    <td colspan="3" align="center" style={{ fontSize: "14px", textAlign: "center", paddingLeft: "3em" }}><b>{item.SERVICE_CATEGORY_CODE} - {ItemInner.ITEMS_NAME}</b></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>)
                                        }) : null
                                }
                            </React.Fragment>
                        )
                    })
                    :
                    null}
            </div>
        </div>
    );
};

export default ProductPrintByOrder;
