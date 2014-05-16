!function(){

	module.exports = function(callback){
		this.expected = 0;
		this.executed = 0;
		this.callback = callback;

		return function(){
			this.expected++;
			return function(err) {
				if (!this.err) this.err = err;
				
				process.nextTick(function(){
					if (++this.executed === this.expected) this.callback(this.err);
				}.bind(this));
			}.bind(this);
		}.bind(this);
	}
}();
