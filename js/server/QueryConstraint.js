define([
    
], function() {
    function QueryConstraint(argument, value) {
        this.argument = argument;
        this.value = value;
    }
    QueryConstraint.prototype.toString = function (isFirst) {
        var op;
        if (isFirst)
            op = "?";
        else
            op = "&";

        var constraintString = "";
        constraintString += op + this.argument;
        constraintString += "=" + this.value;
        return constraintString;
    };
    return QueryConstraint;
});