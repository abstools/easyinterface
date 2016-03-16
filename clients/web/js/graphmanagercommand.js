window.GraphManagerCommand = (function() {
    "use strict";
  
  var id_gmc = 0;
    GraphManagerCommand.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	if ( tag != _ei.outlang.syntax.graphmanager ) return null;
	var outclass = c.attr( _ei.outlang.syntax.outclass ) || ei_info.outclass;
	var boxtitle  = c.attr( _ei.outlang.syntax.boxtitle ) || "Graphs";
	var boxwidth  = parseInt(c.attr( _ei.outlang.syntax.boxwidth )) || 600;
	var boxheight  = parseInt(c.attr( _ei.outlang.syntax.boxheight )) || 400;

	var content   = c.find( _ei.outlang.syntax.ghdata ).text();
	return new GraphManagerCommand({
	    outclass: outclass, 
	    boxtitle: boxtitle, 
	    boxwidth: boxwidth,
	    boxheight: boxheight,
	    content: content
	});
    }

    function GraphManagerCommand(options) {
      id_gmc = id_gmc+1;
      this.id = "gm"+id_gmc
	this.boxtitle = options.boxtitle;
	this.boxwidth = options.boxwidth;
	this.boxheight = options.boxheight;
	this.msg = $("<div title='"+this.boxtitle+"'></div>");
        this.jsonData = $.parseJSON(options.content);
        this.groups = new Set();
        this.labels = new Set();
        this.g = {};
        this.l = {};
	this.active_l = {};
	this.active_g = {};
	this.graphs = {};
        this.updateSets();
        this.buildWindow();
      this.msg.append(this.wrap);
	this.dialogBox = null;
    };

    GraphManagerCommand.prototype = {
	constructor: GraphManagerCommand,

	//
	"do":
	function() {
	    if ( !this.dialogBox ) {
		this.dialogBox = $(this.msg).dialog({
		width: this.boxwidth,
		height: this.boxheight
		});
 var RE = new ResizeEffect();
	  RE.addVerticalEffect(this.id+"gprs",this.id+"lbls");
	    } else {
		this.dialogBox.dialog("open");
	    }
	},

	"undo":
	function() {
	    if ( this.dialogBox ) {
		this.dialogBox.dialog("destroy").remove();
	    }
	},

	updateSets:
	function(){
	  var self = this;
	  //this.jsonData;
	  $.each(self.jsonData, function(i,gh) {
	    if("groups" in gh)
	      self.groups.addArray(gh["groups"]);
	    if("labels" in gh)
	      self.labels.addArray(gh["labels"]);
	    
	  });
	  self.groups.unique();
	  self.labels.unique();
	  self.groups.orderIterate(function(k,v){self.g[v]={};self.g[v]["2k"] = k;});
	  self.labels.orderIterate(function(k,v){self.l[v]={};self.l[v]["2k"] = k;});
	},

        buildWindow:
	function(){
	  this.wrap = $("<div class='graph-wrap'></div>");
	  $(this.wrap).css({"height": "80%",backgroundColor: 'red'});
	  var manager = this.buildManager();
	  $(manager).css({"height": "40%",backgroundColor: 'green',position:"relative"});
	  var graphs = this.buildGraphs();
	  $(graphs).css({"height": "40%",backgroundColor: 'yellow'});
	  
	  $(this.wrap).append(manager);
	  $(this.wrap).append(graphs);
	 
	},

	manageChange:
	function(k,gr){
	  var self = this;
	  var toActive = !((gr)?this.active_g[k]:this.active_l[k]);
	  var g = (gr)?"g":"l";
	  var l = (gr)?"l":"g";
	  var arr = (gr)?this.active_l:this.active_g;
	  console.log("change",gr,g,l,toActive);
	  if(toActive)
	    $.each(arr,function(k,v){// read all active of the other list
	      if(v){
		$('.'+self.id+'.'+g+k+'.'+l+k).show();
		console.log("show",'.'+self.id+'.'+g+k+'.'+l+k);
	      }
	    });
	  else
	    $.each(arr,function(k,v){// read all active of the other list
	      if(v){
		$('.'+self.id+'.'+g+k+'.'+l+k).hide();
		console.log("hide",'.'+self.id+'.'+g+k+'.'+l+k);
	      }
	    });

	},
	buildManager:
	function(){
	  var self = this;
	  var W = this.boxwidth/4 -1;
	  var manager = $("<div id='"+this.id+"-manager'class='graph-manager'></div>");
	  var m_g = $("<div id='"+this.id+"grps'></div>");
	  $(m_g).css({"position":"relative","width": "48%","float": "left"});
	  self.groups.orderIterate(function(k,v){
	    self.active_g[k] = false;
	    var bs = $("<div></div>");
	    var chk = $('<label><input type="checkbox" name="checkbox" value="'+self.id+k+'g">'+v+'</label>');
	    $(chk).change(function(){
	      self.manageChange(k,true);
	      self.active_g[k] = !self.active_g[k];
	    });
	     
	    $(bs).css({"position":"relative","width": ""+W+"px","float":"left", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis"});
	    $(bs).append(chk);
	    $(m_g).append(bs);
	  });


	  var m_l = $("<div id='"+this.id+"lbls'></div>");
	  $(m_l).css({"position":"relative","width": "48%","float": "left"});
	  
	  self.labels.orderIterate(function(k,v){
	    self.active_l[k] = false;
	    var bs = $("<div></div>");
	    var chk = $('<label><input type="checkbox" name="checkbox" value="'+self.id+k+'l">'+v+'</label>');
	    $(chk).change(function(){
	      self.manageChange(k,false);
	      self.active_l[k] = !self.active_l[k];
	    });
	     
	    $(bs).css({"position":"relative","width": ""+W+"px","float":"left", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis"});
	    $(bs).append(chk);
	    $(m_l).append(bs);
	  });

	  $(manager).append(m_g);
	  $(manager).append(m_l);
	  return manager;
	},

	buildGraphs:
	function(){
	  var self = this;
	  var holder = $("<div id='"+this.id+"-graph'class='graph-graphs'></div>");
	  $.each(self.jsonData, function(i,gh) {
	    var g = self.buildGraph(gh);
	      
	    $(g).hide();
	    $(holder).append(g);
	  });
	  return holder;
	},
	
	buildGraph:
	function(data){
	    var self = this;
	    self.graphs[i] = {};

	    self.graphs[i]["json"] = data;
	    self.graphs[i]["active_groups"] = 0;
	    self.graphs[i]["active_labels"] = 0;
	    var cls = ""+self.id;
	    $.each(data["groups"],function(k,v){
		cls = cls + " g"+self.g[v]["2k"];
	    });
	    $.each(data["labels"],function(k,v){
		cls = cls + " l"+self.l[v]["2k"];
	    });
	    console.log("buildG",cls);
	    var g = $("<div class='ei_dygraph "+cls+"'> Tengo G: "+cls+" </div>");
	    self.graphs[i]["dom"] = g;
	    return g;
	}
    }

    return GraphManagerCommand;

})();
