import React,{useEffect,useState} from 'react'
import { ComposedChart,Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
        var lineObj = res.data.map(([STORE_CODE,ASSOCIATE,YEAR,MONTH,HOUR,SOLD_QTY,RETURN_QTY,EXT_PRICE,EXT_ORG_PRICE,EXT_DISC,EXT_PRICE_WT,EXT_DISC_WT])=>({STORE_CODE,ASSOCIATE,YEAR,MONTH,HOUR,SOLD_QTY,RETURN_QTY,EXT_PRICE,EXT_ORG_PRICE,EXT_DISC,EXT_PRICE_WT,EXT_DISC_WT}))

        function convertIntObj(obj) {
          const res = []
          for (const key in obj) {
            res[key] = {};
            for (const prop in obj[key]) {
              const parsed = parseFloat(parseFloat(obj[key][prop],10).toFixed(2));
              res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
            }
          }
          lineObj = res;
        }
  
        convertIntObj(lineObj);
        
        setLineData(lineObj)
        // setLineData((old)=>[...old,lineObj])
      })
      .catch(function (error) {
          console.error(error);
          alert("err")
      });

      } catch (error) {
          console.log("axios error");
      }
}

  const zoomLevel = useSelector((state)=>state.counter1.str_Intel_hr_zoom);

  useEffect(() => {  
    gettdyhrsalesChartLine()

    return () => {
    }
  },[zoomLevel,selected_store])


  return (
    <>
      <ResponsiveContainer>
      <ComposedChart width="100%" height={250} data={lineData}>
      <XAxis dataKey="HOUR" label={{ value: 'HOUR', position:'insideBottomRight', offset:-4}}/>
      <YAxis dataKey="EXT_PRICE_WT" type='number' label={{value: 'Price',angle: -90, position: 'insideLeft'}} />
      <Tooltip />
      <Legend />
      <CartesianGrid stroke="#f5f5f5" />
      <Bar dataKey="EXT_PRICE_WT" maxBarSize={30} fill="#413ea0cf" label={{angle: -90, position: 'center', fontSize:'12',fill:'white'}}/>
      <Line type="monotone" dataKey="SOLD_QTY" stroke="#ff7300" />
    </ComposedChart>
    </ResponsiveContainer>
    </>
  )
}

export default LineChartComp;