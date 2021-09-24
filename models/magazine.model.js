'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var magazineSchema = Schema({
    authorMagazine: String,
    titleMagazine: String,
    editionMagazine: String,
    descriptionMagazine: String,
    frecuencyMagazine: String,
    ejemplarMagazine: Number,
    themesMagazine: String,
    wordsMagazine: [],
    copiesMagazines: Number,
    avaliblesMagazines: Number,
    cover: String,
    loanMagazines: Number
});

module.exports = mongoose.model('magazine', magazineSchema);