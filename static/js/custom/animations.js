productivitree.animation.morph = (function() {

    /**
     * Container for animations
     * @type {Object}
     */
    var animations = {};


    /**
     *
     * @param animationName {String} - assigning a name for the animation
     * @param mesh {Object} - object to assign mix animation
     * @param duration {Number} - in seconds
     */
    function createMorphAnimation(animationName, mesh, duration) {
        /**
         * Create animation mixer for the animation
         * @type {THREE.AnimationMixer}
         */
        animationMixers[animationName] = new THREE.AnimationMixer(mesh);
        /**
         * Assign object to the mixer property
         * @type {{}}
         */
        animations[animationName] = {};
        // Create clip for the mixer to animate
        animations[animationName].clip = THREE.AnimationClip.CreateFromMorphTargetSequence(
            animationName,
            mesh.geometry.morphTargets,
            60
        );
        animationMixers[animationName].clipAction(animations[animationName].clip).setDuration(duration);
    }


    /**
     *
     * @param animationName {String}
     */
    function playAnimation(animationName) {

        // play all animations synchronously
        if (animationName === 'all') {
            for (var anim in animations) {
                if (animations.hasOwnProperty(anim)) {
                    animationMixers[anim]._actions[0].play();
                }
            }
            return
        }

        // play morph animation clip
        animationMixers[animationName]._actions[0].play();
    }


    /**
     *
     * @param animationName {String}
     */
    function pauseAnimation(animationName) {

        // pause all animations synchronously
        if (animationName === 'all') {
            for (var anim in animations) {
                if (animations.hasOwnProperty(anim)) {
                    var paused = animationMixers[anim]._actions[0].paused;
                    animationMixers[anim]._actions[0].paused = !paused;
                }
            }
            return
        }

        // pause morph animation clip
        var paused = animationMixers[animationName]._actions[0].paused;
        animationMixers[animationName]._actions[0].paused = !paused;
    }



    return {
        createMorphAnimation: createMorphAnimation,
        playAnimation: playAnimation,
        pauseAnimation: pauseAnimation
    }

})();

productivitree.animation.fade = (function() {


    /**
     * Hide DOM element
     * @param element
     */
    function init(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 12);
    }

    return {
        init: init
    }

})();
