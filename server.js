const express = require("express");
const router = require('express').Router();
const path = require('path');
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.json());


app.use("/dashboard",require("./routes/dashboard"))

const PORT = process.env.PORT||3001;

app.listen(PORT,()=>console.log(`Server Running on ${PORT}`));