/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CModal,
    CModalHeader,
    CFormGroup,
    CInput,
    CLabel,
    CModalTitle,
    CRow,
    CLink,
    CModalBody,
    CModalFooter,
} from "@coreui/react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl, ViewImg } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import { useHistory } from "react-router-dom";

const OutletByDeliveryCode = (props) => {

    const history = useHistory();

    const StoreID = sessionStorage.getItem("StoreID");
    const UserName = sessionStorage.getItem("UserName");
    const StoreName = sessionStorage.getItem("StoreName");

    const [block, setBlock] = useState(false);
    const [IsCash, setIsCash] = useState(0);
    const [CardHeight, setCardHeight] = useState("400px");

    const [Code, setCode] = useState("");
    const [ResponseData, setResponseData] = useState([]);
    const [SelectedOrders, setSelectedOrders] = useState(0);
    const [OrderTotalAmount, setOrderTotalAmount] = useState(0);
    const [BadDebits, setBadDebits] = useState(0);
    const [FinalAmount, setFinalAmount] = useState(0);

    const [ParentChecked, setParentChecked] = useState(false);
    const [Collected, setCollected] = useState("");
    const [Balance, setBalance] = useState("");
    const [Type, setType] = useState("");

    const otpverification = localStorage.getItem("DeliveryCode");

    let sorders = 0;

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

    const CollectedValue = (event) => {
        setCollected(event.target.value);
        setBalance(parseFloat(FinalAmount) - parseFloat(event.target.value));

    }

    const VerifyOtp = () => {
        const obj = {
            OutletID: StoreID,
            PhoneNumber: props.location.state.PhoneNo,
            otp: Code,

        }
        console.log(obj)
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "VerifyDeliveryCode", obj).then((response) => {
            console.log(response.data);
            if (response.data === 0) {
                Swal.fire({
                    title: "Invalid Phone Number!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
            }
            else if (response.data === 1 || response.data === "1") {
                Swal.fire({
                    title: "Invalid OTP!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
            } else if (response.data === 3 || response.data === "3") {
                Swal.fire({
                    title: "Delivery Code Verified!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                localStorage.setItem("DeliveryOTP", "1");
                document.getElementById("divLoading").className = "hide";
                axios.get(MyApiUrl + "GetOrdersListByPhoneNumber/" + props.location.state.PhoneNo + "").then((response) => {
                    console.log(response.data)
                    if (response.data.length > 0) {
                        setResponseData(response.data);

                    }

                });

            }

        });

    }
    const ParentCheckBoxChecked = (Outlets) => {
        let ParentCheckBox = 0;
        const updatedData = Outlets.map((item) => {
            if (item.checked === 1 || item.checked === true) {
                ParentCheckBox++;
            }
        });
        setParentChecked(ParentCheckBox === Outlets.length ? true : false);
    }

    const HandleParentCheckbox = (event) => {
        let total_orderAmount = 0;
        let total_orderCount = 0;
        let total_badDebit = 0;
        let total_finalAmount = 0;
        setParentChecked(event.target.checked);
        const updatedData = ResponseData.map((item) => {
            total_orderCount = total_orderCount + 1;
            total_orderAmount = total_orderAmount + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
            total_badDebit = total_badDebit + parseFloat(item.ORDER_BAD_DEBITS);
            return { ...item, checked: event.target.checked };
        });
        if (event.target.checked) {
            setOrderTotalAmount(total_orderAmount);
            setSelectedOrders(total_orderCount);
            setBadDebits(total_badDebit);
            setFinalAmount(parseFloat(total_orderAmount) + parseFloat(total_badDebit));
        } else {
            setOrderTotalAmount(0);
            setBadDebits(0);
            setFinalAmount(0);
            setSelectedOrders(0);

        }
        setResponseData(updatedData);
    }


    const InnerCheckBoxChecked = (event) => {
        var OrderAmount = event.target.value.split("-")[1];
        var OrderID = event.target.value.split("-")[0];
        var BadDeb = event.target.value.split("-")[2];
        if (event.target.checked) {
            var ordercnt = SelectedOrders;
            var totalamt = OrderTotalAmount;
            var baddebitsamt = BadDebits;

            const updatedData = ResponseData.map((item) => {
                if (item.ORDER_PKID === parseInt(OrderID)) {
                    ordercnt = ordercnt + 1;
                    totalamt = totalamt + parseFloat(OrderAmount);
                    baddebitsamt = baddebitsamt + parseFloat(BadDeb);

                    return { ...item, checked: event.target.checked };
                } else {
                    return { ...item };
                }
            });

            setSelectedOrders(ordercnt)
            setOrderTotalAmount(totalamt);
            setBadDebits(baddebitsamt);
            setFinalAmount(parseFloat(totalamt) - parseFloat(baddebitsamt));

            ParentCheckBoxChecked(updatedData);
            setResponseData(updatedData);
        } else {

            var ordercnt = SelectedOrders;
            var totalamt = OrderTotalAmount;
            var baddebitsamt = BadDebits;

            console.log(totalamt);
            console.log(baddebitsamt);

            const updatedData = ResponseData.map((item) => {
                if (item.ORDER_PKID === parseInt(OrderID)) {
                    console.log(totalamt)
                    ordercnt = ordercnt - 1;
                    totalamt = parseFloat(totalamt) - OrderAmount;
                    baddebitsamt = parseFloat(baddebitsamt) - BadDeb;
                    return { ...item, checked: event.target.checked };
                } else {
                    return { ...item };
                }
            });

            setSelectedOrders(ordercnt)
            setOrderTotalAmount(totalamt);
            setBadDebits(baddebitsamt);
            setFinalAmount(parseFloat(totalamt) - parseFloat(baddebitsamt));
            ParentCheckBoxChecked(updatedData);
            setResponseData(updatedData);
        }
    }

    const ViewPaymenyOption = (i) => {
        setBlock(!block);
    };

    const ConfirmPayment = (event) => {
        console.log(event.target.value);
        setType(event.target.value);
        if (event.target.value === "Cash") {
            console.log(1);
            setIsCash(1);
            setCardHeight("550px");
        } else {
            console.log(0);
            setIsCash(0);
            setCardHeight("400px");
        }
    }

    const MakePayment = () => {
        var obj = {
            OutletID: StoreID,
            CustomerPhoneNumber: props.location.state.PhoneNo,
            selectedOrdersCnt: SelectedOrders,
            TotalOrderAmount: OrderTotalAmount,
            CollectedAmount: Type === "Cash" ? Collected : OrderTotalAmount,
            BalanceAmount: Type === "Cash" ? Balance : 0,
            PaymentMode: Type,
            BadDebits: BadDebits,
            FinalAmount: FinalAmount,
            OrderList: ResponseData
        }

        console.log(obj)

        axios.post(MyApiUrl + "ConfirmDelivery", obj).then((response) => {
            console.log(obj);
            if (response.data === true) {
                Swal.fire({
                    title: "Payment Successful!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                setBlock(!block);
                history.goBack();
            } else {
                Swal.fire({
                    title: "Failed. Try Again!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }

        });
    }

    const SplitDate1 = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    React.useEffect(() => {
        // document.getElementById("NumOrder").focus();
        if (otpverification === "1") {
            axios.get(MyApiUrl + "GetOrdersListByPhoneNumber/" + props.location.state.PhoneNo + "").then((response) => {
                console.log(response.data)
                if (response.data.length > 0) {
                    setResponseData(response.data);
                }
            });
        }
    }, []);

    return (
        <div className="123">
            <div id="divLoading"> </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/OutletDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster" style={{ marginTop: "3%" }}>Orders Out For Delivery</h1>



            {otpverification === "0" ? <CRow style={{ marginTop: "3%", alignContent: "center" }}>
                <CCol md="12" lg="3"></CCol>
                <CCol md="12" lg="6">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Enter Delivery Code</CCardHeader>
                        <CCardBody>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Delivery Code<span style={{ color: "red" }}> *</span></CLabel>
                                    <CInput
                                        id="NumOrder"
                                        name="NumOrder"
                                        placeholder="Enter Delivery Code"
                                        value={Code}
                                        onChange={(event) => {
                                            setCode(event.target.value);
                                        }}
                                    />
                                </CCol>
                                <CCol xs="12" md="12">
                                    <CButton
                                        className="btn btn-success"
                                        style={{
                                            fontSize: 16,
                                            float: "right",
                                            marginTop: "4%"
                                        }}
                                        onClick={VerifyOtp}
                                    >
                                        Verify Code
                                    </CButton>
                                </CCol>
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md="12" lg="3"></CCol>
            </CRow> : null}


            <CRow>
                {ResponseData.length > 0 ?
                    <CCol md="12" lg="12">
                        <div id="country-table">
                            <table id="OutletTable" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "center" }}>
                                            <div className="checkboxes__row">
                                                <div className="checkboxes__item">
                                                    <label className="checkbox style-d">
                                                        <input type="checkbox" value="All" checked={ParentChecked} id="Parent" onChange={HandleParentCheckbox} />
                                                        <div className="checkbox__checkmark" style={{ top: "-12px" }}></div>
                                                        <div class="checkbox__body">Select All</div>
                                                    </label>
                                                </div>
                                            </div>
                                        </th>
                                        <th>Order Number</th>
                                        <th>Order Date</th>
                                        <th>Due Date</th>
                                        <th>Customer</th>
                                        <th>Bad Debits</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody style={{ height: "auto" }}>
                                    {
                                        ResponseData.map((item) => {
                                            return (
                                                <React.Fragment>
                                                    <tr>
                                                        <td>
                                                            <div className="checkboxes__row">
                                                                <div className="checkboxes__item">
                                                                    <label className="checkbox style-d">
                                                                        <input type="checkbox" onChange={InnerCheckBoxChecked} value={item.ORDER_PKID + "-" + item.ORDER_GRAND_TOTAL_AMOUNT + "-" + item.ORDER_BAD_DEBITS} id={"ParentCheckbox_" + item.ORDER_PKID} checked={item.checked} />
                                                                        <div className="checkbox__checkmark"></div>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ textAlign: "left" }}>
                                                            <span style={{ marginLeft: "5%", color: "black", fontWeight: "400", fontSize: "14px" }}>{item.ORDER_ORDER_NUMBER}</span>
                                                        </td>
                                                        <td>{SplitDate1(item.ORDER_DATE)}</td>
                                                        <td>{SplitDate1(item.ORDER_DUE_DATE)}</td>
                                                        <td>{item.CUSTOMER_NAME}</td>
                                                        <td>{item.ORDER_BAD_DEBITS}</td>
                                                        <td>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </CCol> : null}
            </CRow>
            {ResponseData.length > 0 ?
                <React.Fragment>
                    <CRow row style={{ marginTop: "2%" }}>
                        <CCol md="8" lg="8"></CCol>
                        <CCol md="4" lg="4">
                            <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                <CCardHeader style={{ textAlign: "center" }}>Payment Summary</CCardHeader>
                                <table className="table table-hover table-bordered table-responsive-md" style={{ width: "100%", float: "right" }} id="OutletPlaceOrderTable">
                                    <tbody>
                                        <tr>
                                            <td style={{ fontWeight: "900" }}>Total Selected Orders</td>
                                            <td style={{ fontWeight: "900" }}>{SelectedOrders} Selected</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: "900" }}>Total Bad Debits</td>
                                            <td style={{ fontWeight: "900" }}>{BadDebits}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: "900" }}>Total Order Amount</td>
                                            <td style={{ fontWeight: "900" }}>{OrderTotalAmount}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: "900" }}>Final Amount</td>
                                            <td style={{ fontWeight: "900" }}>{FinalAmount}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CRow row>
                        <CCol md="12" lg="12">
                            <CButton
                                className="btn btn-success"
                                style={{
                                    fontSize: 14,
                                    float: "right",
                                    marginTop: "10px",
                                    marginBottom: "5px"
                                }}
                                onClick={ViewPaymenyOption}
                            >
                                Make Payment
                            </CButton>
                        </CCol>
                    </CRow>
                </React.Fragment> : null}

            <CModal style={{ width: "225%", marginLeft: "-60%", height: CardHeight }} show={block} onClose={() => setBlock(!block)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Choose Your Payment Option</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <div className="mx-auto p-4 payment-container">
                                <CCol md="3">
                                    <div className="payment-radio-container">
                                        <input type="radio" id="payment-radio4" onClick={ConfirmPayment} name="select" value="Cash" />
                                        <label for="payment-radio4" className="pplogo-container">
                                            <img className="img-fluid" alt="PayUmoney" src="https://www.vhv.rs/dpng/f/33-331066_cash-in-rupees-clipart-hd-png-download.png" />
                                        </label>
                                    </div>
                                </CCol>
                                <CCol md="3">
                                    <div className="payment-radio-container">
                                        <input type="radio" id="payment-radio1" onClick={ConfirmPayment} name="select" value="UPI" />
                                        <label for="payment-radio1" className="pplogo-container">
                                            <img className="img-fluid" alt="PayTm" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png" />
                                        </label>
                                    </div>
                                </CCol>
                                <CCol md="3">
                                    <div className="payment-radio-container">
                                        <input type="radio" id="payment-radio2" onClick={ConfirmPayment} name="select" value="Credit/Debit Card" />
                                        <label for="payment-radio2" className="pplogo-container">
                                            <img className="img-fluid" alt="Atompay" src="https://bharatnxt.in/images/credit-card.png" />
                                        </label>
                                    </div>
                                </CCol>
                                <CCol md="3">
                                    <div className="payment-radio-container">
                                        <input type="radio" id="payment-radio3" onClick={ConfirmPayment} name="select" value="Wallet" />
                                        <label for="payment-radio3" className="pplogo-container">
                                            <img className="img-fluid" alt="PayUmoney" src="https://w7.pngwing.com/pngs/746/584/png-transparent-cryptocurrency-wallet-money-computer-icons-digital-wallet-wallet-payment-business-bank.png" />
                                        </label>
                                    </div>
                                </CCol>
                            </div>
                        </CCol>
                    </CRow>
                    {IsCash === 1 || IsCash === "1" ? <CRow>
                        <CCol md="12">
                            <h1 id="ccmaster">Payment Details</h1>
                        </CCol>
                        <CCol md="4" style={{ marginTop: "2%" }}>
                            <CLabel>Total Order Amount</CLabel>
                            <CInput
                                type="text"
                                readOnly
                                value={FinalAmount}
                            />
                        </CCol>

                        <CCol md="4" style={{ marginTop: "2%" }}>
                            <CLabel>Collected</CLabel>
                            <CInput
                                type="text"
                                placeholder="Please Enter Collected Amount"
                                onChange={CollectedValue}
                                value={Collected}
                            />
                        </CCol>
                        <CCol md="4" style={{ marginTop: "2%" }}>
                            <CLabel>Balance</CLabel>
                            <CInput
                                type="text"
                                readOnly
                                placeholder="Balance Amount"
                                value={Balance}
                            />
                        </CCol>
                    </CRow> : null}
                </CModalBody>
                <CModalFooter>
                    {Collected === "" || Collected === null ? null :
                        <CButton className="btn btn-success" style={{ fontSize: "13px" }} onClick={MakePayment}>
                            Confirm Payment
                        </CButton>
                    }
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default OutletByDeliveryCode;