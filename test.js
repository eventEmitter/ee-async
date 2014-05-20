


	var   log 			= require( "ee-log" )
		, assert 		= require( "assert" )
		, fs 			= require( "fs" );

	

	var expected = {
		  each: JSON.parse( '[["1",1],["2",1]]' )
		, wait: JSON.parse( '[100,200,300]' )
	};


	var async 		= require( "./" );



	async.each( [ "./test/1.txt", "./test/2.txt" ]
		, fs.readFile
		, function( data, next ){ 
			next( null, data.toString(), data.length ); 
		}
		, function( err, results ){
			assert.ifError(err);
			assert.deepEqual( results, expected.each, "async.each failed, variying output!" );
		} 
	);





	var offset = 0, doDelay = function( complete ){
		var delay = ++offset * 100;
		setTimeout( function(){
			complete( null, delay );
		}, delay );
	}

	async.wait( doDelay, doDelay, doDelay, function( err, results ){
		assert.ifError(err);
		assert.deepEqual( results, expected.wait, "async.wait failed, variying output!" );
	} );





	async.chain("./test/1.txt"
		, fs.readFile
		, function( data, next ){ 
			next( null, data.toString() ); 
		}
		, function( err, results ){
			assert.ifError(err);
			assert.deepEqual( results, "1", "async.chain failed, variying output!" );
		} 
	);


	var waiter = new async.waiter(function(){
		log(1);
	});

	waiter()();
	waiter()();
