const connectDB = require('./connection');
const router = require('express').Router();
const oracledb = require('oracledb');

router.get("/",async(req,res)=>{
let connection;
(async function(){
    try{
        connection = await oracledb.getConnection(connectDB.cred);
        await connection.execute("select sid,sbs_sid,store_code,store_name,active from RPS.store",[],{
            fetchInfo : { 
                "SID" : { type : oracledb.STRING  } ,
                "SBS_SID" : { type : oracledb.STRING  } ,
            }
          },function(err,result){
            res.json({messages:result});
        });

    } catch(err){

        console.log("NOT connected");
    }finally{

        if(connection){
            try{
                await connection.close();
            }catch(err){
                console.log("Errror");
            }
        }
    }
})()

// END
})

// GET Currency - Module will be replaced once Subsidiary selection is enabled.
//START
router.post("/getCurrAbr",async(req,res)=>{

    // START
let connection;
(async function(){
    try{
        console.log("getCurrAbr",req.body[0].store_sid)
        connection = await oracledb.getConnection(connectDB.cred);
        await connection.execute(`SELECT curr.alphabetic_code AS Base_Currency_CODE FROM RPS.subsidiary sbs INNER JOIN RPS.store str ON sbs.sid=str.sbs_sid INNER JOIN RPS.currency curr ON sbs.base_currency_sid=curr.sid where str.sid=:id`,[req.body[0].store_sid],{
            "BASE_CURRENCY_CODE" : { type : oracledb.STRING  } ,
        },
        function(err,result){
            res.json({messages:result.rows});
        });

    } catch(err){

        console.log("NOT connected");
    }finally{

        if(connection){
            try{
                await connection.close();
            }catch(err){
                console.log("Errror");
            }
        }
    }
})()

// END
})
//END


router.post("/subsidiary",async(req,res)=>{

    // START
let connection;
(async function(){
    try{
        console.log("subsidiary api",req.body[0].sbs_sid)
        connection = await oracledb.getConnection(connectDB.cred);
        await connection.execute(`SELECT sbs.sid,sbs.sbs_no,sbs.sbs_name,str.store_name,str.store_code,sbs.base_currency_sid,curr.currency_name AS Base_Currency,curr.alphabetic_code AS Base_Currency_CODE,sbs.active_price_lvl_sid,pvl.price_lvl_name,sbs.foreign_currency_sid,(select curr.currency_name from RPS.currency curr where curr.sid=sbs.foreign_currency_sid) as Frg_Currency,(select curr.alphabetic_code from RPS.currency curr where curr.sid=sbs.foreign_currency_sid) as Frg_Currency_Code,sbs.country_sid,sbs.active,sbs.master FROM RPS.subsidiary sbs INNER JOIN RPS.store str ON sbs.sid=str.sbs_sid INNER JOIN RPS.currency curr ON sbs.base_currency_sid=curr.sid INNER JOIN RPS.price_level pvl ON sbs.active_price_lvl_sid=pvl.sid where sbs.sid=:id`,[req.body[0].sbs_sid],{
            "SID" : { type : oracledb.STRING  } ,
            "SBS_SID" : { type : oracledb.STRING  },
            "BASE_CURRENCY_SID" : { type : oracledb.STRING  },
            "ACTIVE_PRICE_LVL_SID" : {type : oracledb.STRING},
            "FOREIGN_CURRENCY_SID" : {type : oracledb.STRING}, 
            "COUNTRY_SID" : {type : oracledb.STRING}
        },
        function(err,result){
            res.json({messages:result.rows});
        });

    } catch(err){

        console.log("NOT connected");
    }finally{

        if(connection){
            try{
                await connection.close();
            }catch(err){
                console.log("Errror");
            }
        }
    }
})()

// END
})

// Store Intelligence Store information --START
    // START
