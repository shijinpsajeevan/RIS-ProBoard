import React,{useEffect,useState} from 'react'
import {BarChart,Bar,Brush,ReferenceLine,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,} from 'recharts';
import {useSelector} from "react-redux";

// Import Axios Library
import axios from 'axios';

function DynamicBrushChartComp() {

  const [brushData,setBrushData] = useState([])

  const selected_store = useSelector((state)=>state.counter1.selected_store);
  const str_sDate = useSelector((state)=>state.counter1.str_sDate);
  const str_eDate = useSelector((state)=>state.counter1.str_eDate);

  const gettdytransBrushChart= async()=>{
    
    try {
        await axios.request({
          method:'POST',
          url:'http://localhost:3001/dyndashboard/tdytransBrushChart',
          headers:{
              'content-type':'application/json',
          },
          data:[{
              store_sid : selected_store,
              date1Par:str_sDate,
              date2Par:str_eDate
          }]
        })
      .then(function (res) {
        console.log("LINE_CHART",res.data);
        
        // {res.data.messages[0]?res.data.messages[0][0]?setnegQqty(res.data.messages[0][0]):setnegQqty(0):setnegQqty(0)}   
        var brushObj = res.data.map(([RCPT_No,RCPT_DATE,RCPT_TIME,SOLD_QTY,RETURN_QTY,DISCOUNT,EXT_PRICE_W_TAX])=>({RCPT_No,RCPT_DATE,RCPT_TIME,SOLD_QTY,RETURN_QTY,DISCOUNT,EXT_PRICE_W_TAX}))

        function convertIntObj(obj) {
          const res = []
          for (const key in obj) {
            res[key] = {};
            for (const prop in obj[key]) {
              const parsed = parseFloat(parseFloat(obj[key][prop],10).toFixed(2));
              res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
            }
          }
          brushObj = res;
        }
  
        convertIntObj(brushObj);
        
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
    gettdytransBrushChart()

    return () => {
    }
  },[selected_store,str_sDate,str_eDate])


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
          <Bar dataKey="EXT_PRICE_W_TAX" stackId="a" fill="#8884d8" label={{angle: -90, position: 'insideTop', fontSize:'8',fill:'white', offset:'15'}}/>
          <Bar type="number" dataKey="DISCOUNT" stackId="a" fill="#21e0d0"/>
          <Bar dataKey="SOLD_QTY" fill="#82ca9d" />
          <Bar dataKey="RETURN_QTY" fill="#f0c504" />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

export default DynamicBrushChartComp;