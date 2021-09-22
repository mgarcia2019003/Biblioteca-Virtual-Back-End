'use strict'

var express = require('express');
var bookController = require('../controllers/book.controller');
var mdAuth = require('../middleware/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/books'});

var api = express.Router();

api.post('/:id/createBook', [mdAuth.ensureAuth], bookController.createBook);
api.put('/:id/updateBook/:idB', [mdAuth.ensureAuth], bookController.updateBook);
api.post('/:id/deleteBook/:idB', mdAuth.ensureAuth, bookController.deleteBook);
api.get('/listBook', bookController.listBook);
api.post('/getBook', bookController.getBook);
api.get('/:idB/getBookId', bookController.getBookById);
api.put('/:id/:idB/uploadImage', [mdAuth.ensureAuth, upload], bookController.uploadImage);
api.get('/getImageBook/:fileName', [upload], bookController.getImage);

module.exports = api;