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
    let update = req.body;
    var params = req.body;

        if(userId && bookId){
            Loan.findOne({user : userId, bookLoan : bookId}, (err, loanFind)=>{
                if(err){
                    return res.status(400).send({message:'Error general al buscar el prestamo'});
                }else if(loanFind){
                    return res.send({message: 'ALERTA: ¡Ya has rentado este libro!'});
                }else{
                    let loan = new Loan();
                    loan.user = userId;
                    loan.bookLoan = bookId;
                    loan.save((err, loanSaved)=>{
                        if(err){
                            return res.status(400).send({message:'Error general al guardar el prestamo'});
                        }else if(loanSaved){
                            Book.findByIdAndUpdate(bookId, {$push:{loans: loanSaved._id}}, {new: true}, (err, loanPush)=>{
                                if(err){
                                    return res.status(400).send({message:'Error general al guardar el prestamo en el libro'});
                                }else if(loanPush){
                                    /*loanInBook();
                                    loanInUser();*/
                                    Book.findOne({authorBook: update.authorBook}, (err, bookFind) => {
                                        if(err){
                                            return res.status(500).send({message:'Error al buscar libro'});
                                        }else if(bookFind && bookFind._id != bookId){
                                            return res.send({message: 'Ya existente un libro con este nombre'})
                                        }else{
                                            Book.findOneAndUpdate({_id: bookId, user:userId}, update, {new: true}, (err, bookUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error al actualizar el libro'});
                                                }else if(bookUpdate){
                                                    bookUpdate.bookLoan = parseInt(bookUpdate.bookLoan) + 1;
                                                    bookUpdate.avaliblesBooks = parseInt(bookUpdate.avaliblesBooks) - 1;
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar el libro'});
                                                }
                                            })
                                        }
                                    })

                                    /*
                                    User.findOne({name: update.name}, (err, userFind) => {
                                        if(err){
                                            return res.status(500).send({message:'Error al buscar usuario'});
                                        }else if(userFind && userFind._id != userId){
                                            return res.send({message: 'Ya existente un usuario con este nombre'})
                                        }else{
                                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error general al actualizar'});
                                                }else if(userUpdated){
                                                    userUpdated.loans =  userUpdated.loans + 1;
                                                }else{
                                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                                }
                                            })
                                        }
                                    })*/
                                    
                                    return res.send({message:'El prestamo se guardo satisfactoriamente', loanPush});
                                }else{
                                    console.log(topicPush)
                                    return res.send({message: 'No se pudo guardar el prestamo en el libro'});
                                }
                            })
                        }else{
                            return res.send({message: 'No se pudo guardar el prestamo'});
                        }
                    });
                }
            });
    }
}


function createMagazineLoan(req, res){
    var userId = req.params.id;
    var magazineId = req.params.idM;
    let update = req.body;
    var params = req.body;

        if(userId && magazineId){
            Loan.findOne({user : userId, magazineLoan : magazineId}, (err, loanFind)=>{
                if(err){
                    return res.status(400).send({message:'Error general al buscar el prestamo'});
                }else if(loanFind){
                    return res.send({message: 'ALERTA: ¡Ya has rentado este libro!'});
                }else{
                    let loan = new Loan();
                    loan.user = userId;
                    loan.magazineLoan = magazineId;
                    loan.save((err, loanSaved)=>{
                        if(err){
                            return res.status(400).send({message:'Error general al guardar el prestamo'});
                        }else if(loanSaved){
                            Magazine.findByIdAndUpdate(magazineId, {$push:{loans: loanSaved._id}}, {new: true}, (err, loanPush)=>{
                                if(err){
                                    return res.status(400).send({message:'Error general al guardar el prestamo en la revista'});
                                }else if(loanPush){

                                    Magazine.findOne({authorMagazine: update.authorMagazine}, (err, magazineFind) => {
                                        if(err){
                                            return res.status(500).send({message:'Error al buscar revista'});
                                        }else if(magazineFind && magazineFind._id != magazineId){
                                            return res.send({message: 'Ya existente un libro con este nombre'})
                                        }else{
                                            Magazine.findOneAndUpdate({_id: magazineId, user:userId}, update, {new: true}, (err, magazineUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error al actualizar la revista'});
                                                }else if(magazineUpdate){
                                                    magazineUpdate.magazineLoan = parseInt(magazineUpdate.magazineLoan) + 1;
                                                    magazineUpdate.avaliblesMagazines = parseInt(magazineUpdate.avaliblesMagazines) - 1;
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar la revista'});
                                                }
                                            })
                                        }
                                    })

                                    /*
                                    User.findOne({name: update.name}, (err, userFind) => {
                                        if(err){
                                            return res.status(500).send({message:'Error al buscar usuario'});
                                        }else if(userFind && userFind._id != userId){
                                            return res.send({message: 'Ya existente un usuario con este nombre'})
                                        }else{
                                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error general al actualizar'});
                                                }else if(userUpdated){
                                                    userUpdated.loans =  userUpdated.loans + 1;
                                                }else{
                                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                                }
                                            })
                                        }
                                    })*/
                                    
                                    return res.send({message:'El prestamo se guardo satisfactoriamente', loanPush});
                                }else{
                                    console.log(topicPush)
                                    return res.send({message: 'No se pudo guardar el prestamo en el libro'});
                                }
                            })
                        }else{
                            return res.send({message: 'No se pudo guardar el prestamo'});
                        }
                    });
                }
            });
    }
}


function deleteBookLoan(req, res){
    var userId = req.params.id;
    var bookId = req.params.idB;
    var loanId = req.params.idL;
    var params =  req.body;

        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message:'Error general al buscar el usuario'});
            }else if (userFind){
                Book.findOne({_id : bookId, user: userId}, (err, bookFind)=>{
                    if(err){
                        return res.status(500).send({message:'Error general al buscar el libro'});
                    }else if(bookFind){
                        Book.findOneAndUpdate({_id : bookId}, {$pull: {loans: loanId}}, {new : true}, (err, bookUpdated)=>{
                            if(err){
                                return res.status(500).send({message:'Error general al actualizar el usuario'});
                            }else if(bookUpdated){
                                Loan.findByIdAndDelete(loanId, (err, loanDelete)=>{
                                    if(err){
                                        return res.status(500).send({message:'Error general al eliminar el prestamo'});
                                    }else if(loanDelete){
                                        return res.send({message: 'El prestamo fue eliminado', loanDelete});
                                    }else{
                                        return res.status(404).send({message:'No se pudo eliminar el prestamo'});
                                    }
                                });
                            }else{
                                return res.status(404).send({message:'No se pudo eliminar el libro del administrador'});
                            }
                        })
                    }else{
                        return res.status(400).send({message:'No se pudo eliminar el prestamo del libro'});
                    }
                })
            }else{
                return res.status(404).send({message:'No se pudo encontrar el libro deseado'});
            }
        });
}




function listMyLoans(req, res){
    let userId = req.params.id;

    Loan.find({user: userId}).exec((err, loanFind)=>{
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
    deleteBookLoan,
    listMyLoans
}