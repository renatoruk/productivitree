var productivitree = {};

var container = document.getElementById('container');

var camera,
    renderer,
    scene,
    controls,
    stats,
    treeContainer;

// config constructor
productivitree.Config = function() {

    this.seed = 262;
    this.segments = 6;
    this.levels = 5;
    this.vMultiplier = 2.36;
    this.twigScale = 0.1;
    this.initalBranchLength = 0.49;
    this.lengthFalloffFactor = 0.85;
    this.lengthFalloffPower = 0.99;
    this.clumpMax = 0.454;
    this.clumpMin = 0.404;
    this.branchFactor = 2.45;
    this.dropAmount = -0.1;
    this.growAmount = 0.235;
    this.sweepAmount = 0.01;
    this.maxRadius = 0.139;
    this.climbRate = 0.371;
    this.trunkKink = 0.093;
    this.treeSteps = 10;
    this.taperRate = 0.947;
    this.radiusFalloffRate = 0.73;
    this.twistRate = 3.02;
    this.trunkLength = 2.4;

    this.update = function() {
        buildTree(this);
    };
};




var configObj = new productivitree.Config();

/**
 * initialize the scene, camera and objects
 */
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

    // build the tree in scene
    buildTree(configObj);

    // show stats
    addStats();

    // show controls
    addControls(configObj);

    // add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    // set point to look at
    controls.target = new THREE.Vector3(0,5,0);

    // set automatic rotation
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    // disable below the ground
    controls.maxPolarAngle = Math.PI/2;
    controls.enablePan = false;


    productivitree.animation.initAnimations();

    // start rendering the scene
    render();
}



function buildTree(config) {


    var tree = scene.getObjectByName('treeContainer');
    var twig = scene.getObjectByName('twig');
    var trunk = scene.getObjectByName('trunk');

    if (tree) {
        scene.remove(tree);
    }

    if (twig) {
        scene.remove(twig);
    }

    if (trunk) {
        scene.remove(trunk);
    }

    var myTree = new Tree({
        "seed": config.seed,
        "segments": config.segments,
        "levels": config.levels,
        "vMultiplier": config.vMultiplier,
        "twigScale": config.twigScale,
        "initalBranchLength": config.initalBranchLength,
        "lengthFalloffFactor": config.lengthFalloffFactor,
        "lengthFalloffPower": config.lengthFalloffPower,
        "clumpMax": config.clumpMax,
        "clumpMin": config.clumpMin,
        "branchFactor": config.branchFactor,
        "dropAmount": config.dropAmount,
        "growAmount": config.growAmount,
        "sweepAmount": config.sweepAmount,
        "maxRadius": config.maxRadius,
        "climbRate": config.climbRate,
        "trunkKink": config.trunkKink,
        "treeSteps": config.treeSteps,
        "taperRate": config.taperRate,
        "radiusFalloffRate": config.radiusFalloffRate,
        "twistRate": config.twistRate,
        "trunkLength": config.trunkLength
    });

    treeContainer = new THREE.Object3D();
    var trunkGeom = new THREE.Geometry();
    var leaveGeom = new THREE.Geometry();

    // convert the vertices
    myTree.verts.forEach(function(v) {
        trunkGeom.vertices.push(new THREE.Vector3(v[0],v[1],v[2]));
    });

    myTree.vertsTwig.forEach(function(v) {
        leaveGeom.vertices.push(new THREE.Vector3(v[0],v[1],v[2]));
    });

    // convert the faces
    myTree.faces.forEach(function(f) {
        trunkGeom.faces.push(new THREE.Face3(f[0],f[1],f[2]));
    });


    myTree.facesTwig.forEach(function(f) {
        leaveGeom.faces.push(new THREE.Face3(f[0],f[1],f[2]));
    });

//    // setup uvsTwig
    myTree.facesTwig.forEach(function(f) {
        var uva = myTree.uvsTwig[f[0]];
        var uvb = myTree.uvsTwig[f[1]];
        var uvc = myTree.uvsTwig[f[2]];

        var vuva = new THREE.Vector2(uva[0],uva[1]);
        var vuvb = new THREE.Vector2(uvb[0],uvb[1]);
        var vuvc = new THREE.Vector2(uvc[0],uvc[1]);

        leaveGeom.faceVertexUvs[0].push([vuva, vuvb, vuvc]);
    });


    // setup uvsTwig
    myTree.faces.forEach(function(f) {
        var uva = myTree.UV[f[0]];
        var uvb = myTree.UV[f[1]];
        var uvc = myTree.UV[f[2]];

        var vuva = new THREE.Vector2(uva[0],uva[1]);
        var vuvb = new THREE.Vector2(uvb[0],uvb[1]);
        var vuvc = new THREE.Vector2(uvc[0],uvc[1]);

        trunkGeom.faceVertexUvs[0].push([vuva, vuvb, vuvc]);
    });

    var leaveMat = new THREE.MeshLambertMaterial();
    leaveMat.map = new THREE.TextureLoader().load('static/textures/leaf.png');
    leaveMat.doubleSided = true;
    leaveMat.transparent = true;


    var trunkMat = new THREE.MeshLambertMaterial();
    var barkTexture = new THREE.TextureLoader().load('static/textures/tree.jpg');
    barkTexture.wrapS = barkTexture.wrapT = THREE.RepeatWrapping;
    trunkMat.map = barkTexture;
    // trunkMat.doubleSided = true;
    // trunkMat.transparent = true;

    trunkGeom.computeFaceNormals();
    leaveGeom.computeFaceNormals();
    trunkGeom.computeVertexNormals(true);
    leaveGeom.computeVertexNormals(true);

    trunkMesh = new THREE.Mesh(trunkGeom, trunkMat);
    trunkMesh.name = 'trunk';

    var twigMesh = new THREE.Mesh(leaveGeom, leaveMat);
    twigMesh.name = 'twig';

    // add objects to container
    treeContainer.add(trunkMesh);
    treeContainer.add(twigMesh);

    // name the tree container
    treeContainer.name = 'treeContainer';

    scene.add(treeContainer);
}

