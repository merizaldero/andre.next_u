<?php

/**
 * Conector de Base de Datos
 * @author andre
 *
 */
abstract class EntidadManager{
    
    /*
     * Configuracion de Conexion
     * */
    
    protected const DB_SERVER = 'localhost';
    protected const DB_DATABASE = 'calendario';
    protected const DB_USER = 'cal_user';
    protected const DB_PASSWORD = 'cal_clave';
    
    /**
     * Crea una nueva conexion a la base de datos
     * @return mysqli Objeto de Conexion
     */
    protected function obtenerConexion(){
        return new mysqli( self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB_DATABASE );
    }
}

 ?>
