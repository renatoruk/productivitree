productivitree.controls.gui = (function() {

    function initConfigurator(controlObject) {

        var gui = new dat.GUI();

        gui.add(controlObject, 'seed').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'segments').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'levels').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'vMultiplier').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'twigScale').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'initalBranchLength').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'lengthFalloffFactor').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'lengthFalloffPower').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'clumpMax').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'clumpMin').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'branchFactor').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'dropAmount').min(-0.5).max(0.5).onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'growAmount').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'sweepAmount').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'maxRadius').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'climbRate').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'trunkKink').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'treeSteps').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'taperRate').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'radiusFalloffRate').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'twistRate').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
        gui.add(controlObject, 'trunkLength').onChange(function() {
            productivitree.objects.treeHandler.addTreeToScene(controlObject);
        });
    }


    /**
     * Initialize GUI controls for morph targets on a mesh
     * @param morphTargetNames {Array} - Array of names for individual morph targets
     * @param mesh {Object} - Model to add controls to
     */
    function initMorphControl(morphTargetNames, mesh) {

        /**
         * Track state of morph target influence
         * @type {{}}
         */
        var config = {};

        // Create gui in window
        var gui = new dat.GUI();

        morphTargetNames.forEach(function(name, index) {

            // Initialize each influence with zero value
            config[name] = 0.0;

            gui.add(config, morphTargetNames[index], 0, 1).step(0.01).listen().onChange(function(influence) {
                mesh.morphTargetInfluences[index] = influence;
            });

        });
    }


    return {
        initConfigurator: initConfigurator,
        initMorphControl: initMorphControl
    }

})();


productivitree.controls.mouse = (function() {

    var controls;

    function init() {
        // add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // add smoothnes to the camera rotation
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;

        controls.enableZoom = false;

        // set point to look at
        controls.target = new THREE.Vector3(0, 5, 0);

        // set automatic rotation
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.3;

        // disable angle below the ground
        controls.maxPolarAngle = Math.PI / 2;
        controls.enablePan = false;
    }

    function update() {
        controls.update()
    }

    return {
        init: init,
        update: update
    }

})();