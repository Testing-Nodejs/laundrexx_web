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
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
import { useHistory } from "react-router-dom";

const SendOrders = () => {
    const history = useHistory();

    const FactoryID = sessionStorage.getItem("FactoryID");
    const StaffID = sessionStorage.getItem("UserID");

    const [OrderNo, setOrderNo] = useState("");
    const [OrderDet, setOrderDet] = useState([]);
    const [Factory, setFactory] = useState("-1");
    const [FactoryData, setFactoryData] = useState();

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

    const GetItemDetails = (num) => {
        const obj = {
            ItemNumber: num,
        }
        axios.post(MyApiUrl + "GetItemDetailsByItemNumber", obj).then((response) => {
            console.log(response);
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
        });
    }

    // const UpdateTotalBags = (event) => {
    //     const updatedData = OrderDet.map((item) => {
    //         if (parseInt(item.Pkid) === parseInt(event.target.id)) {
    //             return { ...item, TotalBags: event.target.value };
    //         }
    //         return item;
    //     });
    //     setOrderDet(updatedData);
    // }

    const SplitDate1 = (OrderDate) => {
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
            if (response.data === true) {
                Swal.fire({
                    title: "Item Details Submitted!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                document.getElementById("divLoading").className = "hide";
                Reload();
                history.push("/SentFactoryDCDetails");
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
        GetFactory();
    }

    React.useEffect(() => {
        Reload();
    }, []);

    React.useEffect(() => {
        if (Factory === "-1") {

        } else {
            document.getElementById("NumOrder").focus();
        }
    }, [Factory]);

    return (
        <div className="123">
            <div id="divLoading"> </div>
            <h1 id="ccmaster">Send/Return to Factory</h1>
            <CRow>
                <CCol md="12" lg="1"></CCol>
                <CCol md="12" lg="11">
                    <CLink to="/SendOrder">
                        <CButton size="sm" className="btn btn-danger" style={{ marginBottom: 0, marginTop: 0, float: "left", width: "7%" }}>
                            Back
                        </CButton>
                    </CLink>
                </CCol>
            </CRow>
            {Factory === "-1" ?
                <CRow style={{ marginTop: "3%", }}>
                    <CCol md="12" lg="3"></CCol>
                    <CCol md="12" lg="6">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Factory</CCardHeader>
                            <CCardBody>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
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
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md="12" lg="3"></CCol>
                </CRow> :
                <CRow style={{ marginTop: "3%", }}>
                    <CCol md="12" lg="3"></CCol>
                    <CCol md="12" lg="6">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add Item No to DC</CCardHeader>
                            <CCardBody>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel>Item No<span style={{ color: "red" }}> *</span></CLabel>
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
                                </CFormGroup>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md="12" lg="3"></CCol>
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
                                            float: "right"
                                        }}
                                        onClick={SubmitFinalItemDetails}
                                    >
                                        Submit
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCol> : null}
                </CRow>
            }


        </div>
    );
};

export default SendOrders;