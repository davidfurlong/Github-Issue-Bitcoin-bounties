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

sequelize.sync()

exports.Issue = Issue
exports.Bounty = Bounty