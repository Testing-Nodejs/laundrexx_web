import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
// For Outlet - TheLayout1
const TheLayout1 = React.lazy(() => import("./containers/TheLayout"));

// For Factory - TheLayout2
const TheLayout2 = React.lazy(() => import("./containers/TheLayout2"));

// For Admin And Managers - TheLayout3
const TheLayout3 = React.lazy(() => import("./containers/TheLayout3"));

// Pages
const Login = React.lazy(() => import("./login/Login"));
const OutletLogin = React.lazy(() => import("./login/OutletLogin"));
const FactoryLogin = React.lazy(() =>
  import("./login/FactoryLogin")
);
const ManagerLogin = React.lazy(() => import("./login/ManagerLogin"));
const AdminLogin = React.lazy(() => import("./login/AdminLogin"));

class App extends Component {
  render() {
    console.log(localStorage.getItem("LoginType"));
    if (
      localStorage.getItem("LoginType") === null ||
      localStorage.getItem("LoginType") === "" ||
      localStorage.getItem("LoginType") === undefined
    ) {
      localStorage.setItem("LoginType", "-1");
    }
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route
              exact
              path="/"
              name="Home"
              render={(props) => {
                localStorage.setItem("LoginType", "Home");
                return <Login {...props} />;
              }}
            />
            <Route
              exact
              path="/OutletLogin"
              name="Home"
              render={(props) => {
                localStorage.setItem("LoginType", "Outlet");
                return <OutletLogin {...props} />;
              }}
            />
            <Route
              exact
              path="/FactoryLogin"
              name="Home"
              render={(props) => {
                localStorage.setItem("LoginType", "Factory");
                return <FactoryLogin {...props} />;
              }}
            />
            <Route
              exact
              path="/ManagerLogin"
              name="Home"
              render={(props) => {
                localStorage.setItem("LoginType", "Manager");
                return <ManagerLogin {...props} />;
              }}
            />
            <Route
              exact
              path="/AdminLogin"
              name="Home"
              render={(props) => {
                localStorage.setItem("LoginType", "Admin");
                return <AdminLogin {...props} />;
              }}
            />
            <Route
              path="/"
              name="Home"
              render={(props) => {
                if (
                  localStorage.getItem("LoginType") === "Outlet"
                ) {
                  return <TheLayout1 {...props} />;
                } else if (
                  localStorage.getItem("LoginType") === "Factory"
                ) {
                  return <TheLayout2 {...props} />;
                } else if (localStorage.getItem("LoginType") === "Manager") {
                  return <TheLayout3 {...props} />;
                } else if (localStorage.getItem("LoginType") === "Admin") {
                  return <TheLayout3 {...props} />;
                } else {
                  return <Login {...props} />;
                }
              }}
            />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
