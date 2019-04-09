const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//### Para usar las variables de sesión
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

require('./config/config');

// registra el directorio publico
const directoriopublico = path.join(__dirname, '../public');
app.use(express.static(directoriopublico));

//bootstrap config
const dirNode_modules = path.join(__dirname , '../node_modules')
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// memorystore
//### Para usar las variables de sesión
app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}))

// Middleware
app.use((req, res, next) =>{
	//En caso de usar variables de sesión
	if(req.session.usuario){		
		res.locals.sesion = true;
		if(req.session.usuario.tipo === 'Cordinador') res.locals.rol = true;
	}
	next()
})

//Routes
app.use(require('./routes/index'));

// Mongoose
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(error)
	}
	console.log("conectado")
});

app.listen(process.env.PORT, () => {
	console.log ('servidor en el puerto ' + process.env.PORT)
});