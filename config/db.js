const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env'})
/*const userName = 'root';
const password = 'Mca@66940$2022';
const hostName = '172.17.6.102';
const sampleDBName = 'proyectosNode';
*/

// Creación de la conexión a la BD
const sequelize = new Sequelize(
	process.env.BD_NOMBRE,
	process.env.BD_USER,
	process.env.BD_PASS,
	{
	host: process.env.BD_HOST,
	dialect: 'mysql',
	port: process.env.BD_PORT,
	operatorsAliases: false,
	define: {
		timestamps: false
	},
	pool:{
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

module.exports = sequelize;
