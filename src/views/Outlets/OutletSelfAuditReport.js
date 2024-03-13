/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
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

const OutletSelfAudit = () => {

    const StoreID = sessionStorage.getItem("StoreID");
    const UserName = sessionStorage.getItem("UserName");
    const StoreName = sessionStorage.getItem("StoreName");

    const history = useHistory();

    const [OrderID, setOrderID] = useState("");
    const [ResponseData, setResponseData] = useState([]);

    let statuscnt = 0;

    const GetInventoryDetails = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "OutletAllInventory/" + StoreID + "").then((response) => {
            setResponseData(response.data);
            document.getElementById("divLoading").className = "hide";

        })
            .catch((error) => {
                console.log(error);
            });
    }

    const SubmitInventory = () => {
        var obj = {
            STORE_SELF_AUDIT_OUTLET_FKID : StoreID,
            OrderList : ResponseData
        }
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "ConfirmSelfAuditReport", obj).then((response) => {
            console.log(response.data);
            if (response.data === true) {
                Swal.fire({
                    title: "Self Audit Successful!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
                history.push("/ViewOutletSelfAuditReport");
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
            const isFound = ResponseData.some(element => {
                if (element.ORDER_ORDER_NUMBER === orderno) {
                    return true;
                }
                return false;
            });

            if (isFound) {
                let Ordernum = orderno.split("-");
                const updatedData = ResponseData.map((item) => {
                    if (item.STORE_CODE !== Ordernum[0]) {
                        Swal.fire({
                            title: "This is not your outlet order",
                            icon: "warning",
                            confirmButtonText: "OK",
                        });
                        setOrderID("");
                    } else if (item.ORDER_ORDER_NUMBER === orderno) {
                        return {
                            ...item,
                            "checked": 1
                        };
                    }
                    return item;
                });
                setResponseData(updatedData);
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

    React.useEffect(() => {
        GetInventoryDetails();
    }, []);

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
            <h1 id="ccmaster" style={{ marginTop: "2%" }}>Current Inventory</h1>
            <CRow style={{ marginTop: "2%" }}>
                <CCol md="12" lg="12">
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
                                        <th>
                                            <strong>Sl No</strong>
                                        </th>
                                        <th>
                                            <strong>Order Number</strong>
                                        </th>
                                        <th>
                                            <strong>DC Number</strong>
                                        </th>
                                        <th>
                                            <strong>Factory Name</strong>
                                        </th>
                                        <th>
                                            <strong>Customer Name</strong>
                                        </th>
                                        <th>
                                            <strong>Inventory Date</strong>
                                        </th>
                                        <th>
                                            <strong>Inventory Time</strong>
                                        </th>
                                        <th>
                                            <strong>Grand Total Amount</strong>
                                        </th>
                                        <th>
                                            <strong>Status</strong>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ResponseData.length > 0 ?
                                        ResponseData.map((item, index) => {
                                            statuscnt = item.checked === 1 ? statuscnt + 1 : statuscnt - 1
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.ORDER_ORDER_NUMBER}</td>
                                                    <td>{item.FACTORY_TO_OUTLET_DC_NUMBER}</td>
                                                    <td>{item.FACTORY_NAME}</td>
                                                    <td>{item.CUSTOMER_NAME}</td>
                                                    <td>{SplitDate(item.STORE_INVENTORY_DATE)}</td>
                                                    <td>{item.STORE_INVENTORY_TIME}</td>
                                                    <td>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                                    <td>
                                                        {item.checked == 0 || item.checked == "0" ?
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
                        <CRow>
                            {statuscnt === ResponseData.length ?
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
                    </CCard>
                </CCol>
            </CRow>
        </div>

    );
};

export default OutletSelfAudit;
