import React,{useEffect,useState} from 'react'
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {useSelector, useDispatch} from "react-redux";


// Import Axios Library
import axios from 'axios';
import { Toolbar } from '@mui/material';


const COLORS=['#ff8142be','#ffbb28b8','#00c4a0c6','#0087fec9',];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function DynamicOuterPieChartComp() {
  
const [pieData,setPieData] = useState([])
const selected_store = useSelector((state)=>state.counter1.selected_store);
const str_sDate = useSelector((state)=>state.counter1.str_sDate);
const str_eDate = useSelector((state)=>state.counter1.str_eDate);

const gettdyhrsalesChartLine= async()=>{

  try {
      await axios.request({
        method:'POST',
        url:'http://localhost:3001/dyndashboard/tdyTenderStatTable',
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
      console.log("PIE_CHART",res.data);

      var lineObj = res.data.map(([name,value]) => ({name,value}));

      function convertIntObj(obj) {
        const res = []
        for (const key in obj) {
          res[key] = {};
          for (const prop in obj[key]) {
            const parsed = parseFloat(parseFloat(obj[key][prop],10).toFixed(2));
            var re = new RegExp('^-?\\d{1,9}(\\.\\d{1,30})?$');
            res[key][prop] = re.test(obj[key][prop]) ? parsed : obj[key][prop];
          }
        }
        lineObj = res;
      }

      convertIntObj(lineObj);

      setPieData(lineObj)

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
  gettdyhrsalesChartLine()

  return () => {
  }
},[selected_store,str_sDate,str_eDate])

  return (
    <ResponsiveContainer width="100%" height="100%">
    <PieChart width={400} height={400}>
    <Tooltip/>
    <Legend/>
    <Pie
          data={pieData}
          innerRadius={60}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={{angle: 0,fontSize:'15',fill:'white'}} >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        </PieChart>
  </ResponsiveContainer>
  )
}

export default DynamicOuterPieChartComp;