var passport = require('passport');
var config = require('../config');
var db = require('../' + config.db.type);
var sendMailUtils = require('../utils/send-mail');



function JoinVerifyResult () {
  this.error = false;
  this.nameErr = null;
  this.emailErr = null;
  this.passwordErr = null;
};

function checkUserName(username, done) {

  if (username === "") {
    console.log("Username must not be blank!");
    return done("Username must not be blank!");
  }

  var pattern = /^([a-zA-Z])([a-zA-Z0-9-])+/;
  if (!pattern.test(username)) {
    console.log("Username may only contain alphanumeric characters or dashes(-) and cannot begin with a dash!");
    return done("Username may only contain alphanumeric characters or dashes(-) and cannot begin with a dash!");
  }

  if (db.developers.checkUserNameExist(username)) {
    console.log("Username is already taken!");
    return done("Username is already taken!");
  }

  return done(null);
};

function checkEmail(email, done) {

  if (email === "") {
    console.log("Email must not be empty!");
    return done("Email must not be empty!");
  }

  var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
  if (!pattern.test(email)) {
    console.log("Email is invalid!");
    return done("Email is invalid");
  }

  if (db.developers.checkEmailExist(email)) {
    console.log("Email is already exist!");
    return done("Email is already exist!");
  }

  return done(null);
};


function checkPassword(passwd, verifyPasswd, source, done) {
  if (passwd === "") {
    console.log("Password must not be empty!");
    return done("Password must not be empty!");
  }

  var lowercaseLetterPattern = /[a-z]/;
  var numberPattern = /[0-9]/;
  if (passwd.length < 8 ) {
    if (!lowercaseLetterPattern.test(passwd)) {
      console.log("Password is too short (minimum is 7 characters) and needs at least one lowercase letter!");
      return done("Password is too short (minimum is 7 characters) and needs at least one lowercase letter!");
    } else if (!numberPattern.test(passwd)) {
      console.log("Password is too short (minimum is 7 characters) and needs at least one number!");
      return done("Password is too short (minimum is 7 characters) and needs at least one number!");
    } else {
      console.log("Password is too short (minimum is 7 characters)!");
      return done("Password is too short (minimum is 7 characters)!");
    }
  } else  {
    if (!lowercaseLetterPattern.test(passwd)) {
      console.log("Password needs at least one lowercase letter!");
      return done("Password needs at least one lowercase letter!");
    } else if (!numberPattern.test(passwd)) {
      console.log("Password needs at least one number!");
      return done("Password needs at least one number!");
    }
  }

  // if the request is from Detail page, then check confirmation password
  // otherwise, bypass this check
  if (source === "Detail") {
    if (verifyPasswd != passwd) {
      console.log("Password doesn't match the confirmation!");
      return done("Password doesn't match the confirmation!");
    }
  }


  return done(null);

};

function ApplicationVerifyResult () {
  this.error = false;
  this.nameErr = null;
  this.urlErr = null;
  this.callbackErr = null;
};

function checkAppName(name, done) {

  if (name === "") {
    console.log("Application name must not be blank!");
    return done("Application name must not be blank!");
  }

  return done(null);
};

function checkAppUrl(url, done) {

  if (url === "") {
    console.log("Homepage URL must not be blank!");
    return done("Homepage URL must not be blank!");
  }

  var pattern = /^htt(p|ps):\/\/([a-zA-Z0-9-_.\/])+/;
  if (!pattern.test(url)) {
    console.log("Homepage URL is invalid and must start with http:// or https:// !");
    return done("Homepage URL is invalid and must start with http:// or https:// !");
  }

  return done(null);
};

function checkAppCallback(callback, done) {

  if (callback === "") {
    console.log("Callback Url must not be blank!");
    return done("Callback Url must not be blank!");
  }

  var pattern = /^htt(p|ps):\/\/([a-zA-Z0-9-_.\/])+/;
  if (!pattern.test(callback)) {
    console.log("Callback Url is invalid and must start with http:// or https:// !");
    return done("Callback Url is invalid and must start with http:// or https:// !");
  }

  return done(null);
};
