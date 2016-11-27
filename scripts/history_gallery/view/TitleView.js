var TitleView = AbstractLinkView.extend({
    _thumb       :null,
    _title       :null,
    _ratingScale :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;

		this.inherit($container, $model, $controller, $data);
	},
		
	draw: function()
	{
        var theHTML = '';
        theHTML =   '<div id="' + this._theID + '" class="title-view">';
        theHTML +=      '<table width="90%"><tr>';
        theHTML +=          '<td valign="top" style="width:70px;">';
        theHTML +=              '<div class="thumb">';
                                if(this._model.getURLIsImage(this._theID)) {
                                    theHTML += '<a class="thumb-img" href="' + this._model.getLinkURL(this._theID) + '" data-lightbox="' + this._theID + '" data-title="' + this._model.getLinkTitle(this._theID) + '"title="' + this._model.getLinkTitle(this._theID) + '"></a>'; 
                                } else {
                                    theHTML += '<a class="thumb-img" href="#" "title="' + this._model.getLinkTitle(this._theID) + '"></a>';
                                }
        theHTML +=              '</div>';
        theHTML +=          '</td>';
        theHTML +=          '<td valign="top">';        
        theHTML +=              '<div class="link-title">' + this._model.getLinkTitle(this._theID) + '</div>';
        theHTML +=              '<div class="action-items"><div class="link-rating" title="Click to rate this link"></div><a href="#" class="unsave-btn" title="Click to unsave this post">Unsave</a><a href="http://www.reddit.com' + this._model.getPermalink(this._theID) + '" target="_blank" title="Click to view comments on reddit.com">r/' + this._model.getLinkSubreddit(this._theID) + '</a></div>';
        theHTML +=          '</td>';
        theHTML +=      '</tr></table>';
        theHTML +=  '</div>';
		
		this._container.append(theHTML);
        
        this._linkContainer = $('#' + this._theID);
        this._title = this._linkContainer.find('.link-title');
        this._thumb = this._linkContainer.find('.thumb');
        this._ratingScale = new RatingScale(this._linkContainer.find('.link-rating'), this._model, this._controller, {id: this._theID, linkID: this._model.getLinkID(this._theID), rating: this._model.getLinkRating(this._theID)});
        
        this.inherit();
	},
    
    enableButtons: function()
    {
        var scope = this;
        
        /*this._title.click(function($e) {
            $e.stopPropagation();
            scope._controller.showLink(scope._theID);
        });*/
        
        this.inherit();
    },
    
    onShowThumb: function($ratio) 
    {
        this._imgDiv.css('background-image', 'url(' + this._model.getThumbnailImage(this._data) + ')');
        
        if($ratio != 1) {
            var width = '100%';
            var height = ($ratio * 100) + '%';
        }
        
        this._imgDiv.css('background-size', width + ' ' + height);
        
        this._imgDiv.animate({
            opacity: 1
        }, 750, function() {
            // Animation complete.
        });  
        this._model.setThumbLoaded(this._theID);
    },
    
    onDestroy: function()
    {
        this.inherit();  
        
        this._title.unbind('click'); 
        this._thumb.unbind('click'); 
    }
});