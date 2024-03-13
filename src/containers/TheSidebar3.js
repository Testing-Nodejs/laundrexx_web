import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import NavigateNextIcon from "@material-ui/icons/FormatAlignJustify";
// import NavigateNextIcon2 from "@material-ui/icons/Minimize";
import NavigateNextIcon2 from "@material-ui/icons/NavigateNext";

// sidebar nav config
import navigation from "./_nav3";

const TheSidebar = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  const UserID = sessionStorage.getItem("UserID");
  const UserTypeID = sessionStorage.getItem("UserTypeID");
  const SessionType = sessionStorage.getItem("SessionType");
  const [navItems, setNavItems] = useState([]);
  const getNav = async () => {
    if (UserID == null || UserID == "") {
      history.push("/");
    }
    else {
      await axios.get(MyApiUrl + "GetManagerNavigation/" + UserTypeID + "").then((response) => {
        if (response.data == null || response.data == undefined || response.data == "") {
          setNavItems([]);
        }
        else {
          setNavItems(response.data);
        }
      });
    }
  }
  useEffect(() => {
    getNav();
  }, []);
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none">
        <div>
          <a onClick={() => history.push("/dashboard")}>
            <img
              className="c-avatar-img"
              src="avatars/Laundrexx.png"
              style={{
                padding: "1px",
                borderBottom: "1px solid #ebedef !important",
              }}
              alt="Avatar"
            />
          </a>
        </div>
      </CSidebarBrand>
      {navItems.length > 0 ?
        <CSidebarNav>
          <CCreateElement
            items={navItems}
            components={{
              CSidebarNavDivider,
              CSidebarNavDropdown,
              CSidebarNavItem,
              CSidebarNavTitle,
            }}
          />
        </CSidebarNav>
        : null}
      {/* <CSidebarMinimizer className="c-d-md-down-none" /> */}
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
