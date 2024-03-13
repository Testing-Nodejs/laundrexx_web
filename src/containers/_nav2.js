/**
 * @author KIMOSABE
 * @email Kimosabe@mail.com
 * @create date 2021-11-26 10:09:14
 * @modify date 2021-12-07 19:13:21
 * @desc [description]
 */
import React from "react";
import NavigateNextIcon from "@material-ui/icons/FormatAlignJustify";
import NavigateNextIcon2 from "@material-ui/icons/Minimize";
import ListIcon from '@material-ui/icons/List';
import PrintIcon from '@material-ui/icons/Print';
import InventoryIcon from '@mui/icons-material/Inventory';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import OutboxIcon from '@mui/icons-material/Outbox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/FactoryDashboard",
    icon: <DashboardIcon/>,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Intake",
    to: "/FactoryReceiveItems",
    icon: <ListIcon/>,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Confirmed Intake",
    to: "/FactoryReceivedItems",
    icon: <PlaylistAddCheckIcon/>,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Current Inventory",
    to: "/FactoryCurrentInventory",
    icon: <InventoryIcon/>,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Return To",
    to: "/SendOrder",
    icon: <OutboxIcon/>,
  },
  {
    _tag: "CSidebarNavItem",
    name: "View Returned DC",
    to: "/ReturnedDC",
    icon: <FileDownloadDoneIcon/>,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Print Label/Stickers",
    to: "/FactoryPrintLabels",
    icon: <PrintIcon/>,
  },
  
];

export default _nav;