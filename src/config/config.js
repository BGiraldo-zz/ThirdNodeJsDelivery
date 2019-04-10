process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/plataforma';
}
else {
	urlDB = 'mongodb+srv://bgiraldox:mysecretpass@nodejsbgiraldocourse-b49pj.mongodb.net/plataforma?retryWrites=true'
}

process.env.URLDB = urlDB