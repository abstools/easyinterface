/*
  Dygraph content environment
*/

window.DygraphContent = (function() {
    "use strict";
    DygraphContent.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	var format = c.attr(_ei.outlang.syntax.format);

	if ( tag != _ei.outlang.syntax.content || format != _ei.outlang.syntax.htmlcontent ) return null;

	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;

	return new DygraphContent({
	    content: c,
	    outclass: outclass
	});
    }

   function DygraphContent(options) {	   // TODO: now we simply put the content env into the doc,
       this.content = $("<div></div>");    //       consider taking only one div env
       this.content.append( $(options.content).text());//prop('outerHTML') );
   }


  DygraphContent.prototype = {
	constructor: DygraphContent,
        "getDOM":
        function() {
	    return this.content;
	}
   }
    
    return DygraphContent;
	
})();
