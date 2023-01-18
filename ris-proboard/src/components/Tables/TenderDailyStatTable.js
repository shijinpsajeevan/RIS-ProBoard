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
          url: "http://localhost:3001/dashboard/tdyTenderStatTable",
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

          function convertIntObj(obj) {
            const res = []
            for (const key in obj) {
              res[key] = {};
              for (const prop in obj[key]) {
                const parsed = parseFloat(parseFloat(obj[key][prop],10).toFixed(2));
                res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
              }
            }
            tenderstatObj = res;
          }

          convertIntObj(tenderstatObj);
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
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'AMOUNT', //access nested data with dot notation
        header: 'AMOUNT',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        enableGrouping: false, //do not let this column be grouped
        AggregatedCell: ({ cell }) => <div>Team Score: {cell.getValue()}</div>,
        Footer: () => (
          <Stack alignItems={'center'}>
            Total Amount <Box color="warning.main">{Math.round(totalAmount*100,2)/100 }</Box>
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
    }} enablePagination={false} />
  )
}
export default TenderDailyStatTable;