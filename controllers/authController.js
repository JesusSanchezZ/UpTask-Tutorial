const passport = require('passport');
const Usuarios = require('../Models/Ususarios');
const {Op} = require('@sequelize/core');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');                          // para generar el token
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

// Función para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    // Si el usuario está autenticado adelante
    if(req.isAuthenticated()) {
        return next();
    }

    // Sino está autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Función para cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');               // Al cerrar la sesión nos lleva al login
    })
}

// Genera un Token si el usuario es válido
exports.enviarToken = async (req, res) => {
    // Verificar que el usuario existe
    const {email} = req.body;                         // Obtenemos el email 
    const usuario = await Usuarios.findOne({ where: {email}});

    // Si no existe el usuario
    if(!usuario || !email){
        if(!email) req.flash('error', 'Proporcione un email')
        else req.flash('error', 'No existe esa cuenta');

        res.redirect('/reestablecer');

        /*res.render('reestablecer',{
            nombrePagina : 'Reestablecer tu Contraseña',
            mensajes: req.flash()
        })*/
    }
    else{
        // Usuario existe
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;

        // Guardarlos en la base de datos
        await usuario.save();

        // url de reset
        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

        await enviarEmail.enviar({
            usuario,
            subject: 'Password Reset',
            resetUrl,
            archivo: 'reestablecer-password'
        });

        // terminar
        req.flash('correcto', 'Seenvió un mensaje a tu correo');
        res.redirect('/iniciar-sesion');
        //res.redirect(resetUrl);
    }

}

exports.validarToken = async (req, res) => {
    const token = req.params.token;
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña',
        token
    })

}

// cambiar el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    // Verificamos el token valido pero también la fecha de expiración
    const token = req.params.token;

    const {password} = req.body;
    const usuario = await Usuarios.findOne({
        where: {
            token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if(!usuario || !password) {
        //const {password} = req.body;
        //console.log(password);
        //req.flash('error','token: '+password);
        if(!password) {
            req.flash('error', 'Falta el password');
            res.redirect(`/reestablecer/${token}`);
        }
        else {
            req.flash('error', 'No Válido');
            res.redirect('/reestablecer');
        }
    } else{
        // hashear el password
        usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        usuario.token = null;
        usuario.expiracion = null;

        // Gurdamos el nuevo password
        await usuario.save();

        req.flash('correcto', 'Tu password se ha modificado correctamente');
        res.redirect('/iniciar-sesion');
    }
}