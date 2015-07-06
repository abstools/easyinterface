window.HighlightLinesCommand = (function() {
    "use strict";

    HighlightLinesCommand.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	if ( tag != _ei.outlang.syntax.highlightlines ) return null;

	var outclass = c.attr( _ei.outlang.syntax.outclass ) || ei_info.outclass;
	var dest  = c.attr( _ei.outlang.syntax.dest ) || ei_info.dest;
	var color  = c.attr( _ei.outlang.syntax.color );

	var lines = getLines(c.find("> "+_ei.outlang.syntax.lines));

	return new HighlightLinesCommand({
		  dest: dest, 
		  lines: lines,
	          outclass: outclass,
	          color: color,
		  codearea: ei_info.codearea
	});

    };

    function HighlightLinesCommand(options) {	

	this.codearea = options.codearea;
	this.lines = options.lines;
	this.outclass = options.outclass;
	this.dest = options.dest;
	this.color = options.color;

	this.higlightlinesWidget = 
	    this.codearea.highlightLines(this.dest, {
		lines: this.lines, 
		outclass: this.outclass,
		color: this.color 
	    });
    };

    HighlightLinesCommand.prototype = {
	constructor: HighlightLinesCommand,

	//
	"do":
	function() {
	    this.higlightlinesWidget.do();
	},

	//
	"undo":
	function() {
	    this.higlightlinesWidget.undo();
	}
    }

    return HighlightLinesCommand;

})();
