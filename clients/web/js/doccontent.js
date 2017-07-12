/*
  A class that represent a sequence of content environments. Once
  parsed, it allows getting back a corresponding DOM structure and
  make it visible/invisible.
*/

window.DocContent = (function() {
    "use strict";
   function DocContent(options) {
       var self = this;
       this.contentArray = new Array();
       this.count = 0;
       this.console = options.console;
       this.outputmanager = options.outputmanager;
       this.server = options.server;
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
	   self.contentArray[self.count]={content:c};
	   if(c.isStream()){
	     var num = self.count;
	     var data = c.getStreamData();
	     self.contentArray[num]["data"] = data;
	     self.activeStreamButton(num);
	     self.contentArray[num]["event"] = window.setTimeout(function(){
	       self.requestChunks(self,num);
	     }, 10);
	   }
	 
	 self.content.append( c.getDOM() );
	 self.count++;
       });
   }

   DocContent.prototype = {
       constructor: DocContent,

       parseContent:
       function(c, options) {
	   var cobj = null;
	   
	   for( var i=0 ; i<this.ContentCollection.length; i++ ) {
	       cobj = this.ContentCollection[i].parse(c, options);
	       if ( cobj != null )  // we have succeeded to parse 'c' 
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
       },

       // STREAM FUNCTIONS

       requestChunks:
       function(self,num){
	 var stData = self.contentArray[num]["data"];
	 if(self.contentArray[num].event){
	   var jsonParams = {
	     "command":    _ei.serverCommand.stream.get,
	     "exec_id":     stData.execid,
	     "extension":   stData.extension
	   };
	   $.post(self.server,
		  {
		    eirequest: jsonParams
		  }).done(function(data) {
		    try{
		      data = jQuery.parseXML(data);
		      if ( _ei.debug ) console.log(data);
		    }catch(e){
		      self.outputmanager.output(e,self.server,false);
		    }
		    self.responseChunks(num,data);
		  }).error(function(data) {
		    if ( _ei.debug ) {
		      console.log("HTTP Request error occurred: ");
		      console.log(data);
		    }
	    	    self.responseChunks(num,data);
		  });
	   self.contentArray[num].event = window.setTimeout(function(){
	     self.requestChunks(self,num);}, stData.time);
	 }else{
	   self.off(stData.execid,false);
	 }

       },

	    responseChunks:
       function(num,data){
	 var self = this;
	 var stData = self.contentArray[num]["data"];
	 var ei_out = $("ei_stream",data);
	 var empty = false;
	 var states = $("ei_stream",data).attr("state").split(" ");
	 $(states).each(function(k,v){
	   if (v == "terminated" || v == "nostream"){
	     self.off(stData.execid,false);
	   }
	   if (v == "empty")
	     empty = true;
	 });
	 if(!empty){
	   //self.outputmanager.output(data,self.server,true);
	   var newcontent = $(ei_out).find("> "+_ei.outlang.syntax.content);

	   if(stData.action == "replace")
	     self.contentArray[num].content.replace(newcontent);
	   else if(stData.action == "append")
	     self.contentArray[num].content.append(newcontent);
	   else if(stData.action == "prepend")
	     self.contentArray[num].content.prepend(newcontent);
	 }
       },

	    //
	    off:
       function(execid,kill){
	 var self = this;
	 for(var st=0; st< self.contentArray.length; st++){
	   if(self.contentArray[st].event != null){
	     window.clearTimeout(self.contentArray[st]["data"].event);
	       if(kill && st == 0){
		 self.sendKill(st);
	       }else{
		 self.removeStreamButton(st);
	       }

	   }
	 self.contentArray[st].event = null;
	 }
       },

        sendKill:
       function(num){
	 this.disableStreamButton(num);
	 var self = this;
	 var jsonParams = {
	   "command":    _ei.serverCommand.stream.kill,
	   "exec_id":     self.contentArray[num]["data"].execid
	 };
	 $.post(self.server,
		{
		  eirequest: jsonParams
		}).done(function(){
		  self.removeStreamButton(num);
		}).error(function(){
  		  self.enableStreamButton(num);
		});
	 //self.off(self.contentArray[num]["data"].execid,false);
       },


	activeStreamButton:
       function(num){
	 var self = this;
	 this.contentArray[num].content.activeStreamButton(self,num);
       },

      removeStreamButton:
       function(num){
	 this.contentArray[num].content.removeStreamButton();
       },

       enableStreamButton:
       function(num){
	 this.contentArray[num].content.enableStreamButton();
       },

       disableStreamButton:
       function(num){
	 this.contentArray[num].content.disableStreamButton();
       }


   }
    
    return DocContent;
	
})();
