const mysql = require("mysql2");
const Config = require("../constans/backendConfig");
var pool = mysql.createPool((Config.mysql.local));

module.exports = {
    executeQuery : function(sql,data,callback){
        pool.getConnection(function(err,connection){
            if(err){
                callback(err);
            }else{
                connection.query(sql,data,function(err1,results){
                    connection.release();
                    callback(err1,results);
                })
            }
        })
    }
}