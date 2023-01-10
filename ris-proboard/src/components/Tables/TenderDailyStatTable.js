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

function TenderDailyStatTable() {

  const [tenderstatData, setTenderstatData] = useState([]);
  console.log(tenderstatData);
  const selected_store = useSelector((state)=>state.counter1.selected_store);

  const gettenderStatTable = async () => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://192.168.50.136:3001/dashboard/tdyTenderStatTable",
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
          var tenderstatObj = res.data.map(([TENDER,AMOUNT]) => ({TENDER,AMOUNT}));

          console.log("Table Column", tenderstatObj);

          setTenderstatData(tenderstatObj);

        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log("axios error");
    }
  };

  useEffect(() => {  
    gettenderStatTable()

    return () => {
    }
  },[selected_store])


  const totalAmount = useMemo(
    () =>(tenderstatData.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.AMOUNT), 0)),
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'TENDER', //access nested data with dot notation
        header: 'TENDER TYPE',
      },
      {
        accessorKey: 'AMOUNT', //access nested data with dot notation
        header: 'AMOUNT',
        enableGrouping: false, //do not let this column be grouped
        AggregatedCell: ({ cell }) => <div>Team Score: {cell.getValue()}</div>,
        Footer: () => (
          <Stack>
            Total Amount :
            <Box color="warning.main">{Math.round(totalAmount*100)/100 }</Box>
          </Stack>
        )
      }
    ],
    [totalAmount],
  );

  return (
    <MaterialReactTable columns={columns} data={tenderstatData} renderTopToolbarCustomActions={({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
        <CSVLink data={table.getRowModel().rows.map((row) => row.original)}><FileDownloadIcon /></CSVLink>
      </Box>
    )} initialState={{
      density: 'compact'
    }}/>
  )
}
export default TenderDailyStatTable;