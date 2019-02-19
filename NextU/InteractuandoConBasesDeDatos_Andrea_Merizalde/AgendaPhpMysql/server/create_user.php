<?php

$method = $_SERVER['REQUEST_METHOD'];

if($method != 'GET'){
    http_response_code(405);
    die("Method not allowed");
}

require_once dirname( __FILE__ ) . '/includes/usuario.php';

$usuarios = [
    [
        UsuarioManager::CAMPO_USERNAME => 'andrea',
        UsuarioManager::CAMPO_PASSWORD => 'Sofia1',
    ],
    [
        UsuarioManager::CAMPO_USERNAME => 'dario',
        UsuarioManager::CAMPO_PASSWORD => 'Ariana2',
    ],
    [
        UsuarioManager::CAMPO_USERNAME => 'xavier',
        UsuarioManager::CAMPO_PASSWORD => 'Ivan3',
    ]
];

$usuarioManager = new UsuarioManager();

$usuarios = $usuarioManager->registrarUsuarios($usuarios);

echo json_encode($usuarios);
 ?>
