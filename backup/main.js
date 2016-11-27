    
var auth_code = location.search.split('code=')[1];
var access_token;
var counter = 0;
var user_name;
var user_id;
var scope = "All";
var sort_by = "Newest";
var link_array = new Array();
var link_info = new Object();
var modal_open = false;
var thumbs_to_load = 0;

$(document).ready(function(){
    
    //make the call to the reddit api to get the access token
    $.ajax({
        type: "POST",	
        url: "https://www.reddit.com/api/v1/access_token",
        dataType: 'json',
        data: {
            "grant_type": "authorization_code",
            "code": auth_code,
            "redirect_uri": "http://www.ltrane.com/oauth/test.php"
        },
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Basic " + btoa("bet0G9mwW8Xw_g:Axn0c-0uQKbbNeODO3JD7W34VMI"));
        },
        success: function(data, status) {
            parseResponse(data);
        }
    });
    
    $(window).resize(function() {
        var top = document.body.scrollTop;
        $('#content-box').css({
            left: ($(window).width() - $('#content-box').outerWidth())/2,
            top: top + (($(window).height() - $('#content-box').outerHeight())/2)
        });

    });
    
    $(window).scroll(function() {
        if(modal_open) {
            $(this).resize();   
        }
        
        checkThumbPosition();
    });
    
    //alert($(window).width() + " :: " + $(window).height());
});

    
//process data returned by access_token api call
function parseResponse(data) {
    access_token = data.access_token;
    token_type = data.token_type; 
    expires_in = data.expires_in; 
    refresh_token = data.refresh_token;
    scope = data.scope;

    //console.log("code: " + myParam);
    //console.log("access_token: " + access_token);
    //console.log("expires_in: " + expires_in);
    //console.log("refresh_token: " + refresh_token);
    //console.log("scope: " + scope);

    //get username
    $.ajax({
        type: "GET",	
        url: "https://oauth.reddit.com/api/v1/me",
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "bearer " + access_token);
        },
        success: function(data, status) {
            user_name = data.name;
            user_id = data.id;
            getUserPrefs();
        }
    });    
}
    
function getUserPrefs() {
    
    //get user preferences
    $.ajax({
        type: "GET",	
        url: "get_user_prefs.php",
        dataType: 'json',
        data: {
            "user_name": user_name,
            "user_id": user_id
        },
        success: function(data, status) {
            if(data.first_time_user) {
                //TODO: first time user set preferences
                showUserPrefs();
            } else {
                scope = data.scope;
                sort_by = data.sort_by;
            }
            getAllResults("saved", "");
        },
        error: function() {
            getAllResults("saved", "");
        }
    });
}

function setUserPrefs(scope, sort_by) {
    scope = data.scope;
    sort_by = data.sort_by;  
    
    //get user preferences
    $.ajax({
        type: "POST",	
        url: "set_user_prefs.php",
        dataType: 'json',
        data: {
            "user_name": user_name,
            "user_id": user_id,
            "sort_by": sort_by,
            "scope": scope
        },
        success: function(data, status) {
            alert("Preferences saved");
            getAllResults("saved", "");
            
        },
        error: function() {
            alert("Error saving preferences");
            getAllResults("saved", "");
        }
    });
}
    
function showUserPrefs() {
       
}
    
function showModal() {
    
    
    // To initially run the function:
    $(window).resize(); 
    
    $("#modal").css("display", "block");
    $("#content-box").css("display", "block");
    
    modal_open = true;
    
    //$("#modal").animate({
    //    opacity: .8
    //}, 500, function() {
    //});
}
    
function hideModal(callback) {
    modal_open = false;
    
    var scope = this;
    
    //$("#modal").animate({
    //    opacity: 0
    //}, 500, function() {
        $("#modal").css("display", "none");
        $("#content-box").css("display", "none"); 
        $("#content-box").empty();
        //$("#modal").css("opacity", "0");
        if(callback != undefined) {
            callback();   
        }
    //});
}
    
function showLoadingMsg(the_msg) {
    $("#content-box").append("<div id='loading-message'>Loading posts...</div>");
}
    
