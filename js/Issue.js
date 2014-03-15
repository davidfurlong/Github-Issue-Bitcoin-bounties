define([

], function() {
    function Issue(id, name, uri, language, bounty) {
        this.id = id;
        this.name = name;
        this.uri = uri;
        this.language = language;
        this.bounty = bounty;
    }
    return Issue;
});
