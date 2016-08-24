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
    function playAnimation(animationName, duration) {

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
    function clickHandler(selector, callback, secondCallback) {
        // playButton = selectElement(selector);

        // used for toggling callbacks
        if (secondCallback) {
            var toggle = true;
        }

        selectElement(selector).addEventListener('click', function() {
            if (secondCallback) {
                if (toggle) {
                    callback();
                    toggle = !toggle;
                } else {
                    secondCallback();
                }
            } else {
                callback();
            }
        });
    }


    /**
     *
     * @param selector {String}
     * @param mainText {String} - first string to test
     * @param toggleText {String} - toggle string
     */
    function toggleText(selector, mainText, toggleText) {
        var el = selectElement(selector);
        if (el.innerHTML === mainText) {
            el.innerHTML = toggleText;
        } else {
            el.innerHTML = mainText;
        }
    }


    return {
        clickHandler: clickHandler,
        toggleText: toggleText
    }

})();



