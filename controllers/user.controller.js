'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs'); 
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

function adminInit(req, res){
    let admin = new User();

    admin.username = 'adminpractica';
    admin.password = 'adminpractica';
    admin.rol = 'admin';

    User.findOne({username: admin.username}, (err, adminFind) => {
        if(err){
            console.log('Error al crear al admin')
        }else if(adminFind){
            console.log('administrador ya creado');
        }else{
            bcrypt.hash(admin.password, null, null, (err, passwordHash) => {
                if(err){
                    return res.status(500).send({message:'Error al encriptar la contraseña'});
                }else if(passwordHash){
                    admin.password = passwordHash;
                    admin.save((err, adminSaved) => {
                        if(err){
                            console.log('Error al crear el admin');
                        }else if(adminSaved){
                            console.log('Usuario creado exitosamente');
                        }else{
                            console.log('Usuario no creado, error al crear usuario');
                        }
                    })
                }else{
                    return res.status(401).send({message:'Password no encriptada'});
                }
            })            
        }
    })
}

function signUp(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.lastname && params.username && params.phone && params.email && params.password){
        User.findOne({username: params.username}, (err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar al usuario'});
            }else if(userFind){
                return res.send({message:'Nombre de usuario ya existente, por favor elije otro'});
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                    if(err){
                        return res.status(500).send({message:'Error al encriptar la contraseña'});
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username.toLowerCase();
                        user.rol = "USER";
                        user.phone = params.phone; 
                        user.email = params.email;
                        user.loans = 0;

                        user.save((err, userSaved) => {
                            if(err){
                                return res.status(500).send({message:'Error al intentar guardar'});
                            }else if(userSaved){
                                return res.send({message:'Te has registrado con exito', userSaved});
                            }else{
                                return res.status(401).send({message:'No se guardo el usuario'});
                            }
                        })
                    }else{
                        return res.status(401).send({message:'Password no encriptada'});
                    }
                })
            }
        })
    }else{
        return res.send({message:'Ingresa todos los parametros minimos'});
    }
}

function login(req, res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username}, (err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar usuario'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, equalsPassword) => {
                    if(err){
                        return res.status(500).send({message:'Error al comparar contraseñas'});
                    }else if(equalsPassword){
                            if(params.gettoken){
                            return res.send({ token: jwt.createToken(userFind), user: userFind});
                        }else{
                            return res.send({message:'Usuario logeado'});
                        }
                    }else{
                        return res.status(404).send({message:'No hay coincidencias en la password'});
                    }
                })
            }else{
                return res.status(404).send({message:'Usuario no encontrado'});
            }
        })
    }else{
        return res.status(404).send({message:'Por favor llena los campos obligatorios'});
    }
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para actualizar esta cuenta'});
    }else{
        if(update.password){
            return res.status(404).send({message:'No se puede actualizar la password'});
        }else{
            if(update.rol){
                return res.status(404).send({message: 'No puedes actualizar el rol'});
            }else if(update.username){
                update.username = update.username.toLowerCase();
                User.findOne({username: update.username.toLowerCase()}, (err, userFind) => {
                    if(err){
                        return res.status(500).send({message:'Error al buscar usuario'});
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(userUpdated){
                                    return res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                }
                            })
                        }else{
                            return res.send({message: 'Nombre de usuario ya en uso'});
                        }
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
                            if(err){
                                return res.status(500).send({message:'Error al intentar actualizar'});
                            }else if(userUpdated){
                                return res.send({message:'Usuario actualizado', userUpdated});
                            }else{
                                return res.status(500).send({message:'No se puede actualizar'});
                            }
                        });                
                    }
                })
            }else{
                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
                    if(err){
                        return res.status(500).send({message:'Error al intentar actualizar'});
                    }else if(userUpdated){
                        return res.send({message:'Usuario actualizado', userUpdated});
                    }else{
                        return res.status(500).send({message:'No se puede actualizar'});
                    }
                })
            }
        }
    }        
}

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message:'No tienes permiso para eliminar'});
    }else{
        User.findOne({_id: userId}, (err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar usuario'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPas) => {
                    if(err){
                        return res.status(500).send({message:'Error al buscar password, no olvides colocar la contraseña'});
                    }else if(checkPas){
                        User.findByIdAndRemove(userId, (err, userRemoved) => {
                            if(err){
                                return res.status(500).send({message:'Error al buscar usuario'});
                            }else if(userRemoved){
                                return res.send({message: 'Usuario eliminado', userRemoved});
                            }else{
                                return res.status(404).send({message:'No se pudo eliminar al usuario o ya fue eliminado'});
                            }
                        })
                    }else{
                        return res.status(500).send({message:'Password incorrecta'});
                    }
                })
            }else{
                return res.status(404).send({message:'El usuario no existe'});
            }
        })        
    }
}

function uploadImage(req, res){
    var userId = req.params.id;
    var update = req.body;
    var fileName;

    if(userId != req.user.sub){
        res.status(401).send({message:'No tienes permisos'});
    }else{
        if(req.files){
            
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if( fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, userUpdate) => {
                    if(err){
                        res.status(500).send({message:'Error general en imagen'});
                    }else if(userUpdate){
                        res.send({user: userUpdate, userImage: userUpdate.image});
                    }else{
                        res.status(401).send({message:'No se ha podido actualizar'});
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
    var pathFile = './uploads/users/' + fileName;

    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message:'Imagen inexistente'})
        }
    })
}

