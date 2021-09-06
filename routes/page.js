let express = require('express');
let router = express.Router();
let TestModel = require("../models/testModel");

router.get('/create', function (req, res, next) {
    if (req.session.role !== 'teacher') {
        res.status(403).send('You should log in as a teacher to create tests');
    } else {
        res.render('createTest', {title: 'Create your test'});
    }
});

router.get('/read/:id', function (req, res, next) {
    TestModel.findOne({id: req.params.id}, function (err, test) {
        if (err) {
            next(err);
        } else if (!test) {
            res.sendStatus(404).send("Test not found");
        } else if (test.author.id !== req.session.userId) {
            res.sendStatus(403);
        } else {
            res.render('readTest', {title: "Check your test", test: test});
        }
    })
});

router.get('/update/:id', function (req, res, next) {
    TestModel.findOne({id: req.params.id}, function (err, test) {
        if (err) {
            next(err);
        } else if (!test) {
            res.sendStatus(404).send("Test not found");
        } else if (test.author.id !== req.session.userId) {
            res.sendStatus(403);
        } else {
            res.render('updateTest', {title: "Update your test", test: test});
        }
    })
});

module.exports = router;