router.post("/storeData",async(req,res)=>{
    console.log("WAITING")
    console.log(req.body[0].Text,"request body from StoreData API")
let connection;
(async function(){
    try{
        connection = await oracledb.getConnection(connectDB.cred);
        console.log("Axios request received in server");
        await connection.execute('SELECT a.sid,a.store_code,a.store_name,a.active,a.address1,a.address2,a.address3,a.address4,a.address5,a.zip,a.phone1,a.phone2,a.sbs_sid,b.sbs_name,a.active_price_lvl_sid,c.price_lvl_name,(select d.tax_area_name from rps.store aa JOIN rps.tax_area d ON a.tax_area_sid = d.sid where aa.sid=a.sid)As "Tax_Area_1",(select d.tax_area_name from rps.store aa JOIN rps.tax_area d ON a.tax_area2_sid = d.sid where aa.sid=a.sid)As "Tax_Area_2" FROM rps.store a INNER JOIN rps.subsidiary  b ON a.sbs_sid = b.sid INNER JOIN rps.price_level c ON a.active_price_lvl_sid = c.sid INNER JOIN rps.tax_area d ON a.tax_area_sid = d.sid WHERE a.sid=:id',[req.body[0].store_sid],{
            fetchInfo : { 
                "SID" : { type : oracledb.STRING  } ,
                "SBS_SID" : { type : oracledb.STRING  },
                "ACTIVE_PRICE_LVL_SID" : {type : oracledb.STRING}
            }
          },function(err,result){
            console.log("Start",result,"Result from server /storeData")
            res.json({messages:result.rows});
        });

    } catch(err){

        console.log("NOT connected");
    }finally{

        if(connection){
            try{
                await connection.close();
            }catch(err){
                console.log("Errror");
            }
        }
    }
})()
})
// END
// Store Intelligence Store information --END