/////////////////////////////////////////////////
///////////////// HELPERS ///////////////////////
/////////////////////////////////////////////////

// render every frame
function render() {
    renderer.render(scene, camera);
    stats.update(renderer);
    TWEEN.update();
    controls.update();

    requestAnimationFrame(render);
}

// add stats to window
function addStats() {
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);
}

function addControls(controlObject) {

    var gui = new dat.GUI();

    gui.add(controlObject, 'seed').onChange(function(value) {
        buildTree(configObj);
    });
    gui.add(controlObject, 'segments').onChange(function(value) {
        buildTree(configObj);
    });
    gui.add(controlObject, 'levels').onChange(function(value) {
        buildTree(configObj);
    });
    gui.add(controlObject, 'vMultiplier').onChange(function(value) {
        buildTree(configObj);
    });
    gui.add(controlObject, 'twigScale').onChange(function(value) {
        buildTree(configObj);
    });
    gui.add(controlObject, 'initalBranchLength').onChange(function(value) {
        buildTree(configObj);
    });
    gui.add(controlObject, 'lengthFalloffFactor');
    gui.add(controlObject, 'lengthFalloffPower');
    gui.add(controlObject, 'clumpMax');
    gui.add(controlObject, 'clumpMin');
    gui.add(controlObject, 'branchFactor');
    gui.add(controlObject, 'dropAmount');
    gui.add(controlObject, 'growAmount');
    gui.add(controlObject, 'sweepAmount');
    gui.add(controlObject, 'maxRadius');
    gui.add(controlObject, 'climbRate');
    gui.add(controlObject, 'trunkKink');
    gui.add(controlObject, 'trunkKink');
    gui.add(controlObject, 'treeSteps');
    gui.add(controlObject, 'taperRate');
    gui.add(controlObject, 'radiusFalloffRate');
    gui.add(controlObject, 'twistRate');
    gui.add(controlObject, 'radiusFalloffRate');
    gui.add(controlObject, 'trunkLength');
}

// window resize function
function resizeHandler() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


// main window functions
window.onload = init;
window.addEventListener('resize', resizeHandler, false);





