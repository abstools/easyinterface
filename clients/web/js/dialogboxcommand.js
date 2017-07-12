window.DialogBoxCommand = (function() {
    "use strict";

    DialogBoxCommand.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	if ( tag != _ei.outlang.syntax.dialogbox ) return null;

	var outclass = c.attr( _ei.outlang.syntax.outclass ) || ei_info.outclass;
	var boxtitle  = c.attr( _ei.outlang.syntax.boxtitle ) || "Dialog Box";
	var boxwidth  = parseInt(c.attr( _ei.outlang.syntax.boxwidth )) || 500;
	var boxheight  = parseInt(c.attr( _ei.outlang.syntax.boxheight )) || 250;

	var content   = c.find("> " + _ei.outlang.syntax.content );
	return new DialogBoxCommand({
	    outclass: outclass, 
	    boxtitle: boxtitle, 
	    boxwidth: boxwidth,
	    boxheight: boxheight,
	    content: content
	});
    }

    function DialogBoxCommand(options) {	
	this.boxtitle = options.boxtitle;
	this.boxwidth = options.boxwidth;
	this.boxheight = options.boxheight;

	this.msg = $("<div title='"+this.boxtitle+"'></div>");
	this.content = new DocContent({
	    content: options.content,
	    outclass: options.outclass
	}).getDOM();

	this.msg.append( this.content );
	this.dialogBox = null;
    };

    DialogBoxCommand.prototype = {
	constructor: DialogBoxCommand,

	//
	"do":
	function() {
	    if ( !this.dialogBox ) {
		this.dialogBox = $(this.msg).dialog({
		width: this.boxwidth,
		height: this.boxheight
		});
	    } else {
		this.dialogBox.dialog("open");
	    }
	},

	"undo":
	function() {
	    if ( this.dialogBox ) {
		this.dialogBox.dialog("destroy").remove();
	      this.dialogBox = null;
	    }
	}
    }

    return DialogBoxCommand;

})();
