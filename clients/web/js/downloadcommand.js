window.DownloadCommand = (function() {
    "use strict";

    DownloadCommand.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	if ( tag != _ei.outlang.syntax.downloadfile ) return null;

	var filename = c.attr(_ei.outlang.syntax.filename);
	var execid = c.attr(_ei.outlang.syntax.execid);
	if ( !filename )
	    throw "The '"+_ei.outlang.syntax.filename+"' is missing at "+_ei.outlang.syntax.downloadfile+ " command";

	return new DownloadCommand({
	    filename: filename,
	    execid: execid,
	    server: ei_info.server
	});
    };

    function DownloadCommand(options) {	
	this.filename = options.filename;
	this.execid = options.execid;
	this.server = options.server;
    };

    DownloadCommand.prototype = {
	constructor: DownloadCommand,

	//
	"do":
	function() {
	    window.open(this.getUrl());
	},

	//
	"undo":
	function() {
	},

	getUrl:
	function(){
	    return this.server+"?download&file="+this.filename+"&execid="+this.execid;
	}
    }

    return DownloadCommand;

})();
