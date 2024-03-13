import React, { useEffect } from "react";
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

// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  const UserID = sessionStorage.getItem("UserID");

  const getNav = () => {
    if (UserID == null || UserID == "") {
      history.push("/");
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
          <a onClick={() => history.push("/OutletDashboard")}>
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
      <CSidebarNav>
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      {/* <CSidebarMinimizer className="c-d-md-down-none" /> */}
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
