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
  CDataTable,
  CRow,
  CButton,
  CCardFooter,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import LockOpenSharpIcon from "@material-ui/icons/LockOpenSharp";
import NoEncryptionSharpIcon from "@material-ui/icons/NoEncryptionSharp";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import "../../style.css";
import Swal from "sweetalert2";
import { MyApiUrl, ViewImg } from "src/services/service";

const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields = [{ key: "Action" }, { key: "Category" }];

const ItemCategory = () => {
  const history = useHistory();
  const [categoryPkid, setCategoryPkid] = useState("");
  const [AddButton, setAddButton] = useState(true);
  const [UpdateButton, setUpdateButton] = useState(false);
  const [ReloadButton, setReloadButton] = useState(false);
  const [ClearButton, setClearButton] = useState(true);


  const [category, setCategory] = useState("");

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

  // const CateroryChange = (event) => {
  //   setCategory(event.target.value);
  // };

  const addMerchant = () => {
    console.log(category);
    if (category == "" || category == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Item Category",
      });
    } else {
      const obj = {
        ITEM_CATEGORY_NAME: category,
      };
      axios.post(MyApiUrl + "/ItemCategory", obj)
        .then((response) => {
          if (response.data == "0") {
            Toast.fire({
              icon: "error",
              title: "Item Category Already Exist",
            });
          } else if (response.data == "1") {
            Toast.fire({
              icon: "success",
              title: "Item Category Details Added",
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
  const UpdateCategory = () => {
    if (category == "" || category == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Item Category",
      });
    } else {
      const obj = {
        ITEM_CATEGORY_NAME: category,
      };
      axios.put(MyApiUrl + "ItemCategory/" + categoryPkid + "", obj)
        .then((response) => {
          if (response.data == "0") {
            Toast.fire({
              icon: "error",
              title: "Item Category Already Exist",
            });
          } else if (response.data == "1") {
            Toast.fire({
              icon: "success",
              title: "Item Category Details Updated",
            });
            reset();
          }
        });
    }
  };

  const EditCategory = (id, category) => {
    setCategoryPkid(id);
    setCategory(category);
    setAddButton(false);
    setUpdateButton(true);
    setReloadButton(true);
    setClearButton(false);
  };

  const DeleteCategory = (id) => {
    document.getElementById("divLoading").className = "show";
    var res = confirm("Are you sure you want to delete?");
    if (res) {
      axios({
        method: "DELETE",
        url: MyApiUrl + "ItemCategory/" + id + "",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          if (response.data === true) {
            Swal.fire({
              title: "Selected Category Deleted!",
              icon: "success",
              confirmButtonText: "OK",
            });
            reset();
            document.getElementById("divLoading").className = "hide";
          } else {
            Swal.fire({
              title: "Failed To Delete Category!",
              icon: "error",
              confirmButtonText: "OK",
            });
            document.getElementById("divLoading").className = "hide";
          }
        })
    }
  };


  const Updatebtn = () => (
    <CButton type="button" onClick={UpdateCategory} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
      UPDATE
    </CButton>
  );

  const Addbtn = () => (
    <CButton type="button" onClick={addMerchant} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
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
    axios.get(MyApiUrl + "ItemCategory").then((response) => {
      if (response.data.length != 0) {
        const items = response.data.map((item) => {
          return {
            ...item,
            Category: item.ITEM_CATEGORY_NAME
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
    setCategoryPkid("");
    setCategory("");
    setAddButton(true);
    setUpdateButton(false);
    setReloadButton(false);
    setClearButton(true);
    fetchData();
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
<CRow>
    <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
        <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
            <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
        </span>
    </CCol>
</CRow>
      <h1 id="ccmaster">Manage Item Category</h1>
      <CRow style={{ marginTop: "3%" }}>
        <CCol md="5">
          <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
            <CCardHeader>Add/Update Item Category</CCardHeader>
            <CCardBody>
              <CForm action="" method="post">
                <CFormGroup>
                  <CLabel htmlFor="">Item Category <span style={{ color: "red" }}>*</span></CLabel>
                  <CInput
                    type="text"
                    id="category"
                    name="category"
                    value={category}
                    placeholder="Enter Item Category"
                    onChange={(event) => {
                      let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                      value = value.replace(/\w+/g,
                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setCategory(value)
                    }}

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
            <CCardHeader>View Item Category</CCardHeader>
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
                          EditCategory(
                            item.ITEM_CATEGORY_PKID,
                            item.ITEM_CATEGORY_NAME
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
                          DeleteCategory(item.ITEM_CATEGORY_PKID);
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

export default ItemCategory;
