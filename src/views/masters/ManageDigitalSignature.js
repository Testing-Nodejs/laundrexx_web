/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CImg,
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
import { MyApiUrl, ViewImg } from "src/services/service";
import Swal from "sweetalert2";
import "../../style.css";
const table = { placeholder: "Search here...", label: "Search:  " };
const items = { label: "Rows:", values: [5, 10, 25, 50, 75, 100] };
const fields2 = [
    { key: "Action" },
    { key: "Category Name" },
    { key: "Short Code" },
    { key: "HSN Code" },
    { key: "CGST (%)" },
    { key: "SGST (%)" },
];

const ManageDigitalSignature = () => {
    const history = useHistory();
    const fileInputRef = useRef(null);
    const [Pkid, setPkid] = useState("");
    const [SignatureBy, setSignatureBy] = useState("");
    const [DigitalSignature, setDigitalSignature] = useState("");
    const [AddButton, setAddButton] = useState(true);
    const [UpdateButton, setUpdateButton] = useState(false);
    const [CancelButton, setCancelButton] = useState(false);
    const [ClearButton, setClearButton] = useState(true);
    const [ExistingImage, setExistingImage] = useState([]);

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
    const getDigitalSignature = async () => {
        document.getElementById("divLoading").className = "show";
        axios.get(MyApiUrl + "DigitalSignature").then((response) => {
            if (response.data.length > 0) {
                setDigitalSignature("");
                setSignatureBy(response.data[0].DIGITAL_SIGNATURE_NAME);
                setExistingImage(response.data[0].DIGITAL_SIGNATURE_FILE);
                setPkid(response.data[0].DIGITAL_SIGNATURE_PKID);
                setAddButton(false);
                setUpdateButton(true);
                setCancelButton(true);
                setClearButton(false);
                document.getElementById("divLoading").className = "hide";
            }
            else {
                setDigitalSignature("");
                setSignatureBy("");
                setExistingImage("");
                setPkid("");
                setAddButton(true);
                setUpdateButton(false);
                setCancelButton(false);
                setClearButton(true);
                document.getElementById("divLoading").className = "hide";
            }
        });
    };
    React.useEffect(() => {
        getDigitalSignature();
    }, []);

    const AddDigitalSignature = () => {
        if (SignatureBy == "" || SignatureBy == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Signature By!",
            });
        } else if (DigitalSignature == "" || DigitalSignature == null) {
            Toast.fire({
                icon: "warning",
                title: "Please choose Digital Signature File!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                DIGITAL_SIGNATURE_NAME: SignatureBy,
                DIGITAL_SIGNATURE_FILE: DigitalSignature,
            };
            axios.post(MyApiUrl + "DigitalSignature", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Digital Signature Added!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    Reset();
                    document.getElementById("divLoading").className = "hide";
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

    const DeleteDigitalSignature = () => {
        document.getElementById("divLoading").className = "show";
        var res = confirm("Are you sure you want to delete?");
        if (res) {
            axios({
                method: "DELETE",
                url: MyApiUrl + "DigitalSignature/" + Pkid + "",
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data === true) {
                        Swal.fire({
                            title: "Digital Signature Deleted!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        Reset();
                        document.getElementById("divLoading").className = "hide";
                    } else {
                        Swal.fire({
                            title: "Failed To Delete Digital Signature!",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        document.getElementById("divLoading").className = "hide";
                    }
                })
        }
    };


    const UpdateDigitalSignature = () => {
        if (SignatureBy == "" || SignatureBy == null) {
            Toast.fire({
                icon: "warning",
                title: "Please Enter Signature By!",
            });
        } else if (DigitalSignature == "" || DigitalSignature == null) {
            Toast.fire({
                icon: "warning",
                title: "Please choose Digital Signature File!",
            });
        } else {
            document.getElementById("divLoading").className = "show";
            var obj = {
                DIGITAL_SIGNATURE_NAME: SignatureBy,
                DIGITAL_SIGNATURE_FILE: DigitalSignature,
            };
            axios.put(MyApiUrl + "DigitalSignature/" + Pkid + "", obj).then((response) => {
                if (response.data === true) {
                    Swal.fire({
                        title: "Digital Signature Updated!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    Reset();
                    document.getElementById("divLoading").className = "hide";
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
        <CButton type="button" onClick={UpdateDigitalSignature} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            UPDATE
        </CButton>
    );

    const Addbtn = () => (
        <CButton type="button" onClick={AddDigitalSignature} className="btn btn-success" style={{ fontSize: "13px", marginTop: "10px", float: "right" }}>
            ADD
        </CButton>
    );

    const CancelBtn = () => (
        <CButton type="button" onClick={DeleteDigitalSignature} className="btn btn-danger" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            DELETE
        </CButton>
    );

    const ClearBtn = () => (
        <CButton type="button" onClick={Reset} className="btn btn-warning" style={{ fontSize: "13px", marginTop: "10px", float: "right", marginLeft: "10px" }}>
            CLEAR
        </CButton>
    );

    const Reset = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        getDigitalSignature();
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
            <h1 id="ccmaster">Manage Digital Signature</h1>
            <CRow style={{ marginTop: "3%", }}>
                <CCol md="12" lg="3"></CCol>
                <CCol md="12" lg="6">
                    <div id="country-master">
                        <CCard style={{ boxShadow: "0px 0px 1px 1px #959595" }}>
                            <CCardHeader>Manage Digital Signature</CCardHeader>
                            <CCardBody>

                                <CForm
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Signature By <span style={{ color: "red" }}>*</span></CLabel>
                                            <CInput
                                                id="text-input"
                                                name="text-input"
                                                placeholder="Enter Signature By"
                                                value={SignatureBy}
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/[^A-Z a-z]/gi, "");
                                                    value = value.replace(/\w+/g,
                                                        function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); }); setSignatureBy(value)
                                                }}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="12" md="12">
                                            <CLabel>Digital Signature <span style={{ color: "red" }}>*</span></CLabel>
                                            <input
                                                className="form-control"
                                                type="file"
                                                style={{ padding: "0px", lineHeight: "1.9" }}
                                                onChange={(event) => {
                                                    var formData = new FormData();
                                                    formData.append("file", event.target.files[0]);
                                                    axios.post(MyApiUrl + "upload", formData)
                                                        .then((response) => {
                                                            setExistingImage("");
                                                            setDigitalSignature(response.data);
                                                        });
                                                }}
                                                ref={fileInputRef}
                                            />
                                        </CCol>
                                    </CFormGroup>
                                    {DigitalSignature == "" || DigitalSignature == null ? null :
                                        <CFormGroup row>
                                            <CCol xs="12" md="12">
                                                <CLabel>Choosed Digital Signature</CLabel>
                                                <br />
                                                <CImg
                                                    src={ViewImg + DigitalSignature}
                                                />
                                            </CCol>
                                        </CFormGroup>
                                    }
                                    {ExistingImage == null || ExistingImage == "" ?
                                        null
                                        :
                                        <CFormGroup row>
                                            <CCol xs="12" md="12">
                                                <CLabel>Existing Digital Signature</CLabel>
                                                <br />
                                                <CImg
                                                    src={ViewImg + ExistingImage}
                                                />
                                            </CCol>
                                        </CFormGroup>
                                    }
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
                <CCol md="12" lg="3"></CCol>
            </CRow>
        </div>
    );
};

export default ManageDigitalSignature;
