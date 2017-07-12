window.ToolSelector = (function() {
    "use strict";
    
    function ToolSelector(options) {	
	
	this.selectorHolder = null;
	this.selector = null;
	this.tools = null;

	this.setOptions(options);
	this.initSelector();
       
    };

    ToolSelector.prototype = {
	constructor: ToolSelector,

	//
	setOptions:
	function(options) {
	    this.selectorHolder = $(options.holder);
	},

	//
	initSelector:
	function() {
	    var self = this;
	    this.selector = $("<select class='custom-combobox custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-all' id='combobox' ></select>");
	    this.selector.change( function () { self.tools.setActiveTool( $(this).val() ); }) ;
	    this.selectorHolder.append(this.selector);
	},

	//
	setToolsObj:
	function( tools ) {
	    this.tools = tools;
	},
	//
	selectTool:
	function(toolId){
	  this.selector.val(toolId);
	  this.selector.change();
	},

	//
	addTool:
	function(toolId, toolDesc) {
	    this.selector.append("<option value='"+toolId+"'>"+toolDesc+"</option>");
	},

	//
	getTool:
	function(){
	  var val = this.selector.val();
	  if(!val)
	    val = $("option",this.selector).value();
	  return val;
	}
    }

    return ToolSelector;

})();
