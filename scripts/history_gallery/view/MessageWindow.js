var MessageWindow = AbstractView.extend({
	
	_type             :null,
    _msgWindow        :null,
    _loadingMsg       :null,
    _infoThumb        :null,
    _infoDetails      :null,
    _closeBtn         :null,
    _msgWindowContent :null,
    _ratingScale      :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);	
        
		$('body').bind({
			'onShowLinkInfo'         :function($e, $theID, $data, $thumbSize) {scope.onShowLinkInfo($theID, $data, $thumbSize);},
            'onHideLoadingMessage'   :function($e)                            {scope.onHideLoadingMessage();},
            'onShowLoadingMessage'   :function($e, $msg)                      {scope.onShowLoadingMessage($msg);},
            'onUpdateLoadingMessage' :function($e, $msg)                      {scope.onUpdateLoadingMessage($msg);},
            'onShowUserPreferences'  :function($e)                            {scope.onShowUserPreferences();},
            'onHideModal'            :function($e)                            {scope.onHideMessageWindow();},
		});
	},
		
	draw: function()
	{   
        var scope = this;
        
        this._msgWindow = $('#message-window');
        this._closeBtn = $('#close-btn');
        this._msgWindowContent = $('#message-window-content');
        this._msgWindowContent.append('<div id="loading-message"></div>');
        this._loadingMsg = $("#loading-message");
	},
    
    enableButtons: function()
    {
        var scope = this;
        
        this._closeBtn.click(function() {
            $('body').trigger('onHideModal', []); 
            scope.onHideMessageWindow();    
        });
    },
    
    onShowLoadingMessage: function($msg)
    {
        this._loadingMsg.html($msg);   
        this.onShowMessageWindow();
    },
    
    onUpdateLoadingMessage: function($msg)
    {
        this._loadingMsg.html($msg);   
    },
    
    onHideLoadingMessage: function()
    {
        this.onHideMessageWindow();
        this._loadingMsg.remove();
        this._msgWindow.removeClass('loading');
        this._msgWindow.css('background-image', 'none');
        this._msgWindow.css('background-color', '#2b2b2b;');
        this._msgWindow.css('opacity', 0);
        this._closeBtn.css('display', 'block');
        
        this.enableButtons();
    },    
    
    onShowLinkInfo: function($theID, $data, $thumbSize)
    {
        var theHTML = '';

        theHTML +=  '<div id="info-thumb"></div>';
        theHTML +=  '<div id="info-details">';
        theHTML +=      '<div class="title">' + $data.title + '</div>';
        theHTML +=      '<div class="view-comments">Comments: <a href="http://www.reddit.com' + $data.permalink + '" target="_blank" title="Click to view comments on reddit.com">r/' + $data.subreddit + '</a></div>';    
        theHTML +=      '<div class="link-rating" title="Click to rate this link"></div>';
        theHTML += '</div>';
        

        this._msgWindowContent.append(theHTML);

        this._infoThumb = $('#info-thumb');
        this._infoThumb.css({
            'background-image': 'url(' + $data.thumb + ')',
            'background-size': $thumbSize 
        });
        
        this._ratingScale = new RatingScale(this._msgWindowContent.find('.link-rating'), this._model, this._controller, {id:$theID, linkID:$data.id, rating:$data.rating});
            
        this.onShowMessageWindow();
    },
	
	onShow: function()
	{

	},
	
	onHideMessageWindow: function()
	{
        var scope = this;
        
        this._msgWindow.stop().animate({
            'opacity': 0
        }, function(){
            scope._msgWindow.css({
                'display': "none",
                'top': 0,
                'left': 0,
            }); 
            scope._msgWindowContent.empty();
        });
	},
	
	onShowMessageWindow: function($type, $msg)
	{   
        if(!this._msgWindow.hasClass('loading')) {
            
            this._msgWindow.css('display', 'block');
            
            var height = this._msgWindowContent.height();

            this._msgWindow.css('height', (height + 40));
            
            var top = (this._msgWindow.height() - this._msgWindowContent.height()) / 2;
            
            this._msgWindowContent.css('top', top);
        } else {
            this._msgWindow.css('display', 'block');
        }
        
        this.onResize($(window).width(), $(window).height());
        
        this._msgWindow.stop().animate({
            'opacity': 1
        });
	},
	
    onCenterWindow: function($winWidth, $winHeight)
    {
        var top = document.body.scrollTop;
        this._msgWindow.css({
            left: ($winWidth - this._msgWindow.width())/2,
            top: top + ($winHeight - this._msgWindow.height())/2
        });
    },
    
	onResize: function($winWidth, $winHeight)
	{
        if(!this._msgWindow.hasClass('loading')) {
            //if($winWidth <= 760) {
            //    this._msgWindow.css({
            //        width: $winWidth,
            //        height: $winHeight
            //    });
            //}
        }
        this.onCenterWindow($winWidth, $winHeight);
	}
});