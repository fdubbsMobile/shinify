var passport = require('passport');

exports.index = function (req, res) {
    res.render('index');
};

exports.login = [
    passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: 'login'})
];
