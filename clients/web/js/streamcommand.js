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
	var consolTitle = c.attr( _ei.outlang.syntax.consoletitle );
	var consoleId = c.attr( _ei.outlang.syntax.consoleid ) || ei_info.defaultConsoleId;
        var time  = parseInt(c.attr( _ei.outlang.syntax.time )) || 3000;
        var execid  = c.attr( _ei.outlang.syntax.execid );
	var content = c.find("> "+_ei.outlang.syntax.content);
      
	return new StreamCommand({
	    outputmanager: ei_info.outputmanager,
	    console: ei_info.console,
	    consoleId: consoleId,
	    consoleTitle: consolTitle,
	    execid: execid,
	    time: time,
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
        this.time = options.time || 5;
        this.server = options.server;
        this.outputmanager = options.outputmanager;
        this.event = null;
	this.content = new DocContent({ 
	    content: options.content,
	    outclass: options.outclass
	}).getDOM();
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
	      this.isdone = true;
	      this.event = window.setTimeout(function(){
	      self.requestChunks();}, self.time);
	    } else {
		// TBD - just make it visible
	    }
	},
	responseChunks:
	function(data){
	  var self = this;
	  var ei_out = $("ei_output",data);
	  var empty = false;
	  var states = $("ei_stream",data).attr("state").split(" ");
	  $(states).each(function(k,v){
	    if (v == "finish" || v == "nostream")
	      self.off(false);
	    if (v == "nonewfiles")
	      empty = true;
	  });
	  if(!empty)
	    self.outputmanager.output(data,self.server,true);	  
	},

	     //
	off:
	function(kill){
	  console.log("off");
	  if(this.event != null){
	    window.clearTimeout(this.event);
	    if(kill)
	      this.sendKill();
	  }
	  this.event = null;
	},

	     //
	requestChunks:
	function(){
	  var self = this;
	  var jsonParams = {
	    "command":    _ei.serverCommand.stream.get,
	    "exec_id":     self.execid
	  };
	   $.post(self.server,
		   {
		       eirequest: jsonParams
		   }).done(function(data) {
		     try{
		       data = jQuery.parseXML(data);
		       if ( _ei.debug ) console.log(data);
		       self.responseChunks(data);
		     }catch(e){
		       self.responseChunks(e);
		     }
	    	   }).error(function(data) {
		       if ( _ei.debug ) {
			   console.log("HTTP Request error occurred: ");
			   console.log(data);
		       }
	    	       self.responseChunks(data);
	    	   });
	  self.event = window.setTimeout(function(){
	    self.requestChunks();}, self.time);
	},

	sendKill:
	function(){
	  var self = this;
	  var jsonParams = {
	    "command":    _ei.serverCommand.stream.kill,
	    "exec_id":     self.execid
	  };
	   $.post(self.server,
		   {
		       eirequest: jsonParams
		   });
	},

	"undo":
	function() {
	    // Not sure we want to allow undo here, it will create a mess
	    //
	}
    }

    return StreamCommand;

})();
