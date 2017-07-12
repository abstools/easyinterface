window.OutputManager = (function() {
    "use strict";

    function OutputManager(options) {	
	this.CommandsCollection =	[ 
	    PrintOnConsoleCommand, 
	    AddMarkerCommand, 
	    HighlightLinesCommand, 
	    SetCSSCommand, 
	    ChangeContentCommand,
	    AddInLineMarkerCommand, 
	    DialogBoxCommand,
	    WriteFileCommand,
	    DownloadCommand
	];

	this.ActionsCollection =  [
	    CodeLineAction,
	    //TimeLineAction,
	    OnClickAction
	];

	this.console = null;
	this.codearea = null;
	this.setOptions(options);
	this.commands = new Set();
	this.actions = new Set();
	this.lastAction = new Array();
	this.defaultConsoleId = this.console.createWin('default',"Default Console");
	this.console.switchWin( this.defaultConsoleId );

	// last output seen
	this.lastOutput = null;
	this.version = 0;
    };

    OutputManager.prototype = {
	constructor: OutputManager,

	//
	setOptions:
	function(options) {
	    this.console = options.console;
	    this.codearea = options.codearea;
	    this.filemanager = options.filemanager;
	},

	//
	reportError:
	function( error_msg ) {
	    this.console.createWin('error',"Error");
	    var err = $("<pre>"+error_msg+"</pre>");
	    this.console.addContentToWin('error',err);
	    $("<div title='Error'>Error Occured. See Error Console</div>").dialog({
		modal: true,
		buttons: {
		    Ok: function() {
			$( this ).dialog( "close" );
		    }
		}
	    });
	},

	//
	output:
	function( output, server, stream ) {
	    // first we clear all current annotations, if needed.
	    if(!stream)
	     this.clearAllAnnotations();

	    // we check if the returned output includes and <error>
	    // environment, in such case we just call another method
	    // to print the error and we ignore all other parts of the
	    // output
	    var error = $(output).find(_ei.outlang.syntax.eierror);

	    if ( error.size() != 0 ) {
		this.reportError( $(error).text() );
		return;
	    }

	    // if we are here then there was no error
	    //
	    var ei_out = $(output).find(_ei.outlang.syntax.eiout);
	    var ei_stream = $(output).find(_ei.outlang.syntax.eistream);

	    // if the output does not include any <eiout> tag, we
	    // simply print the output text on the console. This is
	    // done by generating a printconsole command
	    //
	    if ( ei_out.size() == 0 && ei_stream.size() == 0) {
		output = jQuery.parseXML( 
		               "<"+_ei.outlang.syntax.eiout+" version='1'>"+
		                 "<"+_ei.outlang.syntax.eicommands+">"+
           		            "<"+_ei.outlang.syntax.printonconsole+">"+
	        	              "<"+_ei.outlang.syntax.content+" format='text'>"+	
	                                 "<![CDATA["+$(output).find(_ei.outlang.syntax.eiappout).text()+"]]>" +
		                      "</"+_ei.outlang.syntax.content+">"+
		                    "</"+_ei.outlang.syntax.printonconsole+">"+
		                 "</"+_ei.outlang.syntax.eicommands+">"+
   		               "</"+_ei.outlang.syntax.eiout+">"
		);
		ei_out = $(output).find(_ei.outlang.syntax.eiout);
	    }
	    this.version = $(ei_out).attr("version") || $(ei_stream).attr("version");
	    this.lastOutput = ei_out || ei_stream;
	    try {
	      if( ei_out.size() == 0 ){
		this.executeEIOutput( ei_stream, server, stream );
	      }else
		this.executeEIOutput( ei_out, server, false );
	    } catch (err) {
		console.log("Error occurred while processing the output:");
		console.log(err);
		alert("Error occurred while processing the output, see the Javascript console");
	    }
	},

	//
	executeEIOutput:
	function( output, server, stream ) {
	    var self = this;   
	    // parse the commands
	   if (!stream)
 	        this.commands = new Set();
	    output.find("> "+_ei.outlang.syntax.eicommands).each( function() {
	    	var dest = $(this).attr(_ei.outlang.syntax.dest) || self.codearea.getCurrentTabId();
                var outclass = $(this).attr(_ei.outlang.syntax.outclass);
		$(this).children().each( function() {
		    self.parseCommand( $(this), self.commands, {
			outclass: outclass,
			dest: dest,
			server: server
		    });
		});
	    });

	    // parse the actions
	  if(!stream)
	    this.actions = new Set();
	  output.find("> "+_ei.outlang.syntax.eiactions).each( function() {	
		var dest = $(this).attr(_ei.outlang.syntax.dest) || self.codearea.getCurrentTabId();
                var outclass = $(this).attr(_ei.outlang.syntax.outclass);
                var autoclean = $(this).attr(_ei.outlang.syntax.actionautoclean) || true;

	    	$(this).children().each( function() {
	    	    self.parseAction( $(this), self.actions, {
			outclass: outclass,
			dest: dest,
			autoclean: autoclean,
			server: server
		    });
	    	});
	    });
	    
	    this.commands.asyncIterate( 
		function(c) { c.do(); },
		function() {
		    self.actions.asyncIterate( function(a) { a.activate();});
		});
	},


	// parse the command 'c', and adds the resulting object to the
	// list 'commands'. The third parameter 'options' is used to
	// pass any extra information needed, e.g., destination,
	// output class, etc.
	parseCommand:
	function( c, commands, options) {

	    var cobj = null;

	    // iterate over the commands in CommandsCollection, until
	    // once succeeds to parse 'c'
	    for( var i=0 ; i<this.CommandsCollection.length; i++ ) {
		cobj = this.CommandsCollection[i].parse(c, {
		    dest : options.dest,
		    outclass: options.outclass,
		    outputmanager : this,
		    filemanager: this.filemanager,
		    codearea : this.codearea,
		    console  : this.console,
		    defaultConsoleId: this.defaultConsoleId,
		    server   : options.server
		});

		if ( cobj != null )  {  // we have succeeded to parse 'c' 
		    commands.add(cobj);
		    return;
		}
	    }  

	    // we have not succeeded to parse 'c'
	    console.log("Error while parsing the command:");
	    console.log(c);
	    throw "Parsing a command has failed";
	},

	//
	parseAction:
	function(a, actions, options) {
	    var aobj = null;
	    for( var i=0 ; i<this.ActionsCollection.length; i++ ) {
		aobj = this.ActionsCollection[i].parse(a, {
		    dest : options.dest,
		    outclass: options.outclass,
		    outputmanager : this,
		    filemanager: this.filemanager,
		    codearea : this.codearea,
		    console  : this.console,
		    autoclean: this.autoclean,
		    defaultConsoleId: this.defaultConsoleId,
		    server : options.server
		});
		if ( aobj != null ) {
		    actions.add(aobj);
		    return;
		}
	    }
	    throw "Unknow Action";
	},
	


	//
	performAction:
	function( a , concatenated) {
	  var tmp = new Array();

	  $.each(this.lastAction, function(){
	    var action = this;
	    if(a == action || (a.autoClean() && !concatenated))
	      action.undoAction();
	    else
	      tmp[tmp.length] = action;
	  });
	  if(this.lastAction.indexOf(a) < 0){
	    tmp[tmp.length] = a;
	    a.doAction();
	  }

	  this.lastAction = tmp;
	},

	//
	performActions:
	function( as , concatenated) {
	  var self = this;
	  var autoclean = false;
	  $.each(as,function(){
	    if(this !== undefined)
	      autoclean = autoclean || this.autoClean();
	  });
	  var tmp = new Array();

	  $.each(self.lastAction, function(){
	    var action = this;
	    if(as.indexOf(action) > -1 || (autoclean && ! concatenated))
	      action.undoAction();
	    else
	      tmp[tmp.length] = action;
	  });
	  $.each(as, function(){
	    var a = this;
	    if(self.lastAction.indexOf(a) < 0){
	      tmp[tmp.length] = a;
	      a.doAction();
	    }
	  });
	  self.lastAction = tmp;
	},
	
	//
	clearAllAnnotations:
	function() {
	  var self = this;
	    this.commands.iterate( function(c) { c.undo(); });
	    this.actions.iterate( function(a) { a.deActivate(); });
	    this.lastAction = new Array();
	    this.console.initConsole();
	    this.defaultConsoleId = this.console.createWin('default',"Default Console");
	    this.console.switchWin( this.defaultConsoleId );
	}
    }

    return OutputManager;

})();
