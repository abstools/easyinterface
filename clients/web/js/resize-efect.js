window.ResizeEfect = (function() {
    "use strict";
    
    function ResizeEfect(options) {
      console.log("EXISTO");
      this.count = -1;
      this.dragging = new Array();
      this.actual = -1;
    };

    ResizeEfect.prototype = {
	constructor: ResizeEfect,

	addHorizontalEfect:
	function(leftId,rightId){
	  var self = this;
	  self.count = self.count+1; 
	  var me = self.count;
	  self.dragging = 0;
	  $('#'+leftId).after("<div id='drag-"+me+"' class='dragbarV'></div>");
	  $('#drag-'+me).mousedown(function(e){
	    e.preventDefault();
	    self.dragging = e.pageX;
	    self.actual = me;
	    var main = $('#'+rightId);
            $(document).mousemove(function(e){
	      if (self.dragging && me == self.actual) {
		var sum =e.pageX-self.dragging;
		var wL= parseInt($('#'+leftId).css("width").slice(0, -2));
		var wR= parseInt($('#'+rightId).css("width").slice(0, -2));
		$('#'+leftId).css("width",wL+sum);
		$('#'+rightId).css("width",wR-sum);
		self.dragging = e.pageX;
	      }
	    });
	  });
	  $(document).mouseup(function(e){
	    if (self.dragging && me == self.actual) {
	      var sum =e.pageX-self.dragging;
	      var wL= parseInt($('#'+leftId).css("width").slice(0, -2));
	      var wR= parseInt($('#'+rightId).css("width").slice(0, -2));
              $('#'+leftId).css("width",wL+sum);
              $('#'+rightId).css("width",wR-sum);
	      $(document).unbind('mousemove');
	      self.dragging = 0;
	    }
	  });

	},
	     //
	addVerticalEfect:
	function(upId,downId){
	  var self = this;
	  self.count = self.count+1;
	  var me = self.count;
	  self.dragging = 0;
	  $("#"+upId).after("<div id='drag-"+me+"' class='dragbarH'></div>");
	  $('#drag-'+me).mousedown(function(e){
	    e.preventDefault();
	    self.dragging = e.pageY;
	    self.actual = me;
	    var main = $('#'+upId);
            $(document).mousemove(function(e){
	      if (self.dragging && me == self.actual) {
		var sum =e.pageY-self.dragging;
		var hU= parseInt($('#'+upId).css("height").slice(0, -2));
		var hD= parseInt($('#'+downId).css("height").slice(0, -2));
		$('#'+upId).css("height",hU+sum);
		$('#'+downId).css("height",hD-sum);
 		self.dragging = e.pageY;
	      }
	    });
	  });
	  $(document).mouseup(function(e){
	    if (self.dragging && me == self.actual) {
	      var sum =e.pageY-self.dragging;
	      var hU= parseInt($('#'+upId).css("height").slice(0, -2));
	      var hD= parseInt($('#'+downId).css("height").slice(0, -2));
              $('#'+upId).css("height",hU+sum);
              $('#'+downId).css("height",hD-sum);
	      $(document).unbind('mousemove');
	      self.dragging = 0;
	    }
	  });
	}
    }

    return ResizeEfect;

})();
