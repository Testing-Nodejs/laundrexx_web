/* eslint-disable no-restricted-globals */
import React, { useState } from "react";
import axios from "axios";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CCardFooter,
  CSelect,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
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
import ReactSwitch from 'react-switch';
import { MultiSelect } from "react-multi-select-component";
import "../../style.css";
import Swal from "sweetalert2";
import { MyApiUrl, ViewImg } from "src/services/service";
import { Outlet } from "@mui/icons-material";
var voucher_codes = require('voucher-code-generator');
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
  { key: "Action" },
  { key: "Coupon Type" },
  { key: "Coupon Name" },
  { key: "Coupon Code" },
  { key: "Outlets" },
  { key: "Items" },
  { key: "Coupon Price/Percentage" },
  { key: "Coupon Discount" },
  { key: "Coupon Validity" },
];

const fields = [
  { key: "Outlet ID" },
  { key: "Outlet Code" },
  { key: "Outlet Name" },
];

const fields1 = [
  { key: "Sl No" },
  { key: "Category" },
  { key: "Sub Category" },
  { key: "Name" },
];

const CouponManage = () => {
  const history = useHistory();

  const UserID = sessionStorage.getItem("UserID");
  const UserType = sessionStorage.getItem("SessionType");
  const [couponPkid, setcouponPkid] = useState("");
  const [AddButton, setAddButton] = useState(true);
  const [UpdateButton, setUpdateButton] = useState(false);
  const [ReloadButton, setReloadButton] = useState(false);
  const [ClearButton, setClearButton] = useState(true);
  const [block, setBlock] = useState(false);
  const [InnerTableData, setInnerTableData] = useState([]);
  const [block1, setBlock1] = useState(false);
  const [InnerTableData1, setInnerTableData1] = useState([]);

  const [couponType, setcouponType] = useState("");
  const [couponName, setcouponName] = useState("");
  const [couponCode, setcouponCode] = useState("");
  const [couponPrice, setcouponPrice] = useState("");
  const [couponDiscout, setcouponDiscout] = useState("");
  const [couponValidity, setcouponValidity] = useState("1 Year");
  const [Outlets, setOutlets] = useState([]);
  const [OutletList, setOutletList] = useState([]);
  const [Items, setItems] = useState([]);
  const [ItemsList, setItemsList] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [Show, setShow] = useState(false);
  const [Show1, setShow1] = useState(false);
  const [ItemBased, setItemBased] = useState(false);

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

  const couponTypeChange = (event) => {
    setcouponType(event.target.value);
  };

  const couponCodeChange = (event) => {
    setcouponCode(event.target.value);
  };

  const couponPriceChange = (event) => {
    setcouponPrice(event.target.value);
  };

  const couponValidityChange = (event) => {
    setcouponValidity(event.target.value);
  };

  const ViewOutlets = (list) => {
    const items = list.map((item) => {
      return {
        ...item,
        "Outlet ID": item.STORE_ID,
        "Outlet Code": item.STORE_CODE,
        "Outlet Name": item.STORE_NAME,
      };
    });
    setInnerTableData(items);
    setBlock(!block);
  }

  const ViewItems = (list) => {
    const items = list.map((item, index) => {
      return {
        ...item,
        "Sl No": index + 1,
        "Category": item.ITEM_CATEGORY_NAME,
        "Sub Category": item.SUB_CATEGORY_NAME,
        "Name": item.ITEMS_NAME,
      };
    });
    setInnerTableData1(items);
    setBlock1(!block1);
  }

  const addCoupon = () => {
    if (ItemBased == true) {
      if (Items.length == "0" || Items.length == 0) {
        Toast.fire({
          icon: "warning",
          title: "Please Select Items",
        });
        return;
      }
    }
    if (couponType == "" || couponType == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Type",
      });
    } else if (couponName == "" || couponName == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Name",
      });
    } else if (couponCode == "" || couponCode == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Code",
      });
    } else if (couponPrice == "" || couponPrice == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Select Coupon Price/Percentage",
      });
    } else if (couponDiscout == "" || couponDiscout == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Discout",
      });
    } else if (couponValidity == "" || couponValidity == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Validity",
      });
    } else if (Outlets.length == "0" || Outlets.length == 0) {
      Toast.fire({
        icon: "warning",
        title: "Please Select Outlet",
      });
    } else {
      const currentDate = new Date();
      const nextYear = currentDate.getFullYear() + 1;
      const nextYearDate = new Date(nextYear, currentDate.getMonth(), currentDate.getDate());
      const formattedDate = nextYearDate.toISOString().split('T')[0];
      const obj = {
        COUPONS_ADDED_BY: UserType,
        COUPONS_ADDED_BY_FKID: UserID,
        COUPONS_TYPE_NAME: couponType,
        COUPONS_NAME: couponName,
        COUPONS_CODE: couponCode,
        COUPONS_PRICE_OR_PERCENTAGE: couponPrice,
        COUPONS_DISCOUNT: couponDiscout,
        COUPONS_VALIDITY: couponValidity,
        isItemBased: ItemBased,
        ItemsData: Items,
        OutletData: Outlets,
        COUPONS_VALIDITY_DATE: formattedDate,
      };
      axios.post(MyApiUrl + "Coupon", obj)
        .then((response) => {
          if (response.data == "0") {
            Toast.fire({
              icon: "error",
              title: "Coupon Already Exist",
            });
          } else if (response.data === true) {
            Toast.fire({
              icon: "success",
              title: "Coupon Details Added",
            });
            reset();
          } else if (response.data === false) {
            Toast.fire({
              icon: "error",
              title: "Failed To Add",
            });
          }
        });
    }
  };

  const UpdateCoupon = () => {
    if (ItemBased == true) {
      if (Items.length == "0" || Items.length == 0) {
        Toast.fire({
          icon: "warning",
          title: "Please Select Items",
        });
        return;
      }
    }
    if (couponType == "" || couponType == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Type",
      });
    } else if (couponName == "" || couponName == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Name",
      });
    } else if (couponCode == "" || couponCode == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Code",
      });
    } else if (couponPrice == "" || couponPrice == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Select Coupon Price/Percentage",
      });
    } else if (couponDiscout == "" || couponDiscout == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Discout",
      });
    } else if (couponValidity == "" || couponValidity == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Validity",
      });
    } else if (Outlets.length == "0" || Outlets.length == 0) {
      Toast.fire({
        icon: "warning",
        title: "Please Select Outlet",
      });
    } else {
      const currentDate = new Date();
      const nextYear = currentDate.getFullYear() + 1;
      const nextYearDate = new Date(nextYear, currentDate.getMonth(), currentDate.getDate());
      const formattedDate = nextYearDate.toISOString().split('T')[0];
      const obj = {
        COUPONS_TYPE_NAME: couponType,
        COUPONS_NAME: couponName,
        COUPONS_CODE: couponCode,
        COUPONS_PRICE_OR_PERCENTAGE: couponPrice,
        COUPONS_DISCOUNT: couponDiscout,
        COUPONS_VALIDITY: couponValidity,
        isItemBased: ItemBased,
        ItemsData: Items,
        OutletData: Outlets,
        COUPONS_VALIDITY_DATE: formattedDate,
      };
      axios.put(MyApiUrl + "Coupon/" + couponPkid + "", obj)
        .then((response) => {
          if (response.data === true) {
            Toast.fire({
              icon: "success",
              title: "Coupon Details Updated",
            });
            reset();
          } else if (response.data === false) {
            Toast.fire({
              icon: "error",
              title: "Fail to Update",
            });
          }
        });
    }
  };

  const EditCoupon = (id, couponType, couponName, couponCode, couponPrice, couponDiscout, couponValidity, isItemBased, Outlets, Items) => {
    // console.log(Outlets);
    setcouponPkid(id);
    setcouponType(couponType);
    setcouponName(couponName);
    setcouponCode(couponCode);
    setcouponPrice(couponPrice);
    setcouponDiscout(couponDiscout);
    setcouponValidity(couponValidity);
    setItemBased(isItemBased);
    const items = Outlets.map((item) => {
      return {
        ...item,
        "value": item.STORE_PKID,
        "label": item.STORE_NAME,
      };
    });
    setOutlets(items);
    const items1 = Items.map((item) => {
      return {
        ...item,
        "value": item.ITEMS_PKID,
        "label": item.ITEMS_NAME,
      };
    });
    setItems(items1);
    setAddButton(false);
    setUpdateButton(true);
    setReloadButton(true);
    setClearButton(false);
  };

  const DeleteCoupon = (id) => {
    document.getElementById("divLoading").className = "show";
    var res = confirm("Are you sure you want to delete?");
    if (res) {
      axios({
        method: "DELETE",
        url: MyApiUrl + "Coupon/" + id + "",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          if (response.data === true) {
            Swal.fire({
              title: "Selected Coupon Deleted!",
              icon: "success",
              confirmButtonText: "OK",
            });
            reset();
            document.getElementById("divLoading").className = "hide";
          } else {
            Swal.fire({
              title: "Failed To Delete Coupon!",
              icon: "error",
              confirmButtonText: "OK",
            });
            document.getElementById("divLoading").className = "hide";
          }
        })
    }
  };

  const Updatebtn = () => (
    <CButton type="button" onClick={UpdateCoupon} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
      UPDATE
    </CButton>
  );

  const Addbtn = () => (
    <CButton type="button" onClick={addCoupon} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
      ADD
    </CButton>
  );

  const Reloadbtn = () => (
    <CButton type="button" onClick={reset} className="btn btn-danger" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
      CANCEL
    </CButton>
  );

  const Clearbtn = () => (
    <CButton type="button" onClick={reset} className="btn btn-warning" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
      CLEAR
    </CButton>
  );

  const fetchData = React.useCallback(async () => {
    document.getElementById("divLoading").className = "show";
    if (UserType == "Manager") {
      await axios.get(MyApiUrl + "CouponForManager/" + UserID + "").then((response) => {
        if (response.data.length != 0) {
          const items = response.data.map((item) => {
            return {
              ...item,
              "Coupon Type": item.COUPONS_TYPE_NAME,
              "Coupon Name": item.COUPONS_NAME,
              "Coupon Code": item.COUPONS_CODE,
              "Coupon Price/Percentage": item.COUPONS_PRICE_OR_PERCENTAGE,
              "Coupon Discount": item.COUPONS_DISCOUNT,
              "Coupon Validity": item.COUPONS_VALIDITY,
            };
          });
          setResponseData(items);
        }
        else {
          setResponseData([]);
        }
      });
    }
    else {
      await axios.get(MyApiUrl + "Coupon").then((response) => {
        if (response.data.length != 0) {
          const items = response.data.map((item) => {
            return {
              ...item,
              "Coupon Type": item.COUPONS_TYPE_NAME,
              "Coupon Name": item.COUPONS_NAME,
              "Coupon Code": item.COUPONS_CODE,
              "Coupon Price/Percentage": item.COUPONS_PRICE_OR_PERCENTAGE,
              "Coupon Discount": item.COUPONS_DISCOUNT,
              "Coupon Validity": item.COUPONS_VALIDITY,
            };
          });
          setResponseData(items);
        }
        else {
          setResponseData([]);
        }
      });
    }
    const date = new Date();
    var couponCode = voucher_codes.generate({
      postfix: "-" + date.getFullYear(),
      length: 8,
      count: 1
    });
    setcouponCode(couponCode.toString());
    document.getElementById("divLoading").className = "hide";
  }, []);

  const reset = () => {
    setcouponPkid("");
    setcouponType("");
    setcouponName("");
    setcouponCode("");
    setcouponPrice("");
    setcouponDiscout("");
    setcouponValidity(couponValidity);
    setItemBased(false);
    setOutlets([]);
    setItems([]);
    setAddButton(true);
    setUpdateButton(false);
    setReloadButton(false);
    setClearButton(true);
    fetchData();
    getOutlet_Items();
  };

  const getOutlet_Items = async () => {
    document.getElementById("divLoading").className = "show";
    if (UserType == "Manager") {
      await axios.get(MyApiUrl + "OutletsByManager/" + UserID + "").then((response) => {
        const items = response.data.map((item, index) => {
          return {
            ...item,
            "value": item.STORE_PKID,
            "label": item.STORE_NAME,
          };
        });
        setOutletList(items);
      });
    } else {
      await axios.get(MyApiUrl + "Outlets").then((response) => {
        const items = response.data.map((item, index) => {
          return {
            ...item,
            "value": item.STORE_PKID,
            "label": item.STORE_NAME,
          };
        });
        setOutletList(items);
      });
    }
    await axios.get(MyApiUrl + "Items").then((response) => {
      const items = response.data.map((item, index) => {
        return {
          ...item,
          "value": item.ITEMS_PKID,
          "label": item.ITEMS_NAME,
        };
      });
      setItemsList(items);
    });
    document.getElementById("divLoading").className = "hide";
  }

  React.useEffect(() => {
    fetchData();
    getOutlet_Items();
  }, []);

  React.useEffect(() => {
    if (OutletList.length > 0) {
      OutletList.length == Outlets.length ? setShow(true) : setShow(false);
    }
  }, [Outlets]);

  React.useEffect(() => {
    if (ItemsList.length > 0) {
      ItemsList.length == Items.length ? setShow1(true) : setShow1(false);
    }
  }, [Items]);

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
      <h1 id="ccmaster">Manage Coupons</h1>
      <CRow style={{ marginTop: "3%" }}>
        <CCol md="12">
          <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
            <CCardHeader>Add/Update Coupons</CCardHeader>
            <CCardBody>
              <CForm action="" method="post">
                <CFormGroup row>
                  <CCol lg="4" md="12">
                    <CLabel>Coupon Type <span style={{ color: "red" }}>*</span></CLabel>
                    <CInput
                      type="text"
                      id="couponName"
                      name="couponName"
                      value={couponType}
                      placeholder="Enter Coupon Type"
                      onChange={couponTypeChange}
                    />
                  </CCol>
                  <CCol lg="4" md="12">
                    <CLabel htmlFor="">Coupon Name <span style={{ color: "red" }}>*</span></CLabel>
                    <CInput
                      type="text"
                      id="couponName"
                      name="couponName"
                      value={couponName}
                      placeholder="Enter Coupon Name"
                      onChange={(event) => {
                        let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                        value = value.replace(/\w+/g,
                          function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setcouponName(value)
                      }}

                    />
                  </CCol>
                  <CCol lg="4" md="12">
                    <CLabel htmlFor="">Coupon Code <span style={{ color: "red" }}>*</span></CLabel>
                    <CInput
                      id="text-input1"
                      name="text-input"
                      placeholder="Enter Coupon Code"
                      type="text"
                      readOnly="true"
                      value={couponCode}
                      onChange={couponCodeChange}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol lg="4" md="12">
                    <CLabel>Coupon Price/Percentage <span style={{ color: "red" }}>*</span></CLabel>
                    <CSelect
                      custom
                      name="couponPrice"
                      id="couponPrice"
                      value={couponPrice}
                      onChange={couponPriceChange}
                    >
                      <option value="-1">Select Discount Type</option>
                      <option value="Price">Price</option>
                      <option value="Percentage"> Percentage</option>
                    </CSelect>
                  </CCol>
                  <CCol lg="4" md="12">
                    <CLabel htmlFor="">Coupon Discount <span style={{ color: "red" }}>*</span></CLabel>
                    <CInput
                      type="numbers"
                      id="couponDiscout"
                      name="couponDiscout"
                      value={couponDiscout}
                      placeholder="Enter Coupon Discount"
                      onChange={(event) => {
                        let value = event.target.value;
                        value = value.replace(/[^0-9]/gi, "");
                        setcouponDiscout(value)
                      }}
                    />
                  </CCol>
                  <CCol lg="4" md="12">
                    <CLabel htmlFor="">Coupon Validity <span style={{ color: "red" }}>*</span></CLabel>
                    <CInput
                      type="text"
                      id="couponValidity"
                      name="couponValidity"
                      onChange={couponValidityChange}
                      value={couponValidity}
                      readOnly="true"
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol lg="4" md="12">
                    <CLabel htmlFor="">Outlets <span style={{ color: "red" }}>*</span></CLabel>
                    {Show == true ?
                      <MultiSelect
                        options={OutletList}
                        value={Outlets}
                        onChange={setOutlets}
                        labelledBy="Select Outlets"
                        valueRenderer={() => ("All Outlets Selected")}
                      />
                      :
                      <MultiSelect
                        options={OutletList}
                        value={Outlets}
                        onChange={setOutlets}
                        labelledBy="Select Outlets"
                      />
                    }
                  </CCol>
                  <CCol lg="4" md="12">
                    <CLabel htmlFor="">Item Based</CLabel>
                    <div>
                      <ReactSwitch
                        checked={ItemBased}
                        onChange={(event) => {
                          setItemBased(event);
                        }}
                      />
                    </div>
                  </CCol>
                  {ItemBased == true ?
                    <CCol lg="4" md="12">
                      <CLabel htmlFor="">Items <span style={{ color: "red" }}>*</span></CLabel>
                      {Show1 == true ?
                        <MultiSelect
                          options={ItemsList}
                          value={Items}
                          onChange={setItems}
                          labelledBy="Select Items"
                          valueRenderer={() => ("All Items Selected")}
                        />
                        :
                        <MultiSelect
                          options={ItemsList}
                          value={Items}
                          onChange={setItems}
                          labelledBy="Select Items"
                        />
                      }
                    </CCol>
                    :
                    null}
                </CFormGroup>
                <CRow>
                  <CCol lg="12" md="12">
                    {ReloadButton && <Reloadbtn />}
                    {UpdateButton && <Updatebtn />}
                    {ClearButton && <Clearbtn />}
                    {AddButton && <Addbtn />}
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow style={{ marginTop: "2%" }}>
        <CCol md="12">
          <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
            <CCardHeader>View Coupons</CCardHeader>
            <CCardBody>
              <CDataTable
                items={responseData}
                fields={fields2}
                striped
                itemsPerPage={5}
                pagination
                sorter
                size="sm"
                tableFilter={table}
                itemsPerPageSelect={items}
                scopedSlots={{
                  Action: (item) => (
                    <td>
                      <CButton
                        onClick={() => {
                          EditCoupon(
                            item.COUPONS_PKID,
                            item.COUPONS_TYPE_NAME,
                            item.COUPONS_NAME,
                            item.COUPONS_CODE,
                            item.COUPONS_PRICE_OR_PERCENTAGE,
                            item.COUPONS_DISCOUNT,
                            item.COUPONS_VALIDITY,
                            item.COUPONS_ITEM_BASED,
                            item.Outlets,
                            item.Items,
                          );
                        }}
                        size="sm"
                        id="war-btn"
                      >
                        <EditIcon />
                      </CButton>
                      <CButton
                        size="sm"
                        id="war-btn1"
                        onClick={() => {
                          DeleteCoupon(item.COUPONS_PKID);
                        }}
                      >
                        <DeleteSharpIcon />
                      </CButton>
                    </td>
                  ),
                  Outlets: (item) => (
                    <td>
                      <CButton
                        className="btn btn-info"
                        style={{ fontSize: "12px" }}
                        onClick={() => {
                          ViewOutlets(item.Outlets);
                        }}
                      >
                        View
                      </CButton>
                    </td>
                  ),
                  Items: (item) => (
                    <td>
                      {item.Items.length > 0 ?
                        <CButton
                          className="btn btn-info"
                          style={{ fontSize: "12px" }}
                          onClick={() => {
                            ViewItems(item.Items);
                          }}
                        >
                          View
                        </CButton>
                        :
                        "-"
                      }
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal show={block} onClose={() => setBlock(!block)} color="dark" style={{ height: 480 }}>
        <CModalHeader closeButton>
          <CModalTitle>Outlets</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md="12">
              <CDataTable
                items={InnerTableData}
                fields={fields}
                hover
                striped
                bordered
                sorter
                tableFilter={table}
                itemsPerPageSelect={items}
                columnFilterSlot
                size="sm"
                itemsPerPage={5}
                pagination
              />
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
      <CModal show={block1} onClose={() => setBlock1(!block1)} color="dark" style={{ height: 480 }}>
        <CModalHeader closeButton>
          <CModalTitle>Items</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md="12">
              <CDataTable
                items={InnerTableData1}
                fields={fields1}
                hover
                striped
                bordered
                sorter
                tableFilter={table}
                itemsPerPageSelect={items}
                columnFilterSlot
                size="sm"
                itemsPerPage={5}
                pagination
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="btn btn-danger"
            style={{ fontSize: "12px" }}
            onClick={() => setBlock1(!block1)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>

  );
};

export default CouponManage;
