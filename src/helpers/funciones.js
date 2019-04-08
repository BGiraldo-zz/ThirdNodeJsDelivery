const fs = require('fs');
const path = require('path');
listaDeCursos = [];
listaDeAspirantes = [];

const directorioData = path.join(__dirname, '../data');

const guardarCursos = () => {
    fs.writeFile(directorioData + '/cursos.json', JSON.stringify(listaDeCursos), (err) => {
        if (err) throw (err);
    });
}

const guardarAspirantes = () => {
    fs.writeFile(directorioData + '/aspirantes.json', JSON.stringify(listaDeAspirantes), (err) => {
        if (err) throw (err);
    });
}

const cargarCursos = () => {
    try {
        listaDeCursos = require(directorioData + '/cursos.json');
    } catch (error) {
        listaDeCursos = [];
    }
}

const cargarAspirantes = () => {
    try {
        listaDeAspirantes = require(directorioData + '/aspirantes.json');
    } catch (error) {
        listaDeAspirantes = [];
    }
}

const buscarCurso = (cursoid) => {
    cargarCursos();
    return listaDeCursos.find(curso => curso.id == cursoid);
}

const registrarCurso = (curso) => {
    cargarCursos();
    let duplicado = listaDeCursos.find(cur => cur.id == curso.id);
    if (!duplicado) {
        listaDeCursos.push(curso);
        guardarCursos();
        return `<div class="alert alert-success" role="alert">ha sido registrado el curso</div>`;
    } else {
        return `<div class='alert alert-danger' role='alert'>\
         Ya existe un curso registrado con el id ${curso.id} \
         </div>`;
    }
}

const listarCursos = () => {
    cargarCursos();
    texto = `<table class="table">
    <thead class="thead-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th> 
          <th>Descripcion</th>
          <th>Valor</th>
          <th>Modalidad</th>
          <th>Intensidad</th>
          <th>Estado</th>
        </tr>
    </thead>`
    listaDeCursos.forEach(curso => {
        texto = texto + `
        <tr>
            <td>${curso.id}</td>
            <td>${curso.nombre}</td> 
            <td>${curso.descripcion}</td>
            <td>${curso.valor}</td>
            <td>${curso.modalidad}</td>
            <td>${curso.intensidad}</td>
            <td>${curso.estado}</td>
        </tr>`
    });
    texto = texto + `</table>`
    return texto;
}

const verAspirantes = (cursoid) => {
    cargarCursos();
}

const selectCursos = () => {
    cargarCursos();
    let cursosDisponibles = listaDeCursos.filter(curso => curso.estado != 'Cerrado');
    texto = `<form action="/cerrarcurso" method="POST">
     <div class="form-group">
         <label for="cursoselect">Curso</label>
            <select class="form-control" id="cursoselect" name="cursoid">`
    cursosDisponibles.forEach(curso => {
        texto = texto + `<option value="${curso.id}">${curso.nombre} - ID: ${curso.id}</option>`
    });
    texto = texto + `
            </select>
        </div>
        <button class="btn btn-primary" type="submit">Cerrar Curso</button>
    </form>`
    return texto;
}

const cerrarCurso = (cursoid) => {
    cargarCursos();
    let curso = buscarCurso(cursoid);
    if (curso) {
        curso.estado = 'Cerrado';
        guardarCursos();
        return `<div class="alert alert-success" role="alert">ha sido cerrado el curso</div>`;
    } else {
        return `<div class='alert alert-danger' role='alert'>No existe el curso con id ${cursoid}</div>`;
    }
}

const listarCursosDisponibles = () => {
    cargarCursos();
    let cursosDisponibles = listaDeCursos.filter(curso => curso.estado != 'Cerrado');
    texto = `<div style="margin-left: 50px; display:flex; flex-flow:row wrap; justify-content: space-around;">`
    i = 0;
    cursosDisponibles.forEach(curso => {
        texto = texto + `
        <p>
            <button class="btn btn-primary" type="button" data-toggle="collapse" 
            data-target="#collap${i}" aria-expanded="false" aria-controls="#collap${i}">
              <p>Nombre: ${curso.nombre}</p>
              <p>Descripción: ${curso.descripcion}</p>
              <p>Valor: ${curso.valor} COP</p>
            </button>
        </p>
        <div class="collapse" id="collap${i}">
            <p>Descripción: ${curso.descripcion}</p>
            <p>Modalidad: ${curso.modalidad}</p>
            <p>Intensidad Horaria: ${curso.intensidad} Horas</p>
        </div>`
        i = i + 1;
    });
    texto = texto + `</div>`
    return texto;
}

