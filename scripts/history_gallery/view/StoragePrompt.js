var StoragePrompt = AbstractView.extend({
	
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);	
	},
		
	draw: function()
	{   
        var scope = this;
        var theHTML = '';
        
        theHTML += '<div id="storage-prompt">';
        theHTML += '    <div>By clicking \'I Accept\' below you can store your preferences and ratings of individiual posts on mysavedreddit.com';
        theHTML += '    and access them across devices. By clicking \'I Decline\', your preferences will be saved on this device only.</div>'; 
        theHTML += '    <div style="text-align:center; padding-top:20px;"><a href="#" data-preference="store-prefs">I Accept</a>&nbsp;<a href="#" data-preference="default">I Decline</a></div>';
        theHTML += '</div>';

        
        this._container.append(theHTML);
        
        this.enableButtons();
	},
    
    enableButtons: function()
    {
        var scope = this;
        
        this._container.find('a').click(function($e){
            $e.preventDefault();            
            this._controller.userAnswersStoringPrefs($(this).attr('data-preference') == 'store-prefs'); 
        });
    },

});