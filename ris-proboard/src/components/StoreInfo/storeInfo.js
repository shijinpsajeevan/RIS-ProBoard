import React,{useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {increment,decrement,increment1,decrement1} from './storeInfoSlice';

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFilter } from '@fortawesome/free-solid-svg-icons'
import './storeInfo.css'

function StoreInfo({ name, ...props }) {

    const count =useSelector((state)=>state.counter1.count);
    const dispatch = useDispatch();

    const [companyData, setcompanyData] = useState([]);
    const [companyData1, setcompanyData1] = useState([]);
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);


    useEffect(() => {
        async function getCompanyProfile(){
            try {
                var optionData=[];
                var optionData1=[];
                await fetch("http://192.168.50.136:3001/dashboard").then((res) => res.json()).then((data) => optionData=data.messages.rows);
                await fetch("http://192.168.50.136:3001/dashboard/subsidiary").then((res) => res.json()).then((data1) => optionData1=data1.messages.rows);
                setcompanyData(optionData);
                setcompanyData1(optionData1);
            } catch (error) {
                console.log(error);
            }
        }
        getCompanyProfile();

      }, []);

    console.log("Working api")
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
                <Offcanvas show={show} onHide={handleClose} {...props}>
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    <FloatingLabel controlId="floatingSelect" label="Select Subsidiary">
                        <Form.Select aria-label="Floating label select example">
                        {companyData1.map((optionSet1) => <option key={optionSet1[1]} disabled={optionSet1[4]===0?true:false} value={optionSet1[1]}>{optionSet1[2]}</option> )}
                        </Form.Select>
                    </FloatingLabel>
                    <br/>
                    <FloatingLabel controlId="floatingSelect" label="Select Store">
                        <Form.Select aria-label="Floating label select example">
                          {companyData.map((optionSet) => <option key={optionSet[2]} disabled={optionSet[4]===0?true:false} value={optionSet[0]}>{optionSet[3]}</option> )}
                        </Form.Select>
                    </FloatingLabel>
                    </Offcanvas.Body>
                </Offcanvas>
                </div>
            </Col>
        </Row>
        <Row>
            <Card>
                <Card.Body>
                <Card.Title>Store Name : </Card.Title>
                <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Check</Button>
                </Card.Body>
            </Card>
        </Row>
        <Row>
            <p>{count}</p>
            <button onClick={()=>dispatch(increment())}>+</button>
            <button onClick={()=>dispatch(decrement())}>-</button>
        </Row>
    </Container>
    </>
  )
}

export default StoreInfo