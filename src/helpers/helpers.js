const hbs = require('hbs');
const funciones = require('./funciones');

hbs.registerHelper('cursospararegistro', (cursosDisponibles) => {
        texto = `
         <div class="form-group">
             <label for="cursoselect">Curso</label>
                <select class="form-control" id="cursoselect" name="cursoid">`
            cursosDisponibles.forEach(curso => {
            texto = texto + `<option value="${curso.id}">${curso.nombre} - ID: ${curso.id}</option>`
        });
        texto = texto + `
                </select>
            </div>`
        return texto;
});

hbs.registerHelper('veraspirantes', (cursos, aspirantes) => {
     return funciones.veraspirantes(cursos, aspirantes);
});

hbs.registerHelper('roles', () => {
    let roles = [{nombre: ''}, {nombre: 'Aspirante'}, { nombre: 'Cordinador'}]
        texto = `
         <div class="form-group">
             <label for="roleselect">Rol</label>
                <select class="form-control" id="roleselect" name="rol">`
            roles.forEach(role => {
            texto = texto + `<option value="${role.nombre}">${role.nombre}</option>`
        });
        texto = texto + `
                </select>
            </div>`
        return texto;
});

hbs.registerHelper('listarCursos', (cursos) => {
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
    cursos.forEach(curso => {
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
});


hbs.registerHelper('selectCursos', (cursos) => {
    let cursosDisponibles = cursos.filter(curso => curso.estado != 'Cerrado');
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
});


hbs.registerHelper('listarCursosDisponibles', (cursosDisponibles) => {
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
});