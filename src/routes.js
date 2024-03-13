/**
 * @author KIMOSABE
 * @email Kimosabe@mail.com
 * @create date 2021-11-26 10:09:20
 * @modify date 2021-12-07 19:16:02
 * @desc [description]
 */
import React from "react";

// Super Admin 
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const ChangePassword = React.lazy(() => import("./views/UserManagement/ChangePassword"));
const UserType = React.lazy(() => import("./views/UserManagement/UserType"));
const ManageUsers = React.lazy(() => import("./views/UserManagement/ManageUsers"));
const ServiceCategory = React.lazy(() => import("./views/ServiceManagement/ServiceCategory"));
const ServiceType = React.lazy(() => import("./views/ServiceManagement/ServiceType"));
const ManageDigitalSignature = React.lazy(() => import("./views/masters/ManageDigitalSignature"));
const ViewAllCustomers = React.lazy(() => import("./views/CustomerManagement/ViewAllCustomers"));
const EditCustomer = React.lazy(() => import("./views/CustomerManagement/EditCustomer"));
const EditCustomerDetails = React.lazy(() => import("./views/CustomerManagement/EditCustomerDetails"));
const CustomerCoupon = React.lazy(() => import("./views/CustomerManagement/CustomerCoupon"));
const ItemCategory = React.lazy(() => import("./views/ItemManagement/ItemCategory"));
const ItemSubCategory = React.lazy(() => import("./views/ItemManagement/ItemSubCategory"));
const Items = React.lazy(() => import("./views/ItemManagement/Items"));
const AdditionalService = React.lazy(() => import("./views/ItemManagement/AdditionalService"));
const ItemPriceMaster = React.lazy(() => import("./views/ItemManagement/ItemPriceMaster"));
const AdditionalItemPrice = React.lazy(() => import("./views/ItemManagement/AdditionalItemPrice"));
const ManageFactory = React.lazy(() => import("./views/FactoryManagement/ManageFactory"));
const ManageFactoryStaff = React.lazy(() => import("./views/FactoryManagement/ManageFactoryStaff"));
const HolidayMaster = React.lazy(() => import("./views/DaysManagement/HolidayMaster"));
const DueDateMaster = React.lazy(() => import("./views/DaysManagement/DueDateMaster"));
const ManageRoute = React.lazy(() => import("./views/OutletManagement/RouteMaster"));
const Store = React.lazy(() => import("./views/OutletManagement/ManageStore"));
const StoreStaff = React.lazy(() => import("./views/OutletManagement/ManageStoreStaff"));
const AddStoreStaff = React.lazy(() => import("./views/OutletManagement/AddStoreStaff"));
const EditStoreStaff = React.lazy(() => import("./views/OutletManagement/EditStoreStaff"));
const ManageDrivers = React.lazy(() => import("./views/DoorDeliveryManagement/ManageDrivers"));
const ManagerProfile = React.lazy(() => import("./views/UserManagement/ManagerProfile"));
const CreatePickup = React.lazy(() => import("./views/DoorDeliveryManagement/CreatePickup"));
const AddPickup = React.lazy(() => import("./views/DoorDeliveryManagement/AddPickup"));
const EditPickup = React.lazy(() => import("./views/DoorDeliveryManagement/EditPickup"));
const ManagePickups = React.lazy(() => import("./views/DoorDeliveryManagement/ManagePickups"));
const DoorDelivery = React.lazy(() => import("./views/DoorDeliveryManagement/DoorDelivery"));
const ManageCoupons = React.lazy(() => import("./views/CoupanCodeManagement/ManageCoupons"));
const ViewallOrders = React.lazy(() => import("./views/OrderManagement/ViewallOrders"));
const OrderItems = React.lazy(() => import("./views/OrderManagement/OrderItems"));
const EditOrders = React.lazy(() => import("./views/OrderManagement/EditOrders"));
const EditPlacedOrder = React.lazy(() => import("./views/OrderManagement/EditPlacedOrder"));
const ModifiedOrders = React.lazy(() => import("./views/OrderManagement/ModifiedOrders"));
const DeleteOrders = React.lazy(() => import("./views/OrderManagement/DeleteOrders"));
const OrderItems1 = React.lazy(() => import("./views/OrderManagement/OrderItems1"));
const ViewB2BOrder = React.lazy(() => import("./views/OrderManagement/ViewB2BOrder"));
const BadDebtAdjustment = React.lazy(() => import("./views/OrderManagement/BadDebtAdjustment"));
const OutletOrStoreInventory = React.lazy(() => import("./views/AccountManagement/OutletOrStoreInventory"));
const OrderDetailsReport = React.lazy(() => import("./views/AccountManagement/OrderDetailsReport"));
const ViewDeletedOrders = React.lazy(() => import("./views/AccountManagement/ViewDeletedOrders"));
const StartAuditProcessAudit = React.lazy(() => import("./views/AuditManagement/StartAuditProcessAudit"));
const PreviousAuditReport = React.lazy(() => import("./views/AuditManagement/PreviousAuditReport"));
const ViewPreviousAuditReport = React.lazy(() => import("./views/AuditManagement/ViewPreviousAuditReport"));
const AllStoreAuditReport = React.lazy(() => import("./views/AuditManagement/AllStoreAuditReport"));
const ViewAllStoreAuditReport = React.lazy(() => import("./views/AuditManagement/ViewAllStoreAuditReport"));
const ErrorReport = React.lazy(() => import("./views/AuditManagement/ErrorReport"));
const ViewErrorReport = React.lazy(() => import("./views/AuditManagement/ViewErrorReport"));

