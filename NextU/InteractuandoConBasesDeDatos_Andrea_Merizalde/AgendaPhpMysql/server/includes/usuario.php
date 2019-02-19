<?php

require_once dirname( __FILE__ ) . '/conexion.php';

/**
 * Gestor de tabla de Usuarios
 * @author andre
 *
 */
class UsuarioManager extends EntidadManager{
    public const TABLA_USUARIO = 'USUARIO';
    public const CAMPO_USERNAME = 'username';
    public const CAMPO_PASSWORD = 'password';
    
    /**
     * Crea usuarios de acuerdo a arreglo
     * @param array $usuarios
     * @return array Estatus de creacion de cada usuario
     */
    public function registrarUsuarios($usuarios){
        $conexion = $this->obtenerConexion();
        if($conexion->connect_error){
            return ['error' => 'Error de Conexion'];
        }

        $userName = '';
        $password = '';
        
        $sentencia = $conexion->prepare('INSERT INTO ' . self::TABLA_USUARIO . ' ( ' . self::CAMPO_USERNAME . ' , ' . self::CAMPO_PASSWORD . ' ) VALUES ( ? , ? ) ' );
        if(! $sentencia ){
            return ['error' => 'Error construccion Sentencias '.'INSERT INTO ' . self::TABLA_USUARIO . ' ( ' . self::CAMPO_USERNAME . ' , ' . self::CAMPO_PASSWORD . ' ) VALUES ( ? , ? ) '];
        }
        $sentencia->bind_param('ss', $userName, $password );
        
        foreach ($usuarios as $usuario) {
            $userName = strtoupper(trim( $usuario[ self::CAMPO_USERNAME ] ));
            $password = password_hash( trim($usuario[ self::CAMPO_PASSWORD ]), PASSWORD_DEFAULT );
            
            $usuario['resultado'] = $sentencia->execute() ? 'Insercion exitosa' : 'Error Insercion';
        }
        
        $conexion->close();
        
        return $usuarios;
    }
    
    /**
     * Autenticacion de usuario
     * @param string $userName
     * @param string $password
     * @return boolean|string falso si autenticacion falla; nombre de usuario autenticado
     */
    public function login($userName, $password){
        $conexion = $this->obtenerConexion();
        if($conexion->connect_error){
            return false;
        }
        
        $sentencia = $conexion->prepare('SELECT ' . self::CAMPO_PASSWORD . ' FROM ' . self::TABLA_USUARIO . ' WHERE ' . self::CAMPO_USERNAME . ' = ? ');
        $sentencia->bind_param('s', strtoupper(trim($userName)) );
        
        if( ! $sentencia->execute() ){
            $conexion->close();
            error_log('sentencia con error');
            return false;
        }

        $sentencia->bind_result($password_hash);
        
        if(! $sentencia->fetch() ){
            $conexion->close();
            error_log("Usuario no encontrado $userName");
            return false;
        }
        
        $conexion->close();
        if( ! password_verify($password, $password_hash)){
            error_log('Clave incorrecta');
            return false;
        }
        
        return strtoupper(trim($userName));
        
    }
    
}

 ?>
