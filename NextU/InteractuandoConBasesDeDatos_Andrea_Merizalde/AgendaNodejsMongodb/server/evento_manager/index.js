var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventoSchema = new Schema({
	title: { type:String , required:true },
	username: { type:String , required:true },
	start: { type:String , required:true },
	end: { type:String , required:false },
	allDay: { type:Boolean	 , required:true }
});

var Evento = mongoose.model('Evento', eventoSchema );

function validarEvento(evento, modoActualizacion, callback){
	callback(null, complementarCampos(evento) );
}

function complementarCampos( evento ){
	var evento1 = { start: evento.start, username : evento.username };
	if( !('allDay' in evento) ){
		evento1.allDay = ( ! ('end' in evento) || evento.end == '' );	
	} else {
		evento1.allDay = evento.allDay;
	}
	evento1.end = (evento1.allDay) ? '' : evento.end ;
	if('_id' in evento){
		evento1.id = evento._id;
	}
	if('title' in evento){
		evento1.title = evento.title;
	}
	return evento1;
}

module.exports.registrarEvento = function(evento, callback){
	validarEvento(evento, false,(error, evento1)=>{
		if(error){
			callback(error);
		}
		else{
			
			var eventoInstancia;
			if(evento1.allDay){
				eventoInstancia = new Evento({ title:evento1.title, username:evento1.username.toUpperCase(), start:evento1.start, allDay:evento1.allDay });	
			}else{
				eventoInstancia = new Evento({ title:evento1.title, username:evento1.username.toUpperCase(), start:evento1.start, end:evento1.end, allDay:evento1.allDay });
			}
			
			eventoInstancia.save( (error1, eventoCreado) => {
				if(error){
					callback(error1)
				}else{
					callback(null, complementarCampos(eventoCreado));
				}
			});
			
		}
	});
};

module.exports.actualizarEvento = function(evento, callback){	
	validarEvento(evento, true, (error, evento1)=>{
		if(error){
			callback(error);
		}
		else{
			Evento.find({ _id: evento._id, username: evento.username.toUpperCase() }).exec((error1, result)=>{
				if(error1){
					console.log(error1);
					callback(error1);
				}else if(result.length == 1){
					var eventoActual = result[0];
					var callbackUpdate = function(error2, result2){
						
						if(error2){
							console.log(error2);
							callback(error2);
						}else{
							callback(null, result2);
						}
					}
					if(eventoActual.allDay){
						Evento.updateOne( { _id:evento._id , username: evento.username.toUpperCase() } , {start:evento.start}  ).exec(callbackUpdate) ;
					} else {
						Evento.updateOne( { _id:evento._id , username: evento.username.toUpperCase() } , {start:evento.start, end:evento.end } ).exec(callbackUpdate);
					}
				}else{
					console.log( 'No se ha encontrado instancia ' + JSON.stringify(evento) );
					callback('No se ha encontrado instancia');
				}
			});
		}
	});
};

module.exports.eliminarEvento = function(evento, callback){
	Evento.find({ _id: evento._id, username: evento.username.toUpperCase() }).exec((error, result)=>{
		if(error){
			callback(error);
		} else {
			if(result.length > 0){
				Evento.deleteOne({ _id: evento._id, username: evento.username.toUpperCase() } ).exec( (error1, result1)=>{
					if(error1){
						console.log(error1);
						callback(error1);
					}else if(result == null){
						console.log('result eliminacion es null');
						callback(null, []);
					}else{
						callback(null, result1);
					}
				});
			}else{
				console.log( 'No se ha encontrado instancias para eliminar' + JSON.stringify(evento) );
				callback('No se ha encontrado instancias para eliminar');
			}
		}
	});
};

module.exports.consultarEventos = function(username,callback){
	Evento.find({ username: username.toUpperCase() }).exec((error, result)=>{
		if(error){
			console.log(error);
			callback(error);
		}else{
			for( evento in result ){
				result[evento] = complementarCampos(result[evento]);
			}
			callback(null, result);
		}
	});
};

