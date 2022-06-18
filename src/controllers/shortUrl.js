const {
	httpCodes
} = require("../constans/backendConfig");

const ShortUrl = require('../models/shorturl.model');

function getHash() {   
    var text = '';    
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < 5; i++)        
    text += possible.charAt(Math.floor(Math.random() * possible.length));    
    return text;
}

async function getShortenedUrl() {
    let hash = getHash();
    while(true){
        let result = await ShortUrl.searchShortenedUrl(hash);
        if( result == 500 ) return 500;
        else if( result == true ) return hash ;
    }
}


module.exports = {

    getUrl : async function(req, res){
        var responseData = {
			success: false,
			msg: "Invalid parameters!"
		};
        var data = {};
        data.url = req.query.url;
        data.userId = req.userData.userId;
        if(!data.userId || ! data.url) return res.status(httpCodes.badRequest).send(responseData);
        ShortUrl.findUrlByUser(data, (err, result)=>{
            if(err){
                responseData.msg = "Error in connecting to database.";
                return res.status(httpCodes.internalServerError).send(responseData);
            }
            else if( result.length > 0 ) {
                responseData.data = result[0];
                responseData.msg = "URL has been created earlier!";
                responseData.success = true;
                return res.status(httpCodes.success).send(responseData);
            }
            else{
                getShortenedUrl().then( result1 => {
                    if( result1 === 500 ) {
                        console.log("hii");
                        responseData.msg = "Error in connecting to database";
                        return res.status(httpCodes.internalServerError).send(responseData);
                    }
                    data.hash = result1;
                    ShortUrl.createUrl(data, ( err2, result2 )=>{
                        if( err2 ) {
                            responseData.msg = "Failed to create short URL";
                            return res.status(httpCodes.internalServerError).send(responseData);
                        }
                        responseData.msg = "new URL created!";
                        responseData.shortUrl = "localhost:8080/" + result1;
                        responseData.success = true;
                        return res.status(httpCodes.success).send(responseData);
                    })
                });
            }
        })
    },

    getAllUrlsForUser : function(req, res){
        var responseData = {
			success: false,
			msg: "Invalid params!"
		};
        var data = {};
        data.userId = req.userData.userId;
        if(!data.userId) return res.status(httpCodes.badRequest).send(responseData);
        ShortUrl.getAllUrlsForUser(data, (err, result) => {
            if(err) {
                responseData.msg = "Error in connecting to the backend";
                return res.status(httpCodes.internalServerError).send(responseData);
            }
            else if( result.length == 0 ){
                responseData.msg = "You don't have any registered URLs";
                responseData.urls = result;
                responseData.success = true;
                return res.status(httpCodes.success).send(responseData);
            }
            else{
                responseData.msg = "Fetched All URLs!";
                responseData.urls = result;
                responseData.success = true;
                return res.status(httpCodes.success).send(responseData);
            }
        })
    },

    getAllUrls : function(req, res){
        var responseData = {
			success: false,
			msg: "Invalid params!"
		};
        var data = req.body;
        ShortUrl.getAllUrls(data, (err, result) => {
            if(err) {
                responseData.msg = "Error in connecting to the backend";
                return res.status(httpCodes.internalServerError).send(responseData);
            }
            else if( result.length == 0 ){
                responseData.msg = "There are no URLs";
                responseData.urls = result;
                responseData.success = true;
                return res.status(httpCodes.success).send(responseData);
            }
            else{
                responseData.msg = "Fetched All URLs!";
                responseData.urls = result;
                responseData.success = true;
                return res.status(httpCodes.success).send(responseData);
            }
        })

    },

    redirectUrl : function ( req, res ){
        var responseData = {
			success: false,
			msg: "Invalid parameters!"
		};
        var data = {};
        data.shortenedUrl = req.params.code;
        data.userId = req.userData.userId;
        if( !data.shortenedUrl || !data.userId ) return res.status(httpCodes.badRequest).send(responseData);
        ShortUrl.findUrlByUser(data, (err, result)=>{
            if(err){
                responseData.msg = "Error in connecting to database!";
                return res.status(httpCodes.internalServerError).send(responseData);
            }
            else if(result.length == 0 ){
                responseData.msg = "URL not found in database!";
                responseData.success = false;
                return res.status(httpCodes.badRequest).send(responseData);
            }
            else{
                responseData.success = true;
                responseData.msg = `Redirecting to ${result[0].url}`; 
                return res.status(httpCodes.success).send(`http://${result[0].url}`);
            }
        })
    }

}