function hideLoadingMsg() {
    $("#loading-message").remove();
    $("#content-box").css("background-image", "none");
    $("#content-box").css("background-color", "fff");
    $("#content-box").css("opacity", 1);
    $("#content-box").css("height", "300px");
    
}
    
//process the results returned by the API
function getAllResults(type, after) {
    
    if(!modal_open) {
        modal_open = true;
        showLoadingMsg();
        showModal();
    } else {
        $("#loading-message").html("Loading posts after " + after);   
    }

    if(type == "saved") {
        url = "https://oauth.reddit.com/user/" + user_name + "/saved?limit=100&after="
    } else {
        url = "https://oauth.reddit.com/user/" + user_name + "/upvoted?limit=100&after="
    }
    
    //TODO: Update Message "Getting results after + after

    //make call to the reddit api to grab the next 100 saved posts
    $.ajax({
        type: "GET",	
        url: url + after,
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "bearer " + access_token);
        },
        success: function(data, status) {			
            var children = data.data.children;
            var the_id;
            var the_style;
            var the_html;
            
            //console.log(data);
            
            for(i=0; i<children.length; i++) {
                if((scope == "O18" && children[i].data.over_18 == true) || (scope == "U18" && children[i].data.over_18 == false) || scope == "All") {
                    counter += 1;
                
                    the_id = "cnt_" + counter;
                    post_array.push(the_id);
                    
                    post_info[the_id] = new Object();
                    post_info[the_id].id = children[i].data.id;
                    post_info[the_id].url = children[i].data.url;
                    post_info[the_id].thumb = children[i].data.thumbnail; 
                    post_info[the_id].name = children[i].data.name;
                    post_info[the_id].permalink = children[i].data.permalink; 
                    post_info[the_id].subreddit = children[i].data.subreddit;
                    post_info[the_id].preview = children[i].data.preview;
                    post_info[the_id].title = children[i].data.title;
                    post_info[the_id].thumb_loaded = false;
                 
                    //if(children[i].data.preview != undefined) {
                    //    if(children[i].data.preview.images["0"].resolutions[0] != undefined) {
                    //        post_info[the_id].thumb = children[i].data.preview.images["0"].resolutions[0].url;
                    //    }
                    //}
                }
            }

            var after_name = data.data.after;
            if(type == "saved" && after_name != null) {
                getAllResults("saved", after_name);
            //} else if(type == "upvoted" && after_name != null) {
            //	getAllResults("upvoted", after_name)
            //} else if(type == "saved") {
            //	getAllResults("upvoted", "")
            } else {
                //console.log(data);
                hideModal();
                hideLoadingMsg();
                loadGrid();
                enableButtons();
            }
        }
    });
}
    
function loadGrid() {
    var the_id;
    var the_html;
    
    //shuffle thumbs if required
    if(sort_by == "Random") {
        post_array = shuffle(post_array);   
    } else if (sort_by == "Oldest") {
        post_array.reverse();   
    }
    
    for(i=0; i<post_array.length; i++) {
        the_id = post_array[i];
            
        if(post_info[the_id].thumb.search('http') == -1) {
            post_info[the_id].thumb = "no_image.png";
        }

        the_html =  "<span id='" + the_id + "' class='thumb'>";
        the_html +=    "<span class='unsave-btn'></span>";
        the_html +=    "<span class='info-btn'></span>";
        the_html += "</span>";

        $('#content').append(the_html);
        
        var tmpThumb = $("#" + the_id); 
        
        tmpThumb.addEventListener("onscroll", function(){
    
        });
        
        if(thumbInViewport(the_id)) {
            preloadThumb(the_id, post_info[the_id].thumb);   
        }

        //if(preload_thumb == false) {
            //console.log("No bg show now");
        //    showThumb(the_id);
        //}
    }
}

function thumbInViewport(the_id) {
    var thumb = $('#' + the_id);
    var windowPos = $(window).scrollTop() + $(window).innerHeight();
    return thumb.offset().top < windowPos;
}

