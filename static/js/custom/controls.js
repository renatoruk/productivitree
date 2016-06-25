// config constructor
productivitree.Config = function() {

    this.seed = 200;
    this.segments = 5;
    this.levels = 6;
    this.vMultiplier = 2.5;
    this.twigScale = 0.1;
    this.initalBranchLength = 0.5;
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
        createTree(control);
    };
};
