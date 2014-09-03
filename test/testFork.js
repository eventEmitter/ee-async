var   assert    = require('assert')
    , types     = require('ee-types')
    , log       = require('ee-log');

var async = require('..');

function asyncFunction(delay, err, result, callback){
    setTimeout(function(){
        callback(err, result);
    }, delay);
}

function syncFunction(err, result, callback){
    callback(err, result);
}

describe('Fork', function(){
    describe('setup', function(){
        var fork = async.fork(function(errors, results){});
        it('should return a function on invocation', function(){
            assert(types.function(fork));
        });
        it('which exposes its context for introspection', function(){
            assert(fork._context);
        });
        it('the context is empty on setup', function(){
            assert.equal(0, fork._context.expected);
            assert.equal(0, fork._context.errors.length);
            assert.equal(0, fork._context.results.length);
        });
    });
    describe('execution', function(){
        var err = new Error('Uh oh');
        it('should invoke the join callback at the end', function(done){
            var fork = async.fork(function(errors, results){
                done();
            });

            asyncFunction(5, null, 100, fork());
            asyncFunction(10, null, true, fork());
            asyncFunction(8, err, null, fork());
        });

        it('should pass an equal amount of errors and data to the callback', function(done){
            var fork = async.fork(function(errors, results){
                assert.equal(errors.length, results.length);
                assert.equal(3, results.length);
                done();
            });

            asyncFunction(5, null, 100, fork());
            asyncFunction(10, null, true, fork());
            asyncFunction(8, err, null, fork());
        });

        it('containing adequate data', function(done){
            var fork = async.fork(function(errors, results){
                assert(errors[1] === err);
                assert.equal(100, results[0]);
                assert.equal(null, results[1]);
                done();
            });

            asyncFunction(5, null, 100, fork());
            asyncFunction(10, null, true, fork());
            asyncFunction(8, err, null, fork());
        });

        it('should fulfill the same constraints for synchronous functions (ordering changes)', function(done){
            var fork = async.fork(function(errors, results){

                assert(errors[2] === err);
                assert.equal(100, results[0]);
                assert.equal(true, results[1]);
                assert.equal(errors.length, results.length);
                assert.equal(3, results.length);

                done();
            });

            syncFunction(null, 100, fork());
            syncFunction(null, true, fork());
            syncFunction(err, null, fork());
        });

        it('should fulfill the same constraints for mixed type functions (ordering changes)', function(done){
            var fork = async.fork(function(errors, results){

                assert(errors[1] === err);
                assert.equal(true, results[2]);
                assert.equal(errors.length, results.length);
                assert.equal(3, results.length);

                done();
            });


            asyncFunction(10, null, true, fork());
            asyncFunction(5, err, null, fork());
            syncFunction(null, 100, fork());
        });

        describe('with reduce set to true', function(){
            var err2 = new Error('second');
            it('should reduce to error occurrences', function(done){
                var fork = async.fork(function(results, remainder){

                    assert(remainder === null);
                    assert.equal(2, results.length);

                    assert.strictEqual(results[0].error, err);
                    assert.strictEqual(results[1].error, err2);

                    assert.equal(results[1].result, true);
                    done();
                }, true);


                asyncFunction(10, err2, true, fork());
                asyncFunction(5, err, null, fork());
                syncFunction(null, 100, fork());
            })
        });
    });
});