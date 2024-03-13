import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader, CToggler, CHeaderBrand, CCol, CRow,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import avatar8 from '../assets/Zeus_Images/user-icon.png';
import DateRangeIcon from '@material-ui/icons/DateRange';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
const TheHeader = () => {
  const [Time, setTime] = useState();
  const [CDate, setCDate] = useState();
  const UserTypeID = sessionStorage.getItem("UserTypeID");
  const SessionType = sessionStorage.getItem("SessionType");
  const LogoutSubmit = sessionStorage.getItem("LogoutSubmit");
  const UserName = sessionStorage.getItem("UserName");
  const StoreName = sessionStorage.getItem("StoreName");

  const GetDates = () => {
    var showdate = new Date();
    const mon = (showdate.getMonth() + 1).toString().padStart(2, "0");
    setCDate(
      showdate.getDate().toString().padStart(2, "0") +
      "-" +
      mon +
      "-" +
      showdate.getUTCFullYear()
    );
    setTime(showdate.toLocaleTimeString());
  };

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const getSidebarActiveforOutlet = () => {
    dispatch({ type: "set", sidebarShow: false });
  };
  React.useEffect(() => {
    if (SessionType == "Outlet") {
      getSidebarActiveforOutlet();
    }
    const interval = setInterval(() => {
      GetDates();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const callLogout = () => {
    window.location.href = "/";
    sessionStorage.setItem("UserID", null);
    sessionStorage.setItem("UserTypeID", null);
    sessionStorage.setItem("SessionType", null);
    sessionStorage.setItem("UserPassword", null);
    sessionStorage.setItem("StoreID", null);
    sessionStorage.setItem("UserName", null);
    sessionStorage.setItem("StoreName", null);
  }
  return (
    <CHeader withSubheader>
      <CRow style={{ marginTop: "1%" }}>
        <CCol md="1" style={{ width: "10%" }}>
          <CToggler
            inHeader
            className="ml-md-3 d-lg-none"
            onClick={toggleSidebarMobile}
          />
          <CToggler
            inHeader
            className="ml-3 d-md-down-none"
            onClick={toggleSidebar}
          />
          <CHeaderBrand className="mx-auto d-lg-none" to="/"></CHeaderBrand>
        </CCol>
        <CCol md="10" style={{ width: "80%" }}>

          {SessionType == "Admin" ?
            <h5 className="MainHeader">LAUNDREXX CONTENT MANAGEMENT SYSTEM</h5> :
            SessionType == "Manager" ?
              <CRow>
                <CCol md="6" style={{ alignSelf: "center" }}>
                  <h5 className="MainHeader">MANAGER PORTAL</h5>
                </CCol>
                <CCol md="6" style={{ alignSelf: "center" }}>
                  <h6 className="OutletHeader">Welcome : {UserName}</h6>
                </CCol>
              </CRow>
              :
              SessionType == "Factory" ?
                <CRow>
                  <CCol md="4" style={{ alignSelf: "center" }}>
                    <h6 className="OutletHeader">Factory : {StoreName}</h6>
                  </CCol>
                  <CCol md="4" style={{ alignSelf: "center" }}>
                    <h5 className="MainHeader">FACTORY PORTAL</h5>
                  </CCol>
                  <CCol md="4" style={{ alignSelf: "center" }}>
                    <h6 className="OutletHeader">Welcome : {UserName}</h6>
                  </CCol>
                </CRow>
                :
                <CRow>
                  <CCol md="4" style={{ alignSelf: "center" }}>
                    <h6 className="OutletHeader">Outlet : {StoreName}</h6>
                  </CCol>
                  <CCol md="4" style={{ alignSelf: "center" }}>
                    <h5 className="MainHeader">OUTLET PORTAL</h5>
                  </CCol>
                  <CCol md="4" style={{ alignSelf: "center" }}>
                    <h6 className="OutletHeader">Welcome : {UserName}</h6>
                  </CCol>
                </CRow>
          }
        </CCol>

        <CCol md="1" style={{ width: "10%", alignSelf: "center" }}>
          <CDropdown variant="nav-item" style={{ marginTop: "-7px" }}>
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false} style={{ float: "right", marginRight: "10px", paddingLeft: "0px", paddingRight: "0px" }}>
              <CImg src={avatar8} size="md" style={{ width: "45px" }} />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              {SessionType == "Admin" ? null :
                <div>
                  <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                    <AccountBoxIcon />
                    {UserName}
                  </CDropdownHeader>
                  <CDropdownDivider />
                </div>
              }
              <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Date & Time</CDropdownHeader>
              <CDropdownItem>
                <DateRangeIcon />
                <span style={{ fontWeight: 400, fontSize: "14px" }}>{CDate}</span>
              </CDropdownItem>
              <CDropdownItem>
                <QueryBuilderIcon />
                <span style={{ fontWeight: 400, fontSize: "14px" }}>{Time}</span>
              </CDropdownItem>
              <CDropdownDivider />
              <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Account</CDropdownHeader>
              {SessionType == "Admin" ? null
                :
                SessionType == "Manager" ?
                  <CDropdownItem href="/ManagerProfile">
                    <PersonOutlineIcon />
                    <span style={{ fontWeight: 400, fontSize: "14px" }}>Profile</span>
                  </CDropdownItem>
                  : SessionType == "Factory" ?
                    null
                    :
                    <CDropdownItem href="/OutletProfile">
                      <PersonOutlineIcon />
                      <span style={{ fontWeight: 400, fontSize: "14px" }}>Profile</span>
                    </CDropdownItem>
              }
              {SessionType == "Admin" || SessionType == "Manager" ?
                <CDropdownItem href="/ChangePassword">
                  <LockOpenIcon />
                  <span style={{ fontWeight: 400, fontSize: "14px" }}>Change Password</span>
                </CDropdownItem>
                :
                null
              }
              {SessionType == "Outlet" ?
                LogoutSubmit == false || LogoutSubmit == "false" ?
                  <CDropdownItem href="/OutletDayClose">
                    <ExitToAppIcon />
                    <span style={{ fontWeight: 400, fontSize: "14px" }}>Logout</span>
                  </CDropdownItem>
                  :
                  <CDropdownItem onClick={callLogout}>
                    <ExitToAppIcon />
                    <span style={{ fontWeight: 400, fontSize: "14px" }}>Logout</span>
                  </CDropdownItem>
                :
                <CDropdownItem onClick={callLogout}>
                  <ExitToAppIcon />
                  <span style={{ fontWeight: 400, fontSize: "14px" }}>Logout</span>
                </CDropdownItem>
              }
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>
    </CHeader>
  );
};

export default TheHeader;
