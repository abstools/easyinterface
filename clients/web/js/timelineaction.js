window.TimeLineAction = (function() {
    "use strict";
    var timelineId = 0; // a counter to create unique identifiers for timelines

    TimeLineAction.parse = function(a, ei_info) { 
	var tag = a[0].tagName;
	if ( tag != _ei.outlang.syntax.timeline ) return null;
        var dest = a.attr(_ei.outlang.syntax.dest) || ei_info.dest;
	var outclass = a.attr( _ei.outlang.syntax.outclass ) || ei_info.outclass;
      var autoclean  = a.attr( _ei.outlang.syntax.actionautoclean ) || ei_info.autoclean;
	if ( autoclean == "false" ) 
	    autoclean=false;
	else autoclean=true

	var boxtitle  = a.attr( _ei.outlang.syntax.tltitle ) || "Time Line";
        var tltimer = parseInt( a.attr( _ei.outlang.syntax.tlauto ) ) || 5;
	var boxwidth  =  400;
	var boxheight  = 400;

        var steps = a.find("> " + _ei.outlang.syntax.tlstep );

	var content = a.find("> " + _ei.outlang.syntax.content );
	return new TimeLineAction({
	    outclass: outclass, 
	    autoclean: autoclean,
	    dest: dest,
	    timer: tltimer,
	    boxtitle: boxtitle, 
	    boxwidth: boxwidth,
	    boxheight: boxheight,
	    content: content,
	    codearea: ei_info.codearea,
	    outputmanager: ei_info.outputmanager,
	    filemanager: ei_info.filemanager,
	    console: ei_info.console,
	    defaultConsoleId: ei_info.defaultConsoleId,
	    steps: steps
	});
    }

    function TimeLineAction(options) {	
      var self = this;
      self.trigger = null;
      self.timer = options.timer;
      self.commands = new Array();
      options.steps.each ( function() {
	var self2 = this;
	self2.commandstep = new Set();
	$(this).find("> "+_ei.outlang.syntax.eicommands ).each( function() {
	    var dest =  $(this).attr( _ei.outlang.syntax.dest ) || options.dest;
	    var outclass =  $(this).attr( _ei.outlang.syntax.outclass ) || options.outclass;
	    $(this).children().each( function() {
	      options.outputmanager.parseCommand( $(this), self2.commandstep, {
		    dest : dest,
		    outclass: options.outclass,
		    outputmanager : options.outputmanager,
		    filemanager: options.filemanager,
		    codearea : options.codearea,
		    console  : options.console,
		    defaultConsoleId: options.defaultConsoleId
		});
	    });
	});
	self.commands[self.commands.length] = self2.commandstep;
      });
      this.currMin = 0;
      this.currMax = 0;
      this.boxtitle = options.boxtitle;
      this.boxwidth = options.boxwidth;
      this.boxheight = options.boxheight;
      this.tlId = timelineId;
      timelineId += 1;
      this.msg = $("<div title='"+this.boxtitle+"' ></div>");
      this.content = new DocContent({
	content: options.content,
	outclass: options.outclass
      }).getDOM();
      self.status = "pause";

      var bt1 = $( "<button id='tl-play-"+this.tlId+"' class='tl-button' style='display:block;'></button>" ).button({
	icons: {
          primary: "ui-icon-play"
	},
	text: false
      }).click(function(e){self.tlautomatic();});

      var bt2 = $( "<button id='tl-stop-"+this.tlId+"' class='tl-button' style='display:hidden;'></button>" ).button({
	icons: {
          primary: "ui-icon-stop"
	},
	text: false
      }).click(function(e){self.tlautomatic();});


      this.controller = $("<div id='controltl-"+this.tlId+"'></div>");
      this.controller.append(bt1);
      this.controller.append(bt2);
      self.tl = $("<div id='tl-"+this.tlId+"' class='timeline'></div>");
      this.tl.slider({
	range: true,
	min: 0,
	max: options.steps.length-1,
	step: 1,
	values: [0,0],
	slide: function(event, ui){
	  self.doit(ui);
	}
      });
      this.controller.append( this.tl );
      this.msg.append( this.controller );
      this.msg.append( this.content );
      this.dialogBox = null;
    };

    TimeLineAction.prototype = {
	constructor: TimeLineAction,
	//
	activate:
	function() {
	    this.doAction();
	},

	//
	deActivate:
	function() {
	    this.undoAction();
	},
	//
	doAction:
	function() {
	    if ( !this.dialogBox ) {
		this.dialogBox = $(this.msg).dialog({
		width: this.boxwidth,
		height: this.boxheight
		});
  	        if (this.commands[0])
		  this.commands[0].asyncIterate(function(c) { c.do(); });
	    } else {
		this.dialogBox.dialog("open");
	    }
	},

	undoAction:
	function() {
	  var self = this;
	  if ( this.dialogBox ) {
	    this.dialogBox.dialog("close");
	    window.clearInterval(self.trigger);
	    self.trigger = null;
 	    self.tl.slider( "disable" );
	    self.status = "pause";
	    
	    for(var i=self.currMin; i<self.currMax+1;i++){
	      if (self.commands[i])
		self.commands[i].asyncIterate(function(c) { c.undo(); });
	    }
	    
	    this.dialogBox.dialog("destroy").remove();
	  }
	},
	
	"doit":
	function(ui){
	  var self = this;
	  if(self.currMin > ui.values[0]){
	    //do all eicommans from curr to values 0
	    for (var i = self.currMin-1; ui.values[0] < i+1; i -=1){
	      if (self.commands[i])
		self.commands[i].asyncIterate(function(c) { c.do(); });
	    }
	  }else if(self.currMin < ui.values[0]){
	    //undo all eicommans from values 0 to curr
	    for (var i = self.currMin; i < ui.values[0]; i +=1){
	      if (self.commands[i])
		self.commands[i].asyncIterate(function(c) { c.undo(); });
	    }
	  }
	  self.currMin = ui.values[0];
	  if(self.currMax > ui.values[1]){
	    //undo all eicommans from curr to values 1
	    for (var i = self.currMax;  ui.values[1] < i; i -=1){
	      if (self.commands[i])
		self.commands[i].asyncIterate(function(c) { c.undo(); });
	    }

	  }else if(self.currMax < ui.values[1]){
	    //do all eicommans from values 1 to curr
	    for (var i = self.currMax+1; i < ui.values[1] +1; i +=1){
	      if (self.commands[i])
		self.commands[i].asyncIterate(function(c) { c.do(); });
	    }
	  }
	  self.currMax = ui.values[1];
	},

	"tlautomatic":
	function(){
	  var self = this;
	  if(self.status == "play"){
	    window.clearInterval(self.trigger);
	    self.trigger = null;
 	    self.tl.slider( "enable" );
	    $("#tl-play-"+self.tlId+"").show();
	    $("#tl-stop-"+self.tlId+"").hide();
	    self.status = "pause";
	  }else{
	    $("#tl-play-"+self.tlId+"").hide();
	    $("#tl-stop-"+self.tlId+"").show();
	    if(self.trigger){
	      window.clearInterval(self.trigger);
	      self.trigger = null;
	    }
	    self.trigger = setInterval(function(){
	      self.tl.slider( "disable" );
	      if(self.tl.slider("values",1)<self.commands.length-1){
		self.tl.slider( "values", 1, self.tl.slider("values",1)+1 );
		self.status = "play";
		var ui = { values: [self.tl.slider( "values", 0),self.tl.slider( "values", 1)]};
		self.doit(ui);
	      }else{
		window.clearInterval(self.trigger);
		self.trigger = null;
 		self.tl.slider( "enable" );
		$("#tl-play-"+self.tlId+"").show();
		$("#tl-stop-"+self.tlId+"").hide();
		self.status = "pause";
	      }
	    },self.timer*1000);	    
	  }
	}
    }

    return TimeLineAction;

})();
