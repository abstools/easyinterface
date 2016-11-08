window.TextContent = (function() {
    "use strict";
  var TEXTcount = 0;
    TextContent.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	var format = c.attr(_ei.outlang.syntax.format) || _ei.outlang.syntax.textcontent;

	if ( tag != _ei.outlang.syntax.content || format != _ei.outlang.syntax.textcontent ) return null;

	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;
      var stData = {};
        stData.execid = c.attr(_ei.outlang.syntax.streamid);
        stData.extension = c.attr(_ei.outlang.syntax.streamext) || "ei";
        stData.action = c.attr(_ei.outlang.syntax.streamaction) || "prepend";
        stData.time = c.attr(_ei.outlang.syntax.streamtime) || 500;
        stData.isStream = (stData.execid != null);
	return new TextContent({
	    content: c,
	    outclass: outclass,
	    stData: stData
	});
    }

   function TextContent(options) {
     var self = this;
     self.stData = options.stData;
     self.count = TEXTcount;
     TEXTcount++;

     self.content = $('<div id="'+self.getTag()+'"><div class="data"></div></div>');
     self.text = $(options.content).text();
     self.text = self.text.replace(/>/g,"&gt;");
     self.text = self.text.replace(/</g,"&lt;");
     $(self.content).find(".data").append( "<div class='preformatted'><pre>"+self.text+"</pre></div>" );

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


   TextContent.prototype = {
	constructor: TextContent,

       //
        "getDOM":
        function() {
	    return this.content;
	},
	getTag:
	function(){
	  return "textcontent"+this.count;
	},

	// MODIFY CONTENT
        replace:
	function(newcontent){
	  var self = this;

	  self.text = $(newcontent).text();
	  self.text = self.text.replace(/\>/g,"&gt;");
	  self.text = self.text.replace(/\</g,"&lt;");
	  $(self.content).find(".data").html( "<div class='preformatted'><pre>"+self.text+"</pre></div>" );
	  $("#"+self.getTag()+" > .data").html( "<div class='preformatted'><pre>"+self.text+"</pre></div>" );
	},

        prepend:
	function(newcontent){
	  var self = this;
	  var text2 = $(newcontent).text();
	  text2 = text2.replace(/\>/g,"&gt;");
	  text2 = text2.replace(/\</g,"&lt;");
	  self.text = self.text.replace(/\>/g,"&gt;");
	  self.text = self.text.replace(/\</g,"&lt;");
	  var magic = $("<div>"+text2 +""+self.text+"</div>");
	  self.replace(magic);
	},

        append:
	function(newcontent){
	  var self = this;
	  var text2 = $(newcontent).text();
	  text2 = text2.replace(/\>/g,"&gt;");
	  text2 = text2.replace(/\</g,"&lt;");
	  self.text = self.text.replace(/\>/g,"&gt;");
	  self.text = self.text.replace(/\</g,"&lt;");
	  var magic = $("<div>"+self.text+""+text2+"</div>");
	  self.replace(magic);
	},

	// STREAM INFO
        isStream:
	function(){
	  return this.stData.isStream;
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
    
    return TextContent;
	
})();
