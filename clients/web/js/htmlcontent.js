/*
  HTML content environment
*/

window.HTMLContent = (function() {
    "use strict";
    HTMLContent.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	var format = c.attr(_ei.outlang.syntax.format);

	if ( tag != _ei.outlang.syntax.content || format != _ei.outlang.syntax.htmlcontent ) return null;

	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;

	return new HTMLContent({
	    content: c,
	    outclass: outclass
	});
    }

   function HTMLContent(options) {	   // TODO: now we simply put the content env into the doc,
       this.content = $("<div></div>");    //       consider taking only one div env
       this.content.append( $(options.content).text());//prop('outerHTML') );
   }


   HTMLContent.prototype = {
	constructor: HTMLContent,
        "getDOM":
        function() {
	    return this.content;
	}
   }
    
    return HTMLContent;
	
})();
