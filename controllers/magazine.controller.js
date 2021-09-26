'use strict'

var User = require('../models/user.model');
var Magazine = require('../models/magazine.model');

var fs = require('fs');
var path = require('path');

function createMagazine(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message:'No tienes permiso para agregar revistas'});
    }else{
        if(params.titleMagazine && params.copiesMagazines && params.avaliblesMagazines){
            params.titleMagazine = params.titleMagazine.toLowerCase();
            Magazine.findOne({titleMagazine : params.titleMagazine}, (err, magazineFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar revista con el mismo nombre'});
                }else if(magazineFind){
                    return res.send({message: 'Este revista ya ha sido registrado'});
                }else{
                    let magazine = new Magazine();
                    magazine.authorMagazine = params.authorMagazine;
                    magazine.titleMagazine = params.titleMagazine;
                    magazine.editionMagazine = params.editionMagazine;
                    magazine.descriptionMagazine = params.descriptionMagazine;
                    magazine.themesMagazine = params.themesMagazine;
                    magazine.frecuencyMagazines = params.frecuencyMagazines;
                    magazine.copiesMagazines = params.copiesMagazines;
                    magazine.avaliblesMagazines = params.avaliblesMagazines;
                    magazine.ejemplarMagazine = params.ejemplarMagazine;
                    magazine.loanMagazines = 0;
                    magazine.save((err, magazineSaved) => {
                        if(err){
                            return res.status(400).send({message:'Error general al intentar crear una revista'});
                        }else if(magazineSaved){
                            User.findByIdAndUpdate(userId, {$push:{magazines: magazineSaved._id}}, {new: true}, (err, magazinePush)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al agregar una revista'})
                                }else if(magazinePush){
                                    return res.send({message:'La revista se creo exitosamente', magazineSaved});
                                }else{
                                    return res.status(500).send({message: 'Error al agregar la revista'})
                                }
                            })
                        }else{
                            return res.status(400).send({message:'No sea ha podido crear la revista'});
                        }
                    })
                }
            });
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }

}

function deleteMagazine(req, res){
    var userId = req.params.id;
    var magazineId = req.params.idM;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para eliminar la revista'});
    }else{
        User.findOneAndUpdate({_id: userId},
            {$pull:{magazines: magazineId}}, {new:true}, (err, magazinePull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al eliminar la revista'});
                }else if(magazinePull){
                    Magazine.findByIdAndRemove({_id: magazineId},(err, magazineRemoved) => {
                        if(err){
                            return res.status(500).send({message:'Error al eliminar la revista'});
                        }else if(magazineRemoved){
                            return res.send({message: 'La revista fue eliminada', magazineRemoved});
                        }else{
                            return res.status(404).send({message:'No se pudo eliminar la revista o ya fue eliminada'});
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminar la revista'});
                }
            }
        ).populate('magazines')
    }
}

function updateMagazine(req, res){
    let userId = req.params.id;
    let magazineId = req.params.idM;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para actualizar esta revista'});
    }else{
        if(update.authorMagazine){
            update.authorMagazine = update.authorMagazine.toLowerCase();

            Magazine.findOne({authorMagazine: update.authorMagazine}, (err, magazineFind) => {
                if(err){
                    return res.status(500).send({message:'Error al buscar liga'});
                }else if(magazineFind && magazineFind._id != magazineId){
                    return res.send({message: 'Ya existente una revista con este nombre'})
                }else{
                    Magazine.findOneAndUpdate({_id: magazineId, user:userId}, update, {new: true}, (err, magazineUpdate) => {
                        if(err){
                            return res.status(500).send({message:'Error al actualizar la revista'});
                        }else if(magazineUpdate){
                            return res.status(200).send({message:'Revista actualizada', magazineUpdate});
                        }else{
                            return res.status(404).send({message:'No se pudo actualizar la revista'});
                        }
                    })
                }
            })
        }else{
            Magazine.findOneAndUpdate({_id:magazineId, user: userId}, update, {new: true}, (err, magazineUpdate) => {
                if(err){
                    return res.status(500).send({message:'Error al actualizar la revista'});
                }else if(magazineUpdate){
                    return res.send({message:'Revista actualizada', magazineUpdate});
                }else{
                    return res.status(404).send({message:'No se pudo actualizar la revista que se quiere'});
                }
            })
        }
    }
}

function listMagazine(req, res){
    Magazine.find({}).exec((err, magazineFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al listar revistas'});
        }else if(magazineFind){
            return res.send({message: 'Revistas encontradas', magazineFind});
        }else{
            return res.status(404).send({message:'No se encontraron revistas registradas'});
        }
    })
}

function getMagazine(req, res){
    var params = req.body;

    if(params.search){
        Magazine.find({$or : [{authorMagazine : params.search},
                          {titleMagazine : params.search},
                          {editionMagazine : params.search},
                          {wordsMagazine : params.search},
                          {themesMagazine : params.search}]}, (err,  resultSearch)=>{
            if(err){
                return res.status(500).send({message: 'Error general al obtener las revistas'});
            }else if(resultSearch){
                return res.send({message: 'Revistas encontradas', resultSearch})
            }else{
                return res.status(404).send({message:'No se encontraron coincidencias'});
            }
        });
    }else{
        return res.status(404).send({message:'No se encontraron revistas registradas'});
    }

}

function getMagazineById(req, res){
    var magazineId = req.params.idM;

    if(magazineId){
        Magazine.findById(magazineId, (err,  resultSearch)=>{
            if(err){
                return res.status(500).send({message: 'Error general al obtener la revista'});
            }else if(resultSearch){
                return res.send({message: 'Revista encontrada', resultSearch})
            }else{
                return res.status(404).send({message:'No se encontraron coincidencias'});
            }
        });
    }else{
        return res.status(404).send({message:'No se encontró la revista'});
    }

}

function uploadImage(req, res){
    var userId = req.params.id;
    var magazineId = req.params.idM;
    var fileName;

    if(userId != req.user.sub){
        res.status(401).send({message:'No tienes permisos'});
    }else{
        if(req.files.imageMagazine){
            
            var filePath = req.files.imageMagazine.path;

            var fileSplit = filePath.split('\\');

            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if( fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                League.findOneAndUpdate({_id:magazineId, user: userId}, {imageMagazine: fileName}, {new: true}, (err, magazineUpdate) => {
                    if(err){
                        res.status(500).send({message:'Error general al subir la imagen'});
                    }else if(magazineUpdate){
                        res.send({magazine: magazineUpdate, imageMagazine: magazineUpdate.imageMagazine});
                    }else{
                        res.status(401).send({message:'No se ha podido actualizar la imagen de portada de la revista'});
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
    var pathFile = './uploads/magazine/' + fileName;

    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message:'Imagen inexistente'})
        }
    })
}

module.exports = {
    createMagazine,
    deleteMagazine,
    updateMagazine,
    listMagazine,
    getMagazine,
    getMagazineById,
    uploadImage,
    getImage,
}