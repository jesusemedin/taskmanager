eventListeners();
// VARIABLES GLOBALES
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners(){
    // BOTON PARA CREAR PROYECTO
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // BOTON PARA UNA NUEVA TAREA
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
}

function nuevoProyecto(e){
    e.preventDefault();
    // console.log("Hiciste click")
    // CREA UN INPUT PARA EL NOMBRE DEL NUEVO PROYECTO
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // SELECCIONAR EL ID CON EL NOMBRE DEL NUEVOPROYECTO
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // AL PRESIONAR ENTER CREAR EL NUEVO PROYECTO
    inputNuevoProyecto.addEventListener('keypress', function(e){
        var tecla = e.which || e.keyCode;
        if(tecla === 13){
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    })
}

function guardarProyectoDB(nombreProyecto){
    // CREAR LLAMADO AJAX
    var xhr = new XMLHttpRequest();

    // ENVIAR DATOS POR FORMDATA
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // ABRIR LA CONEXION
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // EN LA CARGA
    xhr.onload = function(){
        if(this.status === 200){
            // OBTENER DATOA DE LA RESPUESTA
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            // COMPROBRAMOS LA INSERCION
            if(resultado === 'correcto'){
                // FUE EXITOSO
                if(tipo === 'crear'){
                    // SE CREO UN NUEVO PROYECTO
                    // INYECTAR HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;
                    // AGREGAR AL HTML
                    listaProyectos.appendChild(nuevoProyecto);
                    
                    // ENVIAR ALERTA
                    Swal.fire({
                        type: 'success',
                        title: 'Proyecto creado',
                        text: 'El proyecto: ' + proyecto + ' se creo correctamente'
                    })
                    .then(resultado => {
                        // REDIRECCIONAR A LA NUEVA URL
                        if(resultado.value){
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    })
                    
                } else {
                    // SE ACTUALIZO O SE ELIMINO
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

    // ENVIAR EL REQUEST
    xhr.send(datos);
}


// AGREGAR UNA NUEVA TAREA AL PROYECTO ACTUAL
function agregarTarea(e){
    e.preventDefault();
    
    var nombreTarea = document.querySelector('.nombre-tarea').value;

    // VALIDAR QUE EL CAMPO TENGA ALGO ESCRITO
    if (nombreTarea === '') {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: 'Una tarea no puede ir vacia'
          })
    } else {
        // LA TEREA EXISTE, INSERTAR EN PHP

        // CREAR LLAMADO A AJAX
        var xhr = new XMLHttpRequest();

        // CREAR FORMDATA
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // ABRIR LA CONEXION
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        // EJECUTAR Y RESPUESTA
        xhr.onload = function(){
            if (this.status === 200) {
                // TODO CORRECTO
                var respuesta = JSON.parse(xhr.responseText);

                // ASIGNAR VALORES
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (resultado === 'correcto') {
                    // SE AGREGO CORRECTAMENTE
                    if (tipo === 'crear') {
                        // LANZAR LA ALERTA
                        Swal.fire({
                            type: 'success',
                            title: 'Tarea creada',
                            text: 'La tarea: ' + tarea + ' se creo correctamente'
                        });

                        // CONSTRUIR EL TEMPLATE
                        var nuevaTarea = document.createElement('li');

                        // AGREGAMOS EL ID
                        nuevaTarea.id = 'tarea:'+id_insertado;

                        // AGREGAMOS LA CLASE TAREA
                        nuevaTarea.classList.add('tarea');

                        // CONSTRUIR EL HTML
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        // AGREGARLO AL HTML
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        // LIMPIAR EL FORMULARIO
                        document.querySelector('.agregar-tarea').reset();
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

        // ENVIAR LA CONSULTA CON XHR.SEND
        xhr.send(datos);
    }
}