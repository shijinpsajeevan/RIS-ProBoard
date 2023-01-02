import React from 'react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const minHour=0;
const maxHour=24;

var data = [
    { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 },
  ];

function PieChartComp() {

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
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
          </PieChart>
        </ResponsiveContainer>
  )
}

export default PieChartComp;