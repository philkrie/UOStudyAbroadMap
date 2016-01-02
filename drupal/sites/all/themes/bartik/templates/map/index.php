<style>
	*{
		padding: 0px;
		margin:0px;
		font-family: 'open sans';
		max-height: 100%;
	}
	body{
		font-size:16px;
		/*overflow: hidden;*/
	}
	p{
		font-size: 12px;
		line-height: 20px;
		font-weight: 100;
	}
	aside{
		display: inline-block;
		width: 25%;
		/*max-width: 500px;*/
		min-width: 300px;
		margin:2rem;
		overflow: hidden;;
		box-sizing:border-box;
	}
	.data{
		color:white;
	}
	h2{
		line-height: 2rem;
		/*margin-bottom: 1rem;*/
	}
	h3{
		line-height: 3rem;
		font-weight: 400;
	}
	a{
		color:green;
		text-decoration: none;
	}
	.close{
		float:right;
		display: inline-block;
		/*position: relative;*/
		/*top: 80%;*/
		transform: translateY(25%);
		color:black;
	}

	.card{
		background: white;
		box-sizing:border-box;
	}
	.card.inverted{
		background: rgba(0,0,0,.9);
		color:white;
	}
	.card h1, .card h2, .card h3, .card h4, .card h5, .card h6{
		color:yellow;
	}
	.card-header h1, .card-header h2, .card-header h3, .card-header h4, .card-header h5, .card-header h6{
		color:black;
		float:left;
		margin:0px 0px 0px 0px;
	}
	.card-header{
		background: yellow;
		overflow: auto;
		clear:both;
	}
	.card-header, .card-content{
		padding:.5rem 1.5rem;
	}

	.card-content{
		max-height: 80.5vh;
		overflow: scroll;
	}

	.card-content section{
		padding: 1rem 0rem;
	}
	

	.researchers-header{
		text-align: center;
	}
	.researchers-list{
		position: relative;
	}
	.researchers-list ul{
		display: inline-block;
		width: 100%;
		box-sizing:border-box;
		margin-bottom: 1rem;

	}
	.researchers-list li{
		display: inline-block;
	}
	.researchers-list .researcher{
		border-radius: 100%;
		display: inline-block;
		overflow: hidden;
		/*position: relative;
		top: 50%;
		transform: translateY(-50%);*/
	}
	.researchers-list .researcher.flank{
		position: relative;
		width:20%;
		transform: translateY(-20%);
	}
	.researchers-list .researcher.flank-secondary{
		position: relative;
		width:10%;
		transform: translateY(-90%);
	}
	.researchers-list .researcher.active{
		border:2px solid yellow;
		width:30%;
		box-shadow:2px 2px 10px black;
	}
	.researchers-list .researcher img
	{
		display: block;
	    max-width: 100%;
	    max-height: 100%;
	    width: auto;
	    height: auto;
	}
	.researcher-info .name{
		text-align: center;
	}
	
	.infoPannel{
		clear:both;
	}
	.infoPannel img{
		border-radius: 100%;
		display: inline-block;
		overflow: hidden;
		width:20%;	
	}
	.infoPannel.left img{
		float:left;
		margin-right:1rem;
	}
	.infoPannel.right img{
		float:right;
		margin-left:1rem;
	}
	.slick-center h3{
		display: none;
	}

	#slider{
		overflow: hidden;
		position: relative;
		height: 200px;
		padding:0px;
		margin:0px;
	}
	#slider li{
		display: inline-block;
		border-radius: 100%;
		overflow: hidden;
		height: 100%;
	}
	#slider li img{
		height: 100%;
	}
	#slider ul{
		height: 200px;
		overflow: hidden;
		width: 10000%;
		position: absolute;
		left:0px;
		top:0px;
		transition: left .5s;
		list-style: none;
	}
	ul:hover{
		left:200px;
	}
	#slider .previous, #slider .next{
		display: inline-block;
		height: 100%;
		/*line-height: 200px;*/
		width:4rem;
		background: rgba(200,0,0,0.5);
		position: absolute;
		top:0px;
		z-index: 2;
	}
	#slider .previous{
		left:0px;
	}
	#slider .next{
		right:0px;
	}


</style>

<div id="map"></div>
<div id="container"></div>


<script>
	ReactDOM.render(
		React.createElement(MAPP),
		document.getElementById('container')
	);
</script>



