window.EasyInterface = (function() {
    "use strict";

    // Static field that counts the number of instances. It used to
    // distinguish the different instances so we can have several
    // independent EasyInterface(s) on the same page
    //
    var countEasyInterface = 0;
    var serverPath = [{server:"/ei/server/eiserver.php",apps:"_ei_all"}];
    var examplesPath = [{server:"/ei/server/eiserver.php",examples:"_ei_all"}];



    function EasyInterface(options) {

	var self = this;

	this.holder = null;
	this.theme = null;

	this.userProjectsCatId = -1;
	this.userDefaultProjectId = -1;
	this.settingsFileContent = null;
	this.tools = null;
	this.filemanager = null;
	this.codearea = null;
	this.parameters = null;
	this.console = null;
	this.outline = null;
	this.cmdengine = null;
	this.generalSettingId = 0;

	this.initialize(options);
	this.loadTheme(options);

	// at this point we know that the template has been loaded (we
	// use sync ajax in loadTheme!). We start installing the
	// different widgets
	//
	
	// the theme/template must have places to hold the
	// corresponding widgets. They should use the corresponding
	// identified use below
	//
	this.codeareaHolder = this.holder.find("#codearea");
	this.filemanagerHolder = this.holder.find("#filemanager");
	this.consoleHolder = this.holder.find("#console");
	this.parametersHolder = this.holder.find("#parameters");
	this.helpsHolder = this.holder.find("#helps");
        this.helpButtonHolder = this.holder.find("#help");
	this.optionsButtonHolder = this.holder.find("#options");
	this.applyButtonHolder = this.holder.find("#apply");
        this.toolSelectHolder = this.holder.find("#toolselector");
      	this.settingHolder = this.holder.find("#setting");
	this.outlineHolder = this.holder.find("#outline");
	this.outlineButtonHolder = this.holder.find("#refreshoutline");
	this.clearButtonHolder = this.holder.find("#clearanno");
        this.upSectionHolder = this.holder.find("#up");
        this.rightSectionHolder = this.holder.find("#up-right");
	// create/installl the different widgets
	this.initCmdEngine();
	this.initCodeAreaWidget();
	this.initFileManagerWidget();
	this.initParametersWidget();
        this.initHelpWidget(options.generalHelp);
//	this.initGeneralSetting();
	this.initConsoleWidget();
	this.initToolSelectorWidget();
	this.initOutputManager();
        if(_ei.outline.active)
	  this.initOutlineWidget();
        this.initTools();
        this.filemanager.setProperties(this.outline,this.tools);
        // check Right
        if(_ei.outline.active && _ei.inlineSetting.active){
	  //set heights
	  this.outlineHolder.css("height","49%");
	  this.settingHolder.css("height","49%");
        }else if(_ei.outline.active){
  	  //remove inlineSetting
	  this.settingHolder.remove();
	}else if(_ei.inlineSetting.active){
	  //remove outline
	  this.outlineHolder.remove();
	}else{
	  // codearea expand
	  this.rightSectionHolder.remove();
	  this.codeareaHolder = this.codeareaHolder.css("width","78%");
	}
      
	// connect the buttons to the corresponding operations
	this.applyButtonHolder.button(
	    {
		icons: {
		    primary: "ui-icon-play"
		}
	    } ).click(function() { 
		var ids = [self.codearea.getCurrentTabId()];
		self.tools.apply(ids); 
	    } );
      if( !_ei.inlineSetting.active ) {
	this.optionsButtonHolder.button( 
	    {
		icons: {
		    primary: "ui-icon-gear"
		}
	    } ).click(function() {
	      self.parametersHolder.dialog( "open" );
	    } );
        }else{
	  this.optionsButtonHolder.remove();
	}

        this.helpButtonHolder.button( 
	    {
		icons: {
		    primary: "ui-icon-help"
		}
	    } ).click(function() { self.helpsHolder.dialog( "open" ); } );

	this.clearButtonHolder.button( 
	    {
		icons: {
		    primary: "ui-icon-tag"
		}
	    } ).click(function() { self.outputmanager.clearAllAnnotations(); });
      if(_ei.outline.active){
	this.outlineButtonHolder.button( 
	    {
		icons: {
		    primary: "ui-icon-arrowrefresh-1-w"
		}
	    } ).click(function() { 
		var ids = [self.codearea.getCurrentTabId()];
		self.outline.refresh( ids ); 
	    } );
      }else{
	this.removeOutline();
      }
      this.initResizeEffect(); 
	setTimeout(function(){ self.parseURI() }, 2000);
			


    }

    EasyInterface.prototype = {
	constructor: EasyInterface,

	//
	initialize:
	function( options ) {

	    // The holder (either DOM or jQuery object) must be passed in
	    // the options. It is the tag in which the EasyInterface will
	    // place its content.
	    //
	    if ( !options.holder ) throw "You must specify a holder for EasyInterface!";

	    this.holder  = $( options.holder );
	    this.theme   = options.theme   || "default";

	    _ei.language = options.language || "text/x-csrc";
	    _ei.serverPath = options.apps || serverPath;
	    _ei.exampleServerPath = options.examples || examplesPath;

	    _ei.outline.active = (options.outline=="on")? true : false;
	    _ei.inlineSetting.active = (options.inlineSetting=="on")? true : false;
	    if(_ei.outline.active){
	      _ei.outline.app = options.outlineapp || "outline";
	      _ei.outline.server = options.outlineserver || _ei.serverPath[0].server;
	    }
	},

	//
	loadTheme:
	function() {
	    var self = this;
            $.ajax({
		async: false,
		cache: false,
		url : this.theme,
		success : function (data) {
                    self.holder.append(data);
		}
	    });
	},


	//
	initCodeAreaWidget:
	function() {
	    this.codearea = new CodeArea( this.codeareaHolder, {});
	},

	//
	initFileManagerWidget:
	function() {
	    var self = this;

	    this.filemanager = 
		new FileManager( this.filemanagerHolder, 
				 { 
				     codearea: this.codearea,
				     // The initialization of the file
				     // manager is done with a callback,
				     // when the jstree is ready -- it
				     // must be like this because jsTree
				     // uses some async calls when
				     // constructing the widget
				     callback: function() { self.initFileManager() }
				 });
	  this.codearea.addFileManager(this.filemanager);
	},


	//
	initParametersWidget:
	function() {
	    var self = this;
	    this.parameters = new Parameters(this.parametersHolder, {});

	    // make the parameters widget is a dialog
	    this.parametersHolder.dialog({
		title: "Settings",
		autoOpen: false,
		height: 400,
		width: 700,
		modal: true,
		show: {
		    effect: "fadeIn",
		    duration: 500
		},
		hide: {
		    effect: "fadeOut",
		    duration: 500
		},
		buttons: {
		    Close: function() {
			$( this ).dialog( "close" );
		    },
		    "Restore Default": function() {
			self.parameters.restoreDefaultValues(-1,self.tools.getNumTools()+1);
		    }
		}
	    });

	},

	     //
	initHelpWidget:
	function(generalHelp) {
	  
	    var self = this;
	    this.helps = new Helps(this.helpsHolder, {});

	    // make the parameters widget is a dialog
	    this.helpsHolder.dialog({
		title: "Tools Help",
		autoOpen: false,
		height: 400,
		width: 700,
		modal: true,
		show: {
		    effect: "fadeIn",
		    duration: 500
		},
		hide: {
		    effect: "fadeOut",
		    duration: 500
		},
		buttons: {
		    Close: function() {
			$( this ).dialog( "close" );
		    }
		}
	    });
	  if(generalHelp){
	    var general = $.parseXML(generalHelp);
	    this.helps.addSection("General Help", "generalhelp",$(general).find("apphelp"));
	  }
	},

	//
	initGeneralSetting:
	function() {
	    this.generalSettingId = 0;
	    this.parameters.addSection("General Settings",this.generalSettingId);
	    
	    //
	    var paramInfo_show_svg_in_new_window = {
		id: "show_svg_in_new_window",
		options: new Array("true","false"),
		default_value: _ei.general_settings.show_svg_in_new_window,
		desc: { "short": "Output SVG content in new tab",
			"long": "When selected, any SVG content will be display in a new tab in the console area"},
		callback: function(data) { _ei.general_settings.show_svg_in_new_window = data.value; }
	    };
					    
	    //
	    var paramInfo_file_slection_mode = {
		id: "file_selection_mode",
		desc: { "short": "File selection mode",
			"long": "Select if the tool should be applied on the current <b>file</b> only, or on all files that belong to its <b>project</b>"},
		options: [ { desc: { "short": "File", "long": ""}, value: "file" }, { desc: { "short": "Project", "long": ""}, value: "project" } ],
		default_value: _ei.general_settings.file_slection_mode,
		callback: function(data) { _ei.general_settings.file_slection_mode = data.value; }
	    };

	    var paramInfo_output_mode = {
		id: "output_mode",
		desc: { "short": "Output mode",
			"long": "This option allows selecting where to display the output when a tools is applied. It can be in the default tab, the current tab, or a new tab"},
		options: [ { desc: { "short": "Default Tab", "long": ""}, value: "default" }, { desc: { "short": "Current Tab", "long": ""}, value: "current" }, { desc: { "short": "New Tab", "long": ""}, value: "new" }  ],
		default_value: _ei.general_settings.output_mode,
		callback: function(data) { _ei.general_settings.output_mode = data.value; }
	    };
	
	    this.parameters.addCheckWidget(this.generalSettingId,paramInfo_show_svg_in_new_window);
	    // this.parameters.addComboWidget(this.generalSettingId,paramInfo_file_slection_mode);
	    this.parameters.addComboWidget(this.generalSettingId,paramInfo_output_mode);

	},

	//
	initConsoleWidget:
	function() {
	    this.console = new Console( this.consoleHolder, {});
	},

	//
	initToolSelectorWidget:
	function() {
	    this.toolSelector = new ToolSelector({ holder: this.toolSelectHolder });
	},


	//
	initOutlineWidget:
	function() {
	    this.outline = new Outline({ 
		    "holder": this.outlineHolder, 
		    "filemanager": this.filemanager,
		    "cmdengine": this.cmdengine,
		    "console": this.console,
		    "outputmanager" : this.outputmanager
		});
	},

	initOutputManager:
	function() {
	    this.outputmanager = new OutputManager({ 
  	        console: this.console,
		codearea: this.codearea,
		filemanager: this.filemanager
	    });
	},

	//
	initCmdEngine:
	function() {
	   
	    this.cmdengine = new CmdEngine();
	},
	
	//
	initFileManager:
	function() {

	    // initialize the use projects are
	    this.userProjectsCatId = this.filemanager.addFolder("User_Projects"); 	    
	    var defaultFileId = this.filemanager.addFile("noname1"+_ei.file_ext,this.userProjectsCatId,"",null);
	    this.filemanager.openFile(defaultFileId);

	    this.initExamples();
	    this.filemanager.closeAll();
	},

	initTools:
	function() {
	    var self = this;
	    this.tools = new Tools({
	        "parameters": this.parameters,
		"inlineParameters": this.settingHolder,
		"selector": this.toolSelector,
		"filemanager": this.filemanager,
		"outline": this.outline,
		"cmdengine": this.cmdengine,
		"outputmanager": this.outputmanager,
		"helps": this.helps
	    });

	  var serverNum;
	  var currentServer;
	  for (serverNum in _ei.serverPath){
	    //_ei.serverPath[serverNum] = 
	    // = {server: "", apps: "_ei_all"|["",""]}
	    currentServer =  _ei.serverPath[serverNum];
	    var bucle_apps = true;
	      
	    for( var index = 0; (bucle_apps && index < currentServer.apps.length);index+=1){
	      var jsonParam;
	      if(currentServer.apps == "_ei_all"){
		bucle_apps = false;
		jsonParam = {
		  "command" : _ei.serverCommand.app.details,
		  "app_id" : _ei.serverCommand.all
		};
	      } else{
		jsonParam = {
		  "command" : _ei.serverCommand.app.details,
		  "app_id" : currentServer.apps[index]
		};
	      }
	    $.ajax({
	      type: "POST",
	      async: false,
	      url: currentServer.server,
	      cache: false,
	      data:{
		eirequest: jsonParam //JSON.stringify(jsonParam)
	      }}).done(function(data){
		var ap = $(jQuery.parseXML(data));
		if(ap.find("ei_error").length)
		  alert(ap.find("ei_error").text());
		else
		  ap.find("ei_response").find("apps").find("app").each( 
		    function() {
		      self.initTool( $(this),currentServer.server );
		    });// */
	      });
	    }}
	  this.tools.ready();
	},

	initTool:
	function( tool,server ) {
	    this.tools.addTool(tool,server);
	},

	initExamples:
	function() {
	  var self = this;
	  var serverNum;
	  var currentServer;
	  for (serverNum in _ei.serverPath){
	    // = {server: "", examples: "_ei_all"|["",""]}
	    currentServer =  _ei.exampleServerPath[serverNum];
	    var loop_examples = true;
	    for( var index = 0; (loop_examples && index < currentServer.examples.length);index+=1){
	      var jsonParam;
	      if(currentServer.examples == "_ei_all"){
		loop_examples = false;
		jsonParam = {
		  "command" : _ei.serverCommand.example.details,
		  "exset_id" : _ei.serverCommand.all
		};
	      } else{
		jsonParam = {
		  "command" : _ei.serverCommand.example.details,
		  "exset_id" : currentServer.examples[index]
		};
	      }

	    $.ajax({
		type: "POST",
		async: false,
		url: currentServer.server,
		cache: false,
		data:{
		    eirequest: jsonParam // JSON.stringify(jsonParam)
		}}).done(function(data){
		    var ex = $(jQuery.parseXML(data));
		    if(ex.find("ei_error").length)
			alert(ex.find("ei_error").text());
		    else
			self.initExamples_aux(ex.find("examples"), serverNum,null);	
		    
		});
	  }
}
	},
	
	initExamples_aux:
	function(ex, server,parentId) {
	    var self = this;
	    ex.children().each(
		function () {
		    switch ( $(this).prop("tagName") ) {
		    case "exset": //compatibility
			self.initExamples_aux( $(this),server, parentId);
			break;
		    case "folder":
			var name = $(this).attr("name");
			var catId = self.filemanager.addFolder(name,parentId,"Lock");
			self.initExamples_aux($(this),server,catId);
			break;
		    case "file":
			var content = $(this).text();
			var name = $(this).attr("name");
			var url = $(this).attr("url");
			self.filemanager.addFile( name, parentId, content, url,"Lock");
			break;
		    case "github":
			var user = $(this).attr("owner");
			var repo = $(this).attr("repo");
			var branch = $(this).attr("branch");
			var dir = $(this).attr("path");
			self.filemanager.addGithub(user,repo,branch,dir,parentId);
			break;
		    }
		});
	},
	initResizeEffect:
	function() {
	  var self = this;
	  var RE = new ResizeEffect({holder:self.holder});
	  RE.addHorizontalEffect(self.filemanagerHolder,self.codeareaHolder);
	  if(_ei.outline.active || _ei.inlineSetting.active)
	    RE.addHorizontalEffect(self.codeareaHolder,self.rightSectionHolder);
	  if(_ei.outline.active && _ei.inlineSetting.active){
	    RE.addVerticalEffect(self.settingHolder,self.outlineHolder);
	  }
	  RE.addVerticalEffect(self.upSectionHolder,self.consoleHolder);
	},
	removeOutline:
	function(){
	  this.outlineButtonHolder.remove();
	  var sizeO = parseInt(this.outlineHolder.css("width").slice(0, -2));
	  var sizeC = parseInt(this.codeareaHolder.css("width").slice(0, -2));
	  this.outlineHolder.remove();
	  this.codeareaHolder.css("width",sizeC+sizeO);
	},
	parseURI:
	function(){
	  var self = this;
	  var data = self.parseQuery(window.location.search.substr(1));
	  $.each(data,function(v,arr){
	    switch(v){
	      case "file":
		$.each(arr,function(k,n){
		    self.filemanager.openPath(n);
		    var fmid = self.filemanager.getIdByPath(n);
		    if(fmid!=-1)
			self.filemanager.openFile(fmid);
		});
		break;
	      case "app":
		$.each(arr, function(k,n){
		  self.toolSelector.selectTool(n);
		});
		break;
	      case "profile": 
		$.each(arr, function(k,n){
		  self.parameters.selectProfile(-1,n);
		});
	    }

	  });

	},
	parseQuery:
	function(str){
          if(typeof str != "string" || str.length == 0) return {};
          var s = str.split("&");
          var s_length = s.length;
          var bit, query = {}, first, second;
          for(var i = 0; i < s_length; i++)
          {
            bit = s[i].split("=");
            first = decodeURIComponent(bit[0]);
            if(first.length == 0) continue;
            second = decodeURIComponent(bit[1]);
            if(typeof query[first] == "undefined") query[first] = [second];
            else if(query[first] instanceof Array) query[first].push(second);
            else query[first] = [query[first], second]; 
          }
          return query;
        }

    }

    return EasyInterface;

})();
