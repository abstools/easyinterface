/*

AddMarkerCommand:

  This commands adds a marker next to a line in the editor.

Syntax:

  TBD

*/

window.AddMarkerCommand = (function() {
    "use strict";

    // - c is a jquery element that represents a command
    //    
    // - ei_info is a json that encapsultes other information that
    //   might be needed to perform the command, e.g., reference to the
    //   console, editor, etc.

    AddMarkerCommand.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	if ( tag != _ei.outlang.syntax.addmarker ) return null;

	var dest = c.attr(_ei.outlang.syntax.dest) || ei_info.dest;
	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;
	var content  = c.find("> "+_ei.outlang.syntax.content);
	var lines = getLines(c.find("> "+_ei.outlang.syntax.lines));
	var boxtitle  = c.attr( _ei.outlang.syntax.boxtitle );
	var boxwidth  = parseInt(c.attr( _ei.outlang.syntax.boxwidth ));
	var boxheight  = parseInt(c.attr( _ei.outlang.syntax.boxheight ));

	return new AddMarkerCommand({
	    dest: dest,
	    lines: lines,
	    boxtitle: boxtitle, 
	    boxwidth: boxwidth,
	    boxheight: boxheight,
	    outclass: outclass, 
	    content: content,
	    codearea: ei_info.codearea
	});
    };

    function AddMarkerCommand(options) {	
	this.dest = options.dest;
	this.codearea = options.codearea;
	this.lines = options.lines;
	this.outclass = options.outclass;
	this.msg = options.content
	this.format = options.format;
	this.content = options.content;
	this.boxtitle = options.boxtitle;
	this.boxwidth = options.boxwidth;
	this.boxheight = options.boxheight;
        this.gutter = "infoGutter";
	this.markerWidgets = this.codearea.marker(this.dest,{
	    boxtitle: this.boxtitle, 
	    boxwidth: this.boxwidth,
	    boxheight: this.boxheight,
	    lines: this.lines,
	    outclass: this.outclass, 
	    content: this.content,
	    gutter: this.gutter
	});

    };

    AddMarkerCommand.prototype = {
	constructor: AddMarkerCommand,

	//
	"do":
	function() {
	  $(this.markerWidgets).each(function(){
	    this.do();
	  });
	},

	//
	"undo":
	function() {
	  $(this.markerWidgets).each(function(){
	    this.undo();
	  });
	  this.codearea.removeMarkers(this.dest,this.lines,this.gutter);
	}
    }

    return AddMarkerCommand;

})();
