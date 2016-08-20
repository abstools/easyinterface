window.MarkerWidget = (function() {
    "use strict";

    function MarkerWidget(options) {	
        this.outputmanager = options.outputmanager;
	this.editor   = options.editor;
	this.gutter   = options.gutter;
	this.outclass = options.outclass;
	this.actions  = new Array();
      if(options.actions)
	this.actions[0] = options.actions;
	this.lines    = options.lines;
	this.boxtitle = options.boxtitle || "Expanded Tooltip";
	this.boxwidth = options.boxwidth || 200;
	this.boxheight = options.boxheight || 200;


	if ( options.content ) {
	    this.content  = new DocContent({
		content: options.content,
		outclass: options.outclass
	    }).getDOM();
	}
	else {
	    this.content = null;
	}

	this.marker = null;
    };

    MarkerWidget.prototype = {
	constructor: MarkerWidget,

	//
	setOptions:
	function(options) {

	},

	//
	"do":
	function() {
	    var self = this;
	    var cssClass;

	    switch ( this.outclass ) {
	    case "warning" : cssClass="ui-icon ui-icon-alert"; break;
	    case "error"   : cssClass="ui-icon ui-icon-circle-close"; break;
	    case "arrow"   : cssClass="ui-icon ui-icon-arrowthick-1-e"; break;
	    default:
		cssClass = "ui-icon ui-icon-info";
	    }


	    self.marker = $("<div><span class='"+cssClass+"'></span></div>");
	    if ( self.content ) {
	      var c = $("<div><span class='markerToolTip'></span></div>").append(self.content);
	      self.marker.tooltip({ 
		track: false, 
		tooltipClass: "markerToolTip",
		items: self.marker.find("span"),
		content: c.prop('outerHTML')
	      }).dblclick( function() { 
		var self1 = this;
		self.marker.tooltip({ disabled: true });
		c.dialog( { title: self.boxtitle,
			    width: self.boxwidth,
			    height: self.boxheight,
			 //   open: function() { $('.markerToolTip',this).html(self.content.clone()); },
			    close: function( event, ui ) {  self.marker.tooltip({ disabled: false }); }});
	      });
	    }
	    if ( self.actions && self.outputmanager) {
	      self.marker.click( function(ev,ui,concat){ self.outputmanager.performActions(self.actions,concat);} );
	    }
	    self.editor.setGutterMarker(
	      self.lines,
	      self.gutter,
	      self.marker[0] // !!the [0] is needed to get the first element of the jquery element!!
	    );

	},

	selectMarker:
	function() {
	  var i = 0;
	  this.marker.addClass('highlightline');
	},

	unselectMarker:
	function() {
	  var i = 0;
	  this.marker.removeClass('highlightline');
	},

	addInfo:
	function(newInfo) {
	  var self = this;
	  // CONTENT
	  var precontent  = new DocContent({
	    content: newInfo.content
	  }).getDOM();
	  self.content = self.content.add(precontent);
	  if(self.marker)
	    self.marker.tooltip("option", "content", self.content);
	  // ONCLICK
	  if(newInfo.actions){
	    self.actions[self.actions.length] = newInfo.actions;
	  }
	  if(!self.outputmanager)
	    self.outputmanager = newInfo.outputmanager;
	  if(self.marker && self.actions && self.outputmanager){
	    self.marker.click( function(ev,ui,concat){ self.outputmanager.performActions(self.actions,concat);} );
	  }
	},
	     
	"undo":
	function() {
	  var self = this;
	  var i = 0;
	  this.editor.setGutterMarker(
	    self.lines,
	    self.gutter,
	    null
	  );
	}
    }

    return MarkerWidget;

})();
