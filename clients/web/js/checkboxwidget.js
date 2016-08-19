window.CheckBoxWidget = ( function() {
    "use strict";

    // widgetInfo is a json object with the following attributes
    //
    //  id: 
    //     just an identifier/name for this widget 
    //
    //  options: 
    //     an array of options to be listed as checkboxes, each option
    //     has the following information:
    //
    function CheckBoxWidget( widgetInfo ) {
	var self = this;
	this.widgetInfo = widgetInfo;
	this.id = widgetInfo.id;
	this.isBoolean = widgetInfo.isBoolean;
	this.env = $("<div class='ei-paramwidget-checkbox'></div>");
	this.options = new Array();
	this.env.append("<div class='params-left-col'></div>");

	var x = $("<div class='params-mid-col'></div>");
      var longdesc = "";
	for(var i=0; i<widgetInfo.options.length; i++) {
	  if(longdesc!="")
	    longdesc += "<br/>";

	    var input = $("<div><div class='desc'>"+widgetInfo.options[i].desc.short+"</div>"+
			  "<div class='selector'>"+
		          "<input class='ui-widget ui-state-default ui-corner-all' type='checkbox' value='"+
			  widgetInfo.options[i].value[0]+"'"+
			  ( widgetInfo.options[i].selected ? " checked='checked'" : "")+
			  "/>"+
			  "</div></div>"
	                 );
	  if(widgetInfo.options[i].desc.long){
	    longdesc += widgetInfo.options[i].desc.long;
	  }
	    // this.env.append("<span style='width: 200px; display: inline'>");
	    this.options[i] = {};
	  this.options[i].obj = input.find("input");
	  this.options[i].value =widgetInfo.options[i].value;
	  this.options[i].default = widgetInfo.options[i].selected;
	    x.append(input);

	    if ( widgetInfo.callback ) {
		this.options[i].obj.change( function() {
		    widgetInfo.callback( $(this).prop("value"), $(this).prop("checked") );
		});
	    }
	}

	this.env.append(x);
      if(longdesc!= ""){
	var y = $("<div class='params-right-col'><span class='ui-icon ui-icon-info'></span></div>");
	this.env.append(y); 
	y.tooltip({ items: y.find("span"), content: longdesc });
      }


    };


    CheckBoxWidget.prototype = {
	constructor: CheckBoxWidget,
	
	//
	domRoot:
	function() {
	    return this.env;
	},


	//
	getId:
	function() {
	    return id;
	},


	//
	getValue:
	function() {
	    var widgetValue = new Array();
	    var j=0;
	    for(var i=0; i<this.options.length; i++) {
		if ( this.options[i].obj.prop("checked") ) {
		    widgetValue[j] = this.options[i].value[0];
		    j++;
		}else if ( ! this.isBoolean ){
		  widgetValue[j] = this.options[i].value[1];
		  j++;
		}
	    }

	    if ( this.isBoolean && widgetValue.length == 0 )
		widgetValue[0] = this.options[i].value[1];

	    return widgetValue;
	},
	restoreDefault:
	function() {
	    var self = this;
	    var i = 0;
	    this.env.find("input").each(function (k,v){
	      if(self.options[k].default){
		$(v).prop("checked",true);//"checked"); 
	      }else
	      $(v).removeAttr("checked");		
	    });
		
	},
	setValue:
	function(newvalue) {
	  var self = this;
	  for(var i=0; i<newvalue.length; i++){
	    $(this.env.find("input[type='checkbox']")[i]).prop("checked",newvalue[i]==self.options[i].value[0]);
	  }
		
	}
    }

    return CheckBoxWidget;
})();
