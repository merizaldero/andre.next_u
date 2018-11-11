const	http 		= require('http'),
		express		= require('express'),
		bodyParser 	= require('body-parser'),
		miApi 		= require('./buscadorApi');
		
const puerto	= process.env.PORT || 3000,
	  app		= express(),
	  Server	= http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended : true} ));

app.use('/api', miApi);
app.use(express.static("public"));

Server.listen(puerto , () => { console.log("Servidor esta corriendo en puerto " + puerto) });