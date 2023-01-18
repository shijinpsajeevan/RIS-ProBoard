import React,{useEffect,useState} from 'react'
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {useSelector, useDispatch} from "react-redux";


// Import Axios Library
import axios from 'axios';
import { Toolbar } from '@mui/material';


const COLORS=['#0087fec9','#00c4a0c6','#ffbb28b8','#ff8142be'];

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

function PieChartComp() {
  
const [pieData,setPieData] = useState([])
const selected_store = useSelector((state)=>state.counter1.selected_store);

const gettdyDiscPieChart= async()=>{

  try {
      await axios.request({
        method:'POST',
        url:'http://localhost:3001/dashboard/discountPieChart',
        headers:{
            'content-type':'application/json',
        },
        data:[{
            store_sid : selected_store,
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
            res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
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
  gettdyDiscPieChart()

  return () => {
  }
},[selected_store])

  return (
    <ResponsiveContainer width="100%" height="100%">
    <PieChart width={400} height={400}>
    <Tooltip/>
    <Legend/>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
  </ResponsiveContainer>
  )
}

export default PieChartComp;