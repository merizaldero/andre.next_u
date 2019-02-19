const 	express	= require("express"),
		eventoManager 	= require("../evento_manager")
		;
	
var Router = express.Router();

Router.get('/all', function(req, res){
	var username = req.session.username;
	if( ! username ){
		console.log("No Autorizado");
		res.sendStatus(401); // No autorizado
	} else {
		eventoManager.consultarEventos(username, (error, result) => {
			if(error){
				res.sendStatus(500); // Error en llamado
			} else {
				res.json(result);
			}
		});
	}
});

Router.post('/new', function(req, res){
	var username = req.session.username;
	if( ! username ){
		console.log("No Autorizado");
		res.sendStatus(401); // No autorizado
	} else {
		if( !('title' in req.body) || !('start' in req.body) || !('end' in req.body) ){
			res.json({ msg : 'Parametrizacion incorrecta'});
		}
		eventoManager.registrarEvento( { username:username, title:req.body.title, start:req.body.start, end:req.body.end } , (error, result) => {
			if(error){
				console.log(error);
				res.sendStatus(500); // Error en llamado
			} else {
				res.json( { msg:'OK', evento:result } );
			}
		});
	}
});

Router.post('/update', function(req, res){
	var username = req.session.username;
	if( ! username ){
		console.log("No Autorizado");
		res.sendStatus(401); // No autorizado
	} else {
		if( !('id' in req.body) || !('start' in req.body) || !('end' in req.body) ){
			res.json({ msg : 'Parametrizacion incorrecta'});
		}
		eventoManager.actualizarEvento( { _id: req.body.id, username:username, start:req.body.start, end:req.body.end } , (error, result) => {
			if(error){
				console.log(error);
				res.sendStatus(500); // Error en llamado
			} else {
				res.json( { msg:'OK', evento:result } );
			}
		});
	}
});

Router.post('/delete', function(req, res){
	var username = req.session.username;
	if( ! username ){
		console.log("No Autorizado");
		res.sendStatus(401); // No autorizado
	} else {
		if( !('id' in req.body) ){
			res.json({ msg : 'Parametrizacion incorrecta'});
		}
		eventoManager.eliminarEvento( { _id: req.body.id, username:username } , (error, result) => {
			if(error){
				console.log(error);
				res.sendStatus(500); // Error en llamado
			} else {
				res.json( { msg:'OK', evento:result } );
			}
		});
	}
});

module.exports = Router;