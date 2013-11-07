	


	var   type 	= require( "ee-types" )
		, log 	= require( "ee-log" );



	var work = function( item, fn, index, next ){
		var arg = item.result.concat( function(){
			item.result = [];
			Array.prototype.slice.call( arguments, 0 ).forEach( function( arg ){
				if ( type.error( arg ) ) item.err = arg, item.errorIndex = index;
				else if ( !type.undefined( arg ) && !type.null( arg ) ) item.result.push( arg );
			} );

			next();
		} );

		fn.apply( undefined, arg );
	};




	var pipeline = function( item, workers, complete ){
		var index = 0;

		var doJob = function(){
			work( item, workers[ index ], index, function(){
				index++;
				if ( index < workers.length && !item.err ) doJob();
				else complete();
			} );
		}	

		doJob();	
	}



	module.exports = function(){
		var items = [], workers = [], callback;

		Array.prototype.slice.call( arguments, 0 ).forEach( function( arg, index, arr ){
			if ( index === 0 ){
				if ( !type.array( arg ) ) throw new Error( "Argument 0 must be typeof «array»! got «"+type( arg )+"»" ).setName( "InvalidArgumentException" );
				items = arg.map( function( item ){ return { input: item, result: type.array( item ) ? item: [ item ] }; } );
			}
			else if ( index === arr.length - 1 ){
				if ( !type.function( arg ) ) throw new Error( "Last argument must be typeof «function»! got «"+type( arg )+"»" ).setName( "InvalidArgumentException" );
				callback = arg;
			}
			else {
				if ( !type.function( arg ) ) throw new Error( "workers must be typeof «function»! got «"+type( arg )+"»" ).setName( "InvalidArgumentException" );
				workers.push( arg );
			}
		} );


		var finished = 0, complete = function(){
			if ( ++finished === items.length ){
				var errCount = false;
				items.forEach( function( item ){
					if ( item.err ) errCount++;
				} );

				if ( errCount ) callback( new Error( "There were "+errCount+" errors while processing your data!" ).setName( "ProcessingError" ), items );
				else callback( undefined, items );
			}
		};

		
		items.forEach( function( item, idx ){
			pipeline( item, workers, complete );
		} );
	}