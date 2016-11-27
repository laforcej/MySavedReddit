var Menu = AbstractView.extend({
    
    _menu     :null,
    _closeBtn :null,
    _saveBtn  :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);	
        
		$('body').bind({
            'onShowUserPreferences' :function($e) {scope.onShowUserPreferences();},
            'onSetUserPreferences'  :function($e) {scope.onSetUserPreferences();},
            'onShowMenu'            :function($e, $callback, $scope) {scope.onShowMenu($callback, $scope);},
            'onHideMenu'            :function($e, $callback, $scope) {scope.onHideMenu($callback, $scope);},
            'onHideModal'           :function($e) {scope.onHideMenu();},
		});
	},
		
	draw: function()
	{   
        var scope = this;
        
        this._closeBtn = $('#close-menu-btn');
        this._saveBtn = $('#save-btn');
        
        this._container.css({
            'left': -(this._container.width()),
        });        
        
        this.enableButtons();
	},
    
    enableButtons: function()
    {
        var scope = this;
        
        this._closeBtn.click(function(){
            scope._controller.hideMenu();    
            
        });
              
        //save button
        this._saveBtn.click(function($e){
           $e.preventDefault();
            
            var theScope = $('#dd-scope').val();
            var sortBy = $('#dd-sort-by').val();
            var filterBy = $('#dd-filter-by').val();
            
            var grouped
            if($('#chk-group-links').is(':checked')) {
                grouped = 1;  // checked
            } else {
                grouped = 0;
            }  
            
            var viewAsGallery
            if($('#chk-view-as-gallery').is(':checked')) {
                viewAsGallery = 1;  // checked
            } else {
                viewAsGallery = 0;
            }  
            
            scope._controller.setUserPreferences(theScope, sortBy, grouped, filterBy, viewAsGallery);
        });
    },
    
    onSetUserPreferences: function()
    {
        //set defaults
        var scope = this._model.getScope();
        var sortBy = this._model.getSortBy();
        var grouped = this._model.getGroupBySubreddit();
        var filterBy = this._model.getFilterBy();
        var viewAsGallery = this._model.getViewAsGallery();
        
        //sort by
        $('#dd-sort-by > option').each(function() {
            if(this.value == sortBy) {
                this.selected = true;   
            }
        });
        
        //scope
        $('#dd-scope > option').each(function() {
            if(this.value == scope) {
                this.selected = true;   
            }
        });
        
        //filter by
        console.log('Store prefs?:'+this._model.getStorePrefs());
        
        if(this._model.getStorePrefs() == false) {
            $('#dd-filter-by').prop('disabled', true);    
        } else {
            $('#dd-filter-by > option').each(function() {
                if(this.value == filterBy) {
                    this.selected = true;   
                }
            });
        }
        
        //grouped
        var val = grouped == 0 ? false : true;
        $('#chk-group-links').prop('checked', val);
        
        //view as gallery
        var val = viewAsGallery == 0 ? false : true;
        $('#chk-view-as-gallery').prop('checked', val);
    },
    
    onShowUserPreferences: function()
    {
        this.onOpen();  
    },
    
    onShowMenu: function($callback, $scope)
    {
        this._model.setUIBusy(true);
        
        this._container.css('display', 'block'); 
        
        this._container.stop().animate({
            left: 0    
        }, 300, function(){
            if($callback != undefined) {
                $callback($scope);    
            }
        });
    },
    
    onHideMenu: function($callback, $scope)
    {
        var scope = this;

        this._container.stop().animate({
            left: -(this._container.width())  
        }, 300, function(){
            scope._model.setUIBusy(false); 
            if($callback != undefined) {
                $callback($scope);    
            }
        });
        
    },  
});