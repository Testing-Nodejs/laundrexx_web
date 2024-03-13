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
  CSelect,
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
const fields = [{ key: "Action" }, { key: "Category" }, { key: "Sub Category" }];

const ItemSubCategory = () => {
  const history = useHistory();
  const [categoryPkid, setCategoryPkid] = useState("");
  const [AddButton, setAddButton] = useState(true);
  const [UpdateButton, setUpdateButton] = useState(false);
  const [ReloadButton, setReloadButton] = useState(false);
  const [ClearButton, setClearButton] = useState(true);
  const [ItemData, setItemData] = useState();

  const [category, setCategory] = useState("-1");
  const [subcategory, setSubCategory] = useState("");
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

  const addMerchant = () => {
    if (category == "-1" || category == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Select Item Category!",
      });
    } else if (subcategory == "" || subcategory == null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Item Sub Category!",
      });
    } else {
      const obj = {
        SUB_CATEGORY_CATEGORY_FKID: category,
        SUB_CATEGORY_NAME: subcategory,
      };
      axios
        .post(MyApiUrl + "/ItemSubCategory", obj)
        .then((response) => {
          if (response.data == "0") {
            Toast.fire({
              icon: "error",
              title: "Item Sub Category Already Exist!",
            });
          } else if (response.data == "1") {
            Toast.fire({
              icon: "success",
              title: "Item Sub Category Added!",
            });
            reset();
          } else if (response.data == "2") {
            Toast.fire({
              icon: "error",
              title: "Failed To Add!",
            });
          }
        });
    }
  };
  const UpdateCategory = () => {
    if (category == "-1" || category == null) {
      alert("Please Select Item Category!");
    } else if (subcategory == "" || subcategory == null) {
      alert("Please Enter Item Sub Category!");
    } else {
      const obj = {
        SUB_CATEGORY_CATEGORY_FKID: category,
        SUB_CATEGORY_NAME: subcategory,
      };
      axios
        .put(MyApiUrl + "/ItemSubCategory/" + categoryPkid + "", obj)
        .then((response) => {
          if (response.data == "0") {
            Toast.fire({
              icon: "error",
              title: "Failed to update!",
            });
          } else if (response.data == "1") {
            Toast.fire({
              icon: "success",
              title: "Sub Category Details Updated!",
            });
            reset();
          }
        });
    }
  };
  const reset = () => {
    setCategoryPkid("");
    setCategory("-1");
    setSubCategory("");
    setAddButton(true);
    setUpdateButton(false);
    setReloadButton(false);
    setClearButton(true);
    fetchData();
    GetCategory();
  }

  const EditCategory = (id, category, subcategory) => {
    setCategoryPkid(id);
    setCategory(category);
    setSubCategory(subcategory);
    setAddButton(false);
    setUpdateButton(true);
    setReloadButton(true);
    setClearButton(false);
  };

  const ItemCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  // const ItemSubCategoryChange = (event) => {
  //   setSubCategory(event.target.value);
  // };

  const DeleteCategory = (id) => {
    document.getElementById("divLoading").className = "show";
    var res = confirm("Are you sure you want to delete?");
    if (res) {
      axios({
        method: "DELETE",
        url: MyApiUrl + "ItemSubCategory/" + id + "",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          if (response.data === true) {
            Swal.fire({
              title: "Selected Sub Category Deleted!",
              icon: "success",
              confirmButtonText: "OK",
            });
            reset();
            document.getElementById("divLoading").className = "hide";
          } else {
            Swal.fire({
              title: "Failed To Delete Sub Category!",
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
    axios.get(MyApiUrl + "ItemSubCategory").then((response) => {
      if (response.data.length != 0) {
        const items = response.data.map((item) => {
          return {
            ...item,
            Category: item.ITEM_CATEGORY_NAME,
            "Sub Category": item.SUB_CATEGORY_NAME
          };
        });
        setResponseData(items);
      }
      else {
        setResponseData([]);
      }
    });
  }, []);

  const GetCategory = () => {
    axios.get(MyApiUrl + "ItemCategory").then((response) => {
      if (response.data.length != 0) {
        const CategoryOption = response.data.map((item) => (
          <option value={item.ITEM_CATEGORY_PKID}>{item.ITEM_CATEGORY_NAME}</option>
        ));
        setItemData(CategoryOption);
      }
      else {
        setItemData([]);
      }
    });
  };

  const Reload = () => {
    reset();
  };

  React.useEffect(() => {
    fetchData();
    GetCategory();
  }, []);

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
      <h1 id="ccmaster">Manage Item Sub Category</h1>
      <CRow style={{ marginTop: "3%" }}>
        <CCol md="5">
          <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
            <CCardHeader>Add/Update Item Sub Category</CCardHeader>
            <CCardBody>
              <CForm action="" method="post">
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CLabel>Item Category <span style={{ color: "red" }}>*</span></CLabel>
                    <CSelect
                      custom
                      name="ProductCategory"
                      id="ProductCategory"
                      value={category}
                      onChange={ItemCategoryChange}
                    >
                      <option value="-1">Select Item Category</option>
                      {ItemData}
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="">Item Sub Category <span style={{ color: "red" }}>*</span></CLabel>
                  <CInput
                    type="text"
                    id="ItemSubCategory"
                    name="ItemSubCategory"
                    value={subcategory}
                    placeholder="Enter Item Sub Category"
                    onChange={(event) => {
                      let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                      value = value.replace(/\w+/g,
                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setSubCategory(value)
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
            <CCardHeader>View Item Sub Category</CCardHeader>
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
                            item.SUB_CATEGORY_PKID,
                            item.SUB_CATEGORY_CATEGORY_FKID,
                            item.SUB_CATEGORY_NAME,
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
                          DeleteCategory(item.SUB_CATEGORY_PKID);
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

export default ItemSubCategory;
