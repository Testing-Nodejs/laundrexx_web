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
    CLink,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import { MyApiUrl, ViewImg } from "src/services/service";
import ViewInvoice from "../ViewInvoice";
import "../../style.css";

const TagInvoiceReprintView = (props) => {
    const {
        ORDER_ORDER_NUMBER,
    } = props.location.state.data;

    let history = useHistory();
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
                    <h1 id="ccmaster">Invoice Preview </h1>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "2%", marginBottom: 10 }}>
                <CCol md="2" />
                <ViewInvoice value={ORDER_ORDER_NUMBER} />
            </CRow>

        </div>
    );
};

export default TagInvoiceReprintView;
