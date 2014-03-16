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
  strid: {type: Sequelize.STRING, unique: true},
  user: {type: Sequelize.STRING, allowNull: false},
  repo: {type: Sequelize.STRING, allowNull: false},
  issueName: {type: Sequelize.STRING, allowNull: false},
  language: {type: Sequelize.STRING, allowNull: false, defaultValue: "Unknown"},
  uri: Sequelize.STRING,
  amount: {type: Sequelize.BIGINT, allowNull: false},
  confirmedAmount: {type: Sequelize.BIGINT, allowNull: false},
<<<<<<< HEAD
  payoutToken: Sequelize.STRING
=======
  // expiresAt: {type: Sequelize.DATE, allowNull: false},
>>>>>>> c6dd8c1abdfa9eafbef37621654bfe470725e0f2
})

Bounty = sequelize.define('Bounty', {
    // Issue ID many to one.
  expiresAt: {type: Sequelize.DATE, allowNull: false},
  amount: {type: Sequelize.BIGINT, allowNull: false}, // mBTC
  email: {type: Sequelize.STRING, validate: {isEmail:true}, allowNull: false},
  address: {type: Sequelize.STRING, allowNull: false, unique: true},
  privkey: {type: Sequelize.STRING, allowNull: false},
  confirmedAmount: {type: Sequelize.BIGINT, allowNull: false},
})

Issue.hasMany(Bounty, {as: "Bounties"});

Transactions = sequelize.define('Transactions', {
   amount: Sequelize.INTEGER,
   confirmed: Sequelize.BOOLEAN,
   txid: {type: Sequelize.STRING, allowNull: false},
   txbtid: {type: Sequelize.STRING, allowNull: false, unique: true}
})

Bounty.hasOne(Transactions)

sequelize.sync()

exports.Transactions = Transactions
exports.Issue = Issue
exports.Bounty = Bounty