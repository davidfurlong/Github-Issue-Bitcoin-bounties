define([

], function() {
    function Bounty(id, expires, amount, email) {
        this.id = id;
        this.expires = expires;
        this.amount = amount;
        this.email = email;
    }

    return Bounty;
});
