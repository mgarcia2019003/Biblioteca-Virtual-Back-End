'use strict'

var express = require('express');
var loanController = require('../controllers/loan.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createLoanBook/:idB', [mdAuth.ensureAuth], loanController.createLoan);
api.post('/:id/createLoanMagazine/:idM', [mdAuth.ensureAuth], loanController.createLoan);
api.post('/:id/deleteLoanBook/:idB', mdAuth.ensureAuth, loanController.deleteLoan);
api.post('/:id/deleteLoanMagazine/:idM', mdAuth.ensureAuth, loanController.deleteLoan);
api.get('/listLoan', loanController.listLoan);

module.exports = api;