'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = Schema({
    author: String,
    title: String,
    edition: String,
    words: [],
    description: String,
    themes: String,
    copies: Number,
    avalibles: Number
});

module.exports = mongoose.model('book', bookSchema);