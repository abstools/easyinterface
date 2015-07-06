window.SetCSSCommand = (function() {
    "use strict";

    SetCSSCommand.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	if ( tag !=  _ei.outlang.syntax.setcss ) return null;

	var elements = c.find("> " + _ei.outlang.syntax.elements );
	var cssproperties = c.find("> " + _ei.outlang.syntax.cssproperties );

	return new SetCSSCommand({ 
	    elements: elements, 
	    cssproperties: cssproperties 
	});
    };

    function SetCSSCommand(options) {	
	var self = this;

	this.selectors = new Array();
	this.cssproperties = new Array();
		
	options.elements.find("> " + _ei.outlang.syntax.selector).each( function () {
	    self.selectors[ self.selectors.length ] = $(this).attr(_ei.outlang.syntax.selectorvalue );
	});

	options.cssproperties.find("> " + _ei.outlang.syntax.cssproperty).each( function () {
	    self.cssproperties[ self.cssproperties.length ] = {
		name: $(this).attr(_ei.outlang.syntax.csspropertyname),
		value: $(this).attr(_ei.outlang.syntax.csspropertyvalue),
		oldvalue: null
	    }
	});
    };

    SetCSSCommand.prototype = {
	constructor: SetCSSCommand,

	//
	"do":
	function() {
	    var self = this;

	    for(var i=0; i<this.selectors.length; i++) {
		$(this.selectors[i]).each( function() {
			var obj = $(this);
			for(var j=0; j<self.cssproperties.length; j++) {
			    self.cssproperties[j].oldvalue = obj.attr(self.cssproperties[j].name);
			    obj.css( self.cssproperties[j].name, self.cssproperties[j].value );
			}
		    });
	    }
	},

	//
	"undo":
	function() {
	    var self = this;
	    for(var i=0; i<this.selectors.length; i++) {
		$(this.selectors[i]).each( function() {
			var obj = $(this);
			for(var j=0; j<self.properties.length; j++) {
			    obj.css( self.properties[j].name, self.properties[j].oldvalue );
			}
		    });
	    }
	}
    }

    return SetCSSCommand;

})();
