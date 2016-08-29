window.ResizeEffect = (function() {
    "use strict";
    
    function ResizeEffect(options) {
      this.count = -1;
      this.dragging = new Array();
      this.actual = -1;
      this.ww = new Array();
      this.wL = -1;
      this.wR = -1;
      this.maxi = -1;
      this.holder = options.holder;
    };

    ResizeEffect.prototype = {
	constructor: ResizeEffect,

	addHorizontalEffect:
	function(leftId,rightId){
	  var self = this;
	  self.count = self.count+1; 
	  var me = self.count;
	  self.dragging = 0;
	  leftId.after("<div id='drag-"+me+"' class='dragbarV'><div class='colordragV'></div></div>");

	  $('#drag-'+me,self.holder).mousedown(function(e){
	    self.ww[me] = leftId.parent().width();
	    e.preventDefault();
	    self.dragging = e.pageX;
	    self.actual = me;
	    self.wL = parseInt(leftId.css("width").slice(0, -2));
	    self.wR = parseInt(rightId.css("width").slice(0, -2));
	    self.maxi = (self.wL+self.wR);
            $(document).mousemove(function(e){
	      if (self.dragging && me == self.actual) {
		var sum = e.pageX-self.dragging;
		var newL = (self.wL+sum > self.maxi*0.02)?((self.wL+sum<self.maxi*0.98)?(self.wL+sum):self.maxi*0.98):self.maxi*0.02;
		leftId.css("width",((newL)*100.0/self.ww[me])+"%");
		rightId.css("width",((self.maxi-newL)*100.0/self.ww[me])+"%");

	      }
	    });
	  });
	  $(self.holder).mouseup(function(e){
	    if (self.dragging && me == self.actual) {
	      var sum = e.pageX-self.dragging;
	      var newL = (self.wL+sum > self.maxi*0.02)?((self.wL+sum<self.maxi*0.98)?(self.wL+sum):self.maxi*0.98):self.maxi*0.02;
	      leftId.css("width",((newL)*100.0/self.ww[me])+"%");
	      rightId.css("width",((self.maxi-newL)*100.0/self.ww[me])+"%");

	      $(self.holder).unbind('mousemove');
	      self.dragging = 0;
	    }
	  });

	},
	     //
	addVerticalEffect:
	function(upId,downId){
	  var self = this;
	  self.count = self.count+1;
	  var me = self.count;
	  self.dragging = 0;
	  upId.after("<div id='drag-"+me+"' class='dragbarH'><div style='height:25%'></div><div class='colordragH'></div></div>");
	  $('#drag-'+me,self.holder).mousedown(function(e){
	    self.ww[me] = upId.parent().height();
	    e.preventDefault();
	    self.dragging = e.pageY;
	    self.actual = me;
	    self.wL = parseInt(upId.css("height").slice(0, -2));
	    self.wR = parseInt(downId.css("height").slice(0, -2));
	    self.maxi = (self.wL+self.wR);
            $(self.holder).mousemove(function(e){
	      if (self.dragging && me == self.actual) {
		var sum = e.pageY-self.dragging;
		var newL = (self.wL+sum > self.maxi*0.02)?((self.wL+sum<self.maxi*0.98)?(self.wL+sum):self.maxi*0.98):self.maxi*0.02;
		upId.css("height",((newL)*100.0/self.ww[me])+"%");
		downId.css("height",((self.maxi-newL)*100.0/self.ww[me])+"%");
	      }
	    });
	  });
	  $(self.holder).mouseup(function(e){
	    if (self.dragging && me == self.actual) {
	      var sum = e.pageY-self.dragging;
	      var newL = (self.wL+sum > self.maxi*0.02)?((self.wL+sum<self.maxi*0.98)?(self.wL+sum):self.maxi*0.98):self.maxi*0.02;
	      upId.css("height",((newL)*100.0/self.ww[me])+"%");
	      downId.css("height",((self.maxi-newL)*100.0/self.ww[me])+"%");
	      $(self.holder).unbind('mousemove');
	      self.dragging = 0;
	    }
	  });
	}
    }

    return ResizeEffect;

})();
