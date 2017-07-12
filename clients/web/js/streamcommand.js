/*
   StreamCommand:

   This command connect with an stream application

   Syntax:

   TBD

 */

window.StreamCommand = (function() {
  "use strict";

  StreamCommand.parse = function(c, ei_info) { 

    var tag = c[0].tagName;

    if ( tag != _ei.outlang.syntax.stream ) return null;

    var outclass =  c.attr( _ei.outlang.syntax.outclass ) || ei_info.outclass;
    var execid  = c.attr( _ei.outlang.syntax.execid );
    var consolTitle = c.attr( _ei.outlang.syntax.consoletitle ) || "Stream "+execid;
    var consoleId = c.attr( _ei.outlang.syntax.consoleid ) || execid;//|| ei_info.defaultConsoleId;
    var time  = parseInt(c.attr( _ei.outlang.syntax.time )) || 3000;
    var position  = c.attr( _ei.outlang.syntax.streamposition ) || "append";
    var content = c.find("> "+_ei.outlang.syntax.content);
    
    return new StreamCommand({
      outputmanager: ei_info.outputmanager,
      console: ei_info.console,
      consoleId: consoleId,
      consoleTitle: consolTitle,
      execid: execid,
      time: time,
      position: position,
      content: content,
      outclass: outclass,
      server: ei_info.server
    });
  };

  function StreamCommand(options) {	
    this.console = options.console;
    this.consoleId = options.consoleId;
    this.consoleTitle = options.consoleTitle;
    this.execid = options.execid;
    this.position = options.position;
    this.time = options.time || 5;
    this.server = options.server;
    this.outputmanager = options.outputmanager;
    this.event = null;
    this.outclass = options.outclass;
    this.content = $("<div id='stream-"+this.execid+"'><div class='stream-output'></div></div>");
    $(this.content).prepend(new DocContent({ 
      content: options.content,
      outclass: options.outclass
    }).getDOM());
    this.isdone = false;
  };

  StreamCommand.prototype = {
    constructor: StreamCommand,

	 //
    "do":
    function() {
      var self = this;
      if ( !this.isdone ) {
	if ( ! this.console.existWin( this.consoleId ) ) {
	  this.console.createWin(this.consoleId, this.consoleTitle);
	}
	this.console.addContentToWin(this.consoleId, this.content);
	this.console.addStreamButton(this.consoleId,this);
	this.isdone = true;
	this.event = window.setTimeout(function(){
	  self.requestChunks();}, 0);
      } else {
	// TBD - just make it visible
      }
    },
    responseChunks:
    function(data){
      var self = this;
      var ei_out = $("ei_stream",data);
      var empty = false;
      var states = $("ei_stream",data).attr("state").split(" ");
      $(states).each(function(k,v){
	if (v == "terminated" || v == "nostream")
	  self.off(false);
	if (v == "empty")
	  empty = true;
      });
      if(!empty){
	//self.outputmanager.output(data,self.server,true);
	var newcontent = new DocContent({ 
	  content: $(ei_out).find("> "+_ei.outlang.syntax.content),
	  outclass: "text"
	}).getDOM();
	if(self.position == "prepend")
	  $("#stream-"+self.execid+ "> .stream-output").prepend(newcontent);
	else if(self.position == "append")
	  $("#stream-"+self.execid+ "> .stream-output").append(newcontent);
	else
	  $("#stream-"+self.execid+ "> .stream-output").prepend(newcontent);
      }
    },

	 //
    off:
    function(kill){
      if(this.event != null){
	window.clearTimeout(this.event);
	if(kill){
	  this.sendKill();
	}else{
	  this.console.removeStreamButton(this.consoleId);
	}
      }
      this.event = null;
    },

	 //
    requestChunks:
    function(){
      var self = this;
      if(self.event){
	var jsonParams = {
	  "command":    _ei.serverCommand.stream.get,
	  "exec_id":     self.execid,
	  "extension":   "ei"
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
		 self.responseChunks(data);
	       }).error(function(data) {
		 if ( _ei.debug ) {
		   console.log("HTTP Request error occurred: ");
		   console.log(data);
		 }
	    	 self.responseChunks(data);
	       });
	self.event = window.setTimeout(function(){
	  self.requestChunks();}, self.time);
      }else{
	self.off(false);
      }
    },

    sendKill:
    function(){
      this.console.disableStreamButton(this.consoleId);
      var self = this;
      var jsonParams = {
	"command":    _ei.serverCommand.stream.kill,
	"exec_id":     self.execid
      };
      $.post(self.server,
	     {
	       eirequest: jsonParams
	     }).done(function(){
	       self.console.removeStreamButton(self.consoleId);
	     }).error(function(){
  	       self.console.enableStreamButton(self.consoleId);
	     });
    },

    "undo":
    function() {
      // Not sure we want to allow undo here, it will create a mess
      //
      this.off(true);
    }
  }

  return StreamCommand;

})();
