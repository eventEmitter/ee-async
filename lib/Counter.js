!function(){

	var Class = require('ee-class');


	module.exports = new Class({
		init: function(callback) {
			this.expected = 0;
			this.executed = 0;
			this.callback = callback;
		}

		, count: function(){
			this.expected++;
			return this._count.bind(this);
		}

		, _count: function() {
			process.nextTick(function(){
				if (++this.executed === this.expected) this.callback();
			}.bind(this));
		}
	});
}();
