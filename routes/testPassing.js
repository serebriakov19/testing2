let express = require('express');
let router = express.Router();
let TestModel = require("../models/testModel");
let PassedTestModel = require('../models/passedTestModel');
let TeacherModel = require("../models/teacherModel");
let StudentModel = require("../models/studentModel");
const {v4: uuidv4} = require('uuid');
let getTime = require('../lib/time');

router.get('/:id', function (req, res, next) {
    console.log(req.session.role);
    if ((req.session.role !== 'student') && (req.session.role !== 'teacher')) {
        res.status(403).send('You should be logged in')
    } else {
        TestModel.findOne({id: req.params.id}, function (err, test) {
            if (err) {
                return next(err);
            }
            if (!test) {
                return res.sendStatus(404);
            }
            for (let question of test.questions) {
                for (let element of question.answers) {
                    element.correct = false;
                }
            }
            return res.render('testPassing', {
                title: "Pass the test",
                test: test,
                role: req.session.role
            });
        })
    }
});

router.post('/:id', function (req, res, next) {
    function arraysEqual(a, b) {
        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    TestModel.findOne({id: req.params.id}, function (err, test) {
        if (err) {
            return next(err);
        }

        if (!test) {
            return res.sendStatus(404);
        }

        let correctAnswers = [];

        for (let question of test.questions) {
            let oneQuestionAnswers = [];
            for (let element of question.answers) {
                oneQuestionAnswers.push(element.correct);
            }
            correctAnswers.push(oneQuestionAnswers);
        }

        // Add try catch and validation
        let answers = JSON.parse(req.body.data);
        console.log(answers);
        console.log(correctAnswers);
        let correct = 0;

        for (let i = 0; i < correctAnswers.length; i++) {
            if (arraysEqual(correctAnswers[i], answers[i])) {
                correct++;
            }
        }

        let mark = Math.round(correct / correctAnswers.length * 100) + '%';
        console.log(mark);

        let passedTest = new PassedTestModel({
            id: uuidv4(),
            subject: test.subject,
            name: test.name,
            answers: answers,
            student: {id: req.session.userId, name: req.session.name},
            date: {timestamp: Date.now(), normalDate: getTime(Date.now())},
            mark: mark,
            test: req.params.id,
            version: test.version
        });
        passedTest.save(function (err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                console.log(passedTest);
                StudentModel.updateOne({id: req.session.userId}, {$push: {passedTests: test.id}}, {useFindAndModify: true}, function (err) {
                    if (err) {
                        next(err);
                    } else {
                        res.send(mark);
                    }
                })
            }
        })
    })
})

module.exports = router;