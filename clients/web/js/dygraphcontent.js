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
        var stData = {};
        stData.execid = c.attr(_ei.outlang.syntax.streamid) || null;
        stData.extension = c.attr(_ei.outlang.syntax.streamext) || "ei";
        stData.action = c.attr(_ei.outlang.syntax.streamaction) || "prepend";
        stData.time = c.attr(_ei.outlang.syntax.streamtime) || 500;
        stData.isStream = (stData.execid != null);
	
	return new DygraphContent({
	    content: c,
	    outclass: outclass,
	    stData: stData
	});
    }

   function DygraphContent(options) {	  
     var self = this;
       if(options.replace)
	   self.DygraphN = options.replaceDygraphN;
       else {
	   self.DygraphN = DygraphNumber;
	   DygraphNumber++;
       }
     self.stData = options.stData;
     self.numgh = 0;
     self.content = $('<div id="'+self.getTag()+'"><div class="data"><div id="wrapGraphs'+self.DygraphN+'"><br/></div></div></div>');
//     self.content = $("<div></div>");
     self.jsonData = buildJSON(options.content);
     self.groups = new Set();
     self.labels = new Set();
     self.g2k = {};
     self.l2k = {};
     self.graphs = new Array();

     parseInput(self,self.jsonData);
     buildHolder(self,self.jsonData);
     buildControl(self);

     self.streamBttn = $("<button class='ei-console-stream-button'>Streaming...</button>");
     $(self.streamBttn).button({ 
       icons: { primary: "ui-icon-stop"}, 
       text: "stream" 
     }).click( function() { 
       self.disableStreamButton();
       self.doc.off(self.stData.execid,true);
     });
     $(self.streamBttn).hide();

     self.refreshBttn = $("<button class='ei-console-refresh-button'>Refresh</button>");
     $(self.refreshBttn).button({ 
       icons: { primary: "ui-icon-arrowrefresh-1-s"}, 
       text: "refresh" 
     }).click( function() { 
       self.doc.requestChunks(self.doc,self.stref);
     });
     $(self.refreshBttn).hide();

     if(self.isStream()){
       self.content.prepend(self.streamBttn);
       self.content.prepend(self.refreshBttn);
     }
   }


  // this method has a problem that it does not allow using { and }
  // inside the values of the json that it parses
  //
  function buildJSON(content) {
    var jsonArr = JSON.parse("{}");
    var text = $(content).text();
    var count = 0;
    var startPos = 0;
    var endPos = 0;
    try { 
	do {
	    startPos = text.indexOf("{",endPos);
	    if ( startPos != -1 ) {
		endPos = text.indexOf("}",startPos);
		var sub = text.substring(startPos,endPos+1);
		var js = JSON.parse(sub);

		if ( !js["groups"] ) {
		    js["groups"] = ["DC"+count];
		}

		if ( !js["labels"] ) {
		    js["labels"] = ["default"];
		}

		jsonArr[count] = js;
		count++;
		startPos = endPos+1;
	    }
	} while ( startPos != -1 );
    } catch (e) {
      console.log("Failed to parse DyGraph JSON\n", text);
    }

    return jsonArr;
  }

