'use strict'

var express = require('express');
var Usercontroller = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users'});

// Los middlewares los pasamos como segundo  parametro dentro de la ruta donde lo queremos usar.
api.get('/probando-controlador', md_auth.ensureAuth, Usercontroller.pruebas);
api.post('/register', Usercontroller.saveUser);
api.post('/login', Usercontroller.loginUser);
api.put('/updated-user/:id', md_auth.ensureAuth, Usercontroller.updatedUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], Usercontroller.uploadImage);
api.get('/get-image-user/:imageFile', Usercontroller.getImageFile);

module.exports = api;
