var request = require('request');
var requestretry = require('requestretry');
var cheerio = require('cheerio');
var url = require('url');
var exec = require('child_process').exec;
var fs = require('fs');

function getUnsplashImage(host, hostURL, dlDir, dlPage, tryNum) {
	requestretry({
  		url: host+dlPage,
  		json:true,

  		// The above parameters are specific to Request-retry:
  		maxAttempts: 5,   // (default) try 5 times
  		retryDelay: 5000  // (default) wait for 5s before trying again
	},function(err,resp,body){
                //redirects image
		if (dlPage.indexOf("download") > -1 && resp) {
                	var fileUrl = resp.request.uri.href.split('?').shift();
                	var fileName = url.parse(fileUrl).pathname.split('/').pop().split('?').shift();
			console.log("Started: " + fileUrl);

                	//in curl we have to escape '&' from fileUrl
			if (!fs.existsSync(dlDir+fileName)) {
				if (fileName.indexOf(".jpg") == -1) fileName = fileName + ".jpg";
                		var curl =  'curl ' + fileUrl.replace(/&/g,'\\&') +' -o ' + dlDir+fileName + ' --create-dirs';
                		var child = exec(curl, function(err, stdout, stderr) {
                   	 		if (err){ 
						fs.unlinkSync(dlDir+fileName);
						console.log("Failed: " + fileUrl + " Try: " + tryNum);
						if (tryNum <= 5) {
							getUnsplashImage(host, hostURL, dlDir, dlPage, tryNum+1) 
						}
					} 
                   	 		else console.log("Finished: " + fileName);
                		});
			}
		}
            })
};

(function() {
    var dlDir = './downloads/';
    var hostURL = 'https://unsplash.com/grid';
    var host = 'https://unsplash.com';
    
    request(hostURL, function(err, resp, body) {
        if (err) throw err;

        $ = cheerio.load(body);
        $('.photo a').each(function(){
            var dlPage = $(this).attr('href');
            setTimeout(getUnsplashImage(host, hostURL, dlDir, dlPage, 1), 5000);
        });        
    });
})();

