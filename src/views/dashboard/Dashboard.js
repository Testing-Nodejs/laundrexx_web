import React, { useState } from "react";
import "../../../src/style.css";
import "../../../src/Dashboard.scss";
import { CCol, CRow, CButton, CLink } from "@coreui/react";
import axios from "axios";
import { MyApiUrl, ViewImg } from "src/services/service";
import { useHistory } from "react-router-dom";
import { Style } from "react-style-tag";

const Dashboard = () => {
  const [CompanyData, setCompanyData] = useState([]);
  const [MainCnt, setMainCnt] = useState(0);
  React.useEffect(() => {
    // GetAllCompanies();
  }, []);

  const GetAllCompanies = () => {
    axios({
      method: "GET",
      url: MyApiUrl + "/companies",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        setCompanyData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let history = useHistory();
  return (
    <div>
      <Style>{`
          .c-main {
            background-color: #fbfbfb !important;
          }
        `}</Style>
      <CRow style={{ marginBottom: "3%" }}>
        {CompanyData.map((i, index) => {
          if (MainCnt <= 2) {
            setMainCnt(MainCnt + 1);
            return (
              <React.Fragment>
                <CCol md="1"></CCol>
                <CCol md="5">
                  <div className="container_Dashboard">
                    <CButton
                      className="DashboardBtn"
                      onClick={() => {
                        history.push("/CompanySalesReport", {
                          data: i,
                        });
                      }}
                    >
                      <div className="list">
                        <div className="rank">
                          <span>{index + 1}</span>
                        </div>
                        <div className="creator">
                          <h4>{i.COMPANY_SHORT_KEY}</h4>
                        </div>
                      </div>
                    </CButton>
                  </div>
                </CCol>
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment>
                <CCol md="1" style={{ marginTop: "3%" }}></CCol>
                <CCol md="5" style={{ marginTop: "3%" }}>
                  <div className="container_Dashboard">
                    <div style={{ width: "45%", float: "left", height: "115px" }}>
                      <img src={ViewImg + "/" + i.COMPANY_IMAGE} style={{width: "100%",borderRadius: "15px",height: "100px"}} alt="logo" />
                    </div>
                    <div style={{ width: "50%", float: "right" }}>
                      <CButton
                        className="DashboardBtn"
                        onClick={() => {
                          history.push("/CompanySalesReport", {
                            data: i,
                          });
                        }}
                        style={{marginTop: "8%"}}
                      >
                        <div className="list">
                          <div className="rank">
                            <span>{index + 1}</span>
                          </div>
                          <div className="creator">
                            <h4>{i.COMPANY_SHORT_KEY}</h4>
                          </div>
                        </div>
                      </CButton>
                    </div>
                  </div>
                </CCol>
              </React.Fragment>
            );
          }
        })}
      </CRow>
    </div>
  );
};

export default Dashboard;
