'use strict'

var express = require('express');
var loanController = require('../controllers/loan.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createBookLoan/:idB', loanController.createBookLoan);
/*api.post('/:id/createMagazineLoan/:idM', loanController.createMagazineLoan);
api.get('/listLoan', loanController.listLoan);*/

module.exports = api;