'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacherSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    career: String,
    password: String,
    role: String,
    
})

module.exports = mongoose.model('Teachers', teacherSchema);