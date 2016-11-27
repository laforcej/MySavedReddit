var ThumbView = AbstractLinkView.extend({
    _infoBtn   :null,
    _title     :null,
    _gradient  :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;

		this.inherit($container, $model, $controller, $data);
        
	},
		
	draw: function()
	{
        var theHTML = '';

        theHTML =   '<div id="' + this._theID + '" class="thumb-view">';
        theHTML +=      '<div class="thumb-bg"></div>';
        
        if(this._model.getURLIsImage(this._theID)) {
            theHTML += '<a class="thumb-img" href="' + this._model.getLinkURL(this._theID) + '" data-lightbox="' + this._theID + '" data-title="' + this._model.getLinkTitle(this._theID) + '"title="' + this._model.getLinkTitle(this._theID) + '"></a>'; 
        } else {
            theHTML += '<a class="thumb-img" href="#" "title="' + this._model.getLinkTitle(this._theID) + '"></a>';
        }
        
        theHTML +=      '<div class="thumb-gradient"></div>';
        theHTML +=      '<div class="unsave-btn" title="Click here to unsave the link"></div>';
        theHTML +=      '<div class="info-btn" title="Click here to display information about the link"></div>';
        theHTML +=      '<div class="link-title-bg"></div>';
        theHTML +=      '<div class="link-title">' + this._model.getLinkTitle(this._theID) + '</div>';               
        theHTML +=  '</div>';
		
		this._container.append(theHTML);
        
        this._linkContainer = $('#' + this._theID);
        this._infoBtn = this._linkContainer.find('.info-btn');
        this._title = this._linkContainer.find('.link-title');
        this._gradient = this._linkContainer.find('.thumb-gradient');
        
        this.inherit();
	},
    
    enableButtons: function()
    {
        var scope = this;
        
        this._infoBtn.click(function($e) {
            $e.stopPropagation();
            scope._controller.showLinkInfo(scope._theID, scope._imgDiv.css('background-size'));
        });
        
        this.inherit();
    },
    
    onShowThumb: function($ratio) 
    {
        var speed = 500;
        
        this._infoBtn.animate({
            opacity: 1
        }, speed, function() {
            // Animation complete.
        });  
        
        this._unsaveBtn.animate({
            opacity: 1
        }, speed, function() {
            // Animation complete.
        }); 
        
        this._title.animate({
            opacity: 1
        }, speed, function() {
            // Animation complete.
        }); 
        
        this._gradient.animate({
            opacity: 1
        }, speed, function() {
            // Animation complete.
        });         
        
        this.inherit($ratio);
    },
    
    onDestroy: function()
    {
        this.inherit();
            
        this._linkContainer.unbind('click');
        this._infoBtn.unbind('click'); 
    }
});