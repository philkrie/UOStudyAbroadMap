/**
* @jsx React.DOM
*/
(function () {

  var React = require('react');
  var WorldMap = require('./globe/world_map.jsx');
  //Needed for React Developer Tools
  window.React = React;

  //Render the main app component
  var App = React.createClass({
    getInitialState: function() {
      return {data: "Countries will show up here!"};
    },
    componentDidMount: function() {
      console.log(this.state.data);
    },
    changeCountry: function(country) {
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
  

})();
