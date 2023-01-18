import React,{useState,useEffect} from 'react'
import { ComposedChart,Bar,BarChart,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useSelector} from "react-redux";
import Form from 'react-bootstrap/Form';

// Import Axios Library
import axios from 'axios';

function DynamicStackedBarChartComp() {

  const [barData,setBarData] = useState([])

  const selected_store = useSelector((state)=>state.counter1.selected_store);
  const str_sDate = useSelector((state)=>state.counter1.str_sDate);
  const str_eDate = useSelector((state)=>state.counter1.str_eDate);

  const gettdyempSaleChart= async()=>{
    
    try {
        await axios.request({
          method:'POST',
          url:'http://localhost:3001/dyndashboard/tdyempSaleChart',
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
        console.log("BAR_CHART",res.data);
        
        // {res.data.messages[0]?res.data.messages[0][0]?setnegQqty(res.data.messages[0][0]):setnegQqty(0):setnegQqty(0)}   
        var barObj = res.data.map(([STORE_NO,STORE_CODE,CASHIER,ASSOCIATE,SOLD_QTY,EXT_PRICE,EXT_PRICE_WT,EXT_DISCOUNT,DISC_PERC,EXT_DISC_WT])=>({STORE_NO,STORE_CODE,CASHIER,ASSOCIATE,SOLD_QTY,EXT_PRICE,EXT_PRICE_WT,EXT_DISCOUNT,DISC_PERC,EXT_DISC_WT}))

        function convertIntObj(obj) {
          const res = []
          for (const key in obj) {
            res[key] = {};
            for (const prop in obj[key]) {
              const parsed = parseFloat(parseFloat(obj[key][prop],10).toFixed(2));
              res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
            }
          }
          barObj = res;
        }
  
        convertIntObj(barObj);
        
        setBarData(barObj)
        // setLineData((old)=>[...old,lineObj])
      })
      .catch(function (error) {
          console.error(error);
      });

      } catch (error) {
          console.log("axios error");
      }
}

  useEffect(() => {  
    gettdyempSaleChart()

    return () => {
    }
  },[selected_store,str_sDate,str_eDate])

  return (
    <>
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{left: 50, right: 50}} layout='vertical'>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="EXT_PRICE" type='number' label={{ value: 'Price', position: 'insideBottomRight', offset:'-10'}}/>
          <YAxis dataKey="ASSOCIATE" type='category'/>
          <Tooltip />
          <Legend />
          <Bar dataKey="EXT_PRICE" maxBarSize={30} stackId="a" fill="#615bd1" barSize='1' label={{position: 'insideBottomRight',fontSize:'12', fill:'white'}}/>
          <Bar dataKey="SOLD_QTY" maxBarSize={30}  fill="hsla(173, 78%, 55%, 0.547)" label={{position: 'right',fontSize:'12', fill:'grey'}} />
        </BarChart>
      </ResponsiveContainer>
    {/* <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{left: 50, right: 50}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ASSOCIATE"/>
          <YAxis/>
          <Tooltip />
          <Legend />
          <Bar dataKey="EXT_PRICE" stackId="a" fill="#615bd1" barSize='1'/>
          <Bar dataKey="SOLD_QTY" stackId="a" fill="hsla(173, 78%, 55%, 0.547)" />
        </BarChart>
      </ResponsiveContainer> */}
      </>
  )
}
export default DynamicStackedBarChartComp;