'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    identificador: String,
    name: String,
    lastname: String,
    username: String,
    rol: String,
    email: String,
    password: String,
    image: String,
    loans: Number
});

module.exports = mongoose.model('user', userSchema);