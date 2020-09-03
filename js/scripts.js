eventListeners();
// VARIABLES GLOBALES
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners(){
    // DOCUEMENT READY
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    })

    // BOTON PARA CREAR PROYECTO
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // BOTON PARA UNA NUEVA TAREA
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    // BOTONES PARA LAS ACCIONES DE LAS TAREAS
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas)
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

                        // SELECCIONAR EL PARRAFO CON LA LISTA VACIA
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

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

                        // ACTUALIZAR EL PROGRESO
                        actualizarProgreso();
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

// CAMBIA EL ESTADO DE LAS TAREAS O LAS ELIMINA
function accionesTareas(e){
    e.preventDefault();

    // EN ESTA SECCION VAMOS A PROBAR EL DELEGATION
    // CON TARGET SE TIENE ACCESO A QUE ELEMENTO EL USUARIO ESTA HACIENDO CLICK
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }

    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: 'Seguro (a)?',
            text: "Esta accion no se puede deshacer",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {

                var tareaEliminar = e.target.parentElement.parentElement;
                // BORRAR DE LA BASE DE DATOS
                eliminarTareaDB(tareaEliminar);

                // BORRAR DEL HTML
                tareaEliminar.remove();

              Swal.fire(
                'Eliminado',
                'La tarea fue eliminado',
                'success'
              )
            }
          })
    }
}

// COMPLETA O DESCOMPLETA UNA TAREA
function cambiarEstadoTarea(tarea, estado){
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    
    // CREAR LLAMADO A AJAX
    var xhr = new XMLHttpRequest;

    // INFORMACION O DATOS
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    // OPEN LA CONEXIION
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // ON LOAD
    xhr.onload = function () {
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));

            // ACTUALIZAR EL PROGRESO
            actualizarProgreso();
        }
    }

    // ENVIAR LA PETICION
    xhr.send(datos);

}

// ELIMINA LAS TAREAS DE LA BASE DE DATOS
function eliminarTareaDB(tarea){
    var idTarea = tarea.id.split(':');
    
    // CREAR LLAMADO A AJAX
    var xhr = new XMLHttpRequest;

    // INFORMACION O DATOS
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    // OPEN LA CONEXIION
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // ON LOAD
    xhr.onload = function () {
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));

            // COMPROBAR QUE HAYA TAREAS RESTANTES
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes,length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }

            // ACTUALIZAR EL PROGRESO
            actualizarProgreso();

        }
    }

    // ENVIAR LA PETICION
    xhr.send(datos);
}

// ACTUALIZA EL AVANCE DEL PROYECTO
function actualizarProgreso(){
    // OBTENER TODAS LAS TAREAS
    const tareas = document.querySelectorAll('li.tarea');

    // OBTENER LAS TAREAS COMPLETADAS
    const tareasCompletadas = document.querySelectorAll('i.completo');

    // DETERMINAR EL AVANCE
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    
    // ASIGNAR EL AVANCE A LA BARRA
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%'

    // MOSTRAR ALERTA AL COMPLETAR EL 100%
    if(avance === 100){
        Swal.fire({
            type: 'success',
            title: 'Proyecto terminado',
            text: 'Ya no tienes tareas pendientes'
        })
    }
}