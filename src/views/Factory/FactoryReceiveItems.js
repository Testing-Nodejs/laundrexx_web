import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import "../../style.css";
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
import TelegramIcon from '@material-ui/icons/Telegram';
import SendToMobileIcon from '@mui/icons-material/SendToMobile';
import OutboxIcon from '@mui/icons-material/Outbox';
const FactoryReceiveItems = () => {

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

  let history = useHistory();
  return (
    <div id="city">
      <div id="divLoading"> </div>
      <CRow>
        <CCol md="12" lg="12" style={{borderBottom: "1px solid #e8e8e8",padding: "5px 0px 5px 10px"}}>
          <span style={{fontSize: "16px",fontFamily: "sans-serif"}}>
            <CLink to="/FactoryDashboard" style={{paddingRight: "1%",color:"#098adc"}}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{paddingLeft: "1%",color: "#000000"}}>Back</CLink>
          </span>
        </CCol>
      </CRow>
      <CRow style={{ marginTop: "3%" }}>
        <CCol md="2"></CCol>
        <CCol md="12" lg="4">
          <CLink to="/ViewAllOutletReceiveItems">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{fontSize:"22px"}}><SendToMobileIcon style={{fontSize:"50px"}}/>From Outlet</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="4">
          <CLink to="/ViewAllFactoryReceiveItems">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{fontSize:"22px"}}><OutboxIcon style={{ fontSize: "50px" }} />From Factory</span></button>
            </div>
          </CLink>
        </CCol>
      </CRow>
    </div>
  );
};

export default FactoryReceiveItems;
