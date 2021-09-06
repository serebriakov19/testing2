let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    delete req.session.role;
    delete req.session.name;
    delete req.session.userId;
    res.redirect('/');
})

module.exports = router;