/*
  function buildJSON(content){
    var jsonArr = JSON.parse("{}");
    var text = $(content).text();
      alert(text);
    var previous = 0;
    var pos = text.indexOf("}");
    var sub = text;
    var count = 0;
    try{
      while(pos != -1){
	pos++;
	var sub = text.substring(previous,pos);
	var js = JSON.parse(sub);
	jsonArr[count] = js;
	count++;
	text = text.substring(pos);
	pos = text.indexOf("}");
     }
    }catch(e){
      console.log("JSON parse errors\n", text);
    }
    return jsonArr;
  }
*/
  function parseInput(self,jsonData){
    self.gadded = [];
    self.ladded = [];
    self.nadded = {"g":[],"l":[]};
    // Get all Groups and Labels
    var aux;
    $.each(jsonData, function(i,gh) {
      if("groups" in gh){
	aux = self.groups.addArrayIfNoExists(gh["groups"]);
	$.each(aux,function(i,v){self.gadded.push(v);});
      }
      if("labels" in gh){
	aux = self.labels.addArrayIfNoExists(gh["labels"]);    
	$.each(aux,function(i,v){self.ladded.push(v);});
      }
    });
    var size_d = function(dict){var c=0; for(var e in dict)c++; return c;};
    var lindx = size_d(self.l2k);
    var gindx = size_d(self.g2k);
    $.each(self.gadded,function(i,v){self.g2k["gph"+self.DygraphN+"C"+gindx]=v;self.nadded.g["gph"+self.DygraphN+"C"+gindx]=v;gindx++;});
    $.each(self.ladded,function(i,v){self.l2k["gph"+self.DygraphN+"L"+lindx]=v;self.nadded.l["gph"+self.DygraphN+"L"+lindx]=v;lindx++;});
  }

  function buildHolder(self,jsonData){
    var idx = self.numgh;
    $.each(jsonData,function(i,B){
      var div = $("<div id='graph"+self.DygraphN+"_"+idx+"'></div>");
      $(self.content).find("#wrapGraphs"+self.DygraphN).append(div);
      idx++;
    });
  }
  

  function buildControl(self){
    var html = '<div id="control'+self.DygraphN+'" style="width:100%;height:100px;">'+
	       '<select id="list'+self.DygraphN+'C" multiple style="width:15%;height:100%;">'+
	       '<option disabled="disabled">Inactive Groups</option>';
    html = html+'</select>&nbsp;'+
	   '<button id="btn'+self.DygraphN+'Cadd">&gt;&gt;</button>&nbsp;'+
	   '<button id="btn'+self.DygraphN+'Csub">&lt;&lt;</button>&nbsp;'+
	   '<select id="list'+self.DygraphN+'ActivC" multiple style="width:15%;height:100%;">'+
	   '<option disabled="disabled">Active Groups</option>';
    html = html+self.generateOptions(self.g2k)+

	   '</select>&nbsp;&nbsp;&nbsp;&nbsp;'+
	   '<select id="list'+self.DygraphN+'L" multiple style="width:15%;height:100%;">'+
	   '<option disabled="disabled">Inactive Labels</option>';
    html = html +'</select>&nbsp;'+
	   '<button id="btn'+self.DygraphN+'Ladd">&gt;&gt;</button>&nbsp;'+
	   '<button id="btn'+self.DygraphN+'Lsub">&lt;&lt;</button>&nbsp;'+
	   '<select id="list'+self.DygraphN+'ActivL" multiple style="width:15%;height:100%;">'+
	   '<option disabled="disabled">Active Labels</option>';
    html = html+self.generateOptions(self.l2k)+
	   '</select></div>';
     $(self.content).find(".data").prepend($(html));
     $(self.content).find("#btn"+self.DygraphN+"Cadd").click(function(){self.addOpt(self.DygraphN,'C');});
    $(self.content).find("#btn"+self.DygraphN+"Csub").click(function(){self.subOpt(self.DygraphN,'C');});
    $(self.content).find("#btn"+self.DygraphN+"Ladd").click(function(){self.addOpt(self.DygraphN,'L');});
    $(self.content).find("#btn"+self.DygraphN+"Lsub").click(function(){self.subOpt(self.DygraphN,'L');});
  }

  DygraphContent.prototype = {
	constructor: DygraphContent,
        "getDOM":
        function() {
	  var self = this;
	  setTimeout(function(){ self.buildGraphs(self,self.jsonData); }, 3000);
	  return this.content;
	},
	     getTag:
	function(){
	  return "dygraphcontent"+this.DygraphN;
	},
	     addOpt:
	function(N,type){
	  var source = "list"+N+""+type;
	  var dest = "list"+N+"Activ"+type;
	  var ret = this.switchOpt(source,dest);
	  for(var t=0;t<ret.length;t++)
	    this.searchGraphs(type,ret[t],1);
	},
	     subOpt:
	function(N,type){
	  var dest = "list"+N+""+type;
	  var source = "list"+N+"Activ"+type;
	  var ret = this.switchOpt(source,dest);
	  for(var t=0;t<ret.length;t++)
	    this.searchGraphs(type,ret[t],-1);
	},
	     switchOpt:
	function(from, to){
	  var selectedValues = [];    
	  $("#"+from+" :selected").each(function(){
	    $(this).appendTo("#"+to);
            selectedValues.push($(this).val()); 
	  });
	  return selectedValues;
	},
	     searchGraphs:
	function(type,token,hide){
	  var self = this;
	  var find;
	  var arr;
	  var cnt;
	  switch(type){
	    case "L":
	      find = self.l2k[token];
	      arr = "labels";
	      cnt = "nl";
	      break;
	    case "C":
	      find = self.g2k[token];
	      arr = "groups";
	      cnt = "ng";
	      break;
	  }
	  for(var g in self.graphs){
	    for(var grps in self.graphs[g][arr]){
	      if(self.graphs[g][arr][grps] == find){
		self.graphs[g][cnt] += hide;
		if(self.graphs[g]["nl"]>0 && self.graphs[g]["ng"]>0){
		  $("#"+self.graphs[g]["id"]).show();
		}else{
		  $("#"+self.graphs[g]["id"]).hide();
		}
	      }
	    }
	  }
	},
	     generateOptions:
	function(arr){
	  var options = "";
	  var index;
	  for (index in arr){
	    options += "<option value='"+index+"'>"+arr[index]+"</option>";
	  }
	  return options;
	},
	     buildGraphs:
	function (self,jsonData){
	  var self = this;
	  var i =  self.numgh;
	  $.each(jsonData, function(idx,g){
	    var options = {};
	    options['title'] = g.title;
	    if(g["f-titles"])
	      options['labels'] = g["f-titles"];
	    if(g["y-title"]) 
	      options['ylabel'] = g["y-title"];
	    if(g["x-title"])
	      options['xlabel'] = g["x-title"];

	    var divid = "graph"+self.DygraphN+"_"+i+"";

	    var ghp = new Dygraph(
	      document.getElementById(divid),//div,
              g.values,
              options
	    );
	      
	    self.graphs[i]={};
	    self.graphs[i]["id"] = "graph"+self.DygraphN+"_"+i+"";
	    self.graphs[i]["groups"] = g["groups"];
	    self.graphs[i]["ng"] = g["groups"].length;
	    self.graphs[i]["labels"] = g["labels"];
	    self.graphs[i]["nl"] = g["labels"].length;
	    i++;
	  });
	  self.numgh = i;
	},


	// MODIFY CONTENT
        replace:
	function(newcontent){
	    var self = this;
	    var stDt = this.stData;
	    var outclass = null;
	    var a = new DygraphContent({
		content: newcontent,
		outclass: outclass,
		stData: stDt,
		replace:true,
		replaceDygraphN: self.DygraphN
	    });
	    self.groups = a.groups;
	    self.labels = a.labels;
	    self.g2k = a.g2k;
	    self.l2k = a.l2k;
	    self.graphs = a.graphs;
	    self.numgh = a.numgh;
	    self.jsonData = a.jsonData;
	    self.streamBttn =  a.streamBttn;
	    self.gadded = a.gadded;
	    self.ladded = a.ladded;
	    self.nadded = a.nadded;
	    $(self.content).find("#wrapGraphs"+self.DygraphN).html( $(a.content).find("#wrapGraphs"+a.DygraphN).html() );
	    $("#wrapGraphs"+self.DygraphN).html( $(a.content).find("#wrapGraphs"+a.DygraphN).html() );
	    $(self.content).find("#control"+self.DygraphN).html( $(a.content).find("#control"+a.DygraphN).html() );
	    $("#control"+self.DygraphN).html( $(a.content).find("#control"+a.DygraphN).html() );
	    setTimeout(function(){ self.buildGraphs(self,self.jsonData); }, 3000);
	},

        prepend:
	function(newcontent){
	  var self = this;
	  self.addNewContent(newcontent);
	},

        append:
	function(newcontent){
	  var self = this;
	  self.addNewContent(newcontent);
	},

	addNewContent:
	function(newcontent){
	  var self = this;
	  var newJson = buildJSON(newcontent);
	  parseInput(self,newJson);
	  buildHolder(self,newJson);
	  self.updateControl();
	  self.buildGraphs(self,newJson);
	  
	},

	updateControl:
	function(){
	  // I supossed the data to be update is in self.gadded and self.ladded
	  // TODO: If a group or a label is unactive 
	  //       I have to hide the new graph and decrease nl and ng counters
	  var self = this;
	  $('#list'+self.DygraphN+'ActivC').append(self.generateOptions(self.nadded.g));
	  $('#list'+self.DygraphN+'ActivL').append(self.generateOptions(self.nadded.l));

	},

	// STREAM INFO
        "isStream":
	function(){
	  return this.stData.isStream;
	},

        getStreamData:
	function(){
	  return this.stData;
	},

	// STREAM BUTTON
       activeStreamButton:
       function(doc){
	 if(!this.isStream())
	    return;
	 this.streamBttn.show();
	 this.refreshBttn.show();
	 this.doc = doc;
	 this.enableStreamButton();
       },
       removeStreamButton:
       function(){
	  if(!this.isStream())
	    return;
	 this.streamBttn.hide();
	 this.refreshBttn.hide();
	 this.stData.isStream = false;
	 return;
	 //self.contentArray[num].content.removeStreamButton();
       },

       enableStreamButton:
       function(){
	  if(!this.isStream())
	    return;
	 this.streamBttn.removeAttr("disabled");
	 return;
	 //self.contentArray[num].content.enableStreamButton();
       },

       disableStreamButton:
       function(){
	  if(!this.isStream())
	    return;
	 this.streamBttn.attr("disabled","disabled");
	 return;
	 //self.contentArray[num].content.disableStreamButton();
       }

   }
    
    return DygraphContent;
	
})();
