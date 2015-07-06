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

	this.markers = new Array();
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


	    for( var i=0; i<this.lines.length; i++) {
		
		// we wrap it with a function to store the current
		// value of i for future use
		//
		(function(i) {
		    self.markers[i] = $("<div><span class='"+cssClass+"'></span></div>");
		
		    if ( self.content ) {
			var c = $("<div><span class='markerToolTip'></span></div>").append(self.content);

			self.markers[i].tooltip({ 
			    track: false, 
			    tooltipClass: "markerToolTip",
			    items: self.markers[i].find("span"),
			    content: c.prop('outerHTML')
			}).dblclick( function() { 
			    var self1 = this;
			    self.markers[i].tooltip({ disabled: true });
			    c.dialog( { title: self.boxtitle,
					width: self.boxwidth,
					height: self.boxheight,
				        close: function( event, ui ) {  self.markers[i].tooltip({ disabled: false }); }});
			});
		    }

		    if ( self.onclick ) {
			self.markers[i].click( self.onclick );
		    }
		    
	      	    self.editor.setGutterMarker(
			self.lines[i].init.line,
			self.gutter,
			self.markers[i][0] // !!the [0] is needed to get the first element of the jquery element!!
		    );
		})(i);
	    }
	},

	selectMarker:
	function() {
	    for( var i=0; i<this.lines.length; i++) {
		this.markers[i].addClass('highlightline');
	    }
	},

	unselectMarker:
	function() {
	    for( var i=0; i<this.lines.length; i++) {
		this.markers[i].removeClass('highlightline');
	    }
	},

	"undo":
	function() {
	    for( var i=0; i<this.lines.length; i++) {
	      	    this.editor.setGutterMarker(
			this.lines[i].init.line,
			this.gutter,
			null
		    );
	    }
	}
    }

    return MarkerWidget;

})();
