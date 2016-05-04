/*
  A class that represent a sequence of content environments. Once
  parsed, it allows getting back a corresponding DOM structure and
  make it visible/invisible.
*/

window.DocContent = (function() {
    "use strict";

   function DocContent(options) {	
       var self = this;

       this.ContentCollection =	[ 
	    HTMLContent, 
	    SVGContent,
	    TextContent,
	    DygraphContent
	];

       this.content = $("<div></div>");

       options.content.each( function() {
	   var c = self.parseContent( $(this), {
	       outclass : options.outclass
	   });
	   self.content.append( c.getDOM() );
       });

   }

   DocContent.prototype = {
       constructor: DocContent,

       parseContent:
       function(c, options) {
	   var cobj = null;
	   
	   for( var i=0 ; i<this.ContentCollection.length; i++ ) {
	       cobj = this.ContentCollection[i].parse(c, options);
	       if ( cobj != null )   // we have succeeded to parse 'c' 
		   return cobj;
	   }

	   console.log("Error while parsing content environment:");
	   console.log(c);
	   throw "Parsing a content environment has failed";   
       },

       //
       getDOM:
       function() {
	   return this.content;
       }
   }
    
    return DocContent;
	
})();