// Outlet
const OutletDashboard = React.lazy(() => import("./views/Outlets/OutletDashboard"));
const OutletViewIntakeProcess = React.lazy(() => import("./views/Outlets/OutletViewIntakeProcess"));
const OutletIntakeProcess = React.lazy(() => import("./views/Outlets/OutletIntakeProcess"));
const NewCustomer = React.lazy(() => import("./views/Outlets/NewCustomer"));
const AddNewCustomer = React.lazy(() => import("./views/Outlets/AddNewCustomer"));
const OutletProfile = React.lazy(() => import("./views/Outlets/OutletProfile"));
const OutletPlaceOrder = React.lazy(() => import("./views/Outlets/OutletPlaceOrder"));
const OutletViewAllOrders = React.lazy(() => import('./views/Outlets/OutletViewAllOrders'));
const OutletOrderItems = React.lazy(() => import('./views/Outlets/OutletOrderItems'));
const TagInvoiceReprint = React.lazy(() => import('./views/Outlets/TagInvoiceReprint'));
const TagsReprinting = React.lazy(() => import('./views/Outlets/TagsReprinting'));
const TagInvoiceReprintView = React.lazy(() => import('./views/Outlets/TagInvoiceReprintView'));
const OutletDeliveryChallan = React.lazy(() => import('./views/Outlets/OutletDeliveryChallan'));
const OutletDeliveryChallanView = React.lazy(() => import('./views/Outlets/OutletDeliveryChallanView'));
const OutletOrderReport = React.lazy(() => import('./views/Outlets/OutletOrderReport'));
const OutletDayClose = React.lazy(() => import('./views/Outlets/OutletDayClose'));
const OutletCurrentInventory = React.lazy(() => import('./views/Outlets/OutletCurrentInventory'));
const OutletDelivery = React.lazy(() => import('./views/Outlets/OutletDelivery'));
const OutletVerifyOtp = React.lazy(() => import('./views/Outlets/OutletVerifyOtp'));
const OutletDoorDeliveryOrders = React.lazy(() => import('./views/Outlets/OutletDoorDeliveryOrders'));
const OutletConfirmedRequest = React.lazy(() => import('./views/Outlets/OutletConfirmedRequest'));
const OutletViewDeliveredOrders = React.lazy(() => import('./views/Outlets/OutletViewDeliveredOrders'));
const OutletCollectionReport = React.lazy(() => import('./views/Outlets/OutletCollectionReport'));
const OutletCollectionReports = React.lazy(() => import('./views/Outlets/OutletCollectionReports'));
const OutletOrderReports = React.lazy(() => import('./views/Outlets/OutletOrderReports'));
const OutletReadyForDeliveryOrders = React.lazy(() => import('./views/Outlets/OutletReadyForDeliveryOrders'));
const OutletDeliveryChallanReport = React.lazy(() => import('./views/Outlets/OutletDeliveryChallanReport'));
const OutletSelfAuditReport = React.lazy(() => import('./views/Outlets/OutletSelfAuditReport'));
const ViewOutletSelfAuditReport = React.lazy(() => import('./views/Outlets/ViewOutletSelfAuditReport'));
const ViewSelfAuditReport = React.lazy(() => import('./views/Outlets/ViewSelfAuditReport'));
const ViewIntakeProcessWithoutDC = React.lazy(() => import('./views/Outlets/ViewIntakeProcessWithoutDC'));
const OutletIntakeProcessWithoutDC = React.lazy(() => import('./views/Outlets/OutletIntakeProcessWithoutDC'));
const OutletDeliveryByDeliveryCode = React.lazy(() => import('./views/Outlets/OutletDeliveryByDeliveryCode'));


