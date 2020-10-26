const express = require('express');
const catalogoRouter = express.Router();
const sqlite = require('sqlite3');

const db = new sqlite.Database('./BoinaEditorialLibros3.sqlite');

catalogoRouter.param('librosId', (req, res, next, librosId) => {
    const sql = 'SELECT * FROM Libros WHERE Libros.id = $librosId';
    const values = {$librosId: librosId};
    db.get(sql, values, (err, libros) => {
        if(err) {
            next(err);
        } else if (libros) {
            req.libros = libros;
            next();
        } else {
            res.sendStatus(404);
        }
    })
});

//getting all
catalogoRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Libros', (err, libros) => {
        if(err) {
            next(err);
        } else {
            res.status(200).json({libros: libros});
        }
    });
});

//gettting one
catalogoRouter.get('/:librosId', (req, res, next) => {
    res.status(200).json({libros: req.libros});
});

//getting tapas
/*catalogoRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM Libros WHERE Libros.tapa = $librosTapa';
    const values = {$librosTapa: req.params.libros.tapa};
    const cover = document.getElementById('tapas');
    db.get(sql, values, (err, tapas) => {
        if(err) {
            next(err);
        } else if (tapas) {
            req.libros.tapa = tapas;
            next();
        } else {
            res.sendStatus(404);
        }
    });
    cover.src = res.status(200).json({libros: req.libros.tapas});
});*/

//creating one
catalogoRouter.post('/', (req, res, next) => {
    const codigo = req.body.libros.codigo;
    const titulo = req.body.libros.titulo;
    const tapa = req.body.libros.tapa;
    const descripcion = req.body.libros.descripcion;
    const autor = req.body.libros.autor;
    const tipo = req.body.libros.tipo;
    const tamaño = req.body.libros.tamaño;
    const precio = req.body.libros.precio;
    const stock = req.body.libros.stock;
    if (!codigo || !titulo || !tapa || !descripcion || !autor || !tipo || !tamaño || !precio || !stock) {
       return res.sendStatus(400); 
    }

    const sql = "INSERT INTO Libros (codigo, titulo, tapa, descripcion, autor, tipo, tamaño, " +
    "precio, stock) VALUES ($codigo, $titulo, $tapa, $descripcion, $autor, $tipo, $tamaño, $precio, $stock)";
    const values = {
        $codigo: codigo,
        $titulo: titulo,
        $tapa: tapa,
        $descripcion: descripcion,
        $autor: autor,
        $tipo: tipo,
        $tamaño: tamaño,
        $precio: precio,
        $stock: stock
    };

    db.run(sql, values, function(error) {
        console.log('decime que anda al menos');
        console.log(this.lastID);
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Libros WHERE Libros.id = ${this.lastID}`, 
            (error, libros) => {
                res.status(201).json({libros: libros});
            });
        }
    });
});

//updating one
catalogoRouter.patch('/:librosId', (req, res) => {
    const codigo = req.body.libros.codigo;
    const titulo = req.body.libros.titulo;
    const tapa = req.body.libros.tapa;
    const descripcion = req.body.libros.descripcion;
    const autor = req.body.libros.autor;
    const tipo = req.body.libros.tipo;
    const tamaño = req.body.libros.tamaño;
    const precio = req.body.libros.precio;
    const stock = req.body.libros.stock;
    if (!codigo || !titulo || !tapa || !descripcion || !autor || !tipo || !tamaño || !precio || !stock) {
        return res.sendStatus(400); 
     };

     const sql = 'UPDATE Libros SET codigo = $codigo, titulo = $titulo, tapa = $tapa, descripcion = $descripcion, ' +
     'autor = $autor, tipo = $tipo, tamaño = $tamaño, precio = $precio, stock = $stock WHERE ' +
     'Libros.id = $librosId';
     const values = {
        $codigo: codigo,
        $titulo: titulo,
        $tapa: tapa,
        $descripcion: descripcion,
        $autor: autor,
        $tipo: tipo,
        $tamaño: tamaño,
        $precio: precio,
        $stock: stock,
        $librosId: req.params.id
     };
     db.run(sql, values, (error) => {
         if(error) {
             next(error);
         } else {
             db.get(`SELECT * FROM Libros WHERE Libros.id = ${req.params.id}`,
             (error, libros) => {
                res.status(200).json({libros: libros});
             })
         }
     })
});

//deleting one
catalogoRouter.delete('/:librosId', (req, res) => {
    const sql = "DELETE FROM Libros WHERE Libros.id = $librosId";
    const values = {$librosId: req.params.id};
    db.run(sql, values, (error) => {
        if(error) {
            next(error);
        } else {
            res.sendStatus(204);
        }
    });
});

module.exports = catalogoRouter;