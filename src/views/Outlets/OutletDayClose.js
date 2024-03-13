/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-07 17:32:50
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-02-11 18:55:47
 */
/* eslint-disable no-restricted-globals */
import React, { useState } from "react";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CRow,
  CLabel,
  CTextarea,
  CLink,
} from "@coreui/react";
import { MyApiUrl, ViewImg } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import { useHistory } from "react-router-dom";
const TagInvoiceReprint = () => {
  const history = useHistory();
  const UserID = sessionStorage.getItem("UserID");
  const StoreID = sessionStorage.getItem("StoreID");
  const UserName = sessionStorage.getItem("UserName");
  const StoreName = sessionStorage.getItem("StoreName");
  const LogoutSubmit = sessionStorage.getItem("LogoutSubmit");
  const [PrintQR, setPrintQR] = useState("");

  const [Amount, setAmount] = useState("");
  const [AmtTotal, setAmtTotal] = useState("");

  const [Amount1, setAmount1] = useState("");
  const [AmtTotal1, setAmtTotal1] = useState("");

  const [Amount2, setAmount2] = useState("");
  const [AmtTotal2, setAmtTotal2] = useState("");

  const [Amount3, setAmount3] = useState("");
  const [AmtTotal3, setAmtTotal3] = useState("");

  const [Amount4, setAmount4] = useState("");
  const [AmtTotal4, setAmtTotal4] = useState("");

  const [Amount5, setAmount5] = useState("");
  const [AmtTotal5, setAmtTotal5] = useState("");

  const [Amount6, setAmount6] = useState("");
  const [AmtTotal6, setAmtTotal6] = useState("");

  const [Amount7, setAmount7] = useState("");
  const [AmtTotal7, setAmtTotal7] = useState("");

  const TotalCash =
    (AmtTotal == "" || AmtTotal == null ? 0 : AmtTotal) +
    (AmtTotal1 == "" || AmtTotal1 == null ? 0 : AmtTotal1) +
    (AmtTotal2 == "" || AmtTotal2 == null ? 0 : AmtTotal2) +
    (AmtTotal3 == "" || AmtTotal3 == null ? 0 : AmtTotal3) +
    (AmtTotal4 == "" || AmtTotal4 == null ? 0 : AmtTotal4) +
    (AmtTotal5 == "" || AmtTotal5 == null ? 0 : AmtTotal5) +
    (AmtTotal6 == "" || AmtTotal6 == null ? 0 : AmtTotal6) +
    (AmtTotal7 == "" || AmtTotal7 == null ? 0 : AmtTotal7);

  const [CreditCard, setCreditCard] = useState("");
  const [CreditCardAmt, setCreditCardAmt] = useState("");
  const [CurrentDate, setCurrentDate] = useState("");
  const [Time, setTime] = useState("");
  const [Balance, setBalance] = useState("");
  const [Remarks, setRemarks] = useState("");

  const [upi, setupi] = useState("");
  const [upiAmt, setupiAmt] = useState("");

  const [chq, setchq] = useState("");
  const [chqAmt, setchqAmt] = useState("");

  const [neft, setneft] = useState("");
  const [neftAmt, setneftAmt] = useState("");

  const [other, setother] = useState("");
  const [otherAmt, setotherAmt] = useState("");

  const TotalAmt =
    (CreditCardAmt == "" || CreditCardAmt == null ? 0 : CreditCardAmt) +
    (upiAmt == "" || upiAmt == null ? 0 : upiAmt) +
    (chqAmt == "" || chqAmt == null ? 0 : chqAmt) +
    (neftAmt == "" || neftAmt == null ? 0 : neftAmt) +
    (otherAmt == "" || otherAmt == null ? 0 : otherAmt);
  const TotalCollection = TotalCash + TotalAmt;


  const [ToDayDcData, setToDayDcData] = useState([]);
  const [ToDayDcDataTotal, setToDayDcDataTotal] = useState([]);
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [DCNo, setDCNo] = useState([]);
  const [CollectionData, setCollectionData] = useState([]);

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

  var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  }

  const GetDates = () => {
    var showdate = new Date();
    const mon = (showdate.getMonth() + 1).toString().padStart(2, "0");
    setCurrentDate(
      showdate.getDate().toString().padStart(2, "0") +
      "-" +
      mon +
      "-" +
      showdate.getUTCFullYear()
    );
    setCurrentDate(
      showdate.getDate().toString().padStart(2, "0") +
      "-" +
      mon +
      "-" +
      showdate.getUTCFullYear()
    );
    setTime(showdate.toLocaleTimeString());
  };

  const GetToDayDC = async () => {
    document.getElementById("divLoading").className = "show";
    await axios({
      method: "GET",
      url: MyApiUrl + "GetTodayDC/" + StoreID + "",
    })
      .then((response) => {
        setToDayDcData(response.data[0].OrderDetails);
        setToDayDcDataTotal(response.data[0].FooterTotal);
        document.getElementById("divLoading").className = "hide";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getManagerProfile = () => {
    console.log(StoreID + "/" + UserID);
    axios.get(MyApiUrl + "Outlets/" + StoreID + "/" + UserID + "").then((response) => {
      setProfileDetails(response.data);
      console.log(response.data);
    });
  };

  const GetDCno = () => {
    axios.get(MyApiUrl + "GetDCNo/" + StoreID + "").then((response) => {
      setDCNo(response.data);
    });
  };

  const getCollectionData = () => {
    document.getElementById("divLoading").className = "show";
    axios.get(MyApiUrl + "GetOutletCollectionReport/" + StoreID + "").then((response) => {
      setCollectionData(response.data);
      document.getElementById("divLoading").className = "hide";
    }).
      catch((error) => {
        console.log(error);
      });
  };

  const SubmitFinalAmountDetails = () => {
    document.getElementById("divLoading").className = "show";

    if (Balance > 0 && Remarks === "") {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Remarks!",
      });
    } else {
      const obj = {
        OutletID: StoreID,
        StaffID: UserID,
        FACTORY_DC_NUMBER: DCNo,
        FACTORY_DC_FACCTORY_FKID: ProfileDetails[0].STORE_DEFAULT_FACTORY,
        OUTLET_PAY_SLIP_FIVE_HUNDRED_CNT: Amount,
        OUTLET_PAY_SLIP_FIVE_HUNDRED_AMT: AmtTotal,
        OUTLET_PAY_SLIP_TWO_HUNDRED_CNT: Amount1,
        OUTLET_PAY_SLIP_TWO_HUNDRED_AMT: AmtTotal1,
        OUTLET_PAY_SLIP_ONE_HUNDRED_CNT: Amount2,
        OUTLET_PAY_SLIP_ONE_HUNDRED_AMT: AmtTotal2,
        OUTLET_PAY_SLIP_FIFTY_RS_CNT: Amount3,
        OUTLET_PAY_SLIP_FIFTY_RS_AMT: AmtTotal3,
        OUTLET_PAY_SLIP_TWENTY_RS_CNT: Amount4,
        OUTLET_PAY_SLIP_TWENTY_RS_AMT: AmtTotal4,
        OUTLET_PAY_SLIP_TEN_RS_CNT: Amount5,
        OUTLET_PAY_SLIP_TEN_RS_AMT: AmtTotal5,
        OUTLET_PAY_SLIP_FIVE_RS_CNT: Amount6,
        OUTLET_PAY_SLIP_FIVE_RS_AMT: AmtTotal6,
        OUTLET_PAY_SLIP_COINS_CNT: Amount7,
        OUTLET_PAY_SLIP_COINS_AMT: AmtTotal7,
        OUTLET_PAY_SLIP_TOTAL_CASH: TotalCash,
        OUTLET_PAY_SLIP_CREDIT_CARD: CreditCardAmt,
        OUTLET_PAY_SLIP_UPI: upiAmt,
        OUTLET_PAY_SLIP_CHEQUE: chqAmt,
        OUTLET_PAY_SLIP_NEFT: neftAmt,
        OUTLET_PAY_SLIP_TOTAL_ORDERS: otherAmt,
        OUTLET_PAY_SLIP_TOTAL_COLLECTIONS: TotalCollection,
        OUTLET_PAY_SLIP_BALANCE: Balance,
        OUTLET_PAY_SLIP_REMARKS: Remarks,
      };
      axios.post(MyApiUrl + "OutletDayClose", obj).then((response) => {
        if (response.data === false) {
          Swal.fire({
            title: "Failed To Submit!",
            icon: "error",
            confirmButtonText: "OK",
          });
          document.getElementById("divLoading").className = "hide";
        } else {
          setPrintQR(response.data);
          document.getElementById("divLoading").className = "hide";
          printTest();
          Swal.fire({
            title: "Day Closed!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            document.getElementById("divLoading").className = "hide";
            sessionStorage.setItem("UserID", null);
            sessionStorage.setItem("StoreID", null);
            sessionStorage.setItem("UserName", null);
            sessionStorage.setItem("StoreName", null);
            sessionStorage.setItem("SessionType", null);
            sessionStorage.setItem("UserPassword", null);
            sessionStorage.setItem("LogoutSubmit", null);
            history.push("/OutletLogin");
          });
        }
      });
    }

  };

  const DayCloseLogout = () => {
    Swal.fire({
      title: "Logged out successfully!",
      icon: "success",
      confirmButtonText: "OK",
    });
    sessionStorage.setItem("UserID", null);
    sessionStorage.setItem("StoreID", null);
    sessionStorage.setItem("UserName", null);
    sessionStorage.setItem("StoreName", null);
    sessionStorage.setItem("SessionType", null);
    sessionStorage.setItem("UserPassword", null);
    sessionStorage.setItem("LogoutSubmit", null);
    history.push("/");
  }

  React.useEffect(() => {
    GetToDayDC();
    GetDates();
    getManagerProfile();
    GetDCno();
    getCollectionData();
  }, []);

  const SplitDate = (OrderDate) => {
    const MainDate = OrderDate.split("T");
    const SplitT = MainDate[0];
    const OrderDates = SplitT.split("-");
    const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
    return FinalDate;
  }

  const printTest = () => {
    // Calculate the width of the screen
    const screenWidth = screen.width;

    // Calculate the left position for the tags window
    const DCWindowLeft = Math.floor((screenWidth - 780) / 4);
    const printWindowLeft = Math.floor((screenWidth - 780) / 2);
    const CollectionWindowLeft = Math.floor((screenWidth - 780) * 3 / 4);

    // Open the windows with the calculated positions
    const DCWindow = window.open("", "Delivery Challan", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + DCWindowLeft);
    const printWindow = window.open("", "Order Report Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + printWindowLeft + "");
    const CollectionWindow = window.open("", "Outlet Collection Report Window", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + CollectionWindowLeft);

    DCWindow.document.write('<html><head><title>Delivery Challan</title></head><body style="font-family: Arial; font-size: 9px; letter-spacing: 1px">');
    DCWindow.document.write(document.getElementById("DCWindow").innerHTML);
    DCWindow.document.write('</body></html>');
    DCWindow.document.close();

    printWindow.document.write('<html><head><title>Order Report</title>');
    printWindow.document.write('<style>@page { size: landscape; }</style>');
    printWindow.document.write('</head><body style="margin: 5px;"><b style="font-size: 14px;">Order report</b><br/>');
    printWindow.document.write(document.getElementById("printWindow").innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    CollectionWindow.document.write('<html><head><title>Collection Report</title>');
    CollectionWindow.document.write('<style>@page { size: portrait; }</style>');

    CollectionWindow.document.write('</head><body style="margin: 5px;"><b style="font-size: 14px;">Laundrexx Fabric Care India(P). Ltd</b><br><b style="font-size: 14px;">Collection Report</b><br/>');
    CollectionWindow.document.write(document.getElementById("CollectionWindow").innerHTML);
    CollectionWindow.document.write('</body></html>');
    CollectionWindow.document.close();

    setTimeout(() => {
      DCWindow.print();
      DCWindow.close();
    }, 1000);

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 2000);

    setTimeout(() => {
      CollectionWindow.print();
      CollectionWindow.close();
    }, 3000);
  }

  let footerQuantity = 0;
  let footerCount = 0;
  let footerAmount = 0.00;
  let footerSurcharge = 0.00;
  let footerDiscount = 0.00;
  let footerTotalAmount = 0.00;
  let footerCGST = 0.00;
  let footerSGST = 0.00;
  let footerTotalInvoice = 0.00;
  let footerRoundOff = 0.00;
  let footerGrandTotal = 0.00;
  let footerCount1 = 0;

  let footerQuantity2 = 0;
  let footerCount2 = 0;

  let CollectionTotal = 0.00;
  let CollectionTotalCash = 0.00;
  let CollectionTotalCard = 0.00;
  let CollectionTotalUpi = 0.00;
  let CollectionTotalWallet = 0.00;

  let totcash = 0.00;
  let totcard = 0.00;
  let totupi = 0.00;
  let totwallet = 0.00;

  let paidcash = 0.00;
  let paidcard = 0.00;
  let paidupi = 0.00;
  let paidwallet = 0.00;

  let FinalTotal = 0.00;
  let FinalPaid = 0.00;

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
      {ProfileDetails.length > 0 ?
        <div>
          <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "190px" }} id="DCWindow">
            <div style={{
              width: "190px", textAlign: "center",
            }}>
              <center>
                <table width="525" className="bottom" cellspacing="0" cellpadding="2" style={{ borderLeft: "1px solid #000", borderTop: "1px solid #000", }}>

                  <tr style={{ textAlign: "center" }}>
                    <td colspan="4" style={{
                      borderBottom: "thin solid",
                      borderRight: "thin solid"
                    }}>
                      <h3 style={{ margin: "2px 0px 0px 0px", padding: "0px 0px 0px 0px", fontSize: 10 }}>
                        DELIVERY CHALLAN</h3>
                      <h2 style={{ padding: "0px 0px 0px 0px", fontSize: "14px" }}>Laundrexx Fabric Care India(P) Ltd.</h2>
                    </td>
                  </tr>
                  <tr style={{ textAlign: "center" }}>
                    <td colspan="3" style={{
                      borderBottom: "thin solid",
                      borderRight: "thin solid"
                    }}>
                      <img src="./assets/images/LogoN.png" width="170" height="50" alt="logo1" />
                    </td>
                    <td colspan="1" class="top bottom left right" style={{
                      borderBottom: "thin solid",
                      borderRight: "thin solid"
                    }}>
                      <img className="barcode" style={{ width: 70, height: 70 }} src={ViewImg + "/" + PrintQR} />
                    </td>
                  </tr>

                  <tr style={{
                    borderRight: "thin solid",
                    borderBottom: "thin solid",
                    borderColor: "black",
                    fontWeight: "600",
                    fontSize: "9px"
                  }}>
                    <td style={{ paddingTop: 5, fontWeight: "300" }} width="15%">DC No</td>
                    <td width="35%">
                      : &nbsp;&nbsp;&nbsp;<b>{DCNo}</b>
                    </td>
                    <td style={{ fontWeight: "300" }} width="15%">Date</td>
                    <td style={{ borderRight: "1px solid #000" }} width="35%">
                      : &nbsp;&nbsp;&nbsp;<b>{CurrentDate}</b>
                    </td>
                  </tr>
                  <tr style={{
                    borderRight: "thin solid",
                    borderBottom: "thin solid",
                    borderColor: "black",
                    fontWeight: "600",
                    fontSize: "9px"
                  }}>
                    <td style={{ fontWeight: "300" }}>From Station</td>
                    <td>: &nbsp;&nbsp;&nbsp;{ProfileDetails[0].STORE_NAME}</td>
                    <td style={{ fontWeight: "300" }}>To Station</td>
                    <td style={{ borderRight: "1px solid #000" }}>: &nbsp;&nbsp;&nbsp;{ProfileDetails[0].FACTORY_NAME}</td>
                  </tr>
                  <tr style={{
                    fontWeight: "600",
                    fontSize: "9px"
                  }}>
                    <td style={{ fontWeight: "300" }}>Prepared By</td>
                    <td>: &nbsp;&nbsp;&nbsp;{ProfileDetails[0].STORE_STAFF_NAME}</td>
                    <td style={{ fontWeight: "300", borderRight: "1px solid #000" }} colSpan={2}></td>
                  </tr>
                </table>

                <table width="525" border="0" cellspacing="0" cellpadding="2" style={{ borderTop: "1px solid #000", fontSize: 10 }}>
                  <tr>
                    <th style={{
                      borderLeft: "1px solid #000", borderBottom: "thin solid",
                      borderRight: "thin solid", fontWeight: "800"
                    }}>Sl No.</th>
                    <th style={{
                      borderBottom: "thin solid",
                      borderRight: "thin solid", fontWeight: "800"
                    }}>Bill No.</th>
                    <th style={{
                      borderBottom: "thin solid",
                      borderRight: "thin solid", fontWeight: "800"
                    }}>Due Date</th>
                    <th style={{
                      borderBottom: "thin solid",
                      borderRight: "thin solid", fontWeight: "800"
                    }}>Quantity</th>
                    <th style={{
                      borderBottom: "thin solid",
                      borderRight: "thin solid", fontWeight: "800"
                    }}>Count</th>
                  </tr>
                  {ToDayDcData.length > 0 ?
                    ToDayDcData.map((item, index) => {
                      footerQuantity2 = footerQuantity2 + item.TotalQuantity;
                      footerCount2 = footerCount2 + item.TotalCount;
                      return (
                        <tr>
                          <td style={{
                            borderBottom: "thin solid",
                            borderRight: "thin solid",
                            borderLeft: "1px solid #000", textAlign: "center",
                          }}>{index + 1}</td>
                          <td style={{
                            borderBottom: "thin solid",
                            borderRight: "thin solid", textAlign: "center",
                          }}>{item.ORDER_ORDER_NUMBER}</td>
                          <td style={{
                            borderBottom: "thin solid",
                            borderRight: "thin solid", textAlign: "center",
                          }}>{SplitDate(item.ORDER_DUE_DATE)}</td>
                          <td style={{
                            borderBottom: "thin solid",
                            borderRight: "thin solid", textAlign: "center",
                          }}>{item.TotalQuantity}</td>
                          <td style={{
                            borderBottom: "thin solid",
                            borderRight: "thin solid", textAlign: "center",
                          }}>{item.TotalCount}</td>
                        </tr>
                      )
                    }
                    )
                    : null}

                  {ToDayDcDataTotal.length > 0 ?
                    <tr>
                      <td style={{
                        textAlign: "center",
                        borderBottom: "1px solid #000",
                        borderLeft: "1px solid #000",
                        borderRight: "1px solid #000"
                      }}><b style={{ fontWeight: "800" }}>Total Hangers: 0</b></td>
                      <td style={{
                        textAlign: "center",
                        borderBottom: "1px solid #000",
                        borderRight: "1px solid #000"
                      }}><b style={{ fontWeight: "800" }} >Total Bags: 1</b></td>
                      <td style={{
                        textAlign: "center",
                        borderBottom: "1px solid #000",
                        borderRight: "1px solid #000"
                      }}><b style={{ fontWeight: "800" }} >Total Orders: {ToDayDcData.length}</b></td>
                      <td style={{
                        textAlign: "center",
                        borderBottom: "1px solid #000",
                        borderRight: "1px solid #000"
                      }}><b style={{ fontWeight: "800" }} >Total Quantity: {footerQuantity2}</b></td>
                      <td style={{
                        textAlign: "center",
                        borderBottom: "1px solid #000",
                        borderRight: "1px solid #000"
                      }}><b style={{ fontWeight: "800" }} >Total Count: {footerCount2}</b></td>
                    </tr>
                    : null}
                  <tr>
                    <td colSpan="5" style={{
                      textAlign: "center",
                      borderBottom: "1px solid #000",
                      borderRight: "1px solid #000",
                      height: 35,
                      borderLeft: "1px solid #000",
                    }}></td>
                  </tr>
                </table>
              </center>
            </div>
          </div>

          <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "100%" }} id="printWindow">
            {ToDayDcData.length > 0 ?
              <div style={{ textAlign: "center" }}>
                <div id="bills" style={{ width: "100%", height: "30px", fontSize: 14 }}>
                  <p style={{ textAlign: "left" }}>Total Bills : <b>{ToDayDcData.length}</b></p>
                </div><br />

                <table id="grdpaymentDetails" border="1" cellspacing="2px" cellpadding="2px" style={{ borderRight: "1px solid #999999", fontSize: 12, borderCollapse: "collapse" }} class="txtcss totalTable">
                  <thead>
                    <tr>
                      <td colspan="20" style={{
                        fontWeight: "bold",
                        color: "black", bordeBottom: "2px solid #999", padding: 5
                      }}>
                        Item Details &nbsp;&nbsp;Outlet Name: {StoreName} &nbsp;&nbsp;Staff Name: {UserName}
                        <span style={{ float: "right" }}>Time : <span class="time" style={{ font: "bold", float: "right" }}>{CurrentDate} {Time}</span> </span>
                      </td>
                    </tr>
                    <tr style={{ color: "#000", fontWeight: "bold" }}>
                      <th scope="col" style={{ width: "1%" }}>Sl No.</th>
                      <th scope="col" style={{ width: "8%" }}>Order No.</th>
                      <th scope="col" style={{ width: "6%" }}>Date</th>
                      <th scope="col" style={{ width: "9%" }}>Customer Name</th>
                      <th scope="col" style={{ width: "7%" }}>Phone Number</th>
                      <th scope="col" style={{ width: "6%" }}>Due Date</th>
                      <th scope="col" style={{ width: "4%" }}>Quantity</th>
                      <th scope="col" style={{ width: "4%" }}>Count</th>
                      <th scope="col" style={{ width: "4%" }}>Amount</th>
                      <th scope="col" style={{ width: "4%" }}>Surcharge</th>
                      <th scope="col" style={{ width: "4%" }}>Discount</th>
                      <th scope="col" style={{ width: "4%" }}>Total Amount</th>
                      <th scope="col" style={{ width: "3%" }}>CGST</th>
                      <th scope="col" style={{ width: "3%" }}>SGST</th>
                      <th scope="col" style={{ width: "4%" }}>Total Invoice</th>
                      <th scope="col" style={{ width: "3%" }}>Round Off</th>
                      <th scope="col" style={{ width: "3%" }}>Grand Total</th>
                      <th scope="col" style={{ width: "5%" }}>Service Category</th>
                      <th scope="col" style={{ width: "5%" }}>Service Type</th>
                      <th scope="col" style={{ width: "5%" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ToDayDcData.map((item, index) => {
                      footerQuantity = footerQuantity + parseInt(item.TotalQuantity);
                      footerCount = footerCount + item.TotalCount;
                      footerAmount = footerAmount + parseFloat(item.ORDER_AMOUNT);
                      footerSurcharge = footerSurcharge + parseFloat(item.ORDER_TOTAL_SUR_CHARGE);
                      footerDiscount = footerDiscount + parseFloat(item.ORDER_DISCOUNT);
                      footerTotalAmount = footerTotalAmount + parseFloat(item.ORDER_TOTAL_ORDER_AMOUNT);
                      footerCGST = footerCGST + parseFloat(item.ORDER_CGST);
                      footerSGST = footerSGST + parseFloat(item.ORDER_SGST);
                      footerTotalInvoice = footerTotalInvoice + parseFloat(item.ORDER_TOTAL_INVOICE_VALUE);
                      footerRoundOff = footerRoundOff + parseFloat(item.ORDER_ROUND_OFF_INVOICE);
                      footerGrandTotal = footerGrandTotal + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                      return (
                        <tr>
                          <td style={{ textAlign: "center" }}>{index + 1}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_ORDER_NUMBER}</td>
                          <td style={{ textAlign: "center" }}>{SplitDate(item.ORDER_DATE)}</td>
                          <td style={{ textAlign: "center" }}>{item.CUSTOMER_NAME}</td>
                          <td style={{ textAlign: "center" }}>{item.CUSTOMER_CONTACT_NUMBER}</td>
                          <td style={{ textAlign: "center" }}>{SplitDate(item.ORDER_DUE_DATE)}</td>
                          <td style={{ textAlign: "center" }}>{item.TotalQuantity}</td>
                          <td style={{ textAlign: "center" }}>{item.TotalCount}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_AMOUNT}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_DISCOUNT}</td>
                          {item.ORDER_TOTAL_SUR_CHARGE == 0 || item.ORDER_TOTAL_SUR_CHARGE == "0" ?
                            <td style={{ textAlign: "center" }}>0</td>
                            :
                            <td style={{ textAlign: "center" }}>{item.ORDER_TOTAL_SUR_CHARGE} @ {item.SERVICE_TYPE_SURCHARGE}%</td>
                          }
                          <td style={{ textAlign: "center" }}>{item.ORDER_TOTAL_ORDER_AMOUNT}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_CGST} ({item.SERVICE_CATEGORY_CGST}%)</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_SGST} @ {item.SERVICE_CATEGORY_SGST}%</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_TOTAL_INVOICE_VALUE}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_ROUND_OFF_INVOICE}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                          <td style={{ textAlign: "center" }}>{item.SERVICE_CATEGORY_NAME}</td>
                          <td style={{ textAlign: "center" }}>{item.SERVICE_TYPE_NAME}</td>
                          <td style={{ textAlign: "center" }}>
                            {item.ORDER_STATUS == "0" || item.ORDER_STATUS == 0 ? "Pending" :
                              item.ORDER_STATUS == "1" || item.ORDER_STATUS == 1 ? "Sent to Factory" :
                                item.ORDER_STATUS == "2" || item.ORDER_STATUS == 2 ? "Recieved in Factory" :
                                  item.ORDER_STATUS == "3" || item.ORDER_STATUS == 3 ? "Returned to Outlet" :
                                    item.ORDER_STATUS == "4" || item.ORDER_STATUS == 4 ? "Ready for Delivery" :
                                      item.ORDER_STATUS == "5" || item.ORDER_STATUS == 5 ? "Delivered" :
                                        item.ORDER_STATUS == "6" || item.ORDER_STATUS == 6 ? "Out for Delivery" : "-"}
                          </td>
                        </tr>
                      )
                    }
                    )}
                    <tr>
                      <td colspan="6" style={{ textAlign: "right" }}><b>Totals : </b></td>
                      <td style={{ textAlign: "right" }}><b>{footerQuantity}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerCount}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerAmount.toFixed(2)}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerSurcharge.toFixed(2)}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerDiscount.toFixed(2)}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerTotalAmount.toFixed(2)}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerCGST.toFixed(2)}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerSGST.toFixed(2)}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerTotalInvoice.toFixed(2)}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerRoundOff.toFixed(2)}</b></td>
                      <td style={{ textAlign: "right" }}><b>{footerGrandTotal.toFixed(2)}</b></td>
                      <td style={{ textAlign: "center" }}></td>
                      <td style={{ textAlign: "center" }}></td>
                      <td style={{ textAlign: "center" }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              :
              null
            }
          </div>

          <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "100%" }} id="CollectionWindow">
            {CollectionData.length > 0 ?
              <div style={{ textAlign: "center" }}>
                <table id="grdpaymentDetails" border="1" cellspacing="2px" cellpadding="2px" style={{ borderRight: "1px solid #999999", fontSize: 12, width: "100%", borderCollapse: "collapse", width: "100%" }} class="txtcss totalTable">
                  <thead>
                    <tr>
                      <td colspan="18" style={{
                        fontWeight: "bold",
                        color: "black", bordeBottom: "2px solid #999", padding: 5
                      }}>
                        Collection Details &nbsp;&nbsp;Outlet Name: {StoreName} &nbsp;&nbsp;User Name: {UserName}
                        <span style={{ float: "right" }}>Time : <span class="time" style={{ font: "bold", float: "right" }}>{CurrentDate} {Time}</span> </span>
                      </td>
                    </tr>
                    <tr style={{ color: "#000", fontWeight: "bold" }}>
                      <th scope="col">Order No.</th>
                      <th scope="col">Name</th>
                      <th scope="col">Mobile</th>
                      <th scope="col">Date</th>
                      <th scope="col">Total</th>
                      <th scope="col">Paid Amount</th>
                      <th scope="col">Bad Debits</th>
                      <th scope="col">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CollectionData.map((item, index) => {
                      if (item.ORDER_PAYMENT_MODE === "Cash") {
                        totcash = totcash + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                        paidcash = paidcash + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                      } else if (item.ORDER_PAYMENT_MODE === "UPI") {
                        totupi = totupi + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                        paidupi = paidupi + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                      } else if (item.ORDER_PAYMENT_MODE === "Credit/Debit Card") {
                        totcard = totcard + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                        paidcard = paidcard + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                      } else if (item.ORDER_PAYMENT_MODE === "Wallet") {
                        totwallet = totwallet + parseFloat(item.ORDER_GRAND_TOTAL_AMOUNT);
                        paidwallet = paidwallet + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                      }

                      FinalTotal = parseFloat(totcash) + parseFloat(totupi) + parseFloat(totcard) + parseFloat(totwallet);
                      FinalPaid = parseFloat(paidcash) + parseFloat(paidupi) + parseFloat(paidcard) + parseFloat(paidwallet);

                      return (
                        <tr>
                          <td style={{ textAlign: "center" }}>{item.ORDER_ORDER_NUMBER}</td>
                          <td style={{ textAlign: "center" }}>{item.CUSTOMER_NAME}</td>
                          <td style={{ textAlign: "center" }}>{item.CUSTOMER_CONTACT_NUMBER}</td>
                          <td style={{ textAlign: "center" }}>{SplitDate(item.ORDER_PAYMENT_DATE)}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_PAYMENT_COLLECTED_AMOUNT}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_PAYMENT_BAD_DEBITS}</td>
                          <td style={{ textAlign: "center" }}>{item.ORDER_PAYMENT_CREDIT}</td>
                        </tr>
                      )
                    }
                    )}

                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>Cash:</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{totcash.toFixed(2)}</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{paidcash.toFixed(2)}</td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>Credit/Debit Card:</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{totcard.toFixed(2)}</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{paidcard.toFixed(2)}</td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>Gpay/Paytm:</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{totupi.toFixed(2)}</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{paidupi.toFixed(2)}</td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>Wallet:</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{totwallet.toFixed(2)}</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{paidwallet.toFixed(2)}</td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr>
                      <td colSpan="4" style={{ textAlign: "right" }}>Total:</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{FinalTotal.toFixed(2)}</td>
                      <td colSpan="1" style={{ textAlign: "center" }}>{FinalPaid.toFixed(2)}</td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              :
              null
            }
          </div>

        </div>
        : null}
      <h1 id="ccmaster">Day Close</h1>
      <CRow style={{ marginTop: "2%" }}>
        <CCol md="12" lg="12">
          <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
            <CCardBody>
              <CForm
                action=""
                method="post"
                encType="multipart/form-data"
                className="form-horizontal"
              >
                <CRow row>
                  <CCol md="6">
                    <CRow row>
                      <CCol md="12">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                          <CCardHeader>Order Details/Billing Details</CCardHeader>
                          <div style={{ overflow: "auto" }}>
                            <table
                              className="table table-responsive-sm table-bordered table-hover"
                              id="OutletPlaceOrderCouponTable"
                            >
                              <thead>
                                <tr>
                                  <td colSpan={4}>DC No.: <strong>{DCNo}</strong></td>
                                  <td colSpan={3}>Date: <strong>{CurrentDate}</strong></td>
                                </tr>
                                <tr>
                                  <th>
                                    <strong>Sl.no</strong>
                                  </th>
                                  <th>
                                    <strong>Order No</strong>
                                  </th>
                                  <th>
                                    <strong>Customer</strong>
                                  </th>
                                  <th>
                                    <strong>Amount </strong>
                                  </th>
                                  <th>
                                    <strong>Due Date</strong>
                                  </th>
                                  <th>
                                    <strong>Quantity</strong>
                                  </th>
                                  <th>
                                    <strong>Count</strong>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {ToDayDcData.length > 0
                                  ? ToDayDcData.map((item, index) => {
                                    footerCount1 = footerCount1 + item.TotalCount;
                                    return (
                                      <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.ORDER_ORDER_NUMBER}</td>
                                        <td>{item.CUSTOMER_NAME}</td>
                                        <td>{item.ORDER_GRAND_TOTAL_AMOUNT}</td>
                                        <td>{SplitDate(item.ORDER_DUE_DATE)}</td>
                                        <td>{item.TotalQuantity}</td>
                                        <td>{item.TotalCount}</td>
                                      </tr>
                                    )
                                  }
                                  )
                                  : null}
                              </tbody>

                              <tfoot>
                                {ToDayDcDataTotal.length > 0
                                  ? ToDayDcDataTotal.map((item, index) => (
                                    <tr
                                      style={{
                                        backgroundColor: "#0c8fcf",
                                        color: "white",
                                      }}
                                    >
                                      <td colspan="3"><strong>Total Amount:</strong></td>
                                      <td colspan="1"><strong>{item.TotalAmount}</strong></td>
                                      <td colspan="2"><strong>Total Count:</strong></td>
                                      <td colspan="1"><strong>{footerCount1}</strong></td>
                                    </tr>
                                  ))
                                  : null}
                              </tfoot>
                            </table>
                          </div>
                        </CCard>
                      </CCol>
                      <CCol md="12">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                          <CCardHeader>Collection Report</CCardHeader>
                          <table
                            className="table table-responsive-md table-bordered table-hover"
                            id="OutletPlaceOrderCouponTable"
                          >
                            <thead>
                              <tr>
                                <th>
                                  <strong>Sl.no</strong>
                                </th>
                                <th>
                                  <strong>Order No</strong>
                                </th>
                                <th>
                                  <strong>Customer</strong>
                                </th>
                                <th>
                                  <strong>Collected Amount</strong>
                                </th>
                                <th>
                                  <strong>Pay Mode</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {CollectionData.length > 0 ?
                                CollectionData.map((item, index) => {

                                  CollectionTotal = CollectionTotal + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);

                                  if (item.ORDER_PAYMENT_MODE === "Cash") {
                                    CollectionTotalCash = CollectionTotalCash + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                                  } else if (item.ORDER_PAYMENT_MODE === "Credit/Debit Card") {
                                    CollectionTotalCard = CollectionTotalCard + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                                  } else if (item.ORDER_PAYMENT_MODE === "UPI") {
                                    CollectionTotalUpi = CollectionTotalUpi + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                                  } else if (item.ORDER_PAYMENT_MODE === "Wallet") {
                                    CollectionTotalWallet = CollectionTotalWallet + parseFloat(item.ORDER_PAYMENT_COLLECTED_AMOUNT);
                                  }

                                  return (
                                    <tr>
                                      <td>{index + 1}</td>
                                      <td>{item.ORDER_ORDER_NUMBER}</td>
                                      <td>{item.CUSTOMER_NAME}</td>
                                      <td>{item.ORDER_PAYMENT_COLLECTED_AMOUNT}</td>
                                      <td>{item.ORDER_PAYMENT_MODE}</td>
                                    </tr>
                                  );
                                }) : null
                              }
                            </tbody>
                            <tfoot>
                              <tr
                                style={{
                                  backgroundColor: "#0c8fcf",
                                  color: "white",
                                }}
                              >
                                <td colspan="3"><strong>Total Amount:</strong></td>
                                <td colspan="2"><strong>{CollectionTotal.toFixed(2)}</strong></td>
                              </tr>
                            </tfoot>
                          </table>
                        </CCard>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md="6">
                    <CRow row>
                      <CCol md="12">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                          <CCardHeader>
                            Collection Report Total
                          </CCardHeader>
                          <table
                            className="table table-responsive-md table-bordered table-hover"
                            id="OutletPlaceOrderCouponTable"
                          >
                            <tbody>
                              <React.Fragment>
                                <tr>
                                  <td>Cash</td>
                                  <td>{CollectionTotalCash.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>UPI</td>
                                  <td>{CollectionTotalUpi.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>Credit/Debit Card</td>
                                  <td>{CollectionTotalCard.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>Wallet</td>
                                  <td>{CollectionTotalWallet.toFixed(2)}</td>
                                </tr>
                              </React.Fragment>
                            </tbody>
                            <tfoot>
                              <tr
                                style={{
                                  backgroundColor: "#0c8fcf",
                                  color: "white",
                                }}
                              >
                                <td><strong>Total Amount:</strong></td>
                                <td><strong>{CollectionTotal.toFixed(2)}</strong></td>
                              </tr>
                            </tfoot>
                          </table>
                        </CCard>
                      </CCol>
                      <CCol md="12">
                        {LogoutSubmit == false || LogoutSubmit == "false" ?
                          <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Pay In Slip to Laundrexx</CCardHeader>
                            <table
                              className="table table-responsive-md table-bordered table-hover"
                              id="OutletPlaceOrderSummaryTable"
                            >
                              {ProfileDetails.length > 0 ?
                                <tbody>
                                  <tr>
                                    <td colSpan={3}>
                                      Store Name:{" "}
                                      <strong>{ProfileDetails[0].STORE_NAME}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Store Code:{" "}
                                      <strong>{ProfileDetails[0].STORE_CODE}</strong>
                                    </td>
                                    <td colSpan={2}>
                                      Staff Name:{" "}
                                      <strong>{ProfileDetails[0].STORE_STAFF_NAME}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ background: "#0c8fcf", color: "#fff" }}>Notes</td>
                                    <td style={{ background: "#0c8fcf", color: "#fff" }}>No.</td>
                                    <td style={{ background: "#0c8fcf", color: "#fff" }}>Amount</td>
                                  </tr>
                                </tbody>
                                : null
                              }

                              <tbody>
                                <tr>
                                  <td style={{ width: "60%" }}>
                                    <strong>500 X</strong>
                                  </td>
                                  <td style={{ width: "20%" }}>
                                    <CInput
                                      value={Amount}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setAmount(value);
                                        if (value == null || value == "") {
                                          setAmtTotal(0);
                                        } else {
                                          setAmtTotal(parseFloat(value) * 500);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td style={{ width: "20%" }}>
                                    <CInput type="number" value={AmtTotal} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>200 X</strong>
                                  </td>
                                  <td>
                                    <CInput
                                      value={Amount1}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setAmount1(value);
                                        if (value == null || value == "") {
                                          setAmtTotal1(0);
                                        } else {
                                          setAmtTotal1(parseFloat(value) * 200);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <CInput value={AmtTotal1} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>100 X</strong>
                                  </td>
                                  <td>
                                    <CInput
                                      value={Amount2}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setAmount2(value);
                                        if (value == null || value == "") {
                                          setAmtTotal2(0);
                                        } else {
                                          setAmtTotal2(parseFloat(value) * 100);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <CInput value={AmtTotal2} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>50 X</strong>
                                  </td>
                                  <td>
                                    <CInput
                                      value={Amount3}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setAmount3(value);
                                        if (value == null || value == "") {
                                          setAmtTotal3(0);
                                        } else {
                                          setAmtTotal3(parseFloat(value) * 50);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <CInput value={AmtTotal3} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>20 X</strong>
                                  </td>
                                  <td>
                                    <CInput
                                      value={Amount4}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setAmount4(value);
                                        if (value == null || value == "") {
                                          setAmtTotal4(0);
                                        } else {
                                          setAmtTotal4(parseFloat(value) * 20);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <CInput value={AmtTotal4} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>10 X</strong>
                                  </td>
                                  <td>
                                    <CInput
                                      value={Amount5}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setAmount5(value);
                                        if (value == null || value == "") {
                                          setAmtTotal5(0);
                                        } else {
                                          setAmtTotal5(parseFloat(value) * 10);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <CInput value={AmtTotal5} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>5 X</strong>
                                  </td>
                                  <td>
                                    <CInput
                                      value={Amount6}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setAmount6(value);
                                        if (value == null || value == "") {
                                          setAmtTotal6(0);
                                        } else {
                                          setAmtTotal6(parseFloat(value) * 5);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <CInput value={AmtTotal6} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Coins</strong>
                                  </td>
                                  <td>
                                    <CInput
                                      value={Amount7}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setAmount7(value);
                                        if (value == null || value == "") {
                                          setAmtTotal7(0);
                                        } else {
                                          setAmtTotal7(parseFloat(value));
                                        }
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <CInput value={AmtTotal7} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong style={{ fontSize: 14 }}>Total Cash</strong>
                                  </td>
                                  <td colSpan={2}>
                                    <CInput value={TotalCash} disabled />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Credit/Debit Card</strong>
                                  </td>
                                  <td colSpan={2}>
                                    <CInput
                                      value={CreditCard}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setCreditCard(value);
                                        if (value == null || value == "") {
                                          setCreditCardAmt(0);
                                        } else {
                                          setCreditCardAmt(parseFloat(value));
                                        }
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>UPI</strong>
                                  </td>
                                  <td colSpan={2}>
                                    <CInput
                                      value={upi}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setupi(value);
                                        if (value == null || value == "") {
                                          setupiAmt(0);
                                        } else {
                                          setupiAmt(parseFloat(value));
                                        }
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>CHQ</strong>
                                  </td>
                                  <td colSpan={2}>
                                    <CInput
                                      value={chq}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setchq(value);
                                        if (value == null || value == "") {
                                          setchqAmt(0);
                                        } else {
                                          setchqAmt(parseFloat(value));
                                        }
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>NEFT</strong>
                                  </td>
                                  <td colSpan={2}>
                                    <CInput
                                      value={neft}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setneft(value);
                                        if (value == null || value == "") {
                                          setneftAmt(0);
                                        } else {
                                          setneftAmt(parseFloat(value));
                                        }
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Total Others</strong>
                                  </td>
                                  <td colSpan={2}>
                                    <CInput
                                      value={other}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setother(value);
                                        if (value == null || value == "") {
                                          setotherAmt(0);
                                        } else {
                                          setotherAmt(parseFloat(value));
                                        }
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <th>
                                    <strong style={{ fontSize: 14, color: "white" }}>
                                      Total Collection
                                    </strong>
                                  </th>
                                  <th colSpan={2}>
                                    <strong style={{ fontSize: 14, color: "white" }}>
                                      {TotalCollection}
                                    </strong>
                                  </th>
                                </tr>
                                <tr>
                                  <td>
                                    <strong colSpan={3} style={{ fontSize: 14, color: "red" }}>
                                      Balance
                                    </strong>
                                  </td>
                                  <td colSpan={2}>
                                    <CInput
                                      value={Balance}
                                      onChange={(event) => {
                                        let value = event.target.value.replace(
                                          /[^0-9]/gi,
                                          ""
                                        );
                                        setBalance(value);
                                        if (value == null || value == "") {
                                          setBalance(0);
                                        } else {
                                          setBalance(parseFloat(TotalCollection) - parseFloat(CollectionTotal));
                                        }
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={3} style={{ textAlign: "left" }}>
                                    Amount in words: <strong>{inWords(TotalCollection)}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={3}>
                                    <CFormGroup row>
                                      <CCol xs="12" md="12" style={{ textAlign: "left" }}>
                                        <CLabel>Remarks</CLabel>
                                        <CTextarea
                                          id="text-input"
                                          name="text-input"
                                          placeholder="Enter Remarks"
                                          value={Remarks}
                                          onChange={(event) => {
                                            let value = event.target.value.replace(
                                              /[^a-z A-Z]/gi,
                                              ""
                                            );
                                            setRemarks(value)
                                          }}
                                        />
                                      </CCol>
                                    </CFormGroup>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </CCard>
                          : null}
                      </CCol>
                      <CCol md="12">
                        {LogoutSubmit == false || LogoutSubmit == "false" ?
                          <CButton
                            style={{ float: "right" }}
                            className="btn btn-success"
                            onClick={SubmitFinalAmountDetails}
                          >
                            Close Day
                          </CButton>
                          :
                          <div>
                            <span>Day Close Details have been Submitted, You can Logout using the below button.</span><br />
                            <CButton
                              style={{ float: "right" }}
                              className="btn btn-success"
                              onClick={DayCloseLogout}
                            >
                              Logout
                            </CButton>
                          </div>
                        }
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default TagInvoiceReprint;
