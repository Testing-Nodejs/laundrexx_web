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
    CLink,
    CRow,
    CButton,
    CCardFooter,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
} from "@coreui/react";
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen';
import TwoWheelerIcon from '@material-ui/icons/TwoWheeler';
import ListIcon from '@material-ui/icons/List';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PrintIcon from '@material-ui/icons/Print';
import SdStorageIcon from '@material-ui/icons/SdStorage';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CancelIcon from '@material-ui/icons/Cancel';
import "../../style.css";
import Swal from "sweetalert2";
import { MyApiUrl, ViewImg } from "src/services/service";
import { useHistory } from "react-router-dom";

const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields = [{ key: "Action" }, { key: "Category" }];

const FactoryPrintLabels = () => {
    let history = useHistory();
    const [category, setCategory] = useState("");

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

    React.useEffect(() => {
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
            <h1 style={{ marginTop: "3%" }} id="ccmaster">Print Label & Product Stickers</h1>
            <CRow style={{ marginTop: "3%" }}>
                <CCol md="12" lg="4">
                    <CLink to="/LabelPrintByDC">
                        <div className="frame">
                            <button className="MyBtn custom-btn btn-3"><span>All label print using DC</span></button>
                        </div>
                    </CLink>
                </CCol>
                <CCol md="12" lg="4">
                    <CLink to="/LabelAndProductPrintByDC">
                        <div className="frame">
                            <button className="MyBtn custom-btn btn-3"><span>All label & product print using DC</span></button>
                        </div>
                    </CLink>
                </CCol>
                <CCol md="12" lg="4">
                    <CLink to="/LabelPrintByOrder">
                        <div className="frame">
                            <button className="MyBtn custom-btn btn-3"><span>Order wise label print</span></button>
                        </div>
                    </CLink>
                </CCol>
                <CCol md="12" lg="4">
                    <CLink to="/ProductPrintByOrder">
                        <div className="frame">
                            <button className="MyBtn custom-btn btn-3"><span>Order wise product print</span></button>
                        </div>
                    </CLink>
                </CCol>
                <CCol md="12" lg="4">
                    <CLink to="/LabelAndProductPrintByOrder">
                        <div className="frame">
                            <button className="MyBtn custom-btn btn-3"><span>Order wise label & Product print</span></button>
                        </div>
                    </CLink>
                </CCol>
                <CCol md="12" lg="4">
                    <CLink to="/LabelPrintByItem">
                        <div className="frame">
                            <button className="MyBtn custom-btn btn-3"><span>Item based label print</span></button>
                        </div>
                    </CLink>
                </CCol>
                <CCol md="12" lg="4">
                    <CLink to="/ProductPrintByItem">
                        <div className="frame">
                            <button className="MyBtn custom-btn btn-3"><span>Item based Product Print</span></button>
                        </div>
                    </CLink>
                </CCol>
                <CCol md="12" lg="4">
                    <CLink to="/LabelAndProductPrintByItem">
                        <div className="frame">
                            <button className="MyBtn custom-btn btn-3"><span>Item based label and product print</span></button>
                        </div>
                    </CLink>
                </CCol>
            </CRow>
        </div>
    );
};

export default FactoryPrintLabels;
