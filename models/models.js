var Sequelize = require("sequelize")

var pgdb = process.env.DATABASE_URL

console.log(pgdb)

sequelize = new Sequelize(
    process.env.DATABASE_URL, 
    {
      dialect: 'postgres',
    })


// Cache aggregate bounty. Latest expirary. 

Issue = sequelize.define('Issue', {
  id: {type: Sequelize.STRING, primaryKey: true},
  user: {type: Sequelize.STRING, allowNull: false},
  repo: {type: Sequelize.STRING, allowNull: false},
  issueName: {type: Sequelize.STRING, allowNull: false},
  language: {type: Sequelize.STRING, allowNull: false, defaultValue: "Unknown"},
  uri: Sequelize.STRING
})

Bounty = sequelize.define('Bounty', {
    // Issue ID many to one.
  expiresAt: {type: Sequelize.DATE, allowNull: false},
  amount: {type: Sequelize.BIGINT, allowNull: false}, // mBTC
  email: {type: Sequelize.STRING, allowNull: false},
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

sequelize.sync({force: true})

exports.Address = Address
exports.Transactions = Transactions
exports.Issue = Issue
exports.Bounty = Bounty