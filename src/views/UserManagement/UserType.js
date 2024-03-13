/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
    CRow,
    CLink
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import axios from "axios";
import { MyApiUrl } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Action" },
    { key: "User Type" },
];

const UserType = () => {
    const history = useHistory();

    const [UserType, setUserType] = useState("");
    const [UserTypeID, setUserTypeID] = useState("");
    const [RolesData, setRolesData] = useState([]);
    const [UserTypeData, setUserTypeData] = useState([]);
    const [SelectedRoles, setSelectedRoles] = useState(0);
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);


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


    const GetAllRoles = async () => {
        document.getElementById("divLoading").className = "show";
        await axios({
            method: "GET",
            url: MyApiUrl + "GetAllRoles",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                setRolesData(response.data);
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const GetAllUserType = async () => {
        document.getElementById("divLoading").className = "show";
        await axios({
            method: "GET",
            url: MyApiUrl + "UserType",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                const items = response.data.map((item) => {
                    return {
                        ...item,
                        "User Type": item.USER_TYPE_NAME,
                    };
                });
                setUserTypeData(items);
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    };

    React.useEffect(() => {
        GetAllRoles();
        GetAllUserType();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }, []);

    const renderChildCheckboxes = (ParentID, ChildCheckbox) => {
        return (
            <React.Fragment>
                <ul style={{ listStyle: "none", marginTop: "2%" }}>
                    {ChildCheckbox.map((item) => (
                        <li>
                            <label className="checkbox style-d">
                                <input type="checkbox" value={item.id + "_" + ParentID} onChange={InnerCheckBoxChecked} checked={item.checked} />
                                <div className="checkbox__checkmark" style={{ top: -2 }}></div>
                                <span style={{ marginLeft: "2%", color: "black", fontWeight: "400", fontSize: "13px", textWrap: "nowrap" }}>{item.name}</span>
                            </label>
                            {/* <label style={{ width: "100%" }}>
                                <input type="checkbox" value={item.id + "_" + ParentID} onChange={InnerCheckBoxChecked} checked={item.checked} />
                                <span style={{ marginLeft: "2%", color: "black", fontWeight: "400", fontSize: "13px" }}>{item.name}</span>
                            </label> */}
                        </li>
                    ))
                    }
                </ul>
            </React.Fragment>
        );
    }

    const HandleParentCheckbox = (event) => {
        const updatedData = RolesData.map((item) => {
            if (item.id === parseInt(event.target.value)) {
                return { ...item, checked: event.target.checked, familyMembers: item.familyMembers && UpdateChildCheckBox(item.familyMembers, event.target.checked) };
            }
            return item;
        });
        setRolesData(updatedData);
        setSelectedRoles(event.target.checked ? SelectedRoles + 1 : SelectedRoles - 1);
    }

    const UpdateChildCheckBox = (familyMembers, checkedStatus) => {
        const updatedData = familyMembers.map((item) => {
            return { ...item, checked: checkedStatus };
        });
        return updatedData;
    }

    const UpdateChildCheckBoxSingle = (familyMembers, checkedStatus, ChildID) => {
        const updatedData = familyMembers.map((item) => {
            if (item.id === parseInt(ChildID)) {
                return { ...item, checked: checkedStatus };
            }
            return item;
        });
        return updatedData;
    }

    const InnerCheckBoxChecked = (event) => {
        var ParentID = event.target.value.split("_")[1];
        var ChildValue = event.target.value.split("_")[0];
        if (event.target.checked === true) {
            const updatedData = RolesData.map((item) => {
                if (item.id === parseInt(ParentID)) {
                    return { ...item, checked: event.target.checked, familyMembers: item.familyMembers && UpdateChildCheckBoxSingle(item.familyMembers, event.target.checked, ChildValue) };
                }
                return item;
            });
            setRolesData(updatedData);
        } else {
            const updatedData = RolesData.map((item) => {
                if (item.id === parseInt(ParentID)) {
                    return { ...item, checked: checkChildCheckedStatus(item.familyMembers && UpdateChildCheckBoxSingle(item.familyMembers, event.target.checked, ChildValue)), familyMembers: item.familyMembers && UpdateChildCheckBoxSingle(item.familyMembers, event.target.checked, ChildValue) };
                }
                return item;
            });
            setRolesData(updatedData);
        }
        setSelectedRoles(event.target.checked ? SelectedRoles + 1 : SelectedRoles - 1);
    }

    const checkChildCheckedStatus = (familyMembers) => {
        var truecnt = 0;
        familyMembers.map((item) => {
            if (item.checked === true) {
                truecnt += 1;
            }
        });
        return truecnt === 0 ? false : true;
    }

    const AddUserType = () => {
        if (UserType === "" || UserType == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter User Type!",
            });
        } else if (SelectedRoles === 0) {
            Toast.fire({
                icon: "warning",
                title: "Please Select Atleast 1 Role!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                USER_TYPE_NAME: UserType,
                RolesData: RolesData,
            };
            axios.post(MyApiUrl + "UserType", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "User Type Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "User Type Added!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Add!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });

        }
    }

    const EditUserType = (pkid, userType) => {
        setUserTypeID(pkid);
        setUserType(userType);
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);

        document.getElementById("divLoading").className = "show";
        axios({
            method: "GET",
            url: MyApiUrl + "GetAllRolesByUserType/" + pkid + "",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((response) => {
                setRolesData(response.data);
                document.getElementById("divLoading").className = "hide";
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const DeleteUserType = (pkid) => {
        var res = confirm("If you delete this User Type all assigned roles will be deleted, Are you sure you want to delete....?");
        if (res) {
            document.getElementById("divLoading").className = "show";
            axios({
                method: "DELETE",
                url: MyApiUrl + "UserType/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected User Type Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete User Type!",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        document.getElementById("divLoading").className = "hide";
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const UpdateUserType = () => {
        if (UserType === "" || UserType == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter User Type!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                USER_TYPE_NAME: UserType,
                RolesData: RolesData,
            };
            axios.put(MyApiUrl + "UserType/" + UserTypeID + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "User Type Updated!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                    Reset();
                } else if (response.data === false) {
                    Swal.fire({
                        title: "Failed To Update!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                }
            });

        }
    }

    const Updatebtn = () => (
        <CButton type="button" onClick={UpdateUserType} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddUserType} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            ADD
        </CButton>
    );

    const CancelBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-danger" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CANCEL
        </CButton>
    );

    const ClearBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-warning" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CLEAR
        </CButton>
    );

    const Reset = () => {
        setUserType("");
        GetAllRoles();
        GetAllUserType();
        setRolesData([]);
        setSelectedRoles(0);
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }

    return (
        <div className="123">
            <div id="divLoading"> </div>
            <CRow>
                <CCol md="12" lg="12" style={{ borderBottom: "1px solid #e8e8e8", padding: "5px 0px 5px 10px" }}>
                    <span style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                        <CLink to="/dashboard" style={{ paddingRight: "1%", color: "#098adc" }}>Dashboard</CLink> / <CLink onClick={() => history.goBack()} style={{ paddingLeft: "1%", color: "#000000" }}>Back</CLink>
                    </span>
                </CCol>
            </CRow>
            <h1 id="ccmaster">Manage User Type</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="6">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add/Update User Type</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>User Type <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter User Type"
                                                value={UserType}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setUserType(value)
                                                }}

                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            {CancelButton && <CancelBtn />}
                                            {UpdateButton && <Updatebtn />}
                                            {ClearButton && <ClearBtn />}
                                            {AddButton && <Addbtn />}
                                        </CCol>
                                    </CFormGroup>
                                </CForm>
                            </CCardBody>
                        </CCard>
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>View User Type</CCardHeader>
                            <CCardBody>
                                <CDataTable
                                    items={UserTypeData}
                                    fields={fields2}
                                    hover
                                    striped
                                    bordered
                                    sorter
                                    tableFilter={table}
                                    itemsPerPageSelect={items}
                                    columnFilterSlot
                                    size="sm"
                                    itemsPerPage={10}
                                    pagination
                                    scopedSlots={{
                                        Action: (item) => (
                                            <td>
                                                <CButton
                                                    size="sm"
                                                    onClick={() => {
                                                        EditUserType(
                                                            item.USER_TYPE_PKID,
                                                            item.USER_TYPE_NAME,
                                                        );
                                                    }}
                                                    id="war-btn"
                                                >
                                                    <EditIcon />
                                                </CButton>
                                                <CButton
                                                    size="sm"
                                                    onClick={() => {
                                                        DeleteUserType(item.USER_TYPE_PKID);
                                                    }}
                                                    id="war-btn1"
                                                >
                                                    <DeleteSharpIcon />
                                                </CButton>
                                            </td>
                                        ),
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>

                <CCol md="12" lg="6">
                    <div id="country-table">
                        <CCard id="Loccard" style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Please Select Roles and Permissions</CCardHeader>
                            {RolesData.length > 0 ?
                                <CCardBody>
                                    <ul style={{ listStyle: "none", borderBottom: "1px solid #c1c1c1", paddingBottom: "5%" }}>
                                        {
                                            RolesData.map((item) => {
                                                return (
                                                    <React.Fragment>
                                                        <li>
                                                            <label className="checkbox style-d">
                                                                <input type="checkbox" value={item.id} id={"ParentCheckbox_" + item.id} onChange={HandleParentCheckbox} checked={item.checked} />
                                                                <div className="checkbox__checkmark" style={{ top: -2 }}></div>
                                                                <span style={{ marginLeft: "2%", color: "black", fontWeight: "400", fontSize: "14px", textWrap: "nowrap" }}>{item.name}</span>
                                                            </label>
                                                            {/* <label style={{ width: "100%", marginBottom: "0px" }}>
                                                                <input type="checkbox" value={item.id} id={"ParentCheckbox_" + item.id} onChange={HandleParentCheckbox} checked={item.checked} />
                                                                <span style={{ marginLeft: "2%", color: "black", fontWeight: "400", fontSize: "14px" }}>{item.name}</span>
                                                            </label> */}
                                                        </li>
                                                        {item.familyMembers && renderChildCheckboxes(item.id, item.familyMembers)}
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </ul>
                                    {CancelButton && <CancelBtn />}
                                    {UpdateButton && <Updatebtn />}
                                    {ClearButton && <ClearBtn />}
                                    {AddButton && <Addbtn />}
                                </CCardBody>
                                : null}
                        </CCard>
                    </div>
                </CCol>
            </CRow>
        </div>
    );
};

export default UserType;
