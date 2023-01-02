// Imported React components
import React,{useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import Badge from 'react-bootstrap/Badge';
import {set_str_filter_value,set_sbs_filter_value,set_selected_store,set_store_details, set_selected_sbs} from '../../redux/storeFilter';

import LineChartComp from '../Charts/LineChartComp';
import BarChartComp from '../Charts/BarChartComp';
import StackedBarComp from '../Charts/StackedBarComp';
import PieChartComp from '../Charts/PieChartComp';

// Import Axios Library
import axios from 'axios';

// Imported Bootstrap Library
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';

// Imported fontAwesome Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFilter,faShop} from '@fortawesome/free-solid-svg-icons'

// Imported Custom Stylesheets
import './storeInfo.css'
import { LineChart } from 'recharts';

function StoreInfo({ name, ...props }) {

    const str_options = useSelector((state)=>state.counter1.str_filter_val);
    const sbs_options = useSelector((state)=>state.counter1.sbs_filter_val);
    const selected_store = useSelector((state)=>state.counter1.selected_store);
    const selected_sbs = useSelector((state)=>state.counter1.selected_sbs);
    const store_details = useSelector((state)=>state.counter1.store_details);

    console.log(str_options,"StoreOptions");
  
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(true);
    const [tdy_ttl_trans,set_tdy_ttl_trans] = useState(0);
    const [tdy_sold_qty,set_tdy_sold_qty] = useState(0);
    const [ohQty,setohQty] = useState(0);
    const [negQty,setnegQqty] = useState(0);
    
    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    const saveStoreSid = (str_sid)=>{
        dispatch(set_selected_store(str_sid));
    }


    const gettdyhrsalesChartLine= async(a)=>{
        try {
            await axios.request({
              method:'POST',
              url:'http://localhost:3001/dashboard/tdyhrsalesChartLine',
              headers:{
                  'content-type':'application/json',
              },
              data:[{
                  store_sid : a,

              }]
            })
          .then(function (res) {
            console.log("LINE_CHART",res.data);
            // {res.data.messages[0]?res.data.messages[0][0]?setnegQqty(res.data.messages[0][0]):setnegQqty(0):setnegQqty(0)}           
          })
          .catch(function (error) {
              console.error(error);
          });
  
          } catch (error) {
              console.log("axios error");
          }
}

    const getnegativeStock = async(a)=>{
        try {
            await axios.request({
              method:'POST',
              url:'http://localhost:3001/dashboard/negativeStock',
              headers:{
                  'content-type':'application/json',
              },
              data:[{
                  store_sid : a,

              }]
            })
          .then(function (res) {
            {res.data.messages[0]?res.data.messages[0][0]?setnegQqty(res.data.messages[0][0]):setnegQqty(0):setnegQqty(0)}           
          })
          .catch(function (error) {
              console.error(error);
          });
  
          } catch (error) {
              console.log("axios error");
          }
}

    const getstoreOHqty = async(a)=>{
        try {
            await axios.request({
              method:'POST',
              url:'http://localhost:3001/dashboard/storeOHqty',
              headers:{
                  'content-type':'application/json',
              },
              data:[{
                  store_sid : a,

              }]
            })
          .then(function (res) {
            {res.data.messages[0]?res.data.messages[0][0]?setohQty(res.data.messages[0][0]):setohQty(0):setohQty(0)}           
          })
          .catch(function (error) {
              console.error(error);
          });
  
          } catch (error) {
              console.log("axios error");
          }
}


    const gettdaytransttl = async(a)=>{
            try {
                await axios.request({
                  method:'POST',
                  url:'http://localhost:3001/dashboard/gettdaytransttl',
                  headers:{
                      'content-type':'application/json',
                  },
                  data:[{
                      store_sid : a,

                  }]
                })
              .then(function (res) {
                {res.data.messages[0]?res.data.messages[0][0]?set_tdy_ttl_trans("AED "+res.data.messages[0][0]):set_tdy_ttl_trans("AED "+0):set_tdy_ttl_trans("AED "+0)}           
              })
              .catch(function (error) {
                  console.error(error);
              });
      
              } catch (error) {
                  console.log("axios error");
              }
    }

    const gettdayqtyttl = async(a)=>{
        try {
            await axios.request({
              method:'POST',
              url:'http://localhost:3001/dashboard/qtysldtoday',
              headers:{
                  'content-type':'application/json',
              },
              data:[{
                  store_sid : a,

              }]
            }).then(function (res) {       
            {res.data.messages[0]?res.data.messages[0][0]?set_tdy_sold_qty(res.data.messages[0][0]):set_tdy_sold_qty(0):set_tdy_sold_qty(0)}           
          })
          .catch(function (error) {
              console.error(error);
          });
  
          } catch (error) {
              console.log("axios error");
          }
}

    const fetchStoreData = async(btn) =>{       
        if(btn==="btn")
        {
            setShow(false)
        }
            try {
                await axios.request({
                  method:'POST',
                  url:'http://localhost:3001/dashboard/storeData',
                  headers:{
                      'content-type':'application/json',
                  },
                  data:[{
                      store_sid : selected_store
                  }]
                })
              .then(function (res) {
                  console.log(res.data.messages);
                  console.log(res.data.messages[0][0],"Response from server");
                  dispatch(set_store_details(res.data.messages));

                //   Fetching and Updating Today's sold qty in Store

                //passing store sid to the function
                gettdaytransttl(res.data.messages[0][0]);
                gettdayqtyttl(res.data.messages[0][0]);
                getstoreOHqty(res.data.messages[0][0]);
                getnegativeStock(res.data.messages[0][0]);
                gettdyhrsalesChartLine(res.data.messages[0][0]);
               
              })
              .catch(function (error) {
                  console.error(error);
              });
      
              } catch (error) {
                  console.log("axios error");
              }
        
    }

    useEffect(() => {
        if(selected_store)
        {
            fetchStoreData();
        }

        async function getSubsidiaryList(){
            try {
                await axios.request({
                    method:'POST',
                    url:'http://localhost:3001/dashboard/subsidiary',
                    headers:{
                        'content-type':'application/json',
                    },
                    data:[{
                        sbs_sid : '647166130000131257'
                    }]
                  }).then(function (res) {
                    console.log(res.data.messages,"zzzzzzzzzzzzzzzzzzzzzzzzz");
                //     dispatch(set_store_details(res.data.messages));
                //   gettdaytransttl(res.data.messages[0][0])
                  
                 
                })
            } catch (error) {
                
            }

            // try {
            //     var sbs_list_OptionData=[];
            //     await fetch("http://localhost:3001/dashboard/subsidiary").then((res)=>res.json()).then((data)=>sbs_list_OptionData=data.messages.rows);
            //     console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",sbs_list_OptionData);
            //     dispatch(set_sbs_filter_value(sbs_list_OptionData));
            // } catch (error) {
            //     console.log("Error");
            // }
        }

        async function getStoreList(){
            try {
                var str_list_OptionData=[];
                await fetch("http://localhost:3001/dashboard").then((res) => res.json()).then((data) => str_list_OptionData=data.messages.rows);
                console.log(str_list_OptionData,"str_list_OptionData");
                dispatch(set_str_filter_value(str_list_OptionData));
                if(!selected_store)
                {
                    dispatch(set_selected_store((str_list_OptionData.find(str=>str[4]===1))[0]))
                }
            } catch (error) {
                console.log(error);
            }
        }
        getSubsidiaryList();
        getStoreList();
        selected_store?fetchStoreData():setShow(false);
      }, [selected_store]);


  return (
    <>
    <Container fluid>
        <Row className='rowStyle'>
            <Col className='p-0'>
                <div className='primaryHeaderBg'>
                <h1 className="primaryHeader"> RIS Dashboard</h1>
                </div>
            </Col>
            <Col>
                <div className='primaryFilter'>
                <Button onClick={toggleShow} className='filterIcon'><FontAwesomeIcon icon={faFilter}/></Button>
                <Offcanvas show={show} onHide={handleClose} {...props} placement="end">
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    <FloatingLabel controlId="floatingSelect" label="Select Subsidiary">
                        <Form.Select aria-label="Floating label select example" onChange={e=>saveStoreSid(e.target.value)} defaultValue={selected_store}>
                          {str_options.map((optionSet) => <option key={optionSet[0]} disabled={optionSet[4]===0?true:false} value={optionSet[0]}>{optionSet[3]}</option> )}
                          {
                            console.log( str_options,"testtesttesttest")
                          }
                        </Form.Select>
                    </FloatingLabel>
                    <br/>
                    <FloatingLabel controlId="floatingSelect" label="Select Store">
                        <Form.Select aria-label="Floating label select example" onChange={e=>saveStoreSid(e.target.value)} defaultValue={selected_store}>
                          {str_options.map((optionSet) => <option key={optionSet[0]} disabled={optionSet[4]===0?true:false} value={optionSet[0]}>{optionSet[3]}</option> )}
                          {
                            console.log( str_options,"check")
                          }
                        </Form.Select>
                    </FloatingLabel>
                    <br/>
                    <FloatingLabel controlId="floatingSelect" label="Mode">
                        <Form.Select aria-label="Floating label select example">
                          <option>Local</option>
                          <option>Remote</option>
                        </Form.Select>
                    </FloatingLabel>
                    <br/>
                    <Button variant="success" onClick={()=>fetchStoreData("btn")}>Save</Button>
                    </Offcanvas.Body>
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
        <Row className='rowStyle'>
            <Col>
            <Card>
                <Card.Body>
                <Card.Title>
                   <center style={{fontFamily:"Nunito-Bold"}}><FontAwesomeIcon icon={faShop} /> Store Intelligence</center>
                   <hr/>
                </Card.Title>
                <Card.Text>
                <Container fluid className='p-0 m-0'>
                        <Row>
                        <Col xs={12} md={5}>
                        <Table borderless className='p-0 storeTable' responsive>
                            <tbody>
                                <tr>
                                <td>Store Name</td>
                                <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                <td>{store_details[0]?store_details[0][2]:''} &nbsp;
                                        <sup>{store_details[0]?store_details[0][3]===1?<span style={{fontSize: "small"}}><Badge pill bg="success">Active</Badge></span>:<span style={{fontSize: "small"}}><Badge pill bg="secondary">Deactivated</Badge></span>:''}
                                        </sup></td>
                                </tr>
                                <tr>
                                <td>Store Code</td>
                                <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                <td>{store_details[0]?store_details[0][1]:''}</td>
                                </tr>

                                <tr>
                                    <td>Address</td>
                                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                    <td>{store_details[0]?<span>{store_details[0][4]}<br/></span>:''}
                                    {store_details[0]?<span>{store_details[0][5]}<br/></span>:''}
                                    {store_details[0]?<span>{store_details[0][6]}<br/></span>:''}
                                    {store_details[0]?<span>{store_details[0][7]}<br/></span>:''}
                                    {store_details[0]?<span>{store_details[0][8]}</span>:''}
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td>Zip</td>
                                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                    <td>{store_details[0]?store_details[0][9]?store_details[0][9]:"N/A":'N/A'}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Phone</td>
                                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                    <td>{store_details[0]?<><span>{store_details[0][10]}</span><><span><br/>{store_details[0][11]}</span></></>:'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                <td>Subsidiary Name</td>
                                <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                <td>{store_details[0]?store_details[0][13]?store_details[0][13]:"N/A":"N/A"}</td>
                                </tr>
                                <tr>
                                <td>Active price level</td>
                                <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                <td>{store_details[0]?store_details[0][15]?store_details[0][15]:"N/A":'N/A'}</td>
                                </tr>

                                <tr>
                                    <td>Tax Area 1</td>
                                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                    <td>
                                    {store_details[0]?store_details[0][16]?store_details[0][16]:"N/A":'N/A'}
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td>Tax Area 2</td>
                                    <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                    <td>{store_details[0]?store_details[0][17]?store_details[0][17]:"N/A":"N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        </Col>
                        <Col xs={12} md={7}>
                        <div className='pl-1'>
                            <div className="container pt-1">
                                <div className="row align-items-stretch">
                                <div className="c-dashboardInfo col-md-6">
                                    <div className="wrap">
                                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Quantity Sold<svg
                                        className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                                        </path>
                                        </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{tdy_sold_qty}</span>
                                        <span
                                        className="hind-font caption-12 c-dashboardInfo__subInfo">Yesterday: 0</span>
                                    </div>
                                </div>
                                <div className="c-dashboardInfo col-md-6">
                                    <div className="wrap">
                                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Transaction Total<svg
                                        className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                                        </path>
                                        </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{tdy_ttl_trans}</span><span
                                        className="hind-font caption-12 c-dashboardInfo__subInfo">Yesterday: 0</span>
                                    </div>
                                </div>
                                <div className="c-dashboardInfo col-md-6">
                                    <div className="wrap">
                                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Available Stock<svg
                                        className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                                        </path>
                                        </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{ohQty}</span>
                                        <span
                                        className="hind-font caption-12 c-dashboardInfo__subInfo">Transit: 0</span>
                                    </div>
                                </div>
                                <div className="c-dashboardInfo col-md-6">
                                    <div className="wrap">
                                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Negative Stock<svg
                                        className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
                                        </path>
                                        </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">{negQty}</span><span
                                        className="hind-font caption-12 c-dashboardInfo__subInfo">  <Button variant="outline-primary">Details</Button></span>
                                    </div>
                                </div>
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
        <Row className='rowStyle'>
            <Col xs={12} md={6}>
                <Card style={{width:"100%",height:"300px"}} className="text-center p-1">
                    <Card.Title>Sale Hours</Card.Title>
                    <Card.Body>
                        <LineChartComp/>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={12} md={6}>
            <Card style={{width:"100%",height:"300px"}} className="text-center p-1">
                    <Card.Title>Staff Performance</Card.Title>
                    <Card.Body>
                        <StackedBarComp/>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className='rowStyle'>
        <Col xs={12} md={6}>
            <Card style={{width:"100%",height:"300px"}} className="text-center p-1">
                    <Card.Title>Hourly Sale</Card.Title>
                    <Card.Body>
                        <PieChartComp/>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={12} md={6}>
            <Card style={{width:"100%",height:"300px"}} className="text-center p-1">
                    <Card.Title>Hourly Sale</Card.Title>
                    <Card.Body>
                        <BarChartComp/>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default StoreInfo