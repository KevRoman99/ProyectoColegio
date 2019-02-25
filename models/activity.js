var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = Schema({
    name: String,
    doc: String,
    descripcion: String
});
module.exports = mongoose.model('Activitys', activitySchema);