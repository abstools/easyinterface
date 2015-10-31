window.CodeLineAction = (function() {
    "use strict";

    CodeLineAction.parse = function(a, ei_info) { 
	var tag = a[0].tagName;
	if ( tag != _ei.outlang.syntax.oncodelineclick ) return null;

	var dest = a.attr(_ei.outlang.syntax.dest) || ei_info.dest;
	var outclass = a.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;
	var content  = a.find("> "+_ei.outlang.syntax.content);
	var lines = getLines(a.find("> "+_ei.outlang.syntax.lines));
	var autoclean  = a.attr( _ei.outlang.syntax.actionautoclean ) || ei_info.autoclean;

	if ( autoclean == "true" ) 
	    autoclean=true;
	else autoclean=false;

	var boxtitle  = a.attr( _ei.outlang.syntax.boxtitle );
	var boxwidth  = parseInt(a.attr( _ei.outlang.syntax.boxwidth ));
	var boxheight  = parseInt(a.attr( _ei.outlang.syntax.boxheight ));

	var eicommads = a.find("> "+_ei.outlang.syntax.eicommands);

	return new CodeLineAction({
	    dest: dest, 
	    lines: lines,
	    content: content,
	    outclass: outclass,
	    autoclean: autoclean,
	    boxtitle: boxtitle,
	    boxwidth: boxwidth,
	    boxheight: boxheight,
	    eicommands: eicommads,
	    codearea: ei_info.codearea,
	    outputmanager: ei_info.outputmanager,
	    filemanager: ei_info.filemanager,
	    console: ei_info.console,
	    defaultConsoleId: ei_info.defaultConsoleId,
	    server: ei_info.server
	});
    };

    function CodeLineAction(options) {	
	var self = this;

	this.codearea = options.codearea;
	this.lines = options.lines;
	if (options.content.length == 0) 
	    this.content = null;
	else 
	    this.content = options.content;

	this.dest = options.dest;
	this.outputmanager = options.outputmanager;
	this.autoclean = options.autoclean;
	this.boxheight = options.boxheight;
	this.boxwidth = options.boxwidth;

	this.commands = new Set();
	options.eicommands.each( function() {

	    var dest =  $(this).attr( _ei.outlang.syntax.dest ) || options.dest;
	    var outclass =  $(this).attr( _ei.outlang.syntax.outclass ) || options.outclass;

	    $(this).children().each( function() {
		options.outputmanager.parseCommand( $(this), self.commands, {
		    dest : dest,
		    outclass: options.outclass,
		    outputmanager : options.outputmanager,
		    filemanager: options.filemanager,
		    codearea : options.codearea,
		    console  : options.console,
		    defaultConsoleId: options.defaultConsoleId,
		    server : options.server
		});
	    });
	});

	this.markerWidget = this.codearea.marker( this.dest, {
	    boxtitle: this.boxtitle, 
	    boxwidth: this.boxwidth,
	    boxheight: this.boxheight,
	    lines: this.lines,
	    outclass: "arrow", 
	    content: this.content,
	    gutter: "actionGutter",
	    onclick: function() { self.outputmanager.performAction(self); }
	    });
	};

    CodeLineAction.prototype = {
	constructor: CodeLineAction,

	//
	activate:
	function() {
	    this.markerWidget.do();
	},

	//
	deActivate:
	function() {
	    this.undoAction();
	    this.markerWidget.undo();
	},

	//
	doAction:
	function() {
	    this.markerWidget.selectMarker();
	    if ( this.commands )
		this.commands.asyncIterate( function(c) { c.do(); } );
	},

	//
	undoAction:
	function() {
	    this.markerWidget.unselectMarker();
	    if ( this.commands )
		this.commands.asyncIterate( function(c) { c.undo(); } );
	}

    }

    return CodeLineAction;

})();
