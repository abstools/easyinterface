window.SVGContent = (function() {
    "use strict";
    SVGContent.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	var format = c.attr('format');

	if ( tag != _ei.outlang.syntax.content || format != _ei.outlang.syntax.svgcontent ) return null;

	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;

	return new SVGContent({
	    content: c,
	    outclass: outclass
	});
    }

   function SVGContent(options) {
       this.content = $("<div></div>");
       var svgEnv = $(options.content).find("> svg");

       if ( svgEnv.length != 1 ) {
	   throw "an svg conetnt environment must include exactly one svg environemt inside";
       }
	   
       svgEnv = svgEnv.prop('outerHTML');
       svgEnv = $(svgEnv);
       svgEnv.css("overflow","auto");
       this.content.append( svgEnv );
       svgEnv.svg();
   }


   SVGContent.prototype = {
	constructor: SVGContent,
        "getDOM":
        function() {
	    return this.content;
	}

   }
    
    return SVGContent;
})();
