let express = require('express');
let router = express.Router();
let TestModel = require("../models/testModel");
let PassedTestModel = require('../models/passedTestModel');
let StudentModel = require('../models/studentModel');

router.get('/:id', function (req, res, next) {
    if (req.session.role !== 'teacher') {
        res.status(403);
    } else {
        TestModel.findOne({id: req.params.id}, function (err, test) {
            if (err) {
                next(err);
            } else if (!test) {
                res.sendStatus(404);
            } else {
                PassedTestModel.find({test: test.id}, function(err, passedTests) {
                    if (err) {
                        next(err);
                    } else if (!passedTests) {
                        res.status(404).send("Nobody passed this test");
                    } else {
                        res.render('assessment', {title: 'Assessments', testsList: passedTests})
                    }
                })
            }
        })
    }
});

module.exports = router;