/* eslint-disable no-restricted-globals */
import React, { useState } from "react";
import axios from "axios";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
    CLink
} from "@coreui/react";
import { MyApiUrl, ViewImg } from "src/services/service";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import Swal from "sweetalert2";
import ReactSwitch from 'react-switch';
import "../../style.css";
import { useHistory } from "react-router-dom";

const EditPlaceOrder = (props) => {
    const {
        ORDER_INVOICE_NUMBER,
        ORDER_IS_PICKUP,
        ORDER_IS_PICKUP_ID,
        ORDER_DOOR_DELIVERY,
        ORDER_SERVICE_CATEGORY_FKID,
        ORDER_OUTLET_FKID,
        ORDER_SERVICE_TYPE_FKID,
        ORDER_DATE,
        ORDER_DUE_DATE,
        ORDER_PKID,
        ORDER_ORDER_NUMBER,
        ORDER_COUPON_FKID,
        ORDER_TOTAL_SUR_CHARGE,
        COUPONS_CODE,
        ORDER_CUSTOMER_FKID,
        COUPONS_PKID,
        COUPONS_TYPE_NAME,
        COUPONS_NAME,
        COUPONS_PRICE_OR_PERCENTAGE,
        COUPONS_DISCOUNT,
        COUPONS_ITEM_BASED,
        COUPONS_VALIDITY,
        COUPONS_VALIDITY_DATE,
        COUPONS_ACTIVE,
    } = props.location.state.data;
    console.log(props.location.state.data);
    const history = useHistory();
    const UserID = sessionStorage.getItem("UserID");
    const StoreID = ORDER_OUTLET_FKID;
    const UserName = sessionStorage.getItem("UserName");

    const [PickUp, setPickUp] = useState(ORDER_IS_PICKUP);
    const [DoorDelivery, setDoorDelivery] = useState(ORDER_DOOR_DELIVERY);
    const [block, setBlock] = useState(false);
    const [ServiceCatData, setServiceCatData] = useState([]);
    const [ServiceTypeData, setServiceTypeData] = useState([]);
    const [AdditionalRequestData, setAdditionalRequestData] = useState([]);
    const [ServiceType, setServiceType] = useState("");
    const [ServiceCategory, setServiceCategory] = useState(ORDER_SERVICE_CATEGORY_FKID);
    const [PickUpID, setPickUpID] = useState(ORDER_IS_PICKUP_ID);
    const [Customer, setCustomer] = useState(null);
    const [CustomerID, setCustomerID] = useState(null);
    const [CustomerDataforNew, setCustomerDataforNew] = useState(null);
    const [CustomerData, setCustomerData] = useState([]);
    const [CustomerList, setCustomerList] = useState([]);
    const [ItemList, setItemList] = useState([]);
    const [InvoiceNo, setInvoiceNo] = useState(ORDER_INVOICE_NUMBER);
    const [OrderNo, setOrderNo] = useState(ORDER_ORDER_NUMBER);
    const [CurrentDate, setCurrentDate] = useState(ORDER_DATE);
    const [DueDate, setDueDate] = useState(ORDER_DUE_DATE);
    const [CouponCode, setCouponCode] = useState(COUPONS_CODE);
    const [AppliedCouponDetails, setAppliedCouponDetails] = useState({
        "COUPONS_PKID": COUPONS_PKID,
        "COUPONS_TYPE_NAME": COUPONS_TYPE_NAME,
        "COUPONS_NAME": COUPONS_NAME,
        "COUPONS_CODE": COUPONS_CODE,
        "COUPONS_PRICE_OR_PERCENTAGE": COUPONS_PRICE_OR_PERCENTAGE,
        "COUPONS_DISCOUNT": COUPONS_DISCOUNT,
        "COUPONS_VALIDITY": COUPONS_VALIDITY,
        "COUPONS_VALIDITY_DATE": COUPONS_VALIDITY_DATE,
        "COUPONS_ACTIVE": COUPONS_ACTIVE,
        "COUPONS_ITEM_BASED": COUPONS_ITEM_BASED,
    });
    const [CouponApplied, setCouponApplied] = useState(ORDER_COUPON_FKID == null || ORDER_COUPON_FKID == "" ? false : true);
    const [CouponData, setCouponData] = useState([]);

    const [mainArray, setMainArray] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [ItemID, setItemID] = useState("");
    const [ItemPrice, setItemPrice] = useState(0);
    const [ItemQuantity, setItemQuantity] = useState(1);
    const [ItemCount, setItemCount] = useState(1);
    const [ItemDefects, setItemDefects] = useState("No Defects");
    const [ItemAdditionalRequestPrice, setItemAdditionalRequestPrice] = useState(0);
    const [AdditionalRequestSelected, setAdditionalRequestSelected] = useState("None");
    const [AdditionalRequestID, setAdditionalRequestID] = useState("");
    const [AdditionalRequest, setAdditionalRequest] = useState("None");
    const [CGST, setCGST] = useState(0);
    const [SGST, setSGST] = useState(0);
    const [Discount, setDiscount] = useState(0);
    const [Surcharge, setSurcharge] = useState(0);
    const [SurchargeName, setSurchargeName] = useState("");
    const [ServiceISCountBased, setServiceISCountBased] = useState(false);

    const ItemTotalAmount = (parseFloat(ItemPrice) + parseFloat(ItemAdditionalRequestPrice)) * parseFloat(ItemQuantity == "" || ItemQuantity == null ? 0 : ItemQuantity);

    const ItemFinalAmount = (parseFloat(ItemPrice) + parseFloat(ItemAdditionalRequestPrice)) * parseFloat(ItemQuantity == "" || ItemQuantity == null ? 0 : ItemQuantity);

    const paymentSummary = mainArray.reduce((summary, item) => {
        summary.totalOrderAmount += item.totalAmount;
        summary.surcharge = parseFloat((summary.totalOrderAmount * Surcharge) / 100);
        summary.totalItemQuantity += parseInt(item.itemQuantity);
        summary.totalItemCount += parseInt(item.itemCount);
        summary.discount = parseFloat(Discount); // add discount if any
        summary.totalItemDiscount += parseFloat(item.itemDiscount);
        summary.cgst += (item.totalAmount * CGST) / 100;
        summary.sgst += (item.totalAmount * SGST) / 100;
        summary.totalInvoiceValue = summary.totalOrderAmount + summary.surcharge - summary.discount - summary.totalItemDiscount + summary.cgst + summary.sgst;
        summary.roundOff = Math.round(summary.totalInvoiceValue) - summary.totalInvoiceValue;
        summary.grandTotalAmount = Math.round(summary.totalInvoiceValue);
        return summary;
    }, {
        totalOrderAmount: 0,
        surcharge: 0,
        totalItemQuantity: 0,
        totalItemCount: 0,
        discount: 0,
        totalItemDiscount: 0,
        cgst: 0,
        sgst: 0,
        totalInvoiceValue: 0,
        roundOff: 0,
        grandTotalAmount: 0,
    });

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

    const GetItemDetails = () => {
        axios.get(MyApiUrl + "AllOrderItemsForEditByOrderID/" + ORDER_PKID + "").then((response) => {
            setMainArray(response.data);
        })

    }

    const GetServiceCat = React.useCallback(() => {
        axios.get(MyApiUrl + "ServiceCategory").then((response) => {
            const ServiceCatOption = response.data.map((item) => (
                <option value={item.SERVICE_CATEGORY_PKID}>{item.SERVICE_CATEGORY_NAME}</option>
            ));
            setServiceCatData(ServiceCatOption);
            GetAdditionalRequest(ServiceCategory);
            getServiceISCountBased(ServiceCategory);
            getDueDateSC(ServiceCategory);
            setSelectedItem(null);
            getItems(ServiceCategory);
            setItemAdditionalRequestPrice(0);
            setAdditionalRequestSelected("None");
            setAdditionalRequest("None");
            setAdditionalRequestID("");
            setItemQuantity(1);
            setItemPrice(0);
            setItemDefects("No Defects");
            setMainArray([]);
            axios.get(MyApiUrl + "ServiceCategory/" + ServiceCategory + "").then((response) => {
                setCGST(response.data[0].SERVICE_CATEGORY_CGST);
                setSGST(response.data[0].SERVICE_CATEGORY_SGST);
            });
            GetServiceType1(ServiceCategory, ORDER_SERVICE_TYPE_FKID);
        });
    }, []);

    const GetServiceType1 = (CatId, TypeId) => {
        axios.get(MyApiUrl + "ServiceTypeByCategory/" + CatId + "").then((response) => {
            const ServiceOption = response.data.map((item) => (
                <option value={item.SERVICE_TYPE_PKID}>{item.SERVICE_TYPE_NAME}</option>
            ));
            setServiceTypeData(ServiceOption);
            getDueDateST(TypeId);
            setSelectedItem(null);
            setItemAdditionalRequestPrice(0);
            setAdditionalRequestSelected("None");
            setAdditionalRequest("None");
            setAdditionalRequestID("");
            setItemQuantity(1);
            setItemPrice(0);
            setItemDefects("No Defects");
            setMainArray([]);
            setServiceType(TypeId);
            getSurcharge(TypeId);
            GetItemDetails();
        });
    };

    const GetServiceType = async (CatId) => {
        await axios.get(MyApiUrl + "ServiceTypeByCategory/" + CatId + "").then((response) => {
            const ServiceOption = response.data.map((item) => (
                <option value={item.SERVICE_TYPE_PKID}>{item.SERVICE_TYPE_NAME}</option>
            ));
            setServiceTypeData(ServiceOption);
        });
    };

    const getCustomerDetails = async (id) => {
        await axios.get(MyApiUrl + "GetCutomerDetailsByID/" + id + "").then((response) => {
            setCustomerData(response.data);
            GetAllCoupons(id);
        });
    };

    const GetAdditionalRequest = async (CatId) => {
        await axios.get(MyApiUrl + "AdditionalServiceForPlaceOrder/" + CatId + "/" + StoreID + "").then((response) => {
            const ServiceOption = response.data.map((item) => (
                <option value={item.ADDITIONAL_SERVICE_PKID + "/" + item.ItemPrice + "/" + item.ADDITIONAL_SERVICE_NAME} >{item.ADDITIONAL_SERVICE_NAME} / Rs.{item.ItemPrice}</option>
            ));
            setAdditionalRequestData(ServiceOption);
        });
    };

    const getCustomer = () => {
        axios.get(MyApiUrl + "CustomersByOutlet/" + StoreID + "").then((response) => {
            setCustomerList(response.data);
            const selectedCustomer = response.data.find(customer => customer.id == ORDER_CUSTOMER_FKID);
            setCustomer(selectedCustomer);
            getCustomerDetails(ORDER_CUSTOMER_FKID);
            setCustomerID(ORDER_CUSTOMER_FKID);
            GetAllCoupons(ORDER_CUSTOMER_FKID);
        });
    };

    const GetAllCoupons = async (id) => {
        await axios.get(MyApiUrl + "CouponByOutlet/" + StoreID + "/" + id + "").then((response) => {
            setCouponData(response.data);
        });
    }

    const getItems = async (CatID) => {
        await axios.get(MyApiUrl + "ItemsForPlaceOrder/" + CatID + "/" + StoreID + "").then((response) => {
            setItemList(response.data);
        });
    };
    const getDueDateST = async (TypeID) => {
        await axios.get(MyApiUrl + "GetDueDate/" + ServiceCategory + "/" + TypeID + "/" + StoreID + "").then((response) => {
            if (response.data.length > 0) {
                setDueDate(response.data[0].DueDate);
            } else {
                setDueDate("");
            }
        });
    };

    const getSurcharge = async (TypeID) => {
        await axios.get(MyApiUrl + "getAllServiceTypeByID/" + TypeID).then((response) => {
            if (response.data.length > 0) {
                setSurcharge(parseFloat(response.data[0].SERVICE_TYPE_SURCHARGE));
                setSurchargeName(response.data[0].SERVICE_TYPE_NAME);
            } else {
                setSurcharge(0);
                setSurchargeName("");
            }
        });
    };

    const getDueDateSC = async (CatID) => {
        if (ServiceType == "-1" || ServiceType == null) {
            return;
        }
        await axios.get(MyApiUrl + "GetDueDate/" + CatID + "/" + ServiceType + "/" + StoreID + "").then((response) => {
            if (response.data.length > 0) {
                setDueDate(response.data[0].DueDate);
            } else {
                setDueDate("");
            }
        });
    };

    const getDueDate = async (CatID, TypeID) => {
        if (ServiceType == "-1" || ServiceType == null) {
            return;
        }
        await axios.get(MyApiUrl + "GetDueDate/" + CatID + "/" + TypeID + "/" + StoreID + "").then((response) => {
            if (response.data.length > 0) {
                setDueDate(response.data[0].DueDate);
            } else {
                setDueDate("");
            }
        });
    };

    React.useEffect(() => {
        GetServiceCat();
        getCustomer();
    }, []);

    const ViewCustomerDetails = () => {
        setBlock(!block);
    }

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', { month: 'long' });
    }

    const SplitDateforCustomer = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + " " + getMonthName(OrderDates[1]) + ", " + OrderDates[0];
        return FinalDate;
    }

    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }

    const addItems = () => {
        if (selectedItem == null || selectedItem == "") {
            Toast.fire({
                icon: "warning",
                title: "Please Choose Item 1st!",
            });
        }
        else if (ItemQuantity == "" || ItemQuantity == null) {
            Toast.fire({
                icon: "warning",
                title: "Please enter quantity!",
            });
        }
        else if (ItemQuantity <= 0) {
            Toast.fire({
                icon: "warning",
                title: "Please enter quantity more than zero!",
            });
        }
        else if (ItemCount == "" || ItemCount == null) {
            Toast.fire({
                icon: "warning",
                title: "Please enter Count!",
            });
        }
        else if (ItemCount <= 0) {
            Toast.fire({
                icon: "warning",
                title: "Please enter count more than zero!",
            });
        }
        else {
            const itemList = {
                'itemID': ItemID,
                'itemName': selectedItem.label,
                'itemAmount': ItemPrice,
                'AdditionalRequestID': AdditionalRequestID == "None" ? 0 : AdditionalRequestID,
                'AdditionalRequest': AdditionalRequest,
                'AdditionalRequestAmount': ItemAdditionalRequestPrice,
                'itemQuantity': ItemQuantity,
                'itemCount': ItemCount,
                'itemDefects': ItemDefects,
                'totalAmount': ItemTotalAmount,
                'itemDiscount': 0,
                'itemFinalAmount': ItemFinalAmount,
            };

            const existingItemIndex = mainArray.findIndex(item => item.itemID === itemList.itemID);
            if (existingItemIndex == -1 || existingItemIndex == "-1") {
                let arrLength = mainArray.length;
                setMainArray((prevArray) => [...prevArray, itemList]);
                if (CouponApplied == true) {
                    console.log(AppliedCouponDetails.COUPONS_ITEM_BASED);
                    if (AppliedCouponDetails.COUPONS_ITEM_BASED == true || AppliedCouponDetails.COUPONS_ITEM_BASED == "true") {
                        let arr = mainArray;
                        if (mainArray.length === arrLength) {
                            arr.push(itemList);
                            calculateCoupon(arr);
                        }
                        else {
                            calculateCoupon(mainArray);
                        }
                    }
                    else {
                        let arr = mainArray;
                        if (mainArray.length === arrLength) {
                            arr.push(itemList);
                            calculateCoupon(arr);
                        }
                        else {
                            calculateCoupon(mainArray);
                        }
                    }
                }
                setSelectedItem(null);
                setItemAdditionalRequestPrice(0);
                setAdditionalRequest("None");
                setAdditionalRequestSelected("None");
                setAdditionalRequestID("");
                setItemQuantity(1);
                setItemCount(1);
                setItemPrice(0);
                setItemPrice(0);
                setItemDefects("No Defects");
            }
            else {
                Swal.fire({
                    title: "Item Already Exist!",
                    text: "If you want to edit item please delete and add new item.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    }

    const removeArrayItem = (itemID) => {
        let newArr = mainArray.filter((x) => x.itemID !== itemID);
        setMainArray(newArr);
        if (newArr.length > 0) {
            if (CouponApplied == true) {
                if (AppliedCouponDetails.COUPONS_ITEM_BASED == true || AppliedCouponDetails.COUPONS_ITEM_BASED == "true") {
                    // calculateItemsCoupon();
                }
                else {
                    calculateCoupon(newArr);
                }
            }
        }
        else {
            if (CouponApplied == true) {
                if (AppliedCouponDetails.COUPONS_ITEM_BASED == true || AppliedCouponDetails.COUPONS_ITEM_BASED == "true") {
                    // calculateItemsCoupon();
                }
                else {
                    removeCoupon();
                }
            }
        }
    }

    const applyCoupon = async () => {
        if (CouponCode == null || CouponCode == "") {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Coupon Code!",
            });
        }
        else {
            const desiredCoupon = CouponData.find(coupon => coupon.COUPONS_CODE === CouponCode);
            console.log(desiredCoupon);
            if (desiredCoupon == undefined) {
                Toast.fire({
                    icon: "error",
                    title: "Please Enter Valid Coupon Code!",
                });
            }
            else {
                setAppliedCouponDetails(desiredCoupon);
                setCouponApplied(true);
                if (desiredCoupon.COUPONS_ITEM_BASED == true || desiredCoupon.COUPONS_ITEM_BASED == "true") {
                    let arr = [];
                    axios.get(MyApiUrl + "GetCouponItemListByCouponID/" + desiredCoupon.COUPONS_PKID + "").then((response) => {
                        response.data.map((mainitem) => {
                            let updatedData;
                            if (arr.length > 0) {
                                updatedData = arr.map((item) => {
                                    if (parseInt(item.itemID) === parseInt(mainitem.ITEM_COUPONS_ITEM_FKID)) {
                                        if (item.itemDiscount == 0) {
                                            const Discount = calculateDiscount(item, desiredCoupon);
                                            return {
                                                ...item,
                                                itemDiscount: Discount,
                                                itemFinalAmount: parseFloat(item.itemFinalAmount) - parseFloat(Discount),
                                            };
                                        }
                                    }
                                    return item;
                                });
                            }
                            else {
                                updatedData = mainArray.map((item) => {
                                    if (parseInt(item.itemID) === parseInt(mainitem.ITEM_COUPONS_ITEM_FKID)) {
                                        if (item.itemDiscount == 0) {
                                            const Discount = calculateDiscount(item, desiredCoupon);
                                            return {
                                                ...item,
                                                itemDiscount: Discount,
                                                itemFinalAmount: parseFloat(item.itemFinalAmount) - parseFloat(Discount),
                                            };
                                        }
                                    }
                                    return item;
                                });
                            }
                            arr = updatedData;
                            setMainArray(updatedData);
                        });
                    });
                }
                else {
                    if (desiredCoupon.COUPONS_PRICE_OR_PERCENTAGE === 'Price') {
                        setDiscount(desiredCoupon.COUPONS_DISCOUNT);
                    } else {
                        var DiscountAmount = (parseFloat(paymentSummary.totalOrderAmount) / 100) * parseFloat(desiredCoupon.COUPONS_DISCOUNT)
                        setDiscount(DiscountAmount);
                    }
                }
            }
        }
    }
    const calculateDiscount = (item, desiredCoupon) => {
        var Discount = 0;
        if (desiredCoupon.COUPONS_PRICE_OR_PERCENTAGE === 'Price') {
            Discount = desiredCoupon.COUPONS_DISCOUNT;
        } else {
            var DiscountAmount = (parseFloat(item.itemFinalAmount) / 100) * parseFloat(desiredCoupon.COUPONS_DISCOUNT);
            Discount = DiscountAmount;
        }
        return Discount;
    }

    const calculateCoupon = (mainArray) => {
        if (CouponApplied == true) {
            if (AppliedCouponDetails.COUPONS_ITEM_BASED == true || AppliedCouponDetails.COUPONS_ITEM_BASED == "true") {
                let arr = [];
                axios.get(MyApiUrl + "GetCouponItemListByCouponID/" + AppliedCouponDetails.COUPONS_PKID + "").then((response) => {
                    console.log(mainArray);
                    response.data.map((mainitem) => {
                        let updatedData;
                        if (arr.length > 0) {
                            updatedData = arr.map((item) => {
                                if (parseInt(item.itemID) === parseInt(mainitem.ITEM_COUPONS_ITEM_FKID)) {
                                    if (item.itemDiscount == 0) {
                                        const Discount = calculateDiscount(item, AppliedCouponDetails);
                                        return {
                                            ...item,
                                            itemDiscount: Discount,
                                            itemFinalAmount: parseFloat(item.itemFinalAmount) - parseFloat(Discount),
                                        };
                                    }
                                }
                                return item;
                            });
                        }
                        else {
                            updatedData = mainArray.map((item) => {
                                if (parseInt(item.itemID) === parseInt(mainitem.ITEM_COUPONS_ITEM_FKID)) {
                                    if (item.itemDiscount == 0) {
                                        const Discount = calculateDiscount(item, AppliedCouponDetails);
                                        return {
                                            ...item,
                                            itemDiscount: Discount,
                                            itemFinalAmount: parseFloat(item.itemFinalAmount) - parseFloat(Discount),
                                        };
                                    }
                                }
                                return item;
                            });
                        }
                        arr = updatedData;
                        setMainArray(updatedData);
                    });
                });
            }
            else {
                console.log(paymentSummary.totalOrderAmount);
                if (AppliedCouponDetails.COUPONS_PRICE_OR_PERCENTAGE === 'Price') {
                    setDiscount(AppliedCouponDetails.COUPONS_DISCOUNT);
                } else {
                    let totalOrderAmount = 0;
                    mainArray.map((item) => {
                        totalOrderAmount = totalOrderAmount + item.itemFinalAmount;
                    });
                    var DiscountAmount = (parseFloat(totalOrderAmount) / 100) * parseFloat(AppliedCouponDetails.COUPONS_DISCOUNT)
                    setDiscount(DiscountAmount);
                }
            }
        }
    }

    const removeCoupon = () => {
        if (AppliedCouponDetails.COUPONS_ITEM_BASED == true || AppliedCouponDetails.COUPONS_ITEM_BASED == "true") {
            let arr = [];
            axios.get(MyApiUrl + "GetCouponItemListByCouponID/" + AppliedCouponDetails.COUPONS_PKID + "").then((response) => {
                response.data.map((mainitem) => {
                    let updatedData;
                    if (arr.length > 0) {
                        updatedData = arr.map((item) => {
                            if (parseInt(item.itemID) === parseInt(mainitem.ITEM_COUPONS_ITEM_FKID)) {
                                if (item.itemDiscount == 0) {
                                    const Discount = calculateDiscount(item, AppliedCouponDetails);
                                    return {
                                        ...item,
                                    };
                                }
                                else {
                                    const Discount = calculateDiscount(item, AppliedCouponDetails);
                                    return {
                                        ...item,
                                        itemDiscount: 0,
                                        itemFinalAmount: parseFloat(item.itemFinalAmount) + parseFloat(Discount),
                                    };
                                }
                            }
                            return item;
                        });
                    }
                    else {
                        updatedData = mainArray.map((item) => {
                            if (parseInt(item.itemID) === parseInt(mainitem.ITEM_COUPONS_ITEM_FKID)) {
                                const Discount = calculateDiscount(item, AppliedCouponDetails);
                                return {
                                    ...item,
                                    itemDiscount: 0,
                                    itemFinalAmount: parseFloat(item.itemFinalAmount) + parseFloat(Discount),
                                };
                            }
                            return item;
                        });
                    }
                    arr = updatedData;
                    setMainArray(updatedData);
                });
            });
        }
        setCouponApplied(false);
        setCouponCode("");
        setDiscount(0);
        setAppliedCouponDetails({});
    }

    const placeOrder = () => {
        document.getElementById("divLoading").className = "show";
        if (PickUp == true) {
            if (PickUpID == "" || PickUpID == null) {
                document.getElementById("divLoading").className = "hide";
                Toast.fire({
                    icon: "warning",
                    title: "Please Enter Pick-Up Code!",
                });
                return;
            }
        }
        if (ServiceType == "-1") {
            document.getElementById("divLoading").className = "hide";
            Toast.fire({
                icon: "warning",
                title: "Please Select Service Type!",
            });
        }
        else {
            var obj = {
                ORDER_INVOICE_NUMBER: InvoiceNo,
                ORDER_IS_PICKUP: PickUp,
                ORDER_IS_PICKUP_ID: PickUpID,
                ORDER_DOOR_DELIVERY: DoorDelivery,
                ORDER_SERVICE_CATEGORY_FKID: ServiceCategory,
                ORDER_SERVICE_TYPE_FKID: ServiceType,
                ORDER_CUSTOMER_FKID: CustomerID,
                ORDER_DUE_DATE: DueDate,
                ORDER_ITEMS: mainArray,
                ORDER_COUPONS: AppliedCouponDetails,
                ORDER_AMOUNT: paymentSummary.totalOrderAmount.toFixed(2),
                ORDER_DISCOUNT: (paymentSummary.discount + paymentSummary.totalItemDiscount).toFixed(2),
                ORDER_TOTAL_ORDER_AMOUNT: (parseFloat(paymentSummary.totalOrderAmount) + parseFloat(paymentSummary.surcharge) - parseFloat(paymentSummary.discount) - parseFloat(paymentSummary.totalItemDiscount)).toFixed(2),
                ORDER_CGST: paymentSummary.cgst.toFixed(2),
                ORDER_SGST: paymentSummary.sgst.toFixed(2),
                ORDER_TOTAL_INVOICE_VALUE: paymentSummary.totalInvoiceValue.toFixed(2),
                ORDER_ROUND_OFF_INVOICE: paymentSummary.roundOff.toFixed(2),
                ORDER_GRAND_TOTAL_AMOUNT: paymentSummary.grandTotalAmount,
                ORDER_ORDER_NUMBER: OrderNo,
                ORDER_OUTLET_FKID: StoreID,
                ORDER_STAFF_FKID: UserID,
                ORDER_TOTAL_SUR_CHARGE: paymentSummary.surcharge.toFixed(2),
                ORDER_MODIFIED_BY: UserName == "Admin" || UserName === "Admin" ? "Admin" : "Manager",
                ORDER_MODIFIED_BY_FKID: UserName == "Admin" || UserName === "Admin" ? 0 : UserID,
            }

            axios.put(MyApiUrl + "OutletPlaceOrder/" + ORDER_PKID + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Order Updated Successful!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    history.push("/EditOrders");
                } else {
                    Swal.fire({
                        title: "Failed To Place The Order!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });
        }
    }

    const getServiceISCountBased = async (catID) => {
        await axios.get(MyApiUrl + "ServiceCategory/" + catID).then((response) => {
            if (response.data.length > 0) {
                setServiceISCountBased(response.data[0].SERVICE_CATEGORY_ORDER_COUNT);
            } else {
                setServiceISCountBased(false);
            }
        });
    }

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
            <h1 id="ccmaster">Place New Order</h1>
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
                                <CFormGroup row>
                                    <CCol lg="12" md="12">
                                        {PickUp == true || PickUp == "true" ?
                                            <CRow>
                                                <CCol lg="3">
                                                    <span style={{
                                                        fontSize: 16,
                                                        fontFamily: "fangsong",
                                                        fontWeight: "bold"
                                                    }}>Invoice No. : {InvoiceNo}</span>
                                                </CCol>
                                                <CCol lg="2">
                                                    <CRow>
                                                        <CCol md="2" style={{ top: "-2px" }}>
                                                            <ReactSwitch
                                                                checked={PickUp}
                                                                onChange={(event) => {
                                                                    setPickUp(event);
                                                                }}
                                                            />
                                                        </CCol>
                                                        <CCol md="9" style={{ left: "23%" }}>
                                                            <span style={{
                                                                fontSize: 16,
                                                                fontFamily: "fangsong",
                                                                fontWeight: "bold",
                                                            }}>Pick-Up</span>
                                                        </CCol>
                                                    </CRow>
                                                </CCol>
                                                <CCol lg="2" style={{ top: -5 }}>
                                                    <CInput
                                                        id="text-input"
                                                        name="text-input"
                                                        placeholder="Enter Pick-Up Code"
                                                        value={PickUpID}
                                                        onChange={(event) => {
                                                            setPickUpID(event.target.value);
                                                        }}
                                                    />
                                                </CCol>
                                                <CCol lg="3">
                                                    <CRow>
                                                        <CCol md="2" style={{ top: "-2px" }}>
                                                            <ReactSwitch
                                                                checked={DoorDelivery}
                                                                onChange={(event) => {
                                                                    setDoorDelivery(event);
                                                                }}
                                                            />
                                                        </CCol>
                                                        <CCol md="9" style={{ left: "10%" }}>
                                                            <span style={{
                                                                fontSize: 16,
                                                                fontFamily: "fangsong",
                                                                fontWeight: "bold",
                                                            }}>Door Delivery</span>
                                                        </CCol>
                                                    </CRow>
                                                </CCol>
                                                <CCol lg="2">
                                                    <span style={{
                                                        float: "right",
                                                        fontSize: 16,
                                                        fontFamily: "fangsong",
                                                        fontWeight: "bold"
                                                    }}>
                                                        Ordered Date : {SplitDate(CurrentDate)}
                                                    </span>
                                                </CCol>
                                            </CRow>
                                            :
                                            <CRow>
                                                <CCol lg="3">
                                                    <span style={{
                                                        fontSize: 16,
                                                        fontFamily: "fangsong",
                                                        fontWeight: "bold"
                                                    }}>Invoice No. : {InvoiceNo}</span>
                                                </CCol>
                                                <CCol lg="3">
                                                    <CRow>
                                                        <CCol md="2" style={{ top: "-2px" }}>
                                                            <ReactSwitch
                                                                checked={PickUp}
                                                                onChange={(event) => {
                                                                    setPickUp(event);
                                                                }}
                                                            />
                                                        </CCol>
                                                        <CCol md="9" style={{ left: "10%" }}>
                                                            <span style={{
                                                                fontSize: 16,
                                                                fontFamily: "fangsong",
                                                                fontWeight: "bold",
                                                            }}>Pick-Up</span>
                                                        </CCol>
                                                    </CRow>
                                                </CCol>
                                                <CCol lg="3">
                                                    <CRow>
                                                        <CCol md="2" style={{ top: "-2px" }}>
                                                            <ReactSwitch
                                                                checked={DoorDelivery}
                                                                onChange={(event) => {
                                                                    setDoorDelivery(event);
                                                                }}
                                                            />
                                                        </CCol>
                                                        <CCol md="9" style={{ left: "10%" }}>
                                                            <span style={{
                                                                fontSize: 16,
                                                                fontFamily: "fangsong",
                                                                fontWeight: "bold",
                                                            }}>Door Delivery</span>
                                                        </CCol>
                                                    </CRow>
                                                </CCol>
                                                <CCol lg="3">
                                                    <span style={{
                                                        float: "right",
                                                        fontSize: 16,
                                                        fontFamily: "fangsong",
                                                        fontWeight: "bold"
                                                    }}>
                                                        Ordered Date : {SplitDate(CurrentDate)}
                                                    </span>
                                                </CCol>
                                            </CRow>
                                        }
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                <CFormGroup row>
                                    <CCol lg="3" md="12">
                                        <CLabel>Service Category <span style={{ color: "red" }}>*</span></CLabel>
                                        <CSelect
                                            custom
                                            name="ProductCategory"
                                            id="ProductCategory"
                                            value={ServiceCategory}
                                            onChange={(event) => {
                                                if (event.target.value == "-1" || event.target.value == -1) {
                                                    setServiceISCountBased(false);
                                                    removeCoupon();
                                                    setServiceCategory(event.target.value);
                                                    setServiceType("-1");
                                                    setServiceTypeData([]);
                                                    setAdditionalRequestData([]);
                                                    setDueDate("");
                                                    setSelectedItem(null);
                                                    setItemList([]);
                                                    setItemAdditionalRequestPrice(0);
                                                    setAdditionalRequestSelected("None");
                                                    setAdditionalRequest("None");
                                                    setAdditionalRequestID("");
                                                    setItemQuantity(1);
                                                    setItemCount(1);
                                                    setItemPrice(0);
                                                    setItemDefects("No Defects");
                                                    setMainArray([]);
                                                    setCGST("");
                                                    setSGST("");
                                                }
                                                else {
                                                    setServiceISCountBased(false);
                                                    getServiceISCountBased(event.target.value);
                                                    removeCoupon();
                                                    setServiceCategory(event.target.value);
                                                    setServiceType("-1");
                                                    GetServiceType(event.target.value);
                                                    GetAdditionalRequest(event.target.value);
                                                    getDueDateSC(event.target.value);
                                                    setSelectedItem(null);
                                                    getItems(event.target.value);
                                                    setItemAdditionalRequestPrice(0);
                                                    setAdditionalRequestSelected("None");
                                                    setAdditionalRequest("None");
                                                    setAdditionalRequestID("");
                                                    setItemQuantity(1);
                                                    setItemCount(1);
                                                    setItemPrice(0);
                                                    setItemDefects("No Defects");
                                                    setMainArray([]);
                                                    axios.get(MyApiUrl + "ServiceCategory/" + event.target.value + "").then((response) => {
                                                        setCGST(response.data[0].SERVICE_CATEGORY_CGST);
                                                        setSGST(response.data[0].SERVICE_CATEGORY_SGST);
                                                    });
                                                }
                                            }
                                            }
                                        >
                                            <option value="-1">Select Service Category</option>
                                            {ServiceCatData}
                                        </CSelect>
                                    </CCol>
                                    <CCol lg="3" md="12">
                                        <CLabel>Service Type <span style={{ color: "red" }}>*</span></CLabel>
                                        <CSelect
                                            custom
                                            name="ProductCategory"
                                            id="ProductCategory"
                                            value={ServiceType}
                                            onChange={(event) => {
                                                if (event.target.value == "-1") {
                                                    setServiceType(event.target.value);
                                                    setDueDate("");
                                                    setSurcharge(0);
                                                    setSurchargeName("");
                                                }
                                                else {
                                                    setServiceType(event.target.value);
                                                    getDueDateST(event.target.value);
                                                    setSurcharge(0);
                                                    getSurcharge(event.target.value);
                                                }
                                            }}
                                        >
                                            <option value="-1">Select Service Type</option>
                                            {ServiceTypeData}
                                        </CSelect>
                                    </CCol>
                                    {CustomerList.length > 0 ?
                                        <CCol lg="3" md="12">
                                            <CLabel>Customer Name/Phone No. <span style={{ color: "red" }}>*</span></CLabel>
                                            <Autocomplete
                                                value={Customer}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={CustomerList}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} />}
                                                onChange={(event, newValue) => {
                                                    if (newValue) {
                                                        setCustomerID(newValue.id);
                                                        getCustomerDetails(newValue.id);
                                                    }
                                                    else {
                                                        setCustomerID();
                                                        setCustomerData([]);
                                                        removeCoupon();
                                                        setCouponData([]);
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    setCustomerDataforNew(newInputValue);
                                                }}
                                                getOptionLabel={(option) => option.label}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                noOptionsText={
                                                    <CLink style={{ textDecoration: 'none', color: 'red', fontSize: "13px" }}
                                                        onClick={() =>
                                                            history.push("/AddNewCustomer", {
                                                                data: CustomerDataforNew,
                                                            })
                                                        }>
                                                        Create New Customer
                                                    </CLink>
                                                }
                                            />
                                        </CCol>
                                        : null}
                                    <CCol lg="3" md="12">
                                        <CLabel>Due Date</CLabel>
                                        <CInput
                                            id="text-input"
                                            name="text-input"
                                            placeholder="Due Date"
                                            value={DueDate == "" || DueDate == null ? "" : SplitDate(DueDate)}
                                            disabled
                                        />
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                                {ItemList.length > 0 ?
                                    <CRow row>
                                        <CCol md="12" lg="12">
                                            <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                                <table className="table table-responsive-md" style={{ width: "100%" }}>
                                                    <thead>
                                                        <th style={{ width: "20%" }}>Item</th>
                                                        <th style={{ width: "8%" }}>Amount</th>
                                                        <th style={{ width: "20%" }}>Additional Request</th>
                                                        <th style={{ width: "8%" }}>Quantity</th>
                                                        <th style={{ width: "8%" }}>Count</th>
                                                        <th style={{ width: "20%" }}>Defects</th>
                                                        <th style={{ width: "8%" }}>Final Amount</th>
                                                        <th style={{ width: "8%" }}>Action</th>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <Autocomplete
                                                                    disablePortal
                                                                    id="combo-box-demo"
                                                                    options={ItemList}
                                                                    sx={{ width: 300 }}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                    onChange={(event, newValue) => {
                                                                        if (newValue) {
                                                                            setSelectedItem(newValue);
                                                                            setItemID(newValue.id);
                                                                            setItemPrice(newValue.Price);
                                                                        }
                                                                        else {
                                                                            setSelectedItem(null);
                                                                            setItemID('');
                                                                            setItemPrice(0);
                                                                        }
                                                                    }}
                                                                    value={selectedItem}
                                                                />
                                                            </td>
                                                            <td>
                                                                <CInput
                                                                    id="text-input"
                                                                    name="text-input"
                                                                    placeholder="Amount"
                                                                    value={ItemPrice == 0 ? "" : ItemPrice}
                                                                    disabled
                                                                />
                                                            </td>
                                                            <td>
                                                                <CSelect
                                                                    custom
                                                                    name="ProductCategory"
                                                                    id="ProductCategory"
                                                                    value={AdditionalRequestSelected}
                                                                    onChange={(event) => {
                                                                        let value = event.target.value;
                                                                        if (ItemPrice == 0) {
                                                                            Toast.fire({
                                                                                icon: "warning",
                                                                                title: "Please Choose Item 1st!",
                                                                            });
                                                                        }
                                                                        else {
                                                                            if (value == "None") {
                                                                                setAdditionalRequestSelected(value);
                                                                                setItemAdditionalRequestPrice(0);
                                                                                setAdditionalRequest("None");
                                                                                setAdditionalRequestID("None");
                                                                            }
                                                                            else {
                                                                                let splitValue = value.split("/");
                                                                                setAdditionalRequestSelected(value);
                                                                                setAdditionalRequest(splitValue[2]);
                                                                                setAdditionalRequestID(splitValue[0]);
                                                                                setItemAdditionalRequestPrice(splitValue[1]);
                                                                            }
                                                                        }
                                                                    }}
                                                                    style={{ width: "100%" }}
                                                                >
                                                                    <option value="None">None</option>
                                                                    {AdditionalRequestData}
                                                                </CSelect>
                                                            </td>
                                                            <td>
                                                                <CInput
                                                                    id="text-input"
                                                                    name="text-input"
                                                                    placeholder="Quantity"
                                                                    value={ItemQuantity}
                                                                    onChange={(event) => {
                                                                        let value = event.target.value;
                                                                        value = value.replace(/[^0-9]/gi, "");
                                                                        setItemQuantity(value);
                                                                        if (ServiceISCountBased == false) {
                                                                            setItemCount(value);
                                                                        }
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <CInput
                                                                    id="text-input"
                                                                    name="text-input"
                                                                    placeholder="Count"
                                                                    value={ItemCount}
                                                                    onChange={(event) => {
                                                                        let value = event.target.value;
                                                                        value = value.replace(/[^0-9]/gi, "");
                                                                        setItemCount(value);
                                                                    }}
                                                                    disabled={ServiceISCountBased == true ? false : true}
                                                                />
                                                            </td>
                                                            <td>
                                                                <CSelect
                                                                    custom
                                                                    name="ProductCategory"
                                                                    id="ProductCategory"
                                                                    value={ItemDefects}
                                                                    onChange={(event) => {
                                                                        setItemDefects(event.target.value);
                                                                    }}
                                                                >
                                                                    <option value="No Defects">No Defects</option>
                                                                    <option value="Broken Button">Broken Button</option>
                                                                    <option value="Stain">Stain</option>
                                                                    <option value="Drits">Drits</option>
                                                                </CSelect>
                                                            </td>
                                                            <td>
                                                                <CInput
                                                                    id="text-input"
                                                                    name="text-input"
                                                                    placeholder="Final Amount"
                                                                    disabled
                                                                    value={ItemFinalAmount}
                                                                />
                                                            </td>
                                                            <td>
                                                                <CButton type="button"
                                                                    className="btn btn-success" style={{ fontSize: "12px" }}
                                                                    onClick={addItems}
                                                                >
                                                                    ADD
                                                                </CButton>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </CCard>
                                        </CCol>
                                    </CRow>
                                    : null}
                                {mainArray.length > 0 ?
                                    <CRow row>
                                        <CCol md="12" lg="12">
                                            <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                                <table className="table table-hover table-bordered table-responsive-md" style={{ width: "100%" }} id="OutletPlaceOrderTable">
                                                    <thead>
                                                        <th>Item</th>
                                                        <th>Amount</th>
                                                        <th>Additional Request</th>
                                                        <th>Quantity</th>
                                                        <th>Count</th>
                                                        <th>Defects</th>
                                                        <th>Total Amount</th>
                                                        <th>Discount</th>
                                                        <th>Final Amount</th>
                                                        <th>Action</th>
                                                    </thead>
                                                    <tbody>
                                                        {mainArray.map((item, index) => {
                                                            return (
                                                                <tr>
                                                                    <td>{item.itemName}</td>
                                                                    <td>{item.itemAmount}</td>
                                                                    <td>{item.AdditionalRequest}/₹{item.AdditionalRequestAmount}</td>
                                                                    <td>{item.itemQuantity}</td>
                                                                    <td>{item.itemCount}</td>
                                                                    <td>{item.itemDefects}</td>
                                                                    <td>{item.totalAmount}</td>
                                                                    <td>{item.itemDiscount}</td>
                                                                    <td>{item.itemFinalAmount}</td>
                                                                    <td>
                                                                        <CButton
                                                                            size="sm"
                                                                            id="war-btn1"
                                                                            onClick={() => {
                                                                                removeArrayItem(item.itemID);
                                                                            }}
                                                                        >
                                                                            <DeleteSharpIcon />
                                                                        </CButton>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </CCard>
                                        </CCol>
                                    </CRow>
                                    : null}

                                {mainArray.length > 0 ?
                                    <CRow row>
                                        <CCol lg="6" md="12">
                                            {CouponData.length > 0 ?
                                                <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                                    <CCardHeader>Available Coupons</CCardHeader>
                                                    <table className="table table-responsive-md table-bordered table-hover" id="OutletPlaceOrderCouponTable">
                                                        <thead>
                                                            <th width="25%">Name</th>
                                                            <th width="25%">Coupon Code</th>
                                                            <th width="25%">Coupon Type</th>
                                                            <th width="25%">Discount</th>
                                                        </thead>
                                                        <tbody>
                                                            {CouponData.map((item) => {
                                                                return (
                                                                    <React.Fragment>
                                                                        {CouponApplied == false ?
                                                                            <tr onClick={() => {
                                                                                setCouponCode(item.COUPONS_CODE);
                                                                            }}
                                                                                style={{ cursor: "pointer" }}
                                                                            >
                                                                                <td>{item.COUPONS_NAME}</td>
                                                                                <td>{item.COUPONS_CODE}</td>
                                                                                <td>{item.COUPON_TYPE_DISPLAY}</td>
                                                                                <td>
                                                                                    {item.COUPONS_PRICE_OR_PERCENTAGE == "Percentage" ?
                                                                                        item.COUPONS_DISCOUNT + "%"
                                                                                        :
                                                                                        "₹" + item.COUPONS_DISCOUNT
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                            :
                                                                            <tr>
                                                                                <td>{item.COUPONS_NAME}</td>
                                                                                <td>{item.COUPONS_CODE}</td>
                                                                                <td>{item.COUPON_TYPE_DISPLAY}</td>
                                                                                <td>
                                                                                    {item.COUPONS_PRICE_OR_PERCENTAGE == "Percentage" ?
                                                                                        item.COUPONS_DISCOUNT + "%"
                                                                                        :
                                                                                        "₹" + item.COUPONS_DISCOUNT
                                                                                    }
                                                                                </td>
                                                                            </tr>

                                                                        }
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </CCard>
                                                :
                                                null
                                            }
                                            <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                                <CCardHeader>Apply Coupons</CCardHeader>
                                                <CCardBody>
                                                    <CRow>
                                                        <CCol md="12">
                                                            <CLabel>Coupon Code <span style={{ color: "red" }}>*</span></CLabel>
                                                            {CouponApplied == false ?
                                                                <CInput
                                                                    id="text-input"
                                                                    name="text-input"
                                                                    placeholder="Enter Coupon Code"
                                                                    value={CouponCode}
                                                                    onChange={(event) => {
                                                                        setCouponCode(event.target.value);
                                                                    }}
                                                                />
                                                                :
                                                                <CInput
                                                                    id="text-input"
                                                                    name="text-input"
                                                                    placeholder="Enter Coupon Code"
                                                                    value={CouponCode}
                                                                    readOnly={true}
                                                                />
                                                            }
                                                        </CCol>
                                                    </CRow>
                                                    <CRow style={{ marginTop: 10 }}>
                                                        <CCol md="12">
                                                            {CouponApplied == false ?
                                                                <CButton type="button"
                                                                    className="btn btn-success" style={{ fontSize: "12px", float: "right" }}
                                                                    onClick={applyCoupon}
                                                                >
                                                                    APPLY
                                                                </CButton>
                                                                :
                                                                <CButton type="button"
                                                                    className="btn btn-danger" style={{ fontSize: "12px", float: "right" }}
                                                                    onClick={removeCoupon}
                                                                >
                                                                    CANCEL
                                                                </CButton>
                                                            }
                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                        </CCol>
                                        <CCol lg="1" md="12"></CCol>
                                        <CCol lg="5" md="12">
                                            <CRow>
                                                <CCol md="12">
                                                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                                        <CCardHeader>Payment Summary</CCardHeader>
                                                        <table className="table table-responsive-md table-bordered table-hover" id="OutletPlaceOrderSummaryTable">
                                                            <tbody>
                                                                <tr>
                                                                    <td><strong>Order Amount</strong></td>
                                                                    <td><strong>{paymentSummary.totalOrderAmount.toFixed(2)}</strong></td>
                                                                </tr>
                                                                {Surcharge == 0 || Surcharge == "0" ?
                                                                    null
                                                                    :
                                                                    <tr>
                                                                        <td><strong>Surcharge ({SurchargeName}) @ {Surcharge}% Extra</strong></td>
                                                                        <td><strong>{paymentSummary.surcharge.toFixed(2)}</strong></td>
                                                                    </tr>
                                                                }
                                                                {CouponApplied == true ?
                                                                    AppliedCouponDetails.COUPONS_ITEM_BASED == true || AppliedCouponDetails.COUPONS_ITEM_BASED == "true" ?
                                                                        <tr>
                                                                            <td><strong>Discount</strong></td>
                                                                            <td><strong>-{paymentSummary.totalItemDiscount.toFixed(2)}</strong></td>
                                                                        </tr>
                                                                        :
                                                                        <tr>
                                                                            <td><strong>Discount</strong></td>
                                                                            <td><strong>-{paymentSummary.discount.toFixed(2)}</strong></td>
                                                                        </tr>
                                                                    :
                                                                    null}
                                                                <tr>
                                                                    <td><strong>Total Order Amount</strong></td>
                                                                    <td><strong>
                                                                        {
                                                                            (parseFloat(paymentSummary.totalOrderAmount) + parseFloat(paymentSummary.surcharge) - parseFloat(paymentSummary.discount) - parseFloat(paymentSummary.totalItemDiscount)).toFixed(2)
                                                                        }
                                                                    </strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><strong>CGST  @ {CGST}%</strong></td>
                                                                    <td><strong>{paymentSummary.cgst.toFixed(2)}</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><strong>SGST  @ {SGST}%</strong></td>
                                                                    <td><strong>{paymentSummary.sgst.toFixed(2)}</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><strong>Total Invoice Value</strong></td>
                                                                    <td><strong>{paymentSummary.totalInvoiceValue.toFixed(2)}</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><strong>Round Off</strong></td>
                                                                    <td><strong>{paymentSummary.roundOff.toFixed(2)}</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><strong style={{ fontSize: 14 }}>Grand Total Amount</strong></td>
                                                                    <td><strong style={{ fontSize: 14 }}>{paymentSummary.grandTotalAmount}</strong></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </CCard>
                                                </CCol>
                                                {CustomerData.length > 0 ?
                                                    <CCol md="12" style={{ alignSelf: "center" }}>
                                                        <CRow>
                                                            <CCol md="12" style={{ textAlign: "center" }}>
                                                                <CButton type="button" className="btn btn-success" style={{ fontSize: "12px" }}
                                                                    onClick={placeOrder}
                                                                >
                                                                    UPDATE
                                                                </CButton>
                                                            </CCol>
                                                            <CCol md="12" style={{ textAlign: "center", marginTop: 10 }}>
                                                                <CButton type="button" className="btn btn-info" style={{ fontSize: "12px" }} onClick={() => {
                                                                    ViewCustomerDetails();
                                                                }}>
                                                                    CUSTOMER DETAILS
                                                                </CButton>
                                                            </CCol>
                                                        </CRow>
                                                    </CCol>
                                                    :
                                                    <CCol lg="2" md="12" style={{ alignSelf: "center" }}></CCol>
                                                }
                                            </CRow>

                                        </CCol>
                                    </CRow>
                                    : null}
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal show={block} onClose={() => setBlock(!block)} color="dark" style={{ height: 500 }}>
                <CModalHeader closeButton>
                    <CModalTitle>View Customer Details</CModalTitle>
                </CModalHeader>
                {CustomerData.length > 0 ?
                    <CModalBody>
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Name</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_NAME}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Customer Type</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_TYPE_NAME}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Address</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_ADDRESS}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Contact No.</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_CONTACT_NUMBER}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Alt-Contact No.</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_ALT_NUMBER == null || CustomerData[0].CUSTOMER_ALT_NUMBER == "" ? "-" : CustomerData[0].CUSTOMER_ALT_NUMBER}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Email</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_EMAIL}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>GST Type</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_GST_TYPE}</span>
                            </CCol>
                        </CFormGroup>
                        <CDropdownDivider />
                        {CustomerData[0].CUSTOMER_GST_NUMBER == null || CustomerData[0].CUSTOMER_GST_NUMBER == "" ? null :
                            <div>
                                <CFormGroup row>
                                    <CCol md="4">
                                        <span style={{ fontSize: "13px", color: "#3c3c3c" }}>GST No.</span>
                                    </CCol>
                                    <CCol md="8">
                                        <span style={{ fontSize: "14px", color: "#757575" }}>{CustomerData[0].CUSTOMER_GST_NUMBER}</span>
                                    </CCol>
                                </CFormGroup>
                                <CDropdownDivider />
                            </div>
                        }
                        <CFormGroup row>
                            <CCol md="4">
                                <span style={{ fontSize: "13px", color: "#3c3c3c" }}>Added Date.</span>
                            </CCol>
                            <CCol md="8">
                                <span style={{ fontSize: "14px", color: "#757575" }}>{SplitDateforCustomer(CustomerData[0].CUSTOMER_CREATED_DATE)}</span>
                            </CCol>
                        </CFormGroup>
                    </CModalBody>
                    : null}
                <CModalFooter>
                    <CButton
                        className="btn btn-danger"
                        style={{ fontSize: "12px" }}
                        onClick={() => setBlock(!block)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default EditPlaceOrder;