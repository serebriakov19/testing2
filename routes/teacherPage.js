let express = require('express');
let router = express.Router();
let TestModel = require("../models/testModel");

router.get('/', function (req, res, next) {
    if (req.session.role !== 'teacher') {
        res.status(403).send('You should log in as a teacher');
    } else {
        TestModel.find({}, function (err, tests) {
            if (err) {
                next(err);
            } else {
                let newTests = [];
                for (test of tests) {
                    if (test.version[1] === "Last") {
                        newTests.push(test);
                    }
                }
                res.render('teacherPage', {
                    title: 'All tests (last versions)',
                    testsList: newTests,
                    username: req.session.name,
                    userId: req.session.userId
                });
            }
        })
    }
});

router.get('/createdTests', function (req, res, next) {
    if (req.session.role !== 'teacher') {
        res.status(403).send('You should log in as a student')
    } else {
        TestModel.find({'author.id': req.session.userId}, function (err, tests) {
            if (err) {
                next(err);
            } else {
                res.render('teacherPage', {
                    title: 'Created tests',
                    testsList: tests,
                    username: req.session.name,
                    userId: req.session.userId
                });
            }
        })
    }
});

module.exports = router;