!function(){
    module.exports = function(join, reduce){
        var context = {
              expected  : 0
            , errors    : []
            , results   : []
            , reduce    : reduce === true
            , addResult: function(error, result){
                this.errors.push(error);
                this.results.push(result);
            }
            , invokeCallback: function(){
                if(--this.expected === 0){

                    var   errors  = this.errors
                        , results = this.results;

                    if(this.reduce){
                        var results = this.results;
                        errors = this.errors.reduce(function(prev, err, index){
                            if(err){
                                prev.push({
                                      error: err
                                    , result: results[index]
                                });
                            }
                            return prev;
                        }.bind(this), []);
                        results = null;
                    }
                    join(errors, results);
                }
            }
        };

        var callback = function (){
            context.expected++;
            return function(err, result){
                context.addResult(err, result);
                process.nextTick(context.invokeCallback.bind(context));
            }
        };
        // for introspection purposes
        callback._context = context;
        return callback;
    };
}();
