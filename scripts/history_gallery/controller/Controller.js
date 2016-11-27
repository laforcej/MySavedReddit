var Controller = Base.extend({

	DEBUG            :false,	
    _container       :null,
    _messageWindow   :null,
    _menu            :null,
    _menuBtn         :null,
    _modal           :null,
    _counter         :0,
    _resultsReceived :false, 
    _linkArray       :new Array(),
    _labelArray      :new Array(),
	
	constructor: function($container, $model)
	{
		this._model = $model;
        this._container = $container;
		this.init();
	},
	
	init: function()
	{
        this.ready();
	},
    
	ready: function()
	{
        var scope = this;
		
		this._messageWindow = new MessageWindow($('#message-window'), this._model, this);
        this._menu = new Menu($('menu'), this._model, this);
        this._menuBtn = $('#menu-btn');
        this._modal = new Modal($('#modal'), this._model, this);
        
        this._menuBtn.click(function(){
            scope.showMenu(); 
        });
        
        this.parseLocationBar();
        this.getAccessToken();
	},    
    
    parseLocationBar: function()
    {
        this._model.setAuthCode(location.search.split('code=')[1]);
        this._model.setState(location.search.split('state=')[1]);
    },
	
	getAccessToken: function()
	{
        var scope = this;
        
        $.ajax({
            type: 'POST',	
            url: this._model.ACCESS_TOKEN_URI,
            dataType: 'json',
            data: {
                'grant_type': 'authorization_code',
                'code': this._model.getAuthCode(),
                'redirect_uri': this._model.REDIRECT_URI
            },
            beforeSend: function ($request) {
                $request.setRequestHeader('Authorization', 'Basic ' + btoa(scope._model.CLIENT_ID + ':' + scope._model.CLIENT_SECRET));
            },
            success: function($data, $status) {
                //console.log("sucess:" + $data);
                scope.parseAuthorizationResponse($data);
            },
            error: function($) {
                console.log('error processing request: ' + $data);
            }
        });
	},
    
    parseAuthorizationResponse: function($data) 
    {
        this._model.setAccessToken($data.access_token);
        this._model.setTokenType($data.token_type); 
        this._model.setExpiresIn($data.expires_in); 
        this._model.setRefreshToken($data.refresh_token);
        
        this.getUserDetails();
    },
    
    getUserDetails: function()
    {
        var scope = this;
        
        //get username
        $.ajax({
            type: 'GET',	
            url: this._model.USER_URI,
            dataType: 'json',
            beforeSend: function ($request) {
                $request.setRequestHeader('Authorization', 'bearer ' + scope._model.getAccessToken());
            },
            success: function($data, $status) {
                scope._model.setUserName($data.name);
                scope._model.setUserId($data.id);
                scope.getUserPreferences();
            }
        });
    },
    
    getUserPreferences: function()
    {
        var scope = this;
        var cookiePrefs = this._model.getCookie();
        
        //Check cookie first
        if(cookiePrefs != '') {
            //get user preferences from cookie
            var tmpArray = cookiePrefs.split('^');
            
            this._model.setViewAsGallery(tmpArray[0].split('|')[1]);
            this._model.setScope(tmpArray[1].split('|')[1]);
            this._model.setSortBy(tmpArray[2].split('|')[1]);
            this._model.setFilterBy(tmpArray[3].split('|')[1]);
            this._model.setGroupBySubreddit(tmpArray[4].split('|')[1]);
            
            this._model.setStorePrefs(false);
            
            $('body').trigger('onSetUserPreferences', []); 
            scope.getAllResults('saved', '');

        } else {

            //get user preferences from DB
            $.ajax({
                type: 'POST',	
                url: this._model.GET_USER_PREFS_URI,
                dataType: 'json', 
                data: {
                    "user_name": this._model.getUserName(),
                    "user_id": this._model.getUserId()
                },
                success: function($data, $status) {
                    
                    if($data.no_preferences == true) {
                        //first time user
                        scope.promptUserForPreferences();
                    } else {
                        console.log('got prefs');
                        scope._model.setScope($data.scope);
                        scope._model.setSortBy($data.sort_by);
                        scope._model.setTruId(parseInt($data.tru_id));
                        scope._model.setGroupBySubreddit($data.group_by_subreddit);
                        scope._model.setViewAsGallery($data.view_as_gallery);
                        scope._model.setFilterBy($data.filter_by);
                        scope._model.setStorePrefs(true);
                        
                        $('body').trigger('onSetUserPreferences', []); 

                        scope.getAllResults('saved', '');
                    }
                },
                error: function() {
                    alert('Error getting user preferences');
                }
            }); 
        }
    },
    
    setUserPreferences: function($scope, $sortBy, $grouped, $filterBy, $viewAsGallery)
    {
        var scope = this;
        
        if(this._model.getScope() == $scope && 
            this._model.getSortBy() == $sortBy &&
            this._model.getGroupBySubreddit() == $grouped &&
            this._model.getFilterBy() == $filterBy &&
            this._model.getViewAsGallery() == $viewAsGallery) {
            
            $('body').trigger('onHideMenu', []); 
            
            return;   
        }
        
        this._model.setScope($scope);
        this._model.setSortBy($sortBy);
        this._model.setGroupBySubreddit($grouped);
        this._model.setViewAsGallery($viewAsGallery);
        this._model.setFilterBy($filterBy);
        
        $('body').trigger('onHideMenu', [this.fadeContainer, this]); 
    },
    
    promptUserForPreferences: function()
    {
        this._storagePrompt = new StoragePrompt($(this._container), this._model, this);
    },
    
    userAnswersStoringPrefs: function($bool)
    {
        this._model.setStorePrefs($bool);
        this.getAllResults('saved', '');
    },
    
    getLinkRatings: function()
    {
        var scope = this;
        
        //get link ratings from database
        $.ajax({
            type: 'GET',	
            url: this._model.GET_RATINGS_URI,
            dataType: 'json',
            data: {
                'tru_id': this._model.getTruId()
            },
            success: function($data, $status) {
                scope._model.addLinkRatings($data);
                scope.dataLoaded();
            },
            error: function() {
                console.log('Error loading data');
            }
        });
    },    
    
    getAllResults: function($type, $after) 
    {
        var url;
        var scope = this;
       
        if($after != '') { 
            $('body').trigger('onUpdateLoadingMessage', ['Loading posts after ' + $after]); 
        } else {
            $('body').trigger('onShowLoadingMessage', ['Loading posts...']);
        }

        if($type == 'saved') {
            url = 'https://oauth.reddit.com/user/' + this._model.getUserName() + '/saved?limit=100&after='
        } else {
            url = 'https://oauth.reddit.com/user/' + this._model.getUserName() + '/upvoted?limit=100&after='
        }

        $.ajax({
            type: 'GET',	
            url: url + $after,
            dataType: 'json',
            beforeSend: function ($request) {
                $request.setRequestHeader('Authorization', 'bearer ' + scope._model.getAccessToken());
            },
            success: function($data, $status) {			
                var children = $data.data.children;
                var theID;

                //console.log(data);
                //var theScope = scope._model.getScope();

                for(i=0; i<children.length; i++) {
                //    if((theScope == 'O18' && children[i].data.over_18 == true) || (theScope == 'U18' && children[i].data.over_18 == false) || theScope == 'All') {
                        scope._counter += 1;

                        theID = 'cnt_' + scope._counter;
                        
                        scope._model.setLinkData(theID, children[i].data);
                //    }
                }

                var afterName = $data.data.after;
                if($type == 'saved' && afterName != null) {
                    scope.getAllResults('saved', afterName);
                //} else if(type == 'upvoted' && afterName != null) {
                //	getAllResults('upvoted', afterName)
                //} else if(type == 'saved') {
                //	getAllResults('upvoted', '')
                } else {
                    console.log(children[i-1].data);
                    this._resultsReceived = true;
                    scope.getLinkRatings();
                }
            }
        }); 
    },
	
	draw: function()
	{	
	},
    
    dataLoaded: function()
    {
        $('body').trigger('onHideLoadingMessage', []); 
        this.loadGrid(); 
    },
    
    fadeContainer: function($scope)
    {
        var scope = $scope;
        
        scope._container.stop().animate({
            'opacity': 0
        }, 500, function(){

            scope.emptyContainer();
            
            if(scope._model.getStorePrefs() == true) {
                //set user preferences
                $.ajax({
                    type: 'POST',	
                    url: scope._model.SET_USER_PREFS_URI,
                    dataType: 'json',
                    data: {
                        'view_as_gallery'    :scope._model.getViewAsGallery(),
                        'scope'              :scope._model.getScope(),
                        'sort_by'            :scope._model.getSortBy(),
                        'filter_by'          :scope._model.getFilterBy(),
                        'group_by_subreddit' :scope._model.getGroupBySubreddit(),
                        'tru_id'             :scope._model.getTruId(),
                        'user_name'          :scope._model.getUserName(),
                        'user_id'            :scope._model.getUserId()
                    },
                    success: function($data, $status) {
                    },
                    error: function() {
                        alert('Error saving preferences');
                    }
                }); 
            } else {
                //TODO: Write to cookie
                scope._model.setCookie();
            }
            scope.loadGrid(); 
        });            
    },
    
    setLinkRating: function($rating, $theID, $linkID)
    {
        var scope = this;
        
        $.ajax({
            type: 'POST',	
            url: this._model.SET_RATING_URI,
            dataType: 'json',
            data: {
                "tru_id": this._model.getTruId(),
                "link_id": $linkID,
                "rating": $rating
            },
            success: function($data, $status) {
                scope._model.setLinkRating($theID, $rating);
            },
            error: function($data) {
                console.log('error processing request: ' + $data);
                scope._model.setLinkRating($theID, $rating);
            }
        });
    },
    
    emptyContainer: function()
    {

        
        //reset thumb loaded state
        this._model.resetThumbLoaded();

        //destroy current thumbs
        if(this._linkArray.length > 0) {
            for(var i=0; i<this._linkArray.length; i++) {
                var tmpThumb = this._linkArray[i];   
                tmpThumb.onDestroy();
                delete tmpThumb;
            }
        }
        this._linkArray = new Array();

        //destroy current labels
        if(this._labelArray.length > 0) {
            for(var i=0; i<this._labelArray.length; i++) {
                var tmpLabel = this._labelArray[i];   
                tmpLabel.onDestroy();
                delete tmpLabel;
            }
        }
        this._labelArray = new Array();
        
        //return to the top of the page
        $(window).scrollTop(0);

        //empty the container of any remaining elements
        this._container.empty();
        this._container.css('opacity', 1);
        $('body').addClass('loading-preferences');
    },
	
    loadGrid: function()
    {
        var theID;
        var theHTML;
        var tmpArray;
        var grouped = false;
        var previous = '';
        var scope = this._model.getScope();
        var filterBy = this._model.getFilterBy();
        var tmpObj;
        
        //get the sort order
        if(this._model.getSortBy() == 'Random') {
            tmpArray = this._model.getLinksRandomized();   
        } else if (this._model.getSortBy() == 'Oldest') {
            tmpArray = this._model.getLinksReversed();   
        } else if(this._model.getSortBy() == 'Highest') {
            tmpArray = this._model.getLinksByHighestRated();
        } else {
            tmpArray = this._model.getLinks();   
        }
        
        //group subreddits if preference set
        if(this._model.getGroupBySubreddit() == 1) {
            tmpArray = this._model.getLinksGroupedBySubreddit(tmpArray); 
            grouped = true;
        }

        $('body').removeClass('loading-preferences');
        
        for(var i=0; i<tmpArray.length; i++) {
            
            theID = tmpArray[i]; 
            tmpObj = this._model.getLinkData(theID);
                    
            if(((scope == 'O18' && tmpObj.over_18 == true) || (scope == 'U18' && tmpObj.over_18 == false) || scope == 'All') && ((tmpObj.rating == filterBy) || filterBy == 0)) {         
                
                if(grouped && this._model.getLinkSubreddit(theID) != previous) {
                    this._container.append('<div class="clear-float"></div>');
                    
                    var subreddit = this._model.getLinkSubreddit(theID);
                    previous = subreddit;
                    var tmpLabel = new Label(this._container, this._model, this, subreddit, this._labelArray.length);
                    this._labelArray.push(tmpLabel);
                }
                
                if(this._model.getViewAsGallery() == 1) {
                    var tmpLink = new ThumbView(this._container, this._model, this, theID);
                } else {
                    var tmpLink = new TitleView(this._container, this._model, this, theID);  
                }
                this._linkArray.push(tmpLink);
            }
        }
        
        //enable lightbox
        window.lightbox.enable();
    },
	
    showLink: function($theID)
    {
        var theURL = this._model.getLinkURL($theID);
        window.open(theURL, '_blank');   
    },
    
    showLinkInfo: function ($theID, $thumbSize) 
    {
        $('body').trigger('onShowLinkInfo', [$theID, this._model.getLinkData($theID), $thumbSize]); 
    },
    
    showLabel: function($subreddit)
    {
        $('body').trigger('onShowLabel', [$subreddit]); 
    },
    
    hideLabel: function($subreddit)
    {
        $('body').trigger('onHideLabel', [$subreddit]); 
    },
    
    doUnsave: function($theID) {
        var scope = this;
        var theSubreddit = this._model.getLinkSubreddit($theID);
        var container = $('#' + $theID)
        
        $.ajax({
            type: 'POST',	
            url: this._model.UNSAVE_URI,
            data: {
                'id': this._model.getLinkName($theID)
            },
            beforeSend: function ($request) {
                $request.setRequestHeader('Authorization', 'bearer ' + scope._model._accessToken);
            },
            success: function($data, $status) {
                //remove the parent
                container.animate({
                    opacity: 0
                }, 500, function() {
                    $(this).remove();
                });
                
                //remove Link info from the database
                $.ajax({
                    type: 'POST',	
                    url: scope._model.DELETE_LINK_URI,
                    data: {
                        "tru_id": scope._model.getTruId(),
                        "link_id": scope._model.getLinkID($theID)
                    },
                    success: function($data, $status) {
                        //console.log('success'); 
                    },
                    error: function(data) {
                        //console.log('error deleting');
                    }
                });
                
                //remove the Link in the model
                scope._model.removeLink($theID);
                
                //if grouped by subreddit, remove label if no more links exist
                if(scope._model.getGroupBySubreddit() == true && scope._model.getLinksExistInSubreddit(theSubreddit) == false) {
                    
                    //remove label
                    if(scope._labelArray.length > 0) {
                        for(var i=0; i<scope._labelArray.length; i++) {
                            
                            if(scope._labelArray[i].getData() == theSubreddit) { 
                                tmpLabel = scope._labelArray.splice(i, 1)[0];

                                var labelRef = tmpLabel.getLabelRef();
                                
                                labelRef.animate({
                                    height: 0
                                }, 500, function() {
                                    tmpLabel.onDestroy();
                                    delete tmpLabel;
                                });
                            }
                        }
                    }       
                }
                
            },
            error: function($data) {
                alert('Your session has expired.\nPlease log back in.');
            }
        });
    },
    
    showMenu: function()
    {
        $('body').trigger('onShowMenu', []); 
    },
    
    hideMenu: function()
    {
        $('body').trigger('onHideMenu', []); 
    },
    
    modalClicked: function()
    {
        $('body').trigger('onHideModal', []);    
    }
});