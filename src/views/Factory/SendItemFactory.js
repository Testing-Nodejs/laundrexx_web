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
    CDataTable,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
    CTextarea,
    CRow,
    CSelect,
    CLink,
} from "@coreui/react";
import EditIcon from "@material-ui/icons/Edit";
import { MultiSelect } from 'react-multi-select-component'
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl, ViewImg } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import { useHistory } from "react-router-dom";

const SendOrders = () => {
    const history = useHistory();

    const FactoryID = sessionStorage.getItem("FactoryID");
    const StaffID = sessionStorage.getItem("UserID");
    const FactoryName = sessionStorage.getItem("StoreName");
    const StaffName = sessionStorage.getItem("UserName");

    const [OrderNo, setOrderNo] = useState("");
    const [OrderDet, setOrderDet] = useState([]);
    const [Factory, setFactory] = useState("-1");
    const [Factory1, setFactory1] = useState("-1");
    const [Type, setType] = useState("-1");
    const [FactoryData, setFactoryData] = useState();

    const [OutletData, setOutletData] = useState([]);
    const [Outlet, setOutlet] = useState([]);
    const [Show, setShow] = useState(false);
    const [OrderDate, setOrderDate] = useState("");
    const [PrintDCData, setPrintDCData] = useState([]);
    const [CDate, setCDate] = useState();
    const [ResponseData, setResponseData] = useState([]);

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

    const FactoryChange = (e) => {
        setFactory(e.target.value);
        setType("-1");
    }

    const TypeChange = (e) => {
        setType(e.target.value);
        setOrderDate("");
        setOutlet([]);
    }


    const GetFactory = () => {
        axios.get(MyApiUrl + "ReturnToFactoryList/" + FactoryID + "").then((response) => {
            console.log(response.data);
            const FactoryOption = response.data.map((item) => (
                <option value={item.FACTORY_PKID}>{item.FACTORY_NAME}</option>
            ));
            setFactoryData(FactoryOption);
        });
    };

    const GetOutlet = () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "ReturnFactoryOutletList/" + FactoryID + "").then((response) => {
            console.log(response.data);
            if (response.data.length > 0) {
                setOutletData(response.data);
                document.getElementById("divLoading").className = "hide";
            }
            else {
                setOutletData([]);
                document.getElementById("divLoading").className = "hide";
            }
            document.getElementById("divLoading").className = "hide";
        })
            .catch((error) => {
                console.log(error);
            });
    }

    const GetItemDetails = (num) => {
        const obj = {
            FactoryID: FactoryID,
            ItemNumber: num,
        }
        axios.post(MyApiUrl + "GetItemDetailsByItemNumber", obj).then((response) => {
            console.log(response);
            if (response.data === "0" || response.data === 0) {
                Swal.fire({
                    title: "DC not received in factory",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                setOrderNo("");
            } else if (response.data === "1" || response.data === 1) {
                Swal.fire({
                    title: "Inventory not available/ Already returned to Factory",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                setOrderNo("");
            } else {
                if (response.data.length > 0) {

                    const obj = {
                        OrderNumber: response.data[0].ORDER_ITEM_NUMBER,
                        ItemName: response.data[0].ITEMS_NAME,
                        DueDate: SplitDate1(response.data[0].ORDER_DUE_DATE),
                        Pkid: response.data[0].ORDER_ITEM_PKID,
                    }
                    if (OrderDet.length > 0) {
                        const existingOrder = OrderDet.findIndex(item => item.Pkid === response.data[0].ORDER_ITEM_PKID);
                        if (existingOrder === "-1" || existingOrder === -1) {
                            setOrderDet([...OrderDet, obj]);
                            setOrderNo("");
                            document.getElementById("NumOrder").focus();
                        } else {
                            Swal.fire({
                                title: "Order Already Exist!",
                                text: "If you want to edit order please delete and add new order.",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                            setOrderNo("");
                            document.getElementById("NumOrder").focus();
                        }
                    } else {
                        setOrderDet([...OrderDet, obj]);
                        setOrderNo("");
                        document.getElementById("NumOrder").focus();

                    }

                }
            }

        });

    }

    const GetBulkItemDetails = (date) => {
        if (Outlet.length == 0) {
            Swal.fire({
                title: "Select At least One Outlet!",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        } else if (date === null || date === "") {
            return;
        }
        else {
            const obj = {
                OutletDetails: Outlet,
                Date: date,
                FactoryID: FactoryID
            }
            console.log(typeof (Outlet));
            console.log(obj);
            axios.post(MyApiUrl + "GetInventoryForReturnToFactoryBulk", obj).then((response) => {
                console.log(response.data);
                if (response.data.length > 0) {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            OrderNumber: item.ORDER_ITEM_NUMBER,
                            ItemName: item.ITEMS_NAME,
                            DueDate: SplitDate1(item.ORDER_DUE_DATE),
                            Pkid: item.ORDER_ITEM_PKID,
                        };
                    });
                    console.log(items);
                    setOrderDet(items);
                }
            });
        }
    };


    const SplitDate1 = (OrderDate) => {
        console.log(OrderDate)
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    const SubmitFinalItemDetails = () => {
        var obj = {
            FromFactory: FactoryID,
            ToFactory: Factory,
            StaffID: StaffID,
            ItemList: OrderDet,
            TotalBags: "1",
        }
        console.log(obj)
        document.getElementById("divLoading").className = "show";
        axios.post(MyApiUrl + "ReturnToFactory", obj).then((response) => {
            console.log(response.data);
            if (response.data === false) {
                Swal.fire({
                    title: "Failed To Submit!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
            } else {
                Swal.fire({
                    title: "Item Details Returned!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    history.goBack();
                })
                setResponseData(response.data);
                document.getElementById("divLoading").className = "hide";
                printDC();
            }
        });

    }

    const DeleteOrderItem = (pkid) => {
        let newArr = OrderDet.filter((x) => x.Pkid !== pkid);
        setOrderDet(newArr);
    }
    const DeleteAllOrderItem = () => {
        setOrderDet([]);
    }

    const Reload = () => {
        setOrderNo("");
        setOrderDet("");
        setFactory("-1");
        setFactory1("-1");
        setType("-1");
        setOutlet([]);
        setOrderDate("");
        GetFactory();
    }

    const GetDates = () => {
        var showdate = new Date();
        const mon = (showdate.getMonth() + 1).toString().padStart(2, "0");
        setCDate(
            showdate.getDate().toString().padStart(2, "0") +
            "-" +
            mon +
            "-" +
            showdate.getUTCFullYear()
        );
    };

    const printDC = async () => {
        await GetDates();
        // Calculate the width of the screen
        const screenWidth = screen.width;

        // Calculate the left position for the tags window
        const DCWindowLeft = Math.floor((screenWidth - 780) / 4);

        // Open the windows with the calculated positions
        const DCWindow = window.open("", "Delivery Challan", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + DCWindowLeft);

        DCWindow.document.write('<html><head><title>Delivery Challan</title></head><body style="font-family: Arial; font-size: 9px; letter-spacing: 1px">');
        DCWindow.document.write(document.getElementById("DCWindow").innerHTML);
        DCWindow.document.write('</body></html>');
        DCWindow.document.close();

        setTimeout(() => {
            DCWindow.print();
            DCWindow.close();
        }, 2000);
    }

    React.useEffect(() => {
        Reload();
        GetOutlet();
    }, []);

    React.useEffect(() => {
        if (Type === "Individual") {
            if (Factory === "-1") {

            } else {
                document.getElementById("NumOrder").focus();
            }
        } else {

        }

    }, [Factory]);

    React.useEffect(() => {
        if (OutletData.length > 0) {
            OutletData.length == Outlet.length ? setShow(true) : setShow(false);
            if (Outlet.length > 0) {
                GetBulkItemDetails(OrderDate);
            }
        }
    }, [Outlet]);

    let footerQuantity = 0;
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
            <h1 id="ccmaster" style={{ marginTop: "3%", }}>Send/Return Items to Factory</h1>

            <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "190px" }} id="DCWindow">
                <div style={{
                    width: "190px", textAlign: "center",
                }}>
                    {OrderDet.length > 0 && ResponseData.length > 0 ?
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
                                        <img className="barcode" style={{ width: 70, height: 70 }} src={ViewImg + "/" + ResponseData.QR} />
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
                                        : &nbsp;&nbsp;&nbsp;<b>{ResponseData.DCNumber}</b>
                                    </td>
                                    <td style={{ fontWeight: "300" }} width="15%">Date</td>
                                    <td style={{ borderRight: "1px solid #000" }} width="35%">
                                        : &nbsp;&nbsp;&nbsp;<b>{CDate}</b>
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
                                    <td>: &nbsp;&nbsp;&nbsp;{FactoryName}</td>
                                    <td style={{ fontWeight: "300" }}>To Station</td>
                                    <td style={{ borderRight: "1px solid #000" }}>: &nbsp;&nbsp;&nbsp;{ResponseData.ToFactoryName}</td>
                                </tr>
                                <tr style={{
                                    fontWeight: "600",
                                    fontSize: "9px"
                                }}>
                                    <td style={{ fontWeight: "300" }}>Prepared By</td>
                                    <td>: &nbsp;&nbsp;&nbsp;{StaffName}</td>
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
                                </tr>
                                {OrderDet.map((item, index) => {
                                    footerQuantity = footerQuantity + OrderDet.length;
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
                                            }}>{item.ItemNumber}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "center",
                                            }}>{item.DueDate}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "center",
                                            }}>1</td>
                                        </tr>
                                    )
                                }
                                )}
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
                                    }}><b style={{ fontWeight: "800" }} >Total Bags: {OrderDet.length}</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Orders: {ResponseData.length}</b></td>
                                    <td style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000"
                                    }}><b style={{ fontWeight: "800" }} >Total Quantity: {footerQuantity}</b></td>
                                </tr>
                                <tr>
                                    <td colSpan="4" style={{
                                        textAlign: "center",
                                        borderBottom: "1px solid #000",
                                        borderRight: "1px solid #000",
                                        height: 35,
                                        borderLeft: "1px solid #000",
                                    }}></td>
                                </tr>
                            </table>
                        </center>
                        :
                        null
                    }
                </div>
            </div>
            
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>
                            <div style={{ float: "left" }}>Send/Return to Factory</div>
                            {/* <div style={{ float: "right" }}>
                                <CLink to="/SendOrder">
                                    <CButton size="sm" className="btn btn-danger" style={{ marginBottom: 0, marginTop: 0 }}>
                                        Back
                                    </CButton>
                                </CLink>
                            </div> */}
                        </CCardHeader>
                        <CCardBody>
                            <CFormGroup row>
                                <CCol xs="12" md="4">
                                    <CLabel>Choose Factory<span style={{ color: "red" }}> *</span></CLabel>
                                    <CSelect
                                        custom
                                        name="RouteCode"
                                        id="RouteCode"
                                        onChange={FactoryChange}
                                        value={Factory}
                                    >
                                        <option value="-1">Select Factory</option>
                                        {FactoryData}
                                    </CSelect>
                                </CCol>
                            </CFormGroup>
                            {Factory === "-1" ? null :
                                (<React.Fragment>
                                    <CFormGroup row>
                                        <CCol xs="12" md="4">
                                            <CLabel>Select DC Type<span style={{ color: "red" }}> *</span></CLabel>
                                            <CSelect
                                                custom
                                                name="RouteCode"
                                                id="RouteCode"
                                                onChange={TypeChange}
                                                value={Type}
                                            >
                                                <option value="-1">Select Type</option>
                                                <option value="Bulk">Bulk</option>
                                                <option value="Individual">Individual</option>
                                            </CSelect>
                                        </CCol>
                                        {Type === "Bulk" ? (<React.Fragment>

                                            <CCol xs="12" md="4">
                                                <CLabel>Choose Outlet<span style={{ color: "red" }}> *</span></CLabel>
                                                {Show == true ?
                                                    <MultiSelect
                                                        options={OutletData}
                                                        value={Outlet}
                                                        onChange={setOutlet}
                                                        labelledBy="Select Outlets"
                                                        valueRenderer={() => ("All Outlets Selected")}
                                                    />
                                                    :
                                                    <MultiSelect
                                                        options={OutletData}
                                                        value={Outlet}
                                                        onChange={setOutlet}
                                                        labelledBy="Select Outlets"
                                                    />
                                                }
                                            </CCol>
                                            <CCol xs="12" md="4">
                                                <CLabel>Select Order Date<span style={{ color: "red" }}> *</span></CLabel>
                                                <CInput
                                                    type="date"
                                                    onChange={(event) => {
                                                        setOrderDate(event.target.value);
                                                        GetBulkItemDetails(event.target.value);
                                                    }}
                                                    value={OrderDate}
                                                />
                                            </CCol>
                                        </React.Fragment>) : Type === "Individual" ?
                                            (<React.Fragment>
                                                <CCol xs="12" md="4">
                                                    <CLabel>Item Number<span style={{ color: "red" }}> *</span></CLabel>
                                                    <CInput
                                                        id="NumOrder"
                                                        name="NumOrder"
                                                        placeholder="Enter Item No / Scan QR Code"
                                                        value={OrderNo}
                                                        onChange={(event) => {
                                                            setOrderNo(event.target.value);
                                                            GetItemDetails(event.target.value);
                                                        }}
                                                    />
                                                </CCol>
                                            </React.Fragment>) : null
                                        }
                                    </CFormGroup>
                                </React.Fragment>)}

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "3%", }}>
                {OrderDet.length > 0
                    ?
                    <CCol md="12" lg="12">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>
                                <div style={{ float: "left" }}>
                                    View Added Items in DC
                                </div>
                                <div style={{ float: "right" }}>
                                    <CButton
                                        size="sm"
                                        className="btn btn-success"
                                        onClick={DeleteAllOrderItem}
                                    >
                                        Delete
                                    </CButton>
                                </div>
                            </CCardHeader>
                            <div style={{ overflow: "auto" }}>
                                <table
                                    className="table table-responsive-sm table-bordered table-hover"
                                    id="OutletPlaceOrderCouponTable"
                                >
                                    <thead>
                                        {/* <th colSpan={4}>DC No: {DCNo}</th>
                                        <th colSpan={2}>Date:{CurrentDate}</th> */}
                                        <tr>
                                            <th>
                                                <strong>Sl No</strong>
                                            </th>
                                            <th>
                                                <strong>Item No</strong>
                                            </th>
                                            <th>
                                                <strong>Item Name</strong>
                                            </th>

                                            <th>
                                                <strong>Due Date</strong>
                                            </th>
                                            <th><strong>Action</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {OrderDet.map((item, index) => (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{item.OrderNumber}</td>
                                                <td>{item.ItemName}</td>
                                                <td>{item.DueDate}</td>
                                                <td><CButton
                                                    size="sm"
                                                    onClick={() => {
                                                        DeleteOrderItem(item.Pkid);
                                                    }}
                                                    id="war-btn1"
                                                >
                                                    <DeleteSharpIcon />
                                                </CButton></td>
                                            </tr>
                                        ))}

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
                                        marginBottom: 5
                                    }}
                                    onClick={SubmitFinalItemDetails}
                                >
                                    Submit
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCol> : null}
            </CRow>


        </div>
    );
};

export default SendOrders;