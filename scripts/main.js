(function(){
    var controller = new Controller();
    controller.init();
    requestAnimationFrame(controller.animation.bind(controller));
    //document.addEventListener('click', controller.animation.bind(controller));
})();
