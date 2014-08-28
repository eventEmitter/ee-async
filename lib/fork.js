!function(){
    module.exports = function(join){
        var context = {
              expected: 0
            , errors: []
            , results: []
            , addResult: function(error, result){
                this.errors.push(error);
                this.results.push(result);
            }
            , invokeCallback: function(){
                if(--this.expected === 0) join(this.errors, this.results);
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
