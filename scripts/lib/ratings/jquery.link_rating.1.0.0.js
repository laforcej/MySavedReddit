(function($) {
	var theID;
	var controller;
    var parent;
    var scope;
    var NUM_STARS = 5;
    var rating;
    var linkID;

    var methods = {
		init: function($options)
		{
			theID = $options.theID;
			controller = $options.controller;
            rating = $options.rating;
            linkID = $options.linkID;
			scope = this;
			scope.jLinkRating('draw');
            
            console.log(this);
            //console.log('scope: ' + scope);
            //console.log(this == scope);
		},
		
		draw: function()
		{
            var theHTML = '';
            var style = '';
                        
            //TODO: check rating and fill in star to appropriate level
            
            for(i=0; i<NUM_STARS; i++) {
                if((i+1) <= rating) {
                   style = 'background-position: 0px 0px';
                } else {
                   style = 'background-position: -19px 0px'; 
                }
                theHTML += '<div class="star" data-idx="' + (i+1) + '" style="' + style + '"></div>';   
            }
            
            scope.append(theHTML);

            scope.find('.star').click(function(){
                var rating = jQuery(this).attr('data-idx');
                scope.jLinkRating('setRating', rating);
            });
		},
        
        setRating: function($rating)
        {
            //TODO: Fill stars...
            
            controller.setLinkRating($rating, theID, linkID);
            
            scope.find('.star').each(function() {
                var id = parseInt($(this).attr('data-idx'));
                if(id <= $rating) {
                    $(this).css('background-position', '0px 0px');
                } else {
                    $(this).css('background-position', '-19px 0px');
                }
            });
        },
	};
        
    $.fn.jLinkRating = function($method) {
		if (methods[$method]) {
			return methods[$method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof $method === 'object' || !$method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  $method + ' does not exist');
		} 
	};
})(jQuery);