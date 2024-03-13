import React, { useState } from "react";
import axios from "axios";
import {
    CCol,
    CRow,
    CButton,
    CSelect,
    CInput,
    CCard,
    CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import "../../style.css";
import Swal from "sweetalert2";
import { MyApiUrl } from "src/services/service";

const ItemPriceMaster = () => {
    const history = useHistory();
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


    const [ItemsData, setItemsData] = useState([]);
    const [ItemsData2, setItemsData2] = useState([]);
    const [ServiceCatData, setServiceCatData] = useState([]);
    const [ServiceCategory, setServiceCategory] = useState("-1");
    const [DisplayType, setDisplayType] = useState("-1");

    const UpdateItemPrice = () => {
        axios
            .put(MyApiUrl + "ItemPrice/" + ServiceCategory + "", { Items: ItemsData })
            .then((response) => {
                if (response.data === true) {
                    Toast.fire({
                        icon: "success",
                        title: "Item Price Updated!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "Failed To Update"
                    });
                }
            });
    }

    const GetServiceCat = () => {
        axios.get(MyApiUrl + "ServiceCategory").then((response) => {
            console.log(response.data);
            const ServiceCatOption = response.data.map((item) => (
                <option value={item.SERVICE_CATEGORY_PKID}>{item.SERVICE_CATEGORY_NAME}</option>
            ));
            setServiceCatData(ServiceCatOption);

        });
    };

    React.useEffect(() => {
        GetServiceCat();
    }, []);

    const ExportToExcel = () => {
        var cnt = 0;
        var ItemFileName = "";
        // eslint-disable-next-line no-array-constructor
        var csvData = new Array();
        csvData.push(
            '"Sl No","Category","Sub Category","Item","Tier 1","Tier 2","Tier 3","Tier 4"'
        );
        if (DisplayType === "0") {
            ItemFileName = "ItemPrice_InActive_List.csv";
            ItemsData.map((item) => {
                if (item.PriceStatus === "-") {
                    return (
                        cnt++,
                        csvData.push(
                            '"' +
                            cnt +
                            '","' +
                            item.ITEM_CATEGORY_NAME +
                            '","' +
                            item.SUB_CATEGORY_NAME +
                            '","' +
                            item.ITEMS_NAME +
                            '","' +
                            item.tier1 +
                            '","' +
                            item.tier2 +
                            '","' +
                            item.tier3 +
                            '","' +
                            item.tier4 +
                            '"'
                        )
                    );
                }
            });
        } else if (DisplayType === "1") {
            ItemFileName = "ItemPrice_Active_List.csv";
            ItemsData.map((item) => {
                if (item.PriceStatus !== "-") {
                    return (
                        cnt++,
                        csvData.push(
                            '"' +
                            cnt +
                            '","' +
                            item.ITEM_CATEGORY_NAME +
                            '","' +
                            item.SUB_CATEGORY_NAME +
                            '","' +
                            item.ITEMS_NAME +
                            '","' +
                            item.tier1 +
                            '","' +
                            item.tier2 +
                            '","' +
                            item.tier3 +
                            '","' +
                            item.tier4 +
                            '"'
                        )
                    );
                }
            });
        } else {
            ItemFileName = "ItemPrice_All.csv";
            ItemsData.map((item) => {
                return (
                    cnt++,
                    csvData.push(
                        '"' +
                        cnt +
                        '","' +
                        item.ITEM_CATEGORY_NAME +
                        '","' +
                        item.SUB_CATEGORY_NAME +
                        '","' +
                        item.ITEMS_NAME +
                        '","' +
                        item.tier1 +
                        '","' +
                        item.tier2 +
                        '","' +
                        item.tier3 +
                        '","' +
                        item.tier4 +
                        '"'
                    )
                );
            });
        }

        const fileName = ItemFileName;
        const buffer = csvData.join("\n");
        const blob = new Blob([buffer], {
            type: "text/csv;charset=utf8;",
        });

        //IN IE
        const link = document.createElement("a");
        if (link.download !== undefined) {
            link.setAttribute("href", window.URL.createObjectURL(blob));
            link.setAttribute("download", fileName);
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
        }
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
            <CRow style={{ marginTop: "2%", borderBottom: "1px solid #d4d4d4", paddingBottom: "2%" }}>
                <CCol md="3" style={{ alignSelf: "center" }}>
                    <CSelect
                        custom
                        name="RouteCode"
                        id="RouteCode"
                        onChange={(event) => {
                            if (event.target.value === "-1") {
                                setItemsData([]);
                            } else {
                                setServiceCategory(event.target.value);
                                axios.get(MyApiUrl + "ItemForPrice/" + event.target.value + "").then((response) => {
                                    if (response.data.length !== 0) {
                                        const items = response.data.map((item) => {
                                            return {
                                                ...item,
                                                Category: item.ITEM_CATEGORY_NAME,
                                                "Sub Category": item.SUB_CATEGORY_NAME,
                                                "Item Name": item.ITEMS_NAME,
                                                "Display Name": item.ITEMS_DISPLAY_NAME
                                            };
                                        });
                                        setItemsData(items);
                                        setItemsData2(items);
                                    }
                                    else {
                                        setItemsData([]);
                                        setItemsData2([]);
                                    }
                                });
                            }
                        }}
                        value={ServiceCategory}
                    >
                        <option value="-1">Select Service Category</option>
                        {ServiceCatData}
                    </CSelect>
                </CCol>
                <CCol md="6" style={{ alignSelf: "center" }}>
                    <h1 id="ccmaster">Item Price Management</h1>
                </CCol>
                <CCol md="3" style={{ alignSelf: "center" }}>
                    <CSelect
                        custom
                        name="RouteCode"
                        id="RouteCode"
                        value={DisplayType}
                        onChange={(event) => {
                            setDisplayType(event.target.value);
                            setItemsData(ItemsData2);
                        }}
                    >
                        <option value="-1">Display Type ( All )</option>
                        <option value="1">Active</option>
                        <option value="0">InActive</option>
                    </CSelect>
                </CCol>
            </CRow>
            {ItemsData.length > 0 ? <CRow style={{ marginTop: "1%" }}>
                <CCol md="12">
                    <CRow>
                        <CCol md="12">
                            <CButton type="button" onClick={ExportToExcel} className="btn btn-warning" style={{ fontSize: "13px", marginBottom: "1%", float: "right" }}>
                                Export To Excel
                            </CButton>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md="12">
                            <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                                <table className="table table-responsive-md custom table-bordered review-table" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: "60px" }}>Sl No</th>
                                            <th style={{ minWidth: "200px" }}>Category</th>
                                            <th>Sub Category</th>
                                            <th>Item</th>
                                            <th>Tier 1</th>
                                            <th>Tier 2</th>
                                            <th>Tier 3</th>
                                            <th>Tier 4</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            DisplayType === "0" ?
                                                ItemsData.map((item, i) => {
                                                    if (item.PriceStatus === "-") {
                                                        return (
                                                            <React.Fragment>
                                                                <tr>
                                                                    <td>{i + 1}</td>
                                                                    <td>{item.ITEM_CATEGORY_NAME}</td>
                                                                    <td>{item.SUB_CATEGORY_NAME}</td>
                                                                    <td>{item.ITEMS_NAME}</td>
                                                                    <td>
                                                                        <CInput
                                                                            type="text"
                                                                            name={item.ITEMS_PKID}
                                                                            value={item.tier1 === 0 ? "" : item.tier1}
                                                                            placeholder="Enter Price"
                                                                            onChange={(event) => {
                                                                                const updatedData = ItemsData.map((item) => {
                                                                                    if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                        return { ...item, tier1: event.target.value };
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                setItemsData(updatedData);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CInput
                                                                            type="text"
                                                                            name={item.ITEMS_PKID}
                                                                            value={item.tier2 === 0 ? null : item.tier2}
                                                                            placeholder="Enter Price"
                                                                            onChange={(event) => {
                                                                                const updatedData = ItemsData.map((item) => {
                                                                                    if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                        return { ...item, tier2: event.target.value };
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                setItemsData(updatedData);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CInput
                                                                            type="text"
                                                                            name={item.ITEMS_PKID}
                                                                            value={item.tier3 === 0 ? null : item.tier3}
                                                                            placeholder="Enter Price"
                                                                            onChange={(event) => {
                                                                                const updatedData = ItemsData.map((item) => {
                                                                                    if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                        return { ...item, tier3: event.target.value };
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                setItemsData(updatedData);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CInput
                                                                            type="text"
                                                                            name={item.ITEMS_PKID}
                                                                            value={item.tier4 === 0 ? null : item.tier4}
                                                                            placeholder="Enter Price"
                                                                            onChange={(event) => {
                                                                                const updatedData = ItemsData.map((item) => {
                                                                                    if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                        return { ...item, tier4: event.target.value };
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                setItemsData(updatedData);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </React.Fragment>
                                                        )
                                                    }
                                                }) : DisplayType === "1" ?
                                                    ItemsData.map((item, i) => {
                                                        if (item.PriceStatus !== "-")
                                                            return (
                                                                <React.Fragment>
                                                                    <tr>
                                                                        <td>{i + 1}</td>
                                                                        <td>{item.ITEM_CATEGORY_NAME}</td>
                                                                        <td>{item.SUB_CATEGORY_NAME}</td>
                                                                        <td>{item.ITEMS_NAME}</td>
                                                                        <td>
                                                                            <CInput
                                                                                type="text"
                                                                                name={item.ITEMS_PKID}
                                                                                value={item.tier1 === 0 ? "" : item.tier1}
                                                                                placeholder="Enter Price"
                                                                                onChange={(event) => {
                                                                                    const updatedData = ItemsData.map((item) => {
                                                                                        if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                            return { ...item, tier1: event.target.value };
                                                                                        }
                                                                                        return item;
                                                                                    });
                                                                                    setItemsData(updatedData);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <CInput
                                                                                type="text"
                                                                                name={item.ITEMS_PKID}
                                                                                value={item.tier2 === 0 ? null : item.tier2}
                                                                                placeholder="Enter Price"
                                                                                onChange={(event) => {
                                                                                    const updatedData = ItemsData.map((item) => {
                                                                                        if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                            return { ...item, tier2: event.target.value };
                                                                                        }
                                                                                        return item;
                                                                                    });
                                                                                    setItemsData(updatedData);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <CInput
                                                                                type="text"
                                                                                name={item.ITEMS_PKID}
                                                                                value={item.tier3 === 0 ? null : item.tier3}
                                                                                placeholder="Enter Price"
                                                                                onChange={(event) => {
                                                                                    const updatedData = ItemsData.map((item) => {
                                                                                        if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                            return { ...item, tier3: event.target.value };
                                                                                        }
                                                                                        return item;
                                                                                    });
                                                                                    setItemsData(updatedData);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <CInput
                                                                                type="text"
                                                                                name={item.ITEMS_PKID}
                                                                                value={item.tier4 === 0 ? null : item.tier4}
                                                                                placeholder="Enter Price"
                                                                                onChange={(event) => {
                                                                                    const updatedData = ItemsData.map((item) => {
                                                                                        if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                            return { ...item, tier4: event.target.value };
                                                                                        }
                                                                                        return item;
                                                                                    });
                                                                                    setItemsData(updatedData);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </React.Fragment>
                                                            )
                                                    }) : ItemsData.map((item, i) => {
                                                        return (
                                                            <React.Fragment>
                                                                <tr>
                                                                    <td>{i + 1}</td>
                                                                    <td>{item.ITEM_CATEGORY_NAME}</td>
                                                                    <td>{item.SUB_CATEGORY_NAME}</td>
                                                                    <td>{item.ITEMS_NAME}</td>
                                                                    <td>
                                                                        <CInput
                                                                            type="text"
                                                                            name={item.ITEMS_PKID}
                                                                            value={item.tier1 === 0 ? "" : item.tier1}
                                                                            placeholder="Enter Price"
                                                                            onChange={(event) => {
                                                                                const updatedData = ItemsData.map((item) => {
                                                                                    if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                        return { ...item, tier1: event.target.value };
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                setItemsData(updatedData);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CInput
                                                                            type="text"
                                                                            name={item.ITEMS_PKID}
                                                                            value={item.tier2 === 0 ? null : item.tier2}
                                                                            placeholder="Enter Price"
                                                                            onChange={(event) => {
                                                                                const updatedData = ItemsData.map((item) => {
                                                                                    if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                        return { ...item, tier2: event.target.value };
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                setItemsData(updatedData);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CInput
                                                                            type="text"
                                                                            name={item.ITEMS_PKID}
                                                                            value={item.tier3 === 0 ? null : item.tier3}
                                                                            placeholder="Enter Price"
                                                                            onChange={(event) => {
                                                                                const updatedData = ItemsData.map((item) => {
                                                                                    if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                        return { ...item, tier3: event.target.value };
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                setItemsData(updatedData);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CInput
                                                                            type="text"
                                                                            name={item.ITEMS_PKID}
                                                                            value={item.tier4 === 0 ? null : item.tier4}
                                                                            placeholder="Enter Price"
                                                                            onChange={(event) => {
                                                                                const updatedData = ItemsData.map((item) => {
                                                                                    if (item.ITEMS_PKID === parseInt(event.target.name)) {
                                                                                        return { ...item, tier4: event.target.value };
                                                                                    }
                                                                                    return item;
                                                                                });
                                                                                setItemsData(updatedData);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </React.Fragment>
                                                        )
                                                    })
                                        }
                                    </tbody>
                                </table>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md="12">
                            <CButton type="button" onClick={UpdateItemPrice} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
                                UPDATE PRICE
                            </CButton>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow> : null}
        </div>
    );
};

export default ItemPriceMaster;
