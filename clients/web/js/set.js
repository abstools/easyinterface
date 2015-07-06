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
