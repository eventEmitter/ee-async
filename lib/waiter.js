!function(){

	module.exports = function(callback){
		var instance = function() {
			instance.expected++;
			return function(err) {
				if (!instance.err) instance.err = err;
				
				process.nextTick(function(){
					if (++instance.executed === instance.expected) instance.callback(instance.err);
				});
			};
		};

		instance.expected = 0;
		instance.executed = 0;
		instance.callback = callback;

		return instance;
	}
}();
