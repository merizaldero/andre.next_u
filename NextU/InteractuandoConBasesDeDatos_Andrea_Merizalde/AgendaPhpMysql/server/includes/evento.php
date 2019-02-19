<?php

require_once dirname( __FILE__ ) . '/conexion.php';

/**
 * Gestor de tabla de Eventos
 * @author andre
 *
 */
class EventoManager extends EntidadManager{
    public const TABLA_EVENTO = 'EVENTO';
    public const CAMPO_ID = 'id';
    public const CAMPO_USUARIO = 'username';
    public const CAMPO_TITULO = 'titulo';
    public const CAMPO_FECHAINICIO = 'start_date';
    public const CAMPO_HORAINICIO = 'start_hour';
    public const CAMPO_FECHAFIN = 'end_date';
    public const CAMPO_HORAFIN = 'end_hour';
    public const CAMPO_DIA_COMPLETO = 'allDay';
        
    /**
     * @param array $evento informacion de evento 
     * @return string|string|unknown
     */
    public function registrarEvento($evento){
        $conexion = $this->obtenerConexion();
        if($conexion->connect_error){
            $evento ['error'] = 'Error de Conexion';
            return $evento;
        }
        
        $errores = $this->validarCampos($evento);
        
        if( count($errores) > 0){
            $evento['errores'] = $errores;
        } else {
            $sentencia = null;
            if($evento[ self::CAMPO_DIA_COMPLETO ] == 'true'){
                $sql = 'INSERT INTO EVENTO ( username , titulo , start_date , allDay ) VALUES ( ?, ?, ?, 1) ';
                $sentencia = $conexion->prepare( $sql );
                $sentencia->bind_param('sss', $evento[self::CAMPO_USUARIO] , $evento[self::CAMPO_TITULO] , $evento[self::CAMPO_FECHAINICIO] );
            }else{
                $sql = 'INSERT INTO EVENTO ( username , titulo , start_date , start_hour , end_date , end_hour , allDay ) VALUES ( ?, ?, ?, ?, ?, ?, 0 ) ';
                $sentencia = $conexion->prepare( $sql );
                $sentencia->bind_param('ssssss', $evento[self::CAMPO_USUARIO] , $evento[self::CAMPO_TITULO] , $evento[self::CAMPO_FECHAINICIO] , $evento[self::CAMPO_HORAINICIO] , $evento[self::CAMPO_FECHAFIN] , $evento[self::CAMPO_HORAFIN] );
            }
            if( $sentencia->execute() ){
                $evento[ self::CAMPO_ID ] = $conexion->insert_id;
            } else {
                $evento['error'] = 'Error en insercion';
            }
            $conexion->close();
        }
        
        return $this->complementarCampos($evento);
    }
    
    public function actualizarEvento($evento){

        //Determina si evento es ALL DAY
        $eventoActual = $this->consultarPorId( $evento[self::CAMPO_ID] , $evento[self::CAMPO_USUARIO] );
        if( $eventoActual['msg'] != 'OK' || count($eventoActual['eventos']) != 1 ){
            $evento['error'] = 'Evento no existe';
            return $evento;
        }
        $evento[ self::CAMPO_DIA_COMPLETO ] = $eventoActual['eventos'][0][ self::CAMPO_DIA_COMPLETO ];
        $evento[ self::CAMPO_TITULO ] = $eventoActual['eventos'][0][ self::CAMPO_TITULO ];
        
        $conexion = $this->obtenerConexion();
        if($conexion->connect_error){
            $evento ['error'] = 'Error de Conexion';
            return $evento;
        }
        
        $errores = $this->validarCampos($evento, true);
        
        if( count($errores) > 0){
            $evento['errores'] = $errores;
        } else {
            $sentencia = null;
            if($evento[ self::CAMPO_DIA_COMPLETO ] == 'true'){
                $sql = 'UPDATE EVENTO SET start_date = ? WHERE id = ? AND username = ? ';
                $sentencia = $conexion->prepare( $sql );
                $sentencia->bind_param('sis', $evento[self::CAMPO_FECHAINICIO] , $evento[self::CAMPO_ID], $evento[self::CAMPO_USUARIO] );
            }else{
                $sql = 'UPDATE EVENTO SET start_date = ? , start_hour = ? , end_date = ? , end_hour = ? WHERE id = ? AND username = ? ';
                $sentencia = $conexion->prepare( $sql );
                $sentencia->bind_param('ssssis', $evento[self::CAMPO_FECHAINICIO] , $evento[self::CAMPO_HORAINICIO] , $evento[self::CAMPO_FECHAFIN] , $evento[self::CAMPO_HORAFIN] , $evento[self::CAMPO_ID] , $evento[self::CAMPO_USUARIO]);
            }
            if( ! $sentencia->execute() ){
                $evento['error'] = 'Error en actualizacion';
            }
            
            $conexion->close();
        }
        
        return $this->complementarCampos($evento);
    }
    
