<?php
$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === 'crear'){
    // CODIGO PARA CREAR LOS ADMINISTRADORES

    // PASSWORD HASH
    $opciones = array(
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    //IMPORTAR LA CONEXION
    include '../funciones/conexion.php';
    try{
        // REALIZAR LA CONSULTA A LA DB
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param("ss", $usuario, $hash_password);
        $stmt->execute();
        // UNA VEZ EJECUTAMOS LA CONSULTA EL STMT RETORNA VALORES
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
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
            'pass' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

if($accion === 'login'){
    // CODIGO PARA LOGUEAR LOS ADMINISTRADORES

    include '../funciones/conexion.php';

    try {
        // SELECCIONAR EL ADMINISTRADOR DE LA BASE DE DATOS
        $stmt = $conn->prepare(" SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        // LOGUEAR USUARIO
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
        $stmt->fetch();
        if($nombre_usuario){
            // SI EL USUARIO EXISTE VERIFICAR EL PASSWORD
            if(password_verify($password, $pass_usuario)){
                // INICAR LA SESION
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                // LOGIN CORRECTO
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                );
            } else {
                // LOGIN INCORRECTO
                $respuesta = array (
                    'resultado' => 'Password incorrecto'
                );
            }
        } else {
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e){
        // EN CASO DE QUE HAYA UN ERROR TOMAR LA EXEPCION
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}
?>