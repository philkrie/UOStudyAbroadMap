// test

// API.getTaxonomyMapByName("Country").then(printPromiseValue);
// API.getFacultyProfiles().then(printPromiseValue);

// API.getFacultyProfilesByCname("Japan",function(v){console.log(v)});
// API.onResolution(
// 	API.getFacultyProfilesByCname.bind(this,"Afghanistan"),
// 	function(v){console.log(v)}
// );

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