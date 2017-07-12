

/*

This class implements the console part of the web client of easy
interface.

*/

window.Console = (function() {
    "use strict";

    // static variables should go here 

    var consoleId = 0;  // a counter to create unique identifiers for consoles

    function Console(place,options) {
	
	consoleId++;

	this.place = place;
	this.initConsole();
	
    };

    Console.prototype = {
	constructor: Console,

	//
	winId_to_winTag: 
	function( id ) {
	    return  "conwin-" + id;
	},


	//
	winTag_to_winId: 
	function( winTag ) {
	    return winTag.substr(7,winTag.length-7);      
	},

	//
	initConsole: 
	function() {
	  var self = this;	    

	  if ( this.tabs ) {
	    $(this.winInfoById).each(function(k,v){
	      if(v.streamRef)
		v.streamRef.off(true);
	    });
	    $(this.consHolder).find("#"+this.consId).remove();
	    
	  }

	  this.consId = "CONS-"+consoleId;      // a unique id for the console
	  this.consHolder = this.place;              // the jquery element where the console should be place
	  this.tabCounter = 0;                  // current number of tabs in the console
	  this.currTabId = 0;                   // the id of the currently visible tab
	  this.winInfoById = {};       // an array the keeps the win (i.e tab) info by id
	  this.winInfoByPos = new Array();      // an array the keeps the win (i.e tab) info by position
	  this.winId = 0;
	  
	  //console panel
	     this.tabs = $(this.consHolder).append("<div id='"+this.consId+"' class='ei-console'><ul class='ei-console-panel'></ul></div>").find("#"+this.consId);

	  //console options section
	  this.tabs.prepend("<div  class='ei-console-options' style='float: right;'></div>");

	  //button close all
	  this.tabs.find(".ei-console-options").append("<button class='ei-console-close-button'></button>");
	  this.tabs.find(".ei-console-close-button").
	  	button({ 
	  	    icons: { primary: "ui-icon-closethick"}, 
	  	    text:false 
	  	}).click( function() { 
	  	    while(0 < self.winInfoByPos.length){
	  	      var winId = self.winInfoByPos[0].id;
	  	      self.hideWin( winId );
	  	    }
		  self.tabs.find("#ei-console-list").val("none");
	  	});

	  //button add console
	  this.tabs.find(".ei-console-options").append("<button class='ei-console-add-button'></button>");
	    this.tabs.find(".ei-console-add-button").
	    	button({ 
	    	    icons: { primary: "ui-icon-plusthick"}, 
	    	    text:false 
	    	}).click( function() { 
		  while(typeof(self.winInfoById[self.winId]) != "undefined") 
		    self.winId++;

	    	    var winId = self.createWin(self.winId,"Some title "+self.winId); 
	    	    self.switchWin( winId );

	    	});

	  //combo consoles
	  this.tabs.find(".ei-console-options").append("<select class='custom-combobox custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-all' id='ei-console-list'></select>");
	  this.tabs.find("#ei-console-list").append("<option value='none'>List of Consoles</option>");
	  this.tabs.find("#ei-console-list").change(function(){
	    var val = $(this).val();
	    if (val != "none")
	      self.showWin(val);
	    else{
	      var curr = self.currWinId();
	      if(curr>=0)
		$(this).val(curr);
	    }
	  });
	    this.tabs.tabs({
		activate: function( event, ui ) { 
		    var winTag = ui.newTab.attr( "aria-controls" );
		    self.switchWin( self.winTag_to_winId(winTag) );
		}
	    });
	    this.marker = $("");
	  
	    this.tabs.delegate( "span.ui-icon-close", "click", 
				function() {
				    var winId = self.winTag_to_winId( $( this ).closest( "li" ).attr( "aria-controls" ) );
				   //if ( winId != 0 ) 
				    self.hideWin( winId );
				});
	    
	    this.tabs.delegate( "span.ui-icon-extlink", "click", 
				function() {
				    var winId = self.winTag_to_winId( $(this).closest("li").attr("aria-controls"));
				    self.expandWin( winId );				    
				});
	},

	//
	existWin:
	function(id) {
	    return id && this.winInfoById[id];
	},

	//
	createWin: 
	function(id, title) {
	    var self = this;

	    // if there is a window with the same title, then do nothing
	    if ( this.existWin(id) )
		return null;

	    // if id is not given, then generate a new id
	    if ( !id ){
 		while(typeof(this.winInfoById[this.winId]) != "undefined") 
		    this.winId++;
		id = this.winId;
		this.winId++;
	    }
	    
	    var winTag = this.winId_to_winTag(id);

	    if ( !title ) title = "Console "+id;

	    // TBD --- later verify that there is no other Tab with the
	    // same id
	    
	    // create the panel
	    var panel = $("<li id='tablabel-"+winTag+
			  "'><a href='#"+winTag+"'>"+title+
			  "</a>"+
			  "<span style='display:inline-block;' class='ui-icon ui-icon-extlink'></span>"+
			  "<span style='display:inline-block;' class='ui-icon ui-icon-close'></span></li>");
	    this.tabs.find( ".ui-tabs-nav" ).append( panel );
	    
	    // create the tab content
	    var content = $("<div id='" + winTag + "' class='ei-console-content'></div>");
	    var streamBttn = $("<button class='ei-console-stream-button'>Streaming...</button>");
	    $(streamBttn).button({ 
	  	    icons: { primary: "ui-icon-stop"}, 
	  	    text: "stream" 
	  	}).click( function() { 
		  self.disableStreamButton(id);
		  self.winInfoById[id].streamRef.off(true);
	  	});
	  $(streamBttn).hide();
	    $(content).append(streamBttn);

	    this.tabs.append( content );
	    var currWinInfo = {
	        id: id, 
		pos: this.tabCounter, 
	        label: title,
	        visible: true,
		streamButton: streamBttn,
		panel: panel,
		content: content
	    };
	    this.winInfoByPos[currWinInfo.pos] = currWinInfo;
	    this.winInfoById[id] = currWinInfo;
	    this.tabCounter++;
	    this.tabs.tabs( "refresh" );

	  var self = this;
	  var opt = $("<option value='"+id+"'>"+title+"</option>");
	  //opt.click(function(){
	  //  self.showWin($(this).attr("console"));
	  //});
	  self.tabs.find("#ei-console-list").append(opt);
	
	    return id;
	},
	
	
	
	//
	hideWin:
	function( id ) {
	  var self = this;
	    var tabTag = this.winId_to_winTag(id);
	    var tabInfo = this.winInfoById[id];

	    // TBD -- check if the tab is not hidden already
	    
	    // if we are hiding the current tab, then switch to the next
	    // or previous one first
	    if ( this.tabs.tabs( "option", "active" ) == tabInfo.pos ) {
		if ( this.winInfoByPos[tabInfo.pos+1] ) 
		    this.switchWin( this.winInfoByPos[tabInfo.pos+1].id );
		else if ( this.winInfoByPos[tabInfo.pos-1] )
		    this.switchWin( this.winInfoByPos[tabInfo.pos-1].id );
	    }

	    tabInfo.visible = false;

	    tabInfo.panel.detach()
	    tabInfo.content.detach()

  
	    this.tabs.tabs( "refresh" );
	    
	    this.winInfoByPos.splice(tabInfo.pos,1);

	    for(var i=tabInfo.pos; i<this.winInfoByPos.length; i++)
		this.winInfoByPos[i].pos--;
	    
	    this.tabCounter--;
	    if ( this.tabCounter == 0 ) this.currTabId = null;
	    
	},
	
	//
	showWin: 
        function(id) {
	  var tabTag = this.winId_to_winTag(id);
	    var tabInfo = this.winInfoById[id];
	    if ( tabInfo.visible ) {
		this.switchWin(id);    // just switch when the tab is visible
	    } else {

		this.tabs.find( ".ui-tabs-nav" ).append( tabInfo.panel  );
		this.tabs.append( tabInfo.content );
		
		tabInfo.panel.show();
		tabInfo.content.show();
		
		tabInfo.visible = true;
		tabInfo.pos = this.tabCounter;
		this.winInfoByPos[tabInfo.pos] = tabInfo;
		this.tabCounter++;
		this.tabs.tabs( "refresh" );
		
		this.switchWin(id);
	    }
	},
	
	
	//
	expandWin:
	function(id) {
	    var self = this;
	    this.hideWin(id);
	    var tabTag = this.winId_to_winTag(id);
	    var tabInfo = this.winInfoById[id];

	  tabInfo.content.addClass("ei-console-content-expanded");
	    var d = $("<div style='height: 70%; overflow: auto;'></div>").append( tabInfo.content ).
		dialog({
		    width: 500,
		    height: 300,
		    title: tabInfo.label,
		    beforeClose: function( event, ui ) {
			tabInfo.content.removeClass("ei-console-content-expanded");
			self.showWin(id);
		    }
		});
	    tabInfo.content.show();
	},
	
	//
	delWin:
	function() {
	},
	
	//
	switchWin:
	function(id) {
	  var winInfo = this.winInfoById[id];
	  this.tabs.tabs( "option", "active", winInfo.pos );
	  this.tabs.find("#ei-console-list").val(id);
	  this.currTabId = id;
	},
	
	//
	clearWin:
	function(id) {

	    // this way we allow adding content to the currently
	    // active tab without the need of having it ID,
	    if ( id == null )
		id = this.currWinId()
	    
	    var winTag = this.winId_to_winTag(id);
	    if(!this.winInfoById[id])
		;
	    else
		this.winInfoById[id].content.empty();
	},

	//
	addContentToWin:
	function(id,content) {

	    // this way we allow adding content to the currently
	    // active tab without the need of having it ID,
	    if ( id == null )
		id = this.currWinId();

	    if ( !this.existWin(id) ) return;

	    var winTag = this.winId_to_winTag(id);
	    var wrap = $("<div></div>");
	    wrap.append( $(content) );

	    // switch to the desired tab -- TODO: maybe not needed
	    this.showWin(id);

	    this.winInfoById[id].content.append( wrap );

	    return wrap;
	},

	//
	currWinId:
	function() {
	    return this.currTabId;
	},

	    //
	addStreamButton:
	function(id,ref){
	  if(this.winInfoById[id]){
	    this.winInfoById[id].streamButton.show();
	    this.winInfoById[id].streamRef = ref;
	  }
	},
	  //
	disableStreamButton:
	function(id){
	  if(this.winInfoById[id] && this.winInfoById[id].streamRef)
	    this.winInfoById[id].streamButton.attr("disabled", "disabled");
	},
	  //
	enableStreamButton:
	function(id){
	  if(this.winInfoById[id] && this.winInfoById[id].streamRef)
	    this.winInfoById[id].streamButton.removeAttr("disabled");
	},
	     //
	removeStreamButton:
	function(id){
	  if(this.winInfoById[id] && this.winInfoById[id].streamRef){
	    this.winInfoById[id].streamButton.hide();
	    this.winInfoById[id].streamRef = null;
	  }
	},
    };

    return Console;
    
})();
