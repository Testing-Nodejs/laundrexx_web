import React from "react";
import NavigateNextIcon from "@material-ui/icons/FormatAlignJustify";
// import NavigateNextIcon2 from "@material-ui/icons/Minimize";
import NavigateNextIcon2 from "@material-ui/icons/NavigateNext";

const sessionID = localStorage.getItem("SessionID");

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <NavigateNextIcon />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Digital Signature",
    to: "/ManageDigitalSignature",
    icon: <NavigateNextIcon2 />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "User Management",
    route: "/master",
    icon: "cil-cursor",
    _children: [{
      _tag: "CSidebarNavItem",
      name: "User Type",
      to: "/UserType",
      icon: < NavigateNextIcon />,
    },
    {
      _tag: "CSidebarNavItem",
      name: "Roles",
      to: "/Roles",
      icon: < NavigateNextIcon />,
    },
    {
      _tag: "CSidebarNavItem",
      name: "Manage Users",
      to: "/ManageUsers",
      icon: < NavigateNextIcon />,
    },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Logout",
    to: "/",
    icon: <NavigateNextIcon2 />,
  },
];

export default _nav;
