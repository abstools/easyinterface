/*
  HTML content environment
*/

window.HTMLContent = (function() {
    "use strict";
  var HTMLcount = 0;
    HTMLContent.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	var format = c.attr(_ei.outlang.syntax.format);
      
	if ( tag != _ei.outlang.syntax.content || format != _ei.outlang.syntax.htmlcontent ) return null;

	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;
        var stData = {};
        stData.execid = c.attr(_ei.outlang.syntax.streamid) || null;
        stData.extension = c.attr(_ei.outlang.syntax.streamext) || "ei";
        stData.action = c.attr(_ei.outlang.syntax.streamaction) || "prepend";
        stData.time = c.attr(_ei.outlang.syntax.streamtime) || 500;
        stData.isStream = (stData.execid != null);
	return new HTMLContent({
	    content: c,
	    outclass: outclass,
	    stData: stData
	});
    }

   function HTMLContent(options) {
     var self = this;
     self.stData = options.stData;
     self.count = HTMLcount;
     HTMLcount++;

     self.content = $('<div id="'+self.getTag()+'"><div class="data"></div></div>');
     $(self.content).find(".data").append( $(options.content).prop('outerHTML') );

     self.streamBttn = $("<button class='ei-console-stream-button'>Streaming...</button>");

     $(self.streamBttn).button({ 
       icons: { primary: "ui-icon-stop"}, 
       text: "stream" 
     }).click( function() { 
       self.disableStreamButton();
       self.doc.off(self.stData.execid,true);
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


   HTMLContent.prototype = {
	constructor: HTMLContent,
        "getDOM":
        function() {
	    return this.content;
	},
	getTag:
	function(){
	  return "htmlcontent"+this.count;
	},

	// MODIFY CONTENT
        replace:
	function(newcontent){
	  var self = this;
	  $(self.content).find(".data").html($(newcontent).text());
	  $("#"+self.getTag()+" > .data").html($(newcontent).text());
	},

        prepend:
	function(newcontent){
	  var self = this;
	  $(self.content).find(".data").prepend($(newcontent).text());
	  $("#"+self.getTag()+" > .data").prepend($(newcontent).text());
	},

        append:
	function(newcontent){
	  var self = this;
	  $(self.content).find(".data").append($(newcontent).text());
	  $("#"+self.getTag()+" > .data").append($(newcontent).text());
	},

	// STREAM INFO
        "isStream":
	function(){
	  return this.stData.isStream;
	},

        getStreamData:
	function(){
	  return this.stData;
	},

	// STREAM BUTTON
       activeStreamButton:
       function(doc,ref){
	 if(!this.isStream())
	    return;
	 this.streamBttn.show();
	 this.refreshBttn.show();
	 this.doc = doc;
	 this.stref= ref;
	 this.enableStreamButton();
       },
       removeStreamButton:
       function(){
	  if(!this.isStream())
	    return;
	 this.streamBttn.hide();
	 this.refreshBttn.hide();
	 this.stData.isStream = false;
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
    
    return HTMLContent;
	
})();
