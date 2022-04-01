const Usuarios = require('../Models/Ususarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina : 'Crear Cuenta en UpTask'
    });
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina : 'Iniciar sesión en UpTask',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    // leer los datos
    const {email, password} = req.body;

    try {
        // Crear el usuario 
        await Usuarios.create({
            email,
            password
        });
        /*.then(() => {
            res.redirect('/iniciar-sesion');
        });*/
        // crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const usuario = {
            email
        };

        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        // redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta',{
            mensajes: req.flash() ,
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        })
    }

    
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

exports.confirmarCuenta = async (req, res) => {
    //res.json(req.params.correo);
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/crear-cuenta');
    } else {
        usuario.activo = 1;
        await usuario.save();

        // redirigimos
        req.flash('correcto', 'Cuenta activada correctamente');
        res.redirect('/iniciar-sesion');
    }
}