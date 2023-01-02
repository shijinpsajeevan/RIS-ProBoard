import React from 'react'
import { ComposedChart,Bar,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';

const minHour=0;
const maxHour=24;

var data = [
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
  ];

function LineChartComp() {

  var daysOfTheWeek = [0,1,2,3,4,5,6];
  var existingDays = [];

  for(var i=0;i<data.length;i++){
    existingDays[i] = data[i]['HOUR'];
}

// check which day's data is missing; then create a dummy object and push it to the dummyData object

for(var i=0;i<daysOfTheWeek.length;i++){
  if(existingDays.indexOf(parseInt(daysOfTheWeek[i])) < 0){
      var dummyObject = {
       "HOUR": i,
       "QTY": 0,
       "PRICE":0
      };
      data.push(dummyObject);
  }
}

//sort day wise ascending

data.sort(function(x,y){ return parseInt(x.HOUR) - parseInt(y.HOUR) });

  return (
    <>
      <ResponsiveContainer>
      <ComposedChart width="100%" height={250} data={data}>
      <XAxis dataKey="HOUR" />
      <YAxis />
      <Tooltip />
      <Legend />
      <CartesianGrid stroke="#f5f5f5" />
      <Bar dataKey="PRICE" barSize={20} fill="#413ea0cf" />
      <Line type="monotone" dataKey="QTY" stroke="#ff7300" />
    </ComposedChart>
    </ResponsiveContainer>
    </>
  )
}

export default LineChartComp;