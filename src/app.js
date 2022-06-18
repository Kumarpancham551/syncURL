const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;


const app = express();

app.use(bodyParser.json());
app.use(cors());


// app.use("/",(req,res,next)=>{
//     res.status(200).json({success:true, data:"start here"})
// })
let userRouter = require('./routes/user');
let ShortUrlRouter = require('./routes/shortUrl');


app.use(ShortUrlRouter);
app.use('/user',userRouter);

app.listen(PORT,console.log("server started at port",PORT));

