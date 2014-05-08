
	
	var   type 	= require('ee-types')
		, log 	= require('ee-log');

	


	module.exports = function() {
		var   jobs = []
			, resLen = 0
			, results = []
			, finished = 0
			, errCount = 0
			, complete 
			, callback;

		Array.prototype.slice.call(arguments, 0).forEach(function(arg, index, arr) {
			if (!type.function(arg)) throw new Error('Expected type «function», got «'+type(arg)+'»!').setName('InvalidArgumentException');
			if (index === arr.length -1) callback = arg;
			else jobs.push(arg);
		});


		if (!jobs.length) return callback(null, []);


		complete = function(index, args) {
			var i, a, err;

			finished++;

			if (args.length > 0) {
				a = args[0];

				if (type.undefined(a) || type.null(a)) args.shift();
				else if (type.error(a)) errCount++, args = args[0];

				if (args.length > resLen) resLen = args.length;

				results[index] = args;
			}


			if (finished === jobs.length) {
				if (resLen <= 1) {
					results = results.map(function(r) {
						return type.array(r) ? r[0] : r;
					});
				}

				if (errCount) {
					results.some(function(arg){
						if (arg instanceof Error) {
							err = arg;
							return true;
						}
					});
					
					if (err) callback(err);
					else callback(new Error('There were '+errCount+' errors while processing your data!').setName('ProcessingError'), results);
				} 
				else callback(undefined, results);
			}
		}


		jobs.forEach(function(job, index) {
			job(function() {
				complete(index, Array.prototype.slice.call(arguments, 0));
			});
		});
	}