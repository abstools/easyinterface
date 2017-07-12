window.AddInLineMarkerCommand = (function() {
    "use strict";

    AddInLineMarkerCommand.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	if ( tag != _ei.outlang.syntax.addinlinemarker ) return null;

	var dest = c.attr(_ei.outlang.syntax.dest) || ei_info.dest;
	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;
	var content  = c.find("> "+_ei.outlang.syntax.content);
	var lines = getLines(c.find("> "+_ei.outlang.syntax.lines));
	
	return new AddInLineMarkerCommand({
	    dest: dest,
	    lines: lines,
	    outclass: outclass, 
	    content: content,
	    codearea: ei_info.codearea
	});
    };

    function AddInLineMarkerCommand(options) {	

	this.codearea = options.codearea;
	this.lines = options.lines;
	this.outclass = options.outclass;
	this.content = options.content
	this.dest = options.dest;

	this.inlinemarker = this.codearea.linewidget( this.dest,{
	    lines: this.lines,
	    outclass: this.outclass, 
	    content: this.content
	});

    };

    AddInLineMarkerCommand.prototype = {
	constructor: AddInLineMarkerCommand,

	//
	"do":
	function() {
	    $(this.inlinemarker).each(function(){
	      this.do();
	    });
	},

	//
	"undo":
	function() {
	    $(this.inlinemarker).each(function(){
	      this.undo();
	    });
	  //this.codearea.removeLineWidget(this.dest,this.lines);
	}
    }

    return AddInLineMarkerCommand;

})();
