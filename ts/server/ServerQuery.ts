class ServerQuery {
    private constraints: QueryConstraint[] = [];
    
    public addConstraint(argument: string, value: string) {
        var constraint = new QueryConstraint(argument, value);
        this.constraints.push(constraint);
    }
    
    public toString(): string {
        var queryString = "";
        for (var i = 0; i < this.constraints.length; i++) {
            queryString += this.constraints[i].toString(i == 0);
        }
        return queryString;
    }
}

class QueryConstraint {
    constructor(public argument: string, public value: string) {
    }
    
    public toString(isFirst: boolean) : string {
        var op: string;
        if (isFirst)
            op = "?";
        else
            op = "&";
        
        var constraintString = "";
        constraintString += op + this.argument;
        constraintString += "=" + this.value;
        return constraintString;
    }
}