window.OnClickAction = (function() {
    "use strict";

    OnClickAction.parse = function(a, ei_info) { 

	var tag = a[0].tagName;
	if ( tag != _ei.outlang.syntax.onclick ) return null;
	
	var dest = a.attr(_ei.outlang.syntax.dest) || ei_info.dest;
	var outclass = a.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;
	var autoclean  = a.attr( _ei.outlang.syntax.actionautoclean ) || ei_info.autoclean;
	var elements = a.find("> " + _ei.outlang.syntax.elements );
	var eicommands = a.find("> "+_ei.outlang.syntax.eicommands );
	if ( autoclean == "false" ) 
	    autoclean=false;
	else 
	    autoclean=true;
	return new OnClickAction({
	    eicommands: eicommands,
	    elements: elements,
	    outputmanager: ei_info.outputmanager,
	    outclass: outclass,
	    autoclean: autoclean,
	    dest: dest,
	    server: ei_info.server
       });
    };

    function OnClickAction(options) {	

	var self = this;

	this.codearea = options.codearea;
	this.lines = options.lines;
	this.dest = options.dest;
	this.outputmanager = options.outputmanager;
	this.autoclean = options.autoclean;

	this.commands = new Set();
	this.selectors = new Array();

	this.isActive = false;

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
		    server: options.server
		});
	    });
	});
	
	options.elements.find("> " + _ei.outlang.syntax.selector).each( function () {
	    self.selectors[ self.selectors.length ] = {
		value: $(this).attr( _ei.outlang.syntax.selectorvalue ),
		parent:  $(this).attr("parent")
	    }
	});

    };

    OnClickAction.prototype = {
	constructor: OnClickAction,

	activate:
	function() {
	    var self = this;

	    this.isActive = true;

	    for(var i=0; i<this.selectors.length; i++) {
		$(this.selectors[i].value).each( function() {
		    var elem = self.selectors[i].parent != undefined ? $(this).parent() : $(this);
		    
		    if ( elem.prop("onclickcallbacks") == undefined ) {
		    	elem.prop("onclickcallbacks", new Array());
			$(elem).on( "click", function(ev,ui,concat) { 
			    self.outputmanager.performActions( $(this).prop("onclickcallbacks"),concat); 
			});
		    }
		    var callbacks = elem.prop("onclickcallbacks");
		    callbacks[ callbacks.length ] = self;
		});
	    }

	    
	},
	//
	autoClean:
	function(){
	  return this.autoclean;
	},

	//
	deActivate:
	function() {
	    this.isActive = false;
	},

	//
	doAction:
	function() {
	    if ( this.isActive && this.commands )
		this.commands.asyncIterate( function(c) { c.do(); });
	},

	//
	undoAction:
	function() {
	    if ( this.isActive && this.commands )
		this.commands.asyncIterate( function(c) { c.undo(); });
	}

    }

    return OnClickAction;

})();
