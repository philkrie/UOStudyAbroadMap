var React = require('react'),
var Detector = require('./third-party/Detector.js'),
var TWEEN = require('./third-party/Tween.js'),
var DAT = require('./globe.js');

var WebGLGlobe = React.createClass({
  getInitialState: function(){
    return{data: this.props.country}
  },
  componentWillReceiveProps: function(props) {
    this.setState({data: props.country});
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
  },
  render: function() {
    return (
      <div>
      <div className="container" ref="container"></div>

      <div id="info">
      <strong>UO Study Abroad Map</strong> <span className="bull">&bull;</span> Created by UO Study Abroad Office<span className="bull">&bull;</span>
      </div>

      <div id="title">
      {this.state.data} generated on the world_map component
      </div>

      <div id="overlay">
      
      </div>

      </div>
    );
  },

});

module.exports = WebGLGlobe;
