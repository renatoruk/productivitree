productivitree.helpers = (function(){

    function adjustWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return {
        adjustWindowResize: adjustWindowResize
    }

})();

