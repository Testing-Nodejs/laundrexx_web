import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  CButton,
  CForm,
  CInput,
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
    if (email === "" || email === null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Email Address!",
      });
    } else if (password === "" || password === null) {
      Toast.fire({
        icon: "warning",
        title: "Please Enter Password!",
      });
    } else {
      var obj = {
        UserName: email,
        Password: password
      }
      axios.post(MyApiUrl + "ManagerLogin/", obj).then((response) => {
        console.log(response);
        if (response.data === false) {
          Swal.fire({
            title: "Please Enter valid Credentials",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          window.location.href = "/dashboard";
          sessionStorage.setItem("UserID", response.data[0].USER_PKID);
          sessionStorage.setItem("UserTypeID", response.data[0].USER_TYPE_FKID);
          sessionStorage.setItem("SessionType", "Manager");
          sessionStorage.setItem("UserPassword", response.data[0].USER_PASSWORD);
          sessionStorage.setItem("UserName", response.data[0].USER_NAME);
        }
      });
    }
  };

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
                <h3>Manager Login</h3>
                <CInput
                  type="text"
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
