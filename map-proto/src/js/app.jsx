/**
* @jsx React.DOM
*/
(function () {

  var React = require('react');
  var WorldMap = require('./globe/world_map.jsx');
  //Needed for React Developer Tools
  // window.React = React;

  //Render the main app component
  window.MAPP = React.createClass({
    getInitialState: function() {
      return {
        data: "Countries will show up here!",
        country:"Japan",
        countryData:{}
      };
    },
    fetchCountryData:function(cname){
      var self = this;
      API.onResolution(
        API.getFacultyProfilesByCname.bind(this,cname),
        function(v){
          // var s = self.state;
          // s.countryData[cname] = v
          // self.setState(s);
          console.log(v);
        }
      );
    },
    componentDidMount:function(){
      this.fetchCountryData(this.state.country);
      console.log(this.state.data);
    },
    changeCountry: function(country) {
      this.fetchCountryData(country);
      this.setState({data: country});
    },
    render: function() {
      console.log("rerendered with " + this.state.data);
      return (
        <div>
          <WorldMap
            country = {this.state.data}
            changeCountry={ this.changeCountry }
          />
          <div className = "poop"><p>{this.state.data} (this was generated with React on the App component)</p></div>
        </div>
        );
    }
  });

  // console.log(App);
  // console.log(CountrySelector);
  // console.log(CountryCard);
  
  // window.WorldMapFactory = React.createFactory(WorldMap);
  // window.WorldMap = (WorldMap);
 jQuery(function(){
  React.render( 
    <MAPP/>, 
    document.getElementById('map')
  );
 })

})();
