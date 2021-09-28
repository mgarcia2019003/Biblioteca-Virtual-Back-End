'use strict'

var User = require('../models/user.model');
var Book = require('../models/book.model');

var fs = require('fs');
var path = require('path');

function createBook(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message:'No tienes permiso para agregar libros'});
    }else{
        if(params.titleBook && params.copiesBooks && params.avaliblesBooks){
            Book.findOne({titleBook : params.titleBook}, (err, bookFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar libro con el mismo nombre'});
                }else if(bookFind){
                    return res.send({message: 'Este libro ya ha sido registrado'});
                }else{
                    let book = new Book();
                    book.authorBook = params.authorBook;
                    book.titleBook = params.titleBook;
                    book.descriptionBook = params.descriptionBook;
                    book.themesBook = params.themesBook;
                    book.copiesBooks = params.copiesBooks;
                    book.avaliblesBooks = params.avaliblesBooks;
                    book.loanBooks = 0;
                    book.save((err, bookSaved) => {
                        if(err){
                            return res.status(400).send({message:'Error general al intentar crear un libro'});
                        }else if(bookSaved){
                            User.findByIdAndUpdate(userId, {$push:{books: bookSaved._id}}, {new: true}, (err, bookPush)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al agregar un libro'})
                                }else if(bookPush){
                                    return res.send({message:'El libro se creo exitosamente', bookSaved});
                                }else{
                                    return res.status(500).send({message: 'Error al agregar el libro'})
                                }
                            })
                        }else{
                            return res.status(400).send({message:'No sea ha podido crear el libro'});
                        }
                    })
                }
            });
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }

}

function deleteBook(req, res){
    var userId = req.params.id;
    var bookId = req.params.idB;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para eliminar el libro'});
    }else{
        User.findOneAndUpdate({_id: userId},
            {$pull:{books: bookId}}, {new:true}, (err, bookPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al eliminar el libro'});
                }else if(bookPull){
                    Book.findByIdAndRemove({_id: bookId},(err, bookRemoved) => {
                        if(err){
                            return res.status(500).send({message:'Error al eliminar el libro'});
                        }else if(bookRemoved){
                            return res.send({message: 'El libro fue eliminada', bookRemoved});
                        }else{
                            return res.status(404).send({message:'No se pudo eliminar el libro o ya fue eliminada'});
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminar el libro'});
                }
            }
        ).populate('books')
    }
}

function updateBook(req, res){
    let userId = req.params.id;
    let bookId = req.params.idB;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para actualizar este libro'});
    }else{
        if(update.authorBook){
            update.authorBook = update.authorBook;

            Book.findOne({authorBook: update.authorBook}, (err, bookFind) => {
                if(err){
                    return res.status(500).send({message:'Error al buscar liga'});
                }else if(bookFind && bookFind._id != bookId){
                    return res.send({message: 'Ya existente un libro con este nombre'})
                }else{
                    Book.findOneAndUpdate({_id: bookId, user:userId}, update, {new: true}, (err, bookUpdate) => {
                        if(err){
                            return res.status(500).send({message:'Error al actualizar el libro'});
                        }else if(bookUpdate){
                            return res.status(200).send({message:'Libro actualizado', bookUpdate});
                        }else{
                            return res.status(404).send({message:'No se pudo actualizar el libro'});
                        }
                    })
                }
            })
        }else{
            Book.findOneAndUpdate({_id: bookId, user: userId}, update, {new: true}, (err, bookUpdate) => {
                if(err){
                    return res.status(500).send({message:'Error al actualizar el libro'});
                }else if(bookUpdate){
                    return res.send({message:'Libro actualizado', bookUpdate});
                }else{
                    return res.status(404).send({message:'No se pudo actualizar el libro que se quiere'});
                }
            })
        }
    }
}

function listBook(req, res){
    Book.find({}).exec((err, bookFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al listar libros'});
        }else if(bookFind){
            return res.send({message: 'Libros encontrados',books: bookFind});
        }else{
            return res.status(404).send({message:'No se encontraron libros registrados'});
        }
    })
}

function getBook(req, res){
    var params = req.body;

    if(params.search){
        Book.find({$or : [{authorBook : params.search},
                          {titleBook : params.search},
                          {editionBook : params.search},
                          {wordsBook : params.search},
                          {themesBook : params.search}]}, (err,  resultSearch)=>{
            if(err){
                return res.status(500).send({message: 'Error general al obtener los lirbos'});
            }else if(resultSearch){
                return res.send({message: 'Libros encontrados', resultSearch})
            }else{
                return res.status(404).send({message:'No se encontraron coincidencias'});
            }
        });
    }else{
        return res.status(404).send({message:'No se encontraron libros registrados'});
    }

}

function getBookById(req, res){
    var bookId = req.params.idB;

    if(bookId){
        Book.findById(bookId, (err,  resultSearch)=>{
            if(err){
                return res.status(500).send({message: 'Error general al obtener el libro'});
            }else if(resultSearch){
                return res.send({message: 'Libro encontrado', resultSearch})
            }else{
                return res.status(404).send({message:'No se encontraron coincidencias'});
            }
        });
    }else{
        return res.status(404).send({message:'No se encontró el libro'});
    }

}


function uploadImage(req, res){
    var userId = req.params.id;
    var bookId = req.params.idB;
    var fileName;

    if(userId != req.user.sub){
        res.status(401).send({message:'No tienes permisos'});
    }else{
        if(req.files.imageBook){
            
            var filePath = req.files.imageBook.path;

            var fileSplit = filePath.split('\\');

            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if( fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                League.findOneAndUpdate({_id:bookId, user: userId}, {imageBook: fileName}, {new: true}, (err, bookUpdate) => {
                    if(err){
                        res.status(500).send({message:'Error general al subir la imagen'});
                    }else if(bookUpdate){
                        res.send({book: bookUpdate, imageBook: bookUpdate.imageBook});
                    }else{
                        res.status(401).send({message:'No se ha podido actualizar la imagen de portada del libro'});
                    }
                });
            }else{
                fs.unlink(filePath, (err) =>{
                    if(err){
                        res.status(500).send({message:'Extension no valida y error al eliminar el archivo'});
                    }else{
                        res.send({message:'Extension no valida'});
                    }
                })
            }
        }else{
            res.status(404).send({message:'No has enviado una imagen a subir'});
        }
    }
}

function getImage(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/books/' + fileName;

    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message:'Imagen inexistente'})
        }
    })
}


function sortBook(req, res){
    var orden = Number;

    Book.find({}).exec((err, bookFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al listar libros'});
        }else if(bookFind){
            return res.send({message: 'Libros encontrados', bookFind});
        }else{
            return res.status(404).send({message:'No se encontraron libros registrados'});
        }
    })

}

module.exports = {
    createBook,
    deleteBook,
    updateBook,
    listBook,
    getBook,
    getBookById,
    uploadImage,
    getImage,
    sortBook
}