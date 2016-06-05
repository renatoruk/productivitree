var container = document.querySelector('#container');

var scene = new THREE.Scene();



/**
    Creates perspective camera
    @param fov
    @param aspect
    @param near, far -> near and far clipping plane; objects outside the range won't be rendered
 */
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

/**
    WebGL renderer for maximum performance - needs fallbacks
 */
var renderer = new THREE.WebGLRenderer();

/**
    Setting the size of canvas
    @param updateStyle -> false reduces resolution by half but maintains same css size
 */
renderer.setSize(window.innerWidth, window.innerHeight, false);

container.appendChild(renderer.domElement);


var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 5;

/**
    lights are needed for displaying the mesh
 */
var pointLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight);



function render() {
    requestAnimationFrame( render );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}

render();






