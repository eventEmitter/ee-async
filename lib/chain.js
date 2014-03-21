	


	var   each 	= require('./each')
		, log 	= require('ee-log')
		, type 	= require('ee-types');


	module.exports = function() {
		var args = [[]], callback;

		Array.prototype.slice.call(arguments, 0).forEach(function(arg, index, arr) {
			if (index === arr.length - 1) {
				if (!type.function(arg)) throw new Error('Last argument must be typeof «function»!').setName('InvalidArgumentException');
				callback = arg;
			}
			else {
				if (type.function(arg)) args.push(arg);
				else args[0].push(arg);
			}
		});	


		args.push(function(err, results) {
			callback(err, results[0]);
		});



		each.apply(undefined, args);
	};