function creatUser_ByAdmin(req, res){
    var userId = req.params.id;
    var user = new User();
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para realizar esta accion'});
    }else{
        if(params.name && params.username && params.email && params.password && params.rol){
            User.findOne({username: params.username}, (err, userFind) => {
                if(err){
                    return res.status(500).send({message:'Error al buscar al usuario'});
                }else if(userFind){
                    return res.send({message:'Nombre de usuario ya existente, por favor elije otro'});
                }else{
                    bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                        if(err){
                            return res.status(500).send({message:'Error al encriptar la contraseña'});
                        }else if(passwordHash){
                            
                            user.password = passwordHash;
                            user.name = params.name;
                            user.lastname = params.lastname;
                            user.username = params.username.toLowerCase();
                            user.rol = params.rol;
                            user.phone = params.phone; 
                            user.email = params.email;
                            user.loans = 0;

                            user.save((err, userSaved) => {
                                if(err){
                                    return res.status(500).send({message:'Error al intentar guardar'});
                                }else if(userSaved){
                                    let x = ("Se ha creado exitosamente el usuario con rol: "+ user.rol);
                                    return res.send({message: x, userSaved});
                                }else{
                                    return res.status(401).send({message:'No se guardo el usuario'});
                                }
                            })
                        }else{
                            return res.status(401).send({message:'Password no encriptada'});
                        }
                    })
                }
            })
        }else{
            return res.send({message:'Ingresa todos los parametros minimos'});
        }
    }
}

function listUser(req, res){
    User.find({rol: "USER"}).exec((err, usersFind) => {
        if(err){
            return res.status(500).send({message:'Error al buscar usuarios'});
        }else if(usersFind){
            return res.send({message:'Usuarios encontrados', users: usersFind});   
        }else{
            return res.status(404).send({message:'No se encontraron usuarios'});
        }
    })
}

function validOptionsOfAdmin(req, res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username}, (err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar usuario'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, equalsPassword) => {
                    if(err){
                        return res.status(500).send({message:'Error al comparar contraseñas'});
                    }else if(equalsPassword){
                        let x = true;
                        return res.send({message:'Opciones avanzadas disponibles',x});                        
                    }else{
                        let x = false;
                        return res.status(404).send({message:'No hay coincidencias en la password, opciones avanzadas no disponibles',x});
                    }
                })
            }else{
                return res.status(404).send({message:'Usuario no encontrado'});
            }
        })
    }else{
        return res.status(404).send({message:'Por favor llena los campos obligatorios'});
    }
}

function EditUser_ByAdmin(req, res){
    let userIdAdmin = req.params.idA;
    let userId = req.params.id;
    let update = req.body;

    if(userIdAdmin != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para realizar esta acción'});
    }else{
        if(update.password){
            return res.status(404).send({message:'No se puede actualizar la password'});
        }else{
            if(update.rol){
                return res.status(404).send({message: 'No puedes actualizar el rol'});
            }else if(update.username){
                update.username = update.username.toLowerCase();
                User.findOne({username: update.username.toLowerCase()}, (err, userFind) => {
                    if(err){
                        return res.status(500).send({message:'Error al buscar usuario'});
                    }else if(userFind){
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'});
                            }else if(userUpdated){
                                return res.send({message: 'Usuario actualizado', userUpdated});
                            }else{
                                return res.send({message: 'No se pudo actualizar al usuario'});
                            }
                        })
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
                            if(err){
                                return res.status(500).send({message:'Error al intentar actualizar'});
                            }else if(userUpdated){
                                return res.send({message:'Usuario actualizado', userUpdated});
                            }else{
                                return res.status(500).send({message:'No se puede actualizar'});
                            }
                        });                
                    }
                })
            }else{
                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
                    if(err){
                        return res.status(500).send({message:'Error al intentar actualizar'});
                    }else if(userUpdated){
                        return res.send({message:'Usuario actualizado', userUpdated});
                    }else{
                        return res.status(500).send({message:'No se puede actualizar'});
                    }
                })
            }
        }
    } 
}

function DeleteUser_ByAdmin(req, res){
    let userIdAdmin = req.params.idA;
    let userId = req.params.id;
    let params = req.body;

    if(userIdAdmin != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para realizar esta acción'});
    }else{
        User.findOne({_id: userId}, (err, userFind) => {
            if(err){
                return res.status(500).send({message:'Error al buscar usuario'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPas) => {
                    if(err){
                        return res.status(500).send({message:'Error al buscar password, no olvides colocar la contraseña'});
                    }else if(checkPas){
                        User.findByIdAndRemove(userId, (err, userRemoved) => {
                            if(err){
                                return res.status(500).send({message:'Error al buscar usuario'});
                            }else if(userRemoved){
                                return res.send({message: 'Usuario eliminado', userRemoved});
                            }else{
                                return res.status(404).send({message:'No se pudo eliminar al usuario o ya fue eliminado'});
                            }
                        })
                    }else{
                        return res.status(500).send({message:'Password incorrecta, escribe la password del usuario'});
                    }
                })
            }else{
                return res.status(404).send({message:'El usuario no existe'});
            }
        })
    }
}

module.exports = {
    adminInit,
    signUp,
    login,
    updateUser,
    removeUser,
    uploadImage,
    getImage,
    creatUser_ByAdmin,
    listUser,
    validOptionsOfAdmin,
    EditUser_ByAdmin,
    DeleteUser_ByAdmin
}