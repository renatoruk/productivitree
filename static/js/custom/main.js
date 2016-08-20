var productivitree = {};

var container = document.getElementById('container');


// TODO: minimize global scope
var camera,
    renderer,
    scene,
    stats,
    treeContainer;

// initializing modules
productivitree.controls = {};
productivitree.animation = {};
productivitree.objects = {};
productivitree.config = {};
productivitree.ui = {};
productivitree.helpers = {};

// initialize the scene, camera and objects
function init() {
    'use strict';

    /**
     * create the scene
     * @type {THREE.Scene}
     */
    scene = new THREE.Scene();

    /**
     * Creates perspective camera
     * @param fov
     * @param aspect
     * @param near, far -> near and far clipping plane; objects outside the range won't be rendered
     */
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    /**
     * WebGL renderer for maximum performance - needs fallbacks
     */
    renderer = new THREE.WebGLRenderer();

    // set pixel ratio for retina displays
    renderer.setPixelRatio(window.devicePixelRatio);

    /**
     * Setting the size of canvas
     * @param updateStyle -> false reduces resolution by half but maintains same css size
     */
    renderer.setSize(window.innerWidth, window.innerHeight);

    // add renderer to the container
    container.appendChild(renderer.domElement);

    // set camera position
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    // disabled because of orbitControls
    camera.lookAt(new THREE.Vector3(0,5,0));

    // add shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 150, 10);
    spotLight.shadow.camera.near = 20;
    spotLight.shadow.camera.far = 50;
    spotLight.castShadow = true;

    scene.add(spotLight);

    // lights are needed for displaying the mesh
    var pointLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(pointLight);

    // initialize config
    productivitree.config.tree = new productivitree.objects.TreeConfig();

    // create tree and add it to the scene
    productivitree.objects.treeHandler.createTree(productivitree.config.tree);

    // init stats
    productivitree.ui.stats.init();

    // show GUI controls
    productivitree.controls.gui.init(productivitree.config.tree);

    // init mouse controls
    productivitree.controls.mouse.init();

    productivitree.animation.initAnimations();

    // add event listener for screen resize
    window.addEventListener('resize', productivitree.helpers.adjustWindowResize, false);

    // start rendering the scene
    render();
}


// render every frame
function render() {
    renderer.render(scene, camera);
    stats.update(renderer);
    TWEEN.update();
    productivitree.controls.mouse.update();

    requestAnimationFrame(render);
}


// initialize the scene on window load
window.onload = init;





