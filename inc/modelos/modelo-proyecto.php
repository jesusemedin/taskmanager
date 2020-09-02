<?php
$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

if($accion === 'crear'){
    //IMPORTAR LA CONEXION
    include '../funciones/conexion.php';
    try{
        // REALIZAR LA CONSULTA A LA DB
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        // UNA VEZ EJECUTAMOS LA CONSULTA EL STMT RETORNA VALORES
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
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