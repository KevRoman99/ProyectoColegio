'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_del_proyecto';

exports.createToken = function(admin){
    var playload = {
        sub: admin._id,
        name: admin.name,
        lastname: admin.lastname,
        email: admin.email,
        role: admin.role,
        iat: moment().unix(),
        exp: moment().add(30, 'day').unix
    };
    return jwt.encode(playload, secret);
}