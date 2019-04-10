const express = require('express')
const app = express()
const path = require('path');
const hbs = require('hbs')
const bcrypt = require('bcrypt');

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

    if (!req.session.usuario) return res.render('login');

    if(req.session.usuario.tipo === 'Aspirante') return res.render('index');

    Curso.find({}, (err, respuesta1) => {
        if (err) {
            return console.log(err)
        }
        Curso.find({ estado: 'Disponible' }, (err, respuesta2) => {
            if (err) {
                return console.log(err)
            }
            Usuario.find({ tipo: 'Aspirante' }, (err, respuesta3) => {
                if (err) {
                    return console.log(err)
                }
                res.render('cordinador', {
                    cursos: respuesta1,
                    cursosV: respuesta2,
                    aspirantesV: respuesta3
                });
            });
        });
    });
});

app.post('/registrarcurso', (req, res) => {
    let curso = new Curso({
        id: parseInt(req.body.id),
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        modalidad: req.body.modalidad,
        intensidad: parseInt(req.body.intensidad) | 0,
        estado: 'Disponible'
    })
    curso.save((err, resultado) => {
        if (err) {
            return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>${err}</div>` });
        }
        return res.render('mensaje', { mensaje: `<div class="alert alert-success" role="alert">Registro Exitoso</div>` });
    })
});

app.post('/cerrarcurso', (req, res) => {
    Curso.updateOne({ id: req.body.cursoid }, { estado: 'Cerrado' }, (err, curso) => {
        if (err) {
            return console.log(err)
        }

        if (!curso) {
            return res.redirect('/')
        }

        return res.render('mensaje', { mensaje: `<div class="alert alert-success" role="alert">Curso Cerrado correctamente</div>` });

    });

});

app.post('/desinscribir', (req, res) => {
    let cursoid = parseInt(req.body.cursoid);
    let aspiranteid = parseInt(req.body.aspiranteid);

    Usuario.findOne({ id: aspiranteid }, (err, respuesta) => {
        if (err) {
            return console.log(err)
        }

        var aspiCursos = respuesta.cursos.filter(curid => curid != cursoid);

        Usuario.updateOne({ id: respuesta.id }, { cursos: aspiCursos }, (err, respuesta1) => {
            if (err) {
                return console.log(err)
            }
            return res.render('mensaje', { mensaje: `<div class="alert alert-success" role="alert">Aspirante desinscrito del curso</div>` });
        });
    });
});

// --------------------------------------------------------  Interesado

// Interesado request
app.get('/interesado', (req, res) => {
    Curso.find({ estado: 'Disponible' }, (err, respuesta) => {
        if (err) {
            return console.log(err)
        }
        res.render('interesado', {
            cursos: respuesta
        });
    });
});

// --------------------------------------------------------  Aspirante

// Aspirante request
app.get('/aspirante', (req, res) => {

    if (!req.session.usuario) return res.render('login');
    if(req.session.usuario.tipo === 'Cordinador') return res.render('index');
    Curso.find({ estado: 'Disponible', id: { $nin: req.session.usuario.cursos } }, (err, respuesta1) => {
        if (err) {
            return console.log(err)
        }
        Curso.find({ estado: 'Disponible', id: { $in: req.session.usuario.cursos } }, (err, respuesta2) => {
            if (err) {
                return console.log(err)
            }
            return res.render('aspirante', { cursos: respuesta1, cursosRegistrado: respuesta2 });
        });

    });
});

// Aspirante request
app.post('/registrarseacurso', (req, res) => {

    var listaCursos = req.session.usuario.cursos;
    listaCursos.push(req.body.cursoid);

    Usuario.updateOne({ id: req.session.usuario.id }, { cursos: listaCursos }, (err, respuesta) => {
        if (err) {
            return console.log(err)
        }

        return res.render('mensaje', { mensaje: `<div class="alert alert-success" role="alert">Registrado al curso correctamente</div>` });

    });
});

// --------------------------------------------------------  Usuario

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.post('/registrarse', (req, res) => {

    if (req.body.rol) var role = req.body.rol

    let usuario = new Usuario({
        id: req.body.id,
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        usuario: req.body.usuario,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10),
        tipo: role
    })

    usuario.save((err, resultado) => {
        if (err) {
            return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>${err}</div>` });
        }
        return res.render('mensaje', { mensaje: `<div class="alert alert-success" role="alert">Registro Exitoso</div>` });
    })
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/ingresar', (req, res) => {

    Usuario.findOne({ usuario: req.body.usuario }, (err, resultados) => {
        if (err) {
            return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>${err}</div>` });
        }
        if (!resultados) {
            return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>Usuario no encontrado</div>` });
        }
        if (!bcrypt.compareSync(req.body.contrasena, resultados.contrasena)) {
            return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>Contraseña Incorrecta</div>` });
        }

        //Para crear las variables de sesión
        req.session.usuario = resultados
        let role = false;
        if (req.session.usuario.tipo === 'Cordinador') role = true;

        res.render('index', { sesion: true, rol: role, nombre: req.session.usuario.nombre });
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.render('mensaje', { mensaje: `<div class='alert alert-danger' role='alert'>${err}</div>` });
    })
    res.redirect('/login')
})

// Error request
app.get('*', (req, res) => {
    res.render('error');
});

module.exports = app