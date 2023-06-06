const {Seqyelize} = require ('sequelize')

module.exports = new Seqyelize(
    process.env.DB_NAME,
    process.env.DB_UER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)