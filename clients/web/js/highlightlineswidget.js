window.HighlightLinesWidget = (function() {
    "use strict";
    
    function HighlightLinesWidget(options) {	
	
	this.editor = options.editor;
	this.outclass = options.outclass || _ei.outlang.syntax.info;
	this.color = options.color;
	this.lines = options.lines;
	this.textmarkers = new Array();
	
    };

    HighlightLinesWidget.prototype = {
	constructor: HighlightLinesWidget,

	//
	"do":
	function() {
	    for(var i=0; i<this.lines.length; i++) {
		if ( !this.textmarkers[i] ) {
		    var l = this.lines[i];

		    if( l.init.ch == null ) {
			l.init.ch = 0;
		    }
		    if( l.end.line == null ) {
			l.end.line = l.init.line;
		    }
		    if( l.end.ch == null ){
			l.end.ch = 0;
			l.end.line++;
		    }
		    this.textmarkers[i] = 
			this.editor.markText(
                            l.init,
			    l.end,
                            {
				className: "highlightline-"+this.outclass,
				inclusiveLeft:true,
				inclusiveRight:true
			    }
			);
		}
	    }
	},

	"undo":
	function() {
	    for( var i=0; i<this.lines.length; i++) {
		if ( this.textmarkers[i] ) {
		    this.textmarkers[i].clear();
		    this.textmarkers[i] = null;
		}
	    }
	}
    }

    return HighlightLinesWidget;

})();
