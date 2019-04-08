const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const cursoSchema = new Schema({
	id : {
		type : Number,
		required : true
	},
	nombre :{
		type : String,
		required : true
	},
	descripcion : {
		type : String,
		required : true	
	},
	valor : {
        type: Number,
        required : true,
		default: 0		
	},
	modalidad : {
        type: String,
		default: ''					
	},
	intensidad : {
        type: String,
		default: ''					
	},
	estado : {
        type: String,
		default: 'Disponible'					
	}
});

cursoSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso