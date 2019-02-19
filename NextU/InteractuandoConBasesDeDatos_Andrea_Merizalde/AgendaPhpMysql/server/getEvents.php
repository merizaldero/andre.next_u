<?php
  
$method = $_SERVER['REQUEST_METHOD'];

if($method != 'GET'){
    http_response_code(405);
    die("Method not allowed");
}

require_once dirname( __FILE__ ) . '/includes/evento.php';

session_start();
if( ! array_key_exists( EventoManager::CAMPO_USUARIO , $_SESSION ) ){
    http_response_code(401);
    error_log('Debe iniciar sesion');
    die("Debe iniciar sesion");
}

$userName = $_SESSION[ EventoManager::CAMPO_USUARIO ];

error_log('consultando eventos de usuario '.$userName);

$eventoManager = new EventoManager();

$resultado = $eventoManager->consultarEventos($userName);

error_log('lista eventos ' . json_encode($resultado));

echo json_encode($resultado);

 ?>
