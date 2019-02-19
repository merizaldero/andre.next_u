var mongoose = require('mongoose');
var password_hash = require('password-hash');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
	username: { type:String , required:true },
	clave: { type:String , required:true }
});

function findByUsername(username, callback){
	Usuario.find({ username: username.toUpperCase() }).exec((error, result)=>{
		if(error){
			callback(error);
		} else {
			if(result.length == 0){
				callback(null,null);
			}else{
				callback(null, result[0]);
			}
		}
	});
}

var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports.registrarUsuarios = function (usuarios, callback){
	var usuariosProcesados = [];
	usuarios.forEach( (usuario) => {
		findByUsername(usuario.username, (error1, usuarioExistente)=>{
			if(error1){
				usuario.error = error1;
			}else if (usuarioExistente != null){
				usuariosProcesados[ usuariosProcesados.length ] = usuarioExistente;
				if(usuariosProcesados.length == usuarios.length){
					callback(null, usuariosProcesados);
				}
			}else{
				var usuarioEntidad = new Usuario( { username: usuario.username.toUpperCase() , clave: password_hash.generate(usuario.clave) } );
				usuarioEntidad.save((error,resultado)=>{
					if(error){
						usuario.error = error;
					}else{
						usuario = resultado;
					}
					usuariosProcesados[ usuariosProcesados.length ] = usuario;
					if(usuariosProcesados.length == usuarios.length){
						callback(null, usuariosProcesados);
					}
				});
			}
		});
	});
};

module.exports.login = function(username, password, callback){
	findByUsername(username, (error, result)=>{
		if(error){
			// error en la consulta
			callback(error);
		}else if(result == null){
			//callback informacion no consistente
			callback('No se ha encontrado usuario');
		}else{
			//usuario registrado
			var usuario = result;
			if( password_hash.verify( password , usuario.clave )){
				//Clave correcta
				callback(null, usuario.username);
			} else {
				//calve no Valida
				callback("Clave incorrecta");
			}
		}
	});
};



