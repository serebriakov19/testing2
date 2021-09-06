let express = require('express');
let router = express.Router();
let StudentModel = require("../models/studentModel");
let TeacherModel = require("../models/teacherModel");


router.get('/', function (req, res, next) {
    function findUser(UserModel, role) {
        UserModel.findOne({id: req.session.userId}, function (err, user) {
            if (err) {
                next(err);
            } else if (!user) {
                res.sendStatus(404);
            } else {
                console.log(user);
                res.render('profile', {title: 'Your profile', user: user, role: role});
            }
        })
    }


    if (req.session.role === 'teacher') {
        findUser(TeacherModel, req.session.role);
    } else if (req.session.role === 'student') {
        findUser(StudentModel, req.session.role);
    } else {
        res.sendStatus(404);
    }
});

router.post('/', function (req, res, next) {
    function updateUser(UserModel) {
        UserModel.updateOne({id: req.session.userId}, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            login: req.body.login,
            password: req.body.password
        }, {useFindAndModify: true}, function (err) {
            if (err) {
                next(err);
            } else {
                req.session.name = req.body.firstName + ' ' + req.body.lastName;
                res.sendStatus(200);
            }
        })
    }


    if (req.session.role === 'teacher') {
        updateUser(TeacherModel);
    } else if (req.session.role === 'student') {
        updateUser(StudentModel);
    } else {
        res.sendStatus(404);
    }

});

module.exports = router;