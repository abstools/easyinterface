window.InlinedMarkerWidget = (function() {
    "use strict";
    
    function InlinedMarkerWidget(options) {	

	this.lineWidget = null;

	this.editor = options.editor;
	this.lines = options.lines;
	this.outclass = options.outclass;
	this.content = new DocContent({
	    content: options.content,
	    outclass: options.outclass
	}).getDOM();

    };

    InlinedMarkerWidget.prototype = {
	constructor: InlinedMarkerWidget,

	//
	"do":
	function() {
	  var self = this;
	  var cssDivClass;
	  var cssIconClass;
	  var symbol = '!';
	  switch ( self.outclass ) {
	    case "error" : 
	      cssDivClass="lint-error"; 
	      cssIconClass="lint-error-icon"; 
	      symbol = "!!";
	      break;
	    case "warning" : 
	      cssDivClass="lint-warning"; 
	      cssIconClass="lint-warning-icon"; 
	      symbol = "!";
	      break;
	    case "info"    : 
	    default:
	      cssDivClass="lint-info"; 
	      cssIconClass="lint-info-icon"; 
	      symbol = "?";
	  }
	  var wid = document.createElement("div");
	  var icon = wid.appendChild(document.createElement("span"));
	  icon.innerHTML = symbol;
	  icon.className = cssIconClass;
	  wid.appendChild(document.createTextNode(this.content.text()));
	    
	    wid.className = cssDivClass;
	  this.lineWidget = this.editor.addLineWidget(
	    this.lines, 
	    wid,
	    {
	      above:true,
	      coverGutter: false, 
	      noHScroll: true
	    });
	},

	"undo":
	function() {
	  if(this.lineWidget)
	    this.lineWidget.clear();
	  this.lineWidget = null;
	}
    }

    return InlinedMarkerWidget;

})();
