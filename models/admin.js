'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var adminSchema = Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    role: String
});

module.exports = mongoose.model('Admins', adminSchema);