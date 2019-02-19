const 	express	= require("express"),
		usuarioManager 	= require("../usuario_manager")
		;
	
function terminarSesion(sesion){
	
}
		
var Router = express.Router();

Router.post('/', function (req, res)  {
	var sesion = req.session;
	if( !('user' in req.body) || !('pass' in req.body) ){
		res.json({ msg : 'Parametrizacion incorrecta'});
	} else {
		usuarioManager.login( req.body.user, req.body.pass, (error, result) => {
			if(error){
				res.json({ msg : 'Usuario o clave Incorrectos' });
			}else{
				sesion.username = result;
				sesion.save( (err)=>{
					if(err){
						console.log("Sesion no guardada: " + err);
					}else{
						console.log("inicio de sesion guardado para user " + sesion.username );
					}
				});
				res.json({ msg: 'Validado' });
			}
		});
	}
});

Router.get('/createUser', function (req, res)  {
	var usuarios = [
		{ username: 'andrea', clave: 'Sofia1'},
		{ username: 'dario', clave: 'Ariana2'},
		{ username: 'xavier', clave: 'Ivan3'}
	];
	
	usuarioManager.registrarUsuarios( usuarios, (error, result) => {
		if(error){
			console.log("Envio error " + error);
			res.sendStatus(500).json(error);
		}else{
			res.json(result);
		}
	});
	
});

Router.get('/salir', function (req, res)  {
	var sesion = req.session;
	var usuario = sesion.username;
	sesion.destroy((err)=>{
		if(err){
			console.log(err);
		}else{
			console.log("Sesion de usuario " + usuario + " ha sido finalizada");
			res.json({msg:'OK'});
		}
	});
});

module.exports = Router;