/**
 * Various dom handler functions
 * @type {{clickHandler, toggleText}}
 */
productivitree.dom = (function() {


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
     * @param callback {Function}
     * @param secondCallback {Function}
     */
    function clickHandler(selector, callback, secondCallback) {

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
     * Toggles text in an element
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


    /**
     * Enables or disables element based on passed css class
     * @param el
     * @param enabled
     * @param cssClass
     */
    function enableElement(el, enabled, cssClass) {
        if (enabled) {
            el.classList.remove(cssClass);
        } else {
            el.classList.add(cssClass);
        }
    }



    return {
        clickHandler: clickHandler,
        toggleText: toggleText,
        enableElement: enableElement
    }

})();



