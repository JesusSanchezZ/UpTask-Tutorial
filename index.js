// creacion de proyecto: npm init
// instalacion de paquetes: npm install --save express /despliegue
// instalacion de paquetes lado desarrollo: npm install --save-dev nodemon
// para instalar las dependencias desde el archivo package.json ejecutamos: npm install
// instalamos dependencia del proyecto para el motor de plantillas: npm install --save pug
// creacion de pagina maestra... layout

// paquete para conexion a bd mongodb: npm install --save mongoose
// paquetes para MySql: npm install --save mysql2 sequelize
// Seccion 11-33
// instalación del paquete babel-loader para la eliminación de los proyectos
// npm install -D babel-loader @babel/core @babel/preset-env webpack
// también se instala el paquete concurrently
// npm install --save concurrently
// instalacion de paquetes para confirmar borrado de archivos
// npm install --save axios sweetalert2

// Instalamos libreria para hasheo de claves
// npm install --save bcrypt-nodejs

// Instalamos libreria para pasar mensajes a las vistas
// npm install --save connect-flash

// Instalamos paqueteria para poder visualizar los errores mandados por flash
// npm install --save cookie-parser express-session

// Instalamos passport para controlar el inicio de sesion de los usuarios
// npm install --save passport
// npm i --save passport-local

// creación de formulario para reestablecer el password

// Instalación de paquetes para mandar email
// npm i --save nodemailer juice html-to-text

// Creando variables de entorno para la base de datos
// Paquetería para leer varibles de entorno
// npm i --save dotenv

//import express from 'express';
const express = require('express');
const routes = require('./routes');
const path = require('path');         // importamos paquete de rutas del entorno
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Importamos las variables
require('dotenv').config({ path: 'variables.env'});

// helpers con algunas funciones
const helpers = require('./helpers');

// creamos la conexion a la BD
const db = require('./config/db');

// Importamos el modelo
require('./models/proyectos');
require('./Models/Tareas');
require('./Models/Ususarios');

// Con este metodo solo se conecta a la BD
//db.authenticate()
//	.then(() => console.log('Conectado al servidor'))
//	.catch(error => console.log(error));

// con este mètodo  modifica la BD, crea estructura de la BD
db.sync()
	.then(() => console.log('Conectado al servidor'))
	.catch(error => console.log(error));

/*db.authenticate()
	.then(() => console.log('Conectado al Servidor'))
	.catch(error => console.log(error));*/

// Creacion de app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// Agregamos express validator a toda la aplicación
//app.use(expressValidator());

// habilitamos pug
app.set('view engine', 'pug');

// añadimos carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregamos flash messages
app.use(flash());

// sesiones nos permite navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
	secret: 'supersecreto',
	resave: false,
	saveUninitialized: false
}));

// Autenticación de los usuarios, para acceder a las páginas apropiadas
app.use(passport.initialize());
app.use(passport.session());

// pasar var dump a la aplicación
app.use((req, res, next) => {
	res.locals.vardump = helpers.vardump;         // creación de variable localName
	res.locals.mensajes = req.flash();            // Variable local para almacenar mensajes
	res.locals.usuario = {...req.user} || null;   // Información del usuario logueado, en caso de no estar autenticado manda null
	next();
});

// Aprendiendo Middleware

// al ejecutar una consulta y no tener resultado con next() pasas a otro proceso
/*app.use((req, res, next)=> {
	console.log('Yo soy middleware');
	next();
});*/

// agregamos las rutas
app.use('/', routes());

//app.listen(3000);
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
	console.log('El servidor está funcionando');
})

// engine template https://github.com/expressjs/express/wiki#templates-engines

//require('./handlers/email');  para probar nodemailer

/**
 * Almacenar el proyecto en git desde línea de comandos
 * git init
 * git add .
 * git commit -m "primer commit"
 * git remote add origin "repo"
 * git push -u origin master
 */
