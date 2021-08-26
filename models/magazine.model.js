'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var magazineSchema = Schema({
    author: String,
    title: String,
    edition: String,
    description: String,
    frecuency: String,
    ejemplar: Number,
    themes: String,
    words: [],
    copies: Number,
    avalibles: Number
});

module.exports = mongoose.model('magazine', magazineSchema);