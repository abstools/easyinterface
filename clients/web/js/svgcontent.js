window.SVGContent = (function() {
    "use strict";
  var SVGcount = 0;
    SVGContent.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	var format = c.attr('format');

	if ( tag != _ei.outlang.syntax.content || format != _ei.outlang.syntax.svgcontent ) return null;

	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;
      var stData = {};
        stData.execid = c.attr(_ei.outlang.syntax.streamid) || null;
        stData.extension = c.attr(_ei.outlang.syntax.streamext) || "ei";
        stData.action = c.attr(_ei.outlang.syntax.streamaction) || "prepend";
        stData.time = c.attr(_ei.outlang.syntax.streamtime) || 500;
	return new SVGContent({
	    content: c,
	    outclass: outclass,
	    stData: stData
	});
    }

   function SVGContent(options) {
     var self = this;
       self.stData = options.stData;
     self.count = SVGcount;
     SVGcount++;
     self.content = $('<div id="'+self.getTag()+'"></div>');


       self.svgEnv = $(options.content).find("> svg");

       if ( self.svgEnv.length != 1 ) {
	   throw "an svg content environment must include exactly one svg environment inside";
       }
	   
       self.svgEnv = self.svgEnv.prop('outerHTML');
       self.svgEnv = $(self.svgEnv);
       self.svgEnv.css("overflow","auto");
       self.content.append( self.svgEnv );
       self.svgEnv.svg();

     self.streamBttn = $("<button class='ei-console-stream-button'>Streaming...</button>");
     $(self.streamBttn).button({ 
       icons: { primary: "ui-icon-stop"}, 
       text: "stream" 
     }).click( function() { 
       self.disableStreamButton();
       self.off(self.count,true);
     });
     $(self.streamBttn).hide();

     self.refreshBttn = $("<button class='ei-console-refresh-button'>Refresh</button>");
     $(self.refreshBttn).button({ 
       icons: { primary: "ui-icon-arrowrefresh-1-s"}, 
       text: "refresh" 
     }).click( function() { 
       self.doc.requestChunks(self.doc,self.stref);
     });
     $(self.refreshBttn).hide();

     if(self.isStream()){
       self.content.prepend(self.streamBttn);
       self.content.prepend(self.refreshBttn);
     }
   }


   SVGContent.prototype = {
	constructor: SVGContent,
        "getDOM":
        function() {
	    return this.content;
	},
	getTag:
	function(){
	  return "svgcontent"+this.count;
	},

	// MODIFY CONTENT
        replace:
	function(newcontent){
	  var self = this;

	  self.content = $('<div id="'+self.getTag()+'"></div>');
	  self.svgEnv = $(newcontent).find("> svg");

	  if ( self.svgEnv.length != 1 ) {
	    throw "an svg content environment must include exactly one svg environment inside";
	  }
	   
	  self.svgEnv = self.svgEnv.prop('outerHTML');
	  self.svgEnv = $(self.svgEnv);
	  self.svgEnv.css("overflow","auto");
	  self.content.append( self.svgEnv );
	  self.svgEnv.svg();

	  $("#"+self.getTag()).html($("div>",self.content));
	},

        prepend:
	function(newcontent){
	  var self = this;
	  var cc = $(newcontent).find("> svg");
	  if ( self.svgEnv.length != 1 ) {
	    throw "an svg content environment must include exactly one svg environment inside";
	  }
	  cc = cc.prop('innerHTML');
	  var magic = $("<svg>"+cc +""+self.svgEnv.prop('innerHTML')+"</svg>");
	  self.replace(magic);
	},

        append:
	function(newcontent){
	  var self = this;
	  var cc = $(newcontent).find("> svg");
	  if ( self.svgEnv.length != 1 ) {
	    throw "an svg content environment must include exactly one svg environment inside";
	  }
	  cc = cc.prop('innerHTML');
	  var magic = $("<svg>"+self.svgEnv.prop('innerHTML')+""+cc +"</svg>");

	  self.replace(magic);
	},

	// STREAM INFO
        "isStream":
	function(){
	  return (this.stData.execid != null);
	},

        getStreamData:
	function(){
	  return this.stData;
	},

	// STREAM BUTTON
       activeStreamButton:
       function(doc){
	 if(!this.isStream())
	    return;
	 this.streamBttn.show();
	 this.refreshBttn.show();
	 this.doc = doc;
	 this.enableStreamButton();
       },
       removeStreamButton:
       function(){
	  if(!this.isStream())
	    return;
	 this.streamBttn.hide();
	 this.refreshBttn.hide();
	 this.stData.execid = null;
	 return;
	 //self.contentArray[num].content.removeStreamButton();
       },

       enableStreamButton:
       function(){
	  if(!this.isStream())
	    return;
	 this.streamBttn.removeAttr("disabled");
	 return;
	 //self.contentArray[num].content.enableStreamButton();
       },

       disableStreamButton:
       function(){
	  if(!this.isStream())
	    return;
	 this.streamBttn.attr("disabled","disabled");
	 return;
	 //self.contentArray[num].content.disableStreamButton();
       }

   }
    
    return SVGContent;
})();
