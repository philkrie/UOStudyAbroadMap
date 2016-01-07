// var React = window.React = require('react');


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

class ContentSwitch extends React.Component{
	render(){
		return <div>{this.props.children[this.props.active]}</div>
	}
}

class Researchers extends React.Component{
	state={
		active:0
	}
	render(){
		var researchers = [
			{
				name :"Ina As",
				bio : "Lorem ipsum dolor sit amet, con numquam soluta provident aliquam ipsam, perferendis dolore ex ea impedit voluptatem, adipisci beatae consequuntur eveniet mollitia architecto nisi!"
			},
			{
				name :"Rons",
				bio : "Lctetur adipisicing elit. Fugit cum maiores non numquam soluta provident aliquam ipsam, perferendis dolore ex ea impedit voluptatem, adipisci beatae consequuntur eveniet mollitia architecto nisi!"
			},
		]
		return(
			<div className="researchers"> 
				<h2 className="researchers-header">Researchers: <span className="data">{this.props.data.length}</span></h2>
				<Slider bindActive={v=>this.setState({active:v})} i={this.state.active}/>
				<ContentSwitch active={this.state.active}>
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
	state={
		visable: true,
	}
	static defaultProps = {
		cid : "bar",
		inverted: true
	}
	close = (e) =>{
		console.log(e);
		this.setState({visable:false})
	}
	render(){
		var cd = this.props.countryData
		var cardStlye={ display: (this.state.visable ? "auto" : "none")}
		return(
			<div className={this.props.inverted ? "card inverted" : "card" } style={cardStlye}>
				<CardHeader title={cd ? cd.countryName : "..." } close={this.close} />
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
		countryData:{}
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
	render(){
		var country = this.state.country
		var countryData = this.state.countryData
		return(
			<div>
				<br />
				<br />
				<CountrySelector f={(v)=>{
					var cname= v.target.value
					this.fetchCountryData(cname)
					this.setState({country:cname})}
				} />
				<aside>
					<CountryCard countryData={countryData[country]} />
				</aside>
			</div>
		)
	}
}

module.exports = CountryCard;

window.App = App;
window.CountrySelector = CountrySelector;
window.CountryCard = CountryCard;