    private function validarCampos($evento, $paraActualizar = false ){
        $errores = [];
        
        
        
        return $errores;
    }
    
    public function eliminarEvento($userName,$idEvento){
        $conexion = $this->obtenerConexion();
        if($conexion->connect_error){
            return ['msg' => 'Error de Conexion'];
        }

        $sql = 'DELETE FROM EVENTO WHERE id = ? AND username = ? ';
        $sentencia = $conexion->prepare( $sql );
        $sentencia->bind_param('is', $idEvento , $userName );

        $sentencia->execute();
        
        return ['msg' => 'OK'];
    }

    public function consultarEventos($userName){
        $conexion = $this->obtenerConexion();
        if($conexion->connect_error){
            return ['msg' => 'Error de Conexion'];
        }
        
        $sql = 'SELECT id , titulo , start_date , start_hour , end_date , end_hour , allDay FROM EVENTO WHERE username = ? ';
        $sentencia = $conexion->prepare( $sql );
        $sentencia->bind_param('s', $userName );
        
        if( ! $sentencia->execute() ){
            return ['msg' => 'Error de ejecucion'];
        }
        
        $result = null;
        if( ! ($result = $sentencia->get_result()) ){
            return ['msg' => 'Error de consulta x'];
        }
        
        $filas = [];
        
        while ($fila = $result->fetch_assoc()) {
            $fila = $this->complementarCampos($fila);
            $filas[] = $fila;
        }
        
        return ['msg' => 'OK' , 'eventos' => $filas ];

    }
    
    private function consultarPorId($idEvento, $userName){
        $conexion = $this->obtenerConexion();
        if($conexion->connect_error){
            return ['msg' => 'Error de Conexion'];
        }
        
        $sql = 'SELECT id , titulo , start_date , start_hour , end_date , end_hour , allDay FROM EVENTO WHERE id = ? and username = ? ';
        $sentencia = $conexion->prepare( $sql );
        $sentencia->bind_param('is', $idEvento, $userName );
        
        if( ! $sentencia->execute() ){
            return ['msg' => 'Error de ejecucion'];
        }
        
        $result = null;
        if( ! ($result = $sentencia->get_result()) ){
            return ['msg' => 'Error de consulta x'];
        }
        
        $filas = [];
        
        while ($fila = $result->fetch_assoc()) {
            $fila = $this->complementarCampos($fila);
            $filas[] = $fila;
        }
        
        return ['msg' => 'OK' , 'eventos' => $filas ];
        
    }
    
    private function complementarCampos($fila){
        $fila['title'] = $fila[self::CAMPO_TITULO];
        $fila[ self::CAMPO_DIA_COMPLETO ] = ( $fila[ self::CAMPO_DIA_COMPLETO ] == 1);
        if($fila[ self::CAMPO_DIA_COMPLETO ]){
            $fila['start'] = $fila[self::CAMPO_FECHAINICIO];
        } else {
            $fila['start'] = $fila[self::CAMPO_FECHAINICIO] . ' ' . $fila[self::CAMPO_HORAINICIO];
            $fila['end'] = $fila[self::CAMPO_FECHAFIN] . ' ' . $fila[self::CAMPO_HORAFIN];
        }
        return $fila;
    }
    
}

 ?>
