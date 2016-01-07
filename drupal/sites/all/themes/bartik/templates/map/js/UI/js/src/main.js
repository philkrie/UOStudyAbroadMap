var React = require('react');
var ReactDOM = window.ReactDOM = require('react-dom');
var _ = require('underscore');


var TWEEN = require('./globe/third-party/Tween.js');
var DAT = require('./globe/globe.js');
// var Detector = require('./globe/third-party/Detector.js');


var modMap = function(array, n, offset){
	// mod for modulo, map as in catagory theory not the globe
	var n = n || 0;
	var offset = offset || 0;
	return _(n).times(x=>array[(x+offset)%array.length])
}


var WorldMap = React.createClass({
  getInitialState: function(){
    return{data: this.props.country}
  },
  componentWillReceiveProps: function(props) {
    this.setState({data: props.country});
  },
  componentDidMount: function() {
    var _this = this;
    var container = this.refs.container.getDOMNode();
    // if(!Detector.webgl){
    //   Detector.addGetWebGLMessage();
    // } else {

      // var container = document.getElementById('container');

      var opts = {imgDir: 'assets/'};
      var globe = new DAT.Globe(container, opts, this.props.changeCountry);
      globe.animate();
    // }
  },
  render: function() {
    return (
      <div>
      <div className="container" ref="container"></div>

      <div id="overlay"></div>

      </div>
    );
  },

});

class Slide extends React.Component{
	render(){
		return(
			<li>
    			<img src={this.props.image} />
    		</li>
		)
	}
}
class Slider extends React.Component{
  state={
	currentSlide:0,
	data: [
 		{id:0,image:"http://zblogged.com/wp-content/uploads/2015/11/17.jpg"},
 		{id:1,image:"http://zblogged.com/wp-content/uploads/2015/11/17.jpg"},
 		{id:2,image:"http://zblogged.com/wp-content/uploads/2015/11/17.jpg"},
 		{id:4,image:"http://zblogged.com/wp-content/uploads/2015/11/17.jpg"},
    ]
  } 
  render() {
  	var modify = (modifier)=>{
  		// mod defined over negitive numbers
  		var n = this.state.data.length
  		var mod = (((this.props.i + modifier) % n) + n) % n

  		this.props.bindActive(mod)
  	}
    return (
      <section id="slider">
      		<a className="previous" onClick={modify.bind(this,-1)}>-</a>
      		<ul style={{left:'200'*this.props.i+'px'}}>
      			{this.state.data.map((v,i)=><Slide key={i} {...v}/>)}
      		</ul>
      		<a className="next" onClick={modify.bind(this,1)}>+</a>
      	</section>
    );
  }
};
class CardHeader extends React.Component{
	render(){
		return(
			<div className="card-header">
				<h1>{this.props.title}</h1>
				<span className="close" onClick={this.props.close}>x</span>
			</div>
		)
	}
}

class ResearcherInfo extends React.Component {
	render(){
		var bio = this.props.data.bio
		function parseDrupalBio(){
			return{
				__html: bio
			}
		}
		return(
			<div className="researcher-info">
				<div className="name">
					<h3>{this.props.data.name}</h3>
				</div>
				<div className="bio">
					<div dangerouslySetInnerHTML={parseDrupalBio()} />
					<a href="#">readmore</a>
				</div>
			</div>
		)
	}
}


class SubSlider extends React.Component{
	render(){
		var p=this.props;
		var widths = p.widthMap.map(x=>{return{width:x+'%'}})
		return(
			<div id="subslider">
				<a onClick={p.change.bind(null, (p.currentSlide+(p.children.length+1))%p.children.length)}>-</a>
				<ul>
					{
						_(modMap(p.children,p.widthMap.length,p.currentSlide))
						.first(p.widthMap.length)
						.map((x,i)=>(<li style={widths[i]} key={i}>{x}</li>))
					}
				</ul>
				<a onClick={p.change.bind(null, (p.currentSlide+(p.children.length-1))%p.children.length)}>+</a>
			</div>
		)
	}
}

