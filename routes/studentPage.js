let express = require('express');
let router = express.Router();
let TestModel = require("../models/testModel");
let PassedTestModel = require('../models/passedTestModel');

router.get('/', function (req, res, next) {
    if (req.session.role !== 'student') {
        res.status(403).send('You should log in as a student');
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
                res.render('studentPage', {
                    title: 'All tests (last versions)',
                    testsList: newTests,
                    username: req.session.name,
                    original: true
                });
            }
        })
    }
});

router.get('/passedTests', function (req, res, next) {
    if (req.session.role !== 'student') {
        res.status(403).send('You should log in as a student')
    } else {
        PassedTestModel.find({'student.id': req.session.userId}, function (err, tests) {
            if (err) {
                next(err);
            } else {
                res.render('studentPage', {
                    title: 'Passed tests',
                    testsList: tests,
                    username: req.session.name,
                    original: false
                });
            }
        })
    }
});

module.exports = router;