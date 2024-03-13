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
    CFormGroup,
    CDropdownDivider,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CModal,
    CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import { MyApiUrl, ViewImg } from "src/services/service";
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


const OutletOrderItems = (props) => {
    const {
        COUPONS_ACTIVE,
        COUPONS_CODE,
        COUPONS_DISCOUNT,
        COUPONS_NAME,
        COUPONS_PKID,
        COUPONS_PRICE_OR_PERCENTAGE,
        COUPONS_TYPE_NAME,
        COUPONS_VALIDITY,
        COUPONS_VALIDITY_DATE,
        CUSTOMER_ADDRESS,
        CUSTOMER_CONTACT_NUMBER,
        CUSTOMER_EMAIL,
        CUSTOMER_GST_TYPE,
        CUSTOMER_NAME,
        CUSTOMER_PKID,
        CUSTOMER_TYPE_NAME,
        FACTORY_NAME,
        ORDER_AMOUNT,
        ORDER_CGST,
        ORDER_DATE,
        ORDER_DISCOUNT,
        ORDER_DOOR_DELIVERY,
        ORDER_DUE_DATE,
        ORDER_GRAND_TOTAL_AMOUNT,
        ORDER_INVOICE_NUMBER,
        ORDER_IS_PICKUP,
        ORDER_IS_PICKUP_ID,
        ORDER_ORDER_NUMBER,
        ORDER_PKID,
        ORDER_ROUND_OFF_INVOICE,
        ORDER_SGST,
        ORDER_TOTAL_INVOICE_VALUE,
        ORDER_TOTAL_ORDER_AMOUNT,
        ROUTE_NAME,
        SERVICE_CATEGORY_CGST,
        SERVICE_CATEGORY_NAME,
        SERVICE_CATEGORY_SGST,
        SERVICE_TYPE_NAME,
        STORE_ADDRESS,
        STORE_CITY,
        STORE_ID,
        STORE_NAME,
        STORE_PHONE,
        STORE_PKID,
        STORE_PRICE_TIER,
        TotalQuantity,
        TotalCount,
        SERVICE_TYPE_SURCHARGE,
        ORDER_TOTAL_SUR_CHARGE,
    } = props.location.state.data;

    const [ResponseData, setResponseData] = useState([]);
    const [PickupData, setPickupData] = useState([]);
    const [block, setblock] = useState(false);
    const [block1, setblock1] = useState(false);
    const [block2, setblock2] = useState(false);
    const [block3, setblock3] = useState(false);

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

    const GetAllOrderItems = () => {
        document.getElementById("divLoading").className = "show";
        axios({
            method: "GET",
            url: MyApiUrl + "AllOrderItemsByOrderID/" + ORDER_PKID,
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                console.log(response.data)
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No": index + 1,
                        "Item Category": item.ITEM_CATEGORY_NAME,
                        "Item Sub Category": item.SUB_CATEGORY_NAME,
                        "Item Name": item.ITEMS_NAME,
                        "Item Amount": item.ORDER_ITEM_AMOUNT,
                        "Additional Service": item.ADDITIONAL_SERVICE_NAME == "" || item.ADDITIONAL_SERVICE_NAME == null ? "-" : item.ADDITIONAL_SERVICE_NAME,
                        "Additional Service Price": item.ORDER_ITEM_ADDITIONAL_REQUEST_AMOUNT,
                        "Quantity": item.ORDER_ITEM_QUANTITY,
                        "Count": item.ORDER_ITEM_COUNT,
                        "Defects": item.ORDER_ITEM_DEFECT,
                        "Total Amount": item.ORDER_ITEM_TOTAL_AMOUNT,
                        "Discount": item.ORDER_ITEM_DISCOUNT,
                        "Final Amount": item.ORDER_ITEM_FINAL_AMOUNT,
                    };
                });
                setResponseData(items);
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    };

    React.useEffect(() => {
        GetAllOrderItems();
    }, []);

    let history = useHistory();

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
        });
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
        });
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
            } else {
                setPickupData([]);
            }
        });
    };

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    return (
        <div>
            <div id="divLoading"> </div>
            
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/OutletDashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "2%" }}>
                <CCol md="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>Order Details</CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol md="4">
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order Number</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_ORDER_NUMBER}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order Date</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{SplitDate(ORDER_DATE)}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Due Date</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{SplitDate(ORDER_DUE_DATE)}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Invoice Number</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_INVOICE_NUMBER}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Outlet Name</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span id="ModifiedSpan" style={{ fontSize: "14px", color: "#757575", backgroundColor: "rgb(173 166 166 / 30%)", borderRadius: 5, padding: "5px" }} onClick={() => {
                                                ViewOutlets(STORE_PKID, STORE_ID, STORE_NAME, STORE_ADDRESS, STORE_CITY, STORE_PHONE, STORE_PRICE_TIER, SERVICE_CATEGORY_NAME, SERVICE_TYPE_NAME, FACTORY_NAME, ROUTE_NAME);
                                            }}>{STORE_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span id="ModifiedSpan" style={{ fontSize: "14px", color: "#757575", backgroundColor: "rgb(173 166 166 / 30%)", borderRadius: 5, padding: "5px" }} onClick={() => {
                                                ViewCustomer(CUSTOMER_PKID, CUSTOMER_NAME, CUSTOMER_CONTACT_NUMBER, CUSTOMER_GST_TYPE, CUSTOMER_EMAIL, CUSTOMER_ADDRESS, CUSTOMER_TYPE_NAME);
                                            }}>{CUSTOMER_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Coupon</span>
                                        </CCol>
                                        <CCol md="7">
                                            {COUPONS_NAME == null || COUPONS_NAME == "" ?
                                                <span style={{ fontSize: "14px", color: "#757575" }}>-</span>
                                                :
                                                <span id="ModifiedSpan" style={{ fontSize: "14px", color: "#757575", backgroundColor: "rgb(173 166 166 / 30%)", borderRadius: 5, padding: "5px" }} onClick={() => {
                                                    ViewCoupon(COUPONS_PKID, COUPONS_TYPE_NAME, COUPONS_NAME, COUPONS_CODE, COUPONS_PRICE_OR_PERCENTAGE, COUPONS_DISCOUNT, COUPONS_VALIDITY, COUPONS_VALIDITY_DATE, COUPONS_ACTIVE);
                                                }}>{COUPONS_NAME}</span>
                                            }
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                </CCol>
                                <CCol md="4">
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Category</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{SERVICE_CATEGORY_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Service Type</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{SERVICE_TYPE_NAME}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup Request</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_IS_PICKUP === "true" || ORDER_IS_PICKUP === true ? "Requested" : "-"}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Pickup ID</span>
                                        </CCol>
                                        <CCol md="7">
                                            {ORDER_IS_PICKUP === "true" || ORDER_IS_PICKUP === true ?
                                                <span id="ModifiedSpan" style={{ fontSize: "14px", color: "#757575", backgroundColor: "rgb(173 166 166 / 30%)", borderRadius: 5, padding: "5px" }} onClick={() => {
                                                    ViewPickupDetails(ORDER_IS_PICKUP_ID);
                                                }}>{ORDER_IS_PICKUP_ID}</span>
                                                :
                                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>-</span>
                                            }
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Door Delivery</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_DOOR_DELIVERY === true || ORDER_DOOR_DELIVERY === true ? "Requested" : "-"}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Items</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ResponseData.length}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Quantity</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{TotalQuantity}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="5">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Count</span>
                                        </CCol>
                                        <CCol md="7">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{TotalCount}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                </CCol>
                                <CCol md="4">
                                    <CFormGroup row>
                                        <CCol md="7">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Order Amount</span>
                                        </CCol>
                                        <CCol md="5">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_AMOUNT}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    {SERVICE_TYPE_SURCHARGE == 0 || SERVICE_TYPE_SURCHARGE == "0" ? null :
                                        <React.Fragment>
                                            <CFormGroup row>
                                                <CCol md="7">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Surcharge ({SERVICE_TYPE_NAME}) @ {SERVICE_TYPE_SURCHARGE}% Extra</span>
                                                </CCol>
                                                <CCol md="5">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_TOTAL_SUR_CHARGE}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                        </React.Fragment>
                                    }
                                    {ORDER_DISCOUNT == 0 || ORDER_DISCOUNT == "0" ? null :
                                        <React.Fragment>
                                            <CFormGroup row>
                                                <CCol md="7">
                                                    <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Discount Amount</span>
                                                </CCol>
                                                <CCol md="5">
                                                    <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_DISCOUNT}</span>
                                                </CCol>
                                            </CFormGroup>
                                            <CDropdownDivider />
                                        </React.Fragment>
                                    }
                                    <CFormGroup row>
                                        <CCol md="7">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Order Amount</span>
                                        </CCol>
                                        <CCol md="5">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_TOTAL_ORDER_AMOUNT}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="7">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>CGST @ {SERVICE_CATEGORY_CGST}%</span>
                                        </CCol>
                                        <CCol md="5">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_CGST}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="7">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>SGST @ {SERVICE_CATEGORY_SGST}%</span>
                                        </CCol>
                                        <CCol md="5">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_SGST}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="7">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Total Invoice Amount</span>
                                        </CCol>
                                        <CCol md="5">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_TOTAL_INVOICE_VALUE}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="7">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Round off Amount</span>
                                        </CCol>
                                        <CCol md="5">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_ROUND_OFF_INVOICE}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                    <CFormGroup row>
                                        <CCol md="7">
                                            <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Grand Total Amount</span>
                                        </CCol>
                                        <CCol md="5">
                                            <span style={{ fontSize: "14px", color: "#757575" }}>{ORDER_GRAND_TOTAL_AMOUNT}</span>
                                        </CCol>
                                    </CFormGroup>
                                    <CDropdownDivider />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md="12">
                                    <h4 style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                        marginTop: "3%",
                                        marginBottom: "3%",
                                        textShadow: "0.5 0.5 0 #545454", color: "#0c8fcf"
                                    }} className="p1">Order Items</h4>
                                </CCol>
                                <CCol md="12">
                                    <CDataTable
                                        items={ResponseData}
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
                                    />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
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

export default OutletOrderItems;
