const express = require('express')
const app = express()
const path = require('path');
const hbs = require ('hbs')
const bcrypt = require('bcrypt');

/*
const session = require('express-session')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
*/
require('./../helpers/helpers')
const funciones = require('./../helpers/funciones')

const directorioPartials = path.join(__dirname, '../../template/partials');
const dirViews = path.join(__dirname, '../../template/views')

// Schemas
const Curso = require('./../models/curso');
const Usuario = require('./../models/usuario');

// hbs
// registra los partials
hbs.registerPartials(directorioPartials);
//trae el motor del hbs
app.set('view engine', 'hbs');
// cambia el directorio de views por defecto
app.set('views', path.join(dirViews));

// ---------------------------------------------------------- Requests

//default
app.get('/', (req, res) => {
    res.render('index');
});

// --------------------------------------------------------  Coordinador

// cordinador request
app.get('/cordinador', (req, res) => {
    res.render('cordinador', {
        selectcursos: funciones.selectCursos(),
        cursos: funciones.listarCursos()
    });
});

app.post('/registrarcurso', (req, res) => {
    let curso = new Curso ({
        id: parseInt(req.body.id),
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        modalidad: req.body.modalidad,
        intensidad: parseInt(req.body.intensidad) | 0,
        estado: 'Disponible'
    })
    curso.save((err, resultado) => {
		if (err){
			return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>${err}</div>`});	
		}		
		return res.render('mensaje', { mensaje: `<div class="alert alert-success" role="alert">Registro Exitoso</div>`});		
	})
});

app.post('/cerrarcurso', (req, res) => {
    let respuesta = funciones.cerrarCurso(parseInt(req.body.cursoid));
    res.render('mensaje', {  mensaje: respuesta });
});

app.post('/desinscribir', (req, res) => {
    let cursoid = parseInt(req.body.cursoid);
    let aspiranteid =  parseInt(req.body.aspiranteid);
    let respuesta = funciones.desinscribir(cursoid, aspiranteid);
    res.render('mensaje', {  mensaje: respuesta });
});

// --------------------------------------------------------  Interesado

// Interesado request
app.get('/interesado', (req, res) => {
    res.render('interesado', {
        cursos: funciones.listarCursosDisponibles()
    });
});

// --------------------------------------------------------  Aspirante

// Aspirante request
app.get('/aspirante', (req, res) => {
    res.render('aspirante');
});

// Aspirante request
app.post('/registrarseacurso', (req, res) => {
    let registro = {
        cursoid: req.body.cursoid,
        id: req.body.id,
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono
    }
    let respuesta = funciones.registrarseCurso(registro);
    res.render('mensaje', { mensaje: respuesta});
});

// --------------------------------------------------------  Usuario

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.post('/registrarse', (req, res) => {
    let usuario = new Usuario ({
        id: req.body.id,
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        usuario: req.body.usuario,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10),
        tipo: req.body.rol
    })

	usuario.save((err, resultado) => {
		if (err){
			return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>${err}</div>`});	
		}		
		return res.render('mensaje', { mensaje: `<div class="alert alert-success" role="alert">Registro Exitoso</div>`});		
	})
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/ingresar', (req, res) => {	
    
	Usuario.findOne({usuario : req.body.usuario}, (err, resultados) => {
		if (err){
			return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>${err}</div>`});
		}
		if(!resultados){
			return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>Usuario no encontrado</div>`});
		}
		if(!bcrypt.compareSync(req.body.contrasena, resultados.contrasena)){
			return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>Contraseña Incorrecta</div>`});
        }	

         //Para crear las variables de sesión
            req.session.usuario = resultados
            let role = false;
            if(req.session.usuario.tipo === 'Cordinador') role = true;
            
			res.render('index', { sesion: true, rol: role });
	})	
})

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
  		if (err) return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>${err}</div>`});	
	})	
	res.redirect('/')	
})

// Error request
app.get('*', (req, res) => {
    res.render('error');
});

module.exports = app