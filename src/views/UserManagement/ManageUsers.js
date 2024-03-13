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
    CSelect,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
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
    { key: "Name" },
    { key: "Login Name" },
    { key: "Outlet" },
    { key: "Password" },
    { key: "User Type" },
    { key: "Phone" },
    { key: "Email" },
];
const fields = [
    { key: "Outlet ID" },
    { key: "Outlet Code" },
    { key: "Outlet Name" },
];

const ManageUsers = () => {
    const history = useHistory();
    const UserID = sessionStorage.getItem("UserID");
    const Manager = sessionStorage.getItem("SessionType");
    const [AllOutlets, setAllOutlets] = useState([]);
    const [UserTypeData, setUserTypeData] = useState([]);
    const [UserData, setUserData] = useState([]);
    const [UserPkid, setUserPkid] = useState([]);
    const [UserType, setUserType] = useState("");
    const [UserName, setUserName] = useState("");
    const [LoginName, setLoginName] = useState("");
    const [Phone, setPhone] = useState("");
    const [Password, setPassword] = useState("Laundrexx1!");
    const [Email, setEmail] = useState("");
    const [ParentChecked, setParentChecked] = useState(false);

    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);
    const [block, setBlock] = useState(false);
    const [InnerTableData, setInnerTableData] = useState([]);


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

    const GetUserType = () => {
        axios.get(MyApiUrl + "UserType").then((response) => {
            if (response.data.length != 0) {
                const TypeOption = response.data.map((item) => (
                    <option value={item.USER_TYPE_PKID}>{item.USER_TYPE_NAME}</option>
                ));
                setUserTypeData(TypeOption);
            }
            else {
                setUserTypeData([]);
            }
        });
    };

    const GetAllUsers = async () => {
        document.getElementById("divLoading").className = "show";
        if (Manager == "Manager") {
            axios.get(MyApiUrl + "UsersForManager/" + UserID + "").then((response) => {
                if (response.data.length > 0) {
                    const items = response.data.map((item) => {
                        return {
                            ...item,
                            "User Type": item.USER_TYPE_NAME,
                            "Name": item.USER_NAME,
                            "Login Name": item.USER_LOGIN_NAME,
                            "Phone": item.USER_PHONE,
                            "Password": item.USER_PASSWORD,
                            "Email": item.USER_EMAIL == "" || item.USER_EMAIL == null ? "-" : item.USER_EMAIL
                        };
                    });
                    setUserData(items);
                    document.getElementById("divLoading").className = "hide";
                }
                else {
                    setUserData([]);
                    document.getElementById("divLoading").className = "hide";
                }
            });
        } else {
            axios.get(MyApiUrl + "Users").then((response) => {
                if (response.data.length > 0) {
                    const items = response.data.map((item) => {
                        return {
                            ...item,
                            "User Type": item.USER_TYPE_NAME,
                            "Name": item.USER_NAME,
                            "Login Name": item.USER_LOGIN_NAME,
                            "Phone": item.USER_PHONE,
                            "Password": item.USER_PASSWORD,
                            "Email": item.USER_EMAIL == "" || item.USER_EMAIL == null ? "-" : item.USER_EMAIL
                        };
                    });
                    setUserData(items);
                    document.getElementById("divLoading").className = "hide";
                }
                else {
                    setUserData([]);
                    document.getElementById("divLoading").className = "hide";
                }
            });
        }

    };

    const GetAllOutlets = async () => {
        document.getElementById("divLoading").className = "show";
        if (Manager == "Manager") {
            await axios({
                method: "GET",
                url: MyApiUrl + "OutletsByManager/" + UserID + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    setAllOutlets(response.data);
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            await axios({
                method: "GET",
                url: MyApiUrl + "Outlets",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    setAllOutlets(response.data);
                    document.getElementById("divLoading").className = "hide";
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }

    React.useEffect(() => {
        GetAllOutlets();
        GetUserType();
        GetAllUsers();
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);
    }, []);

    const AddUser = async () => {

        if (UserType === "" || UserType == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select User Type!",
            });
        } else if (UserName === "" || UserName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter User Name!",
            });
        } else if (LoginName === "" || LoginName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Login Name!",
            });
        } else if (Phone === "" || Phone == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter User Phone Number!",
            });
        } else if (Password === "" || Password == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter User Password!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                USER_ADDED_BY: Manager,
                USER_ADDED_BY_FKID: UserID,
                USER_TYPE_FKID: UserType,
                USER_NAME: UserName,
                USER_LOGIN_NAME: LoginName,
                USER_PHONE: Phone,
                USER_PASSWORD: Password,
                USER_EMAIL: Email,
                Outlets: AllOutlets,
            };
            axios.post(MyApiUrl + "Users", obj).then((response) => {
                if (response.data === "0") {
                    Swal.fire({
                        title: "User Already Exist!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    document.getElementById("divLoading").className = "hide";
                } else if (response.data === true) {
                    Swal.fire({
                        title: "User Added!",
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

    const EditUser = (pkid, UserType, Name, LoginName, Phone, Password, email, outlets) => {
        setAllOutlets(outlets);
        setUserPkid(pkid);
        setUserType(UserType);
        setUserName(Name);
        setLoginName(LoginName);
        setPhone(Phone);
        setPassword(Password);
        setEmail(email);
        setAddButton(false);
        setUpdateButton(true);
        setCancelButton(true);
        setClearButton(false);
        ParentCheckBoxCheck(outlets);
    }

    const ParentCheckBoxCheck = (outlets) => {
        let ParentCheckCnt = 0;
        const updatedData = outlets.map((item) => {
            if (item.checked === true || item.checked === 1) {
                ParentCheckCnt++;
            }
        });
        setParentChecked(ParentCheckCnt === outlets.length ? true : false);
    }

    const DeleteUser = (pkid) => {
        document.getElementById("divLoading").className = "show";
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "Users/" + pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Selected User Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete User!",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        document.getElementById("divLoading").className = "hide";
                    }
                })
        }
        else {
            document.getElementById("divLoading").className = "hide";
        }
    };


    const UpdateUser = () => {
        if (UserType === "" || UserType == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Select User Type!",
            });
        } else if (UserName === "" || UserName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter User Name!",
            });
        } else if (LoginName === "" || LoginName == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Login Name!",
            });
        } else if (Phone === "" || Phone == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter User Phone Number!",
            });
        } else if (Password === "" || Password == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter User Password!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                USER_ADDED_BY: Manager,
                USER_ADDED_BY_FKID: UserID,
                USER_TYPE_FKID: UserType,
                USER_NAME: UserName,
                USER_LOGIN_NAME: LoginName,
                USER_PHONE: Phone,
                USER_PASSWORD: Password,
                USER_EMAIL: Email,
                Outlets: AllOutlets,
            };
            axios.put(MyApiUrl + "Users/" + UserPkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "User Details Updated!",
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

    const HandleParentCheckbox = (event) => {
        setParentChecked(event.target.checked);
        const updatedData = AllOutlets.map((item) => {
            return { ...item, checked: event.target.checked };
        });
        setAllOutlets(updatedData);
    }

    const InnerCheckBoxChecked = (event) => {
        const updatedData = AllOutlets.map((item) => {
            if (item.STORE_PKID === parseInt(event.target.value)) {
                return { ...item, checked: event.target.checked };
            }
            return item;
        });
        ParentCheckBoxCheck(updatedData);
        setAllOutlets(updatedData);
    }

    const Updatebtn = () => (
        <CButton type="button" onClick={UpdateUser} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddUser} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
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
        setUserPkid("");
        setUserType("");
        setUserName("");
        setLoginName("");
        setPhone("");
        setEmail("");
        setUserTypeData("")
        setParentChecked(false);
        setAddButton(true);
        setUpdateButton(false);
        setCancelButton(false);
        setClearButton(true);

        GetUserType();
        GetAllUsers();
        GetAllOutlets();
    }

    const ViewOutlets = (list) => {
        const items = list.map((item) => {
            return {
                ...item,
                "Outlet ID": item.STORE_ID,
                "Outlet Code": item.STORE_CODE,
                "Outlet Name": item.STORE_NAME,
            };
        });
        setInnerTableData(items);
        setBlock(!block);
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
            <h1 id="ccmaster">Manage Users</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="4">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Add/Update User</CCardHeader>
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
                                            <CSelect
                                                custom
                                                name="ProductCategory"
                                                id="ProductCategory"
                                                value={UserType}
                                                onChange={(event) => {
                                                    setUserType(event.target.value);
                                                }}
                                            >
                                                <option value="-1">Select User Type</option>
                                                {UserTypeData}
                                            </CSelect>
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>User Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter User Name"
                                                value={UserName}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setUserName(value)
                                                }}

                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Login Name <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Login Name"
                                                value={LoginName}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setLoginName(value)
                                                }}

                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Phone number <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Phone Number"
                                                maxLength="10"
                                                value={Phone}
                                                onChange={(event) => {
                                                    let value = event.target.value;
                                                    value = value.replace(/[^0-9]/gi, "");
                                                    setPhone(value);
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Password <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter User Password"
                                                value={Password}
                                                onChange={(event) => {
                                                    setPassword(event.target.value);
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Email</CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter User Email"
                                                value={Email}
                                                onChange={(event) => {
                                                    setEmail(event.target.value);
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
                    </div>
                </CCol>

                <CCol md="12" lg="8">
                    <div id="country-table">
                        <table id="OutletTable">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: "3%", width: "70%" }}>Outlets</th>
                                    <th style={{ textAlign: "center", width: "30%" }}>
                                        <div className="checkboxes__row">
                                            <div className="checkboxes__item">
                                                <label className="checkbox style-d">
                                                    <input type="checkbox" value="All" checked={ParentChecked} id="Parent" onChange={HandleParentCheckbox} />
                                                    <div className="checkbox__checkmark" style={{ top: "-12px" }}></div>
                                                    <div class="checkbox__body">Select All</div>
                                                </label>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    AllOutlets.map((item) => {
                                        return (
                                            <React.Fragment>
                                                <tr>
                                                    <td style={{ textAlign: "left", width: "70%" }}>
                                                        <span style={{ marginLeft: "5%", color: "black", fontWeight: "400", fontSize: "14px" }}>{item.STORE_NAME}</span>
                                                    </td>
                                                    <td style={{ width: "30%" }}>
                                                        <div className="checkboxes__row">
                                                            <div className="checkboxes__item">
                                                                <label className="checkbox style-d">
                                                                    <input type="checkbox" onChange={InnerCheckBoxChecked} value={item.STORE_PKID} id={"ParentCheckbox_" + item.STORE_PKID} checked={item.checked} />
                                                                    <div className="checkbox__checkmark"></div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </CCol>
            </CRow>
            <CRow style={{ marginTop: "1%", }}>

                <CCol md="12" lg="12">
                    <div id="country-table">
                        <CCard id="Loccard" style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>View Users</CCardHeader>
                            <CCardBody>
                                <CDataTable
                                    items={UserData}
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
                                                        EditUser(
                                                            item.USER_PKID,
                                                            item.USER_TYPE_FKID,
                                                            item.USER_NAME,
                                                            item.USER_LOGIN_NAME,
                                                            item.USER_PHONE,
                                                            item.USER_PASSWORD,
                                                            item.USER_EMAIL,
                                                            item.OutletsForEdit,
                                                        );
                                                    }}
                                                    id="war-btn"
                                                >
                                                    <EditIcon />
                                                </CButton>
                                                <CButton
                                                    size="sm"
                                                    onClick={() => {
                                                        DeleteUser(item.USER_PKID);
                                                    }}
                                                    id="war-btn1"
                                                >
                                                    <DeleteSharpIcon />
                                                </CButton>
                                            </td>
                                        ),
                                        Outlet: (item) => (
                                            <td>
                                                <CButton
                                                    className="btn btn-info"
                                                    style={{ fontSize: "12px" }}
                                                    onClick={() => {
                                                        ViewOutlets(item.Outlets);
                                                    }}
                                                >
                                                    View
                                                </CButton>
                                            </td>
                                        ),
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
            </CRow>
            <CModal show={block} onClose={() => setBlock(!block)} color="dark">
                <CModalHeader closeButton>
                    <CModalTitle>View Outlets</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md="12">
                            <CDataTable
                                items={InnerTableData}
                                fields={fields}
                                hover
                                striped
                                bordered
                                sorter
                                tableFilter={table}
                                itemsPerPageSelect={items}
                                columnFilterSlot
                                size="sm"
                                itemsPerPage={5}
                                pagination
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        className="btn btn-danger"
                        style={{ fontSize: "12px" }}
                        onClick={() => setBlock(!block)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ManageUsers;
