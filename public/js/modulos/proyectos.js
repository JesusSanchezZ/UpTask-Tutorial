// babel sirve para hacer importacion de paquetes sin require
import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto')

// listener
if(btnEliminar){
  btnEliminar.addEventListener('click', e => {
    const urlProyecto = e.target.dataset.proyectoUrl;

    //console.log(urlProyecto);
    
    //console.log('diste click en eliminar');
    Swal.fire({
        title: '¿Estás seguro de borrar este proyecto?',
        text: "¡Un proyecto eliminado no se puede recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, borrar!',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // enviar petición a axios
          const url = `${location.origin}/proyectos/${urlProyecto}`;
          //console.log(url);
          axios.delete(url, { params: {urlProyecto}})
            .then(function(respuesta){
              //console.log(respuesta)
              Swal.fire(
                '¡Proyecto Eliminado!',
                respuesta.data,
                'success'
              );
              // Redireccionamos al inicio
              setTimeout(() => {
                  window.location.href = '/'
              }, 3000);

            })
            .catch(() => {
              Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'No se pudo eliminar el Proyecto'
              })
            });
        }
      })
  })
}
