window.CmdEngine = (function() {
    "use strict";

    function CmdEngine(options) {
    };

    CmdEngine.prototype = {
	constructor: CmdEngine,

	//
	setOptions:
	function(options) {
	},

	//
	exec:
	function( cmdInfo, callback, errorcb) {

	    // the following json object will be based to the php sc
	    var jsonParams = {
		"command": _ei.serverCommand.app.execute,
		"app_id": cmdInfo.appId,
		"parameters":{}
	    };

	    // add the parameters to the json object
	    for(var p in cmdInfo.params) {
		var vals = new Array();
		vals = [].concat(cmdInfo.params[p]);
		jsonParams["parameters"][p]=vals;
	    }

	    if ( cmdInfo.files ) 
		jsonParams["parameters"]["_ei_files"] =  cmdInfo.files;
	  if ( cmdInfo.entries ) {
	    var outStr = "";
	    for(var i in cmdInfo.entries){
	      outStr += " " + cmdInfo.entries[i];
	    }
		jsonParams["parameters"]["_ei_outline"] =  cmdInfo.entries;//outStr;
	  }
	  jsonParams["parameters"]["_ei_clientid"] = _ei.clientId;

	    //var eirequest = JSON.stringify(jsonParams);
	    var eirequest = jsonParams;

	    $.post(cmdInfo.server,
		   {
		       eirequest: eirequest
		   }).done(function(data) {
		     try{
		       data = jQuery.parseXML(data);
		       if ( _ei.debug ) console.log(data);
	    	       callback(data);
		     }catch(e){
		       errorcb(e);
		     }
	    	   }).error(function(data) {
		       if ( _ei.debug ) console.log("Error: ",data);
	    	       errorcb(data);
	    	   });
	}
    }

    return CmdEngine;

})();
