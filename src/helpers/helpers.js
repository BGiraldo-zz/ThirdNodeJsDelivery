const hbs = require('hbs');
const funciones = require('./funciones');

hbs.registerHelper('cursospararegistro', () => {
    let cursosDisponibles = funciones.obtenerCursosDisponibles();
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

hbs.registerHelper('veraspirantes', () => {
     return funciones.veraspirantes();
});

hbs.registerHelper('roles', () => {
    let roles = [{nombre: 'Aspirante'}, { nombre: 'Cordinador'}]
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