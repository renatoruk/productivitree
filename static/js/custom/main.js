var productivitree = {};

var container = document.getElementById('container');

// TODO: change variable names
var camera,
    renderer,
    scene,
    controls,
    stats,
    treeContainer,
    mesh,
    mixer,
    testCube;


// config constructor
productivitree.TreeConfig = function() {

    this.seed = 400;
    this.segments = 6;
    this.levels = 5;
    this.vMultiplier = 0.6;
    this.twigScale = 0.1;
    this.initalBranchLength = 1;
    this.lengthFalloffFactor = 0.8;
    this.lengthFalloffPower = 0.9;
    this.clumpMax = 0.45;
    this.clumpMin = 0.4;
    this.branchFactor = 2.5;
    this.dropAmount = -0.1;
    this.growAmount = 0.35;
    this.sweepAmount = 0.025;
    this.maxRadius = 0.09;
    this.climbRate = 0.33;
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

productivitree.CubeConfig = function() {
    this.mt_1 = 0.01;


    this.animate = false;
};




var treeConfig = new productivitree.TreeConfig();
var cubeConfig = new productivitree.CubeConfig();

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
    camera.position.z = 10;
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
    buildTree(treeConfig);

    // show stats
    addStats();

    // show controls
    addControls(treeConfig, cubeConfig);

    // add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // set point to look at
    controls.target = new THREE.Vector3(0,5,0);

    // set automatic rotation
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.3;

    // disable below the ground
    controls.maxPolarAngle = Math.PI/2;
    controls.enablePan = false;


    productivitree.animation.initAnimations();

    // start rendering the scene

    var loader = new THREE.JSONLoader();
    loader.load('static/models/morph_cube.json', function (geometry) {

        var mat = new THREE.MeshLambertMaterial({
            color: 0xff3333,
            morphTargets: true
        });

        mesh = new THREE.Mesh(geometry, mat);
        mesh.castShadow = true;
        scene.add(mesh);

        console.log(mesh);

        mixer = new THREE.AnimationMixer(mesh);
        var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('animate', geometry.morphTargets, 30);

        // TODO: add play / stop functionality
        // mixer.clipAction( clip ).setDuration( 1 ).play();

        // call the render function
        render();
    });





    var testCubeMat = new THREE.MeshLambertMaterial({
        color: 0xff3333,
        morphTargets: true
    });

    testCube = new THREE.Mesh(
        new THREE.CubeGeometry(2, 2, 2),
        testCubeMat
    );

    testCube.position.set(-4, 0, 0);
    testCube.morphTargetBase = -1;
    testCube.morphTargetDictionary = {
        animation_000000: 0,
        animation_000001: 1
    };

    testCube.morphTargetInfluences = [
        0,
        0
    ];

    testCube.geometry.morphTargets = [
        {
            name: "animation_000000",
            vertices: [
                new THREE.Vector3(-1, -1, 1),
                new THREE.Vector3(-1, 1, 1),
                new THREE.Vector3(-1, -1, -1),
                new THREE.Vector3(-1, 1, -1),
                new THREE.Vector3(1, -1, 1),
                new THREE.Vector3(1, 1, 1),
                new THREE.Vector3(1, -1, -1),
                new THREE.Vector3(1, 1, -1)
            ]
        },
        {
            name: "animation_000001",
            vertices: [
                new THREE.Vector3(-1, -1, 1),
                new THREE.Vector3(-1.21944, 1, 1.86095),
                new THREE.Vector3(-1, -1, -1),
                new THREE.Vector3(-1, 1, -1),
                new THREE.Vector3(1, -1, 1),
                new THREE.Vector3(1, 1, -1),
                new THREE.Vector3(1, -1, -1),
                new THREE.Vector3(1.56556, 1, -1.26743)
            ]
        }
    ];




    console.log(testCube);

    scene.add(testCube);
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

var prevTime = Date.now();

// render every frame
function render() {
    renderer.render(scene, camera);
    stats.update(renderer);
    TWEEN.update();
    controls.update();


    if ( mixer ) {

        var time = Date.now();

        mixer.update( ( time - prevTime ) * 0.001 );

        prevTime = time;

    }

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

function addControls(treeControlObject, cubeControl) {

    var gui = new dat.GUI();

    gui.add(treeControlObject, 'seed').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'segments').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'levels').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'vMultiplier').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'twigScale').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'initalBranchLength').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'lengthFalloffFactor').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'lengthFalloffPower').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'clumpMax').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'clumpMin').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'branchFactor').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'dropAmount').min(-0.5).max(0.5).onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'growAmount').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'sweepAmount').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'maxRadius').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'climbRate').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'trunkKink').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'treeSteps').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'taperRate').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'radiusFalloffRate').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'twistRate').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'radiusFalloffRate').onChange(function() {
        buildTree(treeConfig);
    });
    gui.add(treeControlObject, 'trunkLength').onChange(function() {
        buildTree(treeConfig);
    });

    // cube morph targets
    gui.add(cubeControl, 'mt_1', 0, 1).step(0.01).listen().onChange(function (a) {
        testCube.morphTargetInfluences[1] = a;
    });

    // TODO: animate control
    // gui.add(cubeControl, 'animate');
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





