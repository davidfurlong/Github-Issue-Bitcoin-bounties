define([

], function() {
    function Bounty(id, issueId, createdAt, updatedAt, expiresAt, amount, email, isPaid) {
        this.id = id;
        this.issueId = issueId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.expiresAt = expiresAt;
        this.amount = amount;
        this.email = email;
        this.isPaid = isPaid;
    }

    return Bounty;
});