// Factory
const FactoryDashboard = React.lazy(() => import("./views/Factory/FactoryDashboard"));
const FactoryPrintLabels = React.lazy(() => import("./views/Factory/FactoryPrintLabels"));
const LabelPrintByDC = React.lazy(() => import("./views/Factory/LabelPrintByDC"));
const LabelAndProductPrintByDC = React.lazy(() => import("./views/Factory/LabelAndProductPrintByDC"));
const LabelPrintByOrder = React.lazy(() => import("./views/Factory/LabelPrintByOrder"));
const ProductPrintByOrder = React.lazy(() => import("./views/Factory/ProductPrintByOrder"));
const LabelAndProductPrintByOrder = React.lazy(() => import("./views/Factory/LabelAndProductPrintByOrder"));
const LabelPrintByItem = React.lazy(() => import("./views/Factory/LabelPrintByItem"));
const ProductPrintByItem = React.lazy(() => import("./views/Factory/ProductPrintByItem"));
const LabelAndProductPrintByItem = React.lazy(() => import("./views/Factory/LabelAndProductPrintByItem"));
const FactoryReceivedItems = React.lazy(() => import("./views/Factory/FactoryReceivedItems"));
const SendOrder = React.lazy(() => import("./views/Factory/SendOrder"));
const SendOrderOutlet = React.lazy(() => import("./views/Factory/SendOrderOutlet"));
const SentOutletDCDetails = React.lazy(() => import("./views/Factory/SentOutletDCDetails"));
const ReturnedDC = React.lazy(() => import("./views/Factory/ReturnedDC"));
const SendItemFactory = React.lazy(() => import("./views/Factory/SendItemFactory"));
const SentFactoryDCDetails = React.lazy(() => import("./views/Factory/SentFactoryDCDetails"));
const FactoryCurrentInventory = React.lazy(() => import("./views/Factory/FactoryCurrentInventory"));
const ViewAllOutletReceiveItems = React.lazy(() => import("./views/Factory/ViewAllOutletReceiveItems"));
const ViewAllFactoryReceiveItems = React.lazy(() => import("./views/Factory/ViewAllFactoryReceiveItems"));
const FactoryReceiveItems = React.lazy(() => import("./views/Factory/FactoryReceiveItems"));
const ReceiveItemsOutlet = React.lazy(() => import("./views/Factory/ReceiveItemsOutlet"));
const ReceiveItemsFactory = React.lazy(() => import("./views/Factory/ReceiveItemsFactory"));
const ViewOutletReceivedItems = React.lazy(() => import("./views/Factory/ViewOutletReceivedItems"));
const ViewFactoryReceivedItems = React.lazy(() => import("./views/Factory/ViewFactoryReceivedItems"));

