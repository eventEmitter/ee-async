	


	var type 	= require( "ee-types" );


	module.exports = function(){
		var items = [], workers = [], callback;

		Array.prototype.slice.call( arguments, 0 ).forEach( function( arg, arr, index ){
			if ( index === 0 ){
				if ( !type.array( arg ) ) throw new Error( "Argument 0 must be typeof «array»!" ).setName( "InvalidArgumentException" );
				items = arg.map( function( item ){ return { input: item }; } );
			}
			else if ( index === arr.length - 1 ){
				if ( !type.array( arg ) ) throw new Error( "Last argument must be typeof «function»!" ).setName( "InvalidArgumentException" );
				callback = arg;
			}
			else {
				if ( !type.array( arg ) ) throw new Error( "workers must be typeof «function»!" ).setName( "InvalidArgumentException" );
				workers.push( arg );
			}
		} );

		
		items.forEach( function( item ){} );
	}

