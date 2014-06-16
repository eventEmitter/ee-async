	


	var   type 	= require('ee-types')
		, log 	= require('ee-log');



	var work = function(item, fn, index, next) {
		var arg = item.result.concat(function() {
			item.result = [];

			Array.prototype.slice.call(arguments, 0).every(function(arg, argIndex) {
				if (argIndex === 0) {
					if (type.error(arg)) {
						item.result = arg;
						return false;
					}
				}
				else item.result.push(arg);

				return true;
			});

			next(type.error(item.result));
		});

		fn.apply(undefined, arg);
	};




	var pipeline = function(item, workers, complete) {
		var index = 0;

		var doJob = function() {
			work(item, workers[index], index, function(isError) {
				index++;

				if (index < workers.length && !isError) doJob();
				else complete(isError ? 0 : item.result.length, isError);
			} );
		}	

		doJob();	
	}



	module.exports = function(){
		var   items = []
			, workers = []
			, finished = 0
			, maxLen = 0
			, errCount = 0
			, complete
			, callback;

		// filter callback and input from worker functions
		Array.prototype.slice.call(arguments, 0).forEach(function(arg, index, arr){
			if (index === 0){
				//if (!type.array(arg)) throw new Error('Argument 0 must be typeof «array»! got «'+type( arg )+'»').setName('InvalidArgumentException');
				items = arg.map(function(item){
					return { 
						  index: index
						, result: [item]  //type.array(item) ? item: [item] 
					}; 
				});
			}
			else if (index === arr.length - 1) {
				if (!type.function(arg)) throw new Error('Last argument must be typeof «function»! got «'+type( arg )+'»').setName('InvalidArgumentException');
				callback = arg;
			}
			else {
				if (!type.function(arg)) throw new Error('workers must be typeof «function»! got «'+type( arg )+'»').setName('InvalidArgumentException');
				workers.push(arg);
			}
		});


		if (!items.length) return callback(null, []);


		complete = function(argLen, hasError) {
			var i = 0
				, err;

			if (argLen > maxLen) maxLen = argLen;
			if (hasError) errCount++;

			if (++finished === items.length) {

				items.sort(function(a, b) {
					return a.index > b.index ? 1 : -1 
				});

				items = items.map(function(item) {
					if (maxLen <= 1) return type.array(item.result) ? item.result[0] : item.result;
					else return item.result;
				} );
				

				if (errCount) {
					items.some(function(arg){
						if (arg instanceof Error) {
							err = arg;
							return true;
						}
					});
					
					if (err) callback(err);
					else callback(new Error('There were '+errCount+' error(s) while processing your data!').setName('ProcessingError'), items);
				} 
				else callback(undefined, items);
			}
		};

		
		items.forEach(function(item, idx) {
			pipeline(item, workers, complete);
		});
	}