const routes = [
    // Super Admin
    { path: "/", exact: true, name: "Login" },
    { path: "/dashboard", name: "Dashboard", component: Dashboard },
    { path: "/ChangePassword", name: "Change Password", component: ChangePassword },
    { path: "/UserType", name: "User Type", component: UserType },
    { path: "/ManageUsers", name: "ManageUsers", component: ManageUsers },
    { path: "/ServiceCategory", name: "Service Category", component: ServiceCategory },
    { path: "/ServiceType", name: "Service Type", component: ServiceType },
    { path: "/ManageDigitalSignature", name: "Manage Digital Signature", component: ManageDigitalSignature },
    { path: "/ViewAllCustomers", name: "View All Customers", component: ViewAllCustomers },
    { path: "/EditCustomer", name: "Edit Customer", component: EditCustomer },
    { path: "/EditCustomerDetails", name: "Edit Customer Details", component: EditCustomerDetails },
    { path: "/CustomerCoupon", name: "Customer Coupon", component: CustomerCoupon },
    { path: "/ItemCategory", name: "Item Category", component: ItemCategory },
    { path: "/ItemSubCategory", name: "Item Sub Category", component: ItemSubCategory },
    { path: "/Items", name: "Items", component: Items },
    { path: "/AdditionalService", name: "AdditionalService", component: AdditionalService },
    { path: "/ItemPriceMaster", name: "ItemPriceMaster", component: ItemPriceMaster },
    { path: "/AditionalRequestPriceMaster", name: "AdditionalItemPrice", component: AdditionalItemPrice },
    { path: "/ManageFactory", name: "Manage Factory", component: ManageFactory },
    { path: "/ManageFactoryStaff", name: "Manage Factory Staff", component: ManageFactoryStaff },
    { path: "/HolidayMaster", name: "HolidayMaster", component: HolidayMaster },
    { path: "/DueDateMaster", name: "DueDateMaster", component: DueDateMaster },
    { path: "/RouteMaster", name: "Route Master", component: ManageRoute },
    { path: "/ManageStoreStaff", name: "Store Staff", component: StoreStaff },
    { path: "/AddStoreStaff", name: "AddStoreStaff", component: AddStoreStaff },
    { path: "/EditStoreStaff", name: "EditStoreStaff", component: EditStoreStaff },
    { path: "/ManageStore", name: "Store", component: Store },
    { path: "/ManageDrivers", name: "ManageDrivers", component: ManageDrivers },
    { path: "/ManagerProfile", name: "Manager Profile", component: ManagerProfile },
    { path: "/CreatePickup", name: "CreatePickup", component: CreatePickup },
    { path: "/AddPickup", name: "AddPickup", component: AddPickup },
    { path: "/EditPickup", name: "EditPickup", component: EditPickup },
    { path: "/ManagePickups", name: "ManagePickups", component: ManagePickups },
    { path: "/DoorDelivery", name: "DoorDelivery", component: DoorDelivery },
    { path: "/ManageCoupons", name: "Manage Coupons", component: ManageCoupons },
    { path: "/ViewallOrders", name: "ViewallOrders", component: ViewallOrders },
    { path: "/OrderItems", name: "OrderItems", component: OrderItems },
    { path: "/EditOrders", name: "EditOrders", component: EditOrders },
    { path: "/EditPlacedOrder", name: "EditPlacedOrder", component: EditPlacedOrder },
    { path: "/ModifiedOrders", name: "ModifiedOrders", component: ModifiedOrders },
    { path: "/DeleteOrders", name: "DeleteOrders", component: DeleteOrders },
    { path: "/OrderItems1", name: "OrderItems1", component: OrderItems1 },
    { path: "/ViewB2BOrder", name: "ViewB2BOrder", component: ViewB2BOrder },
    { path: "/BadDebtAdjustment", name: "BadDebtAdjustment", component: BadDebtAdjustment },
    { path: "/OutletOrStoreInventory", name: "OutletOrStoreInventory", component: OutletOrStoreInventory },
    { path: "/OrderDetailsReport", name: "OrderDetailsReport", component: OrderDetailsReport },
    { path: "/ViewDeletedOrders", name: "ViewDeletedOrders", component: ViewDeletedOrders },
    { path: "/StartAuditProcessAudit", name: "StartAuditProcessAudit", component: StartAuditProcessAudit },
    { path: "/PreviousAuditReport", name: "PreviousAuditReport", component: PreviousAuditReport },
    { path: "/ViewPreviousAuditReport", name: "ViewPreviousAuditReport", component: ViewPreviousAuditReport },
    { path: "/AllStoreAuditReport", name: "AllStoreAuditReport", component: AllStoreAuditReport },
    { path: "/ViewAllStoreAuditReport", name: "ViewAllStoreAuditReport", component: ViewAllStoreAuditReport },
    { path: "/ErrorReport", name: "ErrorReport", component: ErrorReport },
    { path: "/ViewErrorReport", name: "ViewErrorReport", component: ViewErrorReport },

    // Outlet
    { path: "/OutletDashboard", name: "OutletDashboard", component: OutletDashboard },
    { path: "/OutletViewIntakeProcess", name: "Outlet View Intake Process", component: OutletViewIntakeProcess },
    { path: "/OutletIntakeProcess", name: "Outlet Intake Process", component: OutletIntakeProcess },
    { path: "/NewCustomer", name: "New Customer", component: NewCustomer },
    { path: "/AddNewCustomer", name: "Add New Customer", component: AddNewCustomer },
    { path: "/OutletProfile", name: "Outlet Profile", component: OutletProfile },
    { path: "/OutletPlaceOrder", name: "Outlet Place Order", component: OutletPlaceOrder },
    { path: "/OutletViewAllOrders", name: "Outlet View All Orders", component: OutletViewAllOrders },
    { path: "/OutletOrderItems", name: "Outlet Order Items", component: OutletOrderItems },
    { path: "/TagInvoiceReprint", name: "Reprinting", component: TagInvoiceReprint },
    { path: "/TagsReprinting", name: "Tags Reprinting", component: TagsReprinting },
    { path: "/TagInvoiceReprintView", name: "Tag Invoice Reprint View", component: TagInvoiceReprintView },
    { path: "/OutletDeliveryChallan", name: "Outlet Delivery Challan", component: OutletDeliveryChallan },
    { path: "/OutletDeliveryChallanView", name: "Outlet Delivery Challan View", component: OutletDeliveryChallanView },
    { path: "/OutletOrderReport", name: "Outlet Order Report", component: OutletOrderReport },
    { path: "/OutletDayClose", name: "Outlet Day Close", component: OutletDayClose },
    { path: "/OutletCurrentInventory", name: "Outlet Current Inventory", component: OutletCurrentInventory },
    { path: "/OutletDelivery", name: "Outlet Delivery", component: OutletDelivery },
    { path: "/OutletVerifyOtp", name: "Outlet Verify Otp", component: OutletVerifyOtp },
    { path: "/OutletDoorDeliveryOrders", name: "Outlet Door Delivery", component: OutletDoorDeliveryOrders },
    { path: "/OutletConfirmedRequest", name: "Outlet Confirm Request", component: OutletConfirmedRequest },
    { path: "/OutletViewDeliveredOrders", name: "OutletDeliveredOrders", component: OutletViewDeliveredOrders },
    { path: "/OutletCollectionReport", name: "OutletCollectionReport", component: OutletCollectionReport },
    { path: "/OutletCollectionReports", name: "OutletCollectionReports", component: OutletCollectionReports },
    { path: "/OutletOrderReports", name: "Outlet Order Reports", component: OutletOrderReports },
    { path: "/OutletReadyForDeliveryOrders", name: "Outlet Ready for Delivery", component: OutletReadyForDeliveryOrders },
    { path: "/OutletDeliveryChallanReport", name: "Outlet Delivery Challan", component: OutletDeliveryChallanReport },
    { path: "/OutletSelfAuditReport", name: "Outlet Self Audit", component: OutletSelfAuditReport },
    { path: "/ViewOutletSelfAuditReport", name: "View Outlet Self Audit", component: ViewOutletSelfAuditReport },
    { path: "/ViewSelfAuditReport", name: "View Outlet Self Audit", component: ViewSelfAuditReport },
    { path: "/ViewIntakeProcessWithoutDC", name: "View Intake Process Without DC", component: ViewIntakeProcessWithoutDC },
    { path: "/OutletIntakeProcessWithoutDC", name: "Outlet Intake Process Without DC", component: OutletIntakeProcessWithoutDC },
    { path: "/OutletDeliveryByDeliveryCode", name: "Outlet Delivery", component: OutletDeliveryByDeliveryCode },


    // Factory
    { path: "/FactoryDashboard", name: "FactoryDashboard", component: FactoryDashboard },
    { path: "/FactoryPrintLabels", name: "Factory Print Labels", component: FactoryPrintLabels },
    { path: "/LabelPrintByDC", name: "Label Print By DC", component: LabelPrintByDC },
    { path: "/LabelAndProductPrintByDC", name: "Label And Product Print By DC", component: LabelAndProductPrintByDC },
    { path: "/LabelPrintByOrder", name: "Label Print By Order", component: LabelPrintByOrder },
    { path: "/ProductPrintByOrder", name: "Product Print By Order", component: ProductPrintByOrder },
    { path: "/LabelAndProductPrintByOrder", name: "Label And Product Print By Order", component: LabelAndProductPrintByOrder },
    { path: "/LabelPrintByItem", name: "Label Print By Item", component: LabelPrintByItem },
    { path: "/ProductPrintByItem", name: "Product Print By Item", component: ProductPrintByItem },
    { path: "/LabelAndProductPrintByItem", name: "Label And Product Print By Item", component: LabelAndProductPrintByItem },
    { path: "/FactoryReceivedItems", name: "FactoryReceivedItems", component: FactoryReceivedItems },
    { path: "/SendOrder", name: "SendOrder", component: SendOrder },
    { path: "/SendOrderOutlet", name: "SendOrderOutlet", component: SendOrderOutlet },
    { path: "/SentOutletDCDetails", name: "SentOutletDCDetails", component: SentOutletDCDetails },
    { path: "/ReturnedDC", name: "ReturnedDC", component: ReturnedDC },
    { path: "/SendItemFactory", name: "SendItemFactory", component: SendItemFactory },
    { path: "/SentFactoryDCDetails", name: "SentFactoryDCDetails", component: SentFactoryDCDetails },
    { path: "/FactoryCurrentInventory", name: "FactoryCurrentInventory", component: FactoryCurrentInventory },
    { path: "/ViewAllOutletReceiveItems", name: "ViewAllOutletReceiveItems", component: ViewAllOutletReceiveItems },
    { path: "/ViewAllFactoryReceiveItems", name: "ViewAllFactoryReceiveItems", component: ViewAllFactoryReceiveItems },
    { path: "/FactoryReceiveItems", name: "FactoryReceiveItems", component: FactoryReceiveItems },
    { path: "/ReceiveItemsOutlet", name: "ReceiveItemsOutlet", component: ReceiveItemsOutlet },
    { path: "/ReceiveItemsFactory", name: "ReceiveItemsFactory", component: ReceiveItemsFactory },
    { path: "/ViewOutletReceivedItems", name: "ViewOutletReceivedItems", component: ViewOutletReceivedItems },
    { path: "/ViewFactoryReceivedItems", name: "ViewFactoryReceivedItems", component: ViewFactoryReceivedItems },

];
export default routes;