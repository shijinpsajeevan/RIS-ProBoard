const router = require('express').Router();
const oracledb = require('oracledb');

router.get("/",async(req,res)=>{

    // START
let connection;
(async function(){
    try{
        connection = await oracledb.getConnection({
            user: 'reportuser',
            password: 'report',
            connectString: 'localhost:1521/rproods'
        });
        console.log("Successfully connected");
        connection.execute("select sid,sbs_sid,store_code,store_name,active from RPS.store",[],function(err,result){
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
        connection = await oracledb.getConnection({
            user: 'reportuser',
            password: 'report',
            connectString: 'localhost:1521/rproods'
        });
        console.log("Successfully connected");
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

module.exports = router;
