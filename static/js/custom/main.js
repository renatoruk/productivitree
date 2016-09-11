var productivitree = productivitree || {};

var container = document.getElementById('container');


var camera,
    renderer,
    scene,
    stats,
    treeContainer,
    prevTime,
    animationMixers = {};


// Initializing modules
productivitree.controls = productivitree.controls || {};
productivitree.animation = productivitree.animation || {};
productivitree.objects = productivitree.objects || {};
productivitree.ui = productivitree.ui || {};
productivitree.helpers = productivitree.helpers || {};
productivitree.customizer = productivitree.customizer || {};
productivitree.dom = productivitree.dom|| {};

// Initialize the scene, camera and objects
function init() {
    'use strict';

    // Speed up calls by creating local references
    var treeConfig = productivitree.config.tree;
    var animation = productivitree.animation;
    var treeHandler = productivitree.objects.treeHandler;
    var dom = productivitree.dom;

    // main input wrapper element
    var wrapper = document.querySelector('.js-wrap');


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




    // create morph animation from morph targets
    animation.morph.createMorphAnimation('trunkGrow', treeHandler.getTrunkMesh(), 5);
    animation.morph.createMorphAnimation('leaveGrow', treeHandler.getTwigMesh(), 5);


    // Add event listener to the button
    dom.clickHandler('.js-toggle-animation', function() {
            // 'all' triggers all animations
            animation.morph.playAnimation('all');
            dom.toggleText('.js-toggle-animation', 'Play animation', 'Pause animation');
        }, function() {
            animation.morph.pauseAnimation('all');
            dom.toggleText('.js-toggle-animation', 'Play animation', 'Pause animation');
        }
    );



    // Init mouse controls
    productivitree.controls.mouse.init();


    // Add event listener for screen resize
    window.addEventListener('resize', productivitree.helpers.adjustWindowResize, false);

    prevTime = Date.now();
    // Start rendering the scene
    render();

    // hide element after init
    productivitree.animation.fade.init(wrapper);
}


function initConfigurator() {

    // get text input element
    var nameInput = document.querySelector('.js-input-box');
    var initButton = document.querySelector('.js-init-tree');

    // init customizer
    var customizer = productivitree.customizer;
    var dom = productivitree.dom;
    var helpers = productivitree.helpers;

    var nameAsciiValues;
    var numValues;

    nameInput.addEventListener('keyup', function() {
        dom.enableElement(initButton, helpers.validateName(nameInput.value), 'btn--disabled');
    });


    initButton.addEventListener('click', function() {
        // Check if button is enabled
        if (!initButton.classList.contains('btn--disabled')) {
            // convert name characters to ASCII values
            nameAsciiValues = helpers.stringToAscii(nameInput.value);
            // divide the values for easier manipulation
            numValues = customizer.divideArrayElements(nameAsciiValues, 100);
            // create random values if there aren't enough
            numValues = customizer.fillWithRandomValues(numValues, 11);

            console.log(numValues);

            // change config with newly created values
            customizer.changeConfig(numValues);

            init();

        }
    });
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


// initialize the configurator on window load
window.onload = initConfigurator;





