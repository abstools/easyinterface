window.Outline = (function() {
  "use strict";

  // static variables should go here 
  var outlineId = 0;
  
  function Outline(options) {	
    
    outlineId++;
    this.treeId = "OUTLINE-"+outlineId;
    this.olObj = null
    this.olId  = 10;
    this.nodes = null;
    this.outputmanager = options.outputmanager;
    this.outlineHolder = $(options.holder);
    this.filemanager = options.filemanager;
    this.cmdengine = options.cmdengine;
    this.console = console;
    this.initOutline();

  };

  Outline.prototype = {
    constructor: Outline,


    //
    olId_to_olTag: 
    function( id ) {
      return  "olobj-" + id;
    },
	 
    //
    olTag_to_olId: 
    function( tabTag ) {
      return tabTag.substr(6,tabTag.length-6);      
    },

    //
    initOutline:
    function( callback ) {
      var self = this;
      var oltype = {
	"types":{
	  "SH":{
	    "start_drag" : false,
	    "delete_node" : false,
	    "remove" : false,
	    "icon": {image:"./lib/jstree/themes/classic/fileL.png"}	
	  },
	  "S":{
	    "start_drag" : false,
	    "delete_node" : false,
	    "remove" : false
	    //"icon": {image:"./lib/jstree/themes/classic/file.png"}
	  },
	  "H":{
	    "start_drag" : false,
	    "delete_node" : false,
	    "remove" : false,
	    "icon": {image:"./lib/jstree/themes/classic/folder.png"}
	  },
	  "none":{
	    "start_drag" : false,
	    "delete_node" : false,
	    "remove" : false,
	    "icon": {image:"./lib/jstree/themes/classic/folderL.png"}
	    
	  },
	  "#":{
	    "start_drag" : false,
	    "delete_node" : false,
	    "remove" : false
	  }
	}
      };
      this.outlineHolder.append("<div id='"+this.treeId+"'></div>");
      this.jstree = 
      this.outlineHolder.find("#"+this.treeId)
	  .jstree({
	    json_data : {
	      data : []
	    },
	    "themes": {theme: "classic"},
	    "types" : oltype,
	    "plugins": ["themes", "json_data", "ui", "crrm", "checkbox","types" ]
	  })
	  .bind("loaded.jstree", function (event, data) {
	    self.buildInitOutline();
	    if ( callback ) callback()

	  }).bind("create_node.jstree",function(event,data){
	    /* console.log($(data.inst)[0]);
	       if($(data.rslt.obj[0]).attr("icon"))
	       $(data.inst)[0].set_icon(data.rslt.obj[0],$(data.rslt.obj[0]).attr("icon"));*/
	  });
    },

    //
    getSelected:
    function() {
      var self = this;
      var selected = new Array();
      if(!_ei.outline.active)
	return selected;
      var x = this.jstree.jstree("get_checked", this.treeHolder, true);
      x.each(function() {
	var olId = $(this).attr("olId");
	var type = self.olObj[ olId ].info.attr.rel;
	switch (type){
	  case "SH":
	  case"S":
	    selected[selected.length]=self.olObj[olId].info.attr.name;
	  case "H":
	  case "":
	    break;		    
	}
	/*
	   switch (type) {
	   case "method":
	   selected[selected.length] = 
	   self.olObj[ olId ].info.attr.className+
	   "."+
	   self.olObj[ olId ].info.data;
	   break;
	   case "function":
	   case "main":
	   selected[selected.length] = self.olObj[ olId ].info.attr.name;
	   }*/
      });

      return selected;
    },

    //
    buildInitOutline:
    function() {
      this.olId  = 1;
      this.olObj = new Array();
    },

    //
    addNode:
    function(data) {//data = {name,selectable,hiericaly,parentId,icon}
      var type;
      if(data.selectable == "true"){
	if(data.hiericaly == "true"){
	  type="SH";
	}else{
	  type="S";
	}
      }else{
	if(data.hiericaly == "true"){
	  type="H";
	}else{
	  type="none";
	}
      }
      var pId = 0;
      var parent;
      if(data.parentId){
	pId = data.parentId;
	parent = this.olObj[pId].node;
      }
      
      var olInfo = {
	data: data.name, 
	attr: { id: this.olId_to_olTag( this.olId ), 
		olId: this.olId, 
		rel: type,
		icon: data.icon,
		name: data.value
	}
      };
      
      var node;
      node = this.jstree.jstree("create", parent, "last", olInfo , false, true );
      
      this.olObj[this.olId] = { info: olInfo, node: node};
      this.olId++;
      return this.olId -1;

    },

    //
    addChilds:
    function(parent,pid){
      var self = this;
      $(parent).find(">category").each( function(){
	var data = {
	  name :   $(this).attr("text"),
	  selectable : $(this).attr("selectable"),
	  value: $(this).attr("value"),
	  icon : $(this).attr("icon"),
	  parentId : pid
	}
	var id = self.addNode( data );
	self.addChilds(this,id);
      });
    },

    //
    resetLayout:
    function( out ) {
      out=$(out).find(_ei.outlang.syntax.eiappout);
      this.addChilds(out,null);
    },

    //
    refresh:
    function(fileIds) {
      if(!_ei.outline.active)
	return;
      var self = this;

      var files = self.filemanager.getEiFiles(fileIds);

      var dialogBox = $("<div class='applyingToolDialog'>Refreshing Outline, please wait!<div class='applyingToolDialogProgBar' id='progressbar'</div></div>").dialog({modal: true});
      dialogBox.find("#progressbar").progressbar({
	value: false
      });

      this.cmdengine.exec({
	server: _ei.outline.server,
	appId: _ei.outline.app,
	files: files,
	result: {media: "stdin"}
      },
      function(out) {
	self.outlineHolder.empty();
	var error = $(out).find(_ei.outlang.syntax.eierror);
	if ( error.size() > 0) {
	  self.outlineHolder.empty();
	  self.initOutline();
	  dialogBox.dialog("close");
	  self.outputmanager.reportError( error.text() );
	} else {
	  self.initOutline( function() { self.resetLayout( out ); } );
	  dialogBox.dialog("close");
	}
      },
      function(out) {
	self.outlineHolder.empty();
	self.initOutline();
	dialogBox.dialog("close");
	self.outputmanager.reportError( out );
      });
    }
  }

  return Outline;

})();
