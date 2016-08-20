/**
 * Config constructor for dat.gui controls
 * @constructor
 */
productivitree.objects.TreeConfig = function() {

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
    this.growAmount = 0.23;
    this.sweepAmount = 0.01;
    this.maxRadius = 0.2;
    this.climbRate = 0.371;
    this.trunkKink = 0.093;
    this.treeSteps = 10;
    this.taperRate = 0.947;
    this.radiusFalloffRate = 0.73;
    this.twistRate = 3.02;
    this.trunkLength = 2.4;

    this.update = function() {
        treeContainer.createTree(this);
    };
};

/**
 *
 * @type {{createTree}}
 */
productivitree.objects.treeHandler = (function() {

    function createTree(config) {

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

        // setup uvsTwig
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


    return {
        createTree: createTree
    }

})();
