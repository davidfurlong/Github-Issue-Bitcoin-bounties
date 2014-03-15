define([
    "server/QueryConstraint"
], function(QueryConstraint) {
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
});