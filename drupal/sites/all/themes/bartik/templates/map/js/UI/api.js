baseURL = "http://facultydb.dd:8083/"

if (typeof module !== 'undefined' && module.exports) {
	when = require('when');
}

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
		// console.log(list);
		return list.map(function(i){
			return {
				name: i.title,
				url  : i.url,
				profileImage: Array.isArray(i.field_profile_image) ? null : i.field_profile_image.file.id, 
				bio  : i.field_short_bio ? i.field_short_bio.value : "", 
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

searchObjectForKeyByValue = function(obj, key){
	// console.log(">",Object.keys(obj).length)
	return parseInt(Object.keys(obj).filter(function(k){ return obj[k] === key})[0])

}

flist = [1];


API = {
	// public
	getFileUrl: function(id){
		return promiseRequest("GET", baseURL+"/file/"+id+".json")
	},
	getNodeByType: function(type){
		return promiseRequest("GET", baseURL+"node.json?type="+type);
	},
	getFacultyProfiles: function(){
		return API.getNodeByType("faculty_profile")
			.then(function(r){
				return (parse.facultyProfile(parse.nodeList(r)));
			})
	},
	getFacultyProfilesByCid: function(facultyProfiles, cid){
		return facultyProfiles.filter(function(p){
			return p.countryId === cid
		});	
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
	},
	getFacultyProfilesByCname: function(cname){
		console.log('getting facultry profiles by name ...')
		return API.getTaxonomyMapByName("Country")
			.then(function(countries){
				window.countries = countries
			})
			.then(API.getFacultyProfiles)
			.then(function(facultyProfiles){
				window.facultyProfiles = facultyProfiles
			})
			.then(function(){
				cid = searchObjectForKeyByValue(window.countries, cname);
				profiles = API.getFacultyProfilesByCid(window.facultyProfiles, cid);
				return {
					countryName: cname,
					cid: cid,
					facultyProfiles: profiles
				};
			})
			.then(function(countryCardData){
				when.all(when.map(countryCardData.facultyProfiles, function(p){
					if (p.profileImage != null){
						return API.getFileUrl(p.profileImage).then(function(r){
							p.profileImage = JSON.parse(r.responseText).url;
							img = loadImage(p.profileImage)
						})
					}
				}))
				return countryCardData
			});
	},
	onResolution: function(p,cb){
		p().then(cb);
	}



}

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

if (typeof module !== 'undefined' && module.exports) {
	module.exports = API;
}



