define([

], function() {
    function Issue(id, name, uri, bounty) {
        this.id = id;
        this.name = name;
        this.uri = uri;
        this.bounty = bounty;
    }
    return Issue;
});
