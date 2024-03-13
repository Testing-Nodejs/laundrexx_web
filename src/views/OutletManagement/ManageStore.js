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
    CSelect,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Sl No." },
    { key: "Action" },
    { key: "Outlet ID" },
    { key: "Outlet Code" },
    { key: "Outlet Short Code" },
    { key: "Outlet Name" },
    { key: "Outlet Address" },
    { key: "Outlet City" },
    { key: "Route Code" },
    { key: "Outlet Phone" },
    { key: "Pricing Tier" },
    { key: "Default Factory" },
    { key: "Service Category" },
    { key: "Service Type" },
    { key: "Due Date" },
];

const Outlet = () => {
    const history = useHistory();

    const UserID = sessionStorage.getItem("UserID");
    const UserType = sessionStorage.getItem("SessionType");

    const [RouteCodeData, setRouteCodeData] = useState();
    const [DefaultFactoryData, setDefaultFactoryData] = useState();
    const [ServiceTypeData, setServiceTypeData] = useState();
    const [ServiceCategoryData, setServiceCatData] = useState();
    const [StoreData, setStoreData] = useState([]);
    const [StoreID, setStoreID] = useState(Math.floor(1000 + Math.random() * 9000));
    const [StoreCode, setStoreCode] = useState("");
    const [StoreShortCode, setStoreShortCode] = useState("");
    const [StorePkid, setStorePkid] = useState("");
    const [StoreName, setStoreName] = useState("");
    const [StoreAddress, setStoreAddress] = useState("");
    const [StoreCity, setStoreCity] = useState("");
    const [RouteCode, setRouteCode] = useState("-1");
    const [StorePhone, setStorePhone] = useState("");
    const [PricingTier, setpricingTier] = useState("-1");
    const [DefaultFactory, setDefaultFactory] = useState("-1");
    const [ServiceCat, setServiceCat] = useState("-1");
    const [ServiceType, setServiceType] = useState("-1");
    const [DueDate, setDueDate] = useState("");
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);
    const [block, setBlock] = useState(false);
    const [ModalData, setModalData] = useState("");

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

    const RouteCodeChange = (event) => {
        setRouteCode(event.target.value);
    };

    const PricingTierChange = (event) => {
        setpricingTier(event.target.value);
    };

    const StoreAddressChange = (event) => {
        setStoreAddress(event.target.value);
    };

    const StoreIDChange = (event) => {
        setStoreID(event.target.value);
    };

    const DefaultFactoryChange = (event) => {
        setDefaultFactory(event.target.value);
    };

    const ServiceTypeChange = (event) => {
        setServiceType(event.target.value);
    };

    const ServiceCategoryChange = (event) => {
        setServiceCat(event.target.value);
        setServiceType("-1");
        GetServiceType(event.target.value);
    };

    const GetRoute = React.useCallback(() => {
        axios.get(MyApiUrl + "Route").then((response) => {
            console.log(response.data);
            const RouteOption = response.data.map((item) => (
                <option value={item.ROUTE_PKID}>{item.ROUTE_NAME}/ {item.ROUTE_CODE}</option>
            ));
            setRouteCodeData(RouteOption);
        });
    }, []);

    const GetFactory = React.useCallback(() => {
        axios.get(MyApiUrl + "Factory").then((response) => {
            console.log(response.data);
            const FactoryOption = response.data.map((item) => (
                <option value={item.FACTORY_PKID}>{item.FACTORY_NAME}</option>
            ));
            setDefaultFactoryData(FactoryOption);
        });
    }, []);

    const GetServiceCat = React.useCallback(() => {
        axios.get(MyApiUrl + "ServiceCategory").then((response) => {
            console.log(response.data);
            const ServiceCatOption = response.data.map((item) => (
                <option value={item.SERVICE_CATEGORY_PKID}>{item.SERVICE_CATEGORY_NAME}</option>
            ));
            setServiceCatData(ServiceCatOption);

        });
    }, []);

    const GetServiceType = (CatId) => {
        axios.get(MyApiUrl + "ServiceTypeByCategory/" + CatId + "").then((response) => {
            console.log(response.data);
            const ServiceOption = response.data.map((item) => (
                <option value={item.SERVICE_TYPE_PKID}>{item.SERVICE_TYPE_NAME}</option>
            ));
            setServiceTypeData(ServiceOption);
        });
    };



    const GetAllStore = async () => {
        document.getElementById("divLoading").className = "show";
        if (UserType == "Manager") {
            await axios({
                method: "GET",
                url: MyApiUrl + "OutletsByManager/" + UserID + "",
                headers: {
                    "content-type": "application/json",
                },
            }).then((response) => {
                const items = response.data.map((item, index) => {
                    return {
                        ...item,
                        "Sl No.": index + 1,
                        "Outlet ID": item.STORE_ID,
                        "Outlet Code": item.STORE_CODE,
                        "Outlet Short Code": item.STORE_SHORT_CODE,
                        "Outlet Name": item.STORE_NAME,
                        "Outlet City": item.STORE_CITY,
                        "Route Code": item.ROUTE_NAME + "-" + item.ROUTE_CODE,
                        "Outlet Phone": item.STORE_PHONE === "" || item.STORE_PHONE === null ? "-" : item.STORE_PHONE,
                        "Pricing Tier": item.STORE_PRICE_TIER,
                        "Default Factory": item.FACTORY_NAME,
                        "Service Category": item.SERVICE_CATEGORY_NAME,
                        "Service Type": item.SERVICE_TYPE_NAME,
                        "Due Date": item.STORE_DUE_DATES,

                    };
                });
                setStoreData(items)
                document.getElementById("divLoading").className = "hide";
            })
                .catch((error) => {
                    console.log(error)
                });
        } else {
            await axios({
                method: "GET",
                url: MyApiUrl + "Outlets",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    const items = response.data.map((item, index) => {
                        return {
                            ...item,
                            "Sl No.": index + 1,
                            "Outlet ID": item.STORE_ID,
                            "Outlet Code": item.STORE_CODE,
                            "Outlet Short Code": item.STORE_SHORT_CODE,
                            "Outlet Name": item.STORE_NAME,
                            "Outlet City": item.STORE_CITY,
                            "Route Code": item.ROUTE_NAME + "-" + item.ROUTE_CODE,
                            "Outlet Phone": item.STORE_PHONE === "" || item.STORE_PHONE === null ? "-" : item.STORE_PHONE,
                            "Pricing Tier": item.STORE_PRICE_TIER,
                            "Default Factory": item.FACTORY_NAME,
                            "Service Category": item.SERVICE_CATEGORY_NAME,
                            "Service Type": item.SERVICE_TYPE_NAME,
                            "Due Date": item.STORE_DUE_DATES,

                        };
                    });
                    setStoreData(items)
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error)
                });
        }

    };

    React.useEffect(() => {
        GetAllStore();
        GetRoute();
        GetFactory();
        GetServiceCat();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }, []);


    const AddStore = () => {
        if (StoreCode === "" || StoreCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Code!",
            });
        } else if (StoreShortCode === "" || StoreShortCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Short Code!",
            });
        } else if (StoreName === "" || StoreName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Name!",
            });
        } else if (StoreCity === "" || StoreCity == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet City!",
            });
        } else if (RouteCode === "-1" || RouteCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Route Code!",
            });
        } else if (PricingTier === "-1" || PricingTier == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Pricing Tier!",
            });
        } else if (DefaultFactory === "-1" || DefaultFactory == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Default Factory!",
            });
        } else if (ServiceCat === "-1" || ServiceCat == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Service Category!",
            });
        } else if (ServiceType === "-1" || ServiceType == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Service Type!",
            });
        } else if (DueDate === "" || DueDate == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Due Date / Extra Days!",
            });
        } else if (StoreAddress === "" || StoreAddress == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Address!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                ManagerID: UserID,
                STORE_ID: StoreID,
                STORE_CODE: StoreCode,
                STORE_SHORT_CODE: StoreShortCode,
                STORE_NAME: StoreName,
                STORE_ADDRESS: StoreAddress,
                STORE_CITY: StoreCity,
                STORE_ROUTE_FKID: RouteCode,
                STORE_PHONE: StorePhone,
                STORE_PRICE_TIER: PricingTier,
                STORE_DEFAULT_FACTORY: DefaultFactory,
                STORE_SERVICE_CATEGORY_FKID: ServiceCat,
                STORE_SERVICE_TYPE_FKID: ServiceType,
                STORE_DUE_DATES: DueDate,
            };
            axios.post(MyApiUrl + "AddOutletsByManager ", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "Outlet Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "Outlet Details Added!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Add!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });

        }
    }

    const EditStore = (pkid, storecode, storeshortcode, storename, storeadd, storecity, routecode, storephone, pricetier, defaultfact, servicecat, servicetype, duedate) => {
        setStorePkid(pkid);
        setStoreCode(storecode);
        setStoreShortCode(storeshortcode);
        setStoreName(storename);
        setStoreAddress(storeadd);
        setStoreCity(storecity);
        setRouteCode(routecode);
        setStorePhone(storephone);
        setpricingTier(pricetier);
        setDefaultFactory(defaultfact);
        getUpdate(servicecat, servicetype);
        setDueDate(duedate);
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);
    }

    const getUpdate = async (servicecat, servicetype) => {
        await axios.get(MyApiUrl + "ServiceCategory").then((response) => {
            console.log(response.data);
            const ServiceCatOption = response.data.map((item) => (
                <option value={item.SERVICE_CATEGORY_PKID}>{item.SERVICE_CATEGORY_NAME}</option>
            ));
            setServiceCatData(ServiceCatOption);
            setServiceCat(servicecat);

        });
        await axios.get(MyApiUrl + "ServiceTypeByCategory/" + servicecat + "").then((response) => {
            console.log(response.data);
            const ServiceOption = response.data.map((item) => (
                <option value={item.SERVICE_TYPE_PKID}>{item.SERVICE_TYPE_NAME}</option>
            ));
            setServiceTypeData(ServiceOption);
            setServiceType(servicetype);
        });
    }

    const DeleteStore = (pkid) => {
        document.getElementById("divLoading").className = "show";
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "Outlets/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected Outlet Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete Outlet",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        document.getElementById("divLoading").className = "hide";
                    }
                })
        }
    };

    const UpdateStore = () => {
        if (StoreCode === "" || StoreCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Code!",
            });
        } else if (StoreShortCode === "" || StoreShortCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Short Code!",
            });
        } else if (StoreName === "" || StoreName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Name!",
            });
        } else if (StoreCity === "" || StoreCity == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet City!",
            });
        } else if (RouteCode === "-1" || RouteCode == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Route Code!",
            });
        } else if (PricingTier === "-1" || PricingTier == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Pricing Tier!",
            });
        } else if (DefaultFactory === "-1" || DefaultFactory == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Default Factory!",
            });
        } else if (ServiceCat === "-1" || ServiceCat == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Service Category!",
            });
        } else if (ServiceType === "-1" || ServiceType == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Service Type!",
            });
        } else if (DueDate === "" || DueDate == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Due Date / Extra Days!",
            });
        } else if (StoreAddress === "" || StoreAddress == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Outlet Address!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                ManagerID: UserID,
                STORE_ID: StoreID,
                STORE_CODE: StoreCode,
                STORE_SHORT_CODE: StoreShortCode,
                STORE_NAME: StoreName,
                STORE_ADDRESS: StoreAddress,
                STORE_CITY: StoreCity,
                STORE_ROUTE_FKID: RouteCode,
                STORE_PHONE: StorePhone,
                STORE_PRICE_TIER: PricingTier,
                STORE_DEFAULT_FACTORY: DefaultFactory,
                STORE_SERVICE_CATEGORY_FKID: ServiceCat,
                STORE_SERVICE_TYPE_FKID: ServiceType,
                STORE_DUE_DATES: DueDate,
            };
            axios.put(MyApiUrl + "Outlets/" + StorePkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Outlet Updated!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Update!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });

        }
    }

    const Updatebtn = () => (
        <CButton type="button" onClick={UpdateStore} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddStore} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            ADD
        </CButton>
    );

    const CancelBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-danger" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CANCEL
        </CButton>
    );

    const ClearBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-warning" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CLEAR
        </CButton>
    );

    const Reset = () => {
        setStoreID(Math.floor(1000 + Math.random() * 9000));
        setStorePkid("");
        setStoreCode("");
        setStoreShortCode("");
        setStoreName("");
        setStoreAddress("");
        setStoreCity("");
        setRouteCode("-1");
        setStorePhone("");
        setpricingTier("-1");
        setDefaultFactory("-1");
        setServiceCat("-1");
        setServiceType("-1");
        setDueDate("");
        GetAllStore();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }
    const ViewServiceCategory = (list) => {
        setModalData(list);
        setBlock(!block);
    }

    return (
        <div className="123">
            <div id="divLoading"> </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster">Manage Outlet</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="12">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add/Update Outlet</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet ID</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Outlet ID"
                                                readOnly="true"
                                                value={StoreID}
                                                onChange={StoreIDChange}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet Code <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Code"
                                                value={StoreCode}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    setStoreCode(value)
                                                }}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet Short Code <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Short Code"
                                                value={StoreShortCode}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    setStoreShortCode(value)
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Name"
                                                value={StoreName}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setStoreName(value)
                                                }}

                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet City <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet City"
                                                value={StoreCity}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    setStoreCity(value);
                                                }}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Route Code <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="RouteCode"
                                                id="RouteCode"
                                                onChange={RouteCodeChange}
                                                value={RouteCode}
                                            >
                                                <option value="-1">Select Route Code</option>
                                                {RouteCodeData}
                                            </CSelect>

                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet Phone</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Phone"
                                                value={StorePhone}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, ""); setStorePhone(value)
                                                }}
                                                maxLength={10}
                                            />
                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Pricing Tier <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="RouteCode"
                                                id="RouteCode"
                                                onChange={PricingTierChange}
                                                value={PricingTier}
                                            >
                                                <option value="-1">Select Pricing Tier</option>
                                                <option value="Tier 1">Tier 1</option>
                                                <option value="Tier 2">Tier 2</option>
                                                <option value="Tier 3">Tier 3</option>
                                                <option value="Tier 4">Tier 4</option>
                                            </CSelect>

                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Default Factory <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="RouteCode"
                                                id="RouteCode"
                                                onChange={DefaultFactoryChange}
                                                value={DefaultFactory}
                                            >
                                                <option value="-1">Select Default Factory</option>
                                                {DefaultFactoryData}
                                            </CSelect>

                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Service Category <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="RouteCode"
                                                id="RouteCode"
                                                onChange={ServiceCategoryChange}
                                                value={ServiceCat}
                                            >
                                                <option value="-1">Select Service Category</option>
                                                {ServiceCategoryData}
                                            </CSelect>

                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Service Type <span style={{ color: "red" }}>*</span></CLabel>
                                            <CSelect
                                                custom
                                                name="RouteCode"
                                                id="RouteCode"
                                                onChange={ServiceTypeChange}
                                                value={ServiceType}
                                            >
                                                <option value="-1">Select Service Type</option>
                                                {ServiceTypeData}
                                            </CSelect>

                                        </CCol>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet Due Dates <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Outlet Due Dates"
                                                value={DueDate}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, "");
                                                    setDueDate(value)
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol lg="4" md="12">
                                            <CLabel>Outlet Address <span style={{ color: "red" }}>*</span></CLabel>
                                            <CTextarea
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Outlet Address"
                                                value={StoreAddress}
                                                onChange={StoreAddressChange}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol lg="12" md="12">
                                            {CancelButton && <CancelBtn />}
                                            {UpdateButton && <Updatebtn />}
                                            {ClearButton && <ClearBtn />}
                                            {AddButton && <Addbtn />}
                                        </CCol>
                                    </CFormGroup>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
                <CCol md="12" lg="12">
                    <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                        <CCardHeader>View Outlet</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={StoreData}
                                fields={fields2}
                                hover
                                striped
                                bordered
                                sorter
                                tableFilter={table}
                                itemsPerPageSelect={items}
                                columnFilterSlot
                                size="sm"
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    Action: (item) => (
                                        <td>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    EditStore(
                                                        item.STORE_PKID,
                                                        item.STORE_CODE,
                                                        item.STORE_SHORT_CODE,
                                                        item.STORE_NAME,
                                                        item.STORE_ADDRESS,
                                                        item.STORE_CITY,
                                                        item.STORE_ROUTE_FKID,
                                                        item.STORE_PHONE,
                                                        item.STORE_PRICE_TIER,
                                                        item.STORE_DEFAULT_FACTORY,
                                                        item.STORE_SERVICE_CATEGORY_FKID,
                                                        item.STORE_SERVICE_TYPE_FKID,
                                                        item.STORE_DUE_DATES,

                                                    );
                                                }}
                                                id="war-btn"
                                            >
                                                <EditIcon />
                                            </CButton>
                                            <CButton
                                                size="sm"
                                                onClick={() => {
                                                    DeleteStore(item.STORE_PKID);
                                                }}
                                                id="war-btn1"
                                            >
                                                <DeleteSharpIcon />
                                            </CButton>
                                        </td>
                                    ),
                                    "Outlet Address": (i) => (
                                        <td>
                                            <CButton
                                                className="btn btn-info"
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                    ViewServiceCategory(i.STORE_ADDRESS);
                                                }}
                                            >
                                                View
                                            </CButton>
                                        </td>
                                    ),
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow><CModal show={block} onClose={() => setBlock(!block)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>Outlet Address</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel>Outlet Address</CLabel>
                                    <CTextarea
                                        id="text-input"
                                        name="text-input"
                                        value={ModalData}
                                        readOnly={true}
                                    />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CModalBody>
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

export default Outlet;
