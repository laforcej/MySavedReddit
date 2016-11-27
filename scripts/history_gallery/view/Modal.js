var Modal = AbstractView.extend({
	
	_modal :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);
        
		$('body').bind({
			'onHideModal'          :function($e)                {scope.onHideModal();},
            'onShowModal'          :function($e)                {scope.onShowModal();},
			'onShowLinkInfo'       :function($e, $theID, $data) {scope.onShowModal();},
            'onHideLoadingMessage' :function($e)                {scope.onHideLoadingMessage();},
            'onShowLoadingMessage' :function($e, $msg)          {scope.onShowModal();},
            'onShowMenu'           :function($e)                {scope.onShowModal();},
            'onHideMenu'           :function($e)                {scope.onHideModal();},
		});
	},
		
	draw: function()
	{   
        var scope = this;
        
        this._modal = $('#modal');
	},
    
    enableButtons: function()
    {
        var scope = this;
        
        this._container.click(function() {
            scope._controller.modalClicked();
        });
    },
    
    onHideLoadingMessage: function()
    {
        this.onHideModal();
        this.enableButtons();
    },
    
	onShowModal: function()
	{
        $('body').addClass('stop-scrolling');
        $('body').bind('touchmove', function(e){e.preventDefault()});
        
        this._model.setModalOpen(true);
        this.onResize($(window).width(), $(window).height());
        
        this._modal.css('display', 'block');
        
        this._modal.stop().animate({
            'opacity': 0.7
        });
	},
    
	onHideModal: function()
	{
        var scope = this;
        
        $('body').removeClass('stop-scrolling');
        $('body').unbind('touchmove');
        
        this._model.setModalOpen(false);
        
        this._modal.stop().animate({
            'opacity': 0
        }, function(){
            scope._modal.css('display', 'none');
        });
	},
    
 	onResize: function($winWidth, $winHeight)
	{
        if(this._model.getModalOpen() == true) {
            //adjust height of modal
            var height = Math.max($winHeight, $(document).height());
            //var height = $winHeight;

            this._modal.css('height', height);
         }
	}
});