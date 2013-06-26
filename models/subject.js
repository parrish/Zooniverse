// Generated by CoffeeScript 1.4.0
(function() {
  var $, Api, BaseModel, Subject, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.zooniverse) == null) {
    window.zooniverse = {};
  }

  if ((_ref1 = (_base = window.zooniverse).models) == null) {
    _base.models = {};
  }

  BaseModel = zooniverse.models.BaseModel || require('./base-model');

  Api = zooniverse.Api || require('../lib/api');

  $ = window.jQuery;

  Subject = (function(_super) {

    __extends(Subject, _super);

    Subject.current = null;

    Subject.queueLength = 5;

    Subject.group = false;

    Subject.fallback = "./offline/subjects.json";

    Subject.path = function() {
      var groupString;
      groupString = !this.group ? '' : this.group === true ? 'groups/' : "groups/" + this.group + "/";
      return "/projects/" + Api.current.project + "/" + groupString + "subjects";
    };

    Subject.next = function(done, fail) {
      var fetcher, nexter, _ref2,
        _this = this;
      this.trigger('get-next');
      if ((_ref2 = this.current) != null) {
        _ref2.destroy();
      }
      this.current = null;
      nexter = new $.Deferred;
      nexter.then(done, fail);
      if (this.count() === 0) {
        fetcher = this.fetch();
        fetcher.done(function(newSubjects) {
          var _ref3;
          if ((_ref3 = _this.first()) != null) {
            _ref3.select();
          }
          if (_this.current) {
            return nexter.resolve(_this.current);
          } else {
            _this.trigger('no-more');
            return nexter.reject.apply(nexter, arguments);
          }
        });
        fetcher.fail(function() {
          return nexter.reject.apply(nexter, arguments);
        });
      } else {
        this.first().select();
        nexter.resolve(this.current);
        if (this.count() < this.queueLength) {
          this.fetch();
        }
      }
      return nexter.promise();
    };

    Subject.fetch = function(params, done, fail) {
      var fetcher, limit, request, _ref2,
        _this = this;
      if (typeof params === 'function') {
        _ref2 = [params, done, {}], done = _ref2[0], fail = _ref2[1], params = _ref2[2];
      }
      limit = (params || {}).limit;
      if (limit == null) {
        limit = this.queueLength - this.count();
      }
      fetcher = new $.Deferred;
      fetcher.then(done, fail);
      if (limit > 0) {
        request = Api.current.get(this.path(), {
          limit: limit
        });
        request.done(function(rawSubjects) {
          var newSubjects, rawSubject;
          newSubjects = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = rawSubjects.length; _i < _len; _i++) {
              rawSubject = rawSubjects[_i];
              _results.push(new this(rawSubject));
            }
            return _results;
          }).call(_this);
          _this.trigger('fetch', [newSubjects]);
          return fetcher.resolve(newSubjects);
        });
        request.fail(function() {
          var getFallback;
          _this.trigger('fetching-fallback');
          getFallback = $.get(_this.fallback);
          getFallback.done(function(rawSubjects) {
            var newSubjects, rawGroupSubjects, rawSubject, _i, _len;
            if (_this.group) {
              rawGroupSubjects = [];
              for (_i = 0, _len = rawSubjects.length; _i < _len; _i++) {
                rawSubject = rawSubjects[_i];
                if (rawSubject.group_id === _this.group) {
                  rawGroupSubjects.push(rawSubject);
                }
              }
              rawSubjects = rawGroupSubjects;
            }
            rawSubjects.sort(function() {
              return Math.random() - 0.5;
            });
            newSubjects = (function() {
              var _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = rawSubjects.length; _j < _len1; _j++) {
                rawSubject = rawSubjects[_j];
                _results.push(new this(rawSubject));
              }
              return _results;
            }).call(_this);
            _this.trigger('fetch', [newSubjects]);
            return fetcher.resolve(newSubjects);
          });
          return getFallback.fail(function() {
            _this.trigger('fetch-fail');
            return fetcher.fail.apply(fetcher, arguments);
          });
        });
      } else {
        fetcher.resolve(this.instances.slice(0, number));
      }
      return fetcher.promise();
    };

    Subject.prototype.id = '';

    Subject.prototype.zooniverse_id = '';

    Subject.prototype.coords = null;

    Subject.prototype.location = null;

    Subject.prototype.metadata = null;

    Subject.prototype.project_id = '';

    Subject.prototype.group_id = '';

    Subject.prototype.workflow_ids = null;

    Subject.prototype.tutorial = null;

    function Subject() {
      var _ref2, _ref3, _ref4, _ref5;
      Subject.__super__.constructor.apply(this, arguments);
      if ((_ref2 = this.location) == null) {
        this.location = {};
      }
      if ((_ref3 = this.coords) == null) {
        this.coords = [];
      }
      if ((_ref4 = this.metadata) == null) {
        this.metadata = {};
      }
      if ((_ref5 = this.workflow_ids) == null) {
        this.workflow_ids = [];
      }
      this.preloadImages();
    }

    Subject.prototype.preloadImages = function() {
      var imageSources, src, type, _ref2, _results;
      _ref2 = this.location;
      _results = [];
      for (type in _ref2) {
        imageSources = _ref2[type];
        if (!(imageSources instanceof Array)) {
          imageSources = [imageSources];
        }
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = imageSources.length; _i < _len; _i++) {
            src = imageSources[_i];
            _results1.push((new Image).src = src);
          }
          return _results1;
        })());
      }
      return _results;
    };

    Subject.prototype.select = function() {
      this.constructor.current = this;
      return this.trigger('select');
    };

    Subject.prototype.destroy = function() {
      if (this.constructor.current === this) {
        this.constructor.current = null;
      }
      return Subject.__super__.destroy.apply(this, arguments);
    };

    Subject.prototype.talkHref = function() {
      var domain;
      domain = this.domain || location.hostname.replace(/^www\./, '');
      return "http://talk." + domain + "/#/subjects/" + this.zooniverse_id;
    };

    Subject.prototype.socialImage = function() {
      var image;
      image = this.location.standard instanceof Array ? this.location.standard[Math.floor(this.location.standard.length / 2)] : this.location.standard;
      return $("<a href='" + image + "'></a>").get(0).href;
    };

    Subject.prototype.socialTitle = function() {
      return 'Zooniverse classification';
    };

    Subject.prototype.socialMessage = function() {
      return 'Classifying on the Zooniverse!';
    };

    Subject.prototype.facebookHref = function() {
      return ("https://www.facebook.com/sharer/sharer.php\n?s=100\n&p[url]=" + (encodeURIComponent(this.talkHref())) + "\n&p[title]=" + (encodeURIComponent(this.socialTitle())) + "\n&p[summary]=" + (encodeURIComponent(this.socialMessage())) + "\n&p[images][0]=" + (this.socialMessage())).replace('\n', '', 'g');
    };

    Subject.prototype.twitterHref = function() {
      var status;
      status = "" + (this.socialMessage()) + " " + (this.talkHref());
      return "http://twitter.com/home?status=" + (encodeURIComponent(status));
    };

    Subject.prototype.pinterestHref = function() {
      return ("http://pinterest.com/pin/create/button/\n?url=" + (encodeURIComponent(this.talkHref())) + "\n&media=" + (encodeURIComponent(this.socialImage())) + "\n&description=" + (encodeURIComponent(this.socialMessage()))).replace('\n', '', 'g');
    };

    return Subject;

  })(BaseModel);

  window.zooniverse.models.Subject = Subject;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Subject;
  }

}).call(this);
