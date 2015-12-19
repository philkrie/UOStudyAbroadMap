baseURL = "http://facultydb.dd:8083/"

request = function(method, url, cb){
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhr.onreadystatechange = function(){
		if(xhr.readyState== 4){
			cb(xhr);
		}
	}
	xhr.open(method, url, true);
	xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
	xhr.send();
}

promiseRequest = function(method, url){
	var d = when.defer();
	request(method, url, d.resolve)
	return d.promise;
}

printRes = function(res){
	console.log(res.responseText);
}

printPromiseValue = function(v){
	console.log(v)
}


parse = {
	// Concerned with formats raw api output into UI friendly form
	nodeList : function(res){
		return JSON.parse(res.responseText).list;
	},
	facultyProfile:function(list){
		return list.map(function(i){
			return {
				title: i.title,
				url  : i.url,
				countryId: i.field_country.length ? parseInt(i.field_country[0].id) : null
			}
		})
	},
	vocabulary : function(list){
		vocab = {}
		list.map(function(i){
			vocab[i.name.toLowerCase()] = parseInt(i.vid)
		})
		return vocab;
	},
	term : function(list){
		vocab = {}
		list.map(function(i){
			vocab[i.tid] = i.name
		})
		return vocab;
	}	
}




API = {
	// public
	getFileUrl: function(id){
		return promiseRequest("GET", baseURL+"/file/"+id+".json")
	},
	getNodeByType: function(type){
		return promiseRequest("GET", baseURL+"node.json?type="+type);
	},
	getFacultyProfiles: function(){
		return this.getNodeByType("faculty_profile")
			.then(function(r){
				return (parse.facultyProfile(parse.nodeList(r)));
			})
	},
	getVocabulary: function(){
		return promiseRequest("GET", baseURL+"taxonomy_vocabulary.json")
			.then(function(r){
				return parse.vocabulary(parse.nodeList(r));
			})
	},
	getTaxonomyMapByName: function(name){
		name = name.toLowerCase();
		return this.getVocabulary()
			.then(function(vocab){
				return promiseRequest("GET", baseURL+"taxonomy_term.json?vocabulary="+vocab[name])
			})
			.then(function(r){
				return (parse.term(parse.nodeList(r)));
			})
	}


}

// test

API.getTaxonomyMapByName("Country").then(printPromiseValue);
API.getFacultyProfiles().then(printPromiseValue);

// flist = [1];

// when.all(when.map(flist, function(i){
// 	return API.getFileUrl(i).then(function(r){
// 		img = loadImage(JSON.parse(r.responseText).url)
// 		placeImage(img)
// 	})
// }))
// .then(function(res){
// 	console.log("all done");
// });


// image preloading  util

loadImage=function(url){
	var img=new Image();
	img.src=url;
	return img;
}

placeImage=function(img){
	// img = document.createElement("img");
	// img.src="http://facultydb.dd:8083/sites/international-faculty.dd/files/4402640608_a9b1594bb6_o.jpg";
	document.getElementById("map").appendChild(img)
}


