'use strict'

var express = require('express');
var magazineController = require('../controllers/magazine.controller');
var mdAuth = require('../middleware/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/magazines'});

var api = express.Router();

api.post('/:id/createMagazine', [mdAuth.ensureAuth], magazineController.createMagazine);
api.put('/:id/updateMagazine/:idBM', [mdAuth.ensureAuth], magazineController.updateMagazine);
api.post('/:id/deleteMagazine/:idM', mdAuth.ensureAuth, magazineController.deleteMagazine);
api.get('/listMagazine', magazineController.listMagazine);
api.post('/getMagazine', magazineController.getMagazine);
api.get('/:idM/getMagazine', magazineController.getMagazineById);
api.put('/:id/:idM/uploadImage', [mdAuth.ensureAuth, upload], magazineController.uploadImage);
api.get('/getImageMagazine/:fileName', [upload], magazineController.getImage);

module.exports = api;