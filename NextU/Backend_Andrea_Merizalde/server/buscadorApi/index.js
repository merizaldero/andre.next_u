const 	express	= require("express"),
		miData 	= require("../miData");
var Router = express.Router();

Router.get('/ciudades', function (req, res)  {
	miData.seleccionar('ciudades')
		.then( function(resultado)  {
			res.json(resultado);
		} , function (error) {
			res.sendStatus(500).json(error);
		});
});

Router.get('/tiposConstruccion', (req, res) => {
	miData.seleccionar('tiposConstruccion')
	.then( (resultado) => {
		res.json(resultado);
	}).catch( (error) => {
		res.sendStatus(500).json(error);
	});
});

Router.post('/viviendas', (req, res) => {
	var filtro = {};
	var filtrar;
	
	var propiedades = ['Ciudad', 'Tipo'];
	var propiedadesLong = ['minPrecio', 'maxPrecio'];
	
	propiedades.forEach(propiedad => {
		if(propiedad in req.body && req.body[propiedad] != "" && req.body[propiedad] != null ){
			filtro[propiedad] = req.body[propiedad];
		}
	});
	
	propiedadesLong.forEach(propiedad => {
		if(propiedad in req.body && req.body[propiedad] != "" && req.body[propiedad] != null && !isNaN(req.body[propiedad]) ){
			filtro[propiedad] = Number(req.body[propiedad]);
		}
	});
	
	if(Object.keys(filtro).length > 0){
		filtrar = function (vivienda){
			let precio = Number(vivienda.Precio.replace('$','').replace(',',''));
			return 	( !('maxPrecio' in filtro) || precio <= filtro.maxPrecio  )
					&& ( !('minPrecio' in filtro) || precio >= filtro.minPrecio  ) 
					&& ( !('Ciudad' in filtro) || filtro.Ciudad == vivienda.Ciudad )
					&& ( !('Tipo' in filtro) || filtro.Tipo == vivienda.Tipo )
					;
		};
	} else{ 
		filtrar = function (vivienda){ return true };
	}
	
	miData.seleccionar('viviendas', filtrar).then( (resultado) => {
		res.json(resultado);
	}).catch( (error) => {
		res
			//.sendStatus(500)
			.json(error);
	});
	
});

module.exports = Router;