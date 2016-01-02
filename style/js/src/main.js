var React = require('react');
var ReactDOM = require('react-dom');
var foo = 'bar';
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
		return(
			<div className="researcher-info">
				<div className="name">
					<h3>{this.props.data.name}</h3>
				</div>
				<div className="bio">
					<p>
						{this.props.data.bio}
					</p>
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
				<h2 className="researchers-header">Researchers: <span className="data">{this.props.n}</span></h2>
				<Slider bindActive={v=>this.setState({active:v})} i={this.state.active}/>
				<ContentSwitch active={this.state.active}>
					<ResearcherInfo data={researchers[0]} />
					<ResearcherInfo data={researchers[1]} />
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
		visable: true
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
		var cardStlye={ display: (this.state.visable ? "auto" : "none")}
		return(
			<div className={this.props.inverted ? "card inverted" : "card" } style={cardStlye}>
				<CardHeader title='country name' close={this.close} />
				<div className="card-content">
					<Researchers n="23" />
				</div>
			</div>
		)
	}

}

ReactDOM.render(
	<CountryCard />,
	document.getElementById('container')
);