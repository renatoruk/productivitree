productivitree.customizer = (function() {

    function divideArrayElements(array, divisor) {
        return array.map(function(el) {
            return el / divisor;
        });
    }

    /**
     * Fill array with random values
     * @param array - array to fill
     * @param maxLength - max array length to create
     */
    function fillWithRandomValues(array, maxLength) {
        for (var i = 0; i < maxLength; i++) {
            if (typeof array[i] === 'undefined') {
                array[i] = Math.random() * 100;
            }
        }

        return array;
    }



    function changeConfig(values) {
        // range 1 - 1.5
        //productivitree.config.tree.end.vMultiplier = limitRange(values[0], 1, 1.5);
        // range 0.05 - 0.1
        productivitree.config.tree.end.twigScale = limitRange(values[1], 0.05, 0.1);
        // range 0.3 - 1
        productivitree.config.tree.end.initalBranchLength = limitRange(values[2], 0.3, 2);
        // range 1 - 2.5
        //productivitree.config.tree.end.branchFactor = limitRange(values[3], 1, 2.5);
        // range 0 - 2 (reversed) - the actual is about 0 - 0.5
        //productivitree.config.tree.end.growAmount = limitRange(values[5], 0.7, 0.8);
        // range 0.1 - 0.5
        productivitree.config.tree.end.climbRate = limitRange(values[6], 0.1, 0.6);
        // range 0.1 - 0.3
        //productivitree.config.tree.end.trunkKink = limitRange(values[7], 0.1, 0.3);
         //range 0.8 - 0.9
        //productivitree.config.tree.end.taperRate = limitRange(values[8], 0.4, 0.8);
        // range 0.75 - 0.65 (reversed)
        productivitree.config.tree.end.radiusFalloffRate = limitRange(values[9], 0.5, 0.65);
        // range 1.2 - 2.5
        productivitree.config.tree.end.trunkLength = limitRange(values[10] * 2.5, 1.5, 2.5);
    }


    function limitRange(number, low, high) {
        return Math.min(Math.max(parseFloat(number), low), high);
    }



    return {
        divideArrayElements: divideArrayElements,
        changeConfig: changeConfig,
        fillWithRandomValues: fillWithRandomValues
    }

})();
