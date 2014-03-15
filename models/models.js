var Sequelize = require("sequelize")
sequelize = new Sequelize(
    process.env.DATABASE_URL, 
    process.env.PGUSER, 
    process.env.PGPASSWORD, 
    {
      dialect: 'postgres',
    })

Issue = sequelize.define('Issue', {
  name: Sequelize.STRING,
  uri: Sequelize.STRING
})

Bounty = sequelize.define('Bounty', {
    // Issue ID many to one.
  expires: Sequelize.DATE,
  amount: Sequelize.INTEGER, // mBTC
  email: Sequelize.STRING,
})

Issue.hasMany(Bounty, {})

exports.Issue = Issue
exports.Bounty = Bounty