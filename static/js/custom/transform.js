productivitree.transforms = function(element, type, transformTo) {

    if (type.toUpperCase() === 'SCALE' && typeof transformTo === 'undefined') {
        transformTo = {x: 0.1, y: 0.1, z: 0.1};
    }

    if (type.toUpperCase() === 'SCALE') {
        return {
            setScale: function() {
                element.scale.x = transformTo.x;
                element.scale.y = transformTo.y;
                element.scale.z = transformTo.z;
            }
        }
    } else {
        return {
            setRotate: function() {
                element.scale.x = transformTo.x;
                element.scale.y = transformTo.y;
                element.scale.z = transformTo.z;
            }
        }
    }
};