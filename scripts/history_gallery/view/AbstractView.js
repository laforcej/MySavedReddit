var AbstractView = Base.extend({

	_container  :null,
	_data       :null,
	_model      :null,
	_controller :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this._container  = $container;
		this._model      = $model;
		this._controller = $controller;
		this._data       = $data;
		
		jQuery('body').bind({
			'onResize'    :function($e, $width, $height){scope.onResize($width, $height);},
            'onScrolling' :function($e){scope.onScrolling();},
            'onHide'      :function($e){scope.onHide();},
            'onShow'      :function($e){scope.onShow();},
            'onDestroy'   :function($e){scope.onDestroy();},
		});
			
		this.init();
	},
	
	update: function()
	{
	},
    
    getData: function()
    {
        return this._data;    
    },
	
	init: function()
	{
		this.draw();
	},
	
	draw: function()
	{
	},

	onShow: function()
	{
	},
	
	onHide: function()
	{
	},
	
	onDestroy: function()
	{
		jQuery('body').unbind({
			'onResize'    :function($e, $width, $height){scope.onResize($width, $height);},
            'onScrolling' :function($e){scope.onScrolling();},
            'onHide'      :function($e){scope.onHide();},
            'onShow'      :function($e){scope.onShow();},
            'onDestroy'   :function($e){scope.onDestroy();},
		});
	},
    
	onMove: function() 
	{
	},    
	
	onResize: function($e, $winWidth, $winHeight)
	{
	},
    
    onScrolling: function($e) 
    {
        
    }
});