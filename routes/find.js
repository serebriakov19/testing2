let express = require('express');
let router = express.Router();
let TestModel = require('../models/testModel');

router.post('/', function (req, res, next) {
    TestModel.find({$or: [{name: {$regex: `${req.body.search}`}}, {subject: {$regex: `${req.body.search}`}}]}, function (err, tests) {
        if (err) {
            next(err);
        } else if (!tests) {
            res.sendStatus(403);
        } else {
            let newTests = [];
            for (test of tests) {
                if (test.version[1] === "Last") {
                    newTests.push(test);
                }
            }
            if (req.session.role === 'student') {
                res.render('studentPage', {
                    title: 'All tests (Last versions)',
                    testsList: newTests,
                    username: req.session.name
                });
            } else if (req.session.role === 'teacher') {
                res.render('teacherPage', {
                    title: 'All tests (Last versions)',
                    testsList: newTests,
                    username: req.session.name,
                    userId: req.session.userId
                });
            } else {
                res.sendStatus(403);
            }
        }
    })
})

module.exports = router;