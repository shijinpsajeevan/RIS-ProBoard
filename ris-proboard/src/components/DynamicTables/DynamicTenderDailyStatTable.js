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

function DynamicTenderDailyStatTable() {

  const [tenderstatData, setTenderstatData] = useState([]);
  console.log(tenderstatData);
  const selected_store = useSelector((state)=>state.counter1.selected_store);
  const str_sDate = useSelector((state)=>state.counter1.str_sDate);
  const str_eDate = useSelector((state)=>state.counter1.str_eDate);

  const gettenderStatTable = async () => {
    try {
      await axios
        .request({
          method: "POST",
          url: "http://localhost:3001/dyndashboard/tdyTenderStatTable",
          headers: {
            "content-type": "application/json",
          },
          data: [
            {
              store_sid: selected_store,
              date1Par:str_sDate,
              date2Par:str_eDate
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
                var re = new RegExp('^-?\\d{1,9}(\\.\\d{1,30})?$');
            res[key][prop] = re.test(obj[key][prop]) ? parsed : obj[key][prop];
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
  },[selected_store,,str_sDate,str_eDate])


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
            Total Amount <Box color="warning.main">{Math.round(totalAmount*100)/100 }</Box>
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
export default DynamicTenderDailyStatTable;