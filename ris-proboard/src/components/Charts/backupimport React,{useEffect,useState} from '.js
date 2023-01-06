import React,{useEffect,useState} from 'react'
import { ComposedChart,Bar,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import {useSelector, useDispatch} from "react-redux";

// Import Axios Library
import axios from 'axios';

function LineChartComp() {

  const [lineData,setLineData] = useState([]) 

  const selected_store = useSelector((state)=>state.counter1.selected_store);

  const gettdyhrsalesChartLine= async()=>{

    
    try {
        await axios.request({
          method:'POST',
          url:'http://localhost:3001/dashboard/tdyhrsalesChartLine',
          headers:{
              'content-type':'application/json',
          },
          data:[{
              store_sid : selected_store,
          }]
        })
      .then(function (res) {
        console.log("LINE_CHART",res.data);
        // {res.data.messages[0]?res.data.messages[0][0]?setnegQqty(res.data.messages[0][0]):setnegQqty(0):setnegQqty(0)}   
        const lineObj = res.data.map(([STORE_CODE,ASSOCIATE,YEAR,MONTH,HOUR,SOLD_QTY,RETURN_QTY,EXT_PRICE,EXT_ORG_PRICE,EXT_DISC,EXT_PRICE_WT,EXT_DISC_WT])=>({STORE_CODE,ASSOCIATE,YEAR,MONTH,HOUR,SOLD_QTY,RETURN_QTY,EXT_PRICE,EXT_ORG_PRICE,EXT_DISC,EXT_PRICE_WT,EXT_DISC_WT}))
        
        setLineData((old)=>[...old,lineObj])
      })
      .catch(function (error) {
          console.error(error);
      });

      } catch (error) {
          console.log("axios error");
      }
}


  const zoomLevel = useSelector((state)=>state.counter1.str_Intel_hr_zoom);
  const [prevSet,setPrevSet] = useState([
    {
      HOUR: 13,
      QTY: 1,
      PRICE: 32.56
    },
{
      HOUR: 15,
      QTY: 1,
      PRICE: 16.17
    },
{
      HOUR: 20,
      QTY: 23,
      PRICE: 247.06
    }
  ])

  const [dataSet,setDataSet] = useState([
    {
      HOUR: 13,
      QTY: 4,
      PRICE: 32.56
    },
{
      HOUR: 15,
      QTY: 1,
      PRICE: 16.17
    },
{
      HOUR: 20,
      QTY: 23,
      PRICE: 247.06
    }
  ]);

  useEffect(() => {  

    gettdyhrsalesChartLine()

    if(zoomLevel)
    {
      setDataSet((old)=>[...old,prevSet])
    }
  
    else{
      
        var daysOfTheWeek = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
        var existingDays = [];
        var dataSet1 = prevSet;
    
          for(var i=0;i<dataSet1.length;i++){
            existingDays[i] = dataSet1[i]['HOUR'];
            }
    
          // check which day's data is missing; then create a dummy object and push it to the dummyData object
    
          for(var i=0;i<daysOfTheWeek.length;i++){
                if(existingDays.indexOf(parseInt(daysOfTheWeek[i])) < 0){
                    var dummyObject = {
                    "HOUR": i,
                    "QTY": 0,
                    "PRICE":0
                    };
                    dataSet1.push(dummyObject);
                }
              }
    
              //sort day wise ascending
    
          dataSet1.sort(function(x,y){ return parseInt(x.HOUR) - parseInt(y.HOUR) });
          setDataSet((old)=>[...old,dataSet1])

          console.log(dataSet);
    }  
    return () => {
    }
  },[zoomLevel,selected_store])


  return (
    <>
      <ResponsiveContainer>
      <ComposedChart width="100%" height={250} data={lineData}>
      <XAxis dataKey="HOUR" />
      <YAxis />
      <Tooltip />
      <Legend />
      <CartesianGrid stroke="#f5f5f5" />
      <Bar dataKey="EXT_PRICE" barSize={20} fill="#413ea0cf" />
      <Line type="monotone" dataKey="SOLD_QTY" stroke="#ff7300" />
    </ComposedChart>
    </ResponsiveContainer>
    </>
  )
}

export default LineChartComp;