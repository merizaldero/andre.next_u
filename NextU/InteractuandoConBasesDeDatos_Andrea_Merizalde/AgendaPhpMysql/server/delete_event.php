<?php

$method = $_SERVER['REQUEST_METHOD'];

if($method != 'POST'){
    http_response_code(405);
    die("Method not allowed");
}

require_once dirname( __FILE__ ) . '/includes/evento.php';

session_start();
if( ! array_key_exists( EventoManager::CAMPO_USUARIO , $_SESSION ) ){
    http_response_code(401);
    die("Debe iniciar sesion");
}
$userName = $_SESSION[ EventoManager::CAMPO_USUARIO ];

$idEvento = $_POST[ EventoManager::CAMPO_ID ];

$eventoManager = new EventoManager();
$resultado = $eventoManager->eliminarEvento($userName,$idEvento);

return json_encode($resultado);

 ?>
