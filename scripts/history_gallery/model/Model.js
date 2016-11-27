var Model = Base.extend({
	_accessToken      :'',
	_authCode         :'',
    _state            :'', 
    _tokenType        :'',
    _expiresIn        :'',
    _refreshToken     :'',
    _userName         :'',
    _userID           :'',
    _truID            :-1,   
    _linkArray        :new Array(),
    _linkInfo         :new Object(),
    _scope            :'All',
    _sortBy           :'Newest',
    _groupBySubreddit :0,
    _viewAsGallery    :0,    
    _filterBy         :0,
    _trayOpen         :false,
    _storePrefs       :false,
    _uiBusy           :false,
    NUM_STARS_RATING  :5,
    REDIRECT_URI      :'http://www.ltrane.com/oauth/main.php',
    CLIENT_ID         :'bet0G9mwW8Xw_g',
    CLIENT_SECRET     :'Axn0c-0uQKbbNeODO3JD7W34VMI',
    ACCESS_TOKEN_URI  :'https://www.reddit.com/api/v1/access_token',
    USER_URI          :'https://oauth.reddit.com/api/v1/me',
    GET_USER_PREFS_URI:'php/get_user_prefs.php',
    SET_USER_PREFS_URI:'php/set_user_prefs.php',
    UNSAVE_URI        :'https://oauth.reddit.com/api/unsave',
    NO_IMAGE_URI      :'images/no_image.png',
    SET_RATING_URI    :'php/set_link_rating.php',
    GET_RATINGS_URI   :'php/get_link_ratings.php',
    DELETE_LINK_URI   :'php/delete_link.php',
    COOKIE_NAME       :'my_saved_reddit',
	
	constructor: function($data)
	{
	},
    
    setLinkData: function($theID, $data)
    {
        this._linkArray.push($theID);

        this._linkInfo[$theID] = new Object();
        this._linkInfo[$theID].id = $data.id;
        this._linkInfo[$theID].url = $data.url;
        this._linkInfo[$theID].thumb = $data.thumbnail; 
        this._linkInfo[$theID].name = $data.name;
        this._linkInfo[$theID].over_18 = $data.over_18;
        this._linkInfo[$theID].permalink = $data.permalink; 
        this._linkInfo[$theID].subreddit = $data.subreddit.toLowerCase();
        this._linkInfo[$theID].preview = $data.preview;
        this._linkInfo[$theID].title = $data.title.replace(/"/g, '\'');
        this._linkInfo[$theID].thumb_loaded = false;
        this._linkInfo[$theID].has_thumb = true;
        this._linkInfo[$theID].rating = 0;

        if(this._linkInfo[$theID].thumb.search('http') == -1) {
            this._linkInfo[$theID].thumb = this.NO_IMAGE_URI;   
            this._linkInfo[$theID].has_thumb = false;
        }        
    },
    
    getLinkData: function($theID)
    {
        return this._linkInfo[$theID];   
    },
    
    setAuthCode: function($authCode) 
    {
        this._authCode = $authCode;   
    },
    
    getAuthCode: function() 
    {
        return this._authCode;   
    },
    
    setState: function($state) 
    {
        this._state = $state;   
    },
    
    getState: function() 
    {
        return this._state;   
    },
    
    setAccessToken: function($accessToken)
    {
        this._accessToken = $accessToken;  
    },
    
    getAccessToken: function()
    {
        return this._accessToken;  
    },
    
    setTokenType: function($tokenType)
    {
        this._tokenType = $tokenType;   
    },
    
    getTokenType: function()
    {
        return this._tokenType;   
    },
    
    setExpiresIn: function($expiresIn)
    {
        this._expiresIn = $expiresIn;  
    },
    
    getExpiresIn: function()
    {
        return this._expiresIn;  
    },
    
    setRefreshToken: function($refreshToken)
    {
        this._refreshToken = $refreshToken;  
    },

    getRefreshToken: function()
    {
        return this._refreshToken;  
    },    
    
    setUIBusy: function($bool)
    {
        this._uiBusy = $bool;    
    },
    
    getUIBusy: function()
    {
        return this._uiBusy;    
    },
    
    setUserName: function($name)
    {
        this._userName = $name;
    },
    
    getUserName: function()
    {
        return this._userName;
    },
    
    setStorePrefs: function($bool)
    {
        this._storePrefs = $bool;  
    },
    
    getStorePrefs: function($bool)
    {
        return this._storePrefs;
    },
    
    setUserPreferences: function()
    {
        this._model.setScope($scope);
        this._model.setSortBy($sortBy);
        this._model.setGroupBySubreddit($grouped);
        this._model.setViewAsGallery($viewAsGallery);
        this._model.setFilterBy($filterBy);
    },
    
    setViewAsGallery: function($type) 
    {
        this._viewAsGallery = $type;    
    },
    
    getViewAsGallery: function($type) 
    {
        return this._viewAsGallery;    
    },
    
    setUserId: function($theID)
    {
        this._userID = $theID;
    },
    
    getUserId: function()
    {
        return this._userID;
    },
    
    setTruId: function($theID)
    {
        this._truID = $theID;
    },
    
    getTruId: function()
    {
        return this._truID;
    },
        
    setTrayOpen: function($state)
    {
        this._trayOpen = $state;
    },
        
    getTrayOpen: function()
    {
        return this._trayOpen;
    },
        
    setScope: function($scope)
    {
        this._scope = $scope;
    },
      
    getScope: function()
    {
        return this._scope;    
    },
    
    setSortBy: function($sortBy)
    {
        this._sortBy = $sortBy;
    },
    
    getSortBy: function()
    {
        return this._sortBy;  
    },
    
    setFilterBy: function($rating) 
    {
        this._filterBy = $rating;  
    },
    
    getFilterBy: function()
    {
        return this._filterBy;  
    },
    
    setGroupBySubreddit: function($bool)
    {
        this._groupBySubreddit = $bool;
    },    
    
    getGroupBySubreddit: function()
    {
        return this._groupBySubreddit;
    },
    
    getLinks: function()
    {
        var tmpArray = this._linkArray.slice();
        return tmpArray;
    },
    
    getLinksReversed: function()
    {
        var tmpArray = this._linkArray.slice();
        return tmpArray.reverse();
    },
    
    getLinksRandomized: function()
    {
        var tmpArray = this._linkArray.slice();
        return this.shuffle(tmpArray);
    },
    
    getURLIsImage: function($theID) 
    {
        return this.getLinkURL($theID).indexOf('.jpg') != -1 ||
               this.getLinkURL($theID).indexOf('.jpeg') != -1 ||
               this.getLinkURL($theID).indexOf('.png') != -1 ||
               (this.getLinkURL($theID).indexOf('.gif') != -1) && (this.getLinkURL($theID).indexOf('.gifv') == -1) ||
               this.getLinkURL($theID).indexOf('.bmp') != -1;
    },
    
    getLinksByHighestRated: function()
    {
        var swapped;
        var tmpArray = this._linkArray.slice();
        
        do {
            swapped = false;
            for (var i=0; i < tmpArray.length-1; i++) {
                if (this._linkInfo[tmpArray[i]].rating < this._linkInfo[tmpArray[i+1]].rating) {
                    var temp = tmpArray[i];
                    tmpArray[i] = tmpArray[i+1];
                    tmpArray[i+1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);
        
        return tmpArray;
    },
    
    getLinksGroupedBySubreddit: function($array)
    {
        var tmpArray = new Array();
        var tmpArray2 = new Array();
       
        //create list of subreddits
        for(i=0; i<$array.length; i++) {
            var subreddit = this._linkInfo[$array[i]].subreddit;
            var exists = false;
            for(j=0; j<tmpArray.length; j++) {
                if(tmpArray[j] == subreddit) {
                    exists = true;
                    break;
                }
            }
            if(!exists) {
                tmpArray.push(subreddit);   
            }
        }
        
        //sort array alpha
        tmpArray.sort();
        
        for(i=0; i<tmpArray.length; i++) {
           for(j=0; j<$array.length; j++) {
               if(this._linkInfo[$array[j]].subreddit == tmpArray[i]) {
                   tmpArray2.push($array[j]);    
               }
           }
        }
      
        return tmpArray2;
    },
    
    getWindowPosition: function()
    {
        return $(window).scrollTop() + $(window).innerHeight();   
    },
    
    getThumbLoaded: function($theID) 
    {
        return this._linkInfo[$theID].thumb_loaded;
    },
    
    setThumbLoaded: function($theID) 
    {
        this._linkInfo[$theID].thumb_loaded = true;
    },
    
    getThumbnailImage: function($theID)
    {
        return this._linkInfo[$theID].thumb;
    },
    
    getLinkSubreddit: function($theID)
    {
        return this._linkInfo[$theID].subreddit;  
    },
    
    getLinkURL: function($theID)
    {
        return this._linkInfo[$theID].url;    
    },

    getLinkName: function($theID)
    {
        return this._linkInfo[$theID].name;    
    },
    
    getLinkTitle: function($theID) 
    {
        return this._linkInfo[$theID].title;        
    },
    
    getLinkID: function($theID) 
    {
        return this._linkInfo[$theID].id;        
    },    
    
    getLinksubreddit: function($theID)
    {
        return this._linkInfo[$theID].subreddit;    
    },
    
    addLinkRatings: function($data) 
    {
        for(item in $data) {
            for(item2 in this._linkInfo) {
                 if($data[item].link_id == this._linkInfo[item2].id) {
                    this._linkInfo[item2].rating = $data[item].rating;
                    break;
                }
            }
        }
    },
    
    setLinkRating: function($theID, $rating)
    {
        this._linkInfo[$theID].rating = $rating;
    },
    
    getLinkRating: function($theID)
    {
        return this._linkInfo[$theID].rating;  
    },
    
    setModalOpen: function($state)
    {
        this._modalOpen = $state;  
    },
    
    getModalOpen: function()
    {
        return this._modalOpen;  
    },
    
    setCookie: function() 
    {
        var cookieString = '';
        var d = new Date();
        d.setTime(d.getTime() + (365*24*60*60*1000));
        var expires = 'expires='+d.toUTCString();
        
        cookieString += 'view_as_gallery|'    + this.getViewAsGallery() + '^' +
                        'scope|'              + this.getScope() + '^' +
                        'sort_by|'            + this.getSortBy() + '^' +
                        'group_by_subreddit|' + this.getGroupBySubreddit();        

        document.cookie = this.getUserId()+ '@' + this.COOKIE_NAME + '=' + cookieString + '; ' + expires; 
    },
    
    getCookie: function()
    {
        var name = this.getUserId()+ '@' + this.COOKIE_NAME + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return '';
    },

    shouldLoadThumb: function($theID, $thumb)
    {
        return this.getThumbInViewport($thumb);
    },
    
    getThumbInViewport: function($thumb) 
    {
        return $thumb.offset().top < this.getWindowPosition();
    },
    
    getLinksExistInSubreddit: function($subreddit)
    {
        var linksExist = false;   
        
        for(var i=0; i<this._linkArray.length; i++) {
            if(this._linkInfo[this._linkArray[i]].subreddit == $subreddit) {
                linksExist = true; 
                break;
            }
        }
        
        return linksExist;
    },
    
    getPermalink: function($theID) 
    {
        return this._linkInfo[$theID].permalink;    
    },
    
    removeLink: function($theID)
    {
        delete this._linkInfo[$theID];
        
        for(i=0; i<this._linkArray.length; i++) {
            if(this._linkArray[i] == $theID) {
                this._linkArray.splice(i, 1);
            }
        }
    },
    
    hasThumb: function($theID)
    {
        return this._linkInfo[$theID].has_thumb;
    },
    
    resetThumbLoaded: function()
    {
        for(var item in this._linkInfo) {
            this._linkInfo[item].thumb_loaded = false;    
        }
    },
                        
    //Fisher-Yates shuffle
    //http://bost.ocks.org/mike/shuffle/
    shuffle: function($array)
    {
        var currentIndex = $array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = $array[currentIndex];
            $array[currentIndex] = $array[randomIndex];
            $array[randomIndex] = temporaryValue;
        }

        return $array;
    }    
});