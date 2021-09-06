let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.role === 'student') {
        res.redirect('/studentPage');
    } else if (req.session.role === 'teacher') {
        res.redirect('/teacherPage');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
