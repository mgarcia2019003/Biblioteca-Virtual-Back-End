'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = Schema({
    authorBook: String,
    titleBook: String,
    editionBook: String,
    wordsBook: [],
    descriptionBook: String,
    themesBook: String,
    copiesBooks: Number,
    avaliblesBooks: Number
});

module.exports = mongoose.model('book', bookSchema);