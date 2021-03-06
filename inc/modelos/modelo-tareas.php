<?php
$accion = $_POST['accion'];
$id_proyecto = (int) $_POST['id_proyecto'];
$tarea = $_POST['tarea'];
$estado = $_POST['estado'];
$id_tarea = (int) $_POST['id'];

if($accion === 'crear'){
    //IMPORTAR LA CONEXION
    include '../funciones/conexion.php';
    try{
        // REALIZAR LA CONSULTA A LA DB
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        // UNA VEZ EJECUTAMOS LA CONSULTA EL STMT RETORNA VALORES
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e){
        // EN CASO DE QUE HAYA UN ERROR TOMAR LA EXEPCION
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

if ($accion === 'actualizar') {
        //IMPORTAR LA CONEXION
        include '../funciones/conexion.php';
        try{
            // REALIZAR LA CONSULTA A LA DB
            $stmt = $conn->prepare(" UPDATE tareas set estado = ? WHERE id = ? ");
            $stmt->bind_param('ii', $estado, $id_tarea);
            $stmt->execute();
            // UNA VEZ EJECUTAMOS LA CONSULTA EL STMT RETORNA VALORES
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto'
                );
            } else {
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch(Exception $e){
            // EN CASO DE QUE HAYA UN ERROR TOMAR LA EXEPCION
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
}

if ($accion === 'eliminar') {
    //IMPORTAR LA CONEXION
    include '../funciones/conexion.php';
    try{
        // REALIZAR LA CONSULTA A LA DB
        $stmt = $conn->prepare(" DELETE from tareas WHERE id = ? ");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        // UNA VEZ EJECUTAMOS LA CONSULTA EL STMT RETORNA VALORES
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e){
        // EN CASO DE QUE HAYA UN ERROR TOMAR LA EXEPCION
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}
?>