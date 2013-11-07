


	var   log 			= require( "ee-log" )
		, assert 		= require( "assert" )
		, fs 			= require( "fs" );

	var srt =function(a, b ){ return a.input > b.input ? 1 : -1; };


	var expected = {
		each: JSON.parse( '[{"input":"./test/1.txt","result":["1",1]},{"input":"./test/2.txt","result":["2",1]}]' ).sort( srt )
	};


	var async 		= require( "./" );


	async.each( [ "./test/1.txt", "./test/2.txt" ]
		, fs.readFile
		, function( data, next ){ next( data.toString(), data.length ); }
		, function( err, results ){
			assert.ifError(err);
			assert.deepEqual( results.sort( srt ), expected.each, "async.each failed, variying output!" );
		} 
	);