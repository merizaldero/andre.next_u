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

$evento = $evento = [
    EventoManager::CAMPO_ID => $_POST[EventoManager::CAMPO_ID] ,
    EventoManager::CAMPO_USUARIO => $userName,
    EventoManager::CAMPO_FECHAINICIO => $_POST[EventoManager::CAMPO_FECHAINICIO] ,
    EventoManager::CAMPO_HORAINICIO => $_POST[EventoManager::CAMPO_HORAINICIO] ,
    EventoManager::CAMPO_FECHAFIN => $_POST[EventoManager::CAMPO_FECHAFIN] ,
    EventoManager::CAMPO_HORAFIN => $_POST[EventoManager::CAMPO_HORAFIN] ,
]; //json_decode(file_get_contents('php://input'),true);

$evento[ EventoManager::CAMPO_USUARIO ] = $userName;

$eventoManager = new EventoManager();

$evento = $eventoManager->actualizarEvento($evento);

if( array_key_exists('error', $evento) ){
    echo json_encode( ['msg' => $evento['error'] ] );
} else if( array_key_exists('errores', $evento) ){
    echo json_encode( ['msg' => 'informacion de evento no es valida' ] );
} else {
    echo json_encode(['msg'=>'OK', 'evento'=> $evento]);
}

 ?>
