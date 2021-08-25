'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'bibliotecaDigital-v1@';

exports.createToken = (user) =>{
    var payload = {
        sub: user._id,
        identificador: user.identificador,
        name: user.name,
        lastname: user.lastname,
        user: user.user,
        email: user.email,
        rol: user.rol,
        iat: moment().unix(),
        exp: moment().add(5, 'hours').unix()
    }
    return jwt.encode(payload, secretKey);
}