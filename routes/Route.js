'use strict';

var express = require('express');
var adminController = require('../controlles/adminController');
var multiparty = require('connect-multiparty');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

api.get('/Prueba', adminController.prueba);
api.post('/saveAdmin', adminController.saveAdmin);
api.post('/login',adminController.loginAdmin);
api.post('/saveStudent/:id', md_auth.ensureAut, adminController.saveStudent);
api.get('/listar/:id',md_auth.ensureAut,adminController.listStudend);
api.put('/editAlum/:id/:ide', md_auth.ensureAut,adminController.editStudent);
api.put('/deleteStudent/:id/:ide', md_auth.ensureAut, adminController.deleteStudent);
api.post('/saveTeacher/:id', md_auth.ensureAut,adminController.saveTeacher);
api.put('/editTeacher/:id/:ide', md_auth.ensureAut, adminController.editTeacher);
api.put('/deleteTeacher/:id/:ide', md_auth.ensureAut, adminController.deleteTeacher);
api.post('/saveCareer/:id', md_auth.ensureAut, adminController.saveCareer);
api.put('/editCareer/:id/:ide',md_auth.ensureAut, adminController.updateCareer);
api.put('/deleteCareer/:id/:ide', md_auth.ensureAut, adminController.deleteCareer);
api.get('/reportTeacher/:id', md_auth.ensureAut, adminController.reportTeacher);
api.get('/reportStudent/:id', md_auth.ensureAut, adminController.reportStudent);
api.get('/reportTeacher-Student/:id',md_auth.ensureAut, adminController.reportTeacherStudent);


module.exports = api; 