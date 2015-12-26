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
      return (
        <div>
          <WorldMap 
            changeCountry={ this.changeCountry }
          />
          <div className = "poop"><p>{this.state.data}</p></div>
        </div>
        );
    }
  });
  React.render(<App/>, document.body);

})();
