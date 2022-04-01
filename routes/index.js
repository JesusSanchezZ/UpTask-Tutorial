// Usamos modulo exprees
const express = require('express');
// de express usamos router
const router = express.Router();

// Paquete para la validación de datos
// Importamos express validator
const { body } = require('express-validator');

// importamos el controlador
const proyectosController = require('../controllers/proyectoController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
	//Ruta para el home
	router.get('/',
		authController.usuarioAutenticado,	             // checa que el usuario este autenticado, en caso contrario redirecciona a iniciar-sesion
		proyectosController.proyectosHome);
	router.get('/nuevo-proyecto',
		authController.usuarioAutenticado,
		proyectosController.formularioProyecto);
	// Llamada desde formulario por metodo post
	router.post('/nuevo-proyecto',
		authController.usuarioAutenticado,
		body('nombre').not().isEmpty().trim().escape(), // validadmos que no este vacio, trim elimina espacios en blanco al inicio y al final. escape pone formato a los simbolos <>
		proyectosController.nuevoProyecto); 
	
	//router.get('/nosotros', proyectosController.nosotros);
	// Listar proyecto
	router.get('/proyectos/:url',
		authController.usuarioAutenticado,
		proyectosController.proyectoPorUrl);

	// Actualizar el proyecto
	router.get('/proyecto/editar/:id',
		authController.usuarioAutenticado,
		proyectosController.formularioEditar);
	router.post('/nuevo-proyecto/:id',
		authController.usuarioAutenticado,
		body('nombre').not().isEmpty().trim().escape(), // validadmos que no este vacio, trim elimina espacios en blanco al inicio y al final. escape pone formato a los simbolos <>
		proyectosController.actualizarProyecto); 

	// eliminar proyecto
	router.delete('/proyectos/:url',
		authController.usuarioAutenticado,
		proyectosController.eliminarProyecto);

	// Tareas
	router.post('/proyectos/:url',
		authController.usuarioAutenticado,
		tareasController.agregarTarea);

	// Actualizar tarea
	router.patch('/tareas/:id',
		authController.usuarioAutenticado,
		tareasController.cambiarEstadoTarea);
	
	// Eliminar tarea
	router.delete('/tareas/:id',
		authController.usuarioAutenticado,
		tareasController.eliminarTarea);

	// Rutas para los usuarios
	// Crear nueva cuenta
	router.get('/crear-cuenta', usuariosController.formCrearCuenta);
	router.post('/crear-cuenta', usuariosController.crearCuenta);
	router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

	// Iniciar sesión
	router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
	router.post('/iniciar-sesion', authController.autenticarUsuario);

	// Cerrar sesión
	router.get('/cerrar-sesion', authController.cerrarSesion);

	// Reestablecer contraseña
	router.get('/reestablecer', usuariosController.formRestablecerPassword);
	router.post('/reestablecer', authController.enviarToken);
	router.get('/reestablecer/:token', authController.validarToken);
	router.post('/reestablecer/:token', authController.actualizarPassword);

	return router;
}