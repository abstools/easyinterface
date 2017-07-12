window.FileManager = (function() {
  "use strict";
  
  // static variables should go here 
  var fileManagerId = 0;

  function FileManager(place,options) {
    fileManagerId++;
    this.treeId = "FM-"+fileManagerId;
    this.treeHolder = place;
    this.treeOptions = options;
    this.jstree = null;
    this.codearea = options.codearea;
    this.outline = null;
    this.tools = null;
    this.fmId = 1;
    this.fmObj = new Array();
    this.fmIdByPath = new Array();
    this.objToMove = null;
    this.copy=true;
    this.paste=false;
    this.githubs = new Array(); // 0 -> for general conect (without user)
    this.githubId = 1; //next id to github conections.
    this.initFileManager();
    this.initialize();
    
  }

  FileManager.prototype = {
    constructor: FileManager,

	 //
	 fmId_to_fmTag: 
    function( id ) {
      return "fmobj-" + id;
    },

	 //
	 fmTag_to_fmId: 
    function( tabTag ) {
      return tabTag.replace("fmobj-","");   
    },

	 setProperties:
    function(outline,tools){
      this.outline = outline;
      this.tools = tools;
    },
	 //
	 initialize: 
    function() {
    },


	 //
	 initFileManager: 
    function() {
      var self = this;
      $(this.treeHolder).append("<div id='"+this.treeId+"'></div>");
      /*
	 The next variables are the config of the tree, we try to use all as posible the capacities
	 of the jstree jquery plugin.
	 fmCore: is the basic config of the jstree.
	 fmDnd: config of drag and drop plugin, with this we can control what is available to copy, 
	 and do it with a simple action: "drag and drop".
	 fmTypes: config of types plugin, whit this we control the diferents node types, to change
	 icons, and to use in the other plugins.
	 fmCrrm: config of crrm.
       */
      
      var fmCrrm = {
	"move" : {
	  "always_copy"     : true, //force always copy, to prevent Lock folders/files been moved
	  "open_onmove"     : false,
	  "default_position": "last",
	  "check_move"      : function (m) { 
	    // if np (new parent) isnt a folder, you can not move
	    if( $(m.np).attr("rel") !== "folder"){
	      return false;
	    }else if($(m.np).attr("id") === $(m.op).attr("id")){
	      //if np is the same than my op (old parent)
	      return false;
	    }
            return true;
          }
	}
      };
      var fmType = {
	"max_depth":-2,//-2 is to desactivate the control of this to do the tree faster
	"max_children":-2,
	"valid_children":["file","folder","fileLock","folderLock","fileRepo","folderRepo"], //root valid childs
	"types":{
	  "file":{
	    "icon": {image:"./lib/jstree/themes/classic/file.png"},
	    "valid_children": "none"
	  },
	  "folder":{
	    "icon": {image:"./lib/jstree/themes/classic/folder.png"},
	    //We permit Lock type, to allow temporal copies that will be converts in NOT lock types.
	    "valid_children":["file","folder","fileLock","folderLock","fileRepo","folderRepo"]
	  },
	  "fileLock":{
	    "delete_node" : false,
	    "remove" : false,
	    "icon": {image:"./lib/jstree/themes/classic/fileL.png"},
	    "valid_children":"none"
	  },
	  "folderLock":{
	    "delete_node" : false,
	    "remove" : false,
	    "icon": {image:"./lib/jstree/themes/classic/folderL.png"},
	    "valid_children":["fileLock","folderLock","folderRepo","fileRepo"]
	  },
	  "fileRepo":{
	    "icon": {image:"./lib/jstree/themes/classic/fileR.png"},
	    "valid_children":"none"
	  },
	  "folderRepo":{
	    "icon": {image:"./lib/jstree/themes/classic/folderR.png"},
	    "valid_children":["fileRepo","folderRepo","file"]
	  },
	  "#":{
	    "start_drag" : false,
	    "delete_node" : false,
	    "remove" : false,
	    "valid_children" : ["folder","folderLock","folderRepo"]
	  }
	}
      };
      this.jstree = 
      $(this.treeHolder).find("#"+this.treeId)
	    .jstree({
	      json_data : {
		data : {}		
	      },
	      /* Plugins:
	       * types, allow makes differences between locks files, folders.. 
	       * core, is basic to move and copy
	       * ui, allow interface
	       * contextmenu, to have menus in all nodes
	       * sort, to sort the nodes
	       * dnd, drag and drop
	       */
	      "plugins": ["types","core","unique","dnd","themes","json_data","ui","crrm","contextmenu","sort"],
	      "ui":{
		"select_limit" : -1,
		"selected_parent_close" : "select_parent",
	      },
	      "themes": {theme: "classic"},
	      "dnd":{"drag_copy":"on"},
	      "types": fmType,
	      "crrm":fmCrrm,
	      "sort":function(a,b){
		var ta = $(a).attr("rel");
		var tb = $(b).attr("rel").replace("Lock","").replace("Repo","");
		if(ta == tb)
		  return this.get_text(a) > this.get_text(b) ? 1:-1;
		return a > b ? 1:-1;
	      },
	      "contextmenu": { 
		"items":  function(node) {
		  if(! this.is_selected(node)){
		    this.deselect_all();
		    this.select_node(node);
		  }
		  var items = {	

		    "Apply": {
		      "label": "Run",
		      "action": function (obj) {
			var fmId = parseInt(obj.attr('fmId'));
			var Ids = self.getSelectedId(fmId);
			self.tools.apply(Ids);
		      }
		    },
		    "Outline": {
		      "label": "Refresh Outline",
		      "separator_after":true,
		      "action": function (obj) {
			var fmId = parseInt(obj.attr('fmId'));
			var Ids = self.getSelectedId(fmId);
			self.outline.refresh(Ids);
		      }
		    },
		    "CreateFile": {
		      "label": "New file",
		      "separator_before": true,
		      "action": function (obj) {
			var fmId = obj.attr('fmId');
			var x;
			if ( self.fmObj[fmId].info.attr.rel == "folderRepo"){
			  self.openFolder(fmId,true);
			  x = self.addFile(null,self.fmObj[ fmId ].node.attr('fmId'),"","","Repo");
			  self.openFile( x );
			  var repoId = self.fmObj[fmId].info.attr.githubId;
			  var branch = self.fmObj[fmId].info.attr.branch;
			  var path = self.fmObj[fmId].info.attr.gh_path;
			  self.joinGithubWithfm(x,repoId,branch,null,path);
			} else {
			  x = self.addFile(null,self.fmObj[ fmId ].node.attr('fmId'),"","","");
			  self.openFile( x );
			}
		      }
		    },
		    "CreateFolder": {
		      "label": "New folder",
		      "separator_after":true,
		      "action": function (obj) {
			var fmId = obj.attr('fmId');
			var x;
			if ( self.fmObj[fmId].info.attr.rel == "folderRepo"){
			  x = self.addFolder(null,self.fmObj[ fmId ].node.attr('fmId'),"Repo");
			  var repoId = self.fmObj[fmId].info.attr.githubId;
			  var branch = self.fmObj[fmId].info.attr.branch;
			  var path = self.fmObj[fmId].info.attr.gh_path+"/"+self.fmObj[fmId].info.data;
			  self.joinGithubWithfm(x,repoId,branch,null,path);
			} else {
			  x = self.addFolder(null,self.fmObj[ fmId ].node.attr('fmId'),"");
			}
		      }
		    },
		    "RemoteFile": {
		      "label": "Add Remote File...",
		      "separator_before": true,
		      "action": function (obj) {
			var fmId = obj.attr('fmId');
			self.requestRemote(self,fmId);
		      }
		    },
		    "Commit": {
		      "label": "Commit & Push",
		      "separator_after": true,
		      "action": function (obj) {
			var fmId = obj.attr('fmId');
			self.requestCommit(self,fmId);
		      }
		    },
		    "Rename": {
		      "label": "Rename",
		      "separator_before":true,
		      "action": function (obj) {
			this.rename(obj);
		      }
		    },
		    "Delete": {
		      "label": "Delete",
		      "action": function (obj) {
			this.remove(obj);
		      }
		    },
		    "Copy": {
		      "label": "Copy",
		      "action": function (obj) {
			this.copy(obj);
			self.copy=true;	
		      }
		    },
		    "Cut": {
		      "label": "Cut",
		      "action": function (obj) {
			this.cut(obj);
			self.copy=false;
		      }
		    },
		    "Paste": {
		      "label": "Paste",
		      "separator_after":true,
		      "action": function (obj) {
			self.paste=true;
			this.paste(obj);
		      }
		    }
		  };

		  switch ( node.attr('rel') ) {

		    case "folderLock":
		    case "fileLock":
		      delete items.CreateFile;
		      delete items.CreateFolder;
		      delete items.RemoteFile;
		      delete items.Commit;
		      delete items.Rename;
		      delete items.Delete;
		      delete items.Cut;
		      delete items.Paste;
		      break;
		    case "fileRepo":
		      delete items.CreateFile;
		      delete items.CreateFolder;
		      delete items.Delete;
		      delete items.RemoteFile;
		      delete items.Cut;
		      delete items.Paste;
		      break;
		    case "folderRepo":
		      delete items.CreateFolder;
		      delete items.Rename;
		      delete items.Delete;
		      delete items.RemoteFile;
		      delete items.Cut;
		      delete items.Paste;
		      break;
		    case "file":
		      delete items.CreateFile;
		      delete items.CreateFolder;
		      delete items.RemoteFile;
		      delete items.Commit;
		      delete items.Paste;
		      break;
		    case "folder":
		      delete items.Commit;
		      break;
		  };
		  if(!_ei.outline.active)
		    delete items.Outline;
		  return items;
	      }}})
	    .bind("delete_node.jstree",function(e, data){
	      var id = $(data.rslt.obj).attr("fmId");
	      var parentId = $(data.rslt.parent).attr("fmId");
	      if ( parentId && parentId >= 0) {
		var ttype = self.fmObj[parentId].info.attr.rel;
		if(ttype == "fileLock" || ttype == "folderLock"){
		  $.jstree.rollback(data.rlbk);
		}else{
		  var parentMembers = self.fmObj[ parentId ].info.attr.members;
		  var sizeMem = parentMembers.length;
		  var find = -1;
		  for(var i = 0; i < sizeMem && find < 0; i++){
		    find = (parentMembers[i] == id) ? i:-1;
		  }
 		  if(find >=0){
		    parentMembers[find] = parentMembers[sizeMem-1];
		    delete parentMembers[sizeMem-1];
		    parentMembers.length--;
		  }
		  self.updateDelete(id,data.inst);
		}
	      }else{
		$.jstree.rollback(data.rlbk);
	      }
	    })
	    .bind("dblclick.jstree", function (e, data) {
	      var fmId = self.jstree.jstree('get_selected').attr('fmId');
	      var fmInfo = self.fmObj[ fmId ].info;    
	      if ( fmInfo.attr.rel == "file" ||fmInfo.attr.rel=="fileLock" || fmInfo.attr.rel=="fileRepo") {
		self.openFile( fmId );
	      }else{
		self.openFolder(fmId);
	      }
	    })
	    .bind("loaded.jstree", function (event, data) {
	      self.treeOptions.callback();
	    })
	    .bind("move_node.jstree",function(event,data){
	      var cont = data.inst.get_container();
	      var m = data.rslt;
	      var roll = false;
	      //if we cut or copy some node and before paste we move an other,
	      // we need know if we copy or cut the first element, because the move ever is copy
	      var auxcopy =self.copy; 
	      if(!self.paste) self.copy = true;
	      if($(m.np).attr("id") == $(m.op).attr("id"))
		roll = true
	      else if($(m.np).attr("rel") && $(m.np).attr("rel") !== "folder")
		roll = true;
	      else if(self.copy)
		roll = self.updateCopy(m.oc,m.np,data.inst);
	      else
		roll = self.updateCut(m.o,m.np,data.inst,true);
	      self.copy=true;
	      if(!self.paste)self.copy=auxcopy;
	      self.paste=false;
	      if(roll) $.jstree.rollback(data.rlbk);
	    })
	    .bind("rename_node.jstree", function (event, data) {
	      var fmId = data.rslt.obj.attr('fmId');
	      var oldfmInfo = self.fmObj[ fmId ].info;
	      var oldname = oldfmInfo.data;
	      var oldpath = self.calculatePath(oldfmInfo);
	      var newfmInfo = $.extend({},oldfmInfo);
	      var newname = data.rslt.name;
	      newfmInfo.data = newname;
	      newfmInfo.attr.label = newname;
	      if(newname !=oldname){
		var newpath = self.calculatePath(newfmInfo);
		if(!self.existsFm(newpath)){
		  self.fmObj[ fmId ].info.data = newname;
		  
		  self.fmIdByPath[newpath] =  self.fmIdByPath[oldpath];
		  delete self.fmIdByPath[oldpath];
		  if(newfmInfo.attr.rel == "folder" || newfmInfo.attr.rel == "folderRepo"){
		    $(newfmInfo.attr.members).each(function(k,v){
		      var tempfmInfo = self.fmObj[v].info;
		      var newtemppath = self.calculatePath(tempfmInfo);
		      var oldtemppath = newtemppath.replace(newpath,oldpath);
		      self.fmIdByPath[newtemppath] =  self.fmIdByPath[oldtemppath];
		      delete self.fmIdByPath[oldtemppath];
		    });
		  }else if(self.fmObj[ fmId ].info.attr.open){
		    self.codearea.updateTitle(fmId,newname);
		    if($("#mdfile-"+fmId).length){
		      var parent = $("#mdfile-"+fmId).parent();
		      $(".ui-dialog-title",parent).html(newname);
		    }
		  }
		}else{
		  $( "<div>Sorry, but '"+newname
		    +"' already exists in this folder, please choose a different name</div>" ).dialog({
		      title: "Error: Filename already in use",
		      resizable: false,
		      height:140,
		      modal: true
		    });
		  $.jstree.rollback(data.rlbk);
		}
	      }
	    });
    },
	 //
	 bindToCodeArea: 
    function( ca ) {
      this.codearea = ca;
    },
	 //
	 updateDelete:
    function (id,inst){
      var self = this;
      var path = self.calculatePathById(id);
      var ttype = self.fmObj[id].info.attr.rel;
      if(ttype == "folderLock" || ttype == "fileLock")
	return true;
      if(ttype == "folder" || ttype == "folderRepo"){
	var childs = self.fmObj[id].info.attr.members;
	var sizeChilds = childs.length;
	for( var i = 0; i < sizeChilds; i++){
	  self.updateDelete(childs[i],inst);
	}
      }
      delete self.fmObj[id];
      self.fmObj.length--;
      delete self.fmIdByPath[path];
      return false;
    },
		    //    
    updateCopy:
    function (obj,parent,inst){
      // first update the object of the tree
      // second update arrays of memory
      var self = this;
      var roll = false;
      var fmInfoO = self.fmObj[$(obj).attr("fmid")].info;

      $(obj).attr("rel",$(obj).attr("rel").replace("Lock","").replace("Repo",""));
      $(obj).attr("fmid",self.fmId);
      $(obj).attr("id",self.fmId_to_fmTag(self.fmId));
      $(obj).attr("parentid",parseInt(self.fmTag_to_fmId($(parent).attr("id"))));
      var fmInfo;
      if($(obj).attr("rel")=="file"){
	var content = self.getFileContent(fmInfoO.attr.fmId);
	fmInfo = {
	  data: fmInfoO.data,
	  attr: { id:  $(obj).attr("id"), 
		  fmId: parseInt($(obj).attr("fmid")),
		  rel: $(obj).attr("rel"),
		  label: fmInfoO.data, 
		  content: content, 
		  url: null, 
		  open: false, 
		  urlLoaded: true, 
		  parentId: parseInt($(obj).attr("parentid"))
	  }
	};
      }else{
	fmInfo = {
	  data: fmInfoO.data[0],
	  attr: { id:  $(obj).attr("id"), 
		  fmId: parseInt($(obj).attr("fmid")),
		  rel: $(obj).attr("rel"),
		  members: new Array(),
		  parentId: parseInt($(obj).attr("parentid"))
	  }
	};
      }
      var parentId = fmInfo.attr.parentId;
      if ( parentId ) {
	var parentMembers = this.fmObj[ parentId ].info.attr.members;
	parentMembers[ parentMembers.length ] = fmInfo.attr.fmId;
      }

      var path = self.calculatePath(fmInfo);
      self.fmId++;
      self.fmIdByPath[path]=fmInfo.attr.fmId;
      self.fmObj[fmInfo.attr.fmId] ={ info: fmInfo, node: obj};
      var childs = inst._get_children(obj);
      
      for(var i = 0; i< childs.length;i++){
	roll = self.updateCopy(childs[i],obj,inst);
	if(roll) return roll;
      }

      return false;
    },
		    //
    updateCut:
    function(obj,parent,inst,first,oldrootpath,newrootpath){

      var self = this;
      var roll = false;
      var fmInfoO = self.fmObj[$(obj).attr("fmid")].info;
      if(first){
	var oldpath = self.calculatePath(fmInfoO);
	var oldparentId = $(obj).attr("parentid");
	var oldfmId = $(obj).attr("fmId");
	var oldparentId = fmInfoO.attr.parentId;
	
	$(obj).attr("parentid",self.fmTag_to_fmId($(parent).attr("id")));
	fmInfoO.attr.parentId = parseInt($(obj).attr("parentid"));
	
	var parentId = fmInfoO.attr.parentId;
	if ( parentId ) {
	  var parentMembers = this.fmObj[ parentId ].info.attr.members;
	  parentMembers[ parentMembers.length ] = fmInfoO.attr.fmId;
	}
	var newpath = self.calculatePath(fmInfoO);
	if ( oldparentId && oldparentId >= 0) {
	  var parentMembers = this.fmObj[ oldparentId ].info.attr.members;
	  var sizeMem = parentMembers.length;
	  var find = -1;
	  for(var i = 0; i < sizeMem && find < 0; i++){
	    find =(parentMembers[i]==fmInfoO.attr.fmId)?i:-1;
	  }
	  if(find >=0){
	    parentMembers[find] = parentMembers[sizeMem-1];
	    delete parentMembers[sizeMem-1];
	    parentMembers.length--;
	  }
	}
	
	if(roll) return roll;
	var childs = inst._get_children(obj);
	
	for(var i = 0; i< childs.length;i++){
	  roll = self.updateCut(childs[i],obj,inst,false,oldpath,newpath);
	  if(roll) return roll;		
	}  
	inst.remove(obj);
	self.fmIdByPath[newpath]=fmInfoO.attr.fmId;
	self.fmObj[fmInfoO.attr.fmId]={info: fmInfoO, node: obj};	 
	delete self.fmIdByPath[oldpath];
	
      }
      else{
	var newpath = self.calculatePath(fmInfoO);
	var oldpath = newpath.replace(newrootpath,oldrootpath);

	self.fmIdByPath[newpath] = self.fmIdByPath[oldpath];
	delete self.fmIdByPath[oldpath];

	if(roll) return roll;
	var childs = inst._get_children(obj);
	
	for(var i = 0; i< childs.length;i++){
	  roll = self.updateCut(childs[i],obj,inst,false,oldpath,newpath);
	  if(roll) return roll;		
	}  
      }

      return false;
    },
		    //
    addFolder:
    function( label, parentId , tipo) {

      var parent = undefined;
      if ( parentId ) parent = this.fmObj[ parentId ].node;
      else parentId = null;
      var ttype = "folder";
      if(typeof tipo !== 'undefined' && tipo)
	ttype =ttype+""+tipo;
      if ( !label ) {
	label = "noname"+this.fmId;
      }
      var fmTag = this.fmId_to_fmTag( this.fmId );
      var fmInfo = { 
	data: label, 
	attr: { id: fmTag, 
		fmId: this.fmId, 
		rel : ttype,
		members : new Array(),
		label: label,
		parentId : parentId
	}
      };

      var path = this.calculatePath(fmInfo);
      var repeated = this.existsFm(path);
      var intento = 1;
      while(repeated){
	fmInfo.data = intento +"_"+label;
	fmInfo.attr.label = intento +"_"+label;
	path = this.calculatePath(fmInfo);
	repeated = this.existsFm(path);
	intento++;
      }
      var node = this.jstree.jstree("create", parent, "last", fmInfo , false, true );
      this.fmObj[ fmInfo.attr.fmId ] = { info: fmInfo, node: node };
      this.fmId++;
      
      if ( parentId ) {
	var parentMembers = this.fmObj[ parentId ].info.attr.members;
	parentMembers[ parentMembers.length ] = fmInfo.attr.fmId;
      }
      this.fmIdByPath[path] = fmInfo.attr.fmId;
      
      return fmInfo.attr.fmId;
    },
		    //
    addFile: 
    function( label, parentId, content, url , tipo, overwrite) {
      var self = this;
      var parent = parentId ? this.fmObj[ parentId ].node : undefined;

      var fmTag = this.fmId_to_fmTag( this.fmId );
      var ttype="file";
      if(typeof tipo !== 'undefined' && tipo)
	ttype = ttype+tipo;
      if ( !label ) {
	label = "noname"+this.fmId+_ei.file_ext;
      }

      var fmInfo = {
	data: label,
	attr: { id: fmTag, 
		fmId: this.fmId, 
		rel: ttype,
		label: label, 
		content: content, 
		url: url, 
		open: false, 
		urlLoaded: false, 
		parentId: parentId,
		github:false
	}
      };
      var path = this.calculatePath(fmInfo);
      var repeated = this.existsFm(path);
      var intento = 1;
      while(repeated && !overwrite){ // TODO : check Overwrite
	fmInfo.data = intento +"_"+label;
	fmInfo.attr.label = intento +"_"+label;
	path = this.calculatePath(fmInfo);
	repeated = this.existsFm(path);
	intento++;
      }
     
      var node = this.jstree.jstree("create", parent, "last", fmInfo, false, true );
      
      this.fmObj[ fmInfo.attr.fmId ] = { info: fmInfo, node: node };
      this.fmId++;
      
      if ( parentId ) {
	var parentMembers = this.fmObj[ parentId ].info.attr.members;
	parentMembers[ parentMembers.length ] = fmInfo.attr.fmId;
      }

      this.fmIdByPath[path] = fmInfo.attr.fmId;
      return fmInfo.attr.fmId;
    
    },
		    //
    createFile:
    function(path, content, url, overwrite) {  
	var names = path.split('/');
	var label = names[names.length-1];
	var str = "/User_Projects/";
	var last_Id = 1;
	for (var k=0;k<names.length-1;k++){
	  if(names[k] == ""){
	    continue;
	    }else if(this.existsFm(str+names[k]+"/")){
		str = str+names[k]+"/";
	    }else{
		last_Id = this.addFolder(names[k],this.fmIdByPath[str],"");
		k--;
	    }
	}
	
	this.addFile( label, this.fmIdByPath[str], content, url, "",overwrite);
    },

		    //
    isVisualExtension:
    function(ext){
      var VExtensions = ["md","svg"];
      return VExtensions.indexOf(ext)>=0;
    },

    //
    openFile: 
    function( fileId, force ) {
      if( fileId < 0 ) return;
      var fmInfo = this.fmObj[ fileId ].info;
      var extension = /^.+\.([^.]+)$/.exec(fmInfo.attr.label);
      extension = (extension == null) ? "": extension[1];
      if ( this.isVisualExtension(extension) && !force){
	this.openEspecial(fmInfo,extension);
      }	else if ( fmInfo.attr.open ) {
	this.codearea.showTab(fmInfo.attr.fmId);
      } else {
	this.loadFile( fmInfo.attr.fmId );
	this.codearea.createTab(fmInfo.attr.label,fmInfo.attr.fmId,fmInfo.attr.content);
	fmInfo.attr.open = true;
      }
      
    },

		    //
    openEspecial:
    function (fmInfo,extension){
      var self = this;
      if(fmInfo.attr.open){
	//get new content from codearea
	fmInfo.attr.content = self.codearea.getTabContent(fmInfo.attr.fmId);
      }else{
	self.loadFile(fmInfo.attr.fmId);
      }
      var htmlEsp = "";
      if(extension == "md")
	htmlEsp = markdown.toHTML(fmInfo.attr.content);
      else
	htmlEsp = (fmInfo.attr.content).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      if($("#ei-especialfile-"+fmInfo.attr.fmId).length){
	$(".dialog-div","#ei-especialfile-"+fmInfo.attr.fmId+"").html(htmlEsp);
	$("#ei-especialfile-"+fmInfo.attr.fmId).dialog("open");
	return;
      }
      var owner = $("<div id='ei-especialfileg-"+fmInfo.attr.fmId+"' class='dialog-div'></div>");
      $(owner).append($("<div class='dialog-div'></div>"));
	$(".dialog-div",owner).html(htmlEsp);
      //create dialog box with the content
      $(owner).dialog({
	title: fmInfo.attr.label,
	resizable: true,
	height:400,
	width: 600,
	modal: false,
	buttons: {
	  "Close": function() {
	    $( this ).dialog( "close" );
	  },
	  "Edit": function(){
	    self.openFile(fmInfo.attr.fmId,true);
	  },
	  "Refresh": function(){
	    self.openEspecial(fmInfo,extension);
	  }
	}
      });
    },

		    //
    loadFile:
    function( fileId ) {
      var fmInfo = this.fmObj[ fileId ].info;
      var self = this;
      if ( fmInfo.attr.url && !fmInfo.attr.urlLoaded && !fmInfo.attr.urlGitHub ) { //get from server
	var jsonParam = {
	  "command" : "get_file_contents",
	  "url" : fmInfo.attr.url
	};
	var ap;
	$.ajax({
	  async: false,
	  cache: false,
	  url : fmInfo.attr.url,
	  type:'GET',
          converters: {"* text": window.String, "text html": window.String, "text json": window.String, "text xml": window.String},
	  error: function(XMLHttpRequest, textStatus, errorThrown) { 
	    fmInfo.attr.content = "ERROR: Cannot load "+fmInfo.attr.url;
	  },
	  success : function (data) {
	    //ap = $(jQuery.parseXML(data));
	    //if(ap.find("ei_error").length){
	    //  fmInfo.attr.content = ap.find("ei_error").text();
	    //}else{
	      fmInfo.attr.content = data;
	      fmInfo.attr.urlLoaded = true;
	    //}
	  }
	});
      }else if(fmInfo.attr.urlGitHub && !fmInfo.attr.urlLoaded ){
	var gh = fmInfo.attr.githubId;
	var response = this.githubs[gh].repo.getBlob(fmInfo.attr.url, function(err,data){
	  if(err){
	    fmInfo.attr.content = "Error: "+err;
	    console.log(err);
	  }else{
	    fmInfo.attr.content =""+data;
	    fmInfo.attr.urlLoaded = true;
	  }
	});
      }
    },

		    //
    openFolder:
    function(folderId,sync){
      var self = this;
      var fmInfo = self.fmObj[folderId].info;
      if(fmInfo.attr.urlGitHub && !fmInfo.attr.urlLoaded){
	var gh = fmInfo.attr.githubId;
	self.githubs[gh].repo.getTree(fmInfo.attr.url,sync, function(err, tree) {
	  fmInfo.attr.urlLoaded = true;
	  self.buildGithubTree(gh,tree,fmInfo.attr.gh_path,folderId,fmInfo.attr.branch,sync);
	  
	});
      }
    },

      
      openPath:
      function(path){
	  var base = "/";
	  var folders = path.split("/");
	  var top = folders.length -1;
	  if(path[path.length-1]=="/")
	      top++;
	  for(var i = 1; i < top; i++){
	      base += folders[i]+"/";

	      var fmid = this.getIdByPath(base);
	      if (fmid == -1) break;
	      this.openFolder(fmid,true);
	  }
      },

    //
    getFolderFileIds:
    function(id,parents) {
      var arr = {id:id,child:new Array(),type:"file",complete:parents};
      if(this.fmObj[id].info.attr.rel == "folder" 
	|| this.fmObj[id].info.attr.rel == "folderLock"
	|| this.fmObj[id].info.attr.rel == "folderRepo"){
	  this.openFolder(id,true);
	  var fmInfo = this.fmObj[id].info;
	  var size = fmInfo.attr.members.length;
	  arr.type="folder";
	  var temp= new Array();
	  for(var i = 0; i<size; i++){
	    temp[i] = this.getFolderFileIds(fmInfo.attr.members[i],false);
	  }
	  
	  arr.child = temp;
	  arr.len = size;
      }else{
	arr.len=0;
      }
      return arr;
    },

    //
    getEiFiles:
    function(ids){
      var self = this;
      var fileIds = new Array();
      for(var i =0; i<ids.length; i++)
	  fileIds[i] = self.getFolderFileIds(ids[i],true);
      var recursive = function(Ids,files){
	//Ids = [{id:0,child:[{},{}],type:"file",len:0,complete:bool}];
	for(var i=0;i<Ids.length;i++) {
	  if(Ids[i].type == "file" ){
	    var name = (self.calculatePathById(Ids[i].id)).substr(1);
	    var extension = /^.+\.([^.]+)$/.exec(name);
	    extension = (extension == null) ? "": extension[1];
	    if(extension != "md")
	      files[files.length] = {
		id: Ids[i].id,
		type: "text",
		name: name,
		content: self.getFileContent(Ids[i].id)
	      };  
	  }else{
	    //files[files.length] = {
	    //  id: Ids[i].id,
	    //  type: "directory",
	    //  name: (self.calculatePathById(Ids[i].id)).substr(1).replace(/.$/, '')
	    //};
	    recursive(Ids[i].child,files);
	  }
	}
      };
      var files = new Array();
      recursive(fileIds,files);
      return files;
    },

		    //
    getSelectedId:
    function(first){
      var arr = $.map(this.jstree.jstree('get_selected'),function(I,k){
	var a = parseInt($(I).attr('fmId'))
	if(first === undefined || first != a)
 	  return a;
      });
      if(first !== undefined)
	arr.unshift(first);
      return arr;
    },

		    //
    getFileContent:
    function(fileId) {
      var fmInfo = this.fmObj[ fileId ].info;
      this.loadFile(fileId); // make sure the file is loaded (if it is given as url)
      if ( fmInfo.attr.open ) {
	return this.codearea.getTabContent( fileId );
      } else {
	return fmInfo.attr.content;
      }
    },
		    
		    //
    getFileName:
    function(fileId) {
      var fmInfo = this.fmObj[ fileId ].info;
      return fmInfo.attr.label;
    },
		    //
    closeAll:
    function() {
      this.jstree.jstree("close_all", -1);
    },
		    //
    getIdByPath:
      function(path){
      var i = path.indexOf("/_ei_files/");
      if ( i != -1 )
	  path = path.substr(i+10,path.length);

     // if the first char is not /, add it
     if ( path.charAt(0) != '/' )
	 path = "/"+path;

     if(this.existsFm(path))
	return this.fmIdByPath[path];
      else
	return -1;
    },
		    //
    calculatePathById:
    function(fmId){
      return this.calculatePath(this.fmObj[fmId].info);
    },
		    //
    calculatePath:
    function(fmInfo){
      var path = "";
      if(fmInfo.attr["rel"]=="folder" || fmInfo.attr["rel"]=="folderLock" || fmInfo.attr["rel"]=="folderRepo")
	path = "/";
      path = fmInfo.data + path;
      if(fmInfo.attr["parentId"]!=null)
	path = this.calculatePathById(fmInfo.attr["parentId"]) + path;
      else path = "/"+path;
      return path;
    },
		    //
    existsFm:
    function(path){
      return ( (this.fmIdByPath[path]) !== undefined);
    },
		    //
    joinGithubWithfm:
    function(fmId,gh,branch,node,path){
      this.fmObj[fmId].info.attr.githubId = gh;
      this.fmObj[fmId].info.attr.urlGitHub = true;
      this.fmObj[fmId].info.attr.branch = branch;
      this.fmObj[fmId].info.attr.gh_path = path;
      this.fmObj[fmId].info.attr.gh_node = {};
      this.fmObj[fmId].info.attr.gh_node.path = path;
      if(node != null){
	switch(node.type){
	  case "dir":
	    this.fmObj[fmId].info.attr.url = node.sha;
	    this.fmObj[fmId].info.attr.loaded = false;
	    this.fmObj[fmId].info.attr.gh_node = node;
	    break;
	  case "tree":
	    this.fmObj[fmId].info.attr.url = node.sha;
	    this.fmObj[fmId].info.attr.loaded = false;
	    this.fmObj[fmId].info.attr.gh_node = node;
	    break;
	  case "blob":
	    this.fmObj[fmId].info.attr.gh_node = node;
	    break;
	  case "file":
	    this.fmObj[fmId].info.attr.gh_node = node;
	    break;
	};
      }
    },

		    //
    requestCommit:
    function(fm,fmId){

      var self = this;
    /*  if($("#CommitterForm").length){
	$("#CommitterForm").dialog("open");
	return;
      }*/
      var owner = $('<div id="CommitterForm"></div>');
      var div = $('<div id="committer-content"></div>');
      var gh_id = self.fmObj[fmId].info.attr.githubId;
      var gh_branch = self.fmObj[fmId].info.attr.branch;

      var remoteRepo = self.githubs[gh_id].repo;
      var gh_path = self.fmObj[fmId].info.attr.gh_path|| undefined;
     
      if(!gh_path)
	gh_path = self.fmObj[fmId].info.attr.gh_node.path||"";
      var formu = $('<div id="formCommitGithub">'+
		    '<label><b>Title*: </b></label>'+
		    '<input type="text" id="titlePR"/>'+
		    '<br/>'+
		    '<label><b>Comment*: </b></label>'+
		    '<input type="text" id="commentPR"/>'+
		    '<br/>'+
		    '<label><b>User*: </b></label>'+
		    '<input type="text" id="userPR"/>'+
		    '<br/>'+
		    '<label><b>Password*: </b></label>'+
		    '<input type="password" id="passPR"/>'+
		    '</br></div>');
      var CommitButton = $('<button id="commit-auth">Commit</button>');
      $(CommitButton).button();
      $(formu).append(CommitButton);
      $(CommitButton).click(function(event){ 
	var arr = new Array();
	var c_tree = self.commitTree(arr,fmId,gh_path,true);
	self.doCommit(remoteRepo,gh_branch,c_tree,gh_path);
      });
      $(div).append(formu);
      $(owner).append(div);
      $(owner).dialog({
	title: "Commit",
	resizable: true,
	height:400,
	width: 600,
	modal: true,
	buttons: {
	  "Close": function() {
	    $( this ).dialog( "close" );
	    $("#CommitterForm").remove();
	  }
	}
      });
    },
		    //
    commitTree:
    function(arr,fmId,path,first){
      var self = this;
      var fmObjA = self.fmObj[fmId]; 
      var n_arr = arr;
      var dir = path;
      var gh_node = fmObjA.info.attr.gh_node;
      switch(fmObjA.info.attr.rel){
	case "folderRepo":
	  if(fmObjA.info.attr.gh_base || (!fmObjA.info.attr.base && fmObjA.info.attr.urlLoaded)){
	    dir = (dir !="" && !first)?dir+"/":dir;
	    var childs = fmObjA.info.attr.members;
	    if(!fmObjA.info.attr.gh_base && !first)
	      dir = dir + fmObjA.info.attr.label;
	    for(var i = 0; i < childs.length; i++){
	      n_arr = self.commitTree(n_arr,childs[i],dir,false);
	    }
	  }else{
	    dir = (dir !=""&& !first)?dir+"/":dir;
	     var label = dir+fmObjA.info.attr.label;
	      var nodo = {
		"mode":gh_node.mode || "040000",
		"path":label,
		"type":"tree",//gh_node.type,
		"sha": gh_node.sha
	      };
	      
	      n_arr.push(nodo);
	  }
	  break;
	case "fileRepo":
	  dir = (dir !=""&& !first)?dir+"/":dir;
	  var label = dir+fmObjA.info.attr.label;
	    if(fmObjA.info.attr.open){
	     
	      var nodo = {
		"mode":gh_node.mode || "100644",
		"path":label,
		"type":gh_node.type || "blob",
		"content": self.codearea.getTabContent(fmObjA.info.attr.fmId)
	      };
	      n_arr.push(nodo);
	    }else{
	     
	      var nodo = {
		"mode":gh_node.mode|| "100644",
		"path":label,
		"type":"blob",//gh_node.type,
		"sha": gh_node.sha
	      };
	      
	      n_arr.push(nodo);
	    }
	  break;
	default:
	  break;
      };

      return n_arr;
    },
		    //
    doCommit:
    function(remoteRepo,branch,tree,gh_path){

      var self = this;
      var titlePR = $("#titlePR").val();
      var commentPR = $("#commentPR").val();
      var userGH = $("#userPR").val();
      var passwordGH = $("#passPR").val();
      if(userGH == "" || passwordGH == "" || titlePR =="" || commentPR == ""){
	alert("All fields are required!");
	return;
      }
      var g = new Github({
	"username":userGH,
	"password":passwordGH,
	"auth":"basic"
      });
      var r = g.getRepo(remoteRepo.user,remoteRepo.repo);
      r.show();
      var base_tree = "";
      var error = false;;
      r.getTree(branch,true,function(err,tree,oth){
	if(err){self.errorCommit("getTree",err);error = true;return;}
	base_tree = oth.sha;
      });
      if(error)return;
      r.postTree(tree,base_tree,function(err,sha){
	if(err){self.errorCommit("postTree",err);return;}
	r.getSha(branch,"",function(err,currSha){
	  if(err) {self.errorCommit("getSha",err);return;}
	  r.commit(currSha,sha,commentPR,function(err,data){
	    if(err) {self.errorCommit("r.commit",err);return;}
	    r.updateHead(branch,data,function(err,done){
	      if(err) {self.errorCommit("updateHead",err);return;}
	      else {
		 $("#CommitterForm").dialog("close");
		 $("#CommitterForm").remove();
		alert("Done!");
	      }
	    });
	  });
	});
      });
      return;
    },	  
		    //
    errorCommit:
    function(zone,err){
      console.log(zone,err);
      alert("Commit Error");
    },
		    //
    requestRemote:
    function(fm,fmId){
      var self = this;
      if($("#remoteFileSelector").length){
	$("#remoteFileSelector").dialog("open");
	return;
      }
      var owner = $('<div id="remoteFileSelector"></div>');
      var tabs = $('<div id="remoteOptions"></div>');
      var Roptions = ["Computer","GitHub"];
      var listRO = $('<ul id="listRO"></ul>');
      $(Roptions).each(function (k,v){
	var liOption = $('<li><a href="#RO-'+v+'">'+v+'</a></li>');
	var divOption = $('<div id="RO-'+v+'"></div>');
	self.getFormRemoteFiles(divOption,v,fm,fmId);
	$(listRO).append(liOption);
	$(tabs).append(divOption);
      });
      $(tabs).prepend(listRO);
      $(tabs).tabs();
      $(owner).append(tabs);
      $(owner).dialog({
	title: "Remote Files",
	resizable: true,
	height:400,
	width: 600,
	modal: true,
	buttons: {
	  "Close": function() {
	    $( this ).dialog( "close" );
	  }
	}
      });
    },
		    //
    buildGithubTree:
    function(repoId,tree,dir,parentId,branch,close){
      var self = this;
      //construir arbol en el filemanager
      var path = (dir!="")?dir+"/":dir;
      $(tree).each(function(k,v){
	switch(v.type){
	  case "blob":
	    self.joinGithubWithfm(self.addFile(v.path,parentId , "", v.sha , "Repo",false),repoId,branch,v,path);
	    break;
	  case "file":
	    self.joinGithubWithfm(self.addFile(v.name,parentId , "", v.sha , "Repo",false),repoId,branch,v,path);
	    break;
	  case "tree":
	    self.joinGithubWithfm(self.addFolder(v.path,parentId ,  "Repo"),repoId,branch,v,path+v.path);
	    break;
	  case "dir":
	    self.joinGithubWithfm(self.addFolder(v.name,parentId ,  "Repo"),repoId,branch,v,path+v.name);
	    break;
	  default:
	    console.log("unknow github type.",v.type);
	    break;
	}
      });
      if(close)
	self.closeAll();

    },
		    //
    addGithub:
    function(user,repo,branch,dir,pId){
      var self = this;
      self.githubs[0] = new Github({
	username: "",
	password: "",
        auth: "basic"
      });
      self.buildRepo(self.githubs[0],user,repo,branch,dir,pId,true);
    },
		    //
    buildRepo:
    function(git,ownerGH,repoGH,branch,dir,parentId,close){
      var self = this;
      var repoId = ownerGH+"_"+repoGH;
      if(!self.githubs[repoId] || !self.githubs[repoId].repo){
	try{
	  var auxy = git.getRepo(ownerGH,repoGH);
	}catch(err){
	  console.log(err);
	  return;
	}
	self.githubs[repoId] = {};
	self.githubs[repoId].repo = auxy;
      }
      var repo = self.githubs[repoId].repo;
      if(!branch || branch == "")
	branch = 'master';
     if(dir!=""){
	if(dir[0]=="/")
	  dir = dir.substring(1);
	if(dir[dir.length-1]=="/")
	  dir = dir.substring(0,dir.length-1);
       var base = null;

	repo.contents(branch,dir, function(err,content){
	  if(!err){
	    var isTree = $.isArray(content);
	    var tmp = dir.split("/");
	    if(isTree){
	      var tree = content;
	      self.githubs[repoId].tree = tree;
	      parentId = self.addFolder(tmp[tmp.length-1],parentId,"Repo");
	      self.fmObj[parentId].info.attr.githubId = repoId;
	      self.fmObj[parentId].info.attr.gh_base = false;
	      self.fmObj[parentId].info.attr.urlLoaded = true;
	      self.fmObj[parentId].info.attr.branch = branch;
	      self.fmObj[parentId].info.attr.gh_path = dir;
	      self.fmObj[parentId].info.attr.base_tree = base;
	      self.buildGithubTree(repoId,tree,dir,parentId,branch,close);  
	    }else{
	      
	      self.joinGithubWithfm(self.addFile(content.name,parentId , "", content.sha , "Repo"),repoId,branch,null,dir)
	    }
	  }
	});
      }else{
	repo.getTree(branch,false, function(err, tree) {
	  if(!err){
	    parentId = self.addFolder(repoId,parentId,"Repo");
	    self.fmObj[parentId].info.attr.githubId = repoId;
	    self.fmObj[parentId].info.attr.branch = branch;
	    self.fmObj[parentId].info.attr.gh_base = true;
	    self.fmObj[parentId].info.attr.gh_node = {};
	    self.fmObj[parentId].info.attr.gh_node.path = dir;
	    self.fmObj[parentId].info.attr.gh_path = dir;
	    self.buildGithubTree(repoId,tree,dir,parentId,branch,close);  
	  }
	});
      }
    },
		    //
    getFormRemoteFiles:
    function(div,site,fm,fmId){
      var self = this;
      switch (site) { 
   	case "Computer": 
	  $(div).append('<input type="file" id="RfilesSelector" name="files[]" multiple />');
	  var AddButton = $('<button id="addRFiles-'+site+'">Add Files</button>');
	  $(AddButton).button();
	  $(div).append(AddButton);
	  var selFiles = [];
	  $("#RfilesSelector",div).change(function(evt){ selFiles = evt.target.files;});
	  var readRFile = function(file) {
	    var reader = new FileReader();
	    reader.onloadend = function(evt) {
	      if (evt.target.readyState == FileReader.DONE) { 
		self.addFile(escape(file.name),fm.fmObj[fmId].node.attr("fmId"),evt.target.result,"","");
	      }
	    };
	    var blob = file.slice(0,file.size);
	    reader.readAsBinaryString(blob);
	  }
	  var handleButtonAdd = function(evt){
	    for (var i = 0, f; f = selFiles[i]; i++) {
	      var tmpContent = readRFile(f); 
	    }
	   // $("#RfilesSelector").replaceWith($("#RfilesSelector").clone());		  
	  };

	  $("#addRFiles-"+site,div).click(function(event){ handleButtonAdd(event);});
	  break;
	case "GitHub":
	  var formu = $('<div id="formGithub">'+
			'<label><b>Owner*: </b></label>'+
			'<input type="text" id="ownerGH"/>'+
			'<br/>'+
			'<label><b>Repository*: </b></label>'+
			'<input type="text" id="repoGH"/>'+
			'<br/>'+
			'<label>Directory: </label>'+
			'<input type="text" id="dirGH"/>'+
			'<br/>'+
			'<label>Branch: </label>'+
	  '<input type="text" id="branchGH" value="master"/>'+
			'<br/></div>');


	  var AddButton = $('<button id="connect-'+site+'">Connect</button>');
	  $(AddButton).button();
	  $(formu).append(AddButton);
	  $(formu).append('<br/><small>User and password are only for private repositories</small>'+
			  '<br/><label>User: </label>'+
			  '<input type="text" id="userGH"/>'+
			  '<br/>'+
			  '<label>Password: </label>'+
			  '<input type="password" id="passGH"/>');
	  $(div).append(formu);
	  $("input#userGH",div).focusout(function(event){
	    if($("#ownerGH").val() == ""){
	      $("#ownerGH").val($("#userGH").val());
	    }
	  });
	  $("#connect-"+site,div).click(function(event){ 
	    var userGH = $("#userGH").val();
	    var ownerGH = $("#ownerGH").val();
	    var repoGH = $("#repoGH").val();
	    var branchGH = $("#branchGH").val();
	    var dirGH = $("#dirGH").val();
	    var github_connector = null;
	    if (ownerGH =="" || repoGH =="")
	      return;
	    
	    github_connector = new Github({
	      username: userGH,
	      password: $("#passGH").val(),
	      auth: "basic"
            });

	    self.buildRepo(github_connector,ownerGH,repoGH,branchGH,dirGH,fm.fmObj[fmId].node.attr("fmId"));
	  });	  
	  break;
	default:
	  $(div).append("<div>Error, Unkown Service</div>");
	  break;
      }
    }


  }
  
  return FileManager;
  
})();
