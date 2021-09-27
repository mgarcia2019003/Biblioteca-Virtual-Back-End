'use strict'

var User = require('../models/user.model');
var Magazine = require('../models/magazine.model');
var Book = require('../models/book.model');
var Loan = require('../models/loan.model');

var fs = require('fs');
var path = require('path');

function createBookLoan(req, res){
    var userId = req.params.id;
    var bookId = req.params.idB;
    var magazineId = req.params.idM;
    let update = req.body;
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
            Book.findOne({_id: bookId, user: userId}, (err, bookFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar el libro'});
                }else if(bookFind){   
                    Loan.findOne((err, loanFind)=>{
                        if(err){
                            return res.status(400).send({message:'Error general al buscar el prestamo con dicho nombre'});
                        }else if(loanFind){
                            return res.send({message: 'El prestamo ya fue hecho'});
                        }else{
                                let loan = new Loan();
                                loan.user = userId;
                                loan.bookLoan = bookId;
                                loan.date = Date();
                                loan.save((err, loanSaved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al guardar el prestamo'});
                                    }else if(loanSaved){
                                        Book.findByIdAndUpdate(bookId, {$push:{loans: loanSaved._id}}, {new: true}).populate('loan').exec((err, loanPush)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general al agregar el prestamo a los libros'})
                                            }else if(loanPush){


                                                Book.findOneAndUpdate({_id: bookId, user:userId}, update, {new: true}, (err, bookUpdate) => {
                                                    if(err){
                                                        return res.status(500).send({message:'Error al actualizar el libro'});
                                                    }else if(bookUpdate){
                                                        book.avaliblesBooks = book.avaliblesBooks - 1;
                                                        book.loanBooks = book.loanBooks + 1;
                                                        return res.status(200).send({message:'Libro actualizado', bookUpdate});
                                                    }else{
                                                        return res.status(404).send({message:'No se pudo actualizar el libro'});
                                                    }
                                                })
                                                return res.send({message: 'El prestamo se guardo satisfactoriamente', loanPush});

                                            }else{
                                                return res.status(500).send({message: 'Error al agregar el prestamo a los libros'})
                                            }
                                        })
                                    }else{
                                        return res.send({message: 'No se pudo agregar el prestamo con exito'});
                                    }
                                })
                        }
                    })                
                }else{
                    return res.status(404).send({message:'No se encontro el prestamo deseada'});
                }
            });
    }
}

function createMagazineLoan(req, res){
    var userId = req.params.id;
    var magazineId = req.params.idM;
    let update = req.body;
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
            Magazine.findOne({_id: magazineId, user: userId}, (err, magazineFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar la revista'});
                }else if(magazineFind){   
                    Loan.findOne((err, loanFind)=>{
                        if(err){
                            return res.status(400).send({message:'Error general al buscar el prestamo con dicho nombre'});
                        }else if(loanFind){
                            return res.send({message: 'El prestamo ya fue hecho'});
                        }else{
                                let loan = new Loan();
                                loan.user = userId;
                                loan.magazineLoan = magazineId;
                                loan.date = Date();
                                loan.save((err, loanSaved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al guardar el prestamo'});
                                    }else if(loanSaved){
                                        Magazine.findByIdAndUpdate(magazineId, {$push:{loans: loanSaved._id}}, {new: true}).populate('loan').exec((err, loanPush)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general al agregar el prestamo a las revistas'})
                                            }else if(loanPush){


                                                Magazine.findOneAndUpdate({_id: magazineId, user:userId}, update, {new: true}, (err, magazineUpdate) => {
                                                    if(err){
                                                        return res.status(500).send({message:'Error al actualizar la revista'});
                                                    }else if(magazineUpdate){
                                                        magazine.avaliblesMagazines = magazine.avaliblesMagazines - 1;
                                                        magazine.loanMagazines = magazine.loanMagazines + 1;
                                                        return res.status(200).send({message:'Revista actualizada', magazineUpdate});
                                                    }else{
                                                        return res.status(404).send({message:'No se pudo actualizar la revista'});
                                                    }
                                                })
                                                return res.send({message: 'El prestamo se guardo satisfactoriamente', loanPush});

                                            }else{
                                                return res.status(500).send({message: 'Error al agregar el prestamo a las revistas'})
                                            }
                                        })
                                    }else{
                                        return res.send({message: 'No se pudo agregar el prestamo con exito'});
                                    }
                                })
                        }
                    })                
                }else{
                    return res.status(404).send({message:'No se encontro el prestamo deseada'});
                }
            });
    }
}


function listLoan(req, res){
    Loan.find({}).exec((err, loanFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al listar prestamos'});
        }else if(loanFind){
            return res.send({message: 'Prestamos encontrados', loanFind});
        }else{
            return res.status(404).send({message:'No se encontraron prestamos registrados'});
        }
    })
}

module.exports = {
    createBookLoan,
    createMagazineLoan,
    listLoan,
}