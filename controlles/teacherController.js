'user strict';

var Teacher = require('../models/teacher');
var Student = require('../models/studen');
var Activity = require('../models/activity');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../service/jwtTeacher');
var multiparty = require('connect-multiparty');
var fs = require('fs');
var path = require('path');



function loginTeacher(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    Teacher.findOne({email: email.toLowerCase()}, (err, teacher)=>{
        if(err){
            res.status(500).send({message: 'Error al intentar iniciar seccion'});
        }else{
            if(teacher){
                bcrypt.compare(password, teacher.password, (err, check)=>{
                    if(check){
                        if(params.gettoken){
                            res.status(200).send({
                                token: jwt.createToken(teacher)
                            });
                        }else{
                            
                            res.status(404).send({message: 'Bienvenido' ,teacher});
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no ha podido logearse'});
                    }
                });
            }else{
                res.status(404).send({message: 'No se ha encontrado el usuario'});
            }
        }
    });
}
function reportStuent(req,res){
    var teacherId = req.params.id;
    if(teacherId != req.teacher.sub){
        res.status(500).send({message: 'No tienes permisos para generar reportes'});
        
    }else{
     Student.find({teacher: teacherId},function(err,teach){
         if(err){
             res.status(404).send({message: 'Error al listar'});
            }else{
            res.status(200).send({teach});
            //res.send('Teaacher',{teacher: teach})
            }   
        }
     )};
}
function activityAdd(req, res){
    var teacherId = req.params.id;
    var params = req.body;
    var activity = new Activity();
    var file_name = 'Archivo no subido';
    if(teacherId != req.teacher.sub){
        res.status(500).send({message: 'No tienes permiso'});
    }else{
        /*if(req.files){
            var file_path = req.files.doc.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            var ext_explit = file_name.split('\.');
            var file_ext = ext_explit[1];
            if(file_ext == 'txt' || file_ext == 'docx' || file_ext == 'pdf'){*/
                if(params.name && params.descripcion){
                    activity.name = params.name;
                    activity.descripcion = params.descripcion;
        
                    activity.save({doc: file_name},(err, activitySave)=>{
                        if(err){
                            res.status(500).send({message: 'No se ha guardado'});
                        }else{
                            if(!activitySave){
                                res.status(500).send({message: 'Error al guardar'});
                            }else{
                                res.status(200).send({activity: activitySave, doc: file_name});
                            }
                        }
                    });
                }else{
                    res.status(404).send({message: 'Debe introducir los campos requeridos'});
                }
            /*}else{
                fs.unlink(file_path, (err)=>{
                    if(err){
                        res.status(200).send({message: 'Extension no es admitida y archivo no borrado'});
                    }else{
                        res.status(200).send({message: 'Extension no admitida'});
                    }
                });
            }
            /*if(params.name && params.descripcion){
                activity.name = params.name;
                activity.descripcion = params.descripcion;
                activity.doc = null;
    
                activity.save((err, activitySave)=>{
                    if(err){
                        res.status(500).send({message: 'No se ha guardado'});
                    }else{
                        if(!activitySave){
                            res.status(500).send({message: 'Error al guardar'});
                        }else{
                            res.status(200).send({activity: activitySave});
                        }
                    }
                });
            }else{
                res.status(404).send({message: 'Debe introducir los campos requeridos'});
            }
        }else{
            res.status(404).send({message: 'No se han subido archivos'});
        }*/
        
    }
}
function uploadDoc(req,res){
    //res.status(200).send({message: 'Subiendo imagen de teacher'});
    var teacherId = req.params.id;
    var activityId = req.params.ide;
    var file_name = 'Archivo no subido';
    if(req.files){
        var file_path = req.files.doc.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_explit = file_name.split('\.');
        var file_ext = ext_explit[1];

        if(file_ext == 'txt' || file_ext == 'docx' || file_ext == 'pdf' ){
            if(teacherId != req.teacher.sub){
                res.status(500).send({message: 'No tiene permiso para modificar el image'});
            }
            Activity.findByIdAndUpdate(activityId, {doc: file_name}, {new: true}, (err, activityUpdate)=>{
                if(err){
                    res.status(500).send({message: 'Error al acutilizar el usuario'});
                }else{
                    if(!activityUpdate){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({activity: activityUpdate,  doc: file_name});
                    }
                }
            });
        }else{
            //res.status(200).send({message: 'Extension no admitida'});
            fs.unlink(file_path, (err)=>{
                if(err){
                    res.status(200).send({message: 'Extension no es admitida y archivo no borrado'});
                }else{
                    res.status(200).send({message: 'Extension no admitida'});
                }
            })
        }
    }else{
        
        res.status(404).send({message: 'No se han subido archivos'});
    }
}
function updateActivity(req, res){
    var teacherId = req.params.id;
    var activityId = req.params.ide;
    var update = req.body;

    if(teacherId != req.teacher.sub){
        res.status(500).send({message:'No tienes permisos'});
    }else{
        Activity.findByIdAndUpdate(activityId, update,{new: true}, (err,activityUpdate)=>{
            if(err){
                res.status(500).send({message: 'Error al actualizar'});
            }else{
                res.status(200).send({
                    activity: activityUpdate
                });
            }
        });
    }
}
function deleteActivity(req,res){
    var teacherId = req.params.id;
    var activityId = req.params.ide;

    if(teacherId != req.teacher.sub){
        res.status(500).send({message: 'No tienes permisos'});
    }else{
        Activity.findByIdAndDelete(activityId,(err)=>{
            if(err){
                res.status(500).send({message: 'Error al eliminar'});
            }else{
                res.status(200).send({message: 'Actividad fue eliminada'});
            }
        });
    }
}
module.exports = {
    loginTeacher,
    reportStuent,
    activityAdd,
    uploadDoc,
    updateActivity,
    deleteActivity
}