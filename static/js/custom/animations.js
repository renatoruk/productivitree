productivitree.animation = {};

productivitree.animation.tweens = function() {
    return {
        scale: {},
        scaleReverse: {},
        rotation: {},
        rotateReverse: {}
    }
}();

productivitree.animation.initAnimations = function() {
    // set namespace
    var tween = productivitree.animation.tweens;
    
    tween.scale = new TWEEN.Tween(trunkMesh.scale)
        .delay(2000)
        .to({x: 0.95, y: 0.95, z: 0.95}, 2000)
        .easing(TWEEN.Easing.Sinusoidal.EaseInOut)
        .onUpdate(scaleTweenUpdate(trunkMesh));

    // tween.rotate = new TWEEN.Tween(tree.rotation)
    //     .delay(2000)
    //     .to({ z: (treeRotGoal+360)* Math.PI / 180}, 2000)
    //     .easing(TWEEN.Easing.Quartic.EaseOut);
};


//scale tween update
function scaleTweenUpdate(el, event) {
    updateScaleRecursive(el);
}

//recursivly update all branch childs
function updateScaleRecursive(child) {
    for ( var c = 0; c < child.children.length; c++ ) {
        updateScaleRecursive( child.children[ c ] );
        child.children[ c ].scale = child.scale;
    }
}