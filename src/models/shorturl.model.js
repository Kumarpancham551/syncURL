const sqlConnection = require("../services/sqlConnection");

let cnt = 0;
module.exports = {

    searchShortenedUrl : function(hash){
        return new Promise((resolve, reject)=>{
            var sql = "SELECT userId, url FROM ShortUrls WHERE shortenedUrl = ?";
            var values = [];
            values.push(hash);
            sqlConnection.executeQuery(sql, values, function(err, result) {
                if(err ){
                    console.log(err) 
                    resolve(500);
                }
                else if (result.length > 0 ) resolve(false);
                else resolve(true);
            });
        })
    },

    findUrlByUser : function(data, callback){
        var sql = "SELECT * FROM ShortUrls WHERE userId = ? AND shortenedUrl = ?";
		var values = [];
        values.push(data.userId);
        values.push(data.shortenedUrl);
		sqlConnection.executeQuery(sql, values, function(err, result) {

			callback(err, result);
		});
    },

    createUrl : function(data, callback){
        var sql = "INSERT INTO ShortUrls (url, shortenedUrl, userId) VALUES (?, ?, ?)";
		var values = [];
		values.push(data.url);
		values.push(data.hash);
		values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
    },

    getAllUrlsForUser : function (data, callback){
        var sql = "SELECT * FROM ShortUrls WHERE userId = ?";
		var values = [];
        values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
    },

    getAllUrls : function(data, callback){
        var sql = "SELECT * FROM ShortUrls LIMIT ? OFFSET ?";
		var values = [];
        values.push(data.limit || 100);
        values.push((data.pageNumber - 1) || 0);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
    },
}