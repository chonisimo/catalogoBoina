const express = require('express');
const app = express();
const sqlite = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const path = require('path');

const db = new sqlite.Database('./BoinaEditorialLibros3.sqlite');

db.all("SELECT * FROM Libros", (error, rows) => {
    if(error) {
        console.error(error);
    } else {
        console.log('Conectado a la Database');
    }
});

app.set('views', path.join(__dirname, 'views')); //use `npm install ejs --save` y `npm install path --save` para que esto funcione.
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(cors());

app.use(express.json());

const catalogoRouter = require('./routes/catalogo');
app.use('/catalogo', catalogoRouter);

app.use(errorhandler());

app.get('/', (req, res, next) => {
    res.render('index');
    next();
})

//const covers = () => {}

app.listen(4000, () => console.log('servidor andando'));

module.exports = app;