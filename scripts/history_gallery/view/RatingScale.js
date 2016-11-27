var RatingScale = AbstractView.extend({
    
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);        
	},
		
	draw: function()
	{
        var theHTML = '';
        var style = '';
        var scope = this;

        for(i=0; i<this._model.NUM_STARS_RATING; i++) {
            if((i+1) <= this._data.rating) {
               style = 'background-position: 0px 0px';
            } else {
               style = 'background-position: -19px 0px'; 
            }
            theHTML += '<div class="star" data-idx="' + (i+1) + '" style="' + style + '"></div>';   
        }

        this._container.append(theHTML);
        
        if(this._model.getStorePrefs() == true) {
            this._container.find('.star').click(function(){
                var rating = $(this).attr('data-idx');
                scope.setRating(rating);
            });
        } else {
             this._container.find('.star').css({
                opacity: 0.25,
                cursor: 'default'
             });
        }
	},
    
    setRating: function($rating)
    {
        this._controller.setLinkRating($rating, this._data.id, this._data.linkID);

        this._container.find('.star').each(function() {
            var rating = parseInt($(this).attr('data-idx'));
            if(rating <= $rating) {
                $(this).css('background-position', '0px 0px');
            } else {
                $(this).css('background-position', '-19px 0px');
            }
        });
    },
    
    onDestroy: function()
    {
        this.inherit();
    }
});