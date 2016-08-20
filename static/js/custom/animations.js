
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

    var scale = {
        initial: {x: 0.1, y: 0.1, z: 0.1},
        target: {x: 1, y: 1, z: 1}
    };

    tween.scale = new TWEEN.Tween(scale.initial)
    // .delay(2000)
        .to(scale.target, 2000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(function() {
            treeContainer.scale.x = scale.initial.x;
            treeContainer.scale.y = scale.initial.y;
            treeContainer.scale.z = scale.initial.z;
            updateScaleRecursive(treeContainer);
        });


    // tween.rotate = new TWEEN.Tween(tree.rotation)
    //     .delay(2000)
    //     .to({ z: (treeRotGoal+360)* Math.PI / 180}, 2000)
    //     .easing(TWEEN.Easing.Quartic.EaseOut);

    // tween.scale.start();
};


// scale tween update
function scaleTweenUpdate(el) {
    updateScaleRecursive(el);
}

// recursivly update all branch childs
function updateScaleRecursive(child) {
    for (var c = 0; c < child.children.length; c++) {
        updateScaleRecursive(child.children[c]);
        child.children[c].updateMatrix();
        child.children[c].geometry.applyMatrix(child.children[c].matrix);
        child.children[c].matrix.identity();
        child.children[c].geometry.vertices.scale = child.scale;
        child.children[c].geometry.verticesNeedUpdate = true;
    }
}


// DOM handling

productivitree.animation.eventHandlers = (function() {

    var _play_button = document.querySelector('.js-play-animation');

    function addPlayListener() {
        _play_button.addEventListener('click', function() {
            productivitree.animation.tweens.scale.start();
        });
    }

    return {
        addPlayListener: addPlayListener
    }

})();


(function() {
    productivitree.animation.eventHandlers.addPlayListener();
})();