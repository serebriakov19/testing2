let express = require('express');
let router = express.Router();
const {v4: uuidv4} = require('uuid');
let TestModel = require("../models/testModel");
let TeacherModel = require("../models/teacherModel");
let validation = require('../lib/validation');

router.post('/', function (req, res, next) {
    console.log(req.body.data);
    let data = JSON.parse(req.body.data);
    if (!validation(data)) {
        res.status(400).send('Test is not valid');
    } else {
        let test = new TestModel({
            id: uuidv4(), name: data.name, subject: data.subject,
            questions: data.questions, author: {id: req.session.userId, name: req.session.name}, date: Date.now(), version: [1, "Last"]
        });
        test.save(function (err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                console.log(test);
                res.sendStatus(200);     // do it normal
                TeacherModel.updateOne({id: req.session.userId}, {$push: { createdTests: test.id } }, {useFindAndModify: true}, function (err) {
                    if (err) {
                        next(err);
                    }
                })
            }
        })
    }
})

router.get('/:id', function (req, res, next) {
    TestModel.findOne({id: req.params.id}, function (err, test) {
        if (err) {
            return next(err);
        }
        if (!test) {
            return res.sendStatus(404);
        }
        return res.send(test);
    })
});

router.get('/update/:id', function (req, res, next) {
    console.log(req.query.data);
    let data = JSON.parse(req.query.data);
    if (!validation(data)) {
        res.status(400).send('Test is not valid');
    } else {
        TestModel.findOne({id: req.params.id}, function (err, oldTest) {
            if (err) {
                next(err);
            } else if (!oldTest) {
                res.status(404).send("Test not found");
            } else {
                let oldVersion = oldTest.version[0];
                TestModel.updateOne(oldTest, {version: [oldVersion, "Old"]}, {useFindAndModify: true}, function (err) {
                    if (err) {
                        res.status(404).send("Test not found");
                    } else {
                        let test = new TestModel( {
                            id: uuidv4(),
                            name: data.name,
                            subject: data.subject,
                            questions: data.questions,
                            author: {id: req.session.userId, name: req.session.name},
                            date: Date.now(),
                            version: [oldTest.version[0] + 1, "Last"]
                        });
                        test.save(function (err) {
                            if (err) {
                                console.log(err);
                                next(err);
                            } else {
                                console.log(test);
                                res.sendStatus(200);    // do it normal
                                TeacherModel.updateOne({id: req.session.userId}, {$push: { createdTests: test.id } }, {useFindAndModify: true}, function (err) {
                                    if (err) {
                                        next(err);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

    }
});

router.get('/delete/:id', function (req, res, next) {
    TestModel.findOne({id: req.params.id}, function (err, test) {
        if (err) {
            next(err);
        } else if (!test) {
            res.status(404).send('Test not found');
        } else if (test.author.id !== req.session.userId) {
            res.status(403).send('You have no access to this test');
        } else {
            TestModel.deleteOne(test, function (err) {
                if (err) {
                    next(err);
                } else {
                    TeacherModel.updateOne({id: req.session.userId}, {$pull: { createdTests: test.id } }, {useFindAndModify: true}, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            res.redirect('/');
                        }
                    })
                }
            })
        }
    })
});

module.exports = router;
