import React from 'react'
import { ComposedChart,Bar,BarChart,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Form from 'react-bootstrap/Form';

const minHour=0;
const maxHour=24;

const data = [
  {
    name: 'Employee1',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Employee2',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Employee3',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Employee4',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Employee5',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Employee6',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Employee7',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function StackedBarChartComp() {

  return (
    <>
    <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{left: 50, right: 50}} stackOffset="expand">
          <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis  dataKey="name"/> */}
          <YAxis dataKey="name"/>
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" stackId="a" fill="#615bd1" />
          <Bar dataKey="uv" stackId="a" fill="hsla(173, 78%, 55%, 0.547)" />
        </BarChart>
      </ResponsiveContainer>
      </>
  )
}
export default StackedBarChartComp;