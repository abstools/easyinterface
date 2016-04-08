window.Set = (function() {
    "use strict";

    function Set() {	
	this.value = new Array();
    };

    Set.prototype = {
	constructor: Set,

	//
	add:
	function(e) {
	    this.value[ this.value.length ] = e;
	},

	//
	addArray:
	function(arr) {
	  var self = this;
	    $.each(arr,function(i,e){
	      self.value[ self.value.length ] = e;
	    });
	},


	//
	addArrayIfNoExists:
	function(arr) {
	  var self = this;
	  var result = [];
	    $.each(arr,function(i,e){
	      if($.inArray(e, self.value) == -1){
		self.value[ self.value.length ] = e;
		result[result.length ] = e;;
	      }
	    });
	  return result;
	},

	//
	union:
	function(s) {
	     for(var i=0; i<s.value.length; i++)
		 this.value[ this.value.length ] = s.value[i];
	},

	//
	get:
	function() {
	    return this.value;
	},

	//
	unique:
	function() {
	  var result = [];
	  $.each(this.value, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
	  });
	  this.value = result;
	},

	//
	size:
	function() {
	    return this.value.length;
	},

	//
	iterate:
	function( action ) {
	    for(var i=0; i<this.value.length; i++) {
		action(this.value[i]);
	    }
	},

	//
	orderIterate:
	function( action ) {
	    for(var i=0; i<this.value.length; i++) {
		action(i,this.value[i]);
	    }
	},

	asyncIterate:
	function( action, cont ) {
	    this.asyncIterate_aux(action, 0, cont);
	},

	//
	asyncIterate_aux:
	function( action, i , cont) {
	    var self = this;
	    setTimeout( function() {
		    if ( i<self.value.length ) {
			action(self.value[i]);
			self.asyncIterate_aux(action,i+1,cont);
		    } else {
			if( cont ) cont();
		    }
		}, 0);
	}

    }

    return Set;

})();
