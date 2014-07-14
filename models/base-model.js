// Generated by CoffeeScript 1.6.3
(function() {
  var BaseModel, EventEmitter, _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (window.zooniverse == null) {
    window.zooniverse = {};
  }

  if ((_base = window.zooniverse).models == null) {
    _base.models = {};
  }

  EventEmitter = window.zooniverse.EventEmitter || require('../lib/event-emitter');

  BaseModel = (function(_super) {
    __extends(BaseModel, _super);

    BaseModel.idCounter = -1;

    BaseModel.instances = null;

    BaseModel.count = function() {
      if (this.instances == null) {
        this.instances = [];
      }
      return this.instances.length;
    };

    BaseModel.first = function() {
      if (this.instances == null) {
        this.instances = [];
      }
      return this.instances[0];
    };

    BaseModel.find = function(id) {
      var instance, _i, _len, _ref;
      if (this.instances == null) {
        this.instances = [];
      }
      _ref = this.instances;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        instance = _ref[_i];
        if (instance.id === id) {
          return instance;
        }
      }
    };

    BaseModel.search = function(query) {
      var instance, miss, property, value, _i, _len, _ref, _results;
      if (this.instances == null) {
        this.instances = [];
      }
      _ref = this.instances;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        instance = _ref[_i];
        miss = false;
        for (property in query) {
          if (!__hasProp.call(query, property)) continue;
          value = query[property];
          if (instance[property] !== value) {
            miss = true;
            break;
          }
        }
        if (miss) {
          continue;
        }
        _results.push(instance);
      }
      return _results;
    };

    BaseModel.destroyAll = function() {
      var _results;
      _results = [];
      while (this.count() !== 0) {
        _results.push(this.first().destroy());
      }
      return _results;
    };

    BaseModel.prototype.id = null;

    function BaseModel(params) {
      var property, value, _base1;
      if (params == null) {
        params = {};
      }
      BaseModel.__super__.constructor.apply(this, arguments);
      for (property in params) {
        if (!__hasProp.call(params, property)) continue;
        value = params[property];
        this[property] = value;
      }
      this.constructor.idCounter += 1;
      if (this.id == null) {
        this.id = "C_" + this.constructor.idCounter;
      }
      if ((_base1 = this.constructor).instances == null) {
        _base1.instances = [];
      }
      this.constructor.instances.push(this);
    }

    BaseModel.prototype.destroy = function() {
      var i, instance, _i, _len, _ref, _ref1, _results;
      BaseModel.__super__.destroy.apply(this, arguments);
      _ref = this.constructor.instances;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        instance = _ref[i];
        if (!(instance === this)) {
          continue;
        }
        if ((_ref1 = this.constructor.instances) != null) {
          _ref1.splice(i, 1);
        }
        break;
      }
      return _results;
    };

    return BaseModel;

  })(EventEmitter);

  window.zooniverse.models.BaseModel = BaseModel;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = BaseModel;
  }

}).call(this);
