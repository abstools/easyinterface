/*
  PrintOnConsoleCommand:

    This command prints content on the console

  Syntax:

    TBD

*/

window.PrintOnConsoleCommand = (function() {
    "use strict";

    PrintOnConsoleCommand.parse = function(c, ei_info) { 
	var tag = c[0].tagName;

	if ( tag != _ei.outlang.syntax.printonconsole ) return null;

	var outclass =  c.attr( _ei.outlang.syntax.outclass ) || ei_info.outclass;
	var consolTitle = c.attr( _ei.outlang.syntax.consoletitle );
	var consoleId = c.attr( _ei.outlang.syntax.consoleid ) || ei_info.defaultConsoleId;
	var content = c.find("> "+_ei.outlang.syntax.content);
	return new PrintOnConsoleCommand({
	    console: ei_info.console,
	    consoleId: consoleId,
	    consoleTitle: consolTitle,
	    content: content,
	    server: ei_info.server,
	    outputmanager: ei_info.outputmanager,
	    outclass: outclass
	});
    };

    function PrintOnConsoleCommand(options) {	
	this.console = options.console;
	this.consoleId = options.consoleId;
	this.consoleTitle = options.consoleTitle;
	this.format = options.format;
	this.content = new DocContent({ 
	    server: options.server,
	    outputmanager: options.outputmanager,
	    console: options.console,
	    content: options.content,
	    outclass: options.outclass
	}).getDOM();

	this.added = false;
    };

    PrintOnConsoleCommand.prototype = {
	constructor: PrintOnConsoleCommand,

	//
	"do":
	function() {

	    if ( !this.added ) {
		if ( ! this.console.existWin( this.consoleId ) ) {
		 
		    this.console.createWin(this.consoleId, this.consoleTitle);
		}
		this.console.addContentToWin(this.consoleId, this.content);
		this.added = true;
	    } else {
		// TBD - just make it visible
	    }
	},

	"undo":
	function() {
	    // Not sure we want to allow undo here, it will create a mess
	    //
	    // this.content.remove();
	}
    }

    return PrintOnConsoleCommand;

})();
