const {Sequelize} = require('sequelize');
<<<<<<< HEAD

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: './cartola_database.sqlite',
=======
const path = require('path');

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: path.join(process.cwd(), 'cartola_database.sqlite'),
>>>>>>> b132c3f (Sbindo atualizações completas Kings league)
    logging: false
})
module.exports = sequelize;