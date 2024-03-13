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
    CDropdownDivider, CLink,
} from "@coreui/react";
import { MyApiUrl, ViewImg } from "src/services/service";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import CustomerInvoice from "../CustomerInvoiceForModified";
import OutletInvoice from "../OutletInvoiceForModified";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };

const fields = [
    { key: "Sl No" },
    { key: "Item Category" },
    { key: "Item Sub Category" },
    { key: "Item Name" },
    { key: "Item Amount" },
    { key: "Additional Service" },
    { key: "Additional Service Price" },
    { key: "Quantity" },
    { key: "Count" },
    { key: "Defects" },
    { key: "Total Amount" },
    { key: "Discount" },
    { key: "Final Amount" },
];


const ModifiedOrders = (props) => {
    const history = useHistory();
    const ORDER_PKID = props.location.state.data;

    const [ModifiedData, setModifiedData] = useState([]);
    const [ModifiedData1, setModifiedData1] = useState([]);
    const [OrderItemData, setOrderItemData] = useState([]);
    const [PickupData, setPickupData] = useState([]);
    const [block, setblock] = useState(false);
    const [block1, setblock1] = useState(false);
    const [block2, setblock2] = useState(false);
    const [block3, setblock3] = useState(false);
    const [print, setPrint] = useState(false);
    const [InvoiceItemsData, setInvoiceItemsData] = useState([]);

    const [OutletFields, setOutletFields] = useState({
        ID: "",
        Name: "",
        Address: "",
        Pkid: "",
        City: "",
        Phone: "",
        PriceTier: "",
        FactoryName: "",
        RouteName: "",
        ServiceCat: "",
        ServiceType: "",
    });

    const [CouponFields, setCouponFields] = useState({
        Name: "",
        Type: "",
        Pkid: "",
        Code: "",
        Price: "",
        Discount: "",
        Validity: "",
        Active: "",
    });

    const [CustomerFields, setCustomerFields] = useState({
        Name: "",
        Type: "",
        Pkid: "",
        Phone: "",
        Email: "",
        Address: "",
        Gst: "",
    });

    const ViewModifiedOrders = () => {
        axios.get(MyApiUrl + "GetModifiedDates/" + ORDER_PKID + "").then((response) => {
            console.log(response.data);
            setModifiedData(response.data);
        });
    }

    const ViewOutlets = (pkid, id, name, address, city, phone, price, cat, type, factory, route) => {
        setblock(!block);
        setOutletFields({
            ...OutletFields,
            ID: id,
            Name: name,
            Address: address,
            Pkid: pkid,
            City: city,
            Phone: phone,
            RouteName: route,
            FactoryName: factory,
            ServiceCat: cat,
            ServiceType: type,
            PriceTier: price,
        }
        );

    };
    const ViewCoupon = (pkid, type, name, code, price, discount, validity, active) => {
        setblock1(!block1);
        setCouponFields({
            ...CouponFields,
            Pkid: pkid,
            Type: type,
            Name: name,
            Code: code,
            Price: price,
            Discount: discount,
            Validity: validity,
            Active: active,
        })
    };

    const ViewCustomer = (pkid, name, phone, gst, email, address, type) => {
        setblock2(!block2);
        setCustomerFields({
            ...CustomerFields,
            Pkid: pkid,
            Type: type,
            Name: name,
            Phone: phone,
            Gst: gst,
            Email: email,
            Address: address,
        })
    };

    const ViewPickupDetails = (Id) => {
        const obj = {
            PickupCode: Id,
        }

        axios.post(MyApiUrl + "GetPickupDetailsByCode", obj).then((response) => {
            if (response.data.length > 0) {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "Pickup Code": item.PICKUP_CODE,
                        "Created Time": item.PICKUP_TIME,
                        "Created By": item.PICKUP_CREATED_BY,
                        "Quantity": item.PICKUP_QUANTITY,
                        "Pickup Address": item.PICKUP_ADDRESS,
                        "Customer Name": item.CUSTOMER_NAME,
                        "Customer Phone": item.CUSTOMER_CONTACT_NUMBER,
                        "Driver Name": item.DRIVER_NAME,
                        "Driver Phone": item.DRIVER_PHONE,
                    };
                });
                console.log(items);
                setPickupData(items);
                setblock3(!block3);
                document.getElementById("divLoading").className = "hide";
            } else {
                setPickupData([]);
                document.getElementById("divLoading").className = "hide";
            }
        })
            .catch((error) => {
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
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    React.useEffect(() => {
        ViewModifiedOrders();
    }, []);


    const printInvoice = async () => {
        setPrint(true);
    }

    React.useEffect(() => {
        setPrint(false);
    }, [print]);

    return (

        <div id="city">
            <div id="divLoading"> </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster">Previous Order Logs</h1>
            {print == true ?
                <div>
                    <OutletInvoice ModifiedData1={ModifiedData1} InvoiceItemsData={InvoiceItemsData} />
                    <CustomerInvoice ModifiedData1={ModifiedData1} InvoiceItemsData={InvoiceItemsData} />
                </div>
                :
                null}

            <CRow style={{ marginTop: "3%" }}>
                {ModifiedData.length > 0 ?
                    ModifiedData.map((item, count) => {
                        return (
                            <React.Fragment>
                                <CCol md="3">
                                    <div className="mx-auto payment-container"
                                        onClick={async () => {
                                            const obj = {
                                                OrderID: ORDER_PKID,
                                                Date: item.ORDER_MODIFICATION_DATE,
                                                Time: item.ORDER_MODIFICATION_TIME,
                                            }
                                            await axios.post(MyApiUrl + "GetModifiedOrder", obj).then(async (response) => {
                                                if (response.data.length > 0) {
                                                    setModifiedData1(response.data);
                                                    await axios.post(MyApiUrl + "LogsOrderItems", obj).then((response) => {
                                                        setInvoiceItemsData(response.data);
                                                        const items = response.data.map((item, index) => {
                                                            return {
                                                                ...item,
                                                                "Sl No": index + 1,
                                                                "Item Category": item.ITEM_CATEGORY_NAME,
                                                                "Item Sub Category": item.SUB_CATEGORY_NAME,
                                                                "Item Name": item.ITEMS_NAME,
                                                                "Item Amount": item.ORDER_ITEM_AMOUNT,
                                                                "Additional Service": item.ADDITIONAL_SERVICE_NAME == "" || item.ADDITIONAL_SERVICE_NAME == null ? "None" : item.ADDITIONAL_SERVICE_NAME,
                                                                "Additional Service Price": item.ORDER_ITEM_ADDITIONAL_REQUEST_AMOUNT,
                                                                "Quantity": item.ORDER_ITEM_QUANTITY,
                                                                "Count": item.ORDER_ITEM_COUNT,
                                                                "Defects": item.ORDER_ITEM_DEFECT,
                                                                "Total Amount": item.ORDER_ITEM_TOTAL_AMOUNT,
                                                                "Discount": item.ORDER_ITEM_DISCOUNT,
                                                                "Final Amount": item.ORDER_ITEM_FINAL_AMOUNT,
                                                            };
                                                        });
                                                        setOrderItemData(items);
                                                    });
                                                }
                                            })
                                        }}>
                                        <div className="payment-radio-container">
                                            <input type="radio" id={`payment-radio-${count}`} name="select" value="Cash" />
                                            <label for={`payment-radio-${count}`} className="pplogo-container" style={{ height: "120%", width: "100%" }}>
                                                <table>
                                                    <tr>
                                                        <td style={{ fontWeight: 800, fontSize: "14 !important" }}>Date: </td>
                                                        <td style={{ fontSize: "14 !important" }}>{SplitDate(item.ORDER_MODIFICATION_DATE)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ fontWeight: 800, fontSize: "14 !important" }}>Time: </td>
                                                        <td style={{ fontSize: "14 !important" }}>{item.ORDER_MODIFICATION_TIME}</td>
                                                    </tr>
                                                </table>
                                            </label>
                                        </div>
                                    </div>
                                </CCol>
                            </React.Fragment>
                        )
                    })
                    : null
                }
            </CRow>
            {ModifiedData1.length > 0 ?
                <CRow style={{ marginTop: "5%" }}>
                    <CCol>
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>
                                <CRow>
                                    <CCol col="6" style={{ alignSelf: "center" }}>Order Details</CCol>
                                    <CCol col="6">
                                        <CButton
                                            onClick={() => {
                                                printInvoice();
                                            }}
                                            className="btn btn-primary"
                                            style={{
                                                float: "right",
                                                fontSize: "12px"
                                            }}
                                        >
                                            Print Invoice
                                        </CButton>
                                    </CCol>
                                </CRow></CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol md="4">
                                        <div>
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order Number</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_ORDER_NUMBER}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order Date</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{(ModifiedData1[0].ORDER_DATE).split("T")[0]}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Due Date</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{(ModifiedData1[0].ORDER_DUE_DATE).split("T")[0]}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Invoice Number</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_INVOICE_NUMBER}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }} >Outlet Name</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span id="ModifiedSpan" style={{ fontSize: "14px", color: "#757575", backgroundColor: "rgb(173 166 166 / 30%)", borderRadius: 5, padding: "5px" }} onClick={() => {
                                                        ViewOutlets(ModifiedData1[0].STORE_PKID, ModifiedData1[0].STORE_ID, ModifiedData1[0].STORE_NAME, ModifiedData1[0].STORE_ADDRESS, ModifiedData1[0].STORE_CITY, ModifiedData1[0].STORE_PHONE, ModifiedData1[0].STORE_PRICE_TIER, ModifiedData1[0].SERVICE_CATEGORY_NAME, ModifiedData1[0].SERVICE_TYPE_NAME, ModifiedData1[0].FACTORY_NAME, ModifiedData1[0].ROUTE_NAME);
                                                    }}>{ModifiedData1[0].STORE_NAME}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span id="ModifiedSpan" style={{ fontSize: "14px", color: "#757575", backgroundColor: "rgb(173 166 166 / 30%)", borderRadius: 5, padding: "5px" }} onClick={() => {
                                                        ViewCustomer(ModifiedData1[0].CUSTOMER_PKID, ModifiedData1[0].CUSTOMER_NAME, ModifiedData1[0].CUSTOMER_CONTACT_NUMBER, ModifiedData1[0].CUSTOMER_GST_TYPE, ModifiedData1[0].CUSTOMER_EMAIL, ModifiedData1[0].CUSTOMER_ADDRESS, ModifiedData1[0].CUSTOMER_TYPE_NAME);
                                                    }}>{ModifiedData1[0].CUSTOMER_NAME}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon</span>
                                                </CCol>
                                                <CCol md="6">
                                                    {ModifiedData1[0].COUPONS_NAME == null || ModifiedData1[0].COUPONS_NAME == "" ?
                                                        <span style={{ fontSize: "14px", color: "#757575" }}>-</span>
                                                        :
                                                        <span id="ModifiedSpan" style={{ fontSize: "14px", color: "#757575", backgroundColor: "rgb(173 166 166 / 30%)", borderRadius: 5, padding: "5px" }} onClick={() => {
                                                            ViewCoupon(ModifiedData1[0].COUPONS_PKID, ModifiedData1[0].COUPONS_TYPE_NAME, ModifiedData1[0].COUPONS_NAME, ModifiedData1[0].COUPONS_CODE, ModifiedData1[0].COUPONS_PRICE_OR_PERCENTAGE, ModifiedData1[0].COUPONS_DISCOUNT, ModifiedData1[0].COUPONS_VALIDITY, ModifiedData1[0].COUPONS_VALIDITY_DATE, ModifiedData1[0].COUPONS_ACTIVE);
                                                        }}>{ModifiedData1[0].COUPONS_NAME}</span>
                                                    }
                                                </CCol>
                                            </CFormGroup>
                                        </div>

                                    </CCol>
                                    <CCol md="4">
                                        <div>
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Category</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].SERVICE_CATEGORY_NAME}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Type</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].SERVICE_TYPE_NAME}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Request</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_IS_PICKUP === "true" || ModifiedData1[0].ORDER_IS_PICKUP === true ? "Requested" : "-"}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup ID</span>
                                                </CCol>
                                                <CCol md="6">
                                                    {ModifiedData1[0].ORDER_IS_PICKUP === "true" || ModifiedData1[0].ORDER_IS_PICKUP === true ?
                                                        <span id="ModifiedSpan" style={{ fontSize: "14px", color: "#757575", backgroundColor: "rgb(173 166 166 / 30%)", borderRadius: 5, padding: "5px" }} onClick={() => {
                                                            ViewPickupDetails(ModifiedData1[0].ORDER_IS_PICKUP_ID);
                                                        }}>{ModifiedData1[0].ORDER_IS_PICKUP_ID}</span>
                                                        :
                                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>-</span>
                                                    }
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Door Delivery</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_DOOR_DELIVERY === true || ModifiedData1[0].ORDER_DOOR_DELIVERY === true ? "Requested" : "-"}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Items</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{OrderItemData.length}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Quantity</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].TotalQuantity}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Count</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].TotalCount}</span>
                                                </CCol>
                                            </CFormGroup>
                                        </div>
                                    </CCol>

                                    <CCol md="4">
                                        <div>
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order Amount</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_AMOUNT}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            {ModifiedData1[0].SERVICE_TYPE_SURCHARGE == 0 || ModifiedData1[0].SERVICE_TYPE_SURCHARGE == "0" ? null :
                                                <React.Fragment>
                                                    <CFormGroup row>
                                                        <CCol md="6">
                                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Surcharge ({ModifiedData1[0].SERVICE_TYPE_NAME}) @ {ModifiedData1[0].SERVICE_TYPE_SURCHARGE}% Extra</span>
                                                        </CCol>
                                                        <CCol md="6">
                                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_TOTAL_SUR_CHARGE}</span>
                                                        </CCol>
                                                    </CFormGroup>
                                                    <CDropdownDivider />
                                                </React.Fragment>
                                            }
                                            {ModifiedData1[0].ORDER_DISCOUNT == 0 || ModifiedData1[0].ORDER_DISCOUNT == "0" ? null :
                                                <React.Fragment>
                                                    <CFormGroup row>
                                                        <CCol md="6">
                                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Discount Amount</span>
                                                        </CCol>
                                                        <CCol md="6">
                                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_DISCOUNT}</span>
                                                        </CCol>
                                                    </CFormGroup>
                                                    <CDropdownDivider />
                                                </React.Fragment>
                                            }
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Order Amount</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_TOTAL_ORDER_AMOUNT}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>CGST @ {ModifiedData1[0].SERVICE_CATEGORY_CGST}%</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_CGST}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>SGST @ {ModifiedData1[0].SERVICE_CATEGORY_CGST}%</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_SGST}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Invoice Number</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_TOTAL_INVOICE_VALUE}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Round off Invoice</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_ROUND_OFF_INVOICE}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                            <CFormGroup row>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Grand Total Amount</span>
                                                </CCol>
                                                <CCol md="6">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ModifiedData1[0].ORDER_GRAND_TOTAL_AMOUNT}</span>
                                                </CCol>
                                            </CFormGroup>
                                        </div>
                                    </CCol>

                                </CRow>
                                <hr />
                                <CRow>
                                    <CCol md="6">
                                        <h4 style={{
                                            fontSize: 22,
                                            fontWeight: "bold",
                                            textDecoration: "underline",
                                            marginTop: "5%",
                                            marginBottom: "5%",
                                            textShadow: "0.5 0.5 0 #545454", color: "#0c8fcf"
                                        }} className="p1">Order Items</h4>
                                    </CCol>
                                </CRow>
                                <br />
                                <CDataTable
                                    items={OrderItemData}
                                    fields={fields}
                                    hover
                                    striped
                                    bordered
                                    sorter
                                    tableFilter={table}
                                    itemsPerPage={10}
                                    pagination
                                    size="sm"
                                    itemsPerPageSelect={items}
                                    scopedSlots={{}}
                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                : null}

            <CModal show={block} onClose={() => setblock(!block)} color="dark" style={{ height: 560, width: 600 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Outlet Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store ID</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.ID}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.Name}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Address</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.Address}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store City</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.City}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Phone</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.Phone}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Store Price Tier</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.PriceTier}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Factory Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.FactoryName}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Route Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.RouteName}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Category</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.ServiceCat}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Type</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{OutletFields.ServiceType}</span>
                            </CCol>
                        </CFormGroup>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock(!block)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal show={block1} onClose={() => setblock1(!block1)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Coupon Details</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ height: "330px" }}>
                    <div>
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Type</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Type}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Name}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Code</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Code}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Price/Percentage</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Price}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Discount</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Discount}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Validity</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Validity}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon Active</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CouponFields.Active === "true" || CouponFields.Active === true ? "Active" : "-"}</span>
                            </CCol>
                        </CFormGroup>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock1(!block1)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal show={block2} onClose={() => setblock2(!block2)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Customer Details</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ height: "330px" }}>
                    <div>
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Name}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Phone</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Phone}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Email</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Email}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Address</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Address}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer GST No.</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Gst}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Type</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerFields.Type}</span>
                            </CCol>
                        </CFormGroup>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock2(!block2)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal show={block3} onClose={() => setblock3(!block3)} color="dark" style={{ height: 560 }}>
                <CModalHeader closeButton>
                    <CModalTitle>Pickup Details</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ height: "330px" }}>
                    {PickupData.length > 0 ?
                        <div>
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Code</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_CODE}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Created Time</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_TIME}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Created By</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_CREATED_BY}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Quantity</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_QUANTITY}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Address</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_ADDRESS}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_CUSTOMER_NAME}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Phone</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData[0].PICKUP_CUSTOMER_PHONE}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Name</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData
                                    [0].DRIVER_NAME}</span>
                                </CCol>
                            </CFormGroup>
                            <CDropdownDivider />
                            <CFormGroup row>
                                <CCol md="4">
                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Driver Phone</span>
                                </CCol>
                                <CCol md="8">
                                    <span style={{ fontSize: "14px", color: "#757575" }}>{PickupData
                                    [0].DRIVER_PHONE}</span>
                                </CCol>
                            </CFormGroup>
                        </div>
                        : null
                    }

                </CModalBody>
                <CModalFooter>
                    <CButton className="btn btn-danger" style={{ fontSize: "13px" }} onClick={() => setblock3(!block3)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

        </div>
    );

};

export default ModifiedOrders;