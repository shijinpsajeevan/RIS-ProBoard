// Imported React components
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import {
  set_str_filter_value,
  set_sbs_filter_value,
  set_selected_store,
  set_store_details,
  set_selected_sbs,
  set_str_Intel_hr_zoom,
  set_str_adv_filter,
  set_str_sDate,
  set_str_eDate
} from "../../redux/storeFilter";

import DynamicLineChartComp from "../DynamicCharts/DynamicLineChartComp";
import DynamicBarChartComp from "../DynamicCharts/DynamicBarChartComp";
import DynamicStackedBarComp from "../DynamicCharts/DynamicStackedBarComp";
import DynamicPieChartComp from "../DynamicCharts/DynamicPieChartComp";
import DynamicOuterPieChartComp from "../DynamicCharts/DynamicOuterPieChartComp";
import DynamicBrushChartComp from "../DynamicCharts/DynamicBrushChartComp";
import DynamicYtdBrushChartComp from "../DynamicCharts/DynamicYtdBrushChartComp";
import DynamicEmpDailyStatTable from "../DynamicTables/DynamicEmpDailyStatTable";
import DynamicTenderDailyStatTable from "../DynamicTables/DynamicTenderDailyStatTable";

// Import Axios Library
import axios from "axios";

// Imported Bootstrap Library
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

// Imported from Toastify

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Imported fontAwesome Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarCheck, faCalendarTimes, faFilter, faMarsAndVenus, faSearch, faShop, faTimeline, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

// Imported Custom Stylesheets
import "./dynamicStoreInfo.css";
import { LineChart } from "recharts";

