const test =document.querySelector('.des');





const width = test.offsetWidth-10;
const height = test.offsetHeight-10;
console.log(width,height)









var scene = new THREE.Scene();
var aspect = width / height;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height);
// document.body.appendChild( renderer.domElement );
test.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 5;

var render = function () {
requestAnimationFrame( render );
cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
renderer.render( scene, camera );
};

render();