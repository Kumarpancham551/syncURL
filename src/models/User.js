const sqlConnection = require("../services/sqlConnection");

module.exports ={
    getUserSignupDetails: function(data, callback){
        var sql = "SELECT * FROM Users WHERE username = ?";
        var values = [];
        values.push(data.username);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },
    login: function(data,callback){
        var sql = "SELECT ID,username,password FROM Users WHERE username =?";
        var values = [];
        values.push(data.username);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },
    signup: function(data,callback){
        var sql = "INSERT INTO users(username,password) VALUES(?,?)";
        var values = [];
        values.push(data.username);
        values.push(data.hashPwd);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },
}