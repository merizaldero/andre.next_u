const	http 		= require('http'),
		express		= require('express'),
		bodyParser 	= require('body-parser'),
		loginApi	= require('./loginApi'),
		calendarioApi	= require('./calendarioApi'),
		sessionData = require('express-session'),
		mongoose	= require('mongoose');
		
const puerto	= process.env.PORT || 3000,
	  app		= express(),
	  Server	= http.createServer(app),
	  mongoUri 	= process.env.MONGO_URI || 'mongodb://localhost:27017/calendario';

mongoose.connect(mongoUri, (errorConexion) => {
	if(errorConexion){
		console.log('Error en conexion a ' + mongoUri + ' : '+ errorConexion.toString() );
	} else {
		console.log('Conexion a ' + mongoUri + ' : establecida ' );
	}
} );

app.use(sessionData({
	secret:'secret cat',
	resave:false,
	saveUninitialized: true,
	cookie: { 
		//secure: true 
		}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended : true} ));

app.use('/events', calendarioApi);
app.use('/login', loginApi);
app.use(express.static("client"));

/*
app.use(function (err, req, res, next) {
	  console.error(err.stack);
	  res.status(404).render('404.ejs');
	});
*/

Server.listen(puerto , () => { console.log("Servidor esta corriendo en puerto " + puerto) });