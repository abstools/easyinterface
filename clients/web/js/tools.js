window.Tools = (function() {
    "use strict";
    
    function Tools(options) {	
	this.toolId = 1;
	this.currToolId = null;
	this.tools = new Array();
	this.parameters = null; //the object that handles the parameters,etc.
	this.helps = null; //the object that handles the helps,etc.      
	this.filemanager = null;
	this.outline = null;
	this.cmdengine = null;
        this.console = null;
        this.inlineParams = null;
        this.setOptions(options);
    };

    Tools.prototype = {
	constructor: Tools,

	getNumTools:
	function(){
	    return this.toolId-1;
	},
	//
	setOptions:
	function(options) {
	    this.parameters = options.parameters;
	    this.inlineParams = options.inlineParameters;
	    this.selector = options.selector;
	    this.filemanager = options.filemanager;
	    this.outline = options.outline;
	    this.cmdengine = options.cmdengine;
	    this.outputmanager = options.outputmanager;
	    this.helps = options.helps;
	  this.selector.setToolsObj( this );
	},

	//
	ready:
	function(){
	  this.setActiveTool(this.selector.getTool());
	},

	//
	addTool:
	function( tool, server) {
	    
	    var acronym = tool.find("appinfo").find("acronym").text();
	    var title  = tool.find("appinfo").find("title").text();
	    if(tool.attr("id"))
		var toolId = tool.attr("id");
	    else
		var toolId = this.toolId;
	    this.tools[ toolId ] = {
		acronym: acronym,
		title: title,
		server: server
	    };

	    // add parameters section of the current analysis
	    this.parameters.addSection(acronym,toolId,tool.find("parameters"),tool.find("profiles"));
	    this.helps.addSection(acronym,toolId,tool.find("apphelp"));
	    // add an entry in the tool selector
	    this.selector.addTool(toolId,acronym);
	    
	    // if no analysis are installed yet, make this one as the
	    // current active one
	    if ( this.currToolId == null ) {
		this.currToolId = toolId;
		this.parameters.setActiveParameSet( toolId );
	    }

	    this.toolId++;
	},

	//
	setActiveTool:
	function(toolId) {
	  if( !this.tools[toolId])
	    return;
	  if( _ei.inlineSetting.active && this.tools[this.currToolId] ){
	    this.parameters.placeParamSet(this.currToolId,this.inlineParams);
	  }
	  this.currToolId = toolId;
	  this.parameters.setActiveParameSet( toolId );
	  if( _ei.inlineSetting.active){
	    this.parameters.getParamSet(toolId,this.inlineParams);
	  }
	},

	apply:
	function(fileIds, toolId) {
	    var self = this;

	    if ( !toolId ) toolId = this.currToolId;
	  if( !this.tools[toolId]) return;
	    var toolInfo = this.tools[ toolId ];

	    var files = self.filemanager.getEiFiles(fileIds);
	    var entriesInfo;
	  if(_ei.outline.active){
	    //get the outline Info	    
	    entriesInfo = self.outline.getSelected();
	  }else{
	    entriesInfo = new Array();
	  }

	    // get the current value of all parameters
	    var parametersInfo = this.parameters.getParams(toolId);
	    
	    var dialogBox = $("<div class='applyingToolDialog'>Applying "+toolInfo.acronym + ", please wait!<div class='applyingToolDialogProgBar' id='progressbar'</div></div>").dialog({modal: true});
	    dialogBox.find("#progressbar" ).progressbar({
	    	value: false
	    });

	    this.cmdengine.exec( {
	        server: toolInfo.server,
		cmd: toolInfo.cmd,
		appId: toolId,
		params: parametersInfo,
		files: files,
		entries: entriesInfo,
		pprefix: toolInfo.pprefix,
		result: toolInfo.result
	    },
				 function(out) {
				   dialogBox.dialog("close");
				   self.outputmanager.output(out,toolInfo.server);
				 },
	    function(out){
	      dialogBox.dialog("close");
	      var err_str= "<ei_response><eiout version='-1'><eicommands><printconsole consoleid='ERROR' consolename='ERROR'><content>ERROR</content></printconsole></eicommands></eiout></ei_response>";
	      var err = $.parseXML(err_str);
	      self.outputmanager.output(err,toolInfo.server);
	      //ADD NOTIFY ERROR
	      console.log("ERROR",out);
	    });
	}
    }

    return Tools;

})();