function DynamicStoreInfo({ name, ...props }) {

  // Date range

  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 0));
  const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 59), 23));



  const str_options = useSelector((state) => state.counter1.str_filter_val);
  const sbs_options = useSelector((state) => state.counter1.sbs_filter_val);
  const selected_store = useSelector((state) => state.counter1.selected_store);
  const selected_sbs = useSelector((state) => state.counter1.selected_sbs);
  const store_details = useSelector((state) => state.counter1.store_details);
  const zoomLevel = useSelector((state) => state.counter1.str_Intel_hr_zoom);
  const str_adv_filter = useSelector((state) => state.counter1.str_adv_filter);
  const str_sDate = useSelector((state) => state.counter1.str_sDate);
  const str_eDate = useSelector((state) => state.counter1.str_eDate);

  console.log(str_options, "StoreOptions");

  const dispatch = useDispatch();

  const [show, setShow] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [zoom, setZoom] = useState(true);
  const [tdy_ttl_trans, set_tdy_ttl_trans] = useState(0);
  const [tdy_disc_total,set_tdy_disc_total] = useState(0);
  const [tdy_sold_qty, set_tdy_sold_qty] = useState(0);
  const [rtnQty,setrtnQty] = useState(0);
  const [rcptCount,set_rcptCount] = useState(0);
  const [taxTotal,set_taxTotal] = useState(0);
  const [deposit,setDeposit] = useState(0);
  


  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  const saveStoreSid = (str_sid) => {
    dispatch(set_selected_store(str_sid));
  };


  //Date converted for Oracle 

  const dateConverter = async(date,i)=>{
    try {

      // converting to 16.11.2022:16:04 format

      function convertTime12To24(date) {
        var day = String(date.getDate()).padStart(2,'0');
        var month = String(date.getMonth()+1).padStart(2,'0');
        var year = date.getFullYear();
        var hours   = String(date.getHours()).padStart(2,'0');
        var minutes  = String(date.getMinutes()).padStart(2,'0');
        return (day+"."+month+"."+year+":"+hours+ ":"+ minutes);
    }

      if(i==="sDate")
      {
        setStartDate(date);
        var timeProcess = convertTime12To24(date)
        dispatch(set_str_sDate(timeProcess))
      }

      else if(i==="eDate"){
        if(date<startDate)
        {
          toast.warn("Invalid Date Range");
        }
        setEndDate(date)
        var timeProcess = convertTime12To24(date)
        dispatch(set_str_eDate(timeProcess))
      }
      else{
        alert("Error in Date conversion, SdATE OR EdATE paramter error")
      }

    } catch (error) {
      alert("Error converting Time");
      console.log(error);
      return;
    }
  }


  const gettaxTotal = async (a) => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dyndashboard/dyngettaxtotal",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: a,
              date1Par:str_sDate,
              date2Par:str_eDate

            },
          ],
        })
        .then(function (res) {
          {
            res.data.messages[0]
              ? res.data.messages[0][0]
                ? set_taxTotal("AED " + res.data.messages[0][0])
                : set_taxTotal("AED " + 0)
              : set_taxTotal("AED " + 0);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };

  const getRcptCount = async (a) => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dyndashboard/dyngetRcptCount",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: a,
              date1Par:str_sDate,
              date2Par:str_eDate
            },
          ],
        })
        .then(function (res) {
          {res.data?set_rcptCount(res.data):set_rcptCount(0);}  
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };

  const gettdydisctotal = async (a) => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dyndashboard/gettdydisctotal",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: a,
              date1Par:str_sDate,
              date2Par:str_eDate
            },
          ],
        })
        .then(function (res) {
          {res.data?set_tdy_disc_total("AED "+ res.data):set_tdy_disc_total("AED "+0);}  
          // {res.data.messages[0]? res.data.messages[0][0]? set_tdy_disc_total(res.data.messages[0][0]): set_tdy_disc_total(0): set_tdy_disc_total(0);}
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };



  const gettdaytransttl = async (a) => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dyndashboard/gettdaytransttl",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: a,
              date1Par:str_sDate,
              date2Par:str_eDate
            },
          ],
        })
        .then(function (res) {
          {
            res.data.messages[0]
              ? res.data.messages[0][0]
                ? set_tdy_ttl_trans("AED " + res.data.messages[0][0])
                : set_tdy_ttl_trans("AED " + 0)
              : set_tdy_ttl_trans("AED " + 0);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };


  const gettdayqtyttl = async (a) => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dyndashboard/qtysldtoday",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: a,
              date1Par:str_sDate,
              date2Par:str_eDate
            },
          ],
        })
        .then(function (res) {
          {
            res.data.messages[0]
              ? res.data.messages[0][0]
                ? set_tdy_sold_qty(res.data.messages[0][0])
                : set_tdy_sold_qty(0)
              : set_tdy_sold_qty(0);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };


  const gettdyretqty = async (a) => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dyndashboard/gettdyretqty",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: a,
              date1Par:str_sDate,
              date2Par:str_eDate
            },
          ],
        })
        .then(function (res) {
          {
            res.data.messages[0]
              ? res.data.messages[0][0]
                ? setrtnQty(res.data.messages[0][0])
                : setrtnQty(0)
              : setrtnQty(0);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };


  const fetchStoreData = async (btn) => {
    if (btn === "btn") {
      setShow(false);
      dateConverter(startDate,"sDate");
      dateConverter(endDate,"eDate");
    }
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dyndashboard/storeData",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: selected_store,
            },
          ],
        })
        .then(function (res) {
          console.log(res.data.messages);
          console.log(res.data.messages[0][0], "Response from server");
          dispatch(set_store_details(res.data.messages));

          //   Fetching and Updating Today's sold qty in Store

          //passing store sid to the function
          gettdaytransttl(res.data.messages[0][0]);
          gettdayqtyttl(res.data.messages[0][0]);
          gettdydisctotal(res.data.messages[0][0]);
          gettdyretqty(res.data.messages[0][0]);
          getRcptCount(res.data.messages[0][0]);
          gettaxTotal(res.data.messages[0][0]);
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };

  useEffect(() => {
    if (selected_store) {
      fetchStoreData();
      dateConverter(startDate,"sDate");
      dateConverter(endDate,"eDate");
    }

    async function getSubsidiaryList() {
      try {
        await axios
          .request({
            method: "POST",
            url: "http://localhost:3001/dyndashboard/subsidiary",
            headers: {
              "content-type": "application/json",
            },
            data: [
              {
                sbs_sid: "647166130000131257",
              },
            ],
          })
          .then(function (res) {
            console.log(res.data.messages, "zzzzzzzzzzzzzzzzzzzzzzzzz");
            //     dispatch(set_store_details(res.data.messages));
            //   gettdaytransttl(res.data.messages[0][0])
          });
      } catch (error) {}

      // try {
      //     var sbs_list_OptionData=[];
      //     await fetch("http://localhost:3001/dyndashboard/subsidiary").then((res)=>res.json()).then((data)=>sbs_list_OptionData=data.messages.rows);
      //     console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",sbs_list_OptionData);
      //     dispatch(set_sbs_filter_value(sbs_list_OptionData));
      // } catch (error) {
      //     console.log("Error");
      // }
    }

    async function getStoreList() {
      try {
        var str_list_OptionData = [];
        await fetch("http://localhost:3001/dashboard")
          .then((res) => res.json())
          .then((data) => (str_list_OptionData = data.messages.rows));
        console.log(str_list_OptionData, "str_list_OptionData");
        dispatch(set_str_filter_value(str_list_OptionData));
        if (!selected_store) {
          dispatch(
            set_selected_store(
              str_list_OptionData.find((str) => str[4] === 1)[0]
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    getSubsidiaryList();
    getStoreList();
    selected_store ? fetchStoreData() : setShow(false);
  }, [selected_store,startDate,endDate]);

  return (
    <>
      <Container fluid>
        <Row
          className="rowStyle"
          style={{
            position: `fixed`,
            top: 0,
            left: 0,
            zIndex: 999,
            width: `100%`,
            minHeight: `3rem`,
            backgroundImage:
              "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
            marginLeft: "0",
          }}
        >
          <Col className="p-0">
            <div className="primaryHeaderBg">
              <h1 className="primaryHeader"> RIS Dashboard</h1>
            </div>
          </Col>
          <Col>
            <div className="primaryFilter">
              <Button onClick={toggleShow} className="filterIcon">
                <FontAwesomeIcon icon={faFilter} />
              </Button>
              <Offcanvas
                show={show}
                onHide={handleClose}
                {...props}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Filter</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  {/* <FloatingLabel controlId="floatingSelect" label="Select Subsidiary">
                        <Form.Select aria-label="Floating label select example" onChange={e=>saveStoreSid(e.target.value)} defaultValue={selected_store}>
                          {str_options.map((optionSet) => <option key={optionSet[0]} disabled={optionSet[4]===0?true:false} value={optionSet[0]}>{optionSet[3]}</option> )}
                          {
                            console.log( str_options,"testtesttesttest")
                          }
                        </Form.Select>
                    </FloatingLabel>
                    <br/> */}
                  <FloatingLabel
                    controlId="floatingSelect"
                    label="Select Store"
                  >
                    <Form.Select
                      aria-label="Floating label select example"
                      onChange={(e) => saveStoreSid(e.target.value)}
                      defaultValue={selected_store}
                    >
                      {str_options.map((optionSet) => (
                        <option
                          key={optionSet[0]}
                          disabled={optionSet[4] === 0 ? true : false}
                          value={optionSet[0]}
                        >
                          {optionSet[3]}
                        </option>
                      ))}
                      {console.log(str_options, "check")}
                    </Form.Select>
                  </FloatingLabel>
                  <br />
                  <div>
                  Start Date :
                  <DatePicker className="datePicker" selected={startDate} maxDate={new Date()} onChange={(date) => dateConverter(date,"sDate")} showTimeSelect dateFormat="MMMM d, yyyy h:mm aa"  todayButton="Today" highlightDates={[startDate, endDate]}/>
                  </div>
                  <br/>
                  <div>
                  End Date :
                  <DatePicker className="datePicker" selected={endDate} maxDate={new Date()} onChange={(date) => dateConverter(date,"eDate")} showTimeSelect dateFormat="MMMM d, yyyy h:mm aa"  todayButton="Today" highlightDates={[startDate, endDate]}/>
                  </div>
                  <br/>
                  <Button
                    variant="success"
                    onClick={() => fetchStoreData("btn")}
                  >
                    Save
                  </Button>
                </Offcanvas.Body>
                <ToastContainer position="bottom-right"/>
              </Offcanvas>
            </div>
          </Col>
        </Row>
        {/* {showAlert?<Row>
            <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Negative stock Alert</Alert.Heading>
                    <p></p>
            </Alert>
            </Row>:<></>} */}
        <Row className="rowStyle" style={{ marginTop: "4rem" }}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title style={{ display: "flex", flexFlow: "row wrap" }}>
                <span style={{ width: "33.33333%", textAlign: "left" }}></span>
                <span style={{ width: "33.33333%", textAlign: "center" }}><center style={{ fontFamily: "Nunito-Bold" }}>
                    <FontAwesomeIcon icon={faShop} /> Store Intelligence
                  </center></span>
                  < span style={{ width: "33.33333%", textAlign: "right"}}>
                   {str_adv_filter?<Button className="advSearch" onClick={()=>
                        {dispatch(set_str_adv_filter(!str_adv_filter))}}>Today Stats  <FontAwesomeIcon icon={faSearch} /></Button>:<Button className="advSearch" onClick={()=>
                          {dispatch(set_str_adv_filter(!str_adv_filter))}}>Advanced Search  <FontAwesomeIcon icon={faSearch} /></Button>}
                  </span>
                  <hr />
                </Card.Title>
                <Card.Text>
                  <Container fluid className="p-0 m-0">
                    <Row>
                      <Col xs={12} md={12}>
                        <div className="pl-1">
                          <div className="container pt-1">
                            <div className="row align-items-stretch">
                            <div className="c-dashboardInfo col-md-4 col-sm-12">
                                <div className="wrap">
                                  <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                                    Transaction Total
                                    <svg
                                      className="MuiSvgIcon-root-19"
                                      focusable="false"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      role="presentation"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h24v24H0z"
                                      ></path>
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                                    </svg>
                                  </h4>
                                  <span className="hind-font caption-12 c-dashboardInfo__count">
                                    {tdy_ttl_trans}
                                  </span>
                                </div>
                              </div>
                              <div className="c-dashboardInfo col-md-4 col-sm-12">
                                <div className="wrap">
                                  <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                                    Quantity Sold
                                    <svg
                                      className="MuiSvgIcon-root-19"
                                      focusable="false"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      role="presentation"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h24v24H0z"
                                      ></path>
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                                    </svg>
                                  </h4>
                                  <span className="hind-font caption-12 c-dashboardInfo__count">
                                    {tdy_sold_qty}
                                  </span>
                                </div>
                              </div>
                              <div className="c-dashboardInfo col-md-4 col-sm-12">
                                <div className="wrap">
                                  <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                                    Return Quantity
                                    <svg
                                      className="MuiSvgIcon-root-19"
                                      focusable="false"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      role="presentation"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h24v24H0z"
                                      ></path>
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                                    </svg>
                                  </h4>
                                  <span className="hind-font caption-12 c-dashboardInfo__count">
                                    {rtnQty}
                                  </span>
                                  <span className="hind-font caption-12 c-dashboardInfo__subInfo">
                                  </span>
                                </div>
                              </div>
                              <div className="c-dashboardInfo col-md-4 col-sm-12">
                                <div className="wrap">
                                  <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                                    Discounts
                                    <svg
                                      className="MuiSvgIcon-root-19"
                                      focusable="false"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      role="presentation"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h24v24H0z"
                                      ></path>
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                                    </svg>
                                  </h4>
                                  <span className="hind-font caption-12 c-dashboardInfo__count">
                                    {tdy_disc_total}
                                  </span>
                                </div>
                              </div>
                              <div className="c-dashboardInfo col-md-4 col-sm-12">
                                <div className="wrap">
                                  <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                                    Receipt Count
                                    <svg
                                      className="MuiSvgIcon-root-19"
                                      focusable="false"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      role="presentation"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h24v24H0z"
                                      ></path>
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                                    </svg>
                                  </h4>
                                  <span className="hind-font caption-12 c-dashboardInfo__count">
                                    {rcptCount}
                                  </span>
                                </div>
                              </div>
                              <div className="c-dashboardInfo col-md-4 col-sm-12">
                                <div className="wrap">
                                  <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                                    Total Tax
                                    <svg
                                      className="MuiSvgIcon-root-19"
                                      focusable="false"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      role="presentation"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h24v24H0z"
                                      ></path>
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                                    </svg>
                                  </h4>
                                  <span className="hind-font caption-12 c-dashboardInfo__count">
                                    {taxTotal}
                                  </span>
                                </div>
                              </div>
                              {/* <div className="c-dashboardInfo col-md-4 col-sm-12">
                                <div className="wrap">
                                  <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                                    Negative Stock
                                    <svg
                                      className="MuiSvgIcon-root-19"
                                      focusable="false"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      role="presentation"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h24v24H0z"
                                      ></path>
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                                    </svg>
                                  </h4>
                                  <span className="hind-font caption-12 c-dashboardInfo__count">
                                    {negQty}
                                  </span>
                                  <span className="hind-font caption-12 c-dashboardInfo__subInfo">
                                    {" "}
                                    <Button variant="outline-primary">
                                      Details
                                    </Button>
                                  </span>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="rowStyle">
          <Col xs={12} md={6}>
            <Card
              style={{ width: "100%", height: "300px" }}
              className="text-center p-1"
            >
              <Card.Title style={{ display: "flex", flexFlow: "row wrap" }}>
                <span style={{ width: "33.33333%", textAlign: "left" }}></span>
                <span style={{ width: "33.33333%", textAlign: "center" }}>
                  {zoomLevel ? "Sale Hours" : "Active Sale Hours"}
                </span>
                <Form
                  style={{
                    fontSize: "13px",
                    width: "33.33333%",
                    textAlign: "right",
                  }}
                >
                  {/* <span>
                    <Form.Check
                      checked={zoomLevel}
                      onChange={() =>
                        dispatch(set_str_Intel_hr_zoom(!zoomLevel))
                      }
                      type="switch"
                      id="custom-switch"
                    />
                  </span> */}
                </Form>
              </Card.Title>
              <Card.Body>
                <DynamicLineChartComp />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card
              style={{ width: "100%", height: "300px" }}
              className="text-center p-1"
            >
              <Card.Title>Staff Performance</Card.Title>
              <Card.Body>
                <DynamicStackedBarComp />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="rowStyle">
          <Col xs={12} md={12}>
            <Card
              style={{ width: "100%", height: "300px" }}
              className="text-center p-1"
            >
              <Card.Title>Transaction Overview</Card.Title>
              <Card.Body>
                <DynamicBrushChartComp />
              </Card.Body>
            </Card>
          </Col>
          {/* <Col xs={12} md={6}>
            <Card
              style={{ width: "100%", height: "300px" }}
              className="text-center p-1"
            >
              <Card.Title>Yesterday's Sale Chart</Card.Title>
              <Card.Body>
              <YtdBrushChartComp/>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
        <Row className="rowStyle">
          <Col xs={12} md={12}>
            <Card className="text-center p-1" style={{background:'none',backgroundColor:'rgba(255, 255, 255, 0.2)'}}>
              <Card.Title style={{background:'none',color:'white'}}>Store KPI</Card.Title>
              <Card.Body >
                    <DynamicEmpDailyStatTable/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="rowStyle">
          <Col xs={12} md={6}>
            <Card className="text-center p-1" style={{background:'none',backgroundColor:'rgba(255, 255, 255, 0.2)',width: "100%", height: "400px"}}>
              <Card.Title style={{background:'none',color:'white'}}>Discount Reason</Card.Title>
              <Card.Body >
                    <DynamicPieChartComp/>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="text-center p-1" style={{background:'none',backgroundColor:'rgba(255, 255, 255, 0.2)',width: "100%", height: "400px"}}>
              <Card.Title style={{background:'none',color:'white'}}>Tenders</Card.Title>
              <Card.Body >
                    <DynamicOuterPieChartComp/>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={12}>
            <Card className="text-center p-1" style={{background:'none',backgroundColor:'rgba(255, 255, 255, 0.2)',marginTop:'10px'}}>
              <Card.Title style={{background:'none',color:'white'}}>Tender Info</Card.Title>
              <Card.Body >
                    <DynamicTenderDailyStatTable/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DynamicStoreInfo;
