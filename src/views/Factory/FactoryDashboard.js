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
import PublishIcon from '@mui/icons-material/Publish';
import InventoryIcon from '@mui/icons-material/Inventory';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import OutboxIcon from '@mui/icons-material/Outbox';
const OutletDashboard = () => {

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
      <CRow style={{ marginTop: "3%" }}>
        <CCol md="12" lg="4">
          <CLink to="/FactoryReceiveItems">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: "22px" }}><ListIcon style={{ fontSize: "50px" }} />Intake Items</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="4">
          <CLink to="/FactoryReceivedItems">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: "22px" }}><PlaylistAddCheckIcon style={{ fontSize: "50px" }} />Confirmed Intake</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="4">
          <CLink to="/FactoryCurrentInventory">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: "22px" }}><InventoryIcon style={{ fontSize: "50px" }} />Current Inventory</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="4">
          <CLink to="/SendOrder">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: "22px" }}><OutboxIcon style={{ fontSize: "50px" }} />Return To</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="4">
          <CLink to="/ReturnedDC">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: "22px" }}><FileDownloadDoneIcon style={{ fontSize: "50px" }} />Returned DC</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="4">
          <CLink to="/FactoryPrintLabels">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: "22px" }}><PrintIcon style={{ fontSize: "50px" }} />Print Label/Stickers</span></button>
            </div>
          </CLink>
        </CCol>

      </CRow>
    </div>
  );
};

export default OutletDashboard;
