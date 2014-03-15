var Sequelize = require("sequelize")

var pgdb = process.env.DATABASE_URL

console.log(pgdb)

sequelize = new Sequelize(
    process.env.DATABASE_URL, 
    {
      dialect: 'postgres',
    })


Issue = sequelize.define('Issue', {
  id: {type: Sequelize.STRING, primaryKey: true},
  uri: Sequelize.STRING
})

Bounty = sequelize.define('Bounty', {
    // Issue ID many to one.
  expiresAt: Sequelize.DATE,
  amount: Sequelize.INTEGER, // mBTC
  email: Sequelize.STRING,
})

Issue.hasMany(Bounty, {as: "Bounties"});

Address = sequelize.define('Address', {
  address: Sequelize.STRING,
  privkey: Sequelize.STRING,
  confirmedAmount: Sequelize.INTEGER,
  unconfirmedAmount: Sequelize.INTEGER
})

Transactions = sequelize.define('Transactions', {
   amount: Sequelize.INTEGER,
   confirmed: Sequelize.BOOLEAN,
   txid: Sequelize.STRING
})

Transactions.hasOne(Address, {as: "Address"})
Address.hasOne(Bounty, {as: "Bounty"})

sequelize.sync()

exports.Address = Address
exports.Transactions = Transactions
exports.Issue = Issue
exports.Bounty = Bounty