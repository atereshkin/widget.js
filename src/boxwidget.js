BoxWidget = Widget.extend(
  {
    //Render initial UI state
    prepare : function(){
      this.createContainer();
    },

    //create the container element
    createContainer : function(){
      this.$container = $(this.render('widgetbase', {'prefix':this._prefix,'popup':this.options.popup}));
      var parent;
      if (this.options.popup) { //(this.options.popup) {
	parent = $('<div id="'+this._prefix + '-wrapper"></div>').prependTo('body').hide();
	this.$wrapper = parent;
	this.$glassPane = $('<div id="'+this._prefix+'-mask"></div>').hide().appendTo('body');
	$(parent).append(this.$container);
      } else {
	this.$wrapper = $();
   	$('#'+this._prefix+'-script').after(this.$container);
      }
      this.paneIndex = 0;
      this.$viewPort=this.$container.find('#'+this._prefix+'-viewport');
      this.$panelStripe=this.$container.find('.'+this._prefix+'-panelstripe');
      var ths = this;
      this.$container.find('.'+this._prefix + '-close').click(
	function(){
	  ths.hide();
	}
      );
    },
    //Add html fragment as a new panel
    addPanel : function(name, html) {
      this.panels[name] =  $(html).appendTo(this.$panelStripe).wrapAll('<div class="'+this._prefix+'-pane '+this._prefix+'-pane-' + name + '"/>').parent();
      return this.panels[name];
    },

    //Show the widget
    show : function() {
      this.visible = true;
      this.$container.show();
      this.$wrapper.show();
      if(typeof this.$glassPane != "undefined")
	this.$glassPane.show();

      this.trigger('show', {});
    },

    //Hide the widget
    hide : function() {
      this.visible = false;
      this.$container.hide();
      this.$wrapper.hide();
      if(typeof this.$glassPane != "undefined")
	this.$glassPane.hide();
      this.trigger('hide', {});
    },

    //"Scroll" panes by *offset* (use negative number to scroll left)
    scrollBy : function(offset) {
      this.scrollTo(this.paneIndex + offset);
    },

    adjustHeight : function(){
      var curHeight = this.$viewPort.height();
      var newHeight = $(this.$panelStripe.children()[this.paneIndex]).outerHeight();
      this.$viewPort.css({'height' : newHeight + 'px'});
    },

    //Scroll panes to the index *position*
    scrollTo : function(position) {
      var curHeight = this.$viewPort.height();
      var newHeight = $(this.$panelStripe.children()[position]).outerHeight();
      if (newHeight > curHeight){
	this.$viewPort.css({'height' : newHeight + 'px'});
      }
      this.paneIndex = position;
      var ths = this;
      var viewportWidth = this.$viewPort.width();
      this.$panelStripe.animate({'left' : '-' + position * viewportWidth + 'px'},
				function (){
				  if (newHeight < curHeight){
				    ths.$viewPort.css({'height' : newHeight + 'px'});
				  }
				});
    }


  });