//unsave post using reddit api
function doUnsave(name, parent) {
    //console.log('unsaving...' + fullname);
    var scope = this;

    $.ajax({
        type: "POST",	
        url: "https://oauth.reddit.com/api/unsave",
        data: {
            "id": name
        },
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "bearer " + access_token);
        },
        success: function(data, status) {
            //console.log(data);
            
            //remove the parent
            parent.animate({
                opacity: 0
            }, 500, function() {
                $(this).remove();
            });
        },
        error: function(data) {
            console.log(data)
            alert("Your session has expired.\nPlease log back in.");
        }
    });
}
    
function showPostInfo(the_id) {
    //console.log("showing post info: " + the_id);
    //console.log(post_info[the_id].id); 
    //console.log(post_info[the_id].name);
    //console.log(post_info[the_id].permalink);
    //console.log(post_info[the_id].subreddit);
    //console.log(post_info[the_id].title);
    
    var the_html;
    
    the_html =  "<div id='info-thumb'></div>";
    the_html += "<div id='info-details'></div>";
    
    $('#content-box').append(the_html);
    $('#info-thumb').css("background-image", "url(" + post_info[the_id].thumb + ")");
    
    the_html = "<table>"
    the_html += "<tr><td valign=top class=label>Title</td><td class=title-text>" + post_info[the_id].title + "</td></tr>";
    the_html += "<tr><td class=label>ID</td><td>" + post_info[the_id].id + "</td></tr>";
    the_html += "<tr><td class=label>Name</td><td>" + post_info[the_id].name + "</td></tr>";
    the_html += "<tr><td class=label>Subreddit</td><td><a href=http://www.reddit.com/r/" + post_info[the_id].subreddit + " target=_blank>" + post_info[the_id].subreddit + "</a></td></tr>";
    the_html += "<tr><td colspan=2>&nbsp;</td></tr>";
    the_html += "<tr><td colspan=2 align=center><a href='http://www.reddit.com" + post_info[the_id].permalink + "' target='_blank'>Link to comments</a></td></tr>";    
    the_html += "</table>";
    
    $('#info-details').append(the_html);
    
    showModal();
    
}

function ratePost(the_id, rating) {
    $.ajax({
        type: "POST",	
        url: "rate_post.php",
        data: {
            "id": the_id,
            "rating": rating
        },
        success: function(data, status) {
            //console.log(data);
        },
        error: function(data) {
        }
    });
}
    
//preload the thumbnail image for the post
function preloadThumb(the_id, img_src) {

    if(post_info[the_id].thumb == "no_image.png") {
        showThumb(the_id); 
        post_info[the_id].thumb_loaded = true;
        return;
    }
    
    var scope = this;
    
    var tmpImg1 = new Image();
    tmpImg1.onload = function(){
        for(item in post_info) {
            
            if(post_info[item].thumb == this.src) {
                post_info[item].thumb_loaded = true;
                scope.showThumb(item);   
                break;
            }
        }
    };
    tmpImg1.onerror = function($e){

    };
    tmpImg1.src = img_src;  
}

//show the thumbnail
function showThumb(the_id) {
    //console.log("show thumb: " + the_id);
    var thumb = $('#' + the_id);
    
    thumb.css("background-image", "url(" + post_info[the_id].thumb + ")");
    thumb.animate({
        opacity: 1
    }, 750, function() {
        // Animation complete.
    });
}

function checkThumbPosition() {
    $('.thumb').each(function() {
        var the_id = $(this).attr('id');
        
        if(post_info[the_id].thumb_loaded == false && thumbInViewport(the_id)) {
            if(post_info[the_id].thumb != 'no_image.png') {
                preloadThumb(the_id, post_info[the_id].thumb);       
            } else {
                showThumb(the_id);   
            }
        }
    });
        
}

//Fisher-Yates shuffle
//http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
    
function enableButtons() {       
    $('.thumb').click(function(e) {
        e.stopPropagation();	
        var the_url = post_info[$(this).attr('id')].url;
        window.open(the_url, '_blank');
    });
    $('.unsave-btn').click(function(e) {
        e.stopPropagation();
        var name = post_info[$(this).parent().attr('id')].name;
        doUnsave(name, $(this).parent());
    });  
    $('.info-btn').click(function(e) {
        e.stopPropagation();
        var the_id = $(this).parent().attr('id');
        showPostInfo(the_id);
    }); 
    $('#modal').click(function() {
        hideModal();
    });
}