// Store Intelligence Today transaction Total --START
    // START
    router.post("/gettdaytransttl",async(req,res)=>{
        console.log(req.body[0].Text,"gettdaytransttl")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute('select round(sum(transaction_total_amt),2) as TOTAL from rps.document where trunc(created_datetime) = trunc(sysdate) AND store_sid=:id',[req.body[0].store_sid],{
                fetchInfo : { 
                    "TOTAL" : { type : oracledb.STRING  } ,
                }
              },function(err,result){
                console.log("Start",result,"Result from server /gettdaytransttl")
                result.rows?res.json({messages:result.rows}):res.json({messages:[]})
                // res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Today Transaction Total --END


// Store Intelligence Yesterday transaction Total --START
    // START
    router.post("/getytdtransttl",async(req,res)=>{
        console.log(req.body[0].Text,"gettdaytransttl")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute('select round(sum(transaction_total_amt),2) as TOTAL from rps.document where trunc(created_datetime) = trunc(sysdate-1) AND store_sid=:id',[req.body[0].store_sid],{
                fetchInfo : { 
                    "TOTAL" : { type : oracledb.STRING  } ,
                }
              },function(err,result){
                console.log("Start",result,"Result from server /gettdaytransttl")
                result.rows?res.json({messages:result.rows}):res.json({messages:[]})
                // res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Yesterday Transaction Total --END


// Store Intelligence Today Sold Qty --START
    // START
    router.post("/qtysldtoday",async(req,res)=>{
        console.log(req.body[0],"qtysldtoday")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`SELECT sum(decode(a.item_type,2,a.qty*-1,a.qty)) FROM rps.document_item a INNER JOIN rps.document b ON a.doc_sid=b.sid INNER JOIN rps.store c ON b.store_sid=c.sid WHERE TRUNC(a.created_datetime)=TRUNC(sysdate) AND c.sid=:id GROUP BY TRUNC(a.created_datetime)`,[req.body[0].store_sid],{
                fetchInfo : { 
                  
                }
              },function(err,result){
                console.log("Start",result,"Result from server /storeData")
                res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Today Sold Qty --END


// Store Intelligence Yesterday Sold Qty --START
    // START
    router.post("/qtysldyesterday",async(req,res)=>{
        console.log(req.body[0],"qtysldyesterday")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`SELECT sum(decode(a.item_type,2,a.qty*-1,a.qty)) FROM rps.document_item a INNER JOIN rps.document b ON a.doc_sid=b.sid INNER JOIN rps.store c ON b.store_sid=c.sid WHERE TRUNC(a.created_datetime)=TRUNC(sysdate-1) AND c.sid=:id GROUP BY TRUNC(a.created_datetime)`,[req.body[0].store_sid],{
                fetchInfo : { 
                }
              },function(err,result){
                console.log("Start",result,"Result from server /storeData")
                res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Yesterday Sold Qty --END


// Store Intelligence Total OH Qty in Store --START
    // START
    router.post("/storeOHqty",async(req,res)=>{
        console.log(req.body[0].Text,"storeOHqty")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`select sum(qty) from invn_sbs_item_qty where store_sid=:id AND qty>0`,[req.body[0].store_sid],{
                fetchInfo : { 
                }
              },function(err,result){
                console.log("Start",result,"Result from server /storeData")
                res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Total OH Qty in Store --END


// Store Intelligence Today Return Qty --START
    // START
    router.post("/gettdyretqty",async(req,res)=>{
        console.log(req.body[0],"gettdyretqty")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`SELECT ROUND(SUM(((CASE WHEN a.item_type=2 THEN a.qty END))),2) AS "RETURN QTY" FROM rps.document_item a INNER JOIN rps.document b ON a.doc_sid=b.sid INNER JOIN rps.store c ON b.store_sid=c.sid WHERE TRUNC(a.created_datetime)=TRUNC(sysdate) AND c.sid=:id GROUP BY TRUNC(a.created_datetime)`,[req.body[0].store_sid],{
                fetchInfo : {
                }
              },function(err,result){
                console.log("Start",result,err,"Result from server /returnqty module")
                res.json({messages:result.rows});
            });
    
        } catch(err){
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Today Return Qty --END


// Store Transit Qty --START
    // START
    router.post("/gettransitqty",async(req,res)=>{
        console.log(req.body[0],"gettransitqty")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`SELECT sum(vi.qty) as "Transit QTY" FROM rps.voucher v INNER JOIN RPS.vou_item vi ON v.sid=vi.vou_sid AND v.vou_class=2 AND v.store_sid=:id3`,[req.body[0].store_sid],{
                fetchInfo : {
                }
              },function(err,result){
                console.log("Start",result,err,"Result from server /gettransitqty")
                res.json({messages:result.rows});
            });
    
        } catch(err){
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Transit Qty --END

// Deposit Amount --Start
    // START
    router.post("/getDepositAmt",async(req,res)=>{
        console.log(req.body[0],"getDepositAmt")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`select sum(so_deposit_amt_paid) from rps.document where order_doc_no is not null AND TRUNC(created_datetime)=TRUNC(sysdate)AND store_sid=:id`,[req.body[0].store_sid],{
                fetchInfo : { 
                }
              },function(err,result){
                console.log("Start",result,"Result from server /getDepositAmt")
                res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Deposit Amount --END


// Store Intelligence Total Negative Stock in Store --START
    // START
    router.post("/negativeStock",async(req,res)=>{
        console.log(req.body[0].Text,"negativeStock")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`select sum(qty) from invn_sbs_item_qty where store_sid=:id AND qty<0`,[req.body[0].store_sid],{
                fetchInfo : { 
                }
              },function(err,result){
                console.log("Start",result,"Result from server /storeData")
                res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Total Negative Stock in Store --END


// Store Intelligence Total Customer Record in Store --START
    // START
    router.post("/customerRecord",async(req,res)=>{
        console.log(req.body[0].Text,"customerRecord")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`select count(*) from rps.customer where TRUNC(created_datetime)=TRUNC(sysdate) AND store_sid=:id`,[req.body[0].store_sid],{
                fetchInfo : { 
                }
              },function(err,result){
                console.log("Start",result,"Result from server /customerRecord")
                res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Total Customer Record in Store --END

// Store Intelligence LineChart --START
    // START
    router.post("/tdyhrsalesChartLine",async(req,res)=>{
        console.log(req.body[0].store_sid,"tdyhrsalesChartLine")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid);
            await connection.execute(`select a.store_code,a.employee1_full_name,to_char(a.created_Datetime,'YYYY') "YEAR",to_char(a.created_Datetime,'MON') "MONTH",to_char(a.created_datetime,'HH24') HR,sum(decode(b.item_type,2,b.qty*-1,b.qty)) Sold_Qty,sum(decode(b.item_type,2,b.qty*-1,0)) Return_Qty,round(sum(decode(b.item_type,2,b.qty*-1,b.qty)*(b.price - b.tax_amt)),2) Ext_prc,round(sum(decode(b.item_type,2,b.qty*-1,b.qty)*(b.orig_price - b.tax_amt)),2) EXT_orig,round((sum(decode(b.item_type,2,b.qty*-1,b.qty)*(b.orig_price - b.tax_amt))-sum(decode(b.item_type,2,b.qty-1,b.qty)*(b.price - b.tax_amt))),2) EXT_Disc,round(sum(decode(b.item_type,2,b.qty*-1,b.qty)*(b.price)),2) EXT_Price_WT,round((sum(decode(b.item_type,2,b.qty*-1,b.qty)*(b.orig_price))-sum(decode(b.item_type,2,b.qty-1,b.qty)*(b.price))),2) EXT_disc_WT from rps.document a,rps.document_item b,rps.subsidiary s,rps.dcs d,rps.invn_sbs_item i where a.sid=b.doc_sid and a.sbs_no=s.sbs_no and s.sid=d.sbs_sid and b.sbs_no=s.sbs_no and b.dcs_code=d.dcs_code and b.invn_sbs_item_sid=i.sid and s.sid=i.sbs_sid and a.receipt_type in (0,1) and b.item_type in (1,2) and a.status=4 and a.store_sid=:id and trunc(a.created_datetime)=trunc(sysdate) group by a.store_code,a.employee1_full_name,trunc(a.created_Datetime),to_char(a.created_datetime,'HH24'),to_char(a.created_Datetime,'YYYY'),to_char(a.created_Datetime,'MON') order by trunc(a.created_Datetime) asc,to_char(a.created_datetime,'HH24') asc`,[req.body[0].store_sid],{
                fetchInfo : { 
                    "EXT_PRICE_WT" : {type:oracledb.STRING}
                }
              },function(err,result){
                console.log("Start",result,"Result from server /hourlySalesChart")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence Line Chart --END



// Store Intelligence StackedBarChart --START
    // START
    router.post("/tdyempSaleChart",async(req,res)=>{
        console.log(req.body[0].store_sid,"/tdyempSaleChart")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid);
            await connection.execute(`SELECT a.store_no,a.store_code,a.CASHIER_FULL_NAME CASHIER,b.employee1_full_name Associate,SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)) Sold#,ROUND(SUM(DECODE(b.item_type,2,b.qty *-1,b.qty)*(b.price)),2) EXTP$,ROUND(SUM(DECODE(b.item_type,2,b.qty *-1,b.qty)*(b.price+b.tax_amt)),2) EXTP$T$,ROUND((SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.orig_price))-SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.price))),2) EXTD$,ROUND((SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.orig_price+b.orig_tax_amt))-SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.price+b.tax_amt)))/SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.orig_price+b.orig_tax_amt))*100,2) DISC_PERC,ROUND((SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.orig_price+b.orig_tax_amt))-SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.price+b.tax_amt))),2) EXTD$T$ FROM rps.document a,rps.document_item b,rps.subsidiary s,rps.dcs d,rps.invn_sbs_item i WHERE a.sid=b.doc_sid AND a.sbs_no=s.sbs_no AND s.sid=d.sbs_sid AND b.sbs_no=s.sbs_no AND b.dcs_code =d.dcs_code AND b.invn_sbs_item_sid=i.sid AND s.sid=i.sbs_sid AND a.receipt_type IN (0,1) AND b.item_type IN (1,2) AND a.status=4 AND a.store_sid=:id AND TRUNC(a.created_datetime)=TRUNC(sysdate) GROUP BY a.store_no,a.store_code,a.CASHIER_FULL_NAME,b.employee1_full_name`,[req.body[0].store_sid],{
                fetchInfo : { 
                    
                }
              },function(err,result){
                console.log("Start",result,"Result from server //tdyempSaleChart")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence StackedBarChart --END



// Store Intelligence BrushChart --START
    // START
    router.post("/tdytransBrushChart",async(req,res)=>{
        console.log(req.body[0].store_sid,"/tdytransBrushChart")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid);
            await connection.execute(`SELECT a.doc_no AS "RCPT NO",TRUNC(a.created_datetime)AS "RCPT DATE",TO_CHAR(a.created_datetime,'hh:mi:ss am') AS "RCPT TIME",SUM(((CASE WHEN b.item_type=2 THEN b.qty*- 1 ELSE b.qty END)))AS "SOLD QTY",SUM(((CASE WHEN b.item_type=2 THEN b.qty*-1 END)))AS "RETURN QTY",SUM(round((((CASE WHEN b.item_type=2 THEN b.qty*- 1 ELSE b.qty END)*(b.orig_price-b.tax_amt))-((CASE WHEN b.item_type=2 THEN b.qty*- 1 ELSE b.qty END)*(b.price-b.tax_amt))),2))disc,SUM(ROUND(((CASE WHEN b.item_type=2 THEN b.qty*-1 ELSE b.qty END)*(b.price)),2)) AS "EXT PRICE W TAX" FROM rps.document a INNER JOIN rps.document_item b ON a.sid=b.doc_sid INNER JOIN rps.subsidiary s ON a.sbs_no=s.sbs_no AND b.sbs_no=s.sbs_no INNER JOIN rps.store st ON st.sid=a.store_sid INNER JOIN rps.invn_sbs_item i ON i.sid=b.invn_sbs_item_sid WHERE a.receipt_type IN (0, 1) AND b.item_type IN (1,2) AND a.status=4 AND a.store_sid=:id AND trunc(a.created_datetime)=trunc(sysdate) GROUP BY s.sbs_name,a.store_code,a.doc_no,TRUNC(a.created_datetime),TO_CHAR(a.created_datetime,'hh:mi:ss am') ORDER BY a.doc_no ASC`,[req.body[0].store_sid],{
                fetchInfo : { 
                    "EXT PRICE W TAX" : {type:oracledb.STRING}
                }
              },function(err,result){
                console.log("Start",result,"Result from server /tdytransBrushChart")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence BrushChart --END


// Store Intelligence BrushChart --START
    // START
    router.post("/ytdtransBrushChart",async(req,res)=>{
        console.log(req.body[0].store_sid,"/ytdtransBrushChart")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid);
            await connection.execute(`SELECT a.doc_no AS "RCPT NO",TRUNC(a.created_datetime)AS "RCPT DATE",TO_CHAR(a.created_datetime,'hh:mi:ss am') AS "RCPT TIME",SUM(((CASE WHEN b.item_type=2 THEN b.qty*- 1 ELSE b.qty END)))AS "SOLD QTY",SUM(((CASE WHEN b.item_type=2 THEN b.qty*-1 END)))AS "RETURN QTY",SUM(round((((CASE WHEN b.item_type=2 THEN b.qty*- 1 ELSE b.qty END)*(b.orig_price-b.tax_amt))-((CASE WHEN b.item_type=2 THEN b.qty*- 1 ELSE b.qty END)*(b.price-b.tax_amt))),2))disc,SUM(ROUND(((CASE WHEN b.item_type=2 THEN b.qty*-1 ELSE b.qty END)*(b.price)),2)) AS "EXT PRICE W TAX" FROM rps.document a INNER JOIN rps.document_item b ON a.sid=b.doc_sid INNER JOIN rps.subsidiary s ON a.sbs_no=s.sbs_no AND b.sbs_no=s.sbs_no INNER JOIN rps.store st ON st.sid=a.store_sid INNER JOIN rps.invn_sbs_item i ON i.sid=b.invn_sbs_item_sid WHERE a.receipt_type IN (0, 1) AND b.item_type IN (1,2) AND a.status=4 AND a.store_sid=:id AND trunc(a.created_datetime)=trunc(sysdate-1) GROUP BY s.sbs_name,a.store_code,a.doc_no,TRUNC(a.created_datetime),TO_CHAR(a.created_datetime,'hh:mi:ss am') ORDER BY a.doc_no ASC`,[req.body[0].store_sid],{
                fetchInfo : { 
                    "EXT PRICE W TAX" : {type:oracledb.STRING}
                }
              },function(err,result){
                console.log("Start",result,"Result from server /ytdtransBrushChart")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Intelligence BrushChart --END



// Store Employees Stat Table --START
    // START
    router.post("/tdyEmpStatTable",async(req,res)=>{
        console.log(req.body[0].store_sid,"/tdyEmpStatTable")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid);
            await connection.execute(`SELECT b.employee1_sid as EMP_SID,b.employee1_full_name AS EMPLOYEE,COUNT(DISTINCT(a.sid))AS DOC_COUNT,SUM(DECODE(b.item_type,2,b.qty*-1,b.qty))AS Doc_Qty,ROUND(SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.price)),2)AS Sale_Total,ROUND((ROUND(SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.price)),2)/COUNT(DISTINCT(a.sid))),2) AS AVG_BKT,ROUND(SUM(DECODE(b.item_type,2,b.qty*-1,b.qty))/COUNT(DISTINCT(a.sid)),2) AS UPT,ROUND(SUM(ROUND((((CASE WHEN B.ITEM_TYPE=2 THEN B.QTY*-1 ELSE B.QTY END)*(B.ORIG_PRICE))-((CASE WHEN B.ITEM_TYPE=2 THEN B.QTY*-1 ELSE B.QTY END)*(B.PRICE))),2)),2) AS "DISC AMT", ROUND(SUM(DECODE(b.item_type,2,b.qty*-1,b.qty)*(b.TAX_AMT)),2) AS Tax_Total FROM rps.document a join rps.document_item b on b.doc_sid = a.sid LEFT join rps.document_disc c on c.doc_sid = a.sid WHERE TRUNC(a.created_datetime)=TRUNC(sysdate) and a.receipt_type in (0,1)and b.item_type in (1,2) and a.status =4 AND a.store_sid=:id GROUP BY b.employee1_full_name,b.employee1_sid`,[req.body[0].store_sid],{
                fetchInfo : { 
                    "EMP_SID" : {type:oracledb.STRING},
                    "SALE_TOTAL" : {type:oracledb.STRING},
                    "AVG_BKT" : {type:oracledb.STRING},
                    "DISC AMT": {type:oracledb.STRING}
                }
              },function(err,result){
                console.log("Start",result,"Result from server /tdyEmpStatTable")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Employees Stat Table --START


// Store Tender Stat Table --START
    // START
    router.post("/tdyTenderStatTable",async(req,res)=>{
        console.log(req.body[0].store_sid,"/tdyTenderStatTable")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid);
            await connection.execute(`SELECT DECODE(A.TENDER_TYPE,6,'Split',DECODE(A.TENDER_NAME,NULL,'Credit Card',A.TENDER_NAME)) AS TENDER,ROUND(SUM(ROUND(((CASE WHEN B.ITEM_TYPE=2 THEN B.QTY*-1 ELSE B.QTY END)*(B.PRICE)), 2)),2) AS "EXT PRICE W TAX" FROM RPS.DOCUMENT A INNER JOIN RPS.DOCUMENT_ITEM B ON B.DOC_SID = A.SID WHERE A.RECEIPT_TYPE IN(0, 1) AND B.ITEM_TYPE IN(1, 2) AND A.STATUS=4 AND TRUNC(A.CREATED_DATETIME)BETWEEN trunc(sysdate) AND trunc(sysdate) AND a.store_sid=:id GROUP BY A.STORE_NAME,DECODE(A.TENDER_TYPE,6,'Split',DECODE(A.TENDER_NAME, NULL,'Credit Card',A.TENDER_NAME))`,[req.body[0].store_sid],{
                fetchInfo : { 
                    "EMP_SID" : {type:oracledb.STRING},
                    "EXT PRICE W TAX": {type:oracledb.DEFAULT}
                }
              },function(err,result){
                console.log("Start",result,"Result from server /tdyTenderStatTable")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Tender Stat Table --START


// Store Discount --START
    // START
    router.post("/discountPieChart",async(req,res)=>{
        console.log(req.body[0].store_sid,"/discountPieChart")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid);
            await connection.execute(`select DECODE(di.discount_reason,NULL,'Not Specified',di.discount_reason) AS "Reason",ROUND(SUM(di.disc_amt),1) as "Discount_Amt" from rps.document do inner join rps.document_item di on do.sid=di.doc_sid inner join rps.subsidiary s on do.sbs_no=s.sbs_no and di.sbs_no=s.sbs_no inner join rps.dcs d on s.sid=d.sbs_sid and di.dcs_code = d.dcs_code inner join rps.store st on do.store_sid=st.sid inner join rps.invn_sbs_item i on di.invn_sbs_item_sid = i.sid and s.sid = i.sbs_sid inner join rps.vendor v on i.vend_sid=v.sid where do.receipt_type in ( 0, 1 ) and di.item_type in (1,2) and do.status=4 and di.disc_amt <> 0 and trunc(do.created_datetime)=trunc(sysdate) and do.store_sid=:id group by do.sbs_no,st.store_code,di.discount_reason,do.store_code order by do.sbs_no,do.store_code`,[req.body[0].store_sid],{
                fetchInfo : { 
                    "DISCOUNT_AMT" : {type:oracledb.STRING},
                }
              },function(err,result){
                console.log("Start",result,"Result from server /discountPieChart")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Discount --START


// Today Store Discount --START
    // START
    router.post("/gettdydisctotal",async(req,res)=>{
        console.log(req.body[0].store_sid,"/gettdydisctotal")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid,"TODAYSDISOCUNTTOTAL");
            await connection.execute(`SELECT SUM(ROUND((((CASE WHEN B.ITEM_TYPE=2 THEN B.QTY*-1 ELSE B.QTY END)*(B.ORIG_PRICE ))-((CASE WHEN B.ITEM_TYPE=2 THEN B.QTY*-1 ELSE B.QTY END)*(B.PRICE))),2))AS "DISC AMT" FROM RPS.DOCUMENT A JOIN RPS.DOCUMENT_ITEM B ON A.SID=B.DOC_SID WHERE A.RECEIPT_TYPE IN(0,1) AND B.ITEM_TYPE IN(1,2) AND A.STATUS=4 AND A.STORE_SID=:id AND TRUNC(A.CREATED_DATETIME)=TRUNC(sysdate)`,[req.body[0].store_sid],{
                fetchInfo : { 
                    "DISC AMT" : {type:oracledb.STRING},
                }
              },function(err,result){
                console.log("Start",result,"Result from server /gettdydisctotal")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Discount --START

// Today Receipt Count --START
    // START
    router.post("/getRcptCount",async(req,res)=>{
        console.log(req.body[0].store_sid,"/getRcptCount")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid,"TODAY'S Recipt Count");
            await connection.execute(`SELECT count(sid) FROM rps.document a WHERE a.receipt_type IN (0,1) AND a.status IN (4) AND TRUNC(a.created_datetime)=TRUNC(sysdate) AND a.store_sid = :id1`,[req.body[0].store_sid],{
                fetchInfo : { 
                }
              },function(err,result){
                console.log("Start",result,"Result from server /gettdyrcptcount")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Today Receipt Count --END

// Yesterday Receipt Count --START
    // START
    router.post("/getytdRcptCount",async(req,res)=>{
        console.log(req.body[0].store_sid,"/getytdRcptCount")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request received with request body:",req.body[0].store_sid,"YESTERDAY'S Recipt Count");
            await connection.execute(`SELECT count(sid) FROM rps.document a WHERE a.receipt_type IN (0,1) AND a.status IN (4) AND TRUNC(a.created_datetime)=TRUNC(sysdate)-1 AND a.store_sid = :id1`,[req.body[0].store_sid],{
                fetchInfo : { 
                }
              },function(err,result){
                console.log("Start",result,"Result from server /getytdRcptCount")
                result?res.json(result.rows):res.json({messages:[]})
            });
    
        } catch(err){
            console.log(err);
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Yesterday Receipt Count --END


// Store Today tax total --Start
    // START
    router.post("/gettaxtotal",async(req,res)=>{
        console.log(req.body[0].Text,"gettaxtotal")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`SELECT sum(a.transaction_total_tax_amt) as TAX_TOTAL FROM rps.document a WHERE a.DOC_NO IS NOT NULL AND a.receipt_type in(0,1) and a.status=4 and TRUNC(a.created_datetime)=TRUNC(sysdate) and a.store_sid=:id1`,[req.body[0].store_sid],{
                fetchInfo : { 
                    "TAX_TOTAL" : { type : oracledb.STRING  } ,
                }
              },function(err,result){
                console.log("Start",result,"Result from server /gettaxtotal")
                result.rows?res.json({messages:result.rows}):res.json({messages:[]})
                // res.json({messages:result.rows});
            });
    
        } catch(err){
    
            console.log("NOT connected");
        }finally{
    
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.log("Errror");
                }
            }
        }
    })()
    })
    // END
// Store Today tax total --END


module.exports = router;
