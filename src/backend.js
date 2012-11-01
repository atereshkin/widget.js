
Backend = Class.extend(
  {
    init : function (origin, urls){
      this.origin = origin;
      this.urls = urls;
      var ths=this;
      function bindEndpoint(name, url){
	ths[name] = function(params, callback){
	  ths.getJsonXd(url, params, callback);
	};
      };

      for (var urlname in urls) {
	bindEndpoint(urlname, urls[urlname]);
      }
    },

    getJsonXd : function(url, params, callback) {
      var callbackName = '__callback' + (Backend._calls++).toString()+'_'+parseInt(Math.random()*1000).toString();
      var callbackWrapper = function(data){
	callback(data);
	window[callbackName] = undefined;
	try{
	  delete window[callbackName];

	}catch(e){}
      };
      window[callbackName] = callbackWrapper;
      var d = new Date();
      params = $.extend({'vuid' : this.vuid,
			 'callback' : callbackName,
			 '_' : d.getTime()},
			params);
      var _call_js = document.createElement('script');
      _call_js.type = 'text/javascript';
      _call_js.async = true;
      _call_js.src = this.origin + url + '?' + jQuery.param(params, true);
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(_call_js, s);
    }
  }
);
Backend._calls = Backend._calls || 0;
