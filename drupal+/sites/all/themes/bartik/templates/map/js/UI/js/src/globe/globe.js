/**
 * dat.globe Javascript WebGL Globe Toolkit
 * http://dataarts.github.com/dat.globe
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

var THREE = require("../globe/third-party/three.min.js");

var DAT = DAT || {};

var camera, scene, renderer;
var radius = 0.955;
var base_globe = 0;

var intersected_object = 0;
var hover_scale = 1.01;
var flag = true;

DAT.Globe = function(container, opts, callback) {
  "use strict";
  opts = opts || {};

  //Determines atmosphere shader
  var Shaders = {
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
          'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
        '}'
      ].join('\n')
    }
  };

  var w, h, mesh, atmosphere, point, overRenderer;

  var curZoomSpeed = 0, zoomSpeed = 50;

  var mouse = { x: 0, y: 0 }, mouseOnDown = { x: 0, y: 0 };
  var rotation = { x: 0, y: 0 },
      target = { x: Math.PI*3/2, y: Math.PI / 6.0 }, //Determines initial position upon render of globe
      targetOnDown = { x: 0, y: 0 };

  var distance = 100000, distanceTarget = 100;
  var padding = 40;
  var PI_HALF = Math.PI / 2;
  var segments = 64;


  function init() {

    container.style.color = '#fff';
    container.style.font = '13px/20px Arial, sans-serif';

    var shader, uniforms, material;
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;

    camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);
    camera.position.z = distance;

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(radius, segments, segments);

    scene.add(new THREE.AmbientLight(0x555555));

    var directionalLight1 = new THREE.DirectionalLight(0xaaaaaa, 0.5);
    directionalLight1.position.set(-1, 1, 1).normalize();
    scene.add(directionalLight1);

    var directionalLight2 = new THREE.DirectionalLight(0xaaaaaa, 0.5);
    directionalLight2.position.set(-1, 1, -1).normalize();
    scene.add(directionalLight2);

    var directionalLight3 = new THREE.DirectionalLight(0xaaaaaa, 0.5);
    directionalLight3.position.set(1, 1, -1).normalize();
    scene.add(directionalLight3);

    var directionalLight4 = new THREE.DirectionalLight(0xaaaaaa, 0.5);
    directionalLight4.position.set(1, 1, 1).normalize();
    scene.add(directionalLight4);

    base_globe = new THREE.Object3D();
    base_globe.scale.set(20, 20, 20);
    scene.add(base_globe);
    var sea_texture = THREE.ImageUtils.loadTexture('https://c1.staticflickr.com/3/2365/1782866925_42339aa1d7_b.jpg', THREE.UVMapping, function () {
        sea_texture.wrapS = THREE.RepeatWrapping;
        sea_texture.wrapT = THREE.RepeatWrapping;
        sea_texture.repeat.set(16, 8);
        var sea_mesh = new THREE.Mesh(new THREE.SphereGeometry(radius+.04, segments, segments), new THREE.MeshLambertMaterial({
            opacity: 1,
            depthTest: true,
            color: 0x6699ff
        }));
        base_globe.add(sea_mesh);

        for (var name in country_data) {
            var geo = new Tessalator3D(country_data[name], 0);

            var continents = ["EU", "AN", "AS", "OC", "SA", "AF", "NA"];
            var color = new THREE.Color(0xff0000);
            color.setHSL(2 * (1 / 7), Math.random() * 0.25 + 0.65, Math.random() / 2 + 0.25);
            var sub_mesh = country_data[name].mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
                color: color
            }));
            sub_mesh.name = "land";
            sub_mesh.userData.country = name;
            base_globe.add(sub_mesh);
        }
        shader = Shaders['atmosphere'];
        uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        material = new THREE.ShaderMaterial({

              uniforms: uniforms,
              vertexShader: shader.vertexShader,
              fragmentShader: shader.fragmentShader,
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending,
              transparent: false

            });
        sub_mesh = new THREE.Mesh(geometry, material);
        sub_mesh.scale.set( 1.14, 1.14, 1.14 );
        base_globe.add(sub_mesh);
        mesh = sub_mesh;
    });
  
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(w, h);

    renderer.domElement.style.position = 'absolute';

    container.appendChild(renderer.domElement);

    container.addEventListener('mousedown', onMouseDown, false);

    container.addEventListener('mousewheel', onMouseWheel, false);

    document.addEventListener('keydown', onDocumentKeyDown, false);

    document.addEventListener('mouseup', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResize, false);

    container.addEventListener('mouseover', function() {
      overRenderer = true;
    }, false);

    container.addEventListener('mouseout', function() {
      overRenderer = false;
    }, false);
    
  }

  function onDocumentMouseMove(event) {
    "use strict";
    if(flag){

    } else {

      if (intersected_object !== 0) {
          intersected_object.scale.set(1.0, 1.0, 1.0);
          var color = new THREE.Color(0xff0000);
          color.setHSL(2 * (1 / 7), Math.random() * 0.25 + 0.65, Math.random() / 2 + 0.25);
          intersected_object.material.color = color;
          intersected_object.material.needsUpdate = true;
      }

      event.preventDefault();
      var mouseX = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
      var mouseY = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.height ) * 2 + 1;
      var vector = new THREE.Vector3(mouseX, mouseY, -1);
      vector.unproject(camera);
      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersects = raycaster.intersectObject(base_globe, true);
      if (intersects.length > 0) {
          if (intersects[0].point !== null) {
              if (intersects[0].object.name === "land") {
                  console.log(intersects[0].object.userData.country);

            
                  callback(intersects[0].object.userData.country);

                  intersects[0].object.scale.set(hover_scale, hover_scale, hover_scale);
                  intersects[0].object.material.color = new THREE.Color( 0xffff00 );  
                  intersects[0].object.material.needsUpdate = true;
                  intersected_object = intersects[0].object;
              } else {
                  callback(null);
              }
          } else {
              callback(null);
          }
      } else {
              callback(null);
      }
    }
  }

  function onMouseDown(event) {
    event.preventDefault();

    flag = false;

    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('mouseout', onMouseOut, false);

    mouseOnDown.x = - event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;

    container.style.cursor = 'move';
  }

  function onMouseMove(event) {
    mouse.x = - event.clientX;
    mouse.y = event.clientY;

    flag = true;

    var zoomDamp = distance/1000;

    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.03 * zoomDamp;
    target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.03 * zoomDamp;

    target.y = target.y > PI_HALF ? PI_HALF : target.y;
    target.y = target.y < - PI_HALF ? - PI_HALF : target.y;
  }

  function onMouseUp(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
    container.style.cursor = 'auto';
  }

  function onMouseOut(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
  }

  function onMouseWheel(event) {
    event.preventDefault();
    if (overRenderer) {
      zoom(event.wheelDeltaY * 0.3);
    }
    return false;
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 38:
        zoom(100);
        event.preventDefault();
        break;
      case 40:
        zoom(-100);
        event.preventDefault();
        break;
    }
  }

  function onWindowResize( event ) {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
  }

  function zoom(delta) {
    distanceTarget -= delta;
    distanceTarget = distanceTarget > 100 ? 100 : distanceTarget;
    distanceTarget = distanceTarget < 50 ? 50 : distanceTarget;
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    zoom(curZoomSpeed);

    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;
    distance += (distanceTarget - distance) * 0.3;

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    camera.lookAt(mesh.position);

    renderer.render(scene, camera);
  }

  init();
  this.animate = animate;


  this.__defineGetter__('time', function() {
    return this._time || 0;
  });

  this.__defineSetter__('time', function(t) {
    
  });

  this.renderer = renderer;
  this.scene = scene;

  return this;

};

// originally from https://github.com/udmani/tessalator/
function Tessalator3D(data) {
  THREE.Geometry.call(this);
  var i, uvs = [];
  var inner_radius = 0.98;
  for (i = 0; i < data.vertices.length; i += 2) {
    var lon = data.vertices[i];
    var lat = data.vertices[i + 1];
    var phi = +(90.0 - lat) * Math.PI / 180.0;
    var the = +(180.0 - lon) * Math.PI / 180.0;
    var wx = Math.sin(the) * Math.sin(phi) * -1;
    var wz = Math.cos(the) * Math.sin(phi);
    var wy = Math.cos(phi);
    var wu = 0.25 + lon / 360.0;
    var wv = 0.50 + lat / 180.0;
    this.vertices.push(new THREE.Vector3(wx, wy, wz));
    uvs.push(new THREE.Vector2(wu, wv))
  }
  var n = this.vertices.length;
  if (inner_radius <= 1) {
    for (i = 0; i < n; i++) {
      var v = this.vertices[i];
      this.vertices.push(v.clone()
        .multiplyScalar(inner_radius))
    }
  }
  for (i = 0; i < data.triangles.length; i += 3) {
    var a = data.triangles[i];
    var b = data.triangles[i + 1];
    var c = data.triangles[i + 2];
    this.faces.push(new THREE.Face3(a, b, c, [this.vertices[a], this.vertices[b], this.vertices[c]]));
    this.faceVertexUvs[0].push([uvs[a], uvs[b], uvs[c]]);
    if ((0 < inner_radius) && (inner_radius <= 1)) {
      this.faces.push(new THREE.Face3(n + b, n + a, n + c, [this.vertices[b].clone()
        .multiplyScalar(-1), this.vertices[a].clone()
        .multiplyScalar(-1), this.vertices[c].clone()
        .multiplyScalar(-1)
      ]));
      this.faceVertexUvs[0].push([uvs[b], uvs[a], uvs[c]])
    }
  }
  if (inner_radius < 1) {
    for (i = 0; i < data.polygons.length; i++) {
      var polyWithHoles = data.polygons[i];
      for (var j = 0; j < polyWithHoles.length; j++) {
        var polygonOrHole = polyWithHoles[j];
        for (var k = 0; k < polygonOrHole.length; k++) {
          var a = polygonOrHole[k],
            b = polygonOrHole[(k + 1) % polygonOrHole.length];
          var va1 = this.vertices[a],
            vb1 = this.vertices[b];
          var va2 = this.vertices[n + a],
            vb2 = this.vertices[n + b];
          var normal;
          if (j < 1) {
            normal = vb1.clone()
              .sub(va1)
              .cross(va2.clone()
                .sub(va1))
              .normalize();
            this.faces.push(new THREE.Face3(a, b, n + a, [normal, normal, normal]));
            this.faceVertexUvs[0].push([uvs[a], uvs[b], uvs[a]]);
            if (inner_radius > 0) {
              this.faces.push(new THREE.Face3(b, n + b, n + a, [normal, normal, normal]));
              this.faceVertexUvs[0].push([uvs[b], uvs[b], uvs[a]])
            }
          } else {
            normal = va2.clone()
              .sub(va1)
              .cross(vb1.clone()
                .sub(va1))
              .normalize();
            this.faces.push(new THREE.Face3(b, a, n + a, [normal, normal, normal]));
            this.faceVertexUvs[0].push([uvs[b], uvs[a], uvs[a]]);
            if (inner_radius > 0) {
              this.faces.push(new THREE.Face3(b, n + a, n + b, [normal, normal, normal]));
              this.faceVertexUvs[0].push([uvs[b], uvs[a], uvs[b]])
            }
          }
        }
      }
    }
  }
  this.computeFaceNormals();
  this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1)
}
Tessalator3D.prototype = Object.create(THREE.Geometry.prototype);

module.exports = DAT;
