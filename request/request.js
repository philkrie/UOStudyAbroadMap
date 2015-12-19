request = function(method, url, params, cb){
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhr.onreadystatechange = function(){
		if(xhr.readyState=4 && xhr.status == 200){
			cb(xhr);
		}
	}
	buildQueryString = function(params){
		var query = "?"
		return query;
	}
	xhr.open(method, url, true);
	xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
	xhr.send();
}

// DO NOT COPY THIS CODE, ERROR HANDLING AND IE9-
//     SUPPORT HAVE BEEN OMITTED FOR BREVITY!

var req = new XMLHttpRequest();

// Feature detection for CORS
if ('withCredentials' in req) {
    req.open('GET', 'http://facultydb.dd:8083/node.json?type=article', true);
    // Just like regular ol' XHR
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                console.log(req.responseText)
            } else {
                // Handle error case
            }
        }
    };
    req.setRequestHeader("Access-Control-Allow-Origin", "*");
    req.send();
}


// // Create the XHR object.
// function createCORSRequest(method, url) {
//   var xhr = new XMLHttpRequest();
//   if ("withCredentials" in xhr) {
//     // XHR for Chrome/Firefox/Opera/Safari.
//     xhr.open(method, url, true);
//   } else if (typeof XDomainRequest != "undefined") {
//     // XDomainRequest for IE.
//     xhr = new XDomainRequest();
//     xhr.open(method, url);
//   } else {
//     // CORS not supported.
//     xhr = null;
//   }
//   return xhr;
// }

// // Helper method to parse the title tag from the response.
// function getTitle(text) {
//   return text.match('<title>(.*)?</title>')[1];
// }

// // Make the actual CORS request.
// function makeCorsRequest() {
//   // All HTML5 Rocks properties support CORS.
//   var url = 'http://updates.html5rocks.com';

//   var xhr = createCORSRequest('GET', url);
//   if (!xhr) {
//     alert('CORS not supported');
//     return;
//   }

//   // Response handlers.
//   xhr.onload = function() {
//     var text = xhr.responseText;
//     var title = getTitle(text);
//     alert('Response from CORS request to ' + url + ': ' + title);
//   };

//   xhr.onerror = function() {
//     alert('Woops, there was an error making the request.');
//   };

//   xhr.setRequestHeader("Access-Control-Allow-Origin", true);
//   xhr.send();
// }

// makeCorsRequest()