var _model;
var _controller;

$(document).ready(function(){
    _model      = new Model();
    _controller = new Controller($('#content'), _model);
    
    $(window).resize(function() {
       $('body').trigger('onResize', [$(window).width(), $(window).height()]);   
    });
    
    $(window).scroll(function() {
        $('body').trigger('onScrolling', []); 
    });
});