const obtenerCursosDisponibles = () => {
    cargarCursos();
    return listaDeCursos.filter(curso => curso.estado != 'Cerrado');
}

const validarCurso = (cursoid) => {
    let curso = listaDeCursos.find(c => c.id == cursoid);
    if(curso) return true;
    return false;
}

const registrarseCurso = (registro) => {
    cargarAspirantes();
    let existeCurso = validarCurso(registro.cursoid);
    if(existeCurso){
        let aspiranteCursoDuplicado = listaDeAspirantes.find(aspc => aspc.cursoid == registro.cursoid &
            aspc.id == registro.id);
        if (!aspiranteCursoDuplicado) {
            listaDeAspirantes.push(registro);
            guardarAspirantes();
            return `<div class="alert alert-success" role="alert">ha sido registrado adecuadamente</div>`;
        } else {
            return `<div class='alert alert-danger' role='alert'>
             Ya existe un aspirante con identificador ${registro.id} registrado al curso 
             </div>`;
        }
    }else{
        return `<div class='alert alert-danger' role='alert'>
                No se encuentra el curso al que desea registrarse
             </div>`;
    }
}

const obtenerAspirantesCurso = (cursoid) => {
    cargarAspirantes();
    let aspirantesEnCurso = listaDeAspirantes.filter(aspc => aspc.cursoid == cursoid);
    tablaAspirantes = `
    <table class="table">
    <thead class="thead-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th> 
          <th>Email</th>
          <th>Telefono</th>
          <th>Quitar</th>
        </tr>
    </thead>`
    var x = 0;
    aspirantesEnCurso.forEach(aspc => {
        tablaAspirantes = tablaAspirantes + `
        <tr>
            <td>${aspc.id}</td>
            <td>${aspc.nombre}</td> 
            <td>${aspc.email}</td>
            <td>${aspc.telefono}</td>
            <td>
            <form action="/desinscribir" method="POST">
                    <input type="number" style="display:none;visibility:hidden;" name="cursoid" value="${cursoid}"></input>
                    <input type="number" style="display:none;visibility:hidden;" name="aspiranteid" value="${aspc.id}"></input>
                    <input type="number" style="display:none;visibility:hidden;" name="pos" value="${x}"></input>
                    <button type="submit" class="btn btn-danger">Eliminar</button>
             </form>
            </td>
        </tr>`
        x += 1
    });
    tablaAspirantes = tablaAspirantes + `</table>`
    return tablaAspirantes;
}

const veraspirantes = () => {
    cargarCursos();
    let cursosDisponibles = listaDeCursos.filter(curso => curso.estado != 'Cerrado');
    htmlCursoAspirantes = `<div style="margin-left: 50px; display:flex; flex-flow:row wrap; justify-content: space-around;">`
    i = 0;
    cursosDisponibles.forEach(curso => {
        let aspirantesEnCurso = obtenerAspirantesCurso(curso.id);
        htmlCursoAspirantes = htmlCursoAspirantes + `
        <p>
            <button class="btn btn-primary" type="button" data-toggle="collapse" 
            data-target="#colla${i}" aria-expanded="false" aria-controls="#colla${i}">
              <p>${curso.nombre} ID:${curso.id}</p>
            </button>
        </p>
        <div class="collapse" id="colla${i}">` +
            aspirantesEnCurso +
            `</div>`
        i = i + 1;
    });

    htmlCursoAspirantes = htmlCursoAspirantes + `</div>`
    return htmlCursoAspirantes;
}

const desinscribir = (cursoid, aspiranteid) => {
    cargarAspirantes();
    for (let i = 0; i < listaDeAspirantes.length; i++) {
        let aspc = listaDeAspirantes[i];
        if (aspc.cursoid == cursoid & aspc.id == aspiranteid) {
            listaDeAspirantes.splice(i, 1);
            guardarAspirantes();
            return `<div class="alert alert-success" role="alert">el aspirante ha sido desinscrito del curso</div>`;
        }
    }
    
}

module.exports = {
    registrarCurso,
    listarCursos,
    selectCursos,
    cerrarCurso,
    listarCursosDisponibles,
    obtenerCursosDisponibles,
    registrarseCurso,
    veraspirantes,
    desinscribir
}