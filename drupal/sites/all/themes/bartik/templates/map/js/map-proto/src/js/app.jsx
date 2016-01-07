/**
* @jsx React.DOM
*/
(function () {

  var React = require('react');

  var API = require('../../../api.js');
  var WorldMap = require('./globe/world_map.jsx');


  // var CountryCard = require('../../../UI/js/dist/main.js');

  //Needed for React Developer Tools
  window.React = React;

  //Render the main app component
  var App = window.App = React.createClass({
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
      var country = this.state.country
      var countryData = this.state.countryData
      return (
        <div>
          <WorldMap
            country = {this.state.data}
            changeCountry={ this.changeCountry }
          />
          // 
          <div className = "poop"><p>{this.state.data} (this was generated with React on the App component)</p></div>
        </div>
        );
    }
  });

})();
