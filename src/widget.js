(function(){

   Widget = Class.extend(
     {
       init : function(parent,
		       styles,
		       templates,
		       options){
	 this.parent = parent;
	 this.styles = styles;
	 this.options = options;
	 this.templates = templates;
	 this.panels = {};
	 this.backend = new Backend(options.origin,
				    options.endpoints);
	 this.visible = false;
	 this._eventListeners = {};
       },


       // Load required scripts and apply styles
       bootstrap : function(){

	 var _css = this._make('style',
			       {
				 'type' : 'text/css',
				 'textContent' : this.styles
			       });
	 if (_css.styleSheet) _css.styleSheet.cssText = this.styles;
	 document.getElementsByTagName('head')[0].insertBefore(_css, null);
	 //this.setVuid(this.options.vuid);
	 this.backend.vuid = this.getVuid();

	 this._processQueue();

	 this.trigger('preInit', {});

	 $(this.prepare.bound);
	 this.trigger('postInit', {});

       },

       _processQueue : function (){
	 if (!!window[this._queueName]){
	   var q = window[this._queueName];
	   while (1){
	     if(!('pop' in q))break;
	     var fn = q.pop();
	     if (!!fn){
	       this[fn[0]].apply(this, fn.splice(1, fn.length - 1));
	     } else break;
	   }
	 }
	 var ths=this;
	 window[this._queueName] =
	   {push : function(command){
	      ths[command[0]].apply(ths, [].splice.call(command,1));
	    }};
       },

       //Override this for initialization
       prepare : function(){
       },


       //Render a template by name
       render : function(template, context){
	 return tmpl(this.templates[template], context);
       },


       //Set new session id
       setVuid : function (vuid){
	 if (typeof localStorage != "undefined")
	   localStorage[this._prefix + '_vuid']=vuid;
	 else
	   this._cookie(this._prefix + '_vuid', vuid, {'expires':365});
	 this.backend.vuid = vuid;
       },

       //Get session id
       getVuid : function (){
	 var res = '';
	 if (typeof localStorage != "undefined")
	   res = localStorage[this._prefix + '_vuid'];
	 else
	   res = this._cookie(this._prefix + '_vuid');
	 if (typeof res == "undefined" || res == null || res == "undefined")
	   res = '';
	 return res;
       },

       setLocalData : function(key,value){
	 if (typeof localStorage != "undefined")
	   localStorage[this._prefix + key]=value;
	 else
	   this._cookie(this._prefix + key, value, {'expires':365});
       },

       getLocalData : function(key){
	 var res = '';
	 if (typeof localStorage != "undefined")
	   res = localStorage[this._prefix + key];
	 else
	   res = this._cookie(this._prefix + key);
	 return res;
       },

       //Bind a handler to an event
       bind : function(event, handler){
	 if (!!!this._eventListeners[event]){
	   this._eventListeners[event] = [];
	 }
	 this._eventListeners[event][this._eventListeners[event].length] = handler;
       },

       //Trigger an event
       trigger : function(event, data){
	 if (!!this._eventListeners[event]){
	   for (var i=0, l=this._eventListeners[event].length; i < l; i++ ){
	     this._eventListeners[event][i](data);
	   }
	 }
       },

       //set all obj2 properties on obj1
       _extend : function(obj1, obj2){
	 for (var i in obj2){
	   obj1[i] = obj2[i];
	 }
       },

       //create a DOM element with properties props
       _make : function(elname, props){
	 var el = document.createElement(elname);
	 this._extend(el, props);
	 return el;
       },

       //Set or get a cookie
       _cookie : function (key, value, options) {
	 // key and value given, set cookie...
	 if (arguments.length > 1 && (value === null || typeof value !== "object")) {
           var options = options || {};

           if (value === null) {
             options.expires = -1;
           }

           if (typeof options.expires === 'number') {
             var days = options.expires, t = options.expires = new Date();
             t.setDate(t.getDate() + days);
           }

           return (document.cookie = [
		     encodeURIComponent(key), '=',
		     options.raw ? String(value) : encodeURIComponent(String(value)),
		     options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
		     options.path ? '; path=' + options.path : '',
		     options.domain ? '; domain=' + options.domain : '',
		     options.secure ? '; secure' : ''
		   ].join(''));
	 }

	 // key and possibly options given, get cookie...
	 options = value || {};
	 var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
	 return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
       }

     });

 })();


