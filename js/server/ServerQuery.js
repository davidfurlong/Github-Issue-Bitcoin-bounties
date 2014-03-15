var ServerQuery = (function () {
    function ServerQuery() {
        this.constraints = [];
    }
    ServerQuery.prototype.addConstraint = function (argument, value) {
        var constraint = new QueryConstraint(argument, value);
        this.constraints.push(constraint);
    };

    ServerQuery.prototype.toString = function () {
        var queryString = "";
        for (var i = 0; i < this.constraints.length; i++) {
            queryString += this.constraints[i].toString(i == 0);
        }
        return queryString;
    };
    return ServerQuery;
})();

var QueryConstraint = (function () {
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
})();
