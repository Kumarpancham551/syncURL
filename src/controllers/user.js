const {httpCodes}= require("../constans/backendConfig");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

let saltRounds = 10;
let secretKey ='relevel';
module.exports ={
    login:function(req,res){
        var data = req.body;
        var responseData ={
            success:false,
            msg:"Invalid params for login"
        };
        if(data.username && data.password){
            User.login(data,function(err,result){
                if(err){
                    responseData.msg="Error in login";
                    return res.status(httpCodes.internalServerError).send(responseData);
                }
                if(result.length === 0){
                    responseData.msg="Invalid Email or password";
                    return res.status(httpCodes.internalServerError).send(responseData);   
                }
                bcrypt.compare(data.password,result[0].password,function(err1,result1){
                  if(err1){
                    responseData.msg="Error in login";
                    return res.status(httpCodes.internalServerError).send(responseData);
                  }  
                  if(!result1){
                    responseData.msg="Invalid Email or Password";
                    return res.status(httpCodes.internalServerError).send(responseData);
                  }
                  responseData.success=true;
                  responseData.msg="Successfully logged in";
                  const userData = {
                    username:result[0].username,
                    userId:result[0].ID
                  }
                  const token = jwt.sign(userData,secretKey,{
                    expiresIn:"1h"
                  });
                  responseData.data={
                    username:result[0].username,
                    userId:result[0].ID,
                    token
                  };
                  return res.status(httpCodes.success).send(responseData);
                } 
                )
            }
            );
        }else{
            return res.status(httpCodes.badRequest).send(responseData);
        }
    },

    signup:function(req,res){
        var data = req.body;
        var responseData ={
            success:false,
            msg:"Invalid params for signup"
        };
        if(data.username && data.password){
            User.getUserSignupDetails(data,function(err,result){
                if(err){
                    console.log("err",err);
                    responseData.msg="Error in signup";
                    return res.status(httpCodes.internalServerError).send(responseData);
                }
                if(result.length > 0){
                    responseData.msg="User already exist";
                    return res.status(httpCodes.internalServerError).send(responseData);   
                }else{
                    bcrypt.hash(data.password,saltRounds,function(err1,hash){
                        if(err1){
                            console.log("err1",err1);
                            responseData.msg="Error in signup";
                            return res.status(httpCodes.internalServerError).send(responseData);   
                        }
                        data.hashPwd = hash;
                        User.signup(data,function(err2,result2){
                            if(err2){
                                console.log("err2",err2);
                                responseData.msg="Error in signup";
                                return res.status(httpCodes.internalServerError).send(responseData);   
                            }
                            responseData.success = true;
                            responseData.msg="Successfully signup";
                            const userData ={
                                username:data.username,
                                userId:result2.insertId
                            }
                            
                            responseData.data={
                                username:data.username,
                                userId:result2.insertId
                                
                            };
                            return res.status(httpCodes.success).send(responseData);
                        });
                    });
                }
              
            });
        }else{
            return res.status(httpCodes.badRequest).send(responseData);
        }
    },

}