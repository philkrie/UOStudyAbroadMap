/**
* @jsx React.DOM
*/

var React = require('react'),
Detector = require('./third-party/Detector.js'),
TWEEN = require('./third-party/Tween.js'),
DAT = require('./globe.js');

var WebGLGlobe = React.createClass({
  render: function() {
    return (
      <div>
      <div className="container" ref="container"></div>

      <div id="info">
      <strong>UO Study Abroad Map</strong> <span className="bull">&bull;</span> Created by UO Study Abroad Office<span className="bull">&bull;</span>
      </div>

      <div id="title">
      UO Study Abroad Map
      </div>

      <div id="overlay">
      
      </div>

      </div>
    );
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  componentDidMount: function() {
    var _this = this;
    var container = this.refs.container.getDOMNode();
    if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {

      // var container = document.getElementById('container');

      var opts = {imgDir: 'assets/'};
      var globe = new DAT.Globe(container, opts, this.props.changeCountry);
      globe.animate();
      
    }

  }

});

module.exports = WebGLGlobe;
