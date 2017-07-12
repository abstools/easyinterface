window.CodeArea = (function() {
    "use strict";
    
    // static variables should go here 
    var codeAreaId = 0;

    function CodeArea(place,options) {
	
	codeAreaId++;
	this.filemanager = null;
	this.tabsId = "CATab-"+codeAreaId;
	this.tabCounter = 0;         // used to track the tabs ids
	this.tabs = null;            // the jquery tabs widget
	this.tabsHolder = place;     // the DOM element where the tabs are placed
	this.tabsOptions = options;  // the list of options passed to the constructor
	this.tabInfoByPos = new Array();
	this.tabInfoById  = new Array(); 
	this.currTabId = null;

	this.setOptions();
	this.initTabs();

	// close icon: removing the tab on click
	var self = this;
	this.tabs.delegate( "span.ui-icon-close", "click", 
			    function() {
				var panelId = $( this ).closest( "li" ).attr( "aria-controls" );
				self.hideTab( self.tabTag_to_tabId(panelId) );
			    });

	this.tabs.delegate( "span.ui-icon-extlink", "click", 
			    function() {
				var panelId = $( this ).closest( "li" ).attr( "aria-controls" );
				self.expandTab( self.tabTag_to_tabId(panelId) );
			    });
    };

    CodeArea.prototype = {
	constructor: CodeArea,
	
	// id -> tabs-id
	tabId_to_tabTag: 
	function( id ) {
	    return "tabs-"+id;
	},

	// tabs-id -> id
	tabTag_to_tabId: 
	function( tabTag ) {
	    return tabTag.substr(5,tabTag.length-5);      
	},

	//
	addFileManager:
	function(FM){
	  this.filemanager = FM;
	},
	//
	setOptions: 
	function() {
	},


	//
	initTabs: 
	function() {
	    var self = this;
	    this.tabs = $(this.tabsHolder).append("<div id='"+this.tabsId+"' class='ei-codearea'><ul></ul></div>").find("#"+this.tabsId);
	    this.tabs.tabs({
		activate: function( event, ui ) { 
		    var tabTag = ui.newTab.attr( "aria-controls" );
		    self.switchTab( self.tabTag_to_tabId(tabTag) );
		}
	    });

	},

	//
	switchTab:
	function(id) {
	    var tabInfo = this.tabInfoById[id];
	    this.tabs.tabs( "option", "active", tabInfo.pos );

	    tabInfo.editor.refresh();

	    // this is done in a timeout environment because some other
	    // object might take the focus after exiting this method
	    setTimeout(function() { tabInfo.editor.focus(); }, 0);

	    this.currTabId = id;
	},

	//
	createTab: 
	function(label,id,tabContent) {
	    var tabTag = this.tabId_to_tabTag(id);
	    
	    // TBD --- later verify that there is no other Tab with the
	    // same id

	    // create the panel
	    var panel = $("<li id='tablabel-"+tabTag+
			  "'><a href='#"+tabTag+"'>"+label+
			  "</a><span style='display:inline-block;' class='ui-icon ui-icon-extlink'></span><span style='display:inline-block;' class='ui-icon ui-icon-close'></span></li>");
	    this.tabs.find( ".ui-tabs-nav" ).append( panel );


	    // create the tab content
        var content = $("<div style='padding: 1px' class='ei-codearea-content' id='" + tabTag + "'><textarea id='"+tabTag+"-ed'></textarea></div>");
        this.tabs.append( content );                                            

	    // var content = $("<div style='padding: 1px;' class='ei-codearea-content' id='" + tabTag + "'></div>");
	    // content.append("<div class='ei-codearea-content' id='"+tabTag+"-ed'></div>");
	    // this.tabs.append( content );
	    // create a CodeMirror for this tab
	    var ed = CodeMirror.fromTextArea( content.find("#"+tabTag+"-ed").get(0), { 
 	        lineNumbers: true, 
 		mode: _ei.language,//"text/abs"
 		//value: tabContent, // this line is to add content to the codemirror when is not from a text area
		gutters: ["actionGutter","CodeMirror-linenumbers","infoGutter"],
		scrollbarStyle: "overlay",
		highlightSelectionMatches: {showToken: /\w/}
 	    });
	  ed.setValue(tabContent); // this line is to add content to the codemirror when is a textarea


	    var currTabInfo = {
	        id: id, 
		pos: this.tabCounter, 
	        label: label, 
	        editor: ed,
	        edArea: this.tabs.find("#"+tabTag+"-ed")[0],
	        visible: true,
		panel: panel,
		content: content,
		markers: {}
	    };

	    this.tabInfoByPos[currTabInfo.pos] = currTabInfo;
	    this.tabInfoById[id] = currTabInfo;
	    this.tabCounter++;
	    this.tabs.tabs( "refresh" );
	    this.switchTab(id);
	},

	//
	hideTab: 
        function(id) {

	    var tabTag = this.tabId_to_tabTag(id);
	    var tabInfo = this.tabInfoById[id];

	    // TBD -- check if the tab is not hidden already

	    // if we are hiding the current tab, then switch to the next
	    // or previous one first
	    if ( this.tabs.tabs( "option", "active" ) == tabInfo.pos ) {
		if ( this.tabInfoByPos[tabInfo.pos+1] ) 
		    this.switchTab( this.tabInfoByPos[tabInfo.pos+1].id );
		else if ( this.tabInfoByPos[tabInfo.pos-1] )
		    this.switchTab( this.tabInfoByPos[tabInfo.pos-1].id );
	    }

	    tabInfo.visible = false;

	    tabInfo.panel.detach()
	    tabInfo.content.detach()

	    this.tabs.tabs( "refresh" );
	    
	    this.tabInfoByPos.splice(tabInfo.pos,1);

	    for(var i=tabInfo.pos; i<this.tabInfoByPos.length; i++)
		this.tabInfoByPos[i].pos--;
	    
	    this.tabCounter--;
	    if ( this.tabCounter == 0 ) this.currTabId = null;
	},
	updateContent:
	function(id,content) {
	  var tabInfo = this.tabInfoById[id];
	  tabInfo.content = content;
	  tabInfo.editor.setValue(content);
	  this.tabInfoByPos[tabInfo.pos] = tabInfo;
	},
	updateTitle:
	function(id,title) {
	  var tabInfo = this.tabInfoById[id];
	  var tabTag = this.tabId_to_tabTag(id);
	  tabInfo.label = title;
	  $("li#tablabel-"+tabTag+"> a ").html(title);
	  this.tabInfoByPos[tabInfo.pos] = tabInfo;
	},
	//
	showTab: 
        function(id) {
	    var tabTag = this.tabId_to_tabTag(id);
	    var tabInfo = this.tabInfoById[id];
	    if ( tabInfo.visible ) {
		this.switchTab(id);    // just switch when the tab is visible
	    } else {


		this.tabs.find( ".ui-tabs-nav" ).append( tabInfo.panel  );
		this.tabs.append( tabInfo.content );

		tabInfo.panel.show();
		tabInfo.content.show();

		tabInfo.visible = true;
		tabInfo.pos = this.tabCounter;
		this.tabInfoByPos[tabInfo.pos] = tabInfo;
		this.tabCounter++;
		this.tabs.tabs( "refresh" );

		this.switchTab(id);
	    }
	},


	//
	expandTab:
	function(id) {
	    var self = this;
	    this.hideTab(id);
	    var tabTag = this.tabId_to_tabTag(id);
	    var tabInfo = this.tabInfoById[id];
	    
	    $("<div></div>").append($(tabInfo.content))
		.dialog({
		    title: tabInfo.label,
		    height: $(document).height()*0.8,
		    maxHeight: $(document).height()*0.8,
		    beforeClose: function( event, ui ) {
		      //tabInfo.content.find(".CodeMirror").removeClass("ei-codearea-content-expanded");
		      tabInfo.content.removeClass("ei-codearea-content-expanded");
		      self.showTab(id);
		    }
		});
	    //tabInfo.content.find(".CodeMirror").addClass("ei-codearea-content-expanded");
	    tabInfo.content.addClass("ei-codearea-content-expanded");

	    tabInfo.content.show();
	},


	     //
	getTabContent:
	function(id) {
	    var tabTag = this.tabId_to_tabTag(id);
	    var tabInfo = this.tabInfoById[id];

	    return tabInfo.editor.getValue();
	},


	//
	highlightLines: 
        function(id, hInfo ) {

	    if ( !Number(id) )   
		id = this.filemanager.getIdByPath(id);

	    if(id < 0 ) {
		throw "highlightLines: invalid file name";
	    }

	    var tabInfo = this.tabInfoById[id];
	  
	    return new HighlightLinesWidget({
		lines: hInfo.lines,
		color: hInfo.color,
		outclass: hInfo.outclass,
		editor: tabInfo.editor
	    });
	},
	
	//
	marker:
	function(id, markerInfo) {
	    if ( !Number(id) )   
		id = this.filemanager.getIdByPath(id);

	    if(id < 0 ) {
		throw "marker: invalid file name";
	    }
	    
	    // open the file, i.e., make the tab available if it is closed
	    this.filemanager.openFile(id);

	    // get the tab information
	    var tabInfo = this.tabInfoById[id];
	    var lines = markerInfo.lines;
	    var gutter = markerInfo.gutter;
	  if(!tabInfo.markers[gutter])
	    tabInfo.markers[gutter] = {};
	    var markers = new Array();
	    var visited = {};
	    for(var j = 0; j < lines.length; j++){
	      for(var line = lines[j].init.line; line <= lines[j].end.line; line++){
		if(!tabInfo.markers[gutter][line]){
		  var markerWidgetInfo = {
		    lines    : line,
		    outputmanager : markerInfo.outputmanager,
		    content  : markerInfo.content, 
		    outclass : markerInfo.outclass,
		    actions  : markerInfo.actions,
		    onclick  : markerInfo.onclick,
		    gutter   : markerInfo.gutter,
		    editor   : tabInfo.editor
		  };
		  tabInfo.markers[gutter][line] = new MarkerWidget( markerWidgetInfo );
		}else{
		  tabInfo.markers[gutter][line].addInfo(markerInfo);
		}
		if(!visited[line]){
		  markers[markers.length] = tabInfo.markers[gutter][line];
		  visited[line] = true;
		}
	      }
	    }
	    return markers; 
	},

	removeMarkers:
	function(id,lines,gutter){
	  if ( !Number(id) )   
	    id = this.filemanager.getIdByPath(id);
	  // get the tab information
	  var tabInfo = this.tabInfoById[id];
	  if(tabInfo.markers[gutter]){
	    for(var j = 0; j < lines.length; j++){
	      for(var line = lines[j].init.line; line <= lines[j].end.line; line++){
		tabInfo.markers[gutter][line] = null;
	      }
	    }
	  }
	  this.tabInfoById[id] = tabInfo;

	},

	//
	linewidget: 
	function(id, widgetInfo) {
	    if ( !Number(id) )   
		id = this.filemanager.getIdByPath(id);
	    if(id < 0 ) {
		throw "linewidget: invalid file name";
	    }

	    var tabInfo = this.tabInfoById[id];
	    var lines = widgetInfo.lines;
	    var widgets = new Array();
	    for(var j = 0; j < lines.length; j++){
	      for(var line = lines[j].init.line; line <= lines[j].end.line; line++){
		widgets[widgets.length] = new InlinedMarkerWidget({
		    lines: line, 
		    content: widgetInfo.content,
		    outclass: widgetInfo.outclass,
		    editor: tabInfo.editor
		  });
	      }
	    }
	    return widgets;
	},

	//
	getCurrentTabId:
	function() {
	    return this.currTabId;
	}

    };

    return CodeArea;

})();

