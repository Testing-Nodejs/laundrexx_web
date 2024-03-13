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
    CDataTable,
    CButton,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CModal,
    CLabel,
    CInput,
    CSelect,
    CFormGroup,
    CTextarea,
    CDropdownDivider,
    CLink,
} from "@coreui/react";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { useSpeechSynthesis } from 'react-speech-kit';
import "../../style.css";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const StartAuditProcessAudit = () => {
    const UserID = sessionStorage.getItem("UserID");
    const SessionType = sessionStorage.getItem("SessionType");

    const [ResponseData, setResponseData] = useState([]);
    const [OutletList, setOutletList] = useState();
    const [Outlet, setOutlet] = useState("-");
    const [OutletName, setOutletName] = useState("");
    const [OrderID, setOrderID] = useState("");
    let statuscnt = 0;

    const history = useHistory();

    const { speak } = useSpeechSynthesis();

    // Filters
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

    const getOutlet = async () => {
        if (SessionType == "Manager") {
            await axios.get(MyApiUrl + "OutletsByManager/" + UserID + "").then((response) => {
                const Option = response.data.map((item, i) => (
                    <option key={i} value={item.STORE_PKID + "-" + item.STORE_NAME}>
                        {item.STORE_NAME}
                    </option>
                ));
                setOutletList(Option);
            });
        } else {
            await axios.get(MyApiUrl + "Outlets").then((response) => {
                const Option = response.data.map((item, i) => (
                    <option key={i} value={item.STORE_PKID + "-" + item.STORE_NAME}>
                        {item.STORE_NAME}
                    </option>
                ));
                setOutletList(Option);
            });
        }
    };

    const getAllOrders = async (outlet) => {
        document.getElementById("divLoading").className = "show";
        await axios.get(MyApiUrl + "OutletAllInventoryForAdmin/" + outlet.split("-")[0] + "").then((response) => {
            setResponseData(response.data);
            document.getElementById("divLoading").className = "hide";
        })
            .catch((error) => {
                document.getElementById("divLoading").className = "hide";
                console.log(error);
            });
    };

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', { month: 'long' });
    }

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + getMonthName(OrderDates[1]) + "-" + OrderDates[0];
        return FinalDate;
    }
    const SplitDate1 = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    React.useEffect(() => {
        getOutlet();
    }, []);

    const SubmitInventory = () => {
        var obj = {
            AUDIT_REPORT_OUTLET_FKID: Outlet.split("-")[0],
            AUDIT_REPORT_BY: SessionType,
            AUDIT_REPORT_BY_FKID: UserID,
            OrderList: ResponseData
        }
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "ConfirmMainAudit", obj).then((response) => {
            if (response.data === true) {
                Swal.fire({
                    title: "Audit Successfully Submitted!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
                history.push("/PreviousAuditReport");
            } else if (response.data === false) {
                Swal.fire({
                    title: "Failed To Submit!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
            }
        });
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
                const updatedData = ResponseData.map((item) => {
                    let Ordernum = orderno.split("-");
                    if (item.ORDER_ORDER_NUMBER === orderno) {
                        if (item.FACTORY_TO_OUTLET_DC_NUMBER == "" || item.FACTORY_TO_OUTLET_DC_NUMBER == null) {
                            Swal.fire({
                                title: "This is not choosed outlet order",
                                icon: "warning",
                                confirmButtonText: "OK",
                            });
                            speak({ text: `This is not selected outlet order` });
                        }
                        else {
                            return {
                                ...item,
                                "checked": 1,
                                "remark": "In Inventory"
                            };
                        }
                    }
                    return item;
                });
                setResponseData(updatedData);
                setTimeout(function () {
                    setOrderID("");
                    document.getElementById("OrderNo").focus();
                }, 500);
            } else {
                var obj = {
                    OrderNumber: orderno,
                }
                axios.post(MyApiUrl + "OutletAllInventoryFromOrderNumber", obj).then((response) => {
                    if (response.data.length > 0) {
                        setResponseData([...ResponseData, response.data[0]]);
                        Swal.fire({
                            title: "Incorrect Outlet Order Scanned!",
                            icon: "warning",
                            confirmButtonText: "OK",
                        });
                        speak({ text: `Incorrect Outlet Order Scanned` });
                        setTimeout(function () {
                            setOrderID("");
                            document.getElementById("OrderNo").focus();
                        }, 500);
                    } else {
                        Swal.fire({
                            title: "Order Number Not Listed in Inventory",
                            icon: "warning",
                            confirmButtonText: "OK",
                        });
                        speak({ text: `Order number Not Listed in Inventory` });
                        setTimeout(function () {
                            setOrderID("");
                            document.getElementById("OrderNo").focus();
                        }, 500);
                    }
                });
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
            <CRow style={{ marginTop: "1%", borderBottom: "1px solid #d4d4d4", paddingBottom: "2%" }}>
                <CCol md="3" style={{ alignSelf: "center" }}>
                    <CSelect
                        custom
                        name="merchant"
                        value={Outlet}
                        onChange={(event) => {
                            const val = event.target.value;
                            if (val == "-") {
                                setOutlet("-");
                                setResponseData([]);
                            }
                            else {
                                setOutlet(val);
                                const splitVal = val.split("-");
                                setOutletName(splitVal[1]);
                                getAllOrders(splitVal[0]);
                                setTimeout(function () {
                                    document.getElementById("OrderNo").focus();
                                }, 200);
                            }
                        }}
                        id="merchant"
                    >
                        <option value="-">Select Outlet</option>
                        {OutletList}
                    </CSelect>
                </CCol>
                <CCol md="7" style={{ alignSelf: "center" }}>
                    {Outlet == "-" ?
                        <h1 id="ccmaster">Current Inventory</h1>
                        :
                        <h1 id="ccmaster">Current {OutletName} Inventory</h1>
                    }
                </CCol>
            </CRow>
            {Outlet == "-" ? null :
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
                                                <strong>Customer</strong>
                                            </th>
                                            <th>
                                                <strong>Inventory Date</strong>
                                            </th>
                                            <th>
                                                <strong>Inventory Time</strong>
                                            </th>
                                            <th>
                                                <strong>Total Amount</strong>
                                            </th>
                                            <th>
                                                <strong>Remark</strong>
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
                                                        <td>{item.ORDER_ORDER_NUMBER == "" || item.ORDER_ORDER_NUMBER == null ? "-" : item.ORDER_ORDER_NUMBER}</td>
                                                        <td>{item.FACTORY_TO_OUTLET_DC_NUMBER == "" || item.FACTORY_TO_OUTLET_DC_NUMBER == null ? "-" : item.FACTORY_TO_OUTLET_DC_NUMBER}</td>
                                                        <td>{item.CUSTOMER_NAME == "" || item.CUSTOMER_NAME == null ? "-" : item.CUSTOMER_NAME}</td>
                                                        <td>{item.STORE_INVENTORY_DATE == "" || item.STORE_INVENTORY_DATE == null ? "-" : SplitDate1(item.STORE_INVENTORY_DATE)}</td>
                                                        <td>{item.STORE_INVENTORY_TIME == "" || item.STORE_INVENTORY_TIME == null ? "-" : item.STORE_INVENTORY_TIME}</td>
                                                        <td>{item.ORDER_GRAND_TOTAL_AMOUNT == "" || item.ORDER_GRAND_TOTAL_AMOUNT == null ? "-" : item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                                        <td>{item.remark}</td>
                                                        <td style={{ textWrap: "balance" }}>
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
                            <CCardBody>

                                {ResponseData.length > 0 ?
                                    <CRow>
                                        <CCol lg="12" md="12">
                                            <CButton
                                                className="btn btn-success"
                                                style={{
                                                    fontSize: 13,
                                                    float: "right",
                                                }}
                                                onClick={SubmitInventory}
                                            >
                                                SUBMIT
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                    : null}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            }
        </div>
    );
};

export default StartAuditProcessAudit;
