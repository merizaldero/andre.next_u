var fs 		= require('fs'),
	path	= require('path');

class MiData {
	
	constructor(){
		
	}
	
	cargarDataGeneral(){
		var dataPath = path.dirname(path.dirname( __dirname )) + path.join('/public/data.json') ;
		return new Promise((resolve, reject) => {
			fs.readFile(dataPath, (err, readData) => {
				if(err){
					reject(err);
				}else {
					resolve(JSON.parse(readData));	
				}
			});
		});
	}
	
	seleccionar(listado, filtrar = function(item){return true;} ){
		return new Promise( (resolve, reject)=>{
			switch(listado){
			case 'ciudades':
				this.cargarDataGeneral().then( (lista) => {
					resolve( this.obtenerlistadoUnico(lista,'Ciudad').filter(filtrar) );
				}).catch( (err1) => {
					reject(err1);
				});
				break;
			case 'tiposConstruccion':
				this.cargarDataGeneral().then( (lista) => {
					resolve( this.obtenerlistadoUnico(lista,'Tipo').filter(filtrar) );
				}).catch( (err1) => {
					reject(err1);
				});
				break;
			case 'viviendas':
				this.cargarDataGeneral().then( (lista) => {
					resolve( lista.filter(filtrar) );
				}).catch( (err1) => {
					reject(err1);
				});
				break;
			default:
				reject({message : 'Listado no valido'});
			}
		});
	}
	
	obtenerlistadoUnico(arreglo, propiedad){
		var arregloSalida = [];
		var resultado = [];
		var item;
		var item2;
		arreglo.forEach((item) => {
			if( propiedad in item && arregloSalida.indexOf( item[propiedad] ) < 0 ){
				arregloSalida.push(item[propiedad]);
			}
		});
		arregloSalida.forEach((item)=>{
			item2 = {};
			item2[propiedad] = item;
			resultado.push( item2 );
		});
		return resultado;
	}
	
}

module.exports = new MiData();