'use strict'

var Admin = require('../models/admin');
var Student = require('../models/studen');
var Teacher = require('../models/teacher');
var Career = require('../models/career');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../service/jwtAdmin');


function saveAdmin(req, res){
    var admin = new  Admin();
    var params = req.body;

    if(params.password && params.name && params.lastname && params.email ){
        admin.name = params.name;
        admin.lastname = params.lastname;
        admin.email = params.email;
        admin.role = 'Role_Admin';
       
        console.log(params);
        
        Admin.findOne({email: admin.email.toLowerCase()}, (err, issetAdmin)=>{
            if(err){
                res.status(500).send({message: 'Error, Ya se ha registrado el correo Electronico'});
            }else{
                if(!issetAdmin){
                    bcrypt.hash(params.password, null, null, function(err, hash){
                        admin.password = hash;
                        
                        admin.save((err, adminStrored)=>{
                            if(err){
                                res.status(500).send({message: 'Error al guardar usuario'});
                            }else{
                                if(!adminStrored){
                                   res.status(404).send({message: 'No se ha podido registrar'})
                                }else{
                                    res.status(200).send({admin: adminStrored});
                                }
                            }
                        });
                    });
                }else{
                    res.status(200).send({message: 'El usuario no puede registrarse'});
                }
            }
        });
    }else{
        res.status(200).send({message: 'Introduce todos los datos'});3
    }

}
function loginAdmin(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    Admin.findOne({email: email.toLowerCase()}, (err, admin)=>{
        if(err){
            res.status(500).send({message: 'Error al intentar iniciar seccion'});
        }else{
            if(admin){
                bcrypt.compare(password, admin.password, (err, check)=>{
                    if(check){
                        if(params.gettoken){
                            res.status(200).send({
                                token: jwt.createToken(admin)
                            });
                        }else{
                            res.status(404).send({admin});
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no pudo Logearse'});
                    }
                });
            }else{
                res.status(404).send({message: 'no se ha encontrado el usuario en la dataBase'});
            }
        }
    });
}
function saveStudent(req, res){
    var student = new Student();
    var adminId = req.params.id;
    var params = req.body;
    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permiso para guardar el estudiante'});
    }else{
        if(params.name && params.lastname && params.career && params.identity){
            student.name = params.name;
            student.lastname = params.lastname;
            student.career = params.career;
            student.identity = params.identity;
            student.role = 'ROLE_STUDENT';
            student.teacher = params.sub;
    
            student.save((err, studentSave)=>{
                if(err){
                    res.status(500).send({message: ' No se ha guardado el estudiante'});
                    console.log(err);
                }else{
                    if(!studentSave){
                        res.status(500).send({message: 'Error al guardar el estudiante'});
                    }else{
                        res.status(200).send({student: studentSave});
    
                    }
                }
            });
        }else{
            res.status(404).send({message: 'Debe introducir todos los campos requeridos'});
        }
    }
    
}
function listStudend(req, res){
    var adminId = req.params.id;
    
    if(adminId != req.admin.sub){
        res.status(500).send({
            message: 'No tienes permiso para listar los Alumnos'
        });
    }else{
        Student.find({},(err,students)=>{
            if(err){
                res.status(500).send({message: 'no se ha podido listar los alumnos'});
                console.log(err);
            }else{
                res.status(200).send({students});
            }
        }); 
    } 
}
function editStudent(req, res){
    var adminId = req.params.id;
    var studentId = req.params.ide;
    var update = req.body;
    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permiso para editar el Alumno'});
    }else{
        Student.findByIdAndUpdate(studentId,update, {new: true}, (err, StudentUpdate)=>{
            if(err){
                res.status(500).send({message: 'Error a actualizar el alumno'});
                console.log(err);
            }else{
                if(!StudentUpdate){
                    res.status(404).send({message: 'No se ha podido actualizar el alumno'});
                    console.log(StudentUpdate);
                }else{
                    res.status(200).send({
                        student: StudentUpdate
                    });
                }
            }
        });
    }
}
function deleteStudent(req,res){
    var adminId = req.params.id;
    var studenId = req.params.ide;

    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permiso para eliminar el Estudiente'});
    }else{
        Student.findByIdAndDelete(studenId,(err)=>{
            if(err){
                res.status(500).send({message: 'Error al eliminar el estudiante'});
            }else{
                res.status(200).send({message: 'Estudiante eliminado de la base de datos'});
            }
        });
    }
    
}
function saveTeacher(req,res){
        var teacher = new Teacher();
        var params = req.body;
        var adminId = req.params.id;
        if(adminId != req.admin.sub){
            res.status(500).send({message: 'No tienes permiso para guardar el Profesor'});
        }else{
            if(params.name && params.lastname && params.email && params.password){
                teacher.name = params.name;
                teacher.lastname = params.lastname;
                teacher.email = params.email;
                teacher.career = params.career;
                teacher.role = 'ROLE_TEACHER';

                Teacher.findOne({email: teacher.email.toLowerCase()}, (err, issetTeacher)=>{
                    if(err){
                        res.status(500).send({message: 'Error, el correo ya ha sido registrado'});
                    }else{
                        if(!issetTeacher){
                            bcrypt.hash(params.password, null, null, function(err, hash){
                                teacher.password = hash;

                                teacher.save((err, teacherStored)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error al guardar el profesor'});
                                    }else{
                                        if(!teacherStored){
                                            res.status(404).send({message: 'No se ha podido registrar el Profesor'});
                                        }else{
                                            res.status(200).send({teacher: teacherStored});
                                        }
                                    }
                                });
                            });
                        }else{
                            res.status(200).send({message: 'El profesor no puede registrarse'});
                        }
                    }
                });
            }else{
                res.status(404).send({message: 'Debes de introducir todos los campos'});
            }
        }
}
function editTeacher(req, res){
    var adminId = req.params.id;
    var teacherId = req.params.ide;
    var update = req.body;
    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permiso para editar el Profesor!!'});
    }else{
        Teacher.findByIdAndUpdate(teacherId,update,{new: true}, (err, editTeacher)=>{
            if(err){
                res.status(500).send({message: 'Erro al Actualizar'});
            }else{
                if(!editTeacher){
                    res.status(404).send({message: 'No se ha podido actualizar'});
                }else{
                    res.status(200).send({ 
                        teacher: editTeacher
                    });
                }
            }
        });
    }
}
function deleteTeacher(req, res){
    var adminId = req.params.id;
    var teacherId = req.params.ide;

    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permiso para eliminar el Profesor'});
    }else{

        Teacher.findByIdAndDelete(teacherId,(err)=>{
            if(err){
                res.status(500).send({message: 'Error al eliminar el profesor'});
            }else{
                res.status(200).send({message: ' El profesor fue eliminado'});
            }
        });
    }
}
function saveCareer(req, res){
    var adminId = req.params.id;
    var params = req.body;
    var career = new Career();

    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tines permiso para realizar estas acciones'});
    }else{
        if(params.name && params.descripcion && params.codigo && params.jornada){
            var jornada = params.jornada
            career.name = params.name;
                career.descripcion = params.descripcion;
                career.codigo = params.codigo;
                career.jornada = params.jornada;
            if(career.jornada == 'Matutina' || career.jornada == 'Vespertina'){
                career.save((err, careerSave)=>{
                    if(err){
                        res.status(500).send({message: 'No se ha podido guardar lo solicitado'});
                    }else{
                        if(!careerSave){
                            res.status(500).send({message: 'No se ha guardado'});
                        }else{
                            res.status(200).send({career: careerSave});
                        }
                    }
                });
            }else{
                res.status(404).send({message: 'Las jornada tiene que ser Matutina o Vespertina'});
            }
        }else{
            res.status(404).send({message: 'Debes de llenar todos los campos'});
        }
    }
}
function updateCareer(req,res){
    var adminId = req.params.id;
    var careerId = req.params.ide;
    var update = req.body;

    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permio para editar la carrera'});
    }else{
        /*if(update.jornada != 'Matutina' || update.jornada != 'Vespertina'){
            res.status(404).send({message: 'Las jornadas son Matutina o Vespertina'});
        }else{  */
            Career.findByIdAndUpdate(careerId, update,{new: true}, (err, editCareer)=>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar'});
                }else{
                    if(!editCareer){
                        res.status(404).send({message: 'No se ha podido actualizar'});
                    }else{
                        res.status(200).send({career: editCareer});
                    }
                }
            });
        //}
        
    }
}
function deleteCareer(req,res){
    var adminId = req.params.id;
    var careerId = req.params.ide;
    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permiso para eleminar'});
    }else{
        Career.findByIdAndDelete(careerId,(err)=>{
            if(err){
                res.status(404).send({message: 'Error al eliminar'});
            }else{
                res.status(200).send({message: 'Carrera eliminado de la base de datos'});
            }
        })
    }
}
function reportTeacher(req, res){
    var adminId = req.params.id;

    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permisos para generar reportes'});
    }else{
        Teacher.find({},(err, teacher)=>{
            if(err){
                res.status(500).send({message: 'Error al listar'});
            }else{
                res.status(200).send({teacher});
            }
        });
    }
}
function reportStudent(req,res){
    var adminId = req.params.id;
    
    if(adminId != req.admin.sub){
        res.status(500).send({message:'No tienes permisos para generar reportes'});
    }else{
        Student.find({},(err, stundent)=>{
            if(err){
                res.status(404).send({message: 'Error al listar'});
            }else{
                res.status(200).send({stundent});
            }
        });
    }
}
function reportTeacherStudent(req,res){
    var params = req.body;
    var adminId = req.params.id;
    var teacher = params.teacher;
    if(adminId != req.admin.sub){
        res.status(500).send({message: 'No tienes permisos para generar reportes'});
    }else{
        if(params.teacher){
            //if(teacher == Stundent.teacher){
                Student.find({teacher},(err,teach)=>{
                    if(err){
                        res.status(404).send({message: 'Error al listar'});
                    }else{
                        res.status(200).send({teach});
                    }
                })
           // }else{
              //  console.log('Error');
           // }
           
        }else{
            res.status(500).send({message: 'Debes de llenar todos los campos'});
        }
    }
}
function prueba(req,res){
    res.status(200).send({message: 'Probando el controlador'});
}

module.exports = {
    prueba,
    saveAdmin,
    loginAdmin,
    saveStudent,
    listStudend,
    editStudent,
    deleteStudent,
    saveTeacher,
    editTeacher,
    deleteTeacher,
    saveCareer,
    updateCareer,
    deleteCareer,
    reportTeacher,
    reportStudent,
    reportTeacherStudent
}