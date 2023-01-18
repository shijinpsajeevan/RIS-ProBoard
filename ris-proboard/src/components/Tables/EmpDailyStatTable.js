import React,{useMemo,useState,useEffect} from 'react'
import { ComposedChart,Bar,BarChart,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useSelector, useDispatch} from "react-redux";
import Form from 'react-bootstrap/Form';
import MaterialReactTable from 'material-react-table';
import { Box, Button,Stack } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { CSVLink, CSVDownload } from "react-csv";


// Import Axios Library
import axios from 'axios';

function EmpDailyStatTable() {

  const [empstatData, setempstatData] = useState([]);
  console.log(empstatData,"EMPEMPEMPEMP");
  const selected_store = useSelector((state)=>state.counter1.selected_store);

  const gettdyEmpStatTable = async () => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dashboard/tdyEmpStatTable",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: selected_store,
            },
          ],
        })
        .then(function (res) {
          var empstatTableObj = res.data.map(([EMPLOYEE1_SID,EMPLOYEE,DOCUMENT_COUNT,DOCUMENT_QTY,SALE_TOTAL,ATV,UPT,DISC_AMOUNT,TOTAL_TAX]) => ({EMPLOYEE1_SID,EMPLOYEE,DOCUMENT_COUNT,DOCUMENT_QTY,SALE_TOTAL,ATV,UPT,DISC_AMOUNT,TOTAL_TAX}));

          function convertIntObj(obj) {
            const res = []
            for (const key in obj) {
              res[key] = {};
              for (const prop in obj[key]) {
                const parsed = parseFloat(parseFloat(obj[key][prop],10).toFixed(2));
                res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
              }
            }
            empstatTableObj = res;
          }
    
          convertIntObj(empstatTableObj);

          setempstatData(empstatTableObj);

        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };

  useEffect(() => {  
    gettdyEmpStatTable()

    return () => {
    }
  },[selected_store])


  const totalSalary = useMemo(
    () =>(empstatData.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.SALE_TOTAL), 0)),
  );

  const totalDocQty = useMemo(
    () =>(empstatData.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.DOCUMENT_QTY), 0)),
  );

  const avgofATV = useMemo(
    () =>((empstatData.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.ATV), 0))/empstatData.length),
  );

  const avgofUPT = useMemo(
    () =>((empstatData.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.UPT), 0))/empstatData.length),
  );

  const totalDiscount = useMemo(
    () =>(empstatData.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.DISC_AMOUNT), 0)),
  );

  const totaltax = useMemo(
    () =>(empstatData.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.TOTAL_TAX), 0)),
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'EMPLOYEE', //access nested data with dot notation
        header: 'ASSOCIATE NAME',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        }
      },
      {
        accessorKey: 'DOCUMENT_COUNT', //access nested data with dot notation
        header: 'DOCUMENT COUNT',
        enableGrouping: false, //do not let this column be grouped
      },
      {
        accessorKey: 'DOCUMENT_QTY', //access nested data with dot notation
        header: 'DOCUMENT QUANTITY',
        enableGrouping: false, //do not let this column be grouped
        aggregationFn: 'sum', //calc total points for each team by adding up all the points for each player on the team
        AggregatedCell: ({ cell }) => <div>Team Score: {cell.getValue()}</div>,
        Footer: () => (
          <Stack>
            Total Doc Qty
            <Box color="warning.main">{Math.round(totalDocQty*100)/100 }</Box>
          </Stack>
        )
      },
      {
        accessorKey: 'ATV', //access nested data with dot notation
        header: 'ATV',
        enableGrouping: false, //do not let this column be grouped
        aggregationFn: 'avg', //calc total points for each team by adding up all the points for each player on the team
        AggregatedCell: ({ cell }) => <div>Team Score: {cell.getValue()}</div>,
        Footer: () => (
          <Stack>
            Average ATV
            <Box color="warning.main">{Math.round(avgofATV*100)/100?Math.round(avgofATV*100)/100:0}</Box>
          </Stack>
        )
      },
      {
        accessorKey: 'UPT', //access nested data with dot notation
        header: 'UPT',
        enableGrouping: false, //do not let this column be grouped
        aggregationFn: 'avg', //calc total points for each team by adding up all the points for each player on the team
        AggregatedCell: ({ cell }) => <div>Team Score: {cell.getValue()}</div>,
        Footer: () => (
          <Stack>
            Average UPT
            <Box color="warning.main">{Math.round(avgofUPT*100)/100?Math.round(avgofUPT*100)/100:0}</Box>
          </Stack>
        )
      },
      {
        accessorKey: 'DISC_AMOUNT', //access nested data with dot notation
        header: 'DISCOUNT GRANTED ',
        enableGrouping: false, //do not let this column be grouped
        aggregationFn: 'sum', //calc total points for each team by adding up all the points for each player on the team
        AggregatedCell: ({ cell }) => <div>Team Score: {cell.getValue()}</div>,
        Footer: () => (
          <Stack>
            Total Discount
            <Box color="warning.main">{Math.round(totalDiscount*100)/100 }</Box>
          </Stack>
        )
      },
      {
        accessorKey: 'TOTAL_TAX', //access nested data with dot notation
        header: 'TAX ',
        enableGrouping: false, //do not let this column be grouped
        aggregationFn: 'sum', //calc total points for each team by adding up all the points for each player on the team
        AggregatedCell: ({ cell }) => <div>Team Score: {cell.getValue()}</div>,
        Footer: () => (
          <Stack>
            Total Discount
            <Box color="warning.main">{Math.round(totaltax*100)/100 }</Box>
          </Stack>
        )
      },
      {
        accessorKey: 'SALE_TOTAL', //access nested data with dot notation
        header: 'TOTAL SALES',
        enableGrouping: false, //do not let this column be grouped
        aggregationFn: 'sum', //calc total points for each team by adding up all the points for each player on the team
        AggregatedCell: ({ cell }) => <div>Team Score: {cell.getValue()}</div>,
        Footer: () => (
          <Stack>
            Total Sale
            <Box color="warning.main">{Math.round(totalSalary*100)/100 }</Box>
          </Stack>
        )
      }
    ],
    [totalSalary],
  );

  return (
    <MaterialReactTable columns={columns} data={empstatData} renderTopToolbarCustomActions={({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
        <CSVLink data={table.getRowModel().rows.map((row) => row.original)}><FileDownloadIcon /></CSVLink>
      </Box>
    )} initialState={{
      density: 'compact'
    }} enablePagination={false}/>
  )
}
export default EmpDailyStatTable;