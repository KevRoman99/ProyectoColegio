'use strict';
var express = require('express');
var teacherController = require('../controlles/teacherController');
var md_auth = require('../middlewares/authenticatedTeacher');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './uploads/activitys'});
var api = express.Router();

api.post('/login', teacherController.loginTeacher);
api.get('/reportStudent/:id', md_auth.ensureAut,teacherController.reportStuent);
api.post('/activityAdd/:id', [md_auth.ensureAut, md_upload], teacherController.activityAdd);
api.post('/updload-doc/:id/:ide',[md_auth.ensureAut, md_upload], teacherController.uploadDoc);
api.put('/editActivity/:id/:ide', md_auth.ensureAut, teacherController.updateActivity);
api.put('/deleteActivity/:id/:ide', md_auth.ensureAut, teacherController.deleteActivity);

module.exports = api;