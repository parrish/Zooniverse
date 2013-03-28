// Generated by CoffeeScript 1.4.0
(function() {
  var BaseController, SignupForm, User, enUs, _base, _base1, _ref, _ref1, _ref2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.zooniverse) == null) {
    window.zooniverse = {};
  }

  if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
    _base.controllers = {};
  }

  if ((_ref2 = (_base1 = window.zooniverse).models) == null) {
    _base1.models = {};
  }

  BaseController = zooniverse.controllers.BaseController || require('./base-controller');

  User = zooniverse.models.User || require('../models/user');

  enUs = zooniverse.enUs || require('../lib/en-us');

  SignupForm = (function(_super) {

    __extends(SignupForm, _super);

    function SignupForm() {
      return SignupForm.__super__.constructor.apply(this, arguments);
    }

    SignupForm.prototype.tagName = 'form';

    SignupForm.prototype.className = 'zooniverse-signup-form';

    SignupForm.prototype.events = {
      'submit*': 'onSubmit'
    };

    SignupForm.prototype.elements = {
      'input[name="username"]': 'usernameInput',
      'input[name="password"]': 'passwordInput',
      'input[name="email"]': 'emailInput',
      'input[name="real-name"]': 'realNameInput',
      'button[type="submit"]': 'signUpButton',
      '.error-message': 'errorContainer'
    };

    SignupForm.prototype.onSubmit = function() {
      var signup,
        _this = this;
      this.el.addClass('loading');
      this.signUpButton.attr({
        disabled: true
      });
      signup = User.signup({
        username: this.usernameInput.val(),
        password: this.passwordInput.val(),
        email: this.emailInput.val(),
        real_name: this.realNameInput.val()
      });
      signup.done(function(_arg) {
        var message, success;
        success = _arg.success, message = _arg.message;
        if (!success) {
          return _this.showError(message);
        }
      });
      signup.fail(function() {
        return _this.showError(enUs.user.signInFailed);
      });
      return signup.always(function() {
        _this.el.removeClass('loading');
        return _this.signUpButton.attr({
          disabled: false
        });
      });
    };

    SignupForm.prototype.showError = function(message) {
      return this.errorContainer.html(message);
    };

    return SignupForm;

  })(BaseController);

  window.zooniverse.controllers.SignupForm = SignupForm;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = SignupForm;
  }

}).call(this);