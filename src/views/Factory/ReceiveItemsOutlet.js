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

const ReceiveItemsOutlet = (props) => {

    console.log(props)

    const history = useHistory();
    const FactoryID = sessionStorage.getItem("FactoryID");
    const FactoryName = sessionStorage.getItem("StoreName");

    const [ReceivedData, setReceivedData] = useState([props.history.location.state.data]);
    const [ReceivedItemsData, setReceivedItemsData] = useState(props.history.location.state.data.DCInnerItems);

    const SubmitInventory = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "FactoryConfirmInTake/" + ReceivedData[0].FACTORY_DC_PKID + "").then((response) => {
            console.log(response.data);
            if (response.data === true) {
                Swal.fire({
                    title: "Inventory Confirmed!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
                history.push("/ViewOutletReceivedItems");
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

    return (
        <div id="city">
            <div id="divLoading"> </div>

            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/FactoryDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster" style={{ marginTop: "3%" }}>Items Received</h1>
            
            
            <CRow style={{ marginTop: "2%" }}>
                {ReceivedData.length > 0 ?
                    <CCol md="12" lg="12">

                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>

                            <CCardHeader>Items Received Details</CCardHeader>

                            <CCardBody>
                                <CRow>
                                    <CCol md="6" style={{ borderRight: "1px solid #e9ecef" }}>
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>DC No: </span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{ReceivedData[0].FACTORY_DC_NUMBER}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Outlet:</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{ReceivedData[0].STORE_NAME}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Prepared By:</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{ReceivedData[0].STORE_STAFF_NAME}</span>
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>

                                    <CCol md="6">
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Date:</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{(ReceivedData[0].FACTORY_DC_DATE).split("T")[0]}</span>
                                            </CCol>
                                        </CFormGroup>
                                        <CDropdownDivider />
                                        <CFormGroup row>
                                            <CCol md="4">
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Factory Name:</span>
                                            </CCol>
                                            <CCol md="8">
                                                <span style={{ fontSize: "14px", color: "#757575" }}>{FactoryName}</span>
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                </CRow>

                            </CCardBody>

                            <div style={{ overflow: "auto" }}>
                                <table
                                    className="table table-responsive-sm table-bordered table-hover"
                                    id="OutletPlaceOrderCouponTable"
                                >

                                    <thead>
                                        {ReceivedData.length > 0 ?
                                            <tr>
                                                <td>Total Hangers: 0</td>
                                                <td>Total Bags: {ReceivedData[0].FACTORY_DC_TOTAL_BAGS}</td>
                                                <td>Total Orders: {ReceivedData[0].FACTORY_DC_ORDER_COUNT}</td>
                                                <td>Total Quantity: {ReceivedData[0].TotalQuantity}</td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <th>
                                                <strong>Sl No</strong>
                                            </th>
                                            <th>
                                                <strong>Bill No</strong>
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
                                        {ReceivedItemsData.length > 0
                                            ? ReceivedItemsData.map((item, index) => (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.ORDER_ORDER_NUMBER}</td>
                                                    <td>{item.ORDER_DUE_DATE.split("T")[0]}</td>
                                                    <td>{item.ORDER_ITEMS}</td>
                                                </tr>
                                            ))
                                            : null}
                                    </tbody>

                                </table>
                            </div>
                        </CCard>
                        <CRow>
                            <CCol lg="12" md="12">
                                <CButton
                                    size="md"
                                    id="btn1"
                                    style={{
                                        backgroundColor: "green",
                                        size: 20,
                                        color: "white",
                                        float: "right",
                                        marginBottom: 6
                                    }}
                                    onClick={SubmitInventory}
                                >
                                    Confirm Inventory
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCol> : null}
            </CRow>
        </div>

    );
};

export default ReceiveItemsOutlet;
