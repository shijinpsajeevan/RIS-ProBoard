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
            await connection.execute('select sum(transaction_total_amt) from rps.document where trunc(created_datetime) = trunc(sysdate) AND store_sid=:id',[req.body[0].store_sid],{
                fetchInfo : { 
                  
                }
              },function(err,result){
                console.log("Start",result,"Result from server /storeData")
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


// Store Intelligence Today Sold Qty --START
    // START
    router.post("/qtysldtoday",async(req,res)=>{
        console.log(req.body[0].Text,"qtysldtoday")
    let connection;
    (async function(){
        try{
            connection = await oracledb.getConnection(connectDB.cred);
            console.log("Axios request");
            await connection.execute(`SELECT SUM(a.qty) FROM rps.document_item a INNER JOIN rps.document b ON a.doc_sid=b.sid INNER JOIN rps.store c ON b.store_sid=c.sid WHERE TRUNC(a.created_datetime) = TRUNC(sysdate) AND c.sid=:id GROUP BY TRUNC(a.created_datetime)`,[req.body[0].store_sid],{
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

module.exports = router;
