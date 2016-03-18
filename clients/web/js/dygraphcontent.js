/*
  Dygraph content environment
*/

window.DygraphContent = (function() {
    "use strict";
  var DygraphNumber = 0;
    DygraphContent.parse = function(c, ei_info) { 
	var tag = c[0].tagName;
	var format = c.attr(_ei.outlang.syntax.format);

	if ( tag != _ei.outlang.syntax.content || format != _ei.outlang.syntax.dygraphcontent ) return null;

	var outclass = c.attr(_ei.outlang.syntax.outclass) || ei_info.outclass;

	return new DygraphContent({
	    content: c,
	    outclass: outclass
	});
    }

   function DygraphContent(options) {	  
     var self = this;
     self.DygraphN = DygraphNumber;
     DygraphNumber++;
     self.content = $("<div></div>");
     console.log($(options.content).text());
     self.jsonData = $.parseJSON($(options.content).text());
     self.groups = new Set();
     self.labels = new Set();
     parseInput(self);
     console.log(self);
     buildHolder(self);
     //buildGraphs(self);
     buildControl(self);


      // this.content.append( $(options.content).text());//prop('outerHTML') );
   }

  function parseInput(self){
    // Get all Groups and Labels
    $.each(self.jsonData["graphs"], function(i,gh) {
      if("groups" in gh)
	self.groups.addArray(gh["groups"]);
      if("labels" in gh)
	self.labels.addArray(gh["labels"]);  
    });
    self.groups.unique();
    self.labels.unique();
    self.g2k = {};
    self.l2k = {};
    self.groups.orderIterate(function(k,v){self.g2k[v] = "gph"+self.DygraphN+"C"+k;});
    self.labels.orderIterate(function(k,v){self.l2k[v] = "gph"+self.DygraphN+"L"+k;});


  }

  function buildHolder(self){
    var wrap = $("<div id='wrapGraphs"+self.DygraphN+"'></div>");
    for(var i = 0; i < self.jsonData["graphs"].length; i++){
      var div = $("<div id='graph"+self.DygraphN+"_"+i+"'></div>");
      $(wrap).append(div);
    }
    self.content.append(wrap);
  }
  

  function buildControl(self){
    var html = '<div id="control'+self.DygraphN+'" style="width:100%;height:100px;">'+
	       '<select id="list'+self.DygraphN+'C" multiple style="width:15%;height:100%;">'+
	       '<option disabled="disabled">Inactive Groups</option>';
    html = html+self.generateOptions(self.g2k);
    html = html+'</select>&nbsp;'+
	   '<button id="btn'+self.DygraphN+'Cadd">&gt;&gt;</button>&nbsp;'+
	   '<button id="btn'+self.DygraphN+'Csub">&lt;&lt;</button>&nbsp;'+
	   '<select id="list'+self.DygraphN+'ActivC" multiple style="width:15%;height:100%;">'+
	   '<option disabled="disabled">Active Groups</option>'+
	   '</select>&nbsp;&nbsp;&nbsp;&nbsp;'+
	   '<select id="list'+self.DygraphN+'L" multiple style="width:15%;height:100%;">'+
	   '<option disabled="disabled">Inactive Labels</option>';
    html = html+self.generateOptions(self.l2k);
    html = html +'</select>&nbsp;'+
	   '<button id="btn'+self.DygraphN+'Ladd">&gt;&gt;</button>&nbsp;'+
	   '<button id="btn'+self.DygraphN+'Lsub">&lt;&lt;</button>&nbsp;'+
	   '<select id="list'+self.DygraphN+'ActivL" multiple style="width:15%;height:100%;">'+
	   '<option disabled="disabled">Active Labels</option>'+
	   '</select></div>';
    self.content.prepend($(html));
    $("#btn"+self.DygraphN+"Cadd",self.content).click(function(){self.addOpt(self.DygraphN,'C');});
    $("#btn"+self.DygraphN+"Csub",self.content).click(function(){self.subOpt(self.DygraphN,'C');});
    $("#btn"+self.DygraphN+"Ladd",self.content).click(function(){self.addOpt(self.DygraphN,'L');});
    $("#btn"+self.DygraphN+"Lsub",self.content).click(function(){self.subOpt(self.DygraphN,'L');});
  }

  DygraphContent.prototype = {
	constructor: DygraphContent,
        "getDOM":
        function() {
	  var self = this;
	  setTimeout(function(){ self.buildGraphs(self); }, 300);
	  return this.content;
	},
	     addOpt:
	function(N,type){
	  var source = "list"+N+""+type;
	  var dest = "list"+N+"Activ"+type;
	  var ret = this.switchOpt(source,dest);
	  // TODO: show graphs
	},
	     subOpt:
	function(N,type){
	  var dest = "list"+N+""+type;
	  var source = "list"+N+"Activ"+type;
	  var ret = this.switchOpt(source,dest);
	  // TODO: hide graphs
	},
	     switchOpt:
	function(from, to){
	  var selectedValues = [];    
	  $("#"+from+" :selected").each(function(){
	    $(this).appendTo("#"+to);
            selectedValues.push($(this).val()); 
	  });
	  console.log(selectedValues);
	  return selectedValues;
	},
	     generateOptions:
	function(arr){
	  var options = "";
	  var index;
	  for (index in arr){
	  //for (index = 0; index < arr.length; ++index) {
	    options += "<option value='"+arr[index]+"'>"+index+"</option>";
	  }
	  return options;
	},
	     buildGraphs:
	function (self){
	  var self = this;
	  self.graphs = new Array();
	  var options = {};
	  for(var i = 0; i < self.jsonData["graphs"].length; i++){
	    options['title'] = self.jsonData["graphs"][i].name;
	    if(self.jsonData["graphs"][i]["g-desc"])
	      options['labels'] = self.jsonData["graphs"][i]["g-desc"];

	    var g = new Dygraph(
	      document.getElementById("graph"+self.DygraphN+"_"+i+""),
              self.jsonData["graphs"][i].values,
              options));
	    
//	    self.graphs[i]["groups"] = self.jsonData

	  }
	}

   }
    
    return DygraphContent;
	
})();
