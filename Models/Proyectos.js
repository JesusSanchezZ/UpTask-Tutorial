const Sequelize = require('sequelize');
const db = require('../config/db');
const Usuarios = require('../Models/Ususarios');

const slug = require('slug');          // elimina espacios en blanco y agrega guiones medios
const shortid = require('shortid');    // agrega texto aleatoria a una cadena


const Proyectos = db.define('proyectos',{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: Sequelize.STRING,
	url : Sequelize.STRING
}, {
	hooks: {                          // hooks ejecutan una funcion en determinado tiempo
		beforeCreate(proyecto){       // antes de crear ejecuta lo siguiente
			const url = slug(proyecto.nombre).toLowerCase();
			proyecto.url = `${url}-${shortid.generate()}`;
			//console.log(proyecto.url);
		}
	}
});

// Relación uno a muchos, 1 Usuario a Muchos Proyectos
Usuarios.hasMany(Proyectos);
Proyectos.belongsTo(Usuarios);

module.exports = Proyectos;
