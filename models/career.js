'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var careerSchema = Schema({
    name: String,
    descripcion: String,
    codigo: String,
    jornada: String
});

module.exports = mongoose.model ('Careers',careerSchema);