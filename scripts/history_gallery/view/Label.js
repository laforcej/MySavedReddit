var Label = AbstractView.extend({
    
    _id       :null,
    _label    :null,
    _labelBtn :null,
	
	constructor: function($container, $model, $controller, $data, $id)
	{
		var scope = this;
		
        this._id = $id;
		this.inherit($container, $model, $controller, $data);        
	},
		
	draw: function()
	{
        var theHTML = '';
        
        theHTML =   '<div id="label-' + this._id + '" class="label-container">';
        theHTML +=      '<a href="//www.reddit.com/r/' + this._data + '" target="_blank" class="label-subreddit">' + this._data + '</a>';
        theHTML +=      '<a href="#" class="label-show-hide-btn">hide</a>';
        theHTML +=      '<br class="clear-float"/>';
        theHTML +=  '</div>';
        this._container.append(theHTML);
        
        this._label = $('#label-' + this._id);
        this._labelBtn = this._label.find('.label-show-hide-btn');

        this.enableButtons();
	},
    
    enableButtons: function()
    {
        var scope = this;

        this._labelBtn.click(function($e) {
            $e.preventDefault();	
            if($(this).text() == 'hide') {
                scope._controller.hideLabel(scope._data);    
                $(this).text('show');
            } else {
                scope._controller.showLabel(scope._data);     
                $(this).text('hide');
            }
        });
    },
    
    onLabelBtnClick: function() 
    {
        console.log("button clicked");   
    },
    
    getLabelRef: function()
    {
        return this._label;  
    },
    
    onDestroy: function()
    {
        this.inherit();    
        this._label.remove();
    }
});