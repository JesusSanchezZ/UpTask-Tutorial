import proyectos from './modulos/proyectos'
import tareas from './modulos/tareas'
import { actualizaAvance } from './funciones/avance'

// cada vez que se actualiza el avance se llama a la función para ver los cambios 
document.addEventListener('DOMContentLoaded', () => {
    actualizaAvance();
})