window.ResizeEfect = (function() {
    "use strict";
    
    function ResizeEfect(options) {
      console.log("EXISTO");
      this.count = -1;
      this.dragging = new Array();
      this.actual = -1;
      this.ww = new Array();
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
	  self.ww[me] = $('#'+leftId).parent().width();
	    e.preventDefault();
	    self.dragging = e.pageX;
	    self.actual = me;
	    var main = $('#'+rightId);
            $(document).mousemove(function(e){
	      if (self.dragging && me == self.actual) {
		var sum = e.pageX-self.dragging;
		var wL = parseInt($('#'+leftId).css("width").slice(0, -2));
		var wR = parseInt($('#'+rightId).css("width").slice(0, -2));
		$('#'+leftId).css("width",((wL+sum)*100.0/self.ww[me])+"%");
		$('#'+rightId).css("width",((wR-sum)*100.0/self.ww[me])+"%");
		self.dragging = e.pageX;
	      }
	    });
	  });
	  $(document).mouseup(function(e){
	    if (self.dragging && me == self.actual) {
	      var sum = e.pageX-self.dragging;
	      var wL = parseInt($('#'+leftId).css("width").slice(0, -2));
	      var wR = parseInt($('#'+rightId).css("width").slice(0, -2));
	      $('#'+leftId).css("width",((wL+sum)*100.0/self.ww[me])+"%");
	      $('#'+rightId).css("width",((wR-sum)*100.0/self.ww[me])+"%");
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
	    self.ww[me] = $('#'+upId).parent().height();
	    e.preventDefault();
	    self.dragging = e.pageY;
	    self.actual = me;
	    var main = $('#'+upId);
            $(document).mousemove(function(e){
	      if (self.dragging && me == self.actual) {
		var sum = e.pageY-self.dragging;
		var hU = parseInt($('#'+upId).css("height").slice(0, -2));
		var hD = parseInt($('#'+downId).css("height").slice(0, -2));
		$('#'+upId).css("height",((hU+sum)*100.0/self.ww[me])+"%");
		$('#'+downId).css("height",((hD-sum)*100.0/self.ww[me])+"%");
 		self.dragging = e.pageY;
	      }
	    });
	  });
	  $(document).mouseup(function(e){
	    if (self.dragging && me == self.actual) {
	      var sum = e.pageY-self.dragging;
	      var hU = parseInt($('#'+upId).css("height").slice(0, -2));
	      var hD = parseInt($('#'+downId).css("height").slice(0, -2));
	      $('#'+upId).css("height",((hU+sum)*100.0/self.ww[me])+"%");
	      $('#'+downId).css("height",((hD-sum)*100.0/self.ww[me])+"%");
	      $(document).unbind('mousemove');
	      self.dragging = 0;
	    }
	  });
	}
    }

    return ResizeEfect;

})();
