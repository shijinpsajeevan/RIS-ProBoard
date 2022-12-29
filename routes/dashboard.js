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

router.get("/subsidiary",async(req,res)=>{

    // START
let connection;
(async function(){
    try{
        connection = await oracledb.getConnection(connectDB.cred);
        connection.execute("select sid,sbs_no,sbs_name,active from RPS.subsidiary",[],function(err,result){
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

// Store Intelligence Store information --START
    // START
router.post("/storeData",async(req,res)=>{
    console.log(req.body[0].Text)
let connection;
(async function(){
    try{
        connection = await oracledb.getConnection(connectDB.cred);
        console.log("Axios request");
        await connection.execute('SELECT a.sid,a.store_code,a.store_name,a.active,a.address1,a.address2,a.address3,a.address4,a.address5,a.zip,a.phone1,a.phone2,a.sbs_sid,b.sbs_name,a.active_price_lvl_sid,c.price_lvl_name,(select d.tax_area_name from rps.store aa JOIN rps.tax_area d ON a.tax_area_sid = d.sid where aa.sid=a.sid)As "Tax_Area_1",(select d.tax_area_name from rps.store aa JOIN rps.tax_area d ON a.tax_area2_sid = d.sid where aa.sid=a.sid)As "Tax_Area_2" FROM rps.store a INNER JOIN rps.subsidiary  b ON a.sbs_sid = b.sid INNER JOIN rps.price_level c ON a.active_price_lvl_sid = c.sid INNER JOIN rps.tax_area    d ON a.tax_area_sid = d.sid WHERE a.sid=:id',[req.body[0].store_sid],{
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

// Store Intelligence Today Sold Qty --START
    // START
    router.post("/qtysldtoday",async(req,res)=>{
        console.log(req.body[0].Text,"qtysldtoday")
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

module.exports = router;
