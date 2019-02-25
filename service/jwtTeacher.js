'use strict';

//Node JS CORS

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_del_proyecto';

exports.createToken = function(teacher){
    var playload = {
        sub: teacher._id,
        name: teacher.name,
        surname: teacher.lastname,
        career: teacher.career,
        role: teacher.role,
        iat: moment().unix(),
        exp: moment().add(30,'day').unix
    }
    return jwt.encode(playload,secret);
}