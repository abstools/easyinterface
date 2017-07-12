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

	    // the following json object will be passed to the EasyInterface server
	    var jsonParams = {
		"command":    _ei.serverCommand.app.execute,
		"app_id":     cmdInfo.appId,
		"parameters": {}
	    };

	    // add the parameters to the json object
	    for(var p in cmdInfo.params) {
		var vals = new Array();
		vals = [].concat(cmdInfo.params[p]);
		jsonParams["parameters"][p]=vals;
	    }

	    // add the files
	    if ( cmdInfo.files ) 
		jsonParams["parameters"]["_ei_files"] =  cmdInfo.files;

	    // add the outline entries
	    if (_ei.outline.active && cmdInfo.entries ) {
		jsonParams["parameters"]["_ei_outline"] =  cmdInfo.entries;
	    }

	    // add the client id
	    jsonParams["parameters"]["_ei_clientid"] = _ei.clientId;

	    // add ei output support
	    jsonParams["parameters"]["_ei_outformat"] = _ei.outformat;

	    //var eirequest = JSON.stringify(jsonParams);
	    var eirequest = jsonParams;

	    $.post(cmdInfo.server,
		   {
		       eirequest: eirequest
		   }).done(function(data) {
		       try {
			   data = jQuery.parseXML(data);
			   if ( _ei.debug ) console.log(data);
		       } catch(e) {
			   var n = data.indexOf("<"+_ei.outlang.syntax.eiappout+">");
			   var m = data.indexOf("</"+_ei.outlang.syntax.eiappout+">");
			   if ( n != -1 && m != -1 ) {
			       data = data.replace("<"+_ei.outlang.syntax.eiappout+">","<"+_ei.outlang.syntax.eiappout+"><![CDATA[");
			       data = data.replace("</"+_ei.outlang.syntax.eiappout+">","]]></"+_ei.outlang.syntax.eiappout+">");
			   }
			   try {
			       data = jQuery.parseXML(data);
			   } catch(e1) {
  			     errorcb(e1);
			     return;
			   }
		       }
		     callback(data);

	    	   }).error(function(data) {
		       if ( _ei.debug ) {
			   console.log("HTTP Request error occurred: ");
			   console.log(data);
		       }
	    	       errorcb(data);
	    	   });
	}
    }

    return CmdEngine;

})();
