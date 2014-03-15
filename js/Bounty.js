define(["require", "exports"], function(require, exports) {
    var Bounty = (function () {
        function Bounty(id, expires, amount, email) {
            this.id = id;
            this.expires = expires;
            this.amount = amount;
            this.email = email;
        }
        return Bounty;
    })();
    exports.Bounty = Bounty;
});
