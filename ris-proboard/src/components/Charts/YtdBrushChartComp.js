import React,{useEffect,useState} from 'react'
import {BarChart,Bar,Brush,ReferenceLine,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,} from 'recharts';
import {useSelector} from "react-redux";

// Import Axios Library
import axios from 'axios';

function YtdBrushChartComp() {

  const [brushData,setBrushData] = useState([])

  const selected_store = useSelector((state)=>state.counter1.selected_store);

  const getytdtransBrushChart= async()=>{
    
    try {
        await axios.request({
          method:'POST',
          url:'http://192.168.50.136:3001/dashboard/ytdtransBrushChart',
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
        var brushObj = res.data.map(([RCPT_No,RCPT_DATE,RCPT_TIME,SOLD_QTY,RETURN_QTY,DISCOUNT,EXT_PRICE_W_TAX])=>({RCPT_No,RCPT_DATE,RCPT_TIME,SOLD_QTY,RETURN_QTY,DISCOUNT,EXT_PRICE_W_TAX}))

        console.log("After MAP",brushObj)
        
        setBrushData(brushObj)

      })
      .catch(function (error) {
          console.error(error);
          alert("err")
      });

      } catch (error) {
          console.log("axios error");
      }
}

  useEffect(() => {  
    getytdtransBrushChart()

    return () => {
    }
  },[selected_store])


  return (
    <>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={brushData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="RCPT_No" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          <ReferenceLine y={0} stroke="#000" />
          <Brush dataKey="name" height={30} stroke="#8884d8" />
          <Bar dataKey="EXT_PRICE_W_TAX" stackId="a" fill="#8884d8" />
          <Bar dataKey="DISCOUNT" stackId="a" fill="#21e0d0" />
          <Bar dataKey="SOLD_QTY" fill="#82ca9d" />
          <Bar dataKey="RETURN_QTY" fill="#f0c504" />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

export default YtdBrushChartComp;