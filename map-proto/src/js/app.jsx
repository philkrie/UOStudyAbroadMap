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
    render: function() {
      return <WorldMap />;
    }
  });
  React.render(<App/>, document.body);

})();
