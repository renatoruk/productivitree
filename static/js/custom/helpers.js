productivitree.helpers = (function(){

    function adjustWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function validateName(name) {
        return (/^[A-Za-z ]+$/.test(name) && name.length > 2);
    }


    function stringToAscii(string) {
        var ascii = [];
        if (string.length > 0) {
            for (var i = 0; i < string.length; i++) {
                var c = string.charCodeAt(i);
                ascii.push(c);
            }
        }
        return(ascii);
    }


    return {
        adjustWindowResize: adjustWindowResize,
        validateName: validateName,
        stringToAscii: stringToAscii
    }

})();

