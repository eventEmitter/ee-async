# ee-async

simple control flow helpers

## installation

	npm install ee-async

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-async.png?branch=master)](https://travis-ci.org/eventEmitter/ee-async)


## usage

	var async = require( "ee-async" );

### each

execute a function on every item passed to the function using an array

	async.each( [ items ], worker, [ worker ], [ .. ], callback );

the array of items can also be an array of array if the workers need more than one argument applied to them	

	async.each( [ "1.txt", "2.txt" ]
		, fs.readFile
		, function( data, next ){ 
			next( null, data.toString() ); 
		}
		, function( err, results ){
			log( results ); // [ "contents of 1.txt", "contents of 2.txt" ]
		} 
	);

### wait

execute functions in parallel

	async.wait( function( complete ){ 
			complete( 1 ); 
		}, function( complete ){ 
			complete( 2 ); 
		}, function( err, results ){
			log( results ); // [ 1, 2 ]
		} 
	);


## chain

pass input through a chain of functions
	

	async.chain("./test/1.txt"
		, fs.readFile
		, function( data, next ){ 
			next( null, data.toString() ); 
		}
		, function( err, data ){
			log( data ); // "contents of 1.txt"
		} 
	);


wait for several callbacks


	var waiter = async.waiter(function(err) {
		// both load events were fired
	});

	someAsyncApi.on('load', waiter());
	anotherApi.on('load', waiter());
