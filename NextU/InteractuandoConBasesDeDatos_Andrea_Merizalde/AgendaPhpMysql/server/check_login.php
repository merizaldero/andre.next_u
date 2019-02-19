<?php

$method = $_SERVER['REQUEST_METHOD'];

if($method != 'POST'){
    http_response_code(405);
    die("Method not allowed");
}

require_once dirname( __FILE__ ) . '/includes/usuario.php';

$usuarioManager = new UsuarioManager();

$usuario = $usuarioManager->login( $_POST [UsuarioManager::CAMPO_USERNAME] , $_POST[UsuarioManager::CAMPO_PASSWORD] );

if( $usuario ){
    session_start();
    $_SESSION[ UsuarioManager::CAMPO_USERNAME ] = $usuario;
    echo json_encode(['msg'=>'OK', UsuarioManager::CAMPO_USERNAME => $usuario]);
}else{
    session_unset();
    session_destroy();
    echo json_encode(['msg'=>'Usuario o clave incorrectos']);
}
?>
