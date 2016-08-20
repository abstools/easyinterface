window.MarkerWidget = (function() {
    "use strict";

    function MarkerWidget(options) {	
	
	this.editor   = options.editor;
	this.gutter   = options.gutter;
	this.outclass = options.outclass;
	this.onclick  = options.onclick;
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
			    open: function() { $('.markerToolTip',this).html(self.content.clone()); },
			    close: function( event, ui ) {  self.marker.tooltip({ disabled: false }); }});
	      });
	    }
	    if ( self.onclick ) {
	      self.marker.click( self.onclick );
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
	  // CONTENT
	  var precontent  = new DocContent({
	    content: newInfo.content
	  }).getDOM();
	  this.content = this.content.add(precontent);
	  if(this.marker)
	    this.marker.tooltip("option", "content", this.content);
	  // ONCLICK
	  if(newInfo.onclick){
	    var temponclick = this.onclick;
	    this.onclick = function(ev,ui){if(temponclick)temponclick(ev,ui);newInfo.onclick(ev,ui);};
	  }
	  if(this.marker ){
	    this.marker.click( this.onclick );
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
