import axios from "axios";
import Swal from "sweetalert2";
import { actualizaAvance } from "../funciones/avance";

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click', e => {
        //console.log(e.target.classList);
        if(e.target.classList.contains('fa-check-circle')){
            //console.log('Actualizando...');
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    //console.log(respuesta);
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');

                        actualizaAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash-can')){
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;
            const url = `${location.origin}/tareas/${idTarea}`;

            Swal.fire({
                title: 'Deseas borrar esta tarea',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, Borrar',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed){
                    //console.log('Eliminando...');
                    // enviamos delete por medio de axios
                    axios.delete(url, {
                        params: {
                            idTarea
                        }
                    })
                    .then(function(respuesta){
                        //console.log(respuesta);
                        if(respuesta.status === 200){
                            // Eliminar el Nodo
                            tareaHTML.parentElement.removeChild(tareaHTML);

                            // opcional mandar alerta
                            Swal.fire(
                                'Tarea eliminada...',
                                respuesta.data,
                                'success'
                            )

                            actualizaAvance();
                        }
                    });
                }
            });

            console.log(tareaHTML);
            console.log(idTarea)
        }
    });

}

export default tareas;