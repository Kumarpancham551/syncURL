const jwt = require("jsonwebtoken");
const {
    httpCodes,secretKey
}=require("../constans/backendConfig");

module.exports = (req,res,next)=>{
    const token = req.body.token;
    const responseData ={
        success: false,
        msg:"unauthrosied data"
    };
    if(!token){
        return res.status(httpCodes.unauthrised).send(responseData);
    }
    try{
        const decodedtoken = jwt.verify(token,secretKey);
        req.userData = decodedtoken;
        next();
    }catch(err){
        responseData.msg="Invalid token";
        return res.status(httpCodes.unauthrised).send(responseData);

    }
}