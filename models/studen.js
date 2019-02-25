'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudenSchema = Schema({
    name: String,
    lastname: String,
    career: String,
    identity: Number,
    role: String,
    teacher: {type: Schema.ObjectId, ref: 'Teachers'},
    career: {type: Schema.ObjectId, ref: 'Careers'}
});
module.exports = mongoose.model('Studens', StudenSchema);