'use strict'

var User = require('../models/user.model');
var Magazine = require('../models/magazine.model');
var Book = require('../models/book.model');
var Loan = require('../models/loan.model');

var fs = require('fs');
var path = require('path');

function createLoan(req, res){
    var userId = req.params.id;
    var bookId = req.params.idB;
    var magazineId = req.params.idM;
    let update = req.body;
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{  
        if(idB == bookId){
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
                            if(book.avaliblesBooks>0){
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
                            }else{
                                return res.send({message: 'No hay copias disponibles'});
                            }
                        }
                    })                
                }else{
                    return res.status(404).send({message:'No se encontro el prestamo deseada'});
                }
            });
        }else if(idM == magazineId){

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
                            if(magazine.avaliblesMagazines>0){
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
                                                        book.avaliblesMagazines = book.avaliblesMagazines - 1;
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
                            }else{
                                return res.send({message: 'No hay copias disponibles'});
                            }
                        }
                    })                
                }else{
                    return res.status(404).send({message:'No se encontro el prestamo deseada'});
                }
            });

        }
    }
}

function deleteLoan(req, res){
    
    var userId = req.params.userId;
    var teamId = req.params.teamId;
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        if(params.password){
            User.findById(userId, (err, userFind) => {
                if(err){
                    return res.status(500).send({message:'Error al buscar equipo'});
                }else if(userFind){
                    League.findOne({_id: leagueId}, (err, leagueFind) => {
                        if(err){
                            return res.status(500).send({message:'Error al buscar la liga'});
                        }else if(leagueFind){
                            bcrypt.compare(params.password, userFind.password, (err, equalsPassword) => {
                                if(err){
                                    return res.status(500).send({message:'Error al comparar contraseñas'});
                                }else if(equalsPassword){
                                    League.findByIdAndUpdate({_id: leagueId, teams: teamId}, {$pull:{teams : teamId}}, {new: true}, (err, leagueUpdated)=>{
                                        if(err){
                                            return res.status(500).send({message:'Error general al actualizar la liga'});
                                        }else if(leagueUpdated){
                                            Team.findByIdAndRemove({_id: teamId}, (err, teamRemoved) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error al eliminar el equipo'});
                                                }else if(teamRemoved){
                                                    return res.send({message: 'El equipo fue eliminado', teamRemoved});
                                                }else{
                                                    return res.status(404).send({message:'No se pudo eliminar el equipo ya fue eliminado'});
                                                }
                                            })
                                        }else{
                                            return res.status(404).send({message:'No se pudo eliminar el equipo de la liga'});
                                        }
                                    })
                                    
                                }else{
                                    return res.status(404).send({message:'No hay coincidencias en la password'});
                                }
                            })
                        }else{
                            return res.status(404).send({message:'Tu password es incorrecta'});
                        }
                    })
                }else{
                    return res.status(404).send({message:'No se encontro el equipo'});
                }
            })                        
        }else{
            return res.status(400).send({message:'No olvides colocar tu password de administrador'});
        }
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
    createLoan,
    deleteLoan,
    listLoan,
}