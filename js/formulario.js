eventListener();
function eventListener(){
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e){
    e.preventDefault();
    
    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if(usuario === '' || password === ''){
        // LA VALIDACION FALLO
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios'
          })
    } else {
        // AMBOS CAMPOS SON CORRECTOS, MANDAR A EJECUTAR AJAX

        // DATOS QUE SE ENVIAN AL SERVIDOR
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // console.log(...datos);

        // CREAR EL LLAMADO A AJAX
        var xhr = new XMLHttpRequest();

        // ABRIR LA CONEXION
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // RETORNO DE DATOS O LEER LOS DATOS
        xhr.onload = function(){
            if(this.status === 200){
                var respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);
                // SI LA RESPUESTA ES CORRECTA
                if(respuesta.respuesta === 'correcto'){
                    //SI ES UN NUEVO USUARIO
                    if(respuesta.tipo === 'crear'){
                        Swal.fire({
                            type: 'success',
                            title: 'Usuario creado',
                            text: 'El usuario se creo correctamente'
                          })
                    } else if(respuesta.tipo === 'login'){
                        Swal.fire({
                            type: 'success',
                            title: 'Login correcto',
                            text: 'Presiona OK para abrir el dashboard'
                        })
                        .then(resultado => {
                            if(resultado.value){
                                window.location.href = 'index.php';
                            }
                        })
                    }
                } else {
                    // HUBO UN ERROR
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                      })
                }
            }
        }
        
        // ENVIAR LA PETICION
        xhr.send(datos);

    }
}