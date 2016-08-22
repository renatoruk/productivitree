/**
 *
 * @type {{addTreeToScene, getMorphTargetNames, getTrunkMesh, getTwigMesh}}
 */
productivitree.objects.treeHandler = (function() {


    /**
     * Number of morph steps
     * @type {number}
     */
    var animationSteps = 5;
    /**
     * Object containing array of geometries for creating morph targets
     */
    var morphTargetsConfig;
    /**
     * Array containing morph target names
     */
    var morphTargetNames;
    /**
     * Main mesh for tree creation
     */
    var trunkMesh;
    /**
     * Mesh for containing leaves
     */
    var twigMesh;


    /**
     * Creates tree with geometry and texture and adds it to the scene
     * @param startConfig - configuration for the initial tree properties
     * @param endConfig - configuration for the final tree properties
     */
    function addTreeToScene(startConfig, endConfig) {

        /**
         * Init morphTargetsConfig with object containing arrays of geometries
         * for generating morph targets
         * @type {Object}
         */
        morphTargetsConfig = generateMorphTargets(animationSteps, startConfig, endConfig);


        var tree = scene.getObjectByName('treeContainer');
        var twig = scene.getObjectByName('twig');
        var trunk = scene.getObjectByName('trunk');

        // check scence for duplicate
        if (tree) {
            scene.remove(tree);
        }

        if (twig) {
            scene.remove(twig);
        }

        if (trunk) {
            scene.remove(trunk);
        }

        // wrapper for trunk and leaves
        treeContainer = new THREE.Object3D();

        // initialize the tree
        // this was only for re-rendering tree after changing props
        // TODO: add this for debug mode
        // var treeGeometry = generateTreeGeometry(startConfig);

        var trunkGeom = morphTargetsConfig.trunkMorphArray[0];
        var leaveGeom = morphTargetsConfig.leaveMorphArray[0];


        var trunkMat = new THREE.MeshLambertMaterial({
            morphTargets: true
        });

        var barkTexture = new THREE.TextureLoader().load('static/textures/tree.jpg');

        barkTexture.wrapS = THREE.RepeatWrapping;
        barkTexture.wrapT = THREE.RepeatWrapping;
        trunkMat.map = barkTexture;
        trunkMat.doubleSided = true;
        trunkMat.transparent = true;

        trunkGeom.computeFaceNormals();
        leaveGeom.computeFaceNormals();
        trunkGeom.computeVertexNormals(true);
        leaveGeom.computeVertexNormals(true);


        trunkMesh = new THREE.Mesh(trunkGeom, trunkMat);
        trunkMesh.name = 'trunk';

        // generating morph targets
        morphTargetNames = generateMorphTargetNames(animationSteps);

        trunkMesh.morphTargetBase = -1;
        trunkMesh.morphTargetDictionary = {};
        trunkMesh.morphTargetInfluences = [];


        /**
         * Create material for leaves
         * ==========================
         * A material for non-shiny (Lambertian) surfaces, evaluated per vertex.
         * @type {THREE.MeshLambertMaterial}
         */
        var leaveMat = new THREE.MeshLambertMaterial({
            morphTargets: true
        });
        // Set color texture map. Default is null.
        leaveMat.map = new THREE.TextureLoader().load('static/textures/leaf.png');
        /**
         * Defines which of the face sides will be rendered - front, back or both.
         * Default is THREE.FrontSide. Other options are THREE.BackSide and THREE.DoubleSide.
         * @type {number}
         */
        leaveMat.side = THREE.DoubleSide;
        /**
         * Defines whether this material is transparent.
         * This has an effect on rendering as transparent objects need special treatment
         * and are rendered after non-transparent objects.
         * @type {boolean}
         */
        leaveMat.transparent = true;


        // TODO: create morph targets for twig mesh
        twigMesh = new THREE.Mesh(leaveGeom, leaveMat);
        twigMesh.name = 'twig';

        twigMesh.morphTargetBase = -1;
        twigMesh.morphTargetDictionary = {};
        twigMesh.morphTargetInfluences = [];


        // add morph dictionary and target influences to meshes
        morphTargetNames.forEach(function(name, index) {
            trunkMesh.morphTargetDictionary[name] = index;
            trunkMesh.morphTargetInfluences.push(0);
            twigMesh.morphTargetDictionary[name] = index;
            twigMesh.morphTargetInfluences.push(0);
        });



        addMorphTargetsToGeometry(
            trunkMesh,
            morphTargetsConfig.trunkMorphArray,
            morphTargetNames
        );

        addMorphTargetsToGeometry(
            twigMesh,
            morphTargetsConfig.leaveMorphArray,
            morphTargetNames
        );


        // createAnimation('mixer1', trunkMesh, 50, 'trunkGrowth');
        // createAnimation('mixer2', twigMesh, 50, 'leafGrowth');


        // add objects to container
        treeContainer.add(trunkMesh);
        treeContainer.add(twigMesh);

        // name the tree container
        treeContainer.name = 'treeContainer';

        scene.add(treeContainer);
    }


    /**
     *
     * @param config
     * @returns {{trunkGeom: THREE.Geometry, leaveGeom: THREE.Geometry}}
     */
    function generateTreeGeometry(config) {

        var myTree = new Tree({
            'seed': config.seed,
            'segments': config.segments,
            'levels': config.levels,
            'vMultiplier': config.vMultiplier,
            'twigScale': config.twigScale,
            'initalBranchLength': config.initalBranchLength,
            'lengthFalloffFactor': config.lengthFalloffFactor,
            'lengthFalloffPower': config.lengthFalloffPower,
            'clumpMax': config.clumpMax,
            'clumpMin': config.clumpMin,
            'branchFactor': config.branchFactor,
            'dropAmount': config.dropAmount,
            'growAmount': config.growAmount,
            'sweepAmount': config.sweepAmount,
            'maxRadius': config.maxRadius,
            'climbRate': config.climbRate,
            'trunkKink': config.trunkKink,
            'treeSteps': config.treeSteps,
            'taperRate': config.taperRate,
            'radiusFalloffRate': config.radiusFalloffRate,
            'twistRate': config.twistRate,
            'trunkLength': config.trunkLength
        });


        var trunkGeom = new THREE.Geometry();
        var leaveGeom = new THREE.Geometry();


        // convert the vertices
        myTree.verts.forEach(function(v) {
            trunkGeom.vertices.push(new THREE.Vector3(v[0], v[1], v[2]));
        });

        myTree.vertsTwig.forEach(function(v) {
            leaveGeom.vertices.push(new THREE.Vector3(v[0], v[1], v[2]));
        });

        // convert the faces
        myTree.faces.forEach(function(f) {
            trunkGeom.faces.push(new THREE.Face3(f[0], f[1], f[2]));
        });


        myTree.facesTwig.forEach(function(f) {
            leaveGeom.faces.push(new THREE.Face3(f[0], f[1], f[2]));
        });

        // setup uvsTwig
        myTree.facesTwig.forEach(function(f) {
            var uva = myTree.uvsTwig[f[0]];
            var uvb = myTree.uvsTwig[f[1]];
            var uvc = myTree.uvsTwig[f[2]];

            var vuva = new THREE.Vector2(uva[0], uva[1]);
            var vuvb = new THREE.Vector2(uvb[0], uvb[1]);
            var vuvc = new THREE.Vector2(uvc[0], uvc[1]);

            leaveGeom.faceVertexUvs[0].push([vuva, vuvb, vuvc]);
        });

        // setup uvsTwig
        myTree.faces.forEach(function(f) {
            var uva = myTree.UV[f[0]];
            var uvb = myTree.UV[f[1]];
            var uvc = myTree.UV[f[2]];

            var vuva = new THREE.Vector2(uva[0], uva[1]);
            var vuvb = new THREE.Vector2(uvb[0], uvb[1]);
            var vuvc = new THREE.Vector2(uvc[0], uvc[1]);

            trunkGeom.faceVertexUvs[0].push([vuva, vuvb, vuvc]);
        });


        return {
            trunkGeom: trunkGeom,
            leaveGeom: leaveGeom
        }
    }


    /**
     * Generates morph targets from generated tree geometries based
     * on the number of steps provided
     * @param steps {Number} - number of morph targets
     * @param startConfig {Object} - properties for the tree start structure
     * @param endConfig {Object} - properties for final tree structure
     * @returns {{trunkMorphArray: Array, leaveMorphArray: Array}}
     */
    function generateMorphTargets(steps, startConfig, endConfig) {
        /**
         * containers for geometries
         * @type {Array}
         */
        var trunkMorphArray = [];
        var leaveMorphArray = [];

        /**
         * Storing properties between two properties
         * @type {Array}
         */
        var unmatchedProperties = getUnmatchedObjectProps(startConfig, endConfig);

        /**
         * Storing step size for each modified property in morph
         * @type {Array}
         */
        var stepSizes = [];

        // iterating through each modified property and creating morph steps
        for (var propIndex = 0; propIndex < unmatchedProperties.length; propIndex++) {
            var interval = (endConfig[unmatchedProperties[propIndex]] - startConfig[unmatchedProperties[propIndex]]) / steps;
            stepSizes.push(interval);
        }


        // generate new geometry for each step
        for (var i = 0; i < steps; i++) {

            var morphObject = generateTreeGeometry(startConfig);

            trunkMorphArray.push(morphObject.trunkGeom);
            leaveMorphArray.push(morphObject.leaveGeom);

            for (var propIndex = 0; propIndex < unmatchedProperties.length; propIndex++) {
                startConfig[unmatchedProperties[propIndex]] += stepSizes[propIndex];
            }
        }

        return {
            trunkMorphArray: trunkMorphArray,
            leaveMorphArray: leaveMorphArray
        }
    }


    /**
     * Generates array of names for each morph target
     * @param steps - number of targets
     * @returns {Array}
     */
    function generateMorphTargetNames(steps) {
        var targetNames = [];
        for (var i = 0; i < steps; i++) {
            targetNames.push('morph_' + i);
        }
        return targetNames
    }


    /**
     * Returns array with morph target names
     * @returns {*}
     */
    function getMorphTargetNames() {
        return morphTargetNames
    }


    /**
     * Generate and add morph targets array to a mesh's geometry
     * @param mesh {Object} - Mesh to add morph targets to
     * @param referenceObjectsArray -
     * @param morphTargetNames
     */
    function addMorphTargetsToGeometry(mesh, referenceObjectsArray, morphTargetNames) {

        // iterate through array of geometries for copying vertices
        for (var i = 0; i < referenceObjectsArray.length; i++) {

            mesh.geometry.morphTargets.push({name: morphTargetNames[i]});
            mesh.geometry.morphTargets[i].vertices = [];

            for (var j = 0; j < referenceObjectsArray[i].vertices.length; j++) {

                mesh.geometry.morphTargets[i].vertices.push(referenceObjectsArray[i].vertices[j]);
            }
        }
    }


    /**
     * Creates diff between two objects (only first level)
     * @param firstObj
     * @param secondObj
     * @returns {Array}
     */
    function getUnmatchedObjectProps(firstObj, secondObj) {
        var unmatched = [];
        for (var prop in firstObj) {
            if (firstObj.hasOwnProperty(prop)) {
                if (firstObj[prop] !== secondObj[prop]) {
                    unmatched.push(prop);
                }
            }
        }
        return unmatched
    }


    /**
     * Get mesh for trunk
     * @returns {*}
     */
    function getTrunkMesh() {
        return trunkMesh
    }


    /**
     * Get mesh for trunk
     * @returns {*}
     */
    function getTwigMesh() {
        return twigMesh
    }


    return {
        addTreeToScene: addTreeToScene,
        getMorphTargetNames: getMorphTargetNames,
        getTrunkMesh: getTrunkMesh,
        getTwigMesh: getTwigMesh
    }

})();
