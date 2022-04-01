const Proyectos = require('../Models/Proyectos');
const Tareas = require('../Models/Tareas');

exports.agregarTarea = async (req, res) => {
    // Obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    // leer el valor del input
    const {tarea} = req.body;

    let errores = [];

    if(!tarea) {
        errores.push({ 'texto' : 'Agrega un nombre a la Tarea'});
    } 

    if(errores.length > 0){
        const tareas = await Tareas.findAll({
            where : { proyectoId : proyecto.id}
        });

        const proyectos = await Proyectos.findAll({
            where : { usuarioId : res.locals.usuario.id }
        });

        req.flash('error', 'Agrega un nombre a la Tarea')

        res.render('tareas', {
			nombrePagina : 'Tareas del proyecto',
			mensajes: req.flash(),
			proyectos,
            proyecto,
            tareas
		})
    }else{
        // estado 0 = incompleto y Id de proyectos
        const estado = 0;
        const proyectoId = proyecto.id;

        // Insertamos en la base de datos
        const resultado = await Tareas.create({ tarea, estado, proyectoId});

        if(!resultado){
            return next();
        }

        // redireccionamos
        res.redirect(`/proyectos/${req.params.url}`);
    }
}

exports.cambiarEstadoTarea = async (req, res, next) =>{
    //console.log(req.params);
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where: {
            id
        }
    })
    
    // cambiar el estado de la tarea
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Todo bien...');
}

exports.eliminarTarea = async (req, res, next) => {
    const {id} = req.params;
    // eliminar la tarea
    const resultado = await Tareas.destroy(
        { 
            where: {id}
        }
    );

    if(!resultado) return next();

   res.status(200).send('Sin errores...'); 
}