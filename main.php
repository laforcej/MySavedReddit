<!doctype html>
<html lang="en">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" type="text/css" href="styles/reset.css">    
<link rel="stylesheet" type="text/css" href="styles/styles.css">
<link rel="stylesheet" type="text/css" href="scripts/lib/lightbox2-master/dist/css/lightbox.css">    
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script language="javascript" type="application/javascript" src="scripts/lib/Base.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/AbstractView.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/StoragePrompt.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/AbstractLinkView.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/ThumbView.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/RatingScale.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/TitleView.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/Label.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/Modal.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/MessageWindow.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/view/Menu.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/model/Model.js"></script>
<script language="javascript" type="application/javascript" src="scripts/history_gallery/controller/Controller.js"></script>
<script language="javascript" type="application/javascript" src="scripts/main.js"></script>
<body>
    <div id="container">
        <div id="content">

        </div>
        <header>
            <div id="menu-btn"></div>
            <div id="site-title"><a href="/"><img src="images/header.png" width="225" height="21" border="0"/></a></div>
        </header>
        <div id="modal"></div>
        <div id="message-window" class="loading">
            <div id="message-window-content"></div>
            <div id="close-btn"></div>
        </div>
        <menu>
            <div id="close-menu-btn"></div>
            <h1>Set Preferences</h1>
            <fieldset>
                <label for="dd-sort-by">Sort By</label>
                <select name="dd-sort-by" id="dd-sort-by">
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Random">Random</option>
                  <option value="Highest">Highest Rated</option>
                </select>
            </fieldset>

            <fieldset>
                <label for="dd-scope">Scope</label>
                <select name="dd-scope" id="dd-scope">
                  <option value="All">All</option>
                  <option value="O18">Adult Content</option>
                  <option value="U18">No Adult Content</option>
                </select>
            </fieldset> 

            <fieldset>    
                <label for="dd-filter-by">Filter by Rating</label>
                <select name="dd-filter-by" id="dd-filter-by">
                  <option value="0">Any Rating</option>
                  <option value="1">1 star</option>
                  <option value="2">2 stars</option>
                  <option value="3">3 stars</option>
                  <option value="4">4 stars</option>
                  <option value="5">5 stars</option>    
                </select>  
            </fieldset>

            <fieldset>
                <label for="chk-group-links" id="lbl-group-links">Group By Subreddit</label>
                <input type="checkbox" name="chk-group-links" id="chk-group-links" />
            </fieldset>
            
            <fieldset>
                <label for="chk-view-as-gallery" id="lbl-view-as-gallery">Thumbnail Gallery View</label>
                <input type="checkbox" name="chk-view-as-gallery" id="chk-view-as-gallery" />
            </fieldset>

            <div id="save-btn">
                <a href="#" id="pref-save">Save</a>
            </div>
        </menu>
    </div>
    <script src="scripts/lib/lightbox2-master/dist/js/lightbox.js"></script>
</body>
</html>