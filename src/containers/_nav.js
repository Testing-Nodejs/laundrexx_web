const _nav = [{
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/OutletDashboard",
    icon: "cil-cursor",
},
{
    _tag: "CSidebarNavItem",
    name: "Place Order",
    to: "/OutletPlaceOrder",
    icon: "cil-cursor",
},
{
    _tag: "CSidebarNavItem",
    name: "New Customer",
    to: "/NewCustomer",
    icon: "cil-cursor",
},
{
    _tag: "CSidebarNavItem",
    name: "Intake Process",
    to: "/OutletViewIntakeProcess",
    icon: "cil-cursor",
},
{
    _tag: "CSidebarNavItem",
    name: "Delivery",
    to: "/OutletDelivery",
    icon: "cil-cursor",
},
{
    _tag: "CSidebarNavDropdown",
    name: "Door Delivery",
    icon: "cil-cursor",
    _children: [{
        _tag: "CSidebarNavItem",
        name: "Door Delivery Orders",
        to: "/OutletDoorDeliveryOrders",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Confirmed Request",
        to: "/OutletConfirmedRequest",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Delivered Order By Driver",
        to: "/OutletDeliveredOrderByDriver",
        icon: "cilArrowRight",
    },
    ],
},
{
    _tag: "CSidebarNavItem",
    name: "All Orders",
    to: "/OutletViewAllOrders",
    icon: "cil-cursor",
},
{
    _tag: "CSidebarNavItem",
    name: "Delivered Orders",
    to: "/OutletViewDeliveredOrders",
    icon: "cil-cursor",
},
{
    _tag: "CSidebarNavDropdown",
    name: "Reprinting",
    icon: "cil-cursor",
    _children: [{
        _tag: "CSidebarNavItem",
        name: "Tag & Invoice",
        to: "/TagInvoiceReprint",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Delivery Challan",
        to: "/OutletDeliveryChallan",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Order Report",
        to: "/OutletOrderReport",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Collection Report",
        to: "/OutletCollectionReport",
        icon: "cilArrowRight",
    },
    ],
},
{
    _tag: "CSidebarNavDropdown",
    name: "Inventory",
    icon: "cil-cursor",
    _children: [{
        _tag: "CSidebarNavItem",
        name: "Current Inventory",
        to: "/OutletCurrentInventory",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Self Audit Report",
        to: "/OutletSelfAuditReport",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "View Outlet Self Audit Report",
        to: "/ViewOutletSelfAuditReport",
        icon: "cilArrowRight",
    },
    ],
},
{
    _tag: "CSidebarNavDropdown",
    name: "Reports",
    icon: "cil-cursor",
    _children: [{
        _tag: "CSidebarNavItem",
        name: "Billing Reports",
        to: "/OutletOrderReports",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Ready For Delivery Orders",
        to: "/OutletReadyForDeliveryOrders",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Collection Reports",
        to: "/OutletCollectionReports",
        icon: "cilArrowRight",
    },
    {
        _tag: "CSidebarNavItem",
        name: "Delivery Challan(DC)",
        to: "/OutletDeliveryChallanReport",
        icon: "cilArrowRight",
    },
    ],
},
{
    _tag: "CSidebarNavItem",
    name: "Day Close",
    to: "/OutletDayClose",
    icon: "cil-cursor",
},
];

export default _nav;