var productivitree = productivitree || {};

var container = document.getElementById('container');


// TODO: minimize global scope
var camera,
    renderer,
    scene,
    stats,
    treeContainer,
    prevTime,
    animationMixers = {};


// Initializing modules
productivitree.controls = {};
productivitree.animation = {};
productivitree.objects = {};
productivitree.ui = {};
productivitree.helpers = {};

// Initialize the scene, camera and objects
function init() {
    'use strict';

    // Speed up calls by creating local references
    var treeConfig = productivitree.config.tree;
    var animation = productivitree.animation;
    var treeHandler = productivitree.objects.treeHandler;

    /**
     * Create the scene
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

    // Set pixel ratio for retina displays
    renderer.setPixelRatio(window.devicePixelRatio);

    /**
     * Setting the size of canvas
     * @param updateStyle -> false reduces resolution by half but maintains same css size
     */
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add renderer to the container
    container.appendChild(renderer.domElement);

    // Set camera position
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    // Disabled because of orbitControls
    camera.lookAt(new THREE.Vector3(0, 5, 0));

    // Add shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 150, 10);
    spotLight.shadow.camera.near = 20;
    spotLight.shadow.camera.far = 50;
    spotLight.castShadow = true;

    scene.add(spotLight);

    // Lights are needed for displaying the mesh
    var pointLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(pointLight);

    // Create tree and add it to the scene
    treeHandler.addTreeToScene(treeConfig.start, treeConfig.end);

    // Init stats
    productivitree.ui.stats.init();



    // TODO: make it work for debug mode
    // Init GUI controls for configurator
    // productivitree.controls.gui.initConfigurator(productivitree.config.tree);


    // init GUI controls for morphing
    // productivitree.controls.gui.initMorphControl(
    //     treeHandler.getMorphTargetNames(),
    //     treeHandler.getTrunkMesh()
    // );

    // productivitree.controls.gui.initMorphControl(
    //     treeHandler.getMorphTargetNames(),
    //     treeHandler.getTwigMesh()
    // );



    animation.morph.createMorphAnimation('trunkGrow', treeHandler.getTrunkMesh());
    animation.morph.createMorphAnimation('leaveGrow', treeHandler.getTwigMesh());

    // animation.morph.playAnimation('trunkGrow', 60);
    // animation.morph.playAnimation('leaveGrow', 60);


    /**
     * Add event listener to the button
     * Play all animations on click
     */
    animation.dom.addPlayListener('.js-play-animation', 'all', 60);


    // Init mouse controls
    productivitree.controls.mouse.init();


    // Add event listener for screen resize
    window.addEventListener('resize', productivitree.helpers.adjustWindowResize, false);

    prevTime = Date.now();
    // Start rendering the scene
    render();
}


function render() {
    renderer.render(scene, camera);
    stats.update(renderer);
    TWEEN.update();
    productivitree.controls.mouse.update();

    var time = Date.now();

    animationMixers['trunkGrow'].update((time - prevTime) * 0.001);
    animationMixers['leaveGrow'].update((time - prevTime) * 0.001);

    prevTime = time;

    requestAnimationFrame(render);
}


// initialize the scene on window load
window.onload = init;





