import React, { useState } from "react";
import ReactSwitch from 'react-switch';
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
  CForm,
  CFormGroup,
  CInput,
  CLabel,
} from "@coreui/react";
import EditIcon from "@material-ui/icons/Edit";
import LockOpenSharpIcon from "@material-ui/icons/LockOpenSharp";
import NoEncryptionSharpIcon from "@material-ui/icons/NoEncryptionSharp";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import "../../style.css";
import Swal from "sweetalert2";
import { MyApiUrl, ViewImg } from "src/services/service";
/* eslint-disable no-restricted-globals */

const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields = [{ key: "Action" }, { key: "Coupon Type" }, { key: "Coupon Type Based On" }];

const Coupantype = () => {
  const [CouponTypePkid, setCouponTypePkid] = useState("");
  const [AddButton, setAddButton] = useState(true);
  const [UpdateButton, setUpdateButton] = useState(false);
  const [ReloadButton, setReloadButton] = useState(false);
  const [ClearButton, setClearButton] = useState(true);


  const [CouponType, setCouponType] = useState("");
  // const [itembased, setitembased] = useState("");

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

  // const CouponTypeChange = (event) => {
  //   setCouponType(event.target.value);
  // };


  const [itembased, setitembased] = useState(false);
  const itembasedChange = event => {
    setitembased(event);
  };


  const addCoupontype = () => {
    console.log(CouponType);
    if (CouponType == "" || CouponType == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Type",
      });
    } else {
      const obj = {
        COUPON_TYPE_NAME: CouponType,
        COUPON_TYPE_IS_ITEM_BASED: itembased,
      };
      axios.post(MyApiUrl + "/CouponType ", obj)
        .then((response) => {
          if (response.data == "0") {
            Toast.fire({
              icon: "error",
              title: "Coupon Type Already Exist",
            });
          } else if (response.data == "1") {
            Toast.fire({
              icon: "success",
              title: "Coupon Type Added",
            });
            reset();
          } else if (response.data == "2") {
            Toast.fire({
              icon: "error",
              title: "Failed To Add",
            });
          }
        });
    }
  };

  const UpdateCouponType = () => {
    if (CouponType == "" || CouponType == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Coupon Type",
      });
    } else {
      const obj = {
        COUPON_TYPE_NAME: CouponType,
        COUPON_TYPE_IS_ITEM_BASED: itembased,
      };
      axios.put(MyApiUrl + "CouponType/" + CouponTypePkid + "", obj)
        .then((response) => {
          if (response.data == "0") {
            Toast.fire({
              icon: "error",
              title: "Coupon Type Already Exist",
            });
          } else if (response.data == "1") {
            Toast.fire({
              icon: "success",
              title: "Coupon Type Updated",
            });
            reset();
          }
        });
    }
  };

  const EditCouponType = (id, CouponType, itembased) => {
    setCouponTypePkid(id);
    setCouponType(CouponType);
    setitembased(itembased);
    setAddButton(false);
    setUpdateButton(true);
    setReloadButton(true);
    setClearButton(false);
  };

  const DeleteCouponType = (id) => {
    var res = confirm("Are you sure you want to delete?");
    if (res) {
      axios({
        method: "DELETE",
        url: MyApiUrl + "CouponType/" + id + "",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          if (response.data === true) {
            Swal.fire({
              title: "Selected Coupon Type Deleted!",
              icon: "success",
              confirmButtonText: "OK",
            });
            reset();
            document.getElementById("divLoading").className = "hide";
          } else {
            Swal.fire({
              title: "Failed To Delete Coupon Type!",
              icon: "error",
              confirmButtonText: "OK",
            });
            document.getElementById("divLoading").className = "hide";
          }
        })
    }
  };


  const Updatebtn = () => (
    <CButton type="button" onClick={UpdateCouponType} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
      UPDATE
    </CButton>
  );

  const Addbtn = () => (
    <CButton type="button" onClick={addCoupontype} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
      ADD
    </CButton>
  );

  const Reloadbtn = () => (
    <CButton type="button" onClick={Reload} className="btn btn-danger" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
      CANCEL
    </CButton>
  );

  const Clearbtn = () => (
    <CButton type="button" onClick={Reload} className="btn btn-warning" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
      CLEAR
    </CButton>
  );

  const [responseData, setResponseData] = useState("");

  const fetchData = React.useCallback(() => {
    axios.get(MyApiUrl + "CouponType ").then((response) => {
      if (response.data.length != 0) {
        const items = response.data.map((item) => {
          return {
            ...item,
            "Coupon Type": item.COUPON_TYPE_NAME,
            "Coupon Type Based On": item.COUPON_TYPE_IS_ITEM_BASED == 1 ? "Item Based" : "Order Based",

          };
        });
        setResponseData(items);
      }
      else {
        setResponseData([]);
      }
    });
  }, []);

  const reset = () => {
    setCouponTypePkid("");
    setCouponType("");
    setAddButton(true);
    setUpdateButton(false);
    setReloadButton(false);
    setClearButton(true);
    fetchData();
    setitembased(false);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const Reload = () => {
    reset();
  };
  return (
    <div className="123">
      <div id="divLoading"> </div>
      <h1 id="ccmaster">Manage Coupon Type</h1>
      <CRow style={{ marginTop: "3%" }}>
        <CCol md="5">
          <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
            <CCardHeader>Add/Update Coupon Type</CCardHeader>
            <CCardBody>
              <CForm action="" method="post">
                <CFormGroup>
                  <CLabel htmlFor="">Coupon Type <span style={{ color: "red" }}>*</span></CLabel>
                  <CInput
                    type="text"
                    id="CouponType"
                    name="CouponType"
                    placeholder="Enter Coupon Type"
                    value={CouponType}
                    onChange={(event) => {
                      let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                      value = value.replace(/\w+/g,
                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setCouponType(value)
                    }}

                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="checkout-itembased" className="designLabel">Is Item Based </CLabel><br></br>
                  <ReactSwitch
                    checked={itembased}
                    onChange={itembasedChange}
                  />
                </CFormGroup>

                {ReloadButton && <Reloadbtn />}
                {UpdateButton && <Updatebtn />}
                {ClearButton && <Clearbtn />}
                {AddButton && <Addbtn />}
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="7">
          <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
            <CCardHeader>View  Coupon Type</CCardHeader>
            <CCardBody>
              <CDataTable
                items={responseData}
                fields={fields}
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
                          EditCouponType(
                            item.COUPON_TYPE_PKID,
                            item.COUPON_TYPE_NAME,
                            item.COUPON_TYPE_IS_ITEM_BASED,
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
                          DeleteCouponType(item.COUPON_TYPE_PKID);
                        }}
                      >
                        <DeleteSharpIcon />
                      </CButton>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Coupantype;
