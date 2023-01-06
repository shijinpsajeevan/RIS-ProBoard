import React,{useMemo,useState,useEffect} from 'react'
import { ComposedChart,Bar,BarChart,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useSelector, useDispatch} from "react-redux";
import Form from 'react-bootstrap/Form';
import MaterialReactTable from 'material-react-table';

// Import Axios Library
import axios from 'axios';

function EmpDailyStatTable() {

  const [empstatData, setempstatData] = useState([]);
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
          var empstatTableObj = res.data.map(([EMPLOYEE1_SID,EMPLOYEE,DOCUMENT_COUNT,DOCUMENT_QTY,SALE_TOTAL,AVG_BASKET,ITEM_PER_CUSTOMER,DISC_AMOUNT]) => ({EMPLOYEE1_SID,EMPLOYEE,DOCUMENT_COUNT,DOCUMENT_QTY,SALE_TOTAL,AVG_BASKET,ITEM_PER_CUSTOMER,DISC_AMOUNT}));

          console.log("Table Column", empstatTableObj);

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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'EMPLOYEE', //access nested data with dot notation
        header: 'ASSOCIATE NAME',
      },
      {
        accessorKey: 'DOCUMENT_COUNT', //access nested data with dot notation
        header: 'DOCUMENT COUNT',
      },
      {
        accessorKey: 'DOCUMENT_QTY', //access nested data with dot notation
        header: 'DOCUMENT QUANTITY',
      },
      {
        accessorKey: 'SALE_TOTAL', //access nested data with dot notation
        header: 'TOTAL SALES',
      },
      {
        accessorKey: 'AVG_BASKET', //access nested data with dot notation
        header: 'AVGERAGE BASKET',
      },
      {
        accessorKey: 'ITEM_PER_CUSTOMER', //access nested data with dot notation
        header: 'ITEM PER CUSTOMER',
      },
      {
        accessorKey: 'DISC_AMOUNT', //access nested data with dot notation
        header: 'DISCOUNT GRANTED ',
      },
    ],
    [],
  );

  return (
    <MaterialReactTable columns={columns} data={empstatData} />
  )
}
export default EmpDailyStatTable;