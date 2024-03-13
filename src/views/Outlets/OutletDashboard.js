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
        <CCol md="12" lg="3">
          <CLink to="/OutletPlaceOrder">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><ShoppingCartOutlinedIcon style={{ fontSize: 50 }} />Place Order</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/NewCustomer">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><PersonAddIcon style={{ fontSize: 50 }} />New Customer</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/OutletViewIntakeProcess">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><AddToHomeScreenIcon style={{ fontSize: 50 }} />Intake Process</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/OutletDelivery">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><LocalShippingIcon style={{ fontSize: 50 }} />Delivery</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/OutletAdminRequest">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><TwoWheelerIcon style={{ fontSize: 50 }} />Door Delivery</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/OutletViewAllOrders">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><ListIcon style={{ fontSize: 50 }} />All Orders</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/OutletDeliveredOrders">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><PlaylistAddCheckIcon style={{ fontSize: 50 }} />Delivered Orders</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/TagInvoiceReprint">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><PrintIcon style={{ fontSize: 50 }} />Reprinting</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/OutletCurrentInventory">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><SdStorageIcon style={{ fontSize: 50 }} />Inventory</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/OutletOrderReports">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><AssignmentIcon style={{ fontSize: 50 }} />Reports</span></button>
            </div>
          </CLink>
        </CCol>
        <CCol md="12" lg="3">
          <CLink to="/OutletDayClose">
            <div className="frame">
              <button className="MyBtn custom-btn btn-3"><span style={{ fontSize: 20 }}><CancelIcon style={{ fontSize: 50 }} />Day Close</span></button>
            </div>
          </CLink>
        </CCol>
      </CRow>
    </div>
  );
};

export default OutletDashboard;
