var AbstractLinkView = AbstractView.extend({
    _theID         :'',
    _linkContainer :null,
    _unsaveBtn     :null,
    _imgDiv        :null,
        
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;

        this._theID = $data;
        
		this.inherit($container, $model, $controller, $data);
        
		jQuery('body').bind({
			'onShowLabel' :function($e, $subreddit) {scope.onShowLabel($subreddit);},
            'onHideLabel' :function($e, $subreddit) {scope.onHideLabel($subreddit);},
		});
	},
		
	draw: function()
	{
        this._imgDiv = this._linkContainer.find('.thumb-img');
        this._unsaveBtn = this._linkContainer.find('.unsave-btn');
        
        this.onScrolling();
        this.enableButtons();
	},
    
    preloadThumb: function()
    {        
        var thumbImg = this._model.getThumbnailImage(this._theID);
        var scope = this;
        var tmpImg1 = new Image();        

        tmpImg1.onload = function(){
            var ratio = this.height / this.width;
            scope.onShowThumb(ratio);   
        };
        tmpImg1.onerror = function($e){
            console.log("Error loading image: " + this.src);
        };
        tmpImg1.src = thumbImg;
    },
    
    enableButtons: function()
    {
        var scope = this;
        
        this._linkContainer.find('a[href^="#"]').click(function($e) {
            $e.preventDefault();
            $e.stopPropagation();	
            scope._controller.showLink(scope._theID);
        });
        
        this._unsaveBtn.click(function($e) {
            $e.preventDefault();
            $e.stopPropagation();
            scope._controller.doUnsave(scope._theID);
        });  
    },
    
    onShowThumb: function($ratio) 
    {
        this._imgDiv.css('background-image', 'url(' + this._model.getThumbnailImage(this._theID) + ')');
        
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
    
    onScrolling: function($e) 
    {
        if(this._imgDiv.css('background-image') == 'none') { 
            if(this._model.shouldLoadThumb(this._theID, this._linkContainer)) {
                this.preloadThumb();
            } else {
                //console.log("no need to load thumb");   
            }
        }
    },
    
    onShowLabel: function($subreddit)
    {
        if(this._model.getLinkSubreddit(this._theID) == $subreddit) {
            this._linkContainer.css('display', 'block');   
        }
    },
    
    onHideLabel: function($subreddit)
    {
        if(this._model.getLinkSubreddit(this._theID) == $subreddit) {
            this._linkContainer.css('display', 'none');   
        }
        
        this.onScrolling();
    },
    
    onResize: function($winWidth, $winHeight)
    {
        this.onScrolling();   
    },
    
    onDestroy: function()
    {
        this.inherit();
        
        this._unsaveBtn.unbind('click');  
        this._linkContainer.remove();
    }
});