<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="request.js"></script>
	<script>
		request("GET", "http://facultydb.dd:8083/file/1.json", {}, function(xhr){console.log(xhr.responseText)});
	</script>
</head>
<body>
	request
</body>
</html>

