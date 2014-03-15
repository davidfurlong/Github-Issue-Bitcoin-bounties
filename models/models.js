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
  address: {type: Sequelize.STRING, allowNull: false},
  privkey: {type: Sequelize.STRING, allowNull: false},
  confirmedAmount: {type: Sequelize.BIGINT, allowNull: false}
})

Issue.hasMany(Bounty, {as: "Bounties"});

Transactions = sequelize.define('Transactions', {
   amount: Sequelize.INTEGER,
   confirmed: Sequelize.BOOLEAN,
   txid: Sequelize.STRING
})

Bounty.hasOne(Transactions)

sequelize.sync({force: true})

exports.Transactions = Transactions
exports.Issue = Issue
exports.Bounty = Bounty