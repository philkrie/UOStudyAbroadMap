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
      var globe = new DAT.Globe(container, opts);
      var i, tweens = [];

      var xhr;
      TWEEN.start();


      xhr = new XMLHttpRequest();
      xhr.open('GET', 'assets/population909500.json', true);
      var onreadystatechangecallback = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            window.data = data;
            globe.animate();
            document.body.style.backgroundImage = 'none'; // remove loading
          }
        }
      };
      xhr.onreadystatechange = onreadystatechangecallback.bind(this);
      xhr.send(null);
    }

  }

});

module.exports = WebGLGlobe;
