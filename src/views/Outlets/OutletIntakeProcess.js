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
        FACTORY_STAFF_NAME,
        FACTORY_TO_OUTLET_DC_PKID,
        FACTORY_TO_OUTLET_DC_NUMBER,
        FACTORY_TO_OUTLET_DC_DATE,
        FACTORY_TO_OUTLET_DC_TIME,
        FACTORY_NAME,
        FACTORY_CODE,
        STORE_CODE,
        STORE_NAME,
        STORE_ADDRESS,
        STORE_CITY,
        ROUTE_NAME,
        ROUTE_CODE,
        STORE_STAFF_NAME,
        FACTORY_TO_OUTLET_DC_ORDER_COUNT,
        FACTORY_TO_OUTLET_DC_ITEMS_COUNT,
        FACTORY_TO_OUTLET_DC_TOTAL_BAGS,
        FACTORY_TO_OUTLET_DC_STATUS,
        DCInnerItems,
    } = props.location.state.data;

    const history = useHistory();

    const [OrderID, setOrderID] = useState("");
    const [OrderDetails, setOrderDetails] = useState(DCInnerItems);

    let statuscnt = 0;

    const SubmitInventory = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "OutletConfirmIntake/" + FACTORY_TO_OUTLET_DC_PKID + "").then((response) => {
            console.log(response.data);
            if (response.data === true) {
                Swal.fire({
                    title: "Inventory Confirmed!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
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
        document.getElementById("OrderNo").focus();
    }, [statuscnt]);

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    const UpdateOrderNumber = (orderno) => {
        if (orderno.length >= 10) {
            const isFound = OrderDetails.some(element => {
                if (element.ORDER_ORDER_NUMBER === orderno) {
                    return true;
                }
                return false;
            });

            if (isFound) {
                let Ordernum = orderno.split("-");
                const updatedData = OrderDetails.map((item) => {
                    if (STORE_CODE !== Ordernum[0]) {
                        Swal.fire({
                            title: "This is not your outlet order",
                            icon: "warning",
                            confirmButtonText: "OK",
                        });
                        setOrderID("");
                    } else if (item.ORDER_ORDER_NUMBER === orderno) {
                        return {
                            ...item,
                            "ReceivedStatus": 1
                        };
                    }
                    return item;
                });
                setOrderDetails(updatedData);
            } else {
                Swal.fire({
                    title: "Order Number Not Listed in DC",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                setOrderID("");
            }
        }
    }


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
            <h1 id="ccmaster">Items Received</h1>
            <CRow style={{ marginTop: "2%" }}>
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
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{FACTORY_TO_OUTLET_DC_NUMBER}</span>
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
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Factory Staff:</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{FACTORY_STAFF_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                </CCol>

                                <CCol md="6">
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>DC Date:</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{SplitDate(FACTORY_TO_OUTLET_DC_DATE)}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="4">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>DC Time:</span>
                                        </CCol>
                                        <CCol md="8">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{FACTORY_TO_OUTLET_DC_TIME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md="12">
                                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                        <CCardBody>
                                            <CRow>
                                                <CCol md="4">
                                                    <CLabel>Order No/Scan QR Code <span style={{ color: "red" }}>*</span></CLabel>
                                                    <CInput
                                                        id="OrderNo"
                                                        name="OrderNo"
                                                        placeholder="Enter Order No/Scan QR Code"
                                                        value={OrderID}
                                                        onChange={(event) => {
                                                            setOrderID(event.target.value);
                                                            UpdateOrderNumber(event.target.value);
                                                        }}
                                                    />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                        <div style={{ overflow: "auto" }}>
                                            <table
                                                className="table table-responsive-sm table-bordered table-hover"
                                                id="OutletPlaceOrderCouponTable"
                                            >

                                                <thead>
                                                    <tr>
                                                        <td>Total Hangers: 0</td>
                                                        <td colSpan={2}>Total Bags: {FACTORY_TO_OUTLET_DC_TOTAL_BAGS}</td>
                                                        <td colSpan={2}>Total Orders: {FACTORY_TO_OUTLET_DC_ORDER_COUNT}</td>
                                                        <td colSpan={2}>Total Quantity: {FACTORY_TO_OUTLET_DC_ITEMS_COUNT}</td>
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
                                                            <strong>Due Date</strong>
                                                        </th>
                                                        <th>
                                                            <strong>Quantity</strong>
                                                        </th>
                                                        <th>
                                                            <strong>Total Bags</strong>
                                                        </th>
                                                        <th>
                                                            <strong>Status</strong>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {OrderDetails.length > 0 ?
                                                        OrderDetails.map((item, index) => {
                                                            statuscnt = item.ReceivedStatus === 1 ? statuscnt + 1 : statuscnt - 1
                                                            return (
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.ORDER_ORDER_NUMBER}</td>
                                                                    <td>{SplitDate(item.ORDER_DATE)}</td>
                                                                    <td>{SplitDate(item.ORDER_DUE_DATE)}</td>
                                                                    <td>{item.ORDER_ITEMS}</td>
                                                                    <td>{item.FACTORY_TO_OUTLET_DC_ITEMS_BAGS}</td>
                                                                    <td>
                                                                        {item.ReceivedStatus == 0 || item.ReceivedStatus == "0" ?
                                                                            <HighlightOffIcon className="IntakeUnTick" />
                                                                            :
                                                                            <TaskAltIcon className="IntakeTick" />
                                                                        }
                                                                    </td>
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
                                {statuscnt === OrderDetails.length ?
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
                                    : null}
                            </CRow>

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>

    );
};

export default OutletIntakeProcess;