class ContentSwitch extends React.Component{
	render(){
		return <div>{this.props.children[this.props.active]}</div>
	}
}

class Researchers extends React.Component{
	state={
		active:0,
		currentSlide:0,
		widthMap:[10,20,40,20,10]
	}
	modifyCurrenSlide(x){
		this.setState({currentSlide:x})
	}
	render(){
		var s = this.state;
		var f = (this.props.data[0]);
		console.log('data', f);
		// console.log(_.chain(this.data.pluck('')) );
		return(
			<div className="researchers"> 
				<h2 className="researchers-header">Researchers: <span className="data">{this.props.data.length}</span></h2>
				<SubSlider {...s} change={this.modifyCurrenSlide.bind(this)}>
					{
						_.compact(['http://facultydb.dd:8083/sites/international-faculty.dd/files/17_0.jpg', 'http://organicthemes.com/demo/profile/files/2012/12/profile_img.png'])
						.map(x=>(<img src={x} />))
					}
				</SubSlider>
				<ContentSwitch active={this.state.currentSlide}>
					{this.props.data.map((v)=>{
						return(
							<ResearcherInfo data={v} />
						)
					})}
				</ContentSwitch>
				<InfoPannel title="International Students" n="2,000" type="left">
					<p>
					<img src="http://zblogged.com/wp-content/uploads/2015/11/17.jpg"/>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure vitae, veniam magnam qui neque cum ea velit porro autem earum. A illum numquam praesentium id deserunt quis, voluptatem error aut.
					</p>
				</InfoPannel>
				<InfoPannel title="Study abroad programs" n="6" type="right">
					<p>
					<img src="http://zblogged.com/wp-content/uploads/2015/11/17.jpg"/>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure vitae, veniam magnam qui neque cum ea velit porro autem earum. A illum numquam praesentium id deserunt quis, voluptatem error aut.
					</p>
				</InfoPannel>
			</div>
		)
	}
}

class InfoPannel extends React.Component{
	render(){
		return(
			<section className={"infoPannel " + this.props.type}>
				<h3>{this.props.title} <span className="data">{this.props.n}</span></h3>
				{this.props.children}
			</section>
		)
	}
}

class CountryCard extends React.Component{
	static defaultProps = {
		cid : "bar",
		inverted: true
	}
	render(){
		var cd = this.props.countryData
		var cardStlye={ display: (this.props.visable ? "inline-block" : "none")}
		return(
			<div className={this.props.inverted ? "card inverted" : "card" } style={cardStlye}>
				<CardHeader title={cd ? cd.countryName : "..." } close={this.props.close} />
				<div className="card-content">
					<Researchers n="23" data={cd ? cd.facultyProfiles : []} />
				</div>
			</div>
		)
	}
}

class CountrySelector extends React.Component{
	render(){
		return(
			<form>
				<select defaultValue="Japan" onChange={this.props.f}>
				  <option value="Afghanistan">Afgan</option>
				  <option value="Japan">japan </option>
				</select>
			</form>
		)
	}
}

class App extends React.Component{
	state={
		country:"Japan",
		countryData:{},
		countryCardIsVisable:false,
	}
	fetchCountryData(cname){
		var self = this;
		API.onResolution(
			API.getFacultyProfilesByCname.bind(this,cname),
			function(v){
				var s = self.state;
				s.countryData[cname] = v
				self.setState(s);
				console.log(v);
			}
		);
	}
	componentDidMount(){
		this.fetchCountryData(this.state.country);
	}
	close = (e) =>{
		console.log(e);
		this.setState({countryCardIsVisable:false})
	}
	render(){
		var s = this.state;
		return(
			<div>
				<div>
				<WorldMap
				  country = {s.country}
				  changeCountry={(cname)=>{
					if(cname){
						this.fetchCountryData(cname)
						this.setState({
							country:cname,
							countryCardIsVisable:true
						})
					}
				  }}
				/>
				</div>
				<aside>
					<CountryCard visable={s.countryCardIsVisable} countryData={s.countryData[s.country]} />
				</aside>
			</div>
		)
	}
}

window.MapAppFactory = React.createFactory(App);