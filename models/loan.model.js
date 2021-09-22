'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var loanSchema = Schema({
    user: {type: Schema.ObjectId, ref: "user"},
    bookLoan: {type: Schema.ObjectId, ref: "book"},
    magazineLoan: {type: Schema.ObjectId, ref: "magazine"},
    date: Date,
});

module.exports = mongoose.model('loan', loanSchema);