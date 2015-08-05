window.TextContent = (function() {
    "use strict";
    TextContent.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	var format = c.attr(_ei.outlang.syntax.format) || _ei.outlang.syntax.textcontent;

	if ( tag != _ei.outlang.syntax.content || format != _ei.outlang.syntax.textcontent ) return null;

	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;

	return new TextContent({
	    content: c,
	    outclass: outclass
	});
    }

   function TextContent(options) {	
       this.content = $("<div></div>");
       var text = $(options.content).text();
       text = text.replace(">","&gt;");
       text = text.replace("<","&lt;");
       this.content.append( "<div class='preformatted'><pre>"+text+"</pre></div>" );
   }


   TextContent.prototype = {
	constructor: TextContent,

       //
        "getDOM":
        function() {
	    return this.content;
	}
   }
    
    return TextContent;
	
})();
