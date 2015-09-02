/*
  ChangeContentCommand:

    This command add or change the content of some selectors

  Syntax:

    TBD

*/

window.ChangeContentCommand = (function() {
    "use strict";

    ChangeContentCommand.parse = function(c, ei_info) { 
      var tag = c[0].tagName;
      
      if ( tag != _ei.outlang.syntax.changecontent ) return null;
      var ccaction = c.attr( _ei.outlang.syntax.ccaction );
      var elements = c.find("> " + _ei.outlang.syntax.elements );
      var content = c.find("> "+_ei.outlang.syntax.content);
      return new ChangeContentCommand({
	elements: elements,
	ccaction: ccaction,
	content: content
      });
    };

    function ChangeContentCommand(options) {	
      var self = this;
      this.elements = options.elements;
      this.selectors = new Array();
      this.previousContent = new Array();
      this.elements.find("> " + _ei.outlang.syntax.selector).each( function () {
	self.selectors[ self.selectors.length ] = $(this).attr(_ei.outlang.syntax.selectorvalue );
      });
      
      this.ccaction = options.ccaction;
      this.content = new DocContent({ 
	    content: options.content,
	    outclass: options.outclass
	}).getDOM();

	this.added = false;
    };

    ChangeContentCommand.prototype = {
	constructor: ChangeContentCommand,

	//
	"do":
	function() {
	  var self = this;
	    if ( !this.added ) {

	      for(var i=0; i<this.selectors.length; i++) {
		self.previousContent[i] = new Array();
		var j = 0;

		$(this.selectors[i]).each(function() {
		  console.log($(self.selectors[i]),this);
		  self.previousContent[i][j] = $(this).html();
		  if(self.ccaction == "prepend"){
		    $(this).prepend($("div >",self.content));
		  }else if(self.ccaction == "append"){
		    $(this).append($("div >",self.content));
		  }else if(self.ccaction == "replace"){
		    $(this).html($("div >",self.content));
		  }
		  $(this).html($(this).html());
		  j = j+1;
		});
	      }
		this.added = true;
	    } else {
		// TBD - just make it visible
	    }
	},

	"undo":
	function() {
	    // Not sure we want to allow undo here, it will create a mess
	    //
	    // this.content.remove();
	  var self = this;
	  for(var i=0; i<this.selectors.length; i++) {
	    var j = 0;
	    $(this.selectors[i]).each( function() {
	      $(this).html(self.previousContent[i][j]);
	      j = j+1;
	    });
	    this.added = false;
	  }
	}
    }

    return ChangeContentCommand;

})();
