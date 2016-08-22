/**
 *
 * @param animationMixer
 * @param mesh
 * @param duration
 * @param animationName
 */
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
     */
    function createMorphAnimation(animationName, mesh) {
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
    }


    /**
     *
     * @param animationName {String}
     * @param duration {Number} - in seconds
     */
    function playAnimation(animationName, duration) {

        // play all animations synchronously
        if (animationName === 'all') {
            for (var anim in animations) {
                if (animations.hasOwnProperty(anim)) {
                    animationMixers[anim].clipAction(animations[anim].clip).setDuration(duration).play();
                }
            }
            return
        }

        // play morph animation clip
        animationMixers[animationName].clipAction(animations[animationName].clip).setDuration(duration).play();
    }


    return {
        createMorphAnimation: createMorphAnimation,
        playAnimation: playAnimation
    }

})();


/**
 * Add animation trigger to an element
 * @type {{addPlayListener}}
 */
productivitree.animation.dom = (function() {

    var playButton;
    var playAnimation = productivitree.animation.morph.playAnimation;


    /**
     * Get element with selector
     * @param selector
     * @returns {Element}
     */
    function selectElement(selector) {
        return document.querySelector(selector);
    }


    /**
     *
     * @param selector - querySelector
     * @param animationName {String} - animation to trigger
     * @param duration - in seconds
     */
    function addPlayListener(selector, animationName, duration) {
        playButton = selectElement(selector);
        playButton.addEventListener('click', function() {
            playAnimation(animationName, duration);
        });
    }

    return {
        addPlayListener: addPlayListener
    }

})();



