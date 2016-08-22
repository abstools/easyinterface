window.ComboWidget = ( function() {
    "use strict";

    function ComboWidget( widgetInfo ) {
	var self = this;
	this.widgetInfo = widgetInfo;
	this.id = widgetInfo.id;

	this.env = $("<div class='ei-paramwidget-combo'></div>");

	this.env.append("<div class='params-left-col'></div>"+
			"<div class='params-mid-col'>"+
			"<div class='desc'>"+widgetInfo.desc.short+"</div>"+
			"<div class='selector'><select class='ui-widget ui-state-default ui-corner-all'></select></div>"+
			"</div>");


	this.select = this.env.find("select");
	if ( widgetInfo.multiple ) {
	    this.select.attr("multiple","multiple");
	}
	if ( widgetInfo.callback ) {
	    this.select.change( function() {
		widgetInfo.callback( { value: self.select.val() } );
	    });
	}

	for(var i=0; i<widgetInfo.options.length; i++) {
	    var option = $(document.createElement("option"));
	    option.append(widgetInfo.options[i].desc.short);
	    option.attr("value",widgetInfo.options[i].value);

	/*    if ( widgetInfo.options[i].value == widgetInfo.default_value ) {
		option.attr("selected","selected");
	    }*/
	  this.select.append( option );
	}
      for(var k in widgetInfo.default_value){
	$("option[value='" + widgetInfo.default_value[k] + "']",this.select).attr("selected","selected");
      }
      this.select.change();
      
	if ( widgetInfo.desc.long ) { 
	    var x = $("<div class='params-right-col'><span class='ui-icon ui-icon-info'></span></div>");
	    this.env.append(x); 
	    x.tooltip({ items: x.find("span"), content: widgetInfo.desc.long });
	}



    };

    


    ComboWidget.prototype = {
	constructor: ComboWidget,
	
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
	setValue:
	function(newvalue) {
	    var self = this;
	    this.select.find("option").each(function (k,opt){
	      if($.inArray($(opt).val(), newvalue)>-1){
		$(opt).prop("selected",true);
	      }else{
		$(opt).removeAttr("selected");
	      }
	    });
	  this.env.find("select").change();
	},
	//
	getValue:
	function() {
	    var widgetValue = new Array();
	    widgetValue = this.select.val();
	    return widgetValue;
	},

	//
	restoreDefault:
	function() {
	    var self = this;
	    this.select.find("option").each(function (k,opt){
	      if($.inArray($(opt).val(), self.widgetInfo.default_value)>-1){
		$(opt).prop("selected",true);
	      }else{
		$(opt).removeAttr("selected");
	      }
	    });
	  this.env.find("select").change();
	}
    }

    return ComboWidget;
})();
