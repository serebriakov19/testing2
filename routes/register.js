let express = require('express');
let router = express.Router();
let StudentModel = require("../models/studentModel");
let TeacherModel = require("../models/teacherModel");
const {v4: uuidv4} = require('uuid');


router.get('/', function (req, res, next) {
    res.render('register', {title: 'Register'});
});

router.post('/', function (req, res, next) {
    function createUser(UserModel, role) {
        let user = new UserModel({
            id: uuidv4(), firstName: req.body.firstName, lastName: req.body.lastName,
            login: req.body.login, password: req.body.password
        })
        user.save(function (err) {
            if (err) {
                if (err.message.includes('E11000 duplicate key error')) {
                    res.status(406).send('This login is already registered');
                } else {
                    res.status(500).send("You have not registered, please try again later");
                }
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
        createUser(TeacherModel, req.body.role);
    } else if (req.body.role === 'student') {
        createUser(StudentModel, req.body.role);
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;