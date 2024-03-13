/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { MyApiUrl, ViewImg } from "src/services/service";

const CustomerInvoice = (props) => {
    const [InvoiceData, setInvoiceData] = useState([]);
    const [InvoiceItemData, setInvoiceItemData] = useState([]);
    const SplitDate = (OrderDate) => {
        const MainDate = OrderDate.split("T");
        const SplitT = MainDate[0];
        const OrderDates = SplitT.split("-");
        const FinalDate = OrderDates[2] + "-" + OrderDates[1] + "-" + OrderDates[0];
        return FinalDate;
    }
    const printModalInvoice = async () => {
        const obj = {
            OrderNumber: props.value
        }
        await axios.post(MyApiUrl + "OrderDetailsByNumber", obj).then(async (response) => {
            if (response.data.length > 0) {
                setInvoiceData(response.data);
                await axios.get(MyApiUrl + "AllOrderItemsForEditByOrderID/" + response.data[0].ORDER_PKID).then((response) => {
                    setInvoiceItemData(response.data); 
                    const screenWidth = screen.width;
                    const outletInvoiceWindowLeft = Math.floor((screenWidth - 780) / 2);

                    const CustomerInvoiceWindow = window.open("", "Customer Invoice Window", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=auto,top=" + (screen.height - 400) + ",left=" + outletInvoiceWindowLeft);


                    CustomerInvoiceWindow.document.write('<html><head><title>Customer Invoice</title></head><body style="font-family: Arial; font-size: 9px; letter-spacing: 1px">');
                    CustomerInvoiceWindow.document.write(document.getElementById("ModalCustomerInvoiceWindow").innerHTML);
                    CustomerInvoiceWindow.document.write('</body></html>');
                    CustomerInvoiceWindow.document.close();

                    // Set timeout for printing and closing each window
                    setTimeout(() => {
                        CustomerInvoiceWindow.print();
                        CustomerInvoiceWindow.close();
                    }, 1500);
                }).catch((error) => {
                    setInvoiceData([]);
                    setInvoiceItemData([]);
                });
            }
        }).catch((error) => {
            setInvoiceData([]);
            setInvoiceItemData([]);
        });
    }

    React.useEffect(() => {
        printModalInvoice();
    }, []);
    let footerCount = 0;
    return (

        <div style={{ position: "absolute", display: 'none', marginTop: "10%", textAlign: "center", marginBottom: "5%", height: "100%", width: "190px" }} id="ModalCustomerInvoiceWindow">
            <div style={{
                width: "190px", textAlign: "center",
            }}>
                {InvoiceData.length > 0 ?
                    <center>
                        <table width="525" className="bottom" cellspacing="0" cellpadding="2" style={{ borderLeft: "1px solid #000", borderTop: "1px solid #000", }}>

                            <tr style={{ textAlign: "center" }}>
                                <td colspan="6" style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid"
                                }}>
                                    <h3 style={{ margin: "2px 0px 0px 0px", padding: "0px 0px 0px 0px", fontSize: 10 }}>
                                        INVOICE</h3>
                                    <span style={{ float: "right", fontSize: "10px" }}>(Customer Copy)</span>
                                    <h2 style={{ margin: "2px 0px 0px 100px", padding: "0px 0px 0px 0px", fontSize: "14px" }}>Laundrexx Fabric Care India(P) Ltd.</h2>
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td width="150" colspan="3" style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid"
                                }}>
                                    <img src="./assets/images/LogoN.png" width="170" height="50" alt="logo1" />
                                </td>
                                <td width="180" colspan="1" class="top bottom left right" style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid"
                                }}>
                                    <img className="barcode" style={{ width: 70, height: 70 }} src={ViewImg + "/" + InvoiceData[0].ORDER_QR} data-vale={InvoiceData[0].ORDER_QR} />
                                </td>
                                <td colspan="2" style={{
                                    fontSize: 12, borderBottom: "thin solid",
                                    borderRight: "thin solid"
                                }}><b>Bill No: {InvoiceData[0].ORDER_ORDER_NUMBER}</b></td>
                            </tr>

                            <tr style={{
                                borderRight: "thin solid",
                                borderBottom: "thin solid",
                                borderColor: "black",
                                fontWeight: "600",
                                fontSize: "9px"
                            }}>
                                <td width="20%" style={{ paddingTop: 5, fontWeight: "300" }}>Customer Id</td>
                                <td width="3%">:</td>
                                <td width="27%" style={{ borderRight: "1px solid #000" }}>
                                    <b> {InvoiceData[0].CUSTOMER_PKID}</b>
                                </td>
                                <td width="20%" style={{ fontWeight: "300" }}>Invoice No</td>
                                <td width="3%">:</td>
                                <td width="27%" style={{ borderRight: "1px solid #000" }}>
                                    <b> {InvoiceData[0].ORDER_INVOICE_NUMBER}</b>
                                </td>
                            </tr>
                            <tr style={{
                                borderRight: "thin solid",
                                borderBottom: "thin solid",
                                borderColor: "black",
                                fontWeight: "600",
                                fontSize: "9px"
                            }}>
                                <td style={{ fontWeight: "300" }}>GST</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {InvoiceData[0].CUSTOMER_GST_TYPE}</td>
                                <td style={{ fontWeight: "300" }}>Invoice Date</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {SplitDate(InvoiceData[0].ORDER_DATE)}</td>
                            </tr>
                            <tr style={{
                                fontWeight: "600",
                                fontSize: "9px"
                            }}>
                                <td style={{ fontWeight: "300" }}>GST Number</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {InvoiceData[0].CUSTOMER_GST_NUMBER == null || InvoiceData[0].CUSTOMER_GST_NUMBER == "" ? "-" : InvoiceData[0].CUSTOMER_GST_NUMBER}</td>
                                <td style={{ fontWeight: "300" }}>Phone Number</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {InvoiceData[0].CUSTOMER_CONTACT_NUMBER}</td>
                            </tr>
                            <tr style={{
                                fontWeight: "600",
                                fontSize: "9px"
                            }}>
                                <td style={{ fontWeight: "300" }}>Name</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {InvoiceData[0].CUSTOMER_NAME}</td>
                                <td style={{ fontWeight: "300" }}>Due Date</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {SplitDate(InvoiceData[0].ORDER_DUE_DATE)}</td>
                            </tr>
                            <tr style={{
                                fontWeight: "600",
                                fontSize: "9px"
                            }}>
                                <td style={{ fontWeight: "300" }}>Address</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {InvoiceData[0].CUSTOMER_ADDRESS}</td>
                                <td style={{ fontWeight: "300" }}>Service Category</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {InvoiceData[0].SERVICE_CATEGORY_NAME}</td>
                            </tr>
                            <tr style={{
                                fontWeight: "600",
                                fontSize: "9px"
                            }}>
                                <td style={{ fontWeight: "300" }}>Attended By</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {InvoiceData[0].STORE_STAFF_NAME}</td>
                                <td style={{ fontWeight: "300" }}>HSN Number</td>
                                <td>:</td>
                                <td style={{ borderRight: "1px solid #000" }}> {InvoiceData[0].SERVICE_CATEGORY_HSN}</td>
                            </tr>
                        </table>

                        <table width="525" border="0" cellspacing="0" cellpadding="2" style={{ borderTop: "1px solid #000", fontSize: 10 }}>
                            <tr>
                                <th style={{
                                    borderLeft: "1px solid #000", borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Sl No</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Item</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Amount</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Additonal Request</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Quantity</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Count</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Defects</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Total Amount</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Discount</th>
                                <th style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", fontWeight: "800"
                                }}>Final Amount</th>
                            </tr>
                            {InvoiceItemData.length > 0 ?
                                InvoiceItemData.map((item, index) => {
                                    footerCount = footerCount + item.itemCount;
                                    return (
                                        <tr>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid",
                                                borderLeft: "1px solid #000", textAlign: "right"
                                            }}>{index + 1}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "left",
                                            }}>{item.itemName}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "right",
                                            }}>{item.itemAmount}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "left",
                                            }}>{item.AdditionalRequest}/₹{item.AdditionalRequestAmount}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "right",
                                            }}>{item.itemQuantity}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "right",
                                            }}>{item.itemCount}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "left",
                                            }}>{item.itemDefects}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "right",
                                            }}>{item.totalAmount}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "right",
                                            }}>{item.itemDiscount}</td>
                                            <td style={{
                                                borderBottom: "thin solid",
                                                borderRight: "thin solid", textAlign: "right",
                                            }}>{item.itemFinalAmount}</td>
                                        </tr>
                                    )
                                }
                                )
                                : null}

                            <tr>
                                <td colspan="6" className="top bottom right" style={{
                                    textAlign: "right",
                                    borderBottom: "1px solid #000",
                                    borderLeft: "1px solid #000",
                                    borderRight: "1px solid #000"
                                }}><b style={{ fontWeight: "800" }}>Total Quantity: {footerCount}</b></td>
                                <td colspan="4" style={{
                                    textAlign: "right",
                                    borderBottom: "1px solid #000",
                                    borderRight: "1px solid #000"
                                }}><b style={{ fontWeight: "800" }} >Total Amount(₹): &nbsp;&nbsp; {InvoiceData[0].ORDER_AMOUNT}</b></td>
                            </tr>
                        </table>

                        <table width="525" border="0" cellspacing="0" cellpadding="4" >
                            <tr>
                                <td rowspan="9" style={{
                                    borderLeft: "1px solid #000", width: 338, borderBottom: "thin solid",
                                    borderRight: "thin solid", fontSize: 11, textWrap: "balance"
                                }}><b style={{
                                    textDecoration: "underline",
                                    fontWeight: "800",
                                    marginBottom: 5
                                }}>Place of supply:</b><br />
                                    {InvoiceData[0].STORE_NAME} (<b>{InvoiceData[0].STORE_CODE}</b>)<br />
                                    {InvoiceData[0].STORE_ADDRESS}<br />
                                    Mob No. {InvoiceData[0].STORE_PHONE}<br />
                                    GST IN:<b> 33AABCL9659G1ZA</b><br />
                                    Email: laundrexx@hotmail.com<br />
                                    Service Type: {InvoiceData[0].SERVICE_TYPE_NAME}<br />
                                    {InvoiceData[0].ORDER_DOOR_DELIVERY == true ?
                                        "Delivery: Home Delivery"
                                        : null}
                                    <br />
                                    {InvoiceData[0].CUSTOMER_GST_TYPE == "B2B" ?
                                        <p><b>
                                            <span style={{ fontaize: 12 }}>Note: <br />
                                                * This is only reference invoice your actual GST invoice will be sent to your email.
                                            </span>
                                        </b>
                                        </p>
                                        : null}
                                </td>
                            </tr>
                            {InvoiceData[0].ORDER_DISCOUNT == 0 || InvoiceData[0].ORDER_DISCOUNT == "0" ?
                                <tr></tr>
                                :
                                <tr>
                                    <td style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid",
                                        fontSize: 11,
                                    }}>
                                        Discount</td>

                                    <td style={{
                                        textAlign: "right", borderBottom: "thin solid",
                                        borderRight: "thin solid",
                                        fontSize: 11
                                    }}>-{InvoiceData[0].ORDER_DISCOUNT}</td>
                                </tr>
                            }
                            {InvoiceData[0].ORDER_TOTAL_SUR_CHARGE == 0 || InvoiceData[0].ORDER_TOTAL_SUR_CHARGE == "0" ?
                                <tr></tr>
                                :
                                <tr>
                                    <td style={{
                                        borderBottom: "thin solid",
                                        borderRight: "thin solid",
                                        fontSize: 11,
                                    }}>
                                        Surcharge ({InvoiceData[0].SERVICE_TYPE_NAME}) @ {InvoiceData[0].SERVICE_TYPE_SURCHARGE}% Extra</td>

                                    <td style={{
                                        textAlign: "right", borderBottom: "thin solid",
                                        borderRight: "thin solid",
                                        fontSize: 11
                                    }}>{InvoiceData[0].ORDER_TOTAL_SUR_CHARGE}</td>
                                </tr>
                            }
                            <tr>
                                <td style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>Total Order Amount</td>
                                <td style={{
                                    textAlign: "right", borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>{InvoiceData[0].ORDER_TOTAL_ORDER_AMOUNT}</td>
                            </tr>
                            <tr>
                                <td style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>CGST @ {InvoiceData[0].SERVICE_CATEGORY_CGST}%</td>
                                <td style={{
                                    textAlign: "right", borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>{InvoiceData[0].ORDER_CGST}</td>
                            </tr>
                            <tr>
                                <td style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>SGST @ {InvoiceData[0].SERVICE_CATEGORY_SGST}%</td>
                                <td style={{
                                    textAlign: "right",
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>{InvoiceData[0].ORDER_SGST}</td>
                            </tr>
                            <tr>
                                <td style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>Total Invoice Value</td>
                                <td style={{
                                    textAlign: "right",
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>{InvoiceData[0].ORDER_TOTAL_INVOICE_VALUE}</td>
                            </tr>

                            <tr>
                                <td style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>Round Off</td>
                                <td style={{
                                    textAlign: "right", borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11
                                }}>{InvoiceData[0].ORDER_ROUND_OFF_INVOICE}</td>
                            </tr>

                            <tr>
                                <td style={{
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11,
                                    fontWeight: "800"
                                }}>Grand Total Amount</td>
                                <td style={{
                                    textAlign: "right", borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    fontSize: 11,
                                    fontWeight: "800"
                                }}>{InvoiceData[0].ORDER_GRAND_TOTAL_AMOUNT}</td>
                            </tr>

                            <tr style={{
                                fontweight: "bold", fontSize: 9,
                                textAlign: "center",
                                fontWeight: "800"
                            }}>
                                <td style={{
                                    textalign: "center", borderBottom: "thin solid",
                                    borderRight: "thin solid",
                                    borderLeft: "thin solid"
                                }} height="70" valign="top" >For Laundrexx Fabric Care India(P) Ltd<br /><br />
                                    <img src={ViewImg + "/" + InvoiceData[0].DIGITAL_SIGNATURE} width="145" height="45" alt="logo1" />
                                </td>
                                <td colspan="3" valign="top" style={{
                                    textalign: "center", borderBottom: "thin solid",
                                    borderRight: "thin solid"
                                }}>I hereby agree to the terms and conditions<br /><br /><br /><br /><br />Customer Signature<br />System Generated Invoice</td>
                            </tr>
                        </table>
                        <table width="525" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td class="top bottom left right" style={{
                                    borderLeft: "1px solid #000",
                                    borderBottom: "thin solid",
                                    borderRight: "thin solid", textAlign: "center",
                                    fontWeight: "800",
                                    fontSize: 9
                                }}>I hereby give my consent to receive calls / SMS / email communication from Laundrexx Fabric Care India Pvt.Ltd.<br />E & O.E. </td>
                            </tr>
                        </table>
                    </center>
                    : null}
            </div>
        </div>
    );
}
export default CustomerInvoice;