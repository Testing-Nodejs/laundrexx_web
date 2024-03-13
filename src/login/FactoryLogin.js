import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  CButton,
  CForm,
  CInput,
  CSelect,
} from "@coreui/react";
import { MyApiUrl } from "src/services/service";
import "../LoginScreen.css";

import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import CIcon from "@coreui/icons-react";

const AdminLogin = () => {

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

  const [email, setemail] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [FactoryList, setFactoryList] = React.useState([]);
  const [Factory, setFactory] = React.useState("-1");

  const EmailChange = (event) => {
    setemail(event.target.value);
  };

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setpassword(event.target.value);
  };

  const handleClick = () => {
    if (Factory === "-1") {
      Toast.fire({
        icon: "warning",
        title: "Please Select Factory!",
      });
    }
    else if (email === "" || email === null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter User Name!",
      });
    } else if (password === "" || password === null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Password!",
      });
    } else {
      var obj = {
        FactoryID: Factory,
        UserName: email,
        Password: password
      }

      axios.post(MyApiUrl + "FactoryLogin/", obj).then((response) => {
        if (response.data === false) {
          Swal.fire({
            title: "Please Enter valid Credentials",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          window.location.href = "/FactoryDashboard";
          sessionStorage.setItem("UserID", response.data[0].FACTORY_STAFF_PKID);
          sessionStorage.setItem("FactoryID", response.data[0].FACTORY_PKID);
          sessionStorage.setItem("StoreName", response.data[0].FACTORY_NAME);
          sessionStorage.setItem("SessionType", "Factory");
          sessionStorage.setItem("UserPassword", response.data[0].FACTORY_STAFF_PASSWORD);
          sessionStorage.setItem("UserName", response.data[0].FACTORY_STAFF_NAME);
        }
      });
    }
  };

  const getFactory = async () => {
    await axios.get(MyApiUrl + "Factory").then((response) => {
      const FactoryOption = response.data.map((item) => (
        <option value={item.FACTORY_PKID}>{item.FACTORY_NAME}</option>
      ));
      setFactoryList(FactoryOption);
    });
  };

  React.useEffect (() => {
    getFactory();
  },[]);

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <div className="container">
        <div className="row firstcard">
          <div className="col-md-5" style={{ borderRight: "1px solid #d1d1d1", padding: "3%" }}>
            <div className="top_link">
              <a href="/">
                <CIcon name="cil-home"
                  customClasses="c-sidebar-nav-icon" />
                Return Home
              </a>
            </div>
            <div className="contact">
              <CForm>
                <h3>Factory Login</h3>
                <CSelect
                  custom
                  name="ProductCategory"
                  id="ProductCategory"
                  value={Factory}
                  onChange={(event) => {
                    setFactory(event.target.value);
                  }}
                >
                  <option value="-1">Select Factory</option>
                  {FactoryList}
                </CSelect>
                <CInput
                  type="email"
                  placeholder="User Name"
                  autoComplete="off"
                  onChange={EmailChange}
                  style={{ fontSize: "14px" }}
                />
                <Input
                  type={values.showPassword ? "text" : "password"}
                  onChange={handlePasswordChange("password")}
                  value={values.password}
                  placeholder="Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <CButton className="submit" onClick={handleClick}>LOGIN</CButton>
              </CForm>
            </div>
          </div>
          <div className="col-md-7" style={{ alignSelf: "center", textAlign: "center" }}>
            <div>
              <h2>Laundrexx</h2>
              <h5>Laundry and Dry Cleaners</h5>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
