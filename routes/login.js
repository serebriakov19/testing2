let express = require('express');
let router = express.Router();
let StudentModel = require("../models/studentModel");
let TeacherModel = require("../models/teacherModel");

router.get('/', function (req, res, next) {
    res.render('login', {title: 'Login'});
});

router.post('/', function (req, res, next) {
    function findUser(UserModel, role) {
        UserModel.findOne({login: req.body.login, password: req.body.password}, function (err, user) {
            if (err) {
                next(err);
            } else if (!user) {
                res.status(401).send("Incorrect login or password");
            } else {
                console.log(user);
                req.session.name = user.firstName + ' ' + user.lastName;
                req.session.userId = user.id;
                req.session.role = role;
                res.send(req.session.name);
            }
        })
    }

    if (req.body.role === 'teacher' && req.body.role === 'student') {
        res.sendStatus(500);
    } else if (req.body.role === 'teacher') {
        findUser(TeacherModel, 'teacher');
    } else if (req.body.role === 'student') {
        findUser(StudentModel, 'student');
    } else {
        res.sendStatus(401);
    }

})